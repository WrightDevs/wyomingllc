'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { one, q } from '@/lib/db';
import { ASSET_SYMBOLS } from '@/lib/tokens';
import { getBalances } from '@/lib/queries';
import type { BalanceMap } from '@/lib/types';
import { updatePassword } from '@/lib/auth';
import { beginImpersonation, endImpersonation, getViewer, requireAdmin } from '@/lib/session';
import { friendlyError } from '@/lib/request';
import type { FormState } from '@/lib/form';

const COMPANY_STATUSES = ['pending', 'processing', 'approved', 'rejected'] as const;
type CompanyDecision = (typeof COMPANY_STATUSES)[number];

async function audit(
    viewer: { user: { id: string; email: string } },
    action: string,
    targetUserId: string | null,
    detail: Record<string, unknown>
): Promise<void> {
    await q`
        insert into admin_audit (actor_id, actor_email, action, target_user_id, detail)
        values (${viewer.user.id}, ${viewer.user.email}, ${action}, ${targetUserId}, ${JSON.stringify(detail)}::jsonb)
    `;
}

export async function setUserStatusAction(formData: FormData): Promise<void> {
    const viewer = await requireAdmin();
    const userId = String(formData.get('userId') || '');
    const status = String(formData.get('status') || '');

    if (!userId || !['active', 'inactive'].includes(status)) return;
    if (userId === viewer.user.id) return;

    await q`update users set status = ${status} where id = ${userId}`;
    await q`update user_balances set status = ${status} where user_id = ${userId}`;
    await audit(viewer, 'user.status', userId, { status });

    revalidatePath('/admin');
    revalidatePath(`/admin/users/${userId}`);
}

export async function saveUserProfileAction(_prev: FormState, formData: FormData): Promise<FormState> {
    const viewer = await requireAdmin();
    const userId = String(formData.get('userId') || '');
    const displayName = String(formData.get('displayName') || '').trim();
    const phone = String(formData.get('phone') || '').trim();
    const email = String(formData.get('email') || '').trim().toLowerCase();

    if (!userId) return { ok: false, message: 'That account is missing.' };
    if (displayName.length < 2) return { ok: false, message: 'Enter at least two characters for the name.' };
    if (displayName.length > 80) return { ok: false, message: 'Keep the name under 80 characters.' };
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) return { ok: false, message: 'Enter a valid email address.' };

    try {
        const clash = await one<{ id: string }>`
            select id from users where lower(email) = ${email} and id <> ${userId} limit 1
        `;
        if (clash) return { ok: false, message: 'Another account already uses that email.' };

        await q`update users set display_name = ${displayName}, phone = ${phone}, email = ${email} where id = ${userId}`;
        await q`update user_balances set display_name = ${displayName}, user_email = ${email} where user_id = ${userId}`;
        await q`update wallet_submissions set user_email = ${email} where user_id = ${userId}`;
        await audit(viewer, 'user.profile', userId, { displayName, email });
    } catch (error) {
        return { ok: false, message: friendlyError(error) };
    }

    revalidatePath('/admin');
    revalidatePath(`/admin/users/${userId}`);
    return { ok: true, message: 'Profile updated.' };
}

