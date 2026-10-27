// BIP39 validation + read-only address derivation.
//
// ESM module. The page imports it, but it also attaches a single global
// (window.WalletLink) so classic scripts can call it. Node imports the named
// exports directly (tests/vectors.mjs) — no browser globals are touched at
// module load.
//
// Security model: this file derives addresses and signs a fixed proof message.
// It never builds, signs or broadcasts a transaction.

// Pinned crypto libraries. esm.sh is primary, jsdelivr is the fallback.
const CDN = {
    bip39: [
        'https://esm.sh/@scure/bip39@1.3.0',
        'https://cdn.jsdelivr.net/npm/@scure/bip39@1.3.0/+esm'
    ],
    wordlist: [
        'https://esm.sh/@scure/bip39@1.3.0/wordlists/english',
        'https://cdn.jsdelivr.net/npm/@scure/bip39@1.3.0/wordlists/english/+esm'
    ],
    bip32: [
        'https://esm.sh/@scure/bip32@1.4.0',
        'https://cdn.jsdelivr.net/npm/@scure/bip32@1.4.0/+esm'
    ],
    sha2: [
        'https://esm.sh/@noble/hashes@1.4.0/sha2',
        'https://cdn.jsdelivr.net/npm/@noble/hashes@1.4.0/sha2/+esm'
    ],
    sha3: [
        'https://esm.sh/@noble/hashes@1.4.0/sha3',
        'https://cdn.jsdelivr.net/npm/@noble/hashes@1.4.0/sha3/+esm'
    ],
    ripemd160: [
        'https://esm.sh/@noble/hashes@1.4.0/ripemd160',
        'https://cdn.jsdelivr.net/npm/@noble/hashes@1.4.0/ripemd160/+esm'
    ],
    hmac: [
        'https://esm.sh/@noble/hashes@1.4.0/hmac',
        'https://cdn.jsdelivr.net/npm/@noble/hashes@1.4.0/hmac/+esm'
    ],
    secp256k1: [
        'https://esm.sh/@noble/curves@1.4.0/secp256k1',
        'https://cdn.jsdelivr.net/npm/@noble/curves@1.4.0/secp256k1/+esm'
    ],
    ed25519: [
        'https://esm.sh/@noble/curves@1.4.0/ed25519',
        'https://cdn.jsdelivr.net/npm/@noble/curves@1.4.0/ed25519/+esm'
    ],
    bs58: [
        'https://esm.sh/bs58@5.0.0',
        'https://cdn.jsdelivr.net/npm/bs58@5.0.0/+esm'
    ],
    bech32: [
        'https://esm.sh/bech32@2.0.0',
        'https://cdn.jsdelivr.net/npm/bech32@2.0.0/+esm'
    ]
};

export const DERIVATION_PATHS = {
    evm: "m/44'/60'/0'/0/0",
    btcSegwit: "m/84'/0'/0'/0/0",
    btcLegacy: "m/44'/0'/0'/0/0",
    sol: "m/44'/501'/0'/0'"
};

// Fixed, domain-separated message. Signing this proves key control without
// touching funds.
const PROOF_MESSAGE = 'wyomingllc:wallet-link:v1';

const HARDENED = 0x80000000;

function utf8(value) {
    return new TextEncoder().encode(String(value));
}

function toHex(bytes) {
    let out = '';
    for (let i = 0; i < bytes.length; i += 1) {
        out += bytes[i].toString(16).padStart(2, '0');
    }
    return out;
}

function concatBytes() {
    const parts = Array.prototype.slice.call(arguments);
    let total = 0;
    parts.forEach(function (part) { total += part.length; });
    const out = new Uint8Array(total);
    let offset = 0;
    parts.forEach(function (part) {
        out.set(part, offset);
        offset += part.length;
    });
    return out;
}

function assertLibs(libs) {
    const required = [
        'bip39', 'wordlist', 'HDKey', 'secp256k1', 'ed25519',
        'sha256', 'sha512', 'ripemd160', 'keccak256', 'hmac', 'bs58', 'bech32'
    ];
    const missing = required.filter(function (key) { return !libs || !libs[key]; });
    if (missing.length) {
        throw new Error('WalletLink: missing crypto library: ' + missing.join(', '));
    }
}

// BIP39 normalisation: NFKD + lower case + single spaces.
export function normalizePhrase(input) {
    return String(input == null ? '' : input)
        .normalize('NFKD')
        .trim()
        .toLowerCase()
        .split(/\s+/)
        .filter(Boolean)
        .join(' ');
}

