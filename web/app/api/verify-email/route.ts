import { NextRequest, NextResponse } from 'next/server';
import { q, one } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const token = searchParams.get('token');

    if (!token) {
        return NextResponse.redirect(new URL('/dashboard?verified=invalid', request.url));
    }

    const record = await one<{ user_id: string; email: string; expires_at: string }>`
        select user_id, email, expires_at
        from verification_tokens
        where token = ${token}
        limit 1
    `;

    if (!record) {
        return NextResponse.redirect(new URL('/dashboard?verified=invalid', request.url));
    }

    if (new Date(record.expires_at) < new Date()) {
        await q`delete from verification_tokens where token = ${token}`;
        return NextResponse.redirect(new URL('/dashboard?verified=expired', request.url));
    }

    // Mark user email as verified
    await q`
        update users
        set email_verified = true
        where id = ${record.user_id}
    `;

    // Clean up used token
    await q`delete from verification_tokens where token = ${token}`;

    return NextResponse.redirect(new URL('/dashboard?verified=success', request.url));
}
