import Link from 'next/link';
import { StatusPill } from '@/components/ui';
import { formatDate } from '@/lib/format';
import { listCompanies } from '@/lib/queries';
import { requireUser } from '@/lib/session';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Dashboard — Wyoming Attorney' };

export default async function DashboardPage() {
    const viewer = await requireUser();
    const companies = await listCompanies(viewer.user.id);

    const firstName = (viewer.user.displayName || viewer.user.email.split('@')[0]).split(/\s+/)[0];
    const approved = companies.filter((c) => c.status === 'approved').length;
    const pending = companies.filter((c) => c.status === 'pending').length;

    return (
        <div className="space-y-6">
            {/* Top 3 Navigation Quick Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* 1. Overview Card (Selected / Navy Blue) */}
                <Link
                    href="/dashboard"
                    className="p-4 rounded-xl bg-[#1e3a8a] text-white flex items-center gap-3.5 shadow-sm hover:brightness-105 transition-all"
                >
                    <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                        </svg>
                    </div>
                    <div>
                        <h3 className="text-[15px] font-bold leading-tight">Overview</h3>
                        <p className="text-[12px] text-white/80 mt-0.5">View your portfolio summary</p>
                    </div>
                </Link>

                {/* 2. LLC Management Card */}
                <Link
                    href="/dashboard/filings"
                    className="p-4 rounded-xl bg-white border border-[#e5e7eb] text-[#0f172a] flex items-center gap-3.5 shadow-sm hover:border-[#2563eb] transition-all"
                >
                    <div className="w-10 h-10 rounded-lg bg-[#eff6ff] flex items-center justify-center flex-shrink-0 text-[#2563eb]">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                    </div>
                    <div>
                        <h3 className="text-[15px] font-bold leading-tight">LLC Management</h3>
                        <p className="text-[12px] text-[#6b7280] mt-0.5">Manage all your companies</p>
                    </div>
                </Link>

                {/* 3. Manage Crypto Assets Card */}
                <Link
                    href="/dashboard/wallets"
                    className="p-4 rounded-xl bg-white border border-[#e5e7eb] text-[#0f172a] flex items-center justify-between shadow-sm hover:border-[#2563eb] transition-all group"
                >
                    <div className="flex items-center gap-3.5">
                        <div className="w-10 h-10 rounded-lg bg-[#eff6ff] flex items-center justify-center flex-shrink-0 text-[#2563eb]">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <div>
                            <h3 className="text-[15px] font-bold leading-tight">Manage Crypto Assets</h3>
                            <p className="text-[12px] text-[#6b7280] mt-0.5">Open your digital asset wallet</p>
                        </div>
                    </div>
                    <svg className="w-4 h-4 text-[#9ca3af] group-hover:translate-x-1 group-hover:text-[#2563eb] transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                </Link>
            </div>

            {/* Headline Section */}
            <div>
                <h1 className="text-[26px] font-bold text-[#0f172a] leading-tight">
                    Welcome back, {firstName}!
                </h1>
                <p className="text-[14px] text-[#6b7280] mt-1">
                    Here&apos;s your LLC portfolio overview.
                </p>
            </div>

            {/* 3 Metric Cards with Accent Left Borders */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {/* 1. Total LLCs */}
                <div className="bg-white rounded-xl border border-[#e5e7eb] border-l-4 border-l-[#1e3a8a] p-5 shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-[12px] font-medium text-[#6b7280]">Total LLCs</p>
                        <p className="text-[28px] font-extrabold text-[#0f172a] mt-0.5 leading-none">{companies.length}</p>
                        <p className="text-[11px] text-[#6b7280] mt-2">Your LLC applications</p>
                    </div>
                    <div className="w-10 h-10 rounded-lg bg-[#eff6ff] flex items-center justify-center text-[#2563eb]">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                    </div>
                </div>

                {/* 2. Approved LLCs */}
                <div className="bg-white rounded-xl border border-[#e5e7eb] border-l-4 border-l-[#22c55e] p-5 shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-[12px] font-medium text-[#6b7280]">Approved LLCs</p>
                        <p className="text-[28px] font-extrabold text-[#0f172a] mt-0.5 leading-none">{approved}</p>
                        <p className="text-[11px] text-[#6b7280] mt-2">Active businesses</p>
                    </div>
                    <div className="w-10 h-10 rounded-lg bg-[#f0fdf4] flex items-center justify-center text-[#22c55e]">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                </div>

                {/* 3. Pending LLCs */}
                <div className="bg-white rounded-xl border border-[#e5e7eb] border-l-4 border-l-[#f59e0b] p-5 shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-[12px] font-medium text-[#6b7280]">Pending LLCs</p>
                        <p className="text-[28px] font-extrabold text-[#0f172a] mt-0.5 leading-none">{pending}</p>
                        <p className="text-[11px] text-[#6b7280] mt-2">Under review</p>
                    </div>
                    <div className="w-10 h-10 rounded-lg bg-[#fffbeb] flex items-center justify-center text-[#f59e0b]">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                </div>
            </div>

            {/* Applications Section */}
            <div className="bg-white rounded-xl border border-[#e5e7eb] shadow-sm overflow-hidden">
                <div className="p-5 flex items-center justify-between border-b border-[#e5e7eb]">
                    <h2 className="text-[16px] font-bold text-[#0f172a]">Your LLC Applications</h2>
                    <Link
                        href="/register"
                        className="h-10 px-5 rounded-lg bg-[#1e3a8a] hover:bg-[#2563eb] text-white text-[14px] font-semibold flex items-center justify-center transition-colors shadow-sm"
                    >
                        Form New LLC
                    </Link>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-[#e5e7eb] text-[12px] font-semibold text-[#6b7280]">
                                <th className="py-3.5 px-5">Company Name</th>
                                <th className="py-3.5 px-5">Entity Type</th>
                                <th className="py-3.5 px-5">State</th>
                                <th className="py-3.5 px-5">Status</th>
                                <th className="py-3.5 px-5">Applied</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#e5e7eb] text-[14px] text-[#0f172a]">
                            {companies.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="py-8 text-center text-[#6b7280]">
                                        <p className="font-medium text-[#0f172a]">No applications filed yet</p>
                                        <p className="text-[12px] mt-1">Click &ldquo;Form New LLC&rdquo; to start your first Wyoming company.</p>
                                    </td>
                                </tr>
                            ) : (
                                companies.map((c) => (
                                    <tr key={c.id} className="hover:bg-[#f9fafb] transition-colors">
                                        <td className="py-4 px-5 font-semibold text-[#0f172a]">{c.company_name}</td>
                                        <td className="py-4 px-5 text-[#4b5563]">{c.entity_type || 'Limited Liability Company (LLC)'}</td>
                                        <td className="py-4 px-5 text-[#4b5563]">{c.formation_state || 'Wyoming'}</td>
                                        <td className="py-4 px-5">
                                            {c.status === 'pending' ? (
                                                <span className="inline-block px-2.5 py-0.5 rounded-full text-[12px] font-medium bg-[#fef3c7] text-[#92400e]">
                                                    Pending
                                                </span>
                                            ) : c.status === 'approved' ? (
                                                <span className="inline-block px-2.5 py-0.5 rounded-full text-[12px] font-medium bg-[#dcfce7] text-[#166534]">
                                                    Approved
                                                </span>
                                            ) : (
                                                <StatusPill status={c.status} />
                                            )}
                                        </td>
                                        <td className="py-4 px-5 text-[#6b7280] text-[13px]">
                                            {formatDate(c.created_at)}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
