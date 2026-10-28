import { redirect } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { LoginForm } from '@/components/auth/LoginForm';
import { hasDatabase } from '@/lib/env';
import { getViewer } from '@/lib/session';

export const metadata = { title: 'Sign in — Wyoming Attorney' };
export const dynamic = 'force-dynamic';

export default async function LoginPage({
    searchParams
}: {
    searchParams: Promise<{ error?: string }>;
}) {
    if (!hasDatabase()) redirect('/setup');
    const viewer = await getViewer();
    if (viewer && !viewer.impersonator && viewer.user.status === 'active') redirect('/dashboard');

    const params = await searchParams;
    const notice =
        params.error === 'inactive'
            ? 'This account was deactivated. An administrator can restore access.'
            : params.error === 'expired'
              ? 'Your session expired. Sign in again.'
              : undefined;

    return (
        <div className="min-h-screen bg-[#f9fafb] text-[#0f172a] font-['ui-sans-serif',system-ui,sans-serif] flex flex-col justify-between">
            {/* Top Accent System Informational Banner */}
            <div className="bg-[#6366f1] text-white py-2.5 px-4 text-center text-[13px] font-medium tracking-wide">
                <div className="max-w-6xl mx-auto flex items-center justify-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#f5c542] animate-pulse" />
                    <span>Secure client portal — filings, registered agent records, and asset oversight.</span>
                </div>
            </div>

            {/* Main Centered Content */}
            <main className="flex-1 flex flex-col items-center justify-center px-4 py-12 sm:py-16">
                {/* Brand Logo & Header */}
                <div className="mb-8 text-center flex flex-col items-center">
                    <Link href="/" className="inline-block group mb-3">
                        <div className="flex items-center gap-3">
                            <Image
                                src="/wyoming.png"
                                alt="Wyoming Attorney Logo"
                                width={180}
                                height={42}
                                className="h-10 w-auto object-contain"
                                priority
                            />
                        </div>
                    </Link>
                    <h1 className="text-[32px] sm:text-[36px] font-bold text-[#0f172a] leading-[1.2] tracking-tight">
                        Welcome Back
                    </h1>
                    <p className="mt-2 text-[16px] sm:text-[18px] text-[#4b5563] leading-[1.5] max-w-sm">
                        Sign in to manage your company filings and business records.
                    </p>
                </div>

                {/* Primary Card */}
                <div className="w-full max-w-[440px] rounded-2xl bg-white border border-[#e5e7eb] p-8 sm:p-10 shadow-[0_10px_15px_-3px_rgb(0_0_0/0.1),0_4px_6px_-4px_rgb(0_0_0/0.1)]">
                    <LoginForm notice={notice} />
                </div>

                {/* Secondary "Need Help?" Block */}
                <div className="w-full max-w-[440px] mt-6 rounded-xl border border-[#e5e7eb] bg-[#eff6ff] p-5 text-center">
                    <p className="text-[14px] font-medium text-[#0f172a]">
                        Need assistance with your filing?
                    </p>
                    <p className="mt-1 text-[13px] text-[#4b5563]">
                        Our Sheridan, Wyoming team is available Monday through Friday.
                    </p>
                    <div className="mt-3 flex items-center justify-center gap-4 text-[14px]">
                        <a
                            href="mailto:support@wyomingattorney.com"
                            className="font-medium text-[#2563eb] hover:underline"
                        >
                            support@wyomingattorney.com
                        </a>
                        <span className="text-[#d1d5db]">·</span>
                        <Link
                            href="/register"
                            className="font-medium text-[#2563eb] hover:underline"
                        >
                            Form an LLC
                        </Link>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="border-t border-[#e5e7eb] bg-white py-6 text-center text-[13px] text-[#4b5563]">
                <div className="max-w-6xl mx-auto px-4 space-y-1">
                    <p className="font-medium text-[#0f172a]">
                        Wyoming Attorney · Independent Registered Agent &amp; Formation Service
                    </p>
                    <p className="text-[12px] text-[#4b5563]/80">
                        Wyoming Attorney is a business document filing service, not a law firm, and does not provide legal advice.
                    </p>
                </div>
            </footer>
        </div>
    );
}