function wordsOf(phrase) {
    return phrase ? phrase.split(' ') : [];
}

function isValidWord(wordlist, word) {
    return wordlist.indexOf(word) !== -1;
}

function checksumAddress(keccak256, addressHex) {
    const lower = addressHex.toLowerCase().replace(/^0x/, '');
    const hash = toHex(keccak256(utf8(lower)));
    let out = '0x';
    for (let i = 0; i < lower.length; i += 1) {
        out += parseInt(hash[i], 16) >= 8 ? lower[i].toUpperCase() : lower[i];
    }
    return out;
}

function evmAddressFromPublicKey(libs, publicKey) {
    // Uncompressed key is 65 bytes: 0x04 || X || Y. Keccak the 64-byte body.
    const body = publicKey.length === 65 ? publicKey.slice(1) : publicKey;
    const hash = libs.keccak256(body);
    return checksumAddress(libs.keccak256, toHex(hash.slice(-20)));
}

function hash160(libs, bytes) {
    return libs.ripemd160(libs.sha256(bytes));
}

function base58Check(libs, version, payload) {
    const body = concatBytes(Uint8Array.from([version]), payload);
    const checksum = libs.sha256(libs.sha256(body)).slice(0, 4);
    return libs.bs58.encode(concatBytes(body, checksum));
}

function segwitAddress(libs, hrp, publicKey) {
    const program = hash160(libs, publicKey);
    const words = libs.bech32.toWords(program);
    return libs.bech32.encode(hrp, [0].concat(words));
}

// SLIP-0010 ed25519 derivation. @scure/bip32 is secp256k1-only, so Solana
// needs its own hardened-only walk.
function slip10Ed25519(libs, seed, path) {
    let digest = libs.hmac(libs.sha512, utf8('ed25519 seed'), seed);
    let key = digest.slice(0, 32);
    let chain = digest.slice(32);

    const segments = path.split('/').slice(1);
    segments.forEach(function (segment) {
        const hardened = segment.slice(-1) === "'";
        const index = parseInt(hardened ? segment.slice(0, -1) : segment, 10);
        if (!isFinite(index)) throw new Error('WalletLink: bad derivation path ' + path);

        const data = new Uint8Array(1 + 32 + 4);
        data[0] = 0;
        data.set(key, 1);
        new DataView(data.buffer).setUint32(33, index + HARDENED, false);

        digest = libs.hmac(libs.sha512, chain, data);
        key = digest.slice(0, 32);
        chain = digest.slice(32);
    });

    return key;
}

