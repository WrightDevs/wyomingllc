'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Brand } from '@/components/Brand';
import { Icon, type IconName } from '@/components/icons';
import { cn } from '@/lib/cn';
import { initials } from '@/lib/format';
import { logoutAction } from '@/app/actions/auth';
import { stopImpersonationAction } from '@/app/actions/admin';

type NavItem = { href: string; label: string; icon: IconName; exact?: boolean };

const clientNav: NavItem[] = [
    { href: '/dashboard', label: 'Overview', icon: 'overview', exact: true },
    { href: '/dashboard/filings', label: 'Filings', icon: 'filings' },
    { href: '/dashboard/wallets', label: 'Wallets', icon: 'wallet' },
    { href: '/dashboard/account', label: 'Account', icon: 'account' }
];

const adminNav: NavItem[] = [
    { href: '/admin', label: 'Users', icon: 'admin', exact: true },
    { href: '/admin/wallets', label: 'Wallet queue', icon: 'wallet' },
    { href: '/admin/filings', label: 'Filing queue', icon: 'filings' }
];

export type ShellViewer = {
    id: string;
    email: string;
    displayName: string;
    isAdmin: boolean;
};

export function PortalShell({
    viewer,
    impersonator,
    children
}: {
    viewer: ShellViewer;
    impersonator: { displayName: string; email: string } | null;
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const [open, setOpen] = useState(false);

    useEffect(() => {
        setOpen(false);
    }, [pathname]);

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

    const showAdmin = viewer.isAdmin && !impersonator;

    const renderNav = (items: NavItem[]) =>
        items.map((item) => {
            const active = item.exact ? pathname === item.href : pathname.startsWith(item.href);
            return (
                <Link
                    key={item.href}
                    href={item.href}
                    aria-current={active ? 'page' : undefined}
                    className={cn('nav-link', active && 'nav-link-active')}
                >
                    <Icon name={item.icon} className="h-[18px] w-[18px]" />
                    {item.label}
                </Link>
            );
        });

    const sidebarBody = (
        <div className="flex h-full flex-col">
            <div className="px-5 py-5">
                <Brand tone="light" />
            </div>

            <nav aria-label="Dashboard" className="flex-1 space-y-1 px-3">
                <p className="px-3 pb-1 pt-2 font-mono text-[9px] font-semibold uppercase tracking-[0.2em] text-pine-100/35">
                    Workspace
                </p>
                {renderNav(clientNav)}

                {showAdmin ? (
                    <>
                        <p className="px-3 pb-1 pt-5 font-mono text-[9px] font-semibold uppercase tracking-[0.2em] text-pine-100/35">
                            Administration
                        </p>
                        {renderNav(adminNav)}
                    </>
                ) : null}
            </nav>

            <div className="border-t border-white/10 p-3">
                <div className="flex items-center gap-2.5 rounded-xl px-2 py-2">
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-bone/10 font-mono text-[11px] font-semibold text-bone">
                        {initials(viewer.displayName, viewer.email)}
                    </span>
                    <div className="min-w-0 flex-1">
                        <p className="truncate text-[13px] font-semibold text-bone">{viewer.displayName || 'Account'}</p>
                        <p className="truncate text-[11px] text-pine-100/50">{viewer.email}</p>
                    </div>
                    <form action={logoutAction}>
                        <button
                            type="submit"
                            className="rounded-lg p-2 text-pine-100/60 transition hover:bg-white/10 hover:text-white"
                            aria-label="Sign out"
                            title="Sign out"
                        >
                            <Icon name="logout" className="h-[18px] w-[18px]" />
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );

    return (
        <div className="min-h-dvh lg:grid lg:grid-cols-[264px_minmax(0,1fr)]">
            <aside className="sticky top-0 hidden h-dvh overflow-y-auto bg-pine-950 lg:block">{sidebarBody}</aside>

            <div className="min-w-0">
                <header className="sticky top-0 z-30 flex h-14 items-center justify-between gap-3 border-b border-pine-900/10 bg-bone/95 px-4 backdrop-blur lg:hidden">
                    <Brand compact />
                    <div className="flex items-center gap-2">
                        <span className="mono hidden text-[11px] text-pine-900/50 sm:inline">
                            {viewer.displayName || viewer.email}
                        </span>
                        <button
                            type="button"
                            className="btn-outline btn-sm"
                            aria-expanded={open}
                            aria-controls="portal-drawer"
                            aria-label={open ? 'Close navigation' : 'Open navigation'}
                            onClick={() => setOpen(true)}
                        >
                            <Icon name="menu" className="h-5 w-5" />
                        </button>
                    </div>
                </header>

                {impersonator ? (
                    <div className="border-b border-amber-700/25 bg-amber-50 px-4 py-2.5 text-[13px] text-amber-950">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                            <p className="flex items-center gap-2">
                                <Icon name="eye" className="h-4 w-4" />
                                Viewing <strong className="font-semibold">{viewer.displayName || viewer.email}</strong> read-only as{' '}
                                {impersonator.displayName || impersonator.email}.
                            </p>
                            <form action={stopImpersonationAction}>
                                <button type="submit" className="btn-sm rounded-lg border border-amber-800/30 bg-white px-3 py-1.5 font-semibold text-amber-900 hover:bg-amber-100">
                                    Exit view-as
                                </button>
                            </form>
                        </div>
                    </div>
                ) : null}

                <main className="px-4 py-6 pb-safe sm:px-6 lg:px-8 lg:py-8">{children}</main>
            </div>

            {open ? (
                <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="Navigation" id="portal-drawer">
                    <button
                        type="button"
                        className="absolute inset-0 bg-pine-950/60"
                        aria-label="Close navigation"
                        onClick={() => setOpen(false)}
                    />
                    <div className="absolute inset-y-0 left-0 w-[82%] max-w-[300px] bg-pine-950 shadow-2xl">
                        <button
                            type="button"
                            onClick={() => setOpen(false)}
                            className="absolute right-3 top-4 rounded-lg p-2 text-pine-100/70 hover:bg-white/10 hover:text-white"
                            aria-label="Close navigation"
                        >
                            <Icon name="close" className="h-5 w-5" />
                        </button>
                        {sidebarBody}
                    </div>
                </div>
            ) : null}
        </div>
    );
}
