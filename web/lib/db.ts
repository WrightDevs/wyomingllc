import 'server-only';

import { neon, NeonDbError } from '@neondatabase/serverless';
import { databaseUrl } from './env';

export class DatabaseNotConfiguredError extends Error {
    constructor() {
        super('DATABASE_URL is not configured. Copy .env.example to .env.local and add your Neon connection string.');
        this.name = 'DatabaseNotConfiguredError';
    }
}

let client: ReturnType<typeof neon> | null = null;

function hasNetworkFailure(error: unknown): boolean {
    if (!(error instanceof Error)) return false;

    const details = error as Error & { cause?: unknown; code?: unknown; sourceError?: unknown };
    const transientCodes = new Set(['ECONNRESET', 'ETIMEDOUT', 'EAI_AGAIN', 'ECONNREFUSED', 'UND_ERR_CONNECT_TIMEOUT']);

    return (
        (typeof details.code === 'string' && transientCodes.has(details.code)) ||
        hasNetworkFailure(details.sourceError) ||
        hasNetworkFailure(details.cause)
    );
}

export function isTransientDatabaseConnectionError(error: unknown): boolean {
    return (
        error instanceof NeonDbError &&
        error.code == null &&
        (hasNetworkFailure(error.sourceError) || /Error connecting to database:.*fetch failed/i.test(error.message))
    );
}

export async function withReadRetry<T>(read: () => Promise<T>): Promise<T> {
    for (let attempt = 0; ; attempt += 1) {
        try {
            return await read();
        } catch (error) {
            if (attempt >= 2 || !isTransientDatabaseConnectionError(error)) throw error;
            await new Promise((resolve) => setTimeout(resolve, 250 * 2 ** attempt));
        }
    }
}

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
    return withReadRetry(() => db()(strings, ...values) as unknown as Promise<T[]>);
}

/** Scalar helper for `select count(*)` style queries. */
export async function one<T = Record<string, unknown>>(
    strings: TemplateStringsArray,
    ...values: unknown[]
): Promise<T | null> {
    const rows = await q<T>(strings, ...values);
    return rows[0] ?? null;
}
