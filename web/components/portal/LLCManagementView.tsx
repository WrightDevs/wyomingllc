'use client';

import { useState } from 'react';
import Link from 'next/link';
import { formatDate } from '@/lib/format';
import type { Company } from '@/lib/types';

interface LLCManagementViewProps {
    companies: Company[];
}

export function LLCManagementView({ companies }: LLCManagementViewProps) {
    const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);

    const approvedCount = companies.filter((c) => c.status === 'approved').length;
    const pendingCount = companies.filter((c) => c.status === 'pending').length;
    const processingCount = companies.filter((c) => c.status === 'processing').length;
    const rejectedCount = companies.filter((c) => c.status === 'rejected').length;

    return (
        <div className="space-y-6">
            {/* Top 3 Navigation Quick Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* 1. Overview Card */}
                <Link
                    href="/dashboard"
                    className="p-4 rounded-xl bg-white border border-[#e5e7eb] text-[#0f172a] flex items-center gap-3.5 shadow-sm hover:border-[#2563eb] transition-all"
                >
                    <div className="w-10 h-10 rounded-lg bg-[#eff6ff] flex items-center justify-center flex-shrink-0 text-[#2563eb]">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                        </svg>
                    </div>
                    <div>
                        <h3 className="text-[15px] font-bold leading-tight">Overview</h3>
                        <p className="text-[12px] text-[#6b7280] mt-0.5">View your portfolio summary</p>
                    </div>
                </Link>

                {/* 2. LLC Management Card (Selected / Navy Blue) */}
                <Link
                    href="/dashboard/filings"
                    className="p-4 rounded-xl bg-[#1e3a8a] text-white flex items-center gap-3.5 shadow-sm hover:brightness-105 transition-all"
                >
                    <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                    </div>
                    <div>
                        <h3 className="text-[15px] font-bold leading-tight">LLC Management</h3>
                        <p className="text-[12px] text-white/80 mt-0.5">Manage all your companies</p>
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

            {/* Title Section */}
            <div>
                <h1 className="text-[26px] font-bold text-[#0f172a] leading-tight">
                    LLC Management
                </h1>
                <p className="text-[14px] text-[#6b7280] mt-1">
                    Manage and track all your Limited Liability Companies.
                </p>
            </div>

            {/* 4 Status Metric Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {/* 1. Approved */}
                <div className="bg-white rounded-xl border border-[#e5e7eb] p-4 shadow-sm flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-[#f0fdf4] flex items-center justify-center text-[#22c55e] flex-shrink-0">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <div>
                        <p className="text-[22px] font-extrabold text-[#0f172a] leading-none">{approvedCount}</p>
                        <p className="text-[12px] text-[#6b7280] mt-1">Approved</p>
                    </div>
                </div>

                {/* 2. Pending */}
                <div className="bg-white rounded-xl border border-[#e5e7eb] p-4 shadow-sm flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-[#fffbeb] flex items-center justify-center text-[#f59e0b] flex-shrink-0">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <div>
                        <p className="text-[22px] font-extrabold text-[#0f172a] leading-none">{pendingCount}</p>
                        <p className="text-[12px] text-[#6b7280] mt-1">Pending</p>
                    </div>
                </div>

                {/* 3. Processing */}
                <div className="bg-white rounded-xl border border-[#e5e7eb] p-4 shadow-sm flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-[#eff6ff] flex items-center justify-center text-[#3b82f6] flex-shrink-0">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <div>
                        <p className="text-[22px] font-extrabold text-[#0f172a] leading-none">{processingCount}</p>
                        <p className="text-[12px] text-[#6b7280] mt-1">Processing</p>
                    </div>
                </div>

                {/* 4. Rejected */}
                <div className="bg-white rounded-xl border border-[#e5e7eb] p-4 shadow-sm flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-[#fef2f2] flex items-center justify-center text-[#ef4444] flex-shrink-0">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    </div>
                    <div>
                        <p className="text-[22px] font-extrabold text-[#0f172a] leading-none">{rejectedCount}</p>
                        <p className="text-[12px] text-[#6b7280] mt-1">Rejected</p>
                    </div>
                </div>
            </div>

            {/* All Your LLCs Table */}
            <div className="bg-white rounded-xl border border-[#e5e7eb] shadow-sm overflow-hidden">
                <div className="p-5 flex items-center justify-between border-b border-[#e5e7eb]">
                    <h2 className="text-[16px] font-bold text-[#0f172a]">All Your LLCs</h2>
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
                                <th className="py-3.5 px-5">Application Date</th>
                                <th className="py-3.5 px-5">State Fee</th>
                                <th className="py-3.5 px-5 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#e5e7eb] text-[14px] text-[#0f172a]">
                            {companies.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="py-8 text-center text-[#6b7280]">
                                        <p className="font-medium text-[#0f172a]">No LLCs formed yet</p>
                                        <p className="text-[12px] mt-1">Click &ldquo;Form New LLC&rdquo; to begin your filing.</p>
                                    </td>
                                </tr>
                            ) : (
                                companies.map((c) => (
                                    <tr
                                        key={c.id}
                                        onClick={() => setSelectedCompany(c)}
                                        className="hover:bg-[#f9fafb] cursor-pointer transition-colors"
                                    >
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
                                            ) : c.status === 'processing' ? (
                                                <span className="inline-block px-2.5 py-0.5 rounded-full text-[12px] font-medium bg-[#dbeafe] text-[#1e40af]">
                                                    Processing
                                                </span>
                                            ) : (
                                                <span className="inline-block px-2.5 py-0.5 rounded-full text-[12px] font-medium bg-[#fee2e2] text-[#991b1b]">
                                                    Rejected
                                                </span>
                                            )}
                                        </td>
                                        <td className="py-4 px-5 text-[#6b7280] text-[13px]">
                                            {formatDate(c.created_at)}
                                        </td>
                                        <td className="py-4 px-5 text-[#0f172a] font-medium">
                                            $100.00
                                        </td>
                                        <td className="py-4 px-5 text-right">
                                            <button
                                                type="button"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setSelectedCompany(c);
                                                }}
                                                className="text-[12px] font-semibold text-[#2563eb] hover:underline"
                                            >
                                                View Details →
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Company Detail Drawer / Modal */}
            {selectedCompany && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
                    onClick={() => setSelectedCompany(null)}
                >
                    <div
                        className="bg-white rounded-2xl max-w-xl w-full p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between pb-4 border-b border-[#e5e7eb]">
                            <div>
                                <h3 className="text-[20px] font-bold text-[#0f172a]">
                                    {selectedCompany.company_name}
                                </h3>
                                <p className="text-[13px] text-[#6b7280] mt-0.5">
                                    {selectedCompany.entity_type} · {selectedCompany.formation_state}
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setSelectedCompany(null)}
                                className="w-8 h-8 rounded-full bg-[#f3f4f6] text-[#4b5563] flex items-center justify-center hover:bg-[#e5e7eb]"
                                aria-label="Close"
                            >
                                ✕
                            </button>
                        </div>

                        <div className="py-5 space-y-4 text-[14px]">
                            <div className="grid grid-cols-2 gap-4 pb-4 border-b border-[#e5e7eb]">
                                <div>
                                    <p className="text-[12px] text-[#6b7280] uppercase font-semibold">Filing Status</p>
                                    <p className="font-semibold text-[#0f172a] mt-1 capitalize">{selectedCompany.status}</p>
                                </div>
                                <div>
                                    <p className="text-[12px] text-[#6b7280] uppercase font-semibold">Application Date</p>
                                    <p className="font-medium text-[#0f172a] mt-1">{formatDate(selectedCompany.created_at)}</p>
                                </div>
                            </div>

                            <div className="space-y-1 pb-4 border-b border-[#e5e7eb]">
                                <p className="text-[12px] text-[#6b7280] uppercase font-semibold">Registered Contact Officer</p>
                                <p className="font-semibold text-[#0f172a]">
                                    {selectedCompany.first_name} {selectedCompany.last_name}
                                </p>
                                <p className="text-[#4b5563]">{selectedCompany.email}</p>
                                {selectedCompany.phone && <p className="text-[#4b5563]">{selectedCompany.phone}</p>}
                            </div>

                            <div className="space-y-1 pb-4 border-b border-[#e5e7eb]">
                                <p className="text-[12px] text-[#6b7280] uppercase font-semibold">Physical Registered Address</p>
                                <p className="font-medium text-[#0f172a]">
                                    {selectedCompany.address}
                                    {selectedCompany.unit ? `, ${selectedCompany.unit}` : ''}
                                </p>
                                <p className="text-[#4b5563]">
                                    {selectedCompany.city}, {selectedCompany.formation_state} {selectedCompany.postal_code}
                                </p>
                                <p className="text-[#4b5563]">{selectedCompany.country}</p>
                            </div>

                            {selectedCompany.review_note && (
                                <div className="p-3 bg-[#eff6ff] rounded-lg border border-[#bfdbfe]">
                                    <p className="text-[12px] font-semibold text-[#1e40af]">State Examiner Note</p>
                                    <p className="text-[13px] text-[#1e3a8a] mt-1">{selectedCompany.review_note}</p>
                                </div>
                            )}

                            <div className="pt-2 flex justify-between items-center text-[13px] text-[#6b7280]">
                                <span>State Filing Fee: $100.00</span>
                                <span>Agent Fee: $99.00 (1st yr paid)</span>
                            </div>
                        </div>

                        <div className="pt-4 border-t border-[#e5e7eb] flex justify-end">
                            <button
                                type="button"
                                onClick={() => setSelectedCompany(null)}
                                className="px-5 py-2.5 rounded-lg bg-[#f3f4f6] text-[#0f172a] text-[14px] font-medium hover:bg-[#e5e7eb]"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
