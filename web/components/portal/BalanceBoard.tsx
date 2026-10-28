'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { TOKENS, fallbackPrices, formatAmount, formatPrice, formatUsd } from '@/lib/tokens';
import type { BalanceMap } from '@/lib/types';
import { Icon } from '@/components/icons';

const CACHE_KEY = 'wyoming.prices.v2';

type Cached = { prices: Record<string, number>; at: number };

function readCache(): Cached | null {
    try {
        const raw = window.localStorage.getItem(CACHE_KEY);
        if (!raw) return null;
        const parsed = JSON.parse(raw) as Cached;
        if (!parsed || typeof parsed !== 'object' || !parsed.prices) return null;
        return parsed;
    } catch {
        return null;
    }
}

export function BalanceBoard({ balances }: { balances: BalanceMap }) {
    const [prices, setPrices] = useState<Record<string, number>>(() => fallbackPrices());
    const [fetchedAt, setFetchedAt] = useState<number | null>(null);
    const [stale, setStale] = useState(false);
    const [loading, setLoading] = useState(true);
    const [query, setQuery] = useState('');

    useEffect(() => {
        const cached = readCache();
        if (cached) {
            setPrices((current) => ({ ...current, ...cached.prices }));
            setFetchedAt(cached.at);
        }

        let cancelled = false;
        const controller = new AbortController();

        async function load() {
            try {
                const response = await fetch('/api/prices', { signal: controller.signal });
                if (!response.ok) throw new Error('price request failed');
                const data = (await response.json()) as { prices: Record<string, number>; fetchedAt: number | null; stale: boolean };
                if (cancelled) return;
                setPrices({ ...fallbackPrices(), ...data.prices });
                setFetchedAt(data.fetchedAt);
                setStale(Boolean(data.stale));
                if (data.fetchedAt) {
                    try {
                        window.localStorage.setItem(CACHE_KEY, JSON.stringify({ prices: data.prices, at: data.fetchedAt }));
                    } catch {
                        /* storage full or blocked — the in-memory copy is enough */
                    }
                }
            } catch {
                if (!cancelled) setStale(true);
            } finally {
                if (!cancelled) setLoading(false);
            }
        }

        load();
        return () => {
            cancelled = true;
            controller.abort();
        };
    }, []);

    const rows = useMemo(() => {
        const held = TOKENS.filter((token) => (balances[token.symbol] || 0) > 0);
        const seen = new Set<string>();
        return held
            .filter((token) => {
                if (seen.has(token.symbol)) return false;
                seen.add(token.symbol);
                return true;
            })
            .map((token) => {
                const amount = balances[token.symbol] || 0;
                const price = prices[token.coingecko] ?? token.fallback;
                return { token, amount, price, value: amount * price };
            })
            .sort((a, b) => b.value - a.value);
    }, [balances, prices]);

    const filtered = useMemo(() => {
        const needle = query.trim().toLowerCase();
        if (!needle) return rows;
        return rows.filter((row) => row.token.symbol.toLowerCase().includes(needle) || row.token.name.toLowerCase().includes(needle));
    }, [rows, query]);

    const total = rows.reduce((sum, row) => sum + row.value, 0);

    return (
        <section className="card overflow-hidden" aria-labelledby="portfolio-heading">
            <div className="border-b border-pine-900/10 px-5 py-5 sm:px-6">
                <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                        <p className="eyebrow">Read-only portfolio</p>
                        <h2 id="portfolio-heading" className="mt-1 font-mono text-3xl font-semibold tracking-tight text-pine-950">
                            {formatUsd(total)}
                        </h2>
                        <p className="mt-1 text-[12px] text-pine-900/50">
                            {rows.length === 0
                                ? 'No assets on file'
                                : `${rows.length} asset${rows.length === 1 ? '' : 's'} · ${
                                      loading ? 'loading prices…' : stale ? 'cached prices' : 'prices from CoinGecko'
                                  }`}
                            {fetchedAt && !loading ? ` · ${new Date(fetchedAt).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}` : ''}
                        </p>
                    </div>
                    {rows.length > 3 ? (
                        <label className="relative block w-full max-w-[220px]">
                            <span className="sr-only">Filter assets</span>
                            <Icon name="search" className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-pine-900/40" />
                            <input
                                type="search"
                                value={query}
                                onChange={(event) => setQuery(event.target.value)}
                                placeholder="Filter assets"
                                className="field field-sm pl-9"
                            />
                        </label>
                    ) : null}
                </div>
            </div>

            {rows.length === 0 ? (
                <div className="px-5 py-10 text-center sm:px-6">
                    <p className="display text-lg text-pine-950">Nothing recorded yet</p>
                    <p className="mx-auto mt-1 max-w-sm text-sm text-pine-900/55">
                        When a wallet is linked and an administrator records balances, the assets appear here. This view never moves funds.
                    </p>
                    <Link href="/dashboard/wallets" className="btn-outline btn-sm mt-4">
                        <Icon name="wallet" className="h-4 w-4" />
                        Link a wallet
                    </Link>
                </div>
            ) : (
                <>
                    <div className="table-wrap hidden sm:block">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th scope="col">Asset</th>
                                    <th scope="col" className="text-right">Balance</th>
                                    <th scope="col" className="text-right">Price</th>
                                    <th scope="col" className="text-right">Value</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map(({ token, amount, price, value }) => (
                                    <tr key={token.symbol}>
                                        <td>
                                            <div className="flex items-center gap-2.5">
                                                <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: token.color }} aria-hidden="true" />
                                                <span className="font-semibold text-pine-950">{token.symbol}</span>
                                                <span className="text-[12px] text-pine-900/45">{token.name}</span>
                                            </div>
                                        </td>
                                        <td className="mono text-right tabular-nums">{formatAmount(amount)}</td>
                                        <td className="mono text-right tabular-nums text-pine-900/60">{formatPrice(price)}</td>
                                        <td className="mono text-right font-semibold tabular-nums">{formatUsd(value)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <ul className="divide-y divide-pine-900/5 sm:hidden">
                        {filtered.map(({ token, amount, price, value }) => (
                            <li key={token.symbol} className="flex items-center justify-between gap-3 px-5 py-3">
                                <div className="min-w-0">
                                    <div className="flex items-center gap-2">
                                        <span className="h-2 w-2 rounded-full" style={{ backgroundColor: token.color }} aria-hidden="true" />
                                        <span className="font-semibold text-pine-950">{token.symbol}</span>
                                    </div>
                                    <p className="mono mt-0.5 text-[11px] text-pine-900/45">
                                        {formatAmount(amount)} × {formatPrice(price)}
                                    </p>
                                </div>
                                <span className="mono shrink-0 text-sm font-semibold tabular-nums">{formatUsd(value)}</span>
                            </li>
                        ))}
                    </ul>

                    {filtered.length === 0 ? (
                        <p className="px-5 py-6 text-center text-sm text-pine-900/50">No asset matches “{query}”.</p>
                    ) : null}
                </>
            )}

            <div className="flex items-center gap-2 border-t border-pine-900/10 bg-pine-50/50 px-5 py-3 text-[11px] text-pine-900/50 sm:px-6">
                <Icon name="eye" className="h-3.5 w-3.5" />
                Balances are recorded by an administrator. This portal derives addresses and displays values; it cannot sign or move funds.
            </div>
        </section>
    );
}
