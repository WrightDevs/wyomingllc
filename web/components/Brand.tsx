import Link from 'next/link';
import { cn } from '@/lib/cn';

export function Brand({ tone = 'dark', compact = false }: { tone?: 'dark' | 'light'; compact?: boolean }) {
    return (
        <Link
            href="/"
            className="group flex items-center gap-2.5 rounded-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-orange-400"
            aria-label="Wyoming LLC Attorney — home"
        >
            <span
                className={cn(
                    'flex h-9 w-9 shrink-0 items-center justify-center rounded-[11px] border',
                    tone === 'dark'
                        ? 'border-primary/15 bg-primary text-white'
                        : 'border-white/20 bg-white/10 text-white'
                )}
            >
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
                    <path d="M3 17.5 8 8l4 6 3-8 5 11.5" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
                    <path d="M3 20.5h18" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" opacity="0.5" />
                </svg>
            </span>
            <span className="leading-none">
                <span
                    className={cn(
                        'display block text-[17px] font-semibold tracking-tight',
                        tone === 'dark' ? 'text-slate-800' : 'text-white'
                    )}
                >
                    Wyoming LLC
                </span>
                {!compact ? (
                    <span
                        className={cn(
                            'mt-1 block font-mono text-[9px] font-semibold uppercase tracking-[0.2em]',
                            tone === 'dark' ? 'text-slate-500' : 'text-slate-200'
                        )}
                    >
                        Filings &amp; Records
                    </span>
                ) : null}
            </span>
        </Link>
    );
}