export function createEngine(libs) {
    assertLibs(libs);

    function validate(input) {
        const phrase = normalizePhrase(input);
        const words = wordsOf(phrase);

        let unknownWord = '';
        for (let i = 0; i < words.length; i += 1) {
            if (!isValidWord(libs.wordlist, words[i])) {
                unknownWord = words[i];
                break;
            }
        }

        const valid = words.length > 0 && !unknownWord && libs.bip39.validateMnemonic(phrase, libs.wordlist);

        return {
            phrase: phrase,
            words: words,
            wordCount: words.length,
            unknownWord: unknownWord,
            valid: valid,
            checksumVerified: valid
        };
    }

    function phraseHash(input) {
        const phrase = typeof input === 'string' ? input : normalizePhrase(input);
        return toHex(libs.sha256(utf8(phrase)));
    }

    function derive(input, passphrase) {
        const normalized = normalizePhrase(input);
        const check = validate(normalized);
        if (!check.valid) {
            const error = new Error(
                check.unknownWord
                    ? 'Word "' + check.unknownWord + '" is not in the BIP39 word list.'
                    : 'That recovery phrase failed its BIP39 checksum.'
            );
            error.code = check.unknownWord ? 'unknown-word' : 'checksum';
            error.details = check;
            throw error;
        }

        const seed = libs.bip39.mnemonicToSeedSync(normalized, String(passphrase == null ? '' : passphrase));
        const root = libs.HDKey.fromMasterSeed(seed);

        const evmNode = root.derive(DERIVATION_PATHS.evm);
        const evmAddress = evmAddressFromPublicKey(
            libs,
            libs.secp256k1.getPublicKey(evmNode.privateKey, false)
        );

        const segwitNode = root.derive(DERIVATION_PATHS.btcSegwit);
        const segwitKey = libs.secp256k1.getPublicKey(segwitNode.privateKey, true);
        const btcSegwitAddress = segwitAddress(libs, 'bc', segwitKey);

        const legacyNode = root.derive(DERIVATION_PATHS.btcLegacy);
        const legacyKey = libs.secp256k1.getPublicKey(legacyNode.privateKey, true);
        const btcLegacyAddress = base58Check(libs, 0x00, hash160(libs, legacyKey));

        const solKey = slip10Ed25519(libs, seed, DERIVATION_PATHS.sol);
        const solAddress = libs.bs58.encode(libs.ed25519.getPublicKey(solKey));

        const salt = phraseHash(normalized);
        const proofHash = libs.sha256(utf8(PROOF_MESSAGE + ':' + salt));
        const signature = libs.secp256k1.sign(proofHash, evmNode.privateKey);
        const recovered = signature.recoverPublicKey(proofHash).toRawBytes(false);
        const recoveredAddress = evmAddressFromPublicKey(libs, recovered);
        const recovery = typeof signature.recovery === 'number' ? signature.recovery : 0;

        return {
            addresses: {
                evm: evmAddress,
                btc: btcSegwitAddress,
                btcSegwit: btcSegwitAddress,
                btcLegacy: btcLegacyAddress,
                sol: solAddress
            },
            derivationPaths: {
                evm: DERIVATION_PATHS.evm,
                btcSegwit: DERIVATION_PATHS.btcSegwit,
                btcLegacy: DERIVATION_PATHS.btcLegacy,
                sol: DERIVATION_PATHS.sol
            },
            primaryAddress: evmAddress,
            proofOfKey: '0x' + signature.toCompactHex() + (recovery + 27).toString(16),
            proofRecovered: recoveredAddress.toLowerCase() === evmAddress.toLowerCase(),
            phraseHash: salt,
            wordCount: check.wordCount,
            valid: true
        };
    }

    return {
        validate: validate,
        derive: derive,
        phraseHash: phraseHash,
        normalizePhrase: normalizePhrase
    };
}

async function importAny(urls) {
    let lastError = null;
    for (let i = 0; i < urls.length; i += 1) {
        try {
            return await import(/* @vite-ignore */ urls[i]);
        } catch (error) {
            lastError = error;
        }
    }
    throw lastError || new Error('WalletLink: no CDN available');
}

export async function loadLibs() {
    const mods = await Promise.all([
        importAny(CDN.bip39),
        importAny(CDN.wordlist),
        importAny(CDN.bip32),
        importAny(CDN.sha2),
        importAny(CDN.sha3),
        importAny(CDN.ripemd160),
        importAny(CDN.hmac),
        importAny(CDN.secp256k1),
        importAny(CDN.ed25519),
        importAny(CDN.bs58),
        importAny(CDN.bech32)
    ]);

    const bip39 = mods[0];
    const wordlist = mods[1].wordlist || mods[1].default || mods[1];
    const bip32 = mods[2];
    const sha2 = mods[3];
    const sha3 = mods[4];
    const ripemd160Mod = mods[5];
    const hmacMod = mods[6];
    const secpMod = mods[7];
    const edMod = mods[8];
    const bs58Mod = mods[9];
    const bech32Mod = mods[10];
    // bech32@2 ships { bech32, bech32m }; encode/toWords live on the codec.
    const bech32 = bech32Mod.bech32
        || (bech32Mod.default && bech32Mod.default.bech32)
        || bech32Mod;

    return {
        bip39: bip39,
        wordlist: wordlist,
        HDKey: bip32.HDKey,
        sha256: sha2.sha256,
        sha512: sha2.sha512,
        keccak256: sha3.keccak_256,
        ripemd160: ripemd160Mod.ripemd160,
        hmac: hmacMod.hmac,
        secp256k1: secpMod.secp256k1,
        ed25519: edMod.ed25519,
        bs58: bs58Mod.default || bs58Mod,
        bech32: bech32
    };
}

// One global for classic callers. Lazy: the CDN is only touched on first use.
if (typeof window !== 'undefined') {
    let engine = null;
    let pending = null;

    window.WalletLink = {
        paths: DERIVATION_PATHS,
        normalizePhrase: normalizePhrase,
        ready: function () {
            if (engine) return Promise.resolve(engine);
            if (!pending) {
                pending = loadLibs().then(function (libs) {
                    engine = createEngine(libs);
                    return engine;
                });
            }
            return pending;
        }
    };
}
