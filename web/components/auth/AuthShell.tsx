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
            <aside className="relative hidden overflow-hidden bg-gradient-to-br from-primary-deep via-primary to-teal-700 px-10 py-12 text-white lg:flex lg:flex-col lg:justify-between">
                <div className="pointer-events-none absolute inset-0 overflow-hidden">
                    <div className="absolute -right-20 top-10 h-80 w-80 rounded-full bg-white/10 blur-3xl"></div>
                    <div className="absolute -bottom-24 -left-20 h-96 w-96 rounded-full bg-accent-cta/30 blur-3xl"></div>
                    <div className="absolute bottom-24 right-10 h-48 w-48 rounded-full bg-violet-500/20 blur-3xl"></div>
                </div>
                <div className="relative">
                    <Brand tone="light" />
                </div>

                <div className="relative max-w-md">
                    <p className="text-accent-cta text-sm font-bold uppercase tracking-widest mb-3">Limited Liability, Limitless Potential ℠</p>
                    <div className="mb-5 h-1 w-16 rounded-full bg-gradient-to-r from-accent-cta to-yellow-400"></div>
                    <p className="text-3xl leading-tight font-extrabold text-white mb-6">
                        Your filings, annual reports and linked wallet view — kept in the same place.
                    </p>
                    <dl className="mt-8 space-y-4 rounded-2xl border border-white/20 bg-white/10 p-5 backdrop-blur-sm">
                        <div className="flex items-baseline justify-between gap-4">
                            <dt className="text-sm text-white/70">Wyoming filing fee</dt>
                            <dd className="font-mono text-sm text-white">$102 online</dd>
                        </div>
                        <div className="flex items-baseline justify-between gap-4">
                            <dt className="text-sm text-white/70">Annual report minimum</dt>
                            <dd className="font-mono text-sm text-white">$60</dd>
                        </div>
                        <div className="flex items-baseline justify-between gap-4">
                            <dt className="text-sm text-white/70">Formation service</dt>
                            <dd className="font-mono text-sm text-white">$99</dd>
                        </div>
                    </dl>
                </div>

                <p className="relative max-w-sm text-[11px] leading-relaxed text-white/50">
                    An independent filing service — not a law firm, and no legal advice is provided.
                </p>
            </aside>

            <main className="flex min-h-dvh flex-col bg-gradient-to-br from-orange-50 via-white to-violet-50 px-4 py-6 sm:px-8">
                <div className="flex items-center justify-between lg:hidden">
                    <Brand />
                    <span className="rounded-full border border-orange-200 bg-orange-50 px-3 py-1 font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-orange-700">
                        Client portal
                    </span>
                </div>

                <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center py-8">
                    <div className="rounded-2xl border border-slate-200 border-t-4 border-t-accent-cta bg-white p-5 shadow-xl shadow-violet-900/5 sm:p-8">
                        <p className="text-sm font-bold uppercase tracking-widest text-accent-600">{eyebrow}</p>
                        <h1 className="mt-2 text-3xl font-extrabold text-ink">{title}</h1>
                        <p className="mt-2 text-sm leading-relaxed text-ink-soft">{description}</p>
                        <div className="auth-form mt-6">{children}</div>
                    </div>
                </div>

                <div className="mx-auto flex w-full max-w-md items-center justify-between gap-4 border-t border-violet-200 pt-4 text-[11px] text-ink-soft">
                    <span>© {new Date().getFullYear()} Wyoming LLC Attorney</span>
                    <div className="flex gap-3">
                        <Link href="/" className="hover:text-accent-600">Home</Link>
                        <Link href="/#faq" className="hover:text-accent-600">FAQ</Link>
                    </div>
                </div>
            </main>
        </div>
    );
}
