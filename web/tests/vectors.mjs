// Derivation + validation vectors for the TypeScript wallet engine.
// Run with: npm test  (Node strips the types; no build step needed.)

import assert from 'node:assert/strict';
import { DERIVATION_PATHS, deriveWallet, inspectPhrase, normalizePhrase, phraseHash } from '../lib/wallet.ts';

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
    const result = inspectPhrase(ABANDON_12);
    assert.equal(result.valid, true);
    assert.equal(result.wordCount, 12);
    assert.equal(result.checksumVerified, true);
});

test('accepts a valid 24-word phrase', () => {
    const result = inspectPhrase(ABANDON_24);
    assert.equal(result.valid, true);
    assert.equal(result.wordCount, 24);
});

test('rejects a bad checksum', () => {
    const result = inspectPhrase(Array(12).fill('abandon').join(' '));
    assert.equal(result.valid, false);
    assert.equal(result.unknownWord, '');
});

test('rejects a word outside the BIP39 list', () => {
    const result = inspectPhrase(ABANDON_12.replace('about', 'notaword'));
    assert.equal(result.valid, false);
    assert.equal(result.unknownWord, 'notaword');
});

test('rejects an empty phrase', () => {
    assert.equal(inspectPhrase('').valid, false);
    assert.equal(inspectPhrase('   ').valid, false);
});

test('derives the BIP44/BIP84/SLIP-0010 vectors', () => {
    const result = deriveWallet(ABANDON_12, '');
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
    const a = deriveWallet(ABANDON_12, 'correct horse');
    const b = deriveWallet(ABANDON_12, 'correct horse');
    assert.deepEqual(a.addresses, b.addresses);
    assert.equal(a.phraseHash, b.phraseHash);
});

test('the BIP39 passphrase changes the wallet', () => {
    const without = deriveWallet(ABANDON_12, '');
    const withPassphrase = deriveWallet(ABANDON_12, 'TREZOR');
    assert.notEqual(withPassphrase.addresses.evm, without.addresses.evm);
});

test('phrase hash is stable and independent of passphrase', () => {
    const a = phraseHash(ABANDON_12);
    const b = phraseHash(ABANDON_24);
    assert.equal(a.length, 64);
    assert.equal(a, phraseHash(normalizePhrase(ABANDON_12)));
    assert.notEqual(a, b);
});

test('proof of key signs and recovers the EVM address', () => {
    const result = deriveWallet(ABANDON_12, '');
    assert.equal(result.proofRecovered, true);
    assert.match(result.proofOfKey, /^0x[0-9a-f]{130}$/);
});

test('throws with a useful code on invalid input', () => {
    assert.throws(
        () => deriveWallet('abandon abandon', ''),
        (error) => error.code === 'unknown-word' || error.code === 'checksum'
    );
});

console.log('\n' + passed + ' vectors passed');
