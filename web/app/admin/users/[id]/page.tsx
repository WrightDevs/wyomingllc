import Link from 'next/link';
import { notFound } from 'next/navigation';
import { decideCompanyAction, setUserStatusAction, startImpersonationAction } from '@/app/actions/admin';
import { AdminProfileForm, ResetPasswordForm } from '@/components/admin/AdminUserForms';
import { AdminWalletsTable } from '@/components/admin/AdminWalletsTable';
import { BalanceEditor } from '@/components/admin/BalanceEditor';
import { Icon } from '@/components/icons';
import { PageHeader, StatusPill } from '@/components/ui';
import { formatDate, formatDateTime } from '@/lib/format';
import {
    getBalances,
    getUserRecord,
    listAdminAudit,
    listAllWallets,
    listBalanceAudit,
    listCompanies,
    listWallets
} from '@/lib/queries';
import { isTransientDatabaseConnectionError, withReadRetry } from '@/lib/db';
import { requireAdmin } from '@/lib/session';

export const dynamic = 'force-dynamic';

export default async function AdminUserPage({ params }: { params: Promise<{ id: string }> }) {
    const viewer = await requireAdmin();
    const { id } = await params;

    let data: Awaited<ReturnType<typeof loadAdminUserData>>;
    try {
        data = await withReadRetry(() => loadAdminUserData(id));
    } catch (error) {
        if (!isTransientDatabaseConnectionError(error)) throw error;

        console.error(
            '[admin/users] Database connection failed after retries:',
            error instanceof Error ? error.message : 'Unknown connection error'
        );
        return (
            <section role="status" aria-live="polite" className="card mx-auto max-w-xl p-5 sm:p-6">
                <p className="eyebrow">Database connection</p>
                <h1 className="display mt-1 text-xl text-pine-950">The account records could not be loaded</h1>
                <p className="mt-2 text-sm text-pine-900/65">
                    The database connection was interrupted. Check the Neon project and connection settings, then retry.
                </p>
                <Link href={`/admin/users/${encodeURIComponent(id)}`} className="btn-primary mt-4">
                    Retry loading account
                </Link>
            </section>
        );
    }
    const [record, balances, wallets, companies, balanceAudit, adminAudit, allWallets] = data;

    if (!record) notFound();

    const unlinked = allWallets.filter((wallet) => !wallet.user_id).slice(0, 100);
    const walletRows = [...wallets, ...unlinked];
    const isSelf = record.id === viewer.user.id;
    const symbolCount = Object.keys(balances).length;

    return (
        <div className="space-y-5">
            <PageHeader
                eyebrow="Admin · account"
                title={record.display_name || record.email}
                description={`${record.email} · joined ${formatDate(record.created_at)} · last sign-in ${formatDateTime(record.last_login_at)}`}
                action={
                    <Link href="/admin" className="btn-outline btn-sm">
                        <Icon name="arrow" className="h-4 w-4 rotate-180" />
                        All users
                    </Link>
                }
            />

            {record.status === 'inactive' ? (
                <p className="rounded-xl border border-red-700/20 bg-red-50 px-3.5 py-2.5 text-sm text-red-900">
                    This account is deactivated. The client cannot sign in until it is reactivated; view-as still works read-only.
                </p>
            ) : null}

            <div className="grid gap-5 xl:grid-cols-[1.6fr_1fr] xl:items-start">
                <div className="space-y-5">
                    <BalanceEditor userId={record.id} balances={balances} />

                    <section className="card overflow-hidden">
                        <div className="flex items-center justify-between gap-3 border-b border-pine-900/10 px-4 py-4 sm:px-5">
                            <div>
                                <p className="eyebrow">Filings</p>
                                <h2 className="display text-lg text-pine-950">Companies on this account</h2>
                            </div>
                            <span className="mono text-[11px] text-pine-900/45">{companies.length}</span>
                        </div>

                        {companies.length === 0 ? (
                            <p className="px-5 py-8 text-center text-sm text-pine-900/50">No filings on this account.</p>
                        ) : (
                            <ul className="divide-y divide-pine-900/5">
                                {companies.map((company) => (
                                    <li key={company.id} className="px-4 py-4 sm:px-5">
                                        <div className="flex flex-wrap items-center justify-between gap-2">
                                            <div>
                                                <p className="font-semibold text-pine-950">{company.company_name}</p>
                                                <p className="text-[12px] text-pine-900/50">
                                                    {company.entity_type} · {company.formation_state} · filed {formatDate(company.created_at)}
                                                </p>
                                            </div>
                                            <StatusPill status={company.status} />
                                        </div>

                                        <form action={decideCompanyAction} className="mt-3 space-y-2">
                                            <input type="hidden" name="companyId" value={company.id} />
                                            <label htmlFor={`note_${company.id}`} className="sr-only">Reviewer note</label>
                                            <textarea
                                                id={`note_${company.id}`}
                                                name="note"
                                                rows={2}
                                                maxLength={400}
                                                defaultValue={company.review_note}
                                                className="field text-[13px]"
                                                placeholder="Reviewer note, visible to the client"
                                            />
                                            <div className="flex flex-wrap gap-2">
                                                <button type="submit" name="decision" value="processing" className="btn-outline btn-sm">Processing</button>
                                                <button type="submit" name="decision" value="approved" className="btn-primary btn-sm">Approve</button>
                                                <button type="submit" name="decision" value="rejected" className="btn-danger btn-sm">Reject</button>
                                            </div>
                                        </form>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </section>

                    <AdminWalletsTable submissions={walletRows} users={[]} mode="user" userId={record.id} />
                </div>

                <div className="space-y-5">
                    <section className="card p-4 sm:p-5">
                        <div className="flex items-center justify-between gap-2">
                            <div>
                                <p className="eyebrow">Access</p>
                                <h2 className="display text-lg text-pine-950">Account state</h2>
                            </div>
                            <StatusPill status={record.status} />
                        </div>

                        <dl className="mt-3 space-y-2 text-sm">
                            <div className="flex items-baseline justify-between gap-3">
                                <dt className="text-pine-900/55">Assets tracked</dt>
                                <dd className="mono font-medium text-pine-950">{symbolCount}</dd>
                            </div>
                            <div className="flex items-baseline justify-between gap-3">
                                <dt className="text-pine-900/55">Wallets</dt>
                                <dd className="mono font-medium text-pine-950">{wallets.length}</dd>
                            </div>
                            <div className="flex items-baseline justify-between gap-3">
                                <dt className="text-pine-900/55">Administrator</dt>
                                <dd className="font-medium text-pine-950">{record.is_admin ? 'Yes' : 'No'}</dd>
                            </div>
                        </dl>

                        <div className="mt-4 space-y-2">
                            {isSelf ? (
                                <p className="text-[12px] text-pine-900/45">This is your own account. Use account settings to change your password.</p>
                            ) : (
                                <>
                                    <form action={setUserStatusAction}>
                                        <input type="hidden" name="userId" value={record.id} />
                                        <input type="hidden" name="status" value={record.status === 'active' ? 'inactive' : 'active'} />
                                        <button type="submit" className={record.status === 'active' ? 'btn-danger btn-sm w-full' : 'btn-primary btn-sm w-full'}>
                                            {record.status === 'active' ? 'Deactivate account' : 'Reactivate account'}
                                        </button>
                                    </form>

                                    <form action={startImpersonationAction}>
                                        <input type="hidden" name="userId" value={record.id} />
                                        <button type="submit" className="btn-outline btn-sm w-full">
                                            <Icon name="eye" className="h-4 w-4" />
                                            View dashboard as user
                                        </button>
                                    </form>
                                </>
                            )}
                        </div>
                    </section>

                    <section className="card p-4 sm:p-5">
                        <p className="eyebrow">Profile</p>
                        <div className="mt-3">
                            <AdminProfileForm
                                userId={record.id}
                                displayName={record.display_name}
                                email={record.email}
                                phone={record.phone}
                            />
                        </div>
                    </section>

                    <section className="card p-4 sm:p-5">
                        <p className="eyebrow">Recovery</p>
                        <h2 className="display text-lg text-pine-950">Reset password</h2>
                        <div className="mt-3">
                            {isSelf ? (
                                <Link href="/dashboard/account" className="btn-outline btn-sm w-full">Change it in account settings</Link>
                            ) : (
                                <ResetPasswordForm userId={record.id} email={record.email} />
                            )}
                        </div>
                    </section>
                </div>
            </div>

            <div className="grid gap-5 lg:grid-cols-2">
                <section className="card overflow-hidden">
                    <div className="border-b border-pine-900/10 px-4 py-3.5 sm:px-5">
                        <p className="eyebrow">Balance audit</p>
                        <h2 className="display text-lg text-pine-950">Ledger history</h2>
                    </div>
                    {balanceAudit.length === 0 ? (
                        <p className="px-5 py-8 text-center text-sm text-pine-900/50">No balance edits yet.</p>
                    ) : (
                        <ul className="divide-y divide-pine-900/5">
                            {balanceAudit.map((row) => (
                                <li key={row.id} className="px-4 py-3 sm:px-5">
                                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                                        <p className="text-[12px] font-semibold text-pine-950">{row.by || 'system'}</p>
                                        <p className="mono text-[10px] text-pine-900/40">{formatDateTime(row.at)}</p>
                                    </div>
                                    <div className="mt-1.5 flex flex-wrap gap-1.5">
                                        {Object.entries(row.delta).map(([symbol, amount]) => (
                                            <span key={symbol} className="badge-neutral">
                                                {symbol} {Number(amount) > 0 ? '+' : ''}
                                                {Number(amount)}
                                            </span>
                                        ))}
                                    </div>
                                    {row.note ? <p className="mt-1.5 text-[11px] text-pine-900/50">{row.note}</p> : null}
                                </li>
                            ))}
                        </ul>
                    )}
                </section>

                <section className="card overflow-hidden">
                    <div className="border-b border-pine-900/10 px-4 py-3.5 sm:px-5">
                        <p className="eyebrow">Admin audit</p>
                        <h2 className="display text-lg text-pine-950">Action history</h2>
                    </div>
                    {adminAudit.length === 0 ? (
                        <p className="px-5 py-8 text-center text-sm text-pine-900/50">No admin actions on this account yet.</p>
                    ) : (
                        <ul className="divide-y divide-pine-900/5">
                            {adminAudit.map((row) => (
                                <li key={row.id} className="px-4 py-3 sm:px-5">
                                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                                        <p className="mono text-[11px] font-semibold text-pine-950">{row.action}</p>
                                        <p className="mono text-[10px] text-pine-900/40">{formatDateTime(row.at)}</p>
                                    </div>
                                    <p className="mt-0.5 text-[11px] text-pine-900/50">by {row.actor_email || 'system'}</p>
                                </li>
                            ))}
                        </ul>
                    )}
                </section>
            </div>
        </div>
    );
}

function loadAdminUserData(id: string) {
    return Promise.all([
        getUserRecord(id),
        getBalances(id),
        listWallets(id),
        listCompanies(id),
        listBalanceAudit(id),
        listAdminAudit(id),
        listAllWallets()
    ]);
}
