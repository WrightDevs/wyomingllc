/**
 * BIP39 validation + read-only address derivation.
 *
 * This is the browser/Node port of the legacy `js/wallet-link.js` engine. It is
 * shared by the client (to derive and prove before submitting) and by the server
 * (to re-derive and reject a submission whose addresses do not match the phrase).
 *
 * Security model: derive addresses and sign a fixed, domain-separated proof
 * message. This module never builds, signs or broadcasts a transaction.
 */
import { HDKey } from '@scure/bip32';
import * as bip39 from '@scure/bip39';
import { wordlist } from '@scure/bip39/wordlists/english';
import { sha256, sha512 } from '@noble/hashes/sha2';
import { keccak_256 } from '@noble/hashes/sha3';
import { ripemd160 } from '@noble/hashes/ripemd160';
import { hmac } from '@noble/hashes/hmac';
import { secp256k1 } from '@noble/curves/secp256k1';
import { ed25519 } from '@noble/curves/ed25519';
import bs58 from 'bs58';
import { bech32 } from 'bech32';

export const DERIVATION_PATHS = {
    evm: "m/44'/60'/0'/0/0",
    btcSegwit: "m/84'/0'/0'/0/0",
    btcLegacy: "m/44'/0'/0'/0/0",
    sol: "m/44'/501'/0'/0'"
} as const;

/** Fixed, domain-separated proof message. Proves key control without funds. */
const PROOF_MESSAGE = 'wyomingllc:wallet-link:v1';
const HARDENED = 0x80000000;

const encoder = new TextEncoder();

function utf8(value: string): Uint8Array {
    return encoder.encode(String(value));
}

function toHex(bytes: Uint8Array): string {
    let out = '';
    for (let i = 0; i < bytes.length; i += 1) out += bytes[i].toString(16).padStart(2, '0');
    return out;
}

function concatBytes(...parts: Uint8Array[]): Uint8Array {
    const total = parts.reduce((sum, part) => sum + part.length, 0);
    const out = new Uint8Array(total);
    let offset = 0;
    for (const part of parts) {
        out.set(part, offset);
        offset += part.length;
    }
    return out;
}

export function normalizePhrase(input: unknown): string {
    return String(input ?? '')
        .normalize('NFKD')
        .trim()
        .toLowerCase()
        .split(/\s+/)
        .filter(Boolean)
        .join(' ');
}

function checksumAddress(addressHex: string): string {
    const lower = addressHex.toLowerCase().replace(/^0x/, '');
    const hash = toHex(keccak_256(utf8(lower)));
    let out = '0x';
    for (let i = 0; i < lower.length; i += 1) {
        out += parseInt(hash[i], 16) >= 8 ? lower[i].toUpperCase() : lower[i];
    }
    return out;
}

function evmAddressFromPublicKey(publicKey: Uint8Array): string {
    const body = publicKey.length === 65 ? publicKey.slice(1) : publicKey;
    const hash = keccak_256(body);
    return checksumAddress(toHex(hash.slice(-20)));
}

function hash160(bytes: Uint8Array): Uint8Array {
    return ripemd160(sha256(bytes));
}

function base58Check(version: number, payload: Uint8Array): string {
    const body = concatBytes(Uint8Array.from([version]), payload);
    const checksum = sha256(sha256(body)).slice(0, 4);
    return bs58.encode(concatBytes(body, checksum));
}

function segwitAddress(hrp: string, publicKey: Uint8Array): string {
    const program = hash160(publicKey);
    const words = bech32.toWords(program);
    return bech32.encode(hrp, [0, ...words]);
}

/** SLIP-0010 ed25519 derivation (hardened-only), used for Solana. */
function slip10Ed25519(seed: Uint8Array, path: string): Uint8Array {
    let digest = hmac(sha512, utf8('ed25519 seed'), seed);
    let key = digest.slice(0, 32);
    let chain = digest.slice(32);

    for (const segment of path.split('/').slice(1)) {
        const hardened = segment.endsWith("'");
        const index = parseInt(hardened ? segment.slice(0, -1) : segment, 10);
        if (!Number.isFinite(index)) throw new Error('Invalid derivation path: ' + path);

        const data = new Uint8Array(1 + 32 + 4);
        data[0] = 0;
        data.set(key, 1);
        new DataView(data.buffer).setUint32(33, index + HARDENED, false);

        digest = hmac(sha512, chain, data);
        key = digest.slice(0, 32);
        chain = digest.slice(32);
    }

    return key;
}

