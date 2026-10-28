import type { Metadata } from 'next';
import Link from 'next/link';
import { getViewer } from '@/lib/session';
import { RegisterCompanyForm } from '@/components/register/RegisterCompanyForm';

export const metadata: Metadata = {
    title: 'Register Company — Wyoming Company LLC',
    description: 'Form a Wyoming LLC or Corporation. Same-day filing, registered agent, and client portal.'
};

export const dynamic = 'force-dynamic';

export default async function RegisterPage() {
    const viewer = await getViewer();
    const currentUser = viewer
        ? {
              id: viewer.user.id,
              email: viewer.user.email,
              displayName: viewer.user.displayName
          }
        : null;

    return (
        <div className="min-h-screen bg-[#f9fafb] text-[#0f172a] font-['Inter',sans-serif]">
            {/* Top Cloud Band / Header */}
            <header className="border-b border-[#d1d5db] bg-white sticky top-0 z-50">
                <div className="max-w-6xl mx-auto px-4 py-3 sm:py-4 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-[#1e3a8a] text-white flex items-center justify-center font-bold text-lg">
                            W
                        </div>
                        <div>
                            <span className="text-[16px] font-bold tracking-tight text-[#0f172a] block leading-tight">
                                Wyoming Company LLC
                            </span>
                            <span className="text-[11px] font-medium uppercase tracking-wider text-[#6b7280]">
                                Registered Agent & Formation
                            </span>
                        </div>
                    </Link>

                    <div className="flex items-center gap-4">
                        {currentUser ? (
                            <Link
                                href="/dashboard"
                                className="text-[14px] font-semibold text-[#1e3a8a] hover:underline"
                            >
                                Dashboard
                            </Link>
                        ) : (
                            <Link
                                href="/login"
                                className="px-4 py-2 border border-[#d1d5db] rounded-lg text-[14px] font-semibold text-[#0f172a] hover:border-[#1e3a8a] transition-colors"
                            >
                                Sign in
                            </Link>
                        )}
                    </div>
                </div>
            </header>

            {/* Step & Hero Section */}
            <div className="bg-[#f3f4f6] border-b border-[#d1d5db] py-10 sm:py-14">
                <div className="max-w-6xl mx-auto px-4">
                    {/* Step Indicator Pill */}
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#f5c542] text-[#0f172a] text-[11px] font-semibold uppercase tracking-wider mb-4">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#0f172a]" />
                        Step 1 · Company Registration
                    </div>

                    <h1 className="text-[32px] sm:text-[36px] font-extrabold text-[#0f172a] tracking-tight leading-[1.2]">
                        Tell us about your business.
                    </h1>
                    <p className="mt-3 text-[16px] text-[#6b7280] max-w-2xl leading-[1.5]">
                        Complete the registration details below to form your Wyoming entity. We prepare your Articles of Organization, provide statutory registered agent service, and establish your records portal.
                    </p>

                    {/* Stats bar */}
                    <div className="mt-6 flex flex-wrap items-center gap-6 text-[12px] text-[#0f172a]">
                        <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-[#16a34a]" />
                            <span className="font-semibold">$99 SERVICE FEE</span>
                            <span className="text-[#6b7280]">+ $102 State Fee</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-[#16a34a]" />
                            <span className="font-semibold">SAME-DAY PROCESSING</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-[#16a34a]" />
                            <span className="font-semibold">1ST YEAR REGISTERED AGENT INCLUDED</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Form Container */}
            <main className="max-w-6xl mx-auto px-4 py-8 sm:py-12">
                <RegisterCompanyForm currentUser={currentUser} />
            </main>

            {/* Footer */}
            <footer className="border-t border-[#d1d5db] bg-white py-8 mt-16 text-center text-[12px] text-[#6b7280]">
                <div className="max-w-6xl mx-auto px-4 space-y-2">
                    <p className="font-medium text-[#0f172a]">
                        Wyoming Company LLC · Registered Agent & Business Formation
                    </p>
                    <p>
                        Wyoming Company LLC is not a law firm and does not provide legal, financial, or tax advice.
                    </p>
                    <p className="text-[#9ca3af]">
                        1309 Coffeen Ave, Sheridan, WY 82801 · Flat Transparent Pricing
                    </p>
                </div>
            </footer>
        </div>
    );
}
