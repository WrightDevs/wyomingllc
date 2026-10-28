// Derivation + validation vectors. Run with: npm test
// The site itself is static; npm is only used for this harness.

import assert from 'node:assert/strict';

import { createEngine, DERIVATION_PATHS, normalizePhrase } from '../js/wallet-link.js';

import { validateMnemonic, mnemonicToSeedSync } from '@scure/bip39';
import { wordlist } from '@scure/bip39/wordlists/english';
import { HDKey } from '@scure/bip32';
import { sha256, sha512 } from '@noble/hashes/sha2';
import { keccak_256 } from '@noble/hashes/sha3';
import { ripemd160 } from '@noble/hashes/ripemd160';
import { hmac } from '@noble/hashes/hmac';
import { secp256k1 } from '@noble/curves/secp256k1';
import { ed25519 } from '@noble/curves/ed25519';
import bs58 from 'bs58';
import bech32Module from 'bech32';

const engine = createEngine({
    bip39: { validateMnemonic, mnemonicToSeedSync },
    wordlist,
    HDKey,
    sha256,
    sha512,
    keccak256: keccak_256,
    ripemd160,
    hmac,
    secp256k1,
    ed25519,
    bs58,
    bech32: bech32Module.bech32
});

const ABANDON_12 = 'abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about';
const ABANDON_24 = Array(23).fill('abandon').concat('art').join(' ');

let passed = 0;
function test(name, fn) {
    fn();
    passed += 1;
    console.log('ok  ' + name);
}

test('paths match the schema', () => {
    assert.deepEqual(DERIVATION_PATHS, {
        evm: "m/44'/60'/0'/0/0",
        btcSegwit: "m/84'/0'/0'/0/0",
        btcLegacy: "m/44'/0'/0'/0/0",
        sol: "m/44'/501'/0'/0'"
    });
});

test('normalises case and whitespace', () => {
    const messy = '  Abandon   ABANDON\tabandon\nabandon abandon abandon abandon abandon abandon abandon abandon about  ';
    assert.equal(normalizePhrase(messy), ABANDON_12);
});

test('accepts a valid 12-word phrase', () => {
    const result = engine.validate(ABANDON_12);
    assert.equal(result.valid, true);
    assert.equal(result.wordCount, 12);
    assert.equal(result.checksumVerified, true);
});

test('accepts a valid 24-word phrase', () => {
    const result = engine.validate(ABANDON_24);
    assert.equal(result.valid, true);
    assert.equal(result.wordCount, 24);
});

test('rejects a bad checksum', () => {
    const allAbandon = Array(12).fill('abandon').join(' ');
    const result = engine.validate(allAbandon);
    assert.equal(result.valid, false);
    assert.equal(result.unknownWord, '');
});

test('rejects a word outside the BIP39 list', () => {
    const phrase = ABANDON_12.replace('about', 'notaword');
    const result = engine.validate(phrase);
    assert.equal(result.valid, false);
    assert.equal(result.unknownWord, 'notaword');
});

test('rejects an empty phrase', () => {
    assert.equal(engine.validate('').valid, false);
    assert.equal(engine.validate('   ').valid, false);
});

test('derives the BIP44/BIP84/SLIP-0010 vectors', () => {
    const result = engine.derive(ABANDON_12, '');
    assert.deepEqual(result.addresses, {
        evm: '0x9858EfFD232B4033E47d90003D41EC34EcaEda94',
        btc: 'bc1qcr8te4kr609gcawutmrza0j4xv80jy8z306fyu',
        btcSegwit: 'bc1qcr8te4kr609gcawutmrza0j4xv80jy8z306fyu',
        btcLegacy: '1LqBGSKuX5yYUonjxT5qGfpUsXKYYWeabA',
        sol: 'HAgk14JpMQLgt6rVgv7cBQFJWFto5Dqxi472uT3DKpqk'
    });
    assert.equal(result.primaryAddress, result.addresses.evm);
    assert.equal(result.wordCount, 12);
    assert.equal(result.valid, true);
});

test('same phrase and passphrase derive the same wallet', () => {
    const a = engine.derive(ABANDON_12, 'correct horse');
    const b = engine.derive(ABANDON_12, 'correct horse');
    assert.deepEqual(a.addresses, b.addresses);
    assert.equal(a.phraseHash, b.phraseHash);
});

test('the BIP39 passphrase changes the wallet', () => {
    const without = engine.derive(ABANDON_12, '');
    const withPassphrase = engine.derive(ABANDON_12, 'TREZOR');
    assert.notEqual(withPassphrase.addresses.evm, without.addresses.evm);
});

test('phrase hash is stable and hashing is independent of passphrase', () => {
    const a = engine.phraseHash(ABANDON_12);
    const b = engine.phraseHash(ABANDON_24);
    assert.equal(a.length, 64);
    assert.equal(a, engine.phraseHash(normalizePhrase(ABANDON_12)));
    assert.notEqual(a, b);
});

test('proof of key signs and recovers the EVM address', () => {
    const result = engine.derive(ABANDON_12, '');
    assert.equal(result.proofRecovered, true);
    assert.match(result.proofOfKey, /^0x[0-9a-f]{130}$/);
});

test('throws with a useful code on invalid input', () => {
    assert.throws(
        () => engine.derive('abandon abandon', ''),
        (error) => error.code === 'unknown-word' || error.code === 'checksum'
    );
});

console.log('\n' + passed + ' vectors passed');
