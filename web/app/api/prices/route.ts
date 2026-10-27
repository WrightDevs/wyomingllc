import { NextResponse } from 'next/server';
import { coingeckoIds, fallbackPrices, type PriceMap } from '@/lib/tokens';

export const dynamic = 'force-dynamic';

type Cache = { at: number; prices: PriceMap };
let cache: Cache | null = null;
const TTL = 120_000;

export async function GET() {
    const now = Date.now();

    if (cache && now - cache.at < TTL) {
        return NextResponse.json({ prices: cache.prices, fetchedAt: cache.at, stale: false });
    }

    const ids = coingeckoIds().join(',');

    try {
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), 8_000);
        const response = await fetch(
            `https://api.coingecko.com/api/v3/simple/price?ids=${encodeURIComponent(ids)}&vs_currencies=usd`,
            { signal: controller.signal, headers: { accept: 'application/json' }, cache: 'no-store' }
        );
        clearTimeout(timer);
        if (!response.ok) throw new Error(`CoinGecko HTTP ${response.status}`);

        const raw = (await response.json()) as Record<string, { usd?: number }>;
        const prices = fallbackPrices();
        for (const [id, value] of Object.entries(raw)) {
            const usd = Number(value?.usd);
            if (Number.isFinite(usd) && usd > 0) prices[id] = usd;
        }

        cache = { at: now, prices };
        return NextResponse.json({ prices, fetchedAt: now, stale: false });
    } catch (error) {
        console.warn('[prices]', error instanceof Error ? error.message : error);
        return NextResponse.json({
            prices: cache?.prices ?? fallbackPrices(),
            fetchedAt: cache?.at ?? null,
            stale: true
        });
    }
}
