'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { TOKENS, type Token } from '@/lib/tokens';

interface CryptoAssetsViewProps {
    balances: Record<string, number>;
}

export function CryptoAssetsView({ balances }: CryptoAssetsViewProps) {
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'tokens' | 'defi' | 'nfts'>('tokens');

    // Simulate authentic initial loading screen with Wyoming Attorney logo
    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, 900);
        return () => clearTimeout(timer);
    }, []);

    // Calculate total USD balance from balances and token price fallbacks
    let totalUsd = 0;
    const enrichedTokens = TOKENS.slice(0, 8).map((token) => {
        const amount = balances[token.symbol] || 0;
        const usdValue = amount * token.fallback;
        totalUsd += usdValue;

        // Realistic variations matching screenshot
        const price = token.fallback;
        const change = token.symbol === 'BTC' ? '+1.58%' : token.symbol === 'ETH' ? '+2.07%' : '+0.60%';
        const isPositive = true;

        return {
            ...token,
            amount,
            usdValue,
            formattedPrice: price >= 1000 ? `$${price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : `$${price.toFixed(price >= 1 ? 2 : 6)}`,
            formattedUsd: `$${usdValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
            change,
            isPositive
        };
    });

    if (loading) {
        return (
            <div className="fixed inset-0 z-50 bg-[#0f141b] flex flex-col items-center justify-center animate-fade-in">
                <div className="flex flex-col items-center gap-6">
                    <div className="relative">
                        <div className="w-28 h-28 rounded-full border-4 border-[#2563eb]/20 border-t-[#f59e0b] animate-spin" />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-20 h-20 rounded-full bg-white shadow-xl flex items-center justify-center p-2.5">
                                <Image
                                    src="/wyoming.png"
                                    alt="Wyoming Attorney"
                                    width={72}
                                    height={72}
                                    className="w-full h-full object-contain"
                                    priority
                                />
                            </div>
                        </div>
                    </div>
                    <div className="text-center">
                        <p className="text-[20px] font-extrabold text-white tracking-tight">Wyoming Attorney</p>
                        <p className="text-[12px] font-semibold uppercase tracking-widest text-[#f59e0b] mt-1">
                            Loading digital assets…
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen w-full bg-[#0f141b] text-[#e5e7eb] font-['Inter',sans-serif] flex flex-col relative selection:bg-[#2563eb] selection:text-white">
            {/* Header with back button & brand title */}
            <header className="sticky top-0 z-30 w-full border-b border-[#262c36] bg-[#0f141b]/95 backdrop-blur">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
                    <Link
                        href="/dashboard"
                        className="inline-flex items-center gap-2 text-sm text-[#9ca3af] hover:text-white transition-colors py-1.5 px-2.5 -ml-2 rounded-lg hover:bg-[#161c24]"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        <span className="font-medium hidden sm:inline">Dashboard</span>
                    </Link>
                    <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-lg bg-white p-1 flex items-center justify-center shadow-sm">
                            <Image
                                src="/wyoming.png"
                                alt="Wyoming Attorney"
                                width={32}
                                height={32}
                                className="h-full w-full object-contain"
                                priority
                            />
                        </div>
                        <h1 className="text-[18px] font-bold text-white tracking-tight">Crypto Assets</h1>
                    </div>
                    <div className="w-8 sm:w-20 flex justify-end">
                        <Link
                            href="/dashboard/account"
                            className="w-8 h-8 rounded-full bg-[#161c24] border border-[#262c36] flex items-center justify-center text-[#9ca3af] hover:text-white hover:border-[#f5c542] transition-colors"
                            title="Account Settings"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                        </Link>
                    </div>
                </div>
            </header>

            {/* Main Full-Screen Body Content */}
            <main className="flex-1 w-full max-w-4xl mx-auto px-4 sm:px-6 py-6 pb-28">
                {/* Total Balance Amount Header */}
                <div className="py-4 sm:py-6">
                    <p className="text-[13px] font-medium uppercase tracking-wider text-[#9ca3af] mb-2">Total Portfolio Value</p>
                    <p className="text-[44px] sm:text-[54px] font-extrabold text-white tracking-tight leading-none">
                        ${totalUsd.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                </div>

            {/* 4 Action Tiles: Send, Receive, Buy, Cards */}
            <div className="grid grid-cols-4 gap-3 px-6 pb-6">
                {/* Send */}
                <div className="bg-[#161c24] border border-[#262c36] rounded-xl p-3 sm:p-4 flex flex-col items-center justify-center gap-2 hover:border-[#f59e0b] cursor-pointer transition-all active:scale-[0.98]">
                    <svg className="w-6 h-6 text-[#f59e0b]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                    <span className="text-[12px] font-medium text-[#e5e7eb]">Send</span>
                </div>

                {/* Receive */}
                <Link
                    href="/dashboard/wallets/receive"
                    className="bg-[#161c24] border border-[#262c36] rounded-xl p-3 sm:p-4 flex flex-col items-center justify-center gap-2 hover:border-[#f59e0b] cursor-pointer transition-all active:scale-[0.98]"
                >
                    <svg className="w-6 h-6 text-[#f59e0b]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    <span className="text-[12px] font-medium text-[#e5e7eb]">Receive</span>
                </Link>

                {/* Buy */}
                <div className="bg-[#161c24] border border-[#262c36] rounded-xl p-3 sm:p-4 flex flex-col items-center justify-center gap-2 hover:border-[#f59e0b] cursor-pointer transition-all active:scale-[0.98]">
                    <svg className="w-6 h-6 text-[#f59e0b]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <span className="text-[12px] font-medium text-[#e5e7eb]">Buy</span>
                </div>

                {/* Cards */}
                <div className="bg-[#161c24] border border-[#262c36] rounded-xl p-3 sm:p-4 flex flex-col items-center justify-center gap-2 hover:border-[#f59e0b] cursor-pointer transition-all active:scale-[0.98]">
                    <svg className="w-6 h-6 text-[#f59e0b]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                    <span className="text-[12px] font-medium text-[#e5e7eb]">Cards</span>
                </div>
            </div>

            {/* Asset Tabs: Tokens | DeFi | NFTs */}
            <div className="flex items-center justify-between px-6 border-b border-[#262c36]">
                <div className="flex gap-6">
                    <button
                        type="button"
                        onClick={() => setActiveTab('tokens')}
                        className={`py-3 text-[14px] font-semibold border-b-2 transition-colors ${
                            activeTab === 'tokens' ? 'text-white border-[#f5c542]' : 'text-[#9ca3af] border-transparent hover:text-white'
                        }`}
                    >
                        Tokens
                    </button>
                    <button
                        type="button"
                        onClick={() => setActiveTab('defi')}
                        className={`py-3 text-[14px] font-semibold border-b-2 transition-colors ${
                            activeTab === 'defi' ? 'text-white border-[#f5c542]' : 'text-[#9ca3af] border-transparent hover:text-white'
                        }`}
                    >
                        DeFi
                    </button>
                    <button
                        type="button"
                        onClick={() => setActiveTab('nfts')}
                        className={`py-3 text-[14px] font-semibold border-b-2 transition-colors ${
                            activeTab === 'nfts' ? 'text-white border-[#f5c542]' : 'text-[#9ca3af] border-transparent hover:text-white'
                        }`}
                    >
                        NFTs
                    </button>
                </div>

                <div className="flex items-center gap-2 text-[#9ca3af]">
                    <button type="button" className="p-1 hover:text-white">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>
                </div>
            </div>

            {/* Total Assets Subheader */}
            <div className="flex items-center justify-between px-6 py-3 text-[13px] text-[#9ca3af]">
                <span>Total Assets</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
                </svg>
            </div>

            {/* Token List Rows */}
            <div className="divide-y divide-[#262c36] px-6 pb-24">
                {enrichedTokens.map((t) => (
                    <div
                        key={t.id}
                        className="py-4 flex items-center justify-between hover:bg-white/[0.02] cursor-pointer transition-colors"
                    >
                        {/* Token Identity */}
                        <div className="flex items-center gap-3.5">
                            <div
                                className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white text-[13px] flex-shrink-0 overflow-hidden"
                                style={{ backgroundColor: t.color || '#f59e0b' }}
                            >
                                {t.image ? (
                                    <Image
                                        src={t.image}
                                        alt={t.symbol}
                                        width={40}
                                        height={40}
                                        className="w-full h-full object-cover"
                                        unoptimized
                                    />
                                ) : (
                                    t.symbol.slice(0, 3)
                                )}
                            </div>
                            <div>
                                <p className="text-[16px] font-bold text-white leading-tight">{t.symbol}</p>
                                <p className="text-[12px] text-[#9ca3af] mt-0.5">{t.name}</p>
                                <p className="text-[11px] text-[#6b7280]">
                                    {t.amount.toFixed(8)} {t.symbol}
                                </p>
                            </div>
                        </div>

                        {/* Values & Trends */}
                        <div className="text-right">
                            <p className="text-[16px] font-bold text-[#f5c542] leading-tight">
                                {t.formattedUsd}
                            </p>
                            <div className="flex items-center justify-end gap-2 mt-1">
                                <span className="text-[12px] text-[#9ca3af]">{t.formattedPrice}</span>
                                <span className="text-[11px] font-semibold text-[#22c55e] bg-[#22c55e]/10 px-1.5 py-0.5 rounded flex items-center gap-0.5">
                                    <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                    </svg>
                                    {t.change}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            </main>

            {/* Bottom App Navigation Bar (Home, Earn, Trade, Connect, Account) */}
            <nav className="fixed inset-x-0 bottom-0 z-30 bg-[#0f141b]/95 border-t border-[#262c36] backdrop-blur py-2.5 px-6">
                <div className="max-w-4xl mx-auto flex items-center justify-between text-[11px] text-[#9ca3af]">
                    <button type="button" className="flex flex-col items-center gap-1 text-[#f5c542]">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                        </svg>
                        <span>Home</span>
                    </button>
                    <button type="button" className="flex flex-col items-center gap-1 hover:text-white">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>Earn</span>
                    </button>
                    <button type="button" className="flex flex-col items-center gap-1 hover:text-white">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                        </svg>
                        <span>Trade</span>
                    </button>
                    <Link href="/dashboard/wallets/link" className="flex flex-col items-center gap-1 hover:text-white">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                        </svg>
                        <span>Connect</span>
                    </Link>
                    <Link href="/dashboard/account" className="flex flex-col items-center gap-1 hover:text-white">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        <span>Account</span>
                    </Link>
                </div>
            </nav>

            {/* Chat Floating Bubble */}
            <div className="fixed bottom-20 right-5 z-40 flex items-center gap-2 bg-[#2563eb] text-white px-3.5 py-2 rounded-full shadow-lg cursor-pointer hover:bg-[#1d4ed8] transition-colors">
                <span className="w-2 h-2 rounded-full bg-[#22c55e]" />
                <span className="text-[13px] font-semibold">Chat</span>
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                </svg>
            </div>
        </div>
    );
}
