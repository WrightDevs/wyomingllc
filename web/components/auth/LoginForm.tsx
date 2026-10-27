'use client';

import Link from 'next/link';
import { useActionState } from 'react';
import { loginAction } from '@/app/actions/auth';
import { FormMessage, SubmitButton } from '@/components/ui';

export function LoginForm({ notice }: { notice?: string }) {
    const [state, action] = useActionState(loginAction, null);

    return (
        <form action={action} className="space-y-4">
            {notice ? (
                <p role="status" className="rounded-xl border border-amber-700/25 bg-amber-50 px-3.5 py-2.5 text-sm text-amber-900">
                    {notice}
                </p>
            ) : null}

            <FormMessage state={state} />

            <div>
                <label htmlFor="email" className="label">Email</label>
                <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    placeholder="you@company.com"
                    className="field"
                />
            </div>

            <div>
                <div className="flex items-baseline justify-between gap-3">
                    <label htmlFor="password" className="label">Password</label>
                    <a href="mailto:support@wyomingllclimited.xyz?subject=Password%20reset" className="mb-1.5 text-[12px] font-medium text-pine-700 hover:underline">
                        Forgot it?
                    </a>
                </div>
                <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    placeholder="Your password"
                    className="field"
                />
            </div>

            <SubmitButton className="btn-primary w-full" pendingLabel="Signing in…">
                Sign in
            </SubmitButton>

            <p className="pt-1 text-center text-sm text-pine-900/60">
                No account yet?{' '}
                <Link href="/signup" className="link">Create one</Link>
            </p>
        </form>
    );
}
