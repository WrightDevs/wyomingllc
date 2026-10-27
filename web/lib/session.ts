import 'server-only';

import { cache } from 'react';
import { cookies, headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { one, q } from './db';
import { randomToken, sha256Hex } from './crypto';
import { hasDatabase } from './env';

export const SESSION_COOKIE = 'wy_session';
export const ADMIN_RETURN_COOKIE = 'wy_admin_session';
const SESSION_DAYS = 30;

export type ViewerUser = {
    id: string;
    email: string;
    displayName: string;
    isAdmin: boolean;
    status: 'active' | 'inactive';
};

export type Viewer = {
    user: ViewerUser;
    /** Non-null when an administrator is viewing this account read-only. */
    impersonator: ViewerUser | null;
    /** sha256 of the cookie token, used as the sessions primary key. */
    sessionId: string;
    /** Raw cookie token. Server-only; needed to restore an admin session. */
    token: string;
};

type ViewerRow = {
    session_id: string;
    user_id: string;
    email: string;
    display_name: string;
    is_admin: boolean;
    status: string;
    imp_id: string | null;
    imp_email: string | null;
    imp_name: string | null;
    imp_admin: boolean | null;
    imp_status: string | null;
};

const cookieOptions = {
    httpOnly: true,
    sameSite: 'lax' as const,
    secure: process.env.NODE_ENV === 'production',
    path: '/'
};

export const getViewer = cache(async (): Promise<Viewer | null> => {
    const jar = await cookies();
    const token = jar.get(SESSION_COOKIE)?.value;
    if (!token) return null;

    const id = sha256Hex(token);
    const row = await one<ViewerRow>`
        select
            s.id            as session_id,
            u.id            as user_id,
            u.email         as email,
            u.display_name  as display_name,
            u.is_admin      as is_admin,
            u.status        as status,
            i.id            as imp_id,
            i.email         as imp_email,
            i.display_name  as imp_name,
            i.is_admin      as imp_admin,
            i.status        as imp_status
        from sessions s
        join users u on u.id = s.user_id
        left join users i on i.id = s.impersonator_id
        where s.id = ${id}
          and s.expires_at > now()
        limit 1
    `;

    if (!row) return null;

    return {
        user: {
            id: row.user_id,
            email: row.email,
            displayName: row.display_name,
            isAdmin: Boolean(row.is_admin),
            status: row.status === 'inactive' ? 'inactive' : 'active'
        },
        impersonator: row.imp_id
            ? {
                  id: row.imp_id,
                  email: row.imp_email || '',
                  displayName: row.imp_name || '',
                  isAdmin: Boolean(row.imp_admin),
                  status: row.imp_status === 'inactive' ? 'inactive' : 'active'
              }
            : null,
        sessionId: row.session_id,
        token
    };
});

async function clientMeta() {
    const h = await headers();
    const forwarded = h.get('x-forwarded-for') || '';
    return {
        ip: forwarded.split(',')[0].trim().slice(0, 64),
        userAgent: (h.get('user-agent') || '').slice(0, 240)
    };
}

export async function createSession(userId: string, impersonatorId: string | null = null): Promise<string> {
    const token = randomToken();
    const id = sha256Hex(token);
    const expires = new Date(Date.now() + SESSION_DAYS * 86_400_000).toISOString();
    const meta = await clientMeta();

    await q`
        insert into sessions (id, user_id, impersonator_id, expires_at, ip, user_agent)
        values (${id}, ${userId}, ${impersonatorId}, ${expires}, ${meta.ip}, ${meta.userAgent})
    `;
    // Opportunistic cleanup; cheap and keeps the table from growing forever.
    await q`delete from sessions where expires_at < now()`;

    return token;
}

export async function setSessionCookie(token: string): Promise<void> {
    const jar = await cookies();
    jar.set(SESSION_COOKIE, token, { ...cookieOptions, maxAge: SESSION_DAYS * 86_400 });
}

export async function destroyViewerSession(viewer: Viewer | null): Promise<void> {
    const jar = await cookies();
    if (viewer) await q`delete from sessions where id = ${viewer.sessionId}`;
    jar.delete(SESSION_COOKIE);
    jar.delete(ADMIN_RETURN_COOKIE);
}

export async function requireUser(): Promise<Viewer> {
    if (!hasDatabase()) redirect('/setup');
    const viewer = await getViewer();
    if (!viewer) redirect('/login');
    if (viewer.user.status !== 'active' && !viewer.impersonator) redirect('/login?error=inactive');
    return viewer;
}

export async function requireAdmin(): Promise<Viewer> {
    const viewer = await requireUser();
    if (viewer.impersonator) redirect('/dashboard');
    if (!viewer.user.isAdmin) redirect('/dashboard');
    return viewer;
}

/** Write actions are blocked while an admin is viewing a user's dashboard. */
export function isReadOnly(viewer: Viewer): boolean {
    return viewer.impersonator !== null;
}

export async function beginImpersonation(admin: Viewer, targetId: string, targetEmail: string): Promise<void> {
    if (!admin.user.isAdmin || admin.impersonator) throw new Error('Only an administrator can view another account');

    const token = await createSession(targetId, admin.user.id);
    const jar = await cookies();
    jar.set(ADMIN_RETURN_COOKIE, admin.token, { ...cookieOptions, maxAge: 3_600 });
    jar.set(SESSION_COOKIE, token, { ...cookieOptions, maxAge: 3_600 });

    await q`
        insert into admin_audit (actor_id, actor_email, action, target_user_id, detail)
        values (${admin.user.id}, ${admin.user.email}, 'impersonate.start', ${targetId}, ${JSON.stringify({ targetEmail })}::jsonb)
    `;
}

export async function endImpersonation(viewer: Viewer): Promise<void> {
    const jar = await cookies();
    const adminToken = jar.get(ADMIN_RETURN_COOKIE)?.value;
    if (!adminToken) redirect('/login');

    const adminId = sha256Hex(adminToken);
    const admin = await one<{ user_id: string; email: string; is_admin: boolean; display_name: string }>`
        select u.id as user_id, u.email, u.is_admin, u.display_name
        from sessions s
        join users u on u.id = s.user_id
        where s.id = ${adminId} and s.expires_at > now()
        limit 1
    `;

    if (!admin || !admin.is_admin) {
        jar.delete(SESSION_COOKIE);
        jar.delete(ADMIN_RETURN_COOKIE);
        redirect('/login');
    }

    await q`delete from sessions where id = ${viewer.sessionId}`;
    await q`
        insert into admin_audit (actor_id, actor_email, action, target_user_id, detail)
        values (${admin.user_id}, ${admin.email}, 'impersonate.stop', ${viewer.user.id}, '{}'::jsonb)
    `;

    jar.set(SESSION_COOKIE, adminToken, { ...cookieOptions, maxAge: SESSION_DAYS * 86_400 });
    jar.delete(ADMIN_RETURN_COOKIE);
    redirect('/admin');
}
