import Link from 'next/link';
import { WalletLinker } from '@/components/portal/WalletLinker';
import { requireUser } from '@/lib/session';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Link wallet' };

export default async function LinkWalletPage() {
    const viewer = await requireUser();

    return (
        <div className="min-h-screen w-full bg-[#0f141b] text-[#e5e7eb] font-['Inter',sans-serif] flex flex-col selection:bg-[#2563eb] selection:text-white">
            <header className="sticky top-0 z-30 w-full border-b border-[#262c36] bg-[#0f141b]/95 backdrop-blur">
                <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
                    <Link
                        href="/dashboard/wallets"
                        className="inline-flex items-center gap-2 text-sm text-[#9ca3af] hover:text-white transition-colors py-1 px-2 -ml-2 rounded-lg hover:bg-[#161c24]"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        <span className="font-medium hidden sm:inline">Back to Assets</span>
                    </Link>
                    <h1 className="text-[17px] font-bold text-white tracking-tight">Connect Wallet</h1>
                    <div className="w-8" />
                </div>
            </header>

            <main className="flex-1 w-full max-w-2xl mx-auto px-4 py-8 pb-28">
                <div className="mb-6">
                    <p className="text-xs font-semibold uppercase tracking-wider text-[#f5c542]">Non-Custodial Link</p>
                    <h2 className="text-2xl font-bold text-white mt-1">Connect Web3 Wallet</h2>
                    <p className="text-sm text-[#9ca3af] mt-1">
                        Derive public addresses securely to sync balances and portfolio overview in your Wyoming LLC dashboard.
                    </p>
                </div>

                <WalletLinker userName={viewer.user.displayName} />
            </main>
        </div>
    );
}
