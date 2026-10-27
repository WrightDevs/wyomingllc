import Link from 'next/link';
import type { ReactNode } from 'react';
import { Brand } from '@/components/Brand';

export function AuthShell({
    eyebrow,
    title,
    description,
    children
}: {
    eyebrow: string;
    title: string;
    description: string;
    children: ReactNode;
}) {
    return (
        <div className="min-h-dvh lg:grid lg:grid-cols-[1.02fr_1fr]">
            <aside className="contour relative hidden overflow-hidden bg-pine-950 px-10 py-12 text-bone lg:flex lg:flex-col lg:justify-between">
                <div className="absolute inset-0 bg-ledger-grid bg-ledger opacity-[0.16]" aria-hidden="true" />
                <div className="relative">
                    <Brand tone="light" />
                </div>

                <div className="relative max-w-md">
                    <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.22em] text-ember-300">
                        One ledger, one login
                    </p>
                    <p className="display mt-4 text-3xl leading-tight text-bone">
                        Your filings, annual reports and linked wallet view — kept in the same place.
                    </p>
                    <dl className="mt-8 space-y-4 border-t border-white/10 pt-6">
                        <div className="flex items-baseline justify-between gap-4">
                            <dt className="text-sm text-pine-100/60">Wyoming filing fee</dt>
                            <dd className="mono text-sm text-bone">$102 online</dd>
                        </div>
                        <div className="flex items-baseline justify-between gap-4">
                            <dt className="text-sm text-pine-100/60">Annual report minimum</dt>
                            <dd className="mono text-sm text-bone">$60</dd>
                        </div>
                        <div className="flex items-baseline justify-between gap-4">
                            <dt className="text-sm text-pine-100/60">Formation service</dt>
                            <dd className="mono text-sm text-bone">$99</dd>
                        </div>
                    </dl>
                </div>

                <p className="relative max-w-sm text-[11px] leading-relaxed text-pine-100/45">
                    An independent filing service — not a law firm, and no legal advice is provided.
                </p>
            </aside>

            <main className="flex min-h-dvh flex-col px-4 py-6 sm:px-8">
                <div className="lg:hidden">
                    <Brand />
                </div>

                <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center py-8">
                    <p className="eyebrow">{eyebrow}</p>
                    <h1 className="display mt-2 text-3xl text-pine-950">{title}</h1>
                    <p className="mt-2 text-sm leading-relaxed text-pine-900/60">{description}</p>
                    <div className="mt-6">{children}</div>
                </div>

                <div className="mx-auto flex w-full max-w-md items-center justify-between gap-4 border-t border-pine-900/10 pt-4 text-[11px] text-pine-900/45">
                    <span>© {new Date().getFullYear()} Wyoming LLC Attorney</span>
                    <div className="flex gap-3">
                        <Link href="/" className="hover:text-pine-900">Home</Link>
                        <Link href="/#faq" className="hover:text-pine-900">FAQ</Link>
                    </div>
                </div>
            </main>
        </div>
    );
}
