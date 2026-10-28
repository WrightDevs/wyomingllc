'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Brand } from './Brand';
import { Icon } from './icons';

const nav = [
    { label: 'Services', href: '/#services' },
    { label: 'How it works', href: '/#process' },
    { label: 'Pricing', href: '/#pricing' },
    { label: 'FAQ', href: '/#faq' }
];

export function SiteHeader() {
    const [open, setOpen] = useState(false);

    useEffect(() => {
        if (!open) return;
        const onKey = (event: KeyboardEvent) => {
            if (event.key === 'Escape') setOpen(false);
        };
        document.addEventListener('keydown', onKey);
        document.body.style.overflow = 'hidden';
        return () => {
            document.removeEventListener('keydown', onKey);
            document.body.style.overflow = '';
        };
    }, [open]);

    return (
        <>
            <div className="bg-gradient-to-r from-primary to-teal-600 text-white">
                <div className="shell flex flex-wrap items-center justify-center gap-6 py-2 text-center text-[11px] font-medium uppercase tracking-[0.12em] md:text-xs">
                    <span className="inline-flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-orange-400" /> Same-Day Filing</span>
                    <span className="inline-flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-orange-400" /> Instant Bank Account</span>
                    <span className="inline-flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-orange-400" /> No Hidden Fees</span>
                </div>
            </div>

            <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 shadow-sm backdrop-blur">
                <div className="shell flex h-16 items-center justify-between gap-4">
                    <Brand />

                    <nav aria-label="Primary" className="hidden items-center gap-6 md:flex">
                        {nav.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className="text-slate-600 hover:text-primary font-medium transition"
                            >
                                {item.label}
                            </Link>
                        ))}
                    </nav>

                    <div className="hidden items-center gap-3 md:flex">
                        <Link href="/login" className="rounded-md border border-slate-300 px-5 py-2 text-slate-700 transition hover:border-primary hover:text-primary">
                            Login
                        </Link>
                        <Link href="/register" className="rounded-md bg-[#1e3a8a] hover:bg-[#2548a8] px-5 py-2 font-semibold text-white shadow-none transition">
                            Register Company
                        </Link>
                    </div>

                    <button
                        type="button"
                        className="btn-outline btn-sm md:hidden"
                        aria-expanded={open}
                        aria-controls="mobile-nav"
                        aria-label={open ? 'Close menu' : 'Open menu'}
                        onClick={() => setOpen((value) => !value)}
                    >
                        <Icon name={open ? 'close' : 'menu'} className="h-5 w-5" />
                    </button>
                </div>

                {open ? (
                    <div id="mobile-nav" className="border-t border-slate-200 bg-slate-50 md:hidden">
                        <nav aria-label="Mobile" className="shell flex flex-col gap-1 py-4">
                            {nav.map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={() => setOpen(false)}
                                    className="rounded-xl px-3 py-2.5 text-base font-medium text-slate-700 hover:bg-white"
                                >
                                    {item.label}
                                </Link>
                            ))}
                            <div className="mt-3 grid grid-cols-2 gap-2">
                                <Link href="/login" onClick={() => setOpen(false)} className="btn-outline">
                                    Sign in
                                </Link>
                                <Link href="/register" onClick={() => setOpen(false)} className="rounded-md bg-[#1e3a8a] text-center py-2.5 font-semibold text-white">
                                    Register Company
                                </Link>
                            </div>
                        </nav>
                    </div>
                ) : null}
            </header>
        </>
    );
}
