'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { setUserStatusAction } from '@/app/actions/admin';
import { Icon } from '@/components/icons';
import { StatusPill } from '@/components/ui';
import { formatDate, initials } from '@/lib/format';
import type { AdminUserRow } from '@/lib/types';

export function UsersTable({ users, currentUserId }: { users: AdminUserRow[]; currentUserId: string }) {
    const [query, setQuery] = useState('');

    const filtered = useMemo(() => {
        const needle = query.trim().toLowerCase();
        if (!needle) return users;
        return users.filter(
            (user) =>
                user.email.toLowerCase().includes(needle) ||
                user.display_name.toLowerCase().includes(needle) ||
                user.id.toLowerCase().includes(needle)
        );
    }, [users, query]);

    return (
        <section className="card overflow-hidden">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-pine-900/10 px-4 py-3.5 sm:px-5">
                <div>
                    <p className="eyebrow">Accounts</p>
                    <h2 className="display text-lg text-pine-950">{filtered.length} of {users.length} users</h2>
                </div>
                <label className="relative block w-full max-w-[260px]">
                    <span className="sr-only">Search users</span>
                    <Icon name="search" className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-pine-900/40" />
                    <input
                        type="search"
                        value={query}
                        onChange={(event) => setQuery(event.target.value)}
                        placeholder="Name, email or id"
                        className="field field-sm pl-9"
                    />
                </label>
            </div>

            <div className="table-wrap hidden md:block">
                <table className="table">
                    <thead>
                        <tr>
                            <th scope="col">User</th>
                            <th scope="col">Status</th>
                            <th scope="col" className="text-right">Companies</th>
                            <th scope="col" className="text-right">Wallets</th>
                            <th scope="col" className="text-right">Assets</th>
                            <th scope="col">Joined</th>
                            <th scope="col" className="text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.map((user) => (
                            <tr key={user.id}>
                                <td>
                                    <div className="flex items-center gap-2.5">
                                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-pine-100 font-mono text-[10px] font-semibold text-pine-800">
                                            {initials(user.display_name, user.email)}
                                        </span>
                                        <div className="min-w-0">
                                            <p className="truncate font-semibold text-pine-950">
                                                {user.display_name || '—'}
                                                {user.is_admin ? <span className="ml-2 badge-neutral">admin</span> : null}
                                            </p>
                                            <p className="truncate text-[12px] text-pine-900/50">{user.email}</p>
                                        </div>
                                    </div>
                                </td>
                                <td><StatusPill status={user.status} /></td>
                                <td className="mono text-right tabular-nums">{user.company_count}</td>
                                <td className="mono text-right tabular-nums">{user.wallet_count}</td>
                                <td className="mono text-right tabular-nums">{user.symbols}</td>
                                <td className="text-[12px] text-pine-900/55">{formatDate(user.created_at)}</td>
                                <td>
                                    <div className="flex items-center justify-end gap-1.5">
                                        <Link href={`/admin/users/${user.id}`} className="btn-outline btn-sm">Manage</Link>
                                        {user.id === currentUserId ? null : (
                                            <form action={setUserStatusAction}>
                                                <input type="hidden" name="userId" value={user.id} />
                                                <input type="hidden" name="status" value={user.status === 'active' ? 'inactive' : 'active'} />
                                                <button
                                                    type="submit"
                                                    className={user.status === 'active' ? 'btn-danger btn-sm' : 'btn-ghost btn-sm'}
                                                    title={user.status === 'active' ? 'Deactivate account' : 'Reactivate account'}
                                                >
                                                    {user.status === 'active' ? 'Deactivate' : 'Reactivate'}
                                                </button>
                                            </form>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <ul className="divide-y divide-pine-900/5 md:hidden">
                {filtered.map((user) => (
                    <li key={user.id} className="px-4 py-4">
                        <div className="flex items-start justify-between gap-3">
                            <div className="flex min-w-0 items-center gap-2.5">
                                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-pine-100 font-mono text-[10px] font-semibold text-pine-800">
                                    {initials(user.display_name, user.email)}
                                </span>
                                <div className="min-w-0">
                                    <p className="truncate font-semibold text-pine-950">{user.display_name || '—'}</p>
                                    <p className="truncate text-[12px] text-pine-900/50">{user.email}</p>
                                </div>
                            </div>
                            <StatusPill status={user.status} />
                        </div>
                        <p className="mono mt-2 text-[11px] text-pine-900/45">
                            {user.company_count} companies · {user.wallet_count} wallets · {user.symbols} assets
                        </p>
                        <div className="mt-3 flex gap-2">
                            <Link href={`/admin/users/${user.id}`} className="btn-outline btn-sm flex-1">Manage</Link>
                            {user.id === currentUserId ? null : (
                                <form action={setUserStatusAction} className="flex-1">
                                    <input type="hidden" name="userId" value={user.id} />
                                    <input type="hidden" name="status" value={user.status === 'active' ? 'inactive' : 'active'} />
                                    <button type="submit" className={user.status === 'active' ? 'btn-danger btn-sm w-full' : 'btn-ghost btn-sm w-full'}>
                                        {user.status === 'active' ? 'Deactivate' : 'Reactivate'}
                                    </button>
                                </form>
                            )}
                        </div>
                    </li>
                ))}
            </ul>

            {filtered.length === 0 ? <p className="px-5 py-8 text-center text-sm text-pine-900/50">No account matches “{query}”.</p> : null}
        </section>
    );
}
