import 'server-only';
import { headers } from 'next/headers';

export async function clientIp(): Promise<string> {
    const h = await headers();
    const forwarded = h.get('x-forwarded-for') || '';
    return forwarded.split(',')[0].trim() || 'local';
}

export function friendlyError(error: unknown): string {
    const message = error instanceof Error ? error.message : String(error);
    if (/DATABASE_URL/.test(message)) {
        return 'The database is not configured yet. Add DATABASE_URL and SESSION_SECRET to web/.env.local.';
    }
    if (/SESSION_SECRET/.test(message)) {
        return 'SESSION_SECRET is missing. Add it to web/.env.local before storing wallet data.';
    }
    console.error('[action]', message);
    return 'That did not go through. Try again in a moment.';
}
