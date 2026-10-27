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
        <header className="sticky top-0 z-40 border-b border-pine-900/10 bg-bone/90 backdrop-blur">
            <div className="shell flex h-16 items-center justify-between gap-4">
                <Brand />

                <nav aria-label="Primary" className="hidden items-center gap-1 md:flex">
                    {nav.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className="rounded-full px-3.5 py-2 text-sm font-medium text-pine-900/70 transition hover:bg-pine-900/5 hover:text-pine-950"
                        >
                            {item.label}
                        </Link>
                    ))}
                </nav>

                <div className="hidden items-center gap-2 md:flex">
                    <Link href="/login" className="btn-ghost btn-sm">
                        Sign in
                    </Link>
                    <Link href="/signup" className="btn-primary btn-sm">
                        Start filing
                        <Icon name="arrow" className="h-4 w-4" />
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
                <div id="mobile-nav" className="border-t border-pine-900/10 bg-bone md:hidden">
                    <nav aria-label="Mobile" className="shell flex flex-col gap-1 py-4">
                        {nav.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setOpen(false)}
                                className="rounded-xl px-3 py-2.5 text-base font-medium text-pine-900/80 hover:bg-pine-900/5"
                            >
                                {item.label}
                            </Link>
                        ))}
                        <div className="mt-3 grid grid-cols-2 gap-2">
                            <Link href="/login" onClick={() => setOpen(false)} className="btn-outline">
                                Sign in
                            </Link>
                            <Link href="/signup" onClick={() => setOpen(false)} className="btn-primary">
                                Start filing
                            </Link>
                        </div>
                    </nav>
                </div>
            ) : null}
        </header>
    );
}
