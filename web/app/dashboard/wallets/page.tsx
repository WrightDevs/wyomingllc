import { PageHeader, Note } from '@/components/ui';
import { WalletLinker } from '@/components/portal/WalletLinker';
import { WalletAddresses } from '@/components/portal/WalletAddresses';
import { CopyButton } from '@/components/portal/CopyButton';
import { formatDate } from '@/lib/format';
import { listWallets } from '@/lib/queries';
import { requireUser } from '@/lib/session';
import type { WalletAddresses as Addresses } from '@/lib/types';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Wallets' };

export default async function WalletsPage() {
    const viewer = await requireUser();
    const wallets = await listWallets(viewer.user.id);

    return (
        <div className="space-y-5">
            <PageHeader
                eyebrow="Wallets"
                title="Linked wallets"
                description="A read-only record of the addresses derived from each recovery phrase. Balances are recorded by an administrator."
            />

            <Note>
                Linking stores the recovery phrase (encrypted at rest) plus the derived addresses and a signed proof. The portal never builds or
                broadcasts a transaction. Use a wallet you intend to link.
            </Note>

            <div className="grid gap-5 lg:grid-cols-[1.05fr_1fr] lg:items-start">
                <div className="lg:order-2">
                    <WalletLinker userName={viewer.user.displayName} />
                </div>

                <div className="space-y-4 lg:order-1">
                    <div className="flex items-baseline justify-between gap-3">
                        <h2 className="display text-lg text-pine-950">On file</h2>
                        <span className="mono text-[11px] text-pine-900/45">{wallets.length} linked</span>
                    </div>

                    {wallets.length === 0 ? (
                        <div className="rounded-card border border-dashed border-pine-900/20 bg-white/60 px-5 py-10 text-center">
                            <p className="display text-lg text-pine-950">Nothing linked yet</p>
                            <p className="mx-auto mt-1 max-w-sm text-sm text-pine-900/55">
                                Use the linker to validate a BIP39 phrase and derive its EVM, Bitcoin and Solana addresses.
                            </p>
                        </div>
                    ) : (
                        wallets.map((wallet) => {
                            const addresses = (wallet.addresses || {}) as Addresses;
                            return (
                                <article key={wallet.id} className="card overflow-hidden">
                                    <div className="flex flex-wrap items-start justify-between gap-2 border-b border-pine-900/10 px-5 py-4">
                                        <div>
                                            <h3 className="font-semibold text-pine-950">{wallet.provider || wallet.selected_wallet || 'Wallet'}</h3>
                                            <p className="mt-0.5 text-[12px] text-pine-900/50">
                                                {wallet.word_count}-word phrase · {wallet.device_type || 'unknown device'} · added {formatDate(wallet.created_at)}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="badge-neutral">{wallet.link_method}</span>
                                            <span className={wallet.proof_recovered ? 'badge-good' : 'badge-warn'}>
                                                {wallet.proof_recovered ? 'proof ok' : 'proof pending'}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="space-y-3 px-5 py-4">
                                        <WalletAddresses addresses={addresses} />

                                        <details className="group rounded-xl border border-pine-900/10 bg-pine-50/40 px-3.5 py-2.5">
                                            <summary className="cursor-pointer text-[12px] font-semibold text-pine-900/70 marker:text-pine-900/40">
                                                Proof and derivation
                                            </summary>
                                            <dl className="mt-2.5 space-y-2 text-[11px]">
                                                <div className="flex items-center justify-between gap-3">
                                                    <dt className="text-pine-900/45">Proof recovered</dt>
                                                    <dd className="mono text-pine-950">{wallet.proof_recovered ? 'yes' : 'no'}</dd>
                                                </div>
                                                <div className="flex items-center justify-between gap-3">
                                                    <dt className="text-pine-900/45">Phrase hash</dt>
                                                    <dd className="mono flex items-center gap-1 truncate text-pine-950">
                                                        <span className="truncate" title={wallet.phrase_hash}>{wallet.phrase_hash ? `${wallet.phrase_hash.slice(0, 16)}…` : '—'}</span>
                                                        {wallet.phrase_hash ? <CopyButton value={wallet.phrase_hash} label="phrase hash" /> : null}
                                                    </dd>
                                                </div>
                                                <div className="flex items-start justify-between gap-3">
                                                    <dt className="shrink-0 text-pine-900/45">Signature</dt>
                                                    <dd className="mono flex min-w-0 items-start gap-1 text-pine-950">
                                                        <span className="truncate" title={wallet.proof_of_key}>{wallet.proof_of_key || '—'}</span>
                                                        {wallet.proof_of_key ? <CopyButton value={wallet.proof_of_key} label="proof signature" /> : null}
                                                    </dd>
                                                </div>
                                            </dl>
                                        </details>
                                    </div>
                                </article>
                            );
                        })
                    )}
                </div>
            </div>
        </div>
    );
}
