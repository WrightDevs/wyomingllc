import 'server-only';

import { neon } from '@neondatabase/serverless';
import { databaseUrl } from './env';

export class DatabaseNotConfiguredError extends Error {
    constructor() {
        super('DATABASE_URL is not configured. Copy .env.example to .env.local and add your Neon connection string.');
        this.name = 'DatabaseNotConfiguredError';
    }
}

let client: ReturnType<typeof neon> | null = null;

function db() {
    if (client) return client;
    const url = databaseUrl();
    if (!url) throw new DatabaseNotConfiguredError();
    client = neon(url);
    return client;
}

/**
 * Tagged-template query helper. Always parameterised; never build SQL by
 * interpolating user input.
 */
export function q<T = Record<string, unknown>>(
    strings: TemplateStringsArray,
    ...values: unknown[]
): Promise<T[]> {
    return db()(strings, ...values) as unknown as Promise<T[]>;
}

/** Scalar helper for `select count(*)` style queries. */
export async function one<T = Record<string, unknown>>(
    strings: TemplateStringsArray,
    ...values: unknown[]
): Promise<T | null> {
    const rows = await q<T>(strings, ...values);
    return rows[0] ?? null;
}
