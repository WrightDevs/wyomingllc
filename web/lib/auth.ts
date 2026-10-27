import 'server-only';

import { one, q } from './db';
import { hashPassword, verifyPassword } from './crypto';

export type AuthUser = {
    id: string;
    email: string;
    display_name: string;
    is_admin: boolean;
    status: 'active' | 'inactive';
};

export type AuthFailure = { ok: false; error: string };
export type AuthSuccess = { ok: true; userId: string };
export type AuthResult = AuthSuccess | AuthFailure;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function normaliseEmail(value: string): string {
    return String(value || '').trim().toLowerCase();
}

export function isEmail(value: string): boolean {
    return EMAIL_RE.test(normaliseEmail(value));
}

export async function findUserByEmail(email: string): Promise<AuthUser | null> {
    return one<AuthUser>`
        select id, email, display_name, is_admin, status
        from users
        where lower(email) = ${normaliseEmail(email)}
        limit 1
    `;
}

export async function ensureBalanceProfile(userId: string, email: string, displayName: string): Promise<void> {
    await q`
        insert into user_balances (user_id, display_name, user_email)
        values (${userId}, ${displayName}, ${email})
        on conflict (user_id) do update
            set display_name = excluded.display_name,
                user_email = excluded.user_email
    `;
}

export async function registerUser(input: {
    email: string;
    password: string;
    displayName: string;
}): Promise<AuthResult> {
    const email = normaliseEmail(input.email);
    const displayName = input.displayName.trim().slice(0, 80);
    if (!isEmail(email)) return { ok: false, error: 'Enter a valid email address.' };
    if (input.password.length < 8) return { ok: false, error: 'Use at least 8 characters for the password.' };
    if (input.password.length > 200) return { ok: false, error: 'That password is too long.' };
    if (!displayName) return { ok: false, error: 'Enter the name you want shown on your dashboard.' };

    const existing = await findUserByEmail(email);
    if (existing) return { ok: false, error: 'An account with that email already exists. Sign in instead.' };

    const passwordHash = await hashPassword(input.password);

    try {
        const rows = await q<{ id: string }>`
            insert into users (email, password_hash, display_name)
            values (${email}, ${passwordHash}, ${displayName})
            returning id
        `;
        const userId = rows[0]?.id;
        if (!userId) return { ok: false, error: 'The account could not be created. Try again.' };
        await ensureBalanceProfile(userId, email, displayName);
        return { ok: true, userId };
    } catch (error) {
        // Unique violation: two signups for the same address at once.
        if (String((error as { code?: string }).code) === '23505') {
            return { ok: false, error: 'An account with that email already exists. Sign in instead.' };
        }
        throw error;
    }
}

export async function authenticate(email: string, password: string): Promise<AuthResult> {
    const row = await one<AuthUser & { password_hash: string }>`
        select id, email, display_name, is_admin, status, password_hash
        from users
        where lower(email) = ${normaliseEmail(email)}
        limit 1
    `;

    if (!row) {
        // Perform a dummy derivation so a missing account and a wrong password
        // take a comparable amount of time.
        await verifyPassword(password, 'scrypt$16384$8$1$AAAAAAAAAAAAAAAAAAAAAA$AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA');
        return { ok: false, error: 'That email and password do not match.' };
    }

    const valid = await verifyPassword(password, row.password_hash);
    if (!valid) return { ok: false, error: 'That email and password do not match.' };
    if (row.status === 'inactive') {
        return { ok: false, error: 'This account is deactivated. Contact an administrator to restore access.' };
    }

    await q`update users set last_login_at = now() where id = ${row.id}`;
    return { ok: true, userId: row.id };
}

export async function updatePassword(userId: string, password: string): Promise<void> {
    const passwordHash = await hashPassword(password);
    await q`update users set password_hash = ${passwordHash} where id = ${userId}`;
    // Every other session for this account is revoked on a password change.
    await q`delete from sessions where user_id = ${userId}`;
}