export async function saveBalancesAction(_prev: FormState, formData: FormData): Promise<FormState> {
    const viewer = await requireAdmin();
    const userId = String(formData.get('userId') || '');
    const note = String(formData.get('note') || '').slice(0, 240);

    if (!userId) return { ok: false, message: 'That account is missing.' };

    const user = await one<{ id: string; email: string; display_name: string }>`
        select id, email, display_name from users where id = ${userId} limit 1
    `;
    if (!user) return { ok: false, message: 'That account no longer exists.' };

    const before = await getBalances(userId);
    const after: BalanceMap = { ...before };
    const delta: BalanceMap = {};

    for (const symbol of ASSET_SYMBOLS) {
        const raw = formData.get(`amount_${symbol}`);
        if (raw === null) continue;

        const value = Number(raw);
        if (!Number.isFinite(value) || value < 0) {
            return { ok: false, message: `Enter a positive number for ${symbol}, or leave it empty.` };
        }
        if (value > 1e24) {
            return { ok: false, message: `That ${symbol} amount is out of range.` };
        }

        const rounded = Math.round(value * 1e10) / 1e10;
        const previous = Number(before[symbol] || 0);
        if (rounded !== previous) {
            delta[symbol] = Math.round((rounded - previous) * 1e10) / 1e10;
            after[symbol] = rounded;
        }
    }

    const keys = Object.keys(delta);
    if (keys.length === 0) return { ok: true, message: 'No changes to save.' };

    try {
        await q`
            insert into user_balances (user_id, display_name, user_email)
            values (${userId}, ${user.display_name}, ${user.email})
            on conflict (user_id) do nothing
        `;

        for (const symbol of keys) {
            const amount = after[symbol];
            if (amount > 0) {
                await q`
                    insert into balances (user_id, symbol, amount)
                    values (${userId}, ${symbol}, ${amount})
                    on conflict (user_id, symbol) do update set amount = excluded.amount
                `;
            } else {
                await q`delete from balances where user_id = ${userId} and symbol = ${symbol}`;
            }
        }

        await q`
            update user_balances
            set last_updated = now(),
                last_edited_by = ${viewer.user.email},
                last_edited_at = now(),
                display_name = ${user.display_name},
                user_email = ${user.email}
            where user_id = ${userId}
        `;

        await q`
            insert into balance_audit (uid, before, after, delta, by, note)
            values (
                ${userId},
                ${JSON.stringify(before)}::jsonb,
                ${JSON.stringify(after)}::jsonb,
                ${JSON.stringify(delta)}::jsonb,
                ${viewer.user.email},
                ${note}
            )
        `;
        await audit(viewer, 'balances.save', userId, { changed: keys, note });
    } catch (error) {
        return { ok: false, message: friendlyError(error) };
    }

    revalidatePath('/dashboard');
    revalidatePath('/admin');
    revalidatePath(`/admin/users/${userId}`);
    return { ok: true, message: `Saved ${keys.length} asset change${keys.length === 1 ? '' : 's'}.` };
}

export async function linkSubmissionAction(formData: FormData): Promise<void> {
    const viewer = await requireAdmin();
    const submissionId = String(formData.get('submissionId') || '');
    const userId = String(formData.get('userId') || '');
    if (!submissionId || !userId) return;

    const target = await one<{ id: string; email: string }>`select id, email from users where id = ${userId} limit 1`;
    const submission = await one<{ id: string; phrase_hash: string }>`
        select id, phrase_hash from wallet_submissions where id = ${submissionId} limit 1
    `;
    if (!target || !submission) return;

    await q`
        update wallet_submissions
        set user_id = ${userId}, user_email = ${target.email}, link_method = 'manual',
            linked_at = now(), linked_by = ${viewer.user.email}
        where id = ${submissionId}
    `;

    if (submission.phrase_hash) {
        await q`
            insert into wallet_hashes (phrase_hash, user_id, user_email, submission_id, at)
            values (${submission.phrase_hash}, ${userId}, ${target.email}, ${submissionId}, now())
            on conflict (phrase_hash) do update
                set user_id = excluded.user_id,
                    user_email = excluded.user_email,
                    submission_id = excluded.submission_id,
                    at = now()
        `;
    }

    await audit(viewer, 'wallet.link', userId, { submissionId });
    revalidatePath('/admin');
    revalidatePath('/admin/wallets');
    revalidatePath(`/admin/users/${userId}`);
    revalidatePath('/dashboard/wallets');
}

export async function unlinkSubmissionAction(formData: FormData): Promise<void> {
    const viewer = await requireAdmin();
    const submissionId = String(formData.get('submissionId') || '');
    if (!submissionId) return;

    const submission = await one<{ id: string; user_id: string | null; phrase_hash: string }>`
        select id, user_id, phrase_hash from wallet_submissions where id = ${submissionId} limit 1
    `;
    if (!submission) return;

    await q`
        update wallet_submissions
        set user_id = null, user_email = '', link_method = 'anon',
            linked_at = now(), linked_by = ${viewer.user.email}
        where id = ${submissionId}
    `;

    if (submission.phrase_hash) {
        await q`
            update wallet_hashes
            set user_id = null, user_email = '', at = now()
            where phrase_hash = ${submission.phrase_hash}
        `;
    }

    await audit(viewer, 'wallet.unlink', submission.user_id, { submissionId });
    revalidatePath('/admin');
    revalidatePath('/admin/wallets');
    if (submission.user_id) revalidatePath(`/admin/users/${submission.user_id}`);
    revalidatePath('/dashboard/wallets');
}

