import { decideCompanyAction } from '@/app/actions/admin';
import { PageHeader, StatusPill } from '@/components/ui';
import { Icon } from '@/components/icons';
import { formatDate } from '@/lib/format';
import { listPendingCompanies } from '@/lib/queries';
import { requireAdmin } from '@/lib/session';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Filing queue' };

export default async function AdminFilingsPage() {
    await requireAdmin();
    const companies = await listPendingCompanies();

    const counts = {
        pending: companies.filter((company) => company.status === 'pending').length,
        processing: companies.filter((company) => company.status === 'processing').length,
        approved: companies.filter((company) => company.status === 'approved').length,
        rejected: companies.filter((company) => company.status === 'rejected').length
    };

    return (
        <div className="space-y-5">
            <PageHeader
                eyebrow="Admin · filings"
                title="Filing queue"
                description="Decide each application, leave a note the client can read, and the dashboard status updates immediately."
            />

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {(['pending', 'processing', 'approved', 'rejected'] as const).map((status) => (
                    <div key={status} className="card px-4 py-3">
                        <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-pine-900/45">{status}</p>
                        <p className="mono mt-1 text-xl font-semibold text-pine-950">{counts[status]}</p>
                    </div>
                ))}
            </div>

            {companies.length === 0 ? (
                <div className="card px-5 py-12 text-center">
                    <p className="display text-lg text-pine-950">No filings yet</p>
                    <p className="mt-1 text-sm text-pine-900/50">Applications appear here as soon as a client submits one.</p>
                </div>
            ) : (
                <ul className="space-y-4">
                    {companies.map((company) => (
                        <li key={company.id} className="card overflow-hidden">
                            <div className="flex flex-wrap items-start justify-between gap-3 border-b border-pine-900/10 px-4 py-4 sm:px-5">
                                <div>
                                    <div className="flex flex-wrap items-center gap-2">
                                        <h2 className="display text-lg text-pine-950">{company.company_name}</h2>
                                        <StatusPill status={company.status} />
                                    </div>
                                    <p className="mt-0.5 text-[12px] text-pine-900/50">
                                        {company.entity_type} · {company.formation_state} · submitted {formatDate(company.created_at)}
                                    </p>
                                    <p className="mt-1 text-[12px] text-pine-900/60">
                                        {company.owner_name || '—'} · {company.owner_email}
                                    </p>
                                </div>
                                <div className="text-right text-[12px] text-pine-900/55">
                                    <p>{company.first_name} {company.last_name}</p>
                                    <p>{company.email}</p>
                                    {company.phone ? <p>{company.phone}</p> : null}
                                </div>
                            </div>

                            <div className="grid gap-4 px-4 py-4 sm:grid-cols-2 sm:px-5">
                                <div>
                                    <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-pine-900/40">Address</p>
                                    <p className="mt-1 text-sm text-pine-950">{company.address}{company.unit ? `, ${company.unit}` : ''}</p>
                                    <p className="text-[12px] text-pine-900/55">{company.city}, {company.formation_state} {company.postal_code}</p>
                                    <p className="text-[12px] text-pine-900/55">{company.country}</p>
                                    {company.partner_code ? (
                                        <p className="mono mt-1 text-[11px] text-pine-900/40">partner {company.partner_code}</p>
                                    ) : null}
                                </div>

                                <form action={decideCompanyAction} className="space-y-2">
                                    <input type="hidden" name="companyId" value={company.id} />
                                    <label htmlFor={`note_${company.id}`} className="label">Reviewer note</label>
                                    <textarea
                                        id={`note_${company.id}`}
                                        name="note"
                                        rows={2}
                                        maxLength={400}
                                        defaultValue={company.review_note}
                                        className="field text-[13px]"
                                        placeholder="Visible to the client on their filing"
                                    />
                                    <div className="flex flex-wrap gap-2">
                                        <button type="submit" name="decision" value="processing" className="btn-outline btn-sm">
                                            Processing
                                        </button>
                                        <button type="submit" name="decision" value="approved" className="btn-primary btn-sm">
                                            <Icon name="check" className="h-4 w-4" />
                                            Approve
                                        </button>
                                        <button type="submit" name="decision" value="rejected" className="btn-danger btn-sm">
                                            Reject
                                        </button>
                                    </div>
                                    {company.reviewed_by ? (
                                        <p className="mono text-[10px] text-pine-900/40">
                                            last touched by {company.reviewed_by} · {formatDate(company.reviewed_at)}
                                        </p>
                                    ) : null}
                                </form>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
