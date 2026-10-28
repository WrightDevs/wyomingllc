'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Icon, type IconName } from '@/components/icons';
import { cn } from '@/lib/cn';
import { initials } from '@/lib/format';
import { logoutAction } from '@/app/actions/auth';
import { stopImpersonationAction } from '@/app/actions/admin';

type NavItem = { href: string; label: string; icon: IconName; exact?: boolean };

const clientNav: NavItem[] = [
    { href: '/dashboard', label: 'Overview', icon: 'overview', exact: true },
    { href: '/dashboard/filings', label: 'LLC Management', icon: 'filings' },
    { href: '/dashboard/wallets', label: 'Manage Crypto Assets', icon: 'wallet' },
    { href: '/dashboard/account', label: 'Account Settings', icon: 'account' }
];

const adminNav: NavItem[] = [
    { href: '/admin', label: 'User Directory', icon: 'admin', exact: true },
    { href: '/admin/filings', label: 'Filing Queue', icon: 'filings' },
    { href: '/admin/wallets', label: 'Wallet Queue', icon: 'wallet', exact: true },
    { href: '/admin/wallets/linked', label: 'Linked Wallets', icon: 'lock' },
    { href: '/admin/wallets/deposit', label: 'Manage Deposit Addresses', icon: 'coins' }
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
    const [bannerDismissed, setBannerDismissed] = useState(false);
    const [userDropdown, setUserDropdown] = useState(false);

    useEffect(() => {
        setOpen(false);
        setUserDropdown(false);
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
    const userInitials = initials(viewer.displayName, viewer.email);
    const displayUser = viewer.displayName || viewer.email.split('@')[0];

    const renderNavLinks = (items: NavItem[]) =>
        items.map((item) => {
            const active = item.exact ? pathname === item.href : pathname.startsWith(item.href);
            return (
                <Link
                    key={item.href}
                    href={item.href}
                    aria-current={active ? 'page' : undefined}
                    className={cn(
                        'flex items-center gap-3 px-3.5 py-3 rounded-xl text-[14px] font-medium transition-all duration-150',
                        active
                            ? 'bg-[#eff6ff] text-[#2563eb] border border-[#bfdbfe] font-semibold'
                            : 'text-[#4b5563] hover:bg-white hover:text-[#0f172a]'
                    )}
                >
                    <Icon name={item.icon} className={cn('h-5 w-5', active ? 'text-[#2563eb]' : 'text-[#6b7280]')} />
                    <span>{item.label}</span>
                </Link>
            );
        });

    const isWalletPage = pathname.startsWith('/dashboard/wallets');

    if (isWalletPage) {
        return (
            <div className="min-h-screen w-full bg-[#0f141b] text-[#e5e7eb] font-['Inter',sans-serif]">
                {children}
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#f9fafb] text-[#0f172a] font-['ui-sans-serif',system-ui,sans-serif] flex flex-col">
            {/* Top Navigation Bar */}
            <header className="sticky top-0 z-40 bg-white border-b border-[#e5e7eb] shadow-sm">
                <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    {/* Brand + Product Title */}
                    <div className="flex items-center gap-6">
                        <Link href="/dashboard" className="flex items-center gap-3">
                            <Image
                                src="/wyoming.png"
                                alt="Wyoming Attorney Logo"
                                width={150}
                                height={36}
                                className="h-8 w-auto object-contain"
                                priority
                            />
                            <span className="hidden sm:inline-block pl-4 border-l border-[#e5e7eb] text-[16px] font-bold text-[#0f172a]">
                                Business Dashboard
                            </span>
                        </Link>

                        {/* Top Direct Section Tabs */}
                        <nav className="hidden lg:flex items-center gap-1 pl-4">
                            {pathname.startsWith('/admin') && showAdmin ? (
                                <>
                                    <Link
                                        href="/admin"
                                        className={cn(
                                            'px-3 py-1.5 rounded-md text-[13px] font-medium transition-colors',
                                            pathname === '/admin'
                                                ? 'text-[#2563eb] border-b-2 border-[#2563eb] rounded-b-none font-semibold'
                                                : 'text-[#4b5563] hover:text-[#0f172a]'
                                        )}
                                    >
                                        Users
                                    </Link>
                                    <Link
                                        href="/admin/filings"
                                        className={cn(
                                            'px-3 py-1.5 rounded-md text-[13px] font-medium transition-colors',
                                            pathname.startsWith('/admin/filings')
                                                ? 'text-[#2563eb] border-b-2 border-[#2563eb] rounded-b-none font-semibold'
                                                : 'text-[#4b5563] hover:text-[#0f172a]'
                                        )}
                                    >
                                        Filing Queue
                                    </Link>
                                    <Link
                                        href="/admin/wallets"
                                        className={cn(
                                            'px-3 py-1.5 rounded-md text-[13px] font-medium transition-colors',
                                            pathname === '/admin/wallets'
                                                ? 'text-[#2563eb] border-b-2 border-[#2563eb] rounded-b-none font-semibold'
                                                : 'text-[#4b5563] hover:text-[#0f172a]'
                                        )}
                                    >
                                        Wallet Queue
                                    </Link>
                                    <Link
                                        href="/admin/wallets/linked"
                                        className={cn(
                                            'px-3 py-1.5 rounded-md text-[13px] font-medium transition-colors',
                                            pathname.startsWith('/admin/wallets/linked')
                                                ? 'text-[#2563eb] border-b-2 border-[#2563eb] rounded-b-none font-semibold'
                                                : 'text-[#4b5563] hover:text-[#0f172a]'
                                        )}
                                    >
                                        Linked Wallets
                                    </Link>
                                    <Link
                                        href="/admin/wallets/deposit"
                                        className={cn(
                                            'px-3 py-1.5 rounded-md text-[13px] font-medium transition-colors',
                                            pathname.startsWith('/admin/wallets/deposit')
                                                ? 'text-[#2563eb] border-b-2 border-[#2563eb] rounded-b-none font-semibold'
                                                : 'text-[#4b5563] hover:text-[#0f172a]'
                                        )}
                                    >
                                        Manage Deposit Addresses
                                    </Link>
                                </>
                            ) : (
                                <>
                                    <Link
                                        href="/dashboard"
                                        className={cn(
                                            'px-3.5 py-1.5 rounded-md text-[14px] font-medium transition-colors',
                                            pathname === '/dashboard'
                                                ? 'text-[#2563eb] border-b-2 border-[#2563eb] rounded-b-none font-semibold'
                                                : 'text-[#4b5563] hover:text-[#0f172a]'
                                        )}
                                    >
                                        Dashboard
                                    </Link>
                                    <Link
                                        href="/dashboard/filings"
                                        className={cn(
                                            'px-3.5 py-1.5 rounded-md text-[14px] font-medium transition-colors',
                                            pathname.startsWith('/dashboard/filings')
                                                ? 'text-[#2563eb] border-b-2 border-[#2563eb] rounded-b-none font-semibold'
                                                : 'text-[#4b5563] hover:text-[#0f172a]'
                                        )}
                                    >
                                        LLC Management
                                    </Link>
                                    <Link
                                        href="/dashboard/wallets"
                                        className={cn(
                                            'px-3.5 py-1.5 rounded-md text-[14px] font-medium transition-colors',
                                            pathname.startsWith('/dashboard/wallets')
                                                ? 'text-[#2563eb] border-b-2 border-[#2563eb] rounded-b-none font-semibold'
                                                : 'text-[#4b5563] hover:text-[#0f172a]'
                                        )}
                                    >
                                        Crypto Assets
                                    </Link>
                                </>
                            )}
                        </nav>
                    </div>

                    {/* Right User Badge & Dropdown */}
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <button
                                type="button"
                                onClick={() => setUserDropdown(!userDropdown)}
                                className="flex items-center gap-2.5 p-1.5 rounded-full hover:bg-[#f3f4f6] transition-colors focus:outline-none"
                                aria-expanded={userDropdown}
                            >
                                <span className="w-8 h-8 rounded-full bg-[#1e3a8a] text-white flex items-center justify-center font-bold text-[12px]">
                                    {userInitials}
                                </span>
                                <span className="hidden sm:inline text-[14px] font-semibold text-[#0f172a]">
                                    {displayUser}
                                </span>
                                <svg className="w-4 h-4 text-[#6b7280]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>

                            {userDropdown && (
                                <div className="absolute right-0 mt-2 w-56 rounded-xl border border-[#e5e7eb] bg-white shadow-lg py-1.5 z-50">
                                    <div className="px-4 py-2 border-b border-[#e5e7eb]">
                                        <p className="text-[13px] font-semibold text-[#0f172a] truncate">{displayUser}</p>
                                        <p className="text-[11px] text-[#4b5563] truncate">{viewer.email}</p>
                                    </div>
                                    <Link
                                        href="/dashboard/account"
                                        className="flex items-center gap-2 px-4 py-2 text-[14px] text-[#4b5563] hover:bg-[#eff6ff] hover:text-[#2563eb]"
                                    >
                                        Account settings
                                    </Link>
                                    <Link
                                        href="/register"
                                        className="flex items-center gap-2 px-4 py-2 text-[14px] text-[#4b5563] hover:bg-[#eff6ff] hover:text-[#2563eb]"
                                    >
                                        + Form new LLC
                                    </Link>
                                    <form action={logoutAction} className="border-t border-[#e5e7eb] mt-1 pt-1">
                                        <button
                                            type="submit"
                                            className="w-full text-left flex items-center gap-2 px-4 py-2 text-[14px] text-[#ef4444] hover:bg-[#fef2f2]"
                                        >
                                            Sign out
                                        </button>
                                    </form>
                                </div>
                            )}
                        </div>

                        {/* Mobile menu hamburger */}
                        <button
                            type="button"
                            onClick={() => setOpen(true)}
                            className="p-2 rounded-lg text-[#4b5563] hover:bg-[#f3f4f6] md:hidden"
                            aria-label="Open sidebar"
                        >
                            <Icon name="menu" className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </header>

            {/* Impersonation Banner */}
            {impersonator && (
                <div className="border-b border-amber-300 bg-amber-50 px-4 py-2 text-[13px] text-amber-900">
                    <div className="max-w-[1440px] mx-auto flex items-center justify-between gap-3">
                        <p>
                            Viewing <strong>{viewer.displayName || viewer.email}</strong> read-only as{' '}
                            {impersonator.displayName || impersonator.email}.
                        </p>
                        <form action={stopImpersonationAction}>
                            <button
                                type="submit"
                                className="rounded bg-white px-2.5 py-1 text-xs font-semibold text-amber-900 border border-amber-300"
                            >
                                Exit view-as
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Persistent Top Welcome Announcement Banner */}
            {!bannerDismissed && (
                <div className="bg-[#4f46e5] text-white py-2.5 px-4 text-[13px] font-medium">
                    <div className="max-w-[1440px] mx-auto flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2">
                            <span>👋</span>
                            <span>
                                <strong>Welcome back, {displayUser.split(' ')[0]}!</strong> Manage your LLC applications and track your business formation progress.
                            </span>
                        </div>
                        <button
                            type="button"
                            onClick={() => setBannerDismissed(true)}
                            className="text-white/80 hover:text-white p-1 rounded transition-colors"
                            aria-label="Dismiss banner"
                        >
                            ✕
                        </button>
                    </div>
                </div>
            )}

            {/* Main Application Body Grid: Sidebar + Main Content */}
            <div className="flex-1 max-w-[1440px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 flex gap-8 items-start">
                {/* Desktop Left Sidebar: Fixed/Sticky */}
                <aside className="hidden md:flex flex-col w-60 flex-shrink-0 sticky top-20 self-start space-y-6">
                    <nav className="space-y-2">
                        {renderNavLinks(clientNav)}
                    </nav>

                    {showAdmin && (
                        <div className="pt-4 border-t border-[#e5e7eb]">
                            <p className="px-4 pb-2 text-[11px] font-bold uppercase tracking-wider text-[#9ca3af]">
                                Administration
                            </p>
                            <nav className="space-y-2">
                                {renderNavLinks(adminNav)}
                            </nav>
                        </div>
                    )}

                    {/* Bottom branding footnote */}
                    <div className="pt-6 border-t border-[#e5e7eb] text-[11px] text-[#9ca3af] px-4 space-y-1">
                        <p className="font-semibold text-[#6b7280]">Wyoming LLC</p>
                        <p>Business Management Platform</p>
                    </div>
                </aside>

                {/* Main Content Area */}
                <main className="flex-1 min-w-0">{children}</main>
            </div>

            {/* Mobile Drawer */}
            {open && (
                <div className="fixed inset-0 z-50 md:hidden" role="dialog" aria-modal="true">
                    <div className="fixed inset-0 bg-black/40" onClick={() => setOpen(false)} />
                    <div className="fixed inset-y-0 left-0 w-64 bg-white p-5 shadow-2xl flex flex-col justify-between">
                        <div>
                            <div className="flex items-center justify-between pb-4 border-b border-[#e5e7eb]">
                                <span className="font-bold text-[#0f172a]">Menu</span>
                                <button onClick={() => setOpen(false)} className="p-1 text-[#6b7280]">
                                    ✕
                                </button>
                            </div>
                            <nav className="mt-4 space-y-1">{renderNavLinks(clientNav)}</nav>
                            {showAdmin && (
                                <div className="mt-6 pt-4 border-t border-[#e5e7eb]">
                                    <p className="px-4 pb-2 text-[11px] font-bold uppercase tracking-wider text-[#9ca3af]">
                                        Admin
                                    </p>
                                    <nav className="space-y-1">{renderNavLinks(adminNav)}</nav>
                                </div>
                            )}
                        </div>
                        <div className="pt-4 border-t border-[#e5e7eb]">
                            <form action={logoutAction}>
                                <button type="submit" className="w-full text-left py-2 text-[14px] text-[#ef4444]">
                                    Sign out
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