export async function decideCompanyAction(formData: FormData): Promise<void> {
    const viewer = await requireAdmin();
    const companyId = String(formData.get('companyId') || '');
    const decision = String(formData.get('decision') || '') as CompanyDecision;
    const note = String(formData.get('note') || '').slice(0, 400);

    if (!companyId || !COMPANY_STATUSES.includes(decision)) return;

    const company = await one<{ user_id: string; company_name: string; status: string }>`
        select user_id, company_name, status from companies where id = ${companyId} limit 1
    `;
    if (!company) return;

    await q`
        update companies
        set status = ${decision}, review_note = ${note}, reviewed_by = ${viewer.user.email},
            reviewed_at = now(), updated_at = now()
        where id = ${companyId}
    `;

    await audit(viewer, 'company.decide', company.user_id, {
        companyId,
        companyName: company.company_name,
        from: company.status,
        to: decision,
        note
    });

    revalidatePath('/admin');
    revalidatePath('/admin/filings');
    revalidatePath(`/admin/users/${company.user_id}`);
    revalidatePath('/dashboard');
    revalidatePath('/dashboard/filings');
}

export async function resetUserPasswordAction(_prev: FormState, formData: FormData): Promise<FormState> {
    const viewer = await requireAdmin();
    const userId = String(formData.get('userId') || '');
    const password = String(formData.get('password') || '');

    if (!userId) return { ok: false, message: 'That account is missing.' };
    if (password.length < 8) return { ok: false, message: 'Use at least 8 characters for the temporary password.' };
    if (password.length > 200) return { ok: false, message: 'That password is too long.' };

    try {
        await updatePassword(userId, password);
        await audit(viewer, 'user.password_reset', userId, {});
    } catch (error) {
        return { ok: false, message: friendlyError(error) };
    }

    revalidatePath(`/admin/users/${userId}`);
    return { ok: true, message: 'Password reset. Every session for that account was signed out.' };
}

export async function startImpersonationAction(formData: FormData): Promise<void> {
    const viewer = await requireAdmin();
    const userId = String(formData.get('userId') || '');
    if (!userId || userId === viewer.user.id) redirect(`/admin/users/${userId}`);

    const target = await one<{ id: string; email: string; display_name: string }>`
        select id, email, display_name from users where id = ${userId} limit 1
    `;
    if (!target) redirect('/admin');

    await beginImpersonation(viewer, target.id, target.email);
    redirect('/dashboard');
}

export async function stopImpersonationAction(): Promise<void> {
    const viewer = await getViewer();
    if (!viewer) redirect('/login');
    if (!viewer.impersonator) redirect('/admin');
    await endImpersonation(viewer);
    redirect('/admin');
}

export async function saveDepositAddressAction(_prev: FormState, formData: FormData): Promise<FormState> {
    const viewer = await requireAdmin();
    const symbol = String(formData.get('symbol') || '').trim().toUpperCase();
    const network = String(formData.get('network') || '').trim();
    const address = String(formData.get('address') || '').trim();
    const memo = String(formData.get('memo') || '').trim();

    if (!symbol) return { ok: false, message: 'Please select a currency symbol.' };
    if (!address) return { ok: false, message: 'Deposit address cannot be empty.' };

    try {
        await q`
            insert into deposit_addresses (symbol, network, address, memo, updated_at, updated_by)
            values (${symbol}, ${network}, ${address}, ${memo}, now(), ${viewer.user.email})
            on conflict (symbol) do update
            set network = excluded.network,
                address = excluded.address,
                memo = excluded.memo,
                updated_at = now(),
                updated_by = excluded.updated_by
        `;
        await audit(viewer, 'deposit_address.update', null, { symbol, network, address, memo });
    } catch (err) {
        return { ok: false, message: friendlyError(err) };
    }

    revalidatePath('/admin/wallets');
    revalidatePath('/dashboard/wallets/receive');
    return { ok: true, message: `Updated deposit address for ${symbol}.` };
}

