'use client';

import Link from 'next/link';
import { useActionState } from 'react';
import { registerAction } from '@/app/actions/auth';
import { FormMessage, SubmitButton } from '@/components/ui';

export function SignupForm() {
    const [state, action] = useActionState(registerAction, null);

    return (
        <form action={action} className="space-y-4">
            <FormMessage state={state} />

            <div>
                <label htmlFor="displayName" className="label">Your name</label>
                <input
                    id="displayName"
                    name="displayName"
                    type="text"
                    autoComplete="name"
                    required
                    maxLength={80}
                    placeholder="Jordan Ellis"
                    className="field"
                />
            </div>

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
                <label htmlFor="password" className="label">Password</label>
                <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="new-password"
                    required
                    minLength={8}
                    placeholder="At least 8 characters"
                    className="field"
                />
                <p className="mt-1.5 text-[12px] text-pine-900/50">Use 8 or more characters. Long beats complicated.</p>
            </div>

            <label className="flex items-start gap-2.5 text-[13px] leading-relaxed text-pine-900/70">
                <input type="checkbox" name="terms" required className="mt-0.5 h-4 w-4 rounded border-pine-900/30 accent-pine-700" />
                <span>
                    I understand this is a filing service, not a law firm, and that account access is governed by the terms of use.
                </span>
            </label>

            <SubmitButton className="btn-primary w-full" pendingLabel="Creating account…">
                Create account
            </SubmitButton>

            <p className="pt-1 text-center text-sm text-pine-900/60">
                Already have an account?{' '}
                <Link href="/login" className="link">Sign in</Link>
            </p>
        </form>
    );
}
