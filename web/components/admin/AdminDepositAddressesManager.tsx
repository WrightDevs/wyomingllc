'use client';

import { useActionState, useState } from 'react';
import { saveDepositAddressAction } from '@/app/actions/admin';
import { TOKENS } from '@/lib/tokens';
import type { DepositAddressRecord } from '@/lib/queries';
import { FormMessage, SubmitButton } from '@/components/ui';

interface AdminDepositAddressesManagerProps {
    initialAddresses: DepositAddressRecord[];
}

export function AdminDepositAddressesManager({ initialAddresses }: AdminDepositAddressesManagerProps) {
    const [state, action] = useActionState(saveDepositAddressAction, null);
    const [selectedSymbol, setSelectedSymbol] = useState(TOKENS[0].symbol);

    const addressMap = initialAddresses.reduce<Record<string, DepositAddressRecord>>((acc, item) => {
        acc[item.symbol.toUpperCase()] = item;
        return acc;
    }, {});

    const currentRecord = addressMap[selectedSymbol.toUpperCase()];
    const currentToken = TOKENS.find((t) => t.symbol === selectedSymbol) || TOKENS[0];

    const [network, setNetwork] = useState(currentRecord?.network || '');
    const [address, setAddress] = useState(currentRecord?.address || '');
    const [memo, setMemo] = useState(currentRecord?.memo || '');

    const handleSelectToken = (sym: string) => {
        setSelectedSymbol(sym);
        const record = addressMap[sym.toUpperCase()];
        setNetwork(record?.network || (sym === 'BTC' ? 'BTC Network' : sym === 'ETH' ? 'Ethereum (ERC20)' : sym === 'TRX' ? 'TRON (TRC20)' : `${sym} Network`));
        setAddress(record?.address || '');
        setMemo(record?.memo || '');
    };

    return (
        <section className="card p-5 sm:p-6 space-y-5">
            <div>
                <p className="eyebrow">Deposit & Receive Configuration</p>
                <h2 className="display text-xl text-pine-950">Receive Crypto Addresses</h2>
                <p className="text-sm text-pine-900/65 mt-1">
                    Configure the receiving wallet addresses and network tags shown to users on the <strong>Receive Crypto</strong> screens for BTC, ETH, TRX, XRP, and all other coins.
                </p>
            </div>

            {/* Quick coin selector pills with smooth mobile horizontal scroll */}
            <div className="space-y-2">
                <p className="text-xs font-semibold text-[#4b5563] uppercase tracking-wider">Select Cryptocurrency</p>
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
                    {TOKENS.slice(0, 18).map((token) => {
                        const hasAddr = Boolean(addressMap[token.symbol.toUpperCase()]?.address);
                        const active = token.symbol === selectedSymbol;
                        return (
                            <button
                                key={token.id}
                                type="button"
                                onClick={() => handleSelectToken(token.symbol)}
                                className={`flex-shrink-0 px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 border transition-all ${
                                    active
                                        ? 'bg-[#1e3a8a] text-white border-[#1e3a8a] shadow-sm scale-[1.02]'
                                        : 'bg-white text-[#0f172a] border-[#e5e7eb] hover:bg-[#f9fafb]'
                                }`}
                            >
                                <span
                                    className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                                    style={{ backgroundColor: token.color || '#f59e0b' }}
                                />
                                <span>{token.symbol}</span>
                                {hasAddr ? (
                                    <span
                                        className={`w-1.5 h-1.5 rounded-full ${active ? 'bg-emerald-300' : 'bg-emerald-500'}`}
                                        title="Address configured"
                                    />
                                ) : (
                                    <span className="w-1.5 h-1.5 rounded-full bg-slate-300" title="Not configured" />
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>

            <form action={action} className="bg-white border border-[#e5e7eb] rounded-2xl p-4 sm:p-6 shadow-sm space-y-5">
                <FormMessage state={state} />

                {/* Selected Token Info Header */}
                <div className="flex items-center gap-3 pb-3 border-b border-[#e5e7eb]">
                    <div
                        className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white text-xs shadow-sm flex-shrink-0"
                        style={{ backgroundColor: currentToken.color || '#1e3a8a' }}
                    >
                        {currentToken.symbol.slice(0, 3)}
                    </div>
                    <div>
                        <h3 className="text-base font-bold text-[#0f172a]">{currentToken.name} ({selectedSymbol})</h3>
                        <p className="text-xs text-[#6b7280]">Edit official deposit address and network parameters</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="symbol" className="block text-xs font-semibold text-[#0f172a] uppercase tracking-wider mb-1.5">
                            Coin / Currency
                        </label>
                        <select
                            id="symbol"
                            name="symbol"
                            value={selectedSymbol}
                            onChange={(e) => handleSelectToken(e.target.value)}
                            className="w-full rounded-xl border border-[#d1d5db] bg-white px-3.5 py-2.5 text-sm font-semibold text-[#0f172a] focus:border-[#1e3a8a] focus:outline-none focus:ring-1 focus:ring-[#1e3a8a]"
                        >
                            {TOKENS.map((t) => (
                                <option key={t.id} value={t.symbol}>
                                    {t.symbol} — {t.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label htmlFor="network" className="block text-xs font-semibold text-[#0f172a] uppercase tracking-wider mb-1.5">
                            Network Label (e.g. BTC Network, ERC20, TRC20)
                        </label>
                        <input
                            id="network"
                            name="network"
                            type="text"
                            value={network}
                            onChange={(e) => setNetwork(e.target.value)}
                            placeholder="e.g. BTC Network"
                            className="w-full rounded-xl border border-[#d1d5db] bg-white px-3.5 py-2.5 text-sm text-[#0f172a] focus:border-[#1e3a8a] focus:outline-none focus:ring-1 focus:ring-[#1e3a8a]"
                        />
                    </div>
                </div>

                <div>
                    <label htmlFor="address" className="block text-xs font-semibold text-[#0f172a] uppercase tracking-wider mb-1.5">
                        Wallet Address for {currentToken.name} ({selectedSymbol})
                    </label>
                    <input
                        id="address"
                        name="address"
                        type="text"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="Paste official deposit address here"
                        className="w-full rounded-xl border border-[#d1d5db] bg-white px-3.5 py-2.5 font-mono text-xs sm:text-sm text-[#0f172a] focus:border-[#1e3a8a] focus:outline-none focus:ring-1 focus:ring-[#1e3a8a]"
                        required
                    />
                </div>

                <div>
                    <label htmlFor="memo" className="block text-xs font-semibold text-[#0f172a] uppercase tracking-wider mb-1.5">
                        Destination Tag / Memo (Optional, e.g. for XRP, XLM)
                    </label>
                    <input
                        id="memo"
                        name="memo"
                        type="text"
                        value={memo}
                        onChange={(e) => setMemo(e.target.value)}
                        placeholder="Optional memo / tag"
                        className="w-full rounded-xl border border-[#d1d5db] bg-white px-3.5 py-2.5 font-mono text-xs sm:text-sm text-[#0f172a] focus:border-[#1e3a8a] focus:outline-none focus:ring-1 focus:ring-[#1e3a8a]"
                    />
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
                    <p className="text-xs text-[#6b7280]">
                        {currentRecord?.updated_at
                            ? `Last updated: ${new Date(currentRecord.updated_at).toLocaleDateString()} by ${currentRecord.updated_by || 'Admin'}`
                            : 'No address configured yet for this token.'}
                    </p>
                    <SubmitButton pendingLabel="Saving..." className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#1e3a8a] hover:bg-[#1a306d] text-white text-sm font-semibold transition-all">
                        Save {selectedSymbol} Address
                    </SubmitButton>
                </div>
            </form>
        </section>
    );
}
