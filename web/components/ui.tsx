'use client';

import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { useFormStatus } from 'react-dom';
import { Icon } from './icons';
import { cn } from '@/lib/cn';

export function StatusPill({ status }: { status: string }) {
    const value = String(status || '').toLowerCase();
    const tone =
        value === 'approved' || value === 'active'
            ? 'badge-good'
            : value === 'rejected' || value === 'inactive'
              ? 'badge-bad'
              : value === 'processing' || value === 'pending'
                ? 'badge-warn'
                : 'badge-neutral';
    return <span className={tone}>{value || 'unknown'}</span>;
}

export function FormMessage({ state }: { state: { ok: boolean; message: string } | null }) {
    if (!state?.message) return null;
    return (
        <p
            role="status"
            aria-live="polite"
            className={cn(
                'rounded-xl border px-3.5 py-2.5 text-sm',
                state.ok ? 'border-emerald-700/20 bg-emerald-50 text-emerald-900' : 'border-red-700/20 bg-red-50 text-red-900'
            )}
        >
            {state.message}
        </p>
    );
}

export function SubmitButton({
    children,
    className = 'btn-primary',
    pendingLabel = 'Working…',
    ...rest
}: ButtonHTMLAttributes<HTMLButtonElement> & { pendingLabel?: string; children: ReactNode }) {
    const { pending } = useFormStatus();
    return (
        <button type="submit" className={className} disabled={pending || rest.disabled} {...rest}>
            {pending ? pendingLabel : children}
        </button>
    );
}

export function EmptyState({
    title,
    body,
    action
}: {
    title: string;
    body: string;
    action?: ReactNode;
}) {
    return (
        <div className="rounded-card border border-dashed border-pine-900/20 bg-white/60 px-6 py-10 text-center">
            <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-pine-50 text-pine-700">
                <Icon name="filings" />
            </div>
            <h3 className="display text-lg text-pine-950">{title}</h3>
            <p className="mx-auto mt-1 max-w-md text-sm text-pine-900/60">{body}</p>
            {action ? <div className="mt-4">{action}</div> : null}
        </div>
    );
}

export function PageHeader({
    eyebrow,
    title,
    description,
    action
}: {
    eyebrow: string;
    title: string;
    description?: string;
    action?: ReactNode;
}) {
    return (
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
                <p className="eyebrow">{eyebrow}</p>
                <h1 className="display mt-1 text-2xl text-pine-950 sm:text-3xl">{title}</h1>
                {description ? <p className="mt-1.5 max-w-2xl text-sm text-pine-900/60">{description}</p> : null}
            </div>
            {action ? <div className="shrink-0">{action}</div> : null}
        </div>
    );
}

export function Note({ tone = 'neutral', children }: { tone?: 'neutral' | 'warn'; children: ReactNode }) {
    return (
        <div
            className={cn(
                'flex gap-2.5 rounded-xl border px-3.5 py-3 text-[13px] leading-relaxed',
                tone === 'warn'
                    ? 'border-amber-700/25 bg-amber-50/80 text-amber-950'
                    : 'border-pine-900/10 bg-pine-50/70 text-pine-900/75'
            )}
        >
            <Icon name={tone === 'warn' ? 'alert' : 'shield'} className="mt-0.5 h-4 w-4 shrink-0" />
            <div>{children}</div>
        </div>
    );
}
