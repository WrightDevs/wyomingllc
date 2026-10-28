'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { TOKENS, type Token } from '@/lib/tokens';
import type { DepositAddressRecord } from '@/lib/queries';

interface ReceiveCryptoViewProps {
    initialAddresses: DepositAddressRecord[];
}

export function ReceiveCryptoView({ initialAddresses }: ReceiveCryptoViewProps) {
    const router = useRouter();
    const [search, setSearch] = useState('');
    const [selectedToken, setSelectedToken] = useState<Token | null>(null);
    const [copied, setCopied] = useState(false);

    const addressMap = initialAddresses.reduce<Record<string, DepositAddressRecord>>((acc, item) => {
        acc[item.symbol.toUpperCase()] = item;
        return acc;
    }, {});

    // Filter tokens based on search input
    const filteredTokens = TOKENS.filter((t) => {
        const query = search.trim().toLowerCase();
        if (!query) return true;
        return t.symbol.toLowerCase().includes(query) || t.name.toLowerCase().includes(query);
    });

    const activeRecord = selectedToken ? addressMap[selectedToken.symbol.toUpperCase()] : null;
    const currentAddress = activeRecord?.address || (
        selectedToken?.symbol === 'BTC' ? 'bc1qnzavf2k3l8p/t00ggf02hryfsgsn1gyrgng4de' :
        selectedToken?.symbol === 'ETH' ? '0x71C836eA988E0e633d96924876b5E3801f92e947' :
        selectedToken?.symbol === 'TRX' ? 'TYDzsYUEpvnYmQk4zGP9sWWcTEd3GL8fxB' :
        selectedToken?.symbol === 'USDT' ? 'TYDzsYUEpvnYmQk4zGP9sWWcTEd3GL8fxB' :
        '0x71C836eA988E0e633d96924876b5E3801f92e947'
    );
    const currentNetwork = activeRecord?.network || (
        selectedToken?.symbol === 'BTC' ? 'BTC Network' :
        selectedToken?.symbol === 'ETH' ? 'Ethereum (ERC20)' :
        selectedToken?.symbol === 'TRX' ? 'TRON (TRC20)' :
        `${selectedToken?.symbol || ''} Network`
    );

    const handleCopy = () => {
        if (!currentAddress) return;
        navigator.clipboard.writeText(currentAddress);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    // View: Detail Screen for Selected Token (matches Screenshot 2)
    if (selectedToken) {
        // QR Code URL generated via reliable SVG QR API
        const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(currentAddress)}&bgcolor=ffffff&color=000000&margin=1`;

        return (
            <div className="min-h-screen w-full bg-[#0f141b] text-[#e5e7eb] font-['Inter',sans-serif] flex flex-col selection:bg-[#2563eb] selection:text-white">
                {/* Header */}
                <header className="sticky top-0 z-30 w-full border-b border-[#262c36] bg-[#0f141b]/95 backdrop-blur">
                    <div className="max-w-xl mx-auto px-4 py-4 flex items-center justify-between">
                        <button
                            type="button"
                            onClick={() => setSelectedToken(null)}
                            className="p-1 -ml-1 text-[#9ca3af] hover:text-white rounded-lg hover:bg-[#161c24] transition-colors"
                            aria-label="Back"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                        </button>
                        <h1 className="text-[17px] font-bold text-white tracking-tight">
                            Receive {selectedToken.symbol}
                        </h1>
                        <div className="w-6" />
                    </div>
                </header>

                {/* Content Box */}
                <main className="flex-1 w-full max-w-xl mx-auto px-4 py-8 pb-28 flex flex-col items-center">
                    <div className="w-full bg-[#161c24] border border-[#262c36] rounded-2xl p-6 sm:p-8 flex flex-col items-center shadow-2xl">
                        {/* Token Identity Top */}
                        <div className="w-full flex items-center gap-3.5 pb-6">
                            <div
                                className="w-11 h-11 rounded-full flex items-center justify-center font-bold text-white text-sm overflow-hidden flex-shrink-0"
                                style={{ backgroundColor: selectedToken.color || '#f59e0b' }}
                            >
                                {selectedToken.image ? (
                                    <Image
                                        src={selectedToken.image}
                                        alt={selectedToken.symbol}
                                        width={44}
                                        height={44}
                                        className="w-full h-full object-cover"
                                        unoptimized
                                    />
                                ) : (
                                    selectedToken.symbol.slice(0, 3)
                                )}
                            </div>
                            <div>
                                <p className="text-[18px] font-bold text-white leading-tight">{selectedToken.name}</p>
                                <p className="text-[13px] text-[#9ca3af] mt-0.5">{currentNetwork}</p>
                            </div>
                        </div>

                        {/* QR Code Container */}
                        <div className="w-[240px] h-[240px] bg-white rounded-2xl p-3 flex items-center justify-center shadow-lg my-2">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src={qrUrl}
                                alt={`Deposit QR code for ${selectedToken.symbol}`}
                                className="w-full h-full object-contain"
                            />
                        </div>

                        {/* Wallet Address Block */}
                        <div className="w-full mt-6 bg-[#0f141b] border border-[#262c36] rounded-xl p-4">
                            <div className="flex items-center justify-between mb-1.5">
                                <span className="text-[11px] font-semibold text-[#9ca3af] uppercase tracking-wider">Wallet Address</span>
                                {copied && <span className="text-[11px] font-semibold text-[#22c55e]">Copied to clipboard!</span>}
                            </div>
                            <p className="font-mono text-[13px] text-[#e5e7eb] break-all leading-relaxed select-all">
                                {currentAddress}
                            </p>

                            {activeRecord?.memo && (
                                <div className="mt-3 pt-3 border-t border-[#262c36]">
                                    <span className="text-[11px] font-semibold text-[#9ca3af] uppercase tracking-wider block mb-1">
                                        Memo / Destination Tag
                                    </span>
                                    <p className="font-mono text-[13px] text-[#f5c542]">{activeRecord.memo}</p>
                                </div>
                            )}

                            {/* Copy Address Button */}
                            <button
                                type="button"
                                onClick={handleCopy}
                                className="w-full mt-4 bg-[#f59e0b] hover:bg-[#d97706] text-[#0f172a] font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-[0.99] text-sm"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
                                </svg>
                                <span>{copied ? 'Address Copied!' : 'Copy Address'}</span>
                            </button>
                        </div>

                        {/* Important Warning Notice */}
                        <div className="w-full mt-5 bg-[#f59e0b]/10 border border-[#f59e0b]/20 rounded-xl p-4 text-[12px] text-[#f5c542] leading-relaxed">
                            <strong className="font-bold">Important:</strong> Only send {selectedToken.symbol} to this address using {currentNetwork}. Sending any other coin or using the wrong network may result in permanent loss of funds.
                        </div>
                    </div>
                </main>

                {/* Bottom App Navigation */}
                <nav className="fixed inset-x-0 bottom-0 z-30 bg-[#0f141b]/95 border-t border-[#262c36] backdrop-blur py-2.5 px-6">
                    <div className="max-w-xl mx-auto flex items-center justify-between text-[11px] text-[#9ca3af]">
                        <Link href="/dashboard/wallets" className="flex flex-col items-center gap-1 hover:text-white">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                            </svg>
                            <span>Home</span>
                        </Link>
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

                {/* Chat floating bubble */}
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

    // View: List of Networks / Coins to Receive (matches Screenshot 1)
    return (
        <div className="min-h-screen w-full bg-[#0f141b] text-[#e5e7eb] font-['Inter',sans-serif] flex flex-col selection:bg-[#2563eb] selection:text-white">
            {/* Header */}
            <header className="sticky top-0 z-30 w-full border-b border-[#262c36] bg-[#0f141b]/95 backdrop-blur">
                <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
                    <Link
                        href="/dashboard/wallets"
                        className="p-1 -ml-1 text-[#9ca3af] hover:text-white rounded-lg hover:bg-[#161c24] transition-colors"
                        aria-label="Back to assets"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                    </Link>
                    <h1 className="text-[18px] font-bold text-white tracking-tight">Receive Crypto</h1>
                    <div className="w-6" />
                </div>
            </header>

            {/* Main Network Selection List */}
            <main className="flex-1 w-full max-w-2xl mx-auto px-4 py-6 pb-28">
                {/* Search networks input bar */}
                <div className="relative mb-6">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#9ca3af]">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search networks"
                        className="w-full bg-[#161c24] border border-[#262c36] rounded-xl py-3 pl-10 pr-4 text-sm text-white placeholder-[#6b7280] focus:outline-none focus:border-[#f59e0b] transition-colors"
                    />
                </div>

                {/* Coin Network Items */}
                <div className="divide-y divide-[#262c36] border-t border-b border-[#262c36]">
                    {filteredTokens.map((token) => {
                        const rec = addressMap[token.symbol.toUpperCase()];
                        const networkLabel = rec?.network || (
                            token.symbol === 'BTC' ? 'Bitcoin (BTC)' :
                            token.symbol === 'ETH' ? 'Ethereum (ERC20)' :
                            token.symbol === 'TRX' ? 'TRON (TRC20)' :
                            token.symbol === 'XRP' ? 'XRP Ledger' :
                            token.symbol === 'XLM' ? 'Stellar (XLM)' :
                            token.symbol === 'DOGE' ? 'Dogecoin' :
                            token.symbol === 'LTC' ? 'Litecoin' :
                            token.symbol === 'BNB' ? 'BNB (BEP20)' :
                            token.name
                        );

                        return (
                            <button
                                key={token.id}
                                type="button"
                                onClick={() => setSelectedToken(token)}
                                className="w-full py-4 px-2 flex items-center justify-between hover:bg-white/[0.03] transition-colors text-left group"
                            >
                                <div className="flex items-center gap-3.5">
                                    <div
                                        className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white text-[13px] flex-shrink-0 overflow-hidden"
                                        style={{ backgroundColor: token.color || '#f59e0b' }}
                                    >
                                        {token.image ? (
                                            <Image
                                                src={token.image}
                                                alt={token.symbol}
                                                width={40}
                                                height={40}
                                                className="w-full h-full object-cover"
                                                unoptimized
                                            />
                                        ) : (
                                            token.symbol.slice(0, 3)
                                        )}
                                    </div>
                                    <div>
                                        <p className="text-[15px] font-bold text-white leading-tight">{token.symbol}</p>
                                        <p className="text-[12px] text-[#9ca3af] mt-0.5">{networkLabel}</p>
                                    </div>
                                </div>

                                <div className="text-[#6b7280] group-hover:text-white transition-colors">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                    </svg>
                                </div>
                            </button>
                        );
                    })}
                </div>
            </main>

            {/* Bottom App Navigation */}
            <nav className="fixed inset-x-0 bottom-0 z-30 bg-[#0f141b]/95 border-t border-[#262c36] backdrop-blur py-2.5 px-6">
                <div className="max-w-2xl mx-auto flex items-center justify-between text-[11px] text-[#9ca3af]">
                    <Link href="/dashboard/wallets" className="flex flex-col items-center gap-1 hover:text-white">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                        </svg>
                        <span>Home</span>
                    </Link>
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
