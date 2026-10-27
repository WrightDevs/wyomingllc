'use server';

import { revalidatePath } from 'next/cache';
import { one, q } from '@/lib/db';
import { verifyPassword } from '@/lib/crypto';
import { updatePassword } from '@/lib/auth';
import { createSession, requireUser, setSessionCookie } from '@/lib/session';
import { friendlyError } from '@/lib/request';
import type { FormState } from '@/lib/form';

export async function updateProfileAction(_prev: FormState, formData: FormData): Promise<FormState> {
    const viewer = await requireUser();
    if (viewer.impersonator) return { ok: false, message: 'View-as mode is read-only. Exit to edit the profile.' };

    const displayName = String(formData.get('displayName') || '').trim();
    const phone = String(formData.get('phone') || '').trim();

    if (displayName.length < 2) return { ok: false, message: 'Enter at least two characters for your name.' };
    if (displayName.length > 80) return { ok: false, message: 'Keep the name under 80 characters.' };
    if (phone.length > 40) return { ok: false, message: 'That phone number is too long.' };

    try {
        await q`update users set display_name = ${displayName}, phone = ${phone} where id = ${viewer.user.id}`;
        await q`update user_balances set display_name = ${displayName} where user_id = ${viewer.user.id}`;
    } catch (error) {
        return { ok: false, message: friendlyError(error) };
    }

    revalidatePath('/dashboard');
    revalidatePath('/dashboard/account');
    return { ok: true, message: 'Profile saved.' };
}

export async function changePasswordAction(_prev: FormState, formData: FormData): Promise<FormState> {
    const viewer = await requireUser();
    if (viewer.impersonator) return { ok: false, message: 'View-as mode is read-only. Exit to change the password.' };

    const current = String(formData.get('currentPassword') || '');
    const next = String(formData.get('newPassword') || '');
    const confirm = String(formData.get('confirmPassword') || '');

    if (!current || !next) return { ok: false, message: 'Enter your current and new password.' };
    if (next.length < 8) return { ok: false, message: 'Use at least 8 characters for the new password.' };
    if (next.length > 200) return { ok: false, message: 'That password is too long.' };
    if (next !== confirm) return { ok: false, message: 'The new passwords do not match.' };

    try {
        const row = await one<{ password_hash: string }>`select password_hash from users where id = ${viewer.user.id} limit 1`;
        if (!row) return { ok: false, message: 'That account no longer exists.' };
        if (!(await verifyPassword(current, row.password_hash))) {
            return { ok: false, message: 'The current password is not correct.' };
        }

        // This deletes every session for the account, then signs this device back in.
        await updatePassword(viewer.user.id, next);
        const token = await createSession(viewer.user.id);
        await setSessionCookie(token);
    } catch (error) {
        return { ok: false, message: friendlyError(error) };
    }

    revalidatePath('/dashboard/account');
    return { ok: true, message: 'Password changed. Other devices were signed out.' };
}