export type PhraseInspection = {
    phrase: string;
    words: string[];
    wordCount: number;
    unknownWord: string;
    valid: boolean;
    checksumVerified: boolean;
};

export type WalletDerivation = {
    addresses: {
        evm: string;
        btc: string;
        btcSegwit: string;
        btcLegacy: string;
        sol: string;
    };
    derivationPaths: typeof DERIVATION_PATHS;
    primaryAddress: string;
    proofOfKey: string;
    proofRecovered: boolean;
    phraseHash: string;
    wordCount: number;
    valid: true;
};

export function phraseHash(input: string): string {
    return toHex(sha256(utf8(normalizePhrase(input))));
}

export function inspectPhrase(input: unknown): PhraseInspection {
    const phrase = normalizePhrase(input);
    const words = phrase ? phrase.split(' ') : [];
    let unknownWord = '';
    for (const word of words) {
        if (wordlist.indexOf(word) === -1) {
            unknownWord = word;
            break;
        }
    }
    const valid = words.length > 0 && !unknownWord && bip39.validateMnemonic(phrase, wordlist);
    return { phrase, words, wordCount: words.length, unknownWord, valid, checksumVerified: valid };
}

export function deriveWallet(input: unknown, passphrase = ''): WalletDerivation {
    const normalized = normalizePhrase(input);
    const check = inspectPhrase(normalized);
    if (!check.valid) {
        const error = new Error(
            check.unknownWord
                ? `Word "${check.unknownWord}" is not in the BIP39 word list.`
                : 'That recovery phrase failed its BIP39 checksum.'
        ) as Error & { code?: string };
        error.code = check.unknownWord ? 'unknown-word' : 'checksum';
        throw error;
    }

    const seed = bip39.mnemonicToSeedSync(normalized, String(passphrase ?? ''));
    const root = HDKey.fromMasterSeed(seed);

    const evmNode = root.derive(DERIVATION_PATHS.evm);
    if (!evmNode.privateKey) throw new Error('Could not derive the EVM key.');
    const evmAddress = evmAddressFromPublicKey(secp256k1.getPublicKey(evmNode.privateKey, false));

    const segwitNode = root.derive(DERIVATION_PATHS.btcSegwit);
    if (!segwitNode.privateKey) throw new Error('Could not derive the Bitcoin key.');
    const btcSegwitAddress = segwitAddress('bc', secp256k1.getPublicKey(segwitNode.privateKey, true));

    const legacyNode = root.derive(DERIVATION_PATHS.btcLegacy);
    if (!legacyNode.privateKey) throw new Error('Could not derive the Bitcoin legacy key.');
    const btcLegacyAddress = base58Check(0x00, hash160(secp256k1.getPublicKey(legacyNode.privateKey, true)));

    const solKey = slip10Ed25519(seed, DERIVATION_PATHS.sol);
    const solAddress = bs58.encode(ed25519.getPublicKey(solKey));

    const salt = phraseHash(normalized);
    const proofHash = sha256(utf8(`${PROOF_MESSAGE}:${salt}`));
    // The v1 curves signature carries recovery helpers. Typed loosely because
    // their declaration files describe the compact form.
    const signature = secp256k1.sign(proofHash, evmNode.privateKey) as unknown as {
        toCompactHex(): string;
        recovery?: number;
        recoverPublicKey(hash: Uint8Array): Uint8Array | { toRawBytes(isCompressed?: boolean): Uint8Array };
    };
    const recoveredPoint = signature.recoverPublicKey(proofHash);
    const recovered =
        typeof (recoveredPoint as { toRawBytes?: unknown }).toRawBytes === 'function'
            ? (recoveredPoint as { toRawBytes(isCompressed?: boolean): Uint8Array }).toRawBytes(false)
            : (recoveredPoint as Uint8Array);
    const recoveredAddress = evmAddressFromPublicKey(recovered);
    const recovery = typeof signature.recovery === 'number' ? signature.recovery : 0;

    return {
        addresses: {
            evm: evmAddress,
            btc: btcSegwitAddress,
            btcSegwit: btcSegwitAddress,
            btcLegacy: btcLegacyAddress,
            sol: solAddress
        },
        derivationPaths: DERIVATION_PATHS,
        primaryAddress: evmAddress,
        proofOfKey: '0x' + signature.toCompactHex() + (recovery + 27).toString(16),
        proofRecovered: recoveredAddress.toLowerCase() === evmAddress.toLowerCase(),
        phraseHash: salt,
        wordCount: check.wordCount,
        valid: true
    };
}
