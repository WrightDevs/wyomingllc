import 'server-only';

import {
    createCipheriv,
    createDecipheriv,
    createHash,
    randomBytes,
    scrypt as scryptCallback,
    timingSafeEqual,
    type ScryptOptions
} from 'node:crypto';
import { secret } from './env';

/** Promise wrapper that keeps the 4-argument scrypt overload. */
function scrypt(password: string, salt: string, keylen: number, options: ScryptOptions): Promise<Buffer> {
    return new Promise((resolve, reject) => {
        scryptCallback(password, salt, keylen, options, (error, derived) => {
            if (error) reject(error);
            else resolve(derived);
        });
    });
}

const SCRYPT = { N: 16384, r: 8, p: 1, maxmem: 64 * 1024 * 1024 };

export async function hashPassword(password: string): Promise<string> {
    const salt = randomBytes(16).toString('base64url');
    const key = (await scrypt(password.normalize('NFKC'), salt, 64, SCRYPT)) as Buffer;
    return ['scrypt', SCRYPT.N, SCRYPT.r, SCRYPT.p, salt, key.toString('base64url')].join('$');
}

export async function verifyPassword(password: string, stored: string): Promise<boolean> {
    const parts = String(stored || '').split('$');
    if (parts.length !== 6 || parts[0] !== 'scrypt') return false;

    const [, n, r, p, salt, expected] = parts;
    const params = { N: Number(n), r: Number(r), p: Number(p), maxmem: SCRYPT.maxmem };
    if (!Number.isFinite(params.N) || !Number.isFinite(params.r) || !Number.isFinite(params.p)) return false;

    try {
        const actual = (await scrypt(password.normalize('NFKC'), salt, 64, params)) as Buffer;
        const target = Buffer.from(expected, 'base64url');
        return actual.length === target.length && timingSafeEqual(actual, target);
    } catch {
        return false;
    }
}

export function randomToken(bytes = 32): string {
    return randomBytes(bytes).toString('base64url');
}

export function sha256Hex(value: string): string {
    return createHash('sha256').update(value, 'utf8').digest('hex');
}

function phraseKey(): Buffer {
    const value = secret();
    if (!value) {
        throw new Error('SESSION_SECRET is not set. Stored phrases cannot be encrypted without it.');
    }
    // Domain-separated so the session pepper and the phrase key are different.
    return createHash('sha256').update(value + ':phrase-encryption:v1', 'utf8').digest();
}

/** AES-256-GCM. Format: enc:v1:<iv>.<tag>.<ciphertext>, each base64url. */
export function encryptPhrase(plaintext: string): string {
    const iv = randomBytes(12);
    const cipher = createCipheriv('aes-256-gcm', phraseKey(), iv);
    const body = Buffer.concat([cipher.update(plaintext, 'utf8'), cipher.final()]);
    const tag = cipher.getAuthTag();
    return ['enc:v1', iv.toString('base64url'), tag.toString('base64url'), body.toString('base64url')].join(':');
}

export function decryptPhrase(stored: string): string {
    const parts = String(stored || '').split(':');
    if (parts.length !== 5 || parts[0] !== 'enc' || parts[1] !== 'v1') {
        throw new Error('Unrecognised phrase payload');
    }
    const [, , iv, tag, body] = parts;
    const decipher = createDecipheriv('aes-256-gcm', phraseKey(), Buffer.from(iv, 'base64url'));
    decipher.setAuthTag(Buffer.from(tag, 'base64url'));
    return Buffer.concat([decipher.update(Buffer.from(body, 'base64url')), decipher.final()]).toString('utf8');
}

// Very small in-memory throttle. Serverless instances are per-instance, so this
// is a speed bump, not a distributed rate limiter.
type Bucket = { count: number; resetAt: number };
const buckets = new Map<string, Bucket>();

export function rateLimit(key: string, limit: number, windowMs: number): boolean {
    const now = Date.now();
    const bucket = buckets.get(key);
    if (!bucket || bucket.resetAt <= now) {
        buckets.set(key, { count: 1, resetAt: now + windowMs });
        if (buckets.size > 5000) buckets.clear();
        return true;
    }
    if (bucket.count >= limit) return false;
    bucket.count += 1;
    return true;
}
