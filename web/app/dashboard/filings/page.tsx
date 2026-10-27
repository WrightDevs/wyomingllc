import Link from 'next/link';
import { CompanyForm } from '@/components/portal/CompanyForm';
import { Icon } from '@/components/icons';
import { PageHeader, StatusPill } from '@/components/ui';
import { formatDate } from '@/lib/format';
import { listCompanies } from '@/lib/queries';
import { requireUser } from '@/lib/session';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Filings' };

export default async function FilingsPage({ searchParams }: { searchParams: Promise<{ created?: string }> }) {
    const viewer = await requireUser();
    const companies = await listCompanies(viewer.user.id);
    const params = await searchParams;

    return (
        <div className="space-y-5">
            <PageHeader
                eyebrow="Filings"
                title="Companies & applications"
                description="Every Wyoming entity on this account, with its current review status. Add as many as you need."
            />

            {params.created ? (
                <p role="status" className="rounded-xl border border-emerald-700/20 bg-emerald-50 px-3.5 py-2.5 text-sm text-emerald-900">
                    Filing received. It is queued for review — the status below updates as it moves.
                </p>
            ) : null}

            {viewer.impersonator ? (
                <p className="rounded-xl border border-amber-700/25 bg-amber-50 px-3.5 py-2.5 text-sm text-amber-950">
                    View-as mode is read-only. Exit the view to create or change filings.
                </p>
            ) : null}

            <div className="grid gap-5 lg:grid-cols-[1.35fr_1fr] lg:items-start">
                <div className="space-y-4">
                    {companies.length === 0 ? (
                        <div className="card px-5 py-10 text-center">
                            <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-pine-50 text-pine-700">
                                <Icon name="building" />
                            </div>
                            <h2 className="display text-lg text-pine-950">No company on file</h2>
                            <p className="mx-auto mt-1 max-w-sm text-sm text-pine-900/55">
                                Use the form to start a Wyoming filing. You can add another entity at any time.
                            </p>
                            <a href="#new-filing" className="btn-outline btn-sm mt-4">Start a filing</a>
                        </div>
                    ) : (
                        companies.map((company) => (
                            <article key={company.id} className="card overflow-hidden">
                                <div className="flex flex-wrap items-start justify-between gap-3 border-b border-pine-900/10 px-5 py-4">
                                    <div>
                                        <h2 className="display text-lg text-pine-950">{company.company_name}</h2>
                                        <p className="mt-0.5 text-[12px] text-pine-900/50">
                                            {company.entity_type} · {company.formation_state} · filed {formatDate(company.created_at)}
                                        </p>
                                    </div>
                                    <StatusPill status={company.status} />
                                </div>

                                <div className="grid gap-x-6 gap-y-3 px-5 py-4 sm:grid-cols-2">
                                    <div>
                                        <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-pine-900/40">Registered contact</p>
                                        <p className="mt-1 text-sm text-pine-950">
                                            {company.first_name} {company.last_name}
                                        </p>
                                        <p className="text-[12px] text-pine-900/55">{company.email}</p>
                                        {company.phone ? <p className="text-[12px] text-pine-900/55">{company.phone}</p> : null}
                                    </div>
                                    <div>
                                        <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-pine-900/40">Address</p>
                                        <p className="mt-1 text-sm text-pine-950">{company.address}{company.unit ? `, ${company.unit}` : ''}</p>
                                        <p className="text-[12px] text-pine-900/55">
                                            {company.city}, {company.formation_state} {company.postal_code}
                                        </p>
                                        <p className="text-[12px] text-pine-900/55">{company.country}</p>
                                    </div>
                                </div>

                                {company.review_note ? (
                                    <div className="border-t border-pine-900/10 bg-pine-50/60 px-5 py-3 text-[12px] text-pine-900/70">
                                        <span className="font-semibold text-pine-900">Reviewer note: </span>
                                        {company.review_note}
                                        {company.reviewed_at ? <span className="text-pine-900/40"> · {formatDate(company.reviewed_at)}</span> : null}
                                    </div>
                                ) : null}
                            </article>
                        ))
                    )}

                    <div className="rounded-card border border-pine-900/10 bg-pine-50/60 px-5 py-4 text-[12px] leading-relaxed text-pine-900/60">
                        <p className="font-semibold text-pine-900/80">What happens next</p>
                        <p className="mt-1">
                            A filing starts as <strong className="font-semibold">pending</strong>, moves to <strong className="font-semibold">processing</strong> while it is
                            checked, and ends <strong className="font-semibold">approved</strong> or <strong className="font-semibold">rejected</strong> with a note. Wyoming&apos;s
                            online filing fee is $102, paid to the state; the service fee is $99.
                        </p>
                    </div>
                </div>

                <div id="new-filing" className="scroll-mt-24 lg:sticky lg:top-6">
                    <CompanyForm />
                    <p className="mt-3 px-1 text-[11px] leading-relaxed text-pine-900/45">
                        Need to change a filed application?{' '}
                        <Link href="/dashboard/account" className="underline decoration-pine-900/20 underline-offset-2 hover:text-pine-900">
                            Message support from your account
                        </Link>
                        .
                    </p>
                </div>
            </div>
        </div>
    );
}
