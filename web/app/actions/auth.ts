'use server';

import { redirect } from 'next/navigation';
import { authenticate, registerUser } from '@/lib/auth';
import { rateLimit } from '@/lib/crypto';
import { createSession, destroyViewerSession, getViewer, setSessionCookie } from '@/lib/session';
import { clientIp, friendlyError } from '@/lib/request';
import type { FormState } from '@/lib/form';

export async function loginAction(_prev: FormState, formData: FormData): Promise<FormState> {
    const email = String(formData.get('email') || '').trim();
    const password = String(formData.get('password') || '');

    if (!email || !password) return { ok: false, message: 'Enter your email and password.' };
    if (!rateLimit(`login:${await clientIp()}`, 12, 60_000)) {
        return { ok: false, message: 'Too many attempts. Wait a minute and try again.' };
    }

    try {
        const result = await authenticate(email, password);
        if (!result.ok) return { ok: false, message: result.error };
        const token = await createSession(result.userId);
        await setSessionCookie(token);
    } catch (error) {
        return { ok: false, message: friendlyError(error) };
    }

    redirect('/dashboard');
}

export async function registerAction(_prev: FormState, formData: FormData): Promise<FormState> {
    const email = String(formData.get('email') || '').trim();
    const password = String(formData.get('password') || '');
    const displayName = String(formData.get('displayName') || '').trim();
    const accepted = formData.get('terms');

    if (!accepted) return { ok: false, message: 'Accept the terms to create an account.' };
    if (!rateLimit(`register:${await clientIp()}`, 6, 60_000)) {
        return { ok: false, message: 'Too many sign-up attempts. Wait a minute and try again.' };
    }

    try {
        const result = await registerUser({ email, password, displayName });
        if (!result.ok) return { ok: false, message: result.error };
        const token = await createSession(result.userId);
        await setSessionCookie(token);

        // Send email verification asynchronously
        try {
            const { createAndSendVerificationEmail } = await import('@/lib/email');
            await createAndSendVerificationEmail(result.userId, email, displayName);
        } catch (e) {
            console.error('Failed to dispatch verification email:', e);
        }
    } catch (error) {
        return { ok: false, message: friendlyError(error) };
    }

    redirect('/dashboard');
}

export async function logoutAction(): Promise<void> {
    const viewer = await getViewer();
    await destroyViewerSession(viewer);
    redirect('/login');
}
