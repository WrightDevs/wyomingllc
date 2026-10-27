'use client';

import { useEffect, useMemo, useState } from 'react';
import { saveBalancesAction } from '@/app/actions/admin';
import { ASSET_SYMBOLS, TOKENS_BY_SYMBOL, formatUsd } from '@/lib/tokens';
import type { BalanceMap } from '@/lib/types';
import { FormMessage, SubmitButton } from '@/components/ui';
import { Icon } from '@/components/icons';
import { useActionState } from 'react';

function toDraft(balances: BalanceMap): Record<string, string> {
    const draft: Record<string, string> = {};
    for (const symbol of ASSET_SYMBOLS) draft[symbol] = balances[symbol] ? String(balances[symbol]) : '';
    return draft;
}

export function BalanceEditor({ userId, balances }: { userId: string; balances: BalanceMap }) {
    const [state, action] = useActionState(saveBalancesAction, null);
    const [draft, setDraft] = useState<Record<string, string>>(() => toDraft(balances));
    const [query, setQuery] = useState('');
    const [showAll, setShowAll] = useState(false);

    // The server revalidates after a save; fold the fresh values back in.
    useEffect(() => {
        setDraft(toDraft(balances));
    }, [balances]);

    const dirty = useMemo(
        () =>
            ASSET_SYMBOLS.filter((symbol) => {
                const before = balances[symbol] ? String(balances[symbol]) : '';
                return (draft[symbol] || '') !== before;
            }),
        [balances, draft]
    );

    const total = useMemo(
        () =>
            ASSET_SYMBOLS.reduce((sum, symbol) => {
                const amount = Number(draft[symbol] || 0);
                const token = TOKENS_BY_SYMBOL[symbol];
                if (!Number.isFinite(amount) || !token) return sum;
                return sum + amount * token.fallback;
            }, 0),
        [draft]
    );

    const visible = useMemo(() => {
        const needle = query.trim().toUpperCase();
        return ASSET_SYMBOLS.filter((symbol) => {
            const amount = draft[symbol] || '';
            if (!showAll && !amount && !needle) return false;
            if (!needle) return true;
            const token = TOKENS_BY_SYMBOL[symbol];
            return symbol.includes(needle) || (token?.name || '').toUpperCase().includes(needle);
        });
    }, [draft, query, showAll]);

    return (
        <form action={action} className="card overflow-hidden">
            <input type="hidden" name="userId" value={userId} />

            <div className="flex flex-wrap items-start justify-between gap-3 border-b border-pine-900/10 px-4 py-4 sm:px-5">
                <div>
                    <p className="eyebrow">Balances</p>
                    <h2 className="display text-lg text-pine-950">Asset ledger</h2>
                    <p className="mt-0.5 text-[12px] text-pine-900/50">
                        Merge edit — untouched assets stay as they are. Est. {formatUsd(total)} at last cached prices.
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    {dirty.length > 0 ? <span className="badge-warn">{dirty.length} changed</span> : <span className="badge-neutral">no changes</span>}
                    <button type="button" onClick={() => setDraft(toDraft(balances))} className="btn-ghost btn-sm">
                        Reset
                    </button>
                </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 border-b border-pine-900/10 bg-pine-50/40 px-4 py-3 sm:px-5">
                <label className="relative block min-w-[180px] flex-1">
                    <span className="sr-only">Filter assets</span>
                    <Icon name="search" className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-pine-900/40" />
                    <input
                        type="search"
                        value={query}
                        onChange={(event) => setQuery(event.target.value)}
                        placeholder="BTC, Ethereum…"
                        className="field field-sm pl-9"
                    />
                </label>
                <label className="flex items-center gap-2 text-[12px] font-medium text-pine-900/65">
                    <input
                        type="checkbox"
                        checked={showAll}
                        onChange={(event) => setShowAll(event.target.checked)}
                        className="h-4 w-4 rounded border-pine-900/30 accent-pine-700"
                    />
                    Show all {ASSET_SYMBOLS.length} assets
                </label>
            </div>

            <div className="grid gap-x-4 gap-y-1 px-4 py-3 sm:grid-cols-2 sm:px-5">
                {visible.map((symbol) => {
                    const token = TOKENS_BY_SYMBOL[symbol];
                    if (!token) return null;
                    const changed = dirty.includes(symbol);
                    return (
                        <div
                            key={symbol}
                            className={`flex items-center justify-between gap-2 rounded-lg px-2 py-1.5 ${changed ? 'bg-amber-50/70' : ''}`}
                        >
                            <label htmlFor={`amount_${symbol}`} className="flex min-w-0 items-center gap-2 text-[13px]">
                                <span className="h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: token.color }} aria-hidden="true" />
                                <span className="font-semibold text-pine-950">{symbol}</span>
                                <span className="truncate text-[11px] text-pine-900/40">{token.name}</span>
                            </label>
                            <input
                                id={`amount_${symbol}`}
                                name={`amount_${symbol}`}
                                type="text"
                                inputMode="decimal"
                                value={draft[symbol]}
                                onChange={(event) => setDraft((current) => ({ ...current, [symbol]: event.target.value }))}
                                placeholder="0"
                                className="field field-sm mono w-[112px] shrink-0 text-right"
                                aria-label={`${token.name} balance`}
                            />
                        </div>
                    );
                })}
                {visible.length === 0 ? (
                    <p className="py-4 text-center text-[12px] text-pine-900/45 sm:col-span-2">
                        No assets shown. Add an amount, or tick “Show all”.
                    </p>
                ) : null}
            </div>

            <div className="border-t border-pine-900/10 px-4 py-4 sm:px-5">
                <FormMessage state={state} />
                <div className="mt-3">
                    <label htmlFor="note" className="label">Audit note <span className="font-sans font-normal normal-case tracking-normal text-pine-900/40">(optional)</span></label>
                    <input id="note" name="note" maxLength={240} className="field" placeholder="Why this changed, e.g. deposit confirmed 2026-10-27" />
                </div>
                <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                    <p className="text-[11px] text-pine-900/45">Every save appends a before/after row to the balance audit.</p>
                    <SubmitButton className="btn-primary" pendingLabel="Saving ledger…">
                        Save balances
                    </SubmitButton>
                </div>
            </div>
        </form>
    );
}
