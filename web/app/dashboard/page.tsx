import Link from 'next/link';
import { BalanceBoard } from '@/components/portal/BalanceBoard';
import { PageHeader, StatusPill } from '@/components/ui';
import { Icon } from '@/components/icons';
import { formatDate } from '@/lib/format';
import { getBalances, listCompanies, listWallets } from '@/lib/queries';
import { requireUser } from '@/lib/session';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Overview' };

function truncate(value: string, head = 8, tail = 6) {
    if (!value || value.length <= head + tail + 1) return value;
    return `${value.slice(0, head)}…${value.slice(-tail)}`;
}

export default async function DashboardPage() {
    const viewer = await requireUser();
    const [balances, companies, wallets] = await Promise.all([
        getBalances(viewer.user.id),
        listCompanies(viewer.user.id),
        listWallets(viewer.user.id)
    ]);

    const firstName = (viewer.user.displayName || viewer.user.email).split(/\s+/)[0];
    const approved = companies.filter((company) => company.status === 'approved').length;

    return (
        <div className="space-y-5">
            <PageHeader
                eyebrow={`Workspace · ${viewer.user.email}`}
                title={`Good to see you, ${firstName}`}
                description="Filings, annual reports and linked wallets, kept in one place. Every value here is read-only."
                action={
                    <Link href="/dashboard/filings" className="btn-primary btn-sm">
                        <Icon name="filings" className="h-4 w-4" />
                        New filing
                    </Link>
                }
            />

            <div className="grid gap-3 sm:grid-cols-3">
                <div className="card px-4 py-3.5">
                    <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-pine-900/45">Companies</p>
                    <p className="mono mt-1 text-2xl font-semibold text-pine-950">{companies.length}</p>
                    <p className="mt-0.5 text-[11px] text-pine-900/45">{approved} approved</p>
                </div>
                <div className="card px-4 py-3.5">
                    <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-pine-900/45">Linked wallets</p>
                    <p className="mono mt-1 text-2xl font-semibold text-pine-950">{wallets.length}</p>
                    <p className="mt-0.5 text-[11px] text-pine-900/45">addresses derived, never signed</p>
                </div>
                <div className="card px-4 py-3.5">
                    <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-pine-900/45">Account</p>
                    <div className="mt-1.5">
                        <StatusPill status={viewer.user.status} />
                    </div>
                    <p className="mt-1.5 text-[11px] text-pine-900/45">since {formatDate(wallets[0]?.created_at ?? companies[0]?.created_at ?? null)}</p>
                </div>
            </div>

            <div className="grid gap-5 lg:grid-cols-[1.55fr_1fr]">
                <div className="space-y-5">
                    <BalanceBoard balances={balances} />

                    <section className="card" aria-labelledby="filings-heading">
                        <div className="flex items-center justify-between gap-3 border-b border-pine-900/10 px-5 py-4">
                            <div>
                                <p className="eyebrow">Filings</p>
                                <h2 id="filings-heading" className="display text-lg text-pine-950">Your companies</h2>
                            </div>
                            <Link href="/dashboard/filings" className="text-[12px] font-semibold text-pine-700 hover:underline">
                                View all
                            </Link>
                        </div>

                        {companies.length === 0 ? (
                            <div className="px-5 py-8 text-center">
                                <p className="text-sm text-pine-900/60">No company on file yet.</p>
                                <Link href="/dashboard/filings" className="btn-outline btn-sm mt-3">
                                    Form a Wyoming LLC
                                </Link>
                            </div>
                        ) : (
                            <ul className="divide-y divide-pine-900/5">
                                {companies.slice(0, 3).map((company) => (
                                    <li key={company.id} className="flex items-center justify-between gap-3 px-5 py-3.5">
                                        <div className="min-w-0">
                                            <p className="truncate font-semibold text-pine-950">{company.company_name}</p>
                                            <p className="mt-0.5 text-[12px] text-pine-900/50">
                                                {company.formation_state} · {company.entity_type} · filed {formatDate(company.created_at)}
                                            </p>
                                        </div>
                                        <StatusPill status={company.status} />
                                    </li>
                                ))}
                            </ul>
                        )}
                    </section>
                </div>

                <div className="space-y-5">
                    <section className="card" aria-labelledby="wallets-heading">
                        <div className="flex items-center justify-between gap-3 border-b border-pine-900/10 px-5 py-4">
                            <div>
                                <p className="eyebrow">Wallets</p>
                                <h2 id="wallets-heading" className="display text-lg text-pine-950">Linked addresses</h2>
                            </div>
                            <Link href="/dashboard/wallets" className="text-[12px] font-semibold text-pine-700 hover:underline">
                                Manage
                            </Link>
                        </div>

                        {wallets.length === 0 ? (
                            <div className="px-5 py-8 text-center">
                                <p className="text-sm text-pine-900/60">No wallet linked yet.</p>
                                <Link href="/dashboard/wallets" className="btn-outline btn-sm mt-3">
                                    Link a wallet
                                </Link>
                            </div>
                        ) : (
                            <ul className="divide-y divide-pine-900/5">
                                {wallets.slice(0, 3).map((wallet) => (
                                    <li key={wallet.id} className="px-5 py-3.5">
                                        <div className="flex items-center justify-between gap-2">
                                            <p className="text-[13px] font-semibold text-pine-950">
                                                {wallet.provider || wallet.selected_wallet || 'Wallet'}
                                            </p>
                                            <span className="badge-neutral">{wallet.link_method}</span>
                                        </div>
                                        <p className="mono mt-1 text-[11px] text-pine-900/55" title={wallet.primary_address}>
                                            {truncate(wallet.primary_address)}
                                        </p>
                                        <p className="mt-1 text-[11px] text-pine-900/40">
                                            {wallet.word_count}-word phrase · added {formatDate(wallet.created_at)}
                                        </p>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </section>

                    <section className="card px-5 py-5">
                        <p className="eyebrow">Account record</p>
                        <dl className="mt-3 space-y-2.5 text-sm">
                            <div className="flex items-baseline justify-between gap-3">
                                <dt className="text-pine-900/55">Name</dt>
                                <dd className="truncate font-medium text-pine-950">{viewer.user.displayName || '—'}</dd>
                            </div>
                            <div className="flex items-baseline justify-between gap-3">
                                <dt className="text-pine-900/55">Email</dt>
                                <dd className="truncate font-medium text-pine-950">{viewer.user.email}</dd>
                            </div>
                            <div className="flex items-baseline justify-between gap-3">
                                <dt className="text-pine-900/55">Access</dt>
                                <dd>{viewer.user.isAdmin ? <span className="badge-neutral">administrator</span> : <StatusPill status={viewer.user.status} />}</dd>
                            </div>
                        </dl>
                        <div className="mt-4 grid gap-2">
                            <Link href="/dashboard/account" className="btn-outline btn-sm w-full">Account settings</Link>
                            {viewer.user.isAdmin && !viewer.impersonator ? (
                                <Link href="/admin" className="btn-primary btn-sm w-full">
                                    <Icon name="admin" className="h-4 w-4" />
                                    Admin console
                                </Link>
                            ) : null}
                        </div>
                    </section>

                    <div className="rounded-card border border-pine-900/10 bg-pine-50/60 px-5 py-4 text-[12px] leading-relaxed text-pine-900/65">
                        <p className="flex items-center gap-2 font-semibold text-pine-900/80">
                            <Icon name="shield" className="h-4 w-4" />
                            Read-only observer
                        </p>
                        <p className="mt-1.5">
                            This portal derives addresses from a recovery phrase and displays balances. It never builds, signs or broadcasts a
                            transaction, and it cannot move funds.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
