/**
 * Environment access. Nothing here throws at import time: the site is expected
 * to build before DATABASE_URL exists, and pages that need the database say so
 * at request time instead of crashing the build.
 */

export const APP_URL = (process.env.APP_URL || 'http://localhost:3000').replace(/\/$/, '');

export function databaseUrl(): string | null {
    const value = (process.env.DATABASE_URL || '').trim();
    if (!value) return null;
    // The .env.example placeholder must never be dialled.
    if (value.includes('user:password@')) return null;
    return value;
}

export function hasDatabase(): boolean {
    return databaseUrl() !== null;
}

export function secret(): string | null {
    const value = (process.env.SESSION_SECRET || '').trim();
    if (!value || value === 'replace-me-with-48-random-bytes') return null;
    return value;
}

export const RESEND_API_KEY = (process.env.RESEND_API_KEY || '').trim();
export const EMAIL_FROM = (process.env.EMAIL_FROM || 'Wyoming Attorney <onboarding@resend.dev>').trim();

