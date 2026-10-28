'use client';

import Link from 'next/link';
import { useActionState } from 'react';
import { loginAction } from '@/app/actions/auth';
import { FormMessage, SubmitButton } from '@/components/ui';

export function LoginForm({ notice }: { notice?: string }) {
    const [state, action] = useActionState(loginAction, null);

    return (
        <form action={action} className="space-y-5">
            {notice ? (
                <div
                    role="status"
                    className="rounded-lg border border-[#f59e0b]/30 bg-[#eff6ff] p-3 text-[14px] text-[#0f172a] leading-relaxed"
                >
                    {notice}
                </div>
            ) : null}

            <FormMessage state={state} />

            <div>
                <label
                    htmlFor="email"
                    className="block text-[14px] font-medium text-[#0f172a] mb-1.5 leading-[1.5]"
                >
                    Email address
                </label>
                <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    placeholder="name@company.com"
                    className="w-full h-11 px-4 border border-[#e5e7eb] rounded-lg bg-white text-[#0f172a] text-[16px] leading-[1.5] placeholder:text-[#4b5563]/60 focus:outline-none focus:border-[#2563eb] focus:ring-2 focus:ring-[#2563eb]/20 transition-all duration-150"
                />
            </div>

            <div>
                <div className="flex items-center justify-between mb-1.5">
                    <label
                        htmlFor="password"
                        className="block text-[14px] font-medium text-[#0f172a] leading-[1.5]"
                    >
                        Password
                    </label>
                    <a
                        href="mailto:support@wyomingattorney.com?subject=Password%20reset"
                        className="text-[14px] font-medium text-[#2563eb] hover:underline cursor-pointer transition-all duration-150"
                    >
                        Forgot password?
                    </a>
                </div>
                <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    placeholder="Enter your account password"
                    className="w-full h-11 px-4 border border-[#e5e7eb] rounded-lg bg-white text-[#0f172a] text-[16px] leading-[1.5] placeholder:text-[#4b5563]/60 focus:outline-none focus:border-[#2563eb] focus:ring-2 focus:ring-[#2563eb]/20 transition-all duration-150"
                />
            </div>

            <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                        type="checkbox"
                        name="remember"
                        defaultChecked
                        className="w-4 h-4 rounded border-[#d1d5db] text-[#2563eb] focus:ring-[#2563eb]"
                    />
                    <span className="text-[14px] text-[#4b5563]">Remember this browser</span>
                </label>
            </div>

            <div className="pt-2">
                <SubmitButton
                    className="w-full h-12 rounded-lg bg-[#2563eb] hover:bg-[#477cf0] text-white font-semibold text-[16px] leading-[1.5] flex items-center justify-center cursor-pointer transition-all duration-150"
                    pendingLabel="Signing in…"
                >
                    Sign in
                </SubmitButton>
            </div>

            <div className="pt-3 text-center text-[14px] text-[#4b5563]">
                Need a new Wyoming entity?{' '}
                <Link
                    href="/register"
                    className="font-medium text-[#f97316] hover:underline cursor-pointer transition-all duration-150"
                >
                    Register here →
                </Link>
            </div>
        </form>
    );
}
