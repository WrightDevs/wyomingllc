import type { WalletAddresses } from '@/lib/types';
import { CopyButton } from './CopyButton';

const rows: Array<{ key: keyof WalletAddresses; label: string; path: string }> = [
    { key: 'evm', label: 'EVM', path: "m/44'/60'/0'/0/0" },
    { key: 'btc', label: 'Bitcoin · SegWit', path: "m/84'/0'/0'/0/0" },
    { key: 'btcLegacy', label: 'Bitcoin · Legacy', path: "m/44'/0'/0'/0/0" },
    { key: 'sol', label: 'Solana', path: "m/44'/501'/0'/0'" }
];

export function WalletAddresses({ addresses }: { addresses: WalletAddresses }) {
    return (
        <dl className="grid gap-2.5 sm:grid-cols-2">
            {rows.map((row) => {
                const value = addresses[row.key];
                if (!value) return null;
                return (
                    <div key={row.key} className="rounded-xl border border-pine-900/10 bg-pine-50/50 px-3 py-2.5">
                        <dt className="flex items-center justify-between gap-2">
                            <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.12em] text-pine-900/50">
                                {row.label}
                            </span>
                            <span className="mono text-[10px] text-pine-900/35">{row.path}</span>
                        </dt>
                        <dd className="mt-1 flex items-center justify-between gap-2">
                            <span className="mono truncate text-[12px] text-pine-950" title={value}>
                                {value}
                            </span>
                            <CopyButton value={value} label={`${row.label} address`} />
                        </dd>
                    </div>
                );
            })}
        </dl>
    );
}
