'use client';

import { useState } from 'react';
import { CompanyForm } from './CompanyForm';

type FilingModalTriggerProps = {
    variant?: 'top' | 'bottom' | 'full';
    label?: string;
};

export function FilingModalTrigger({ variant = 'top', label = 'Start New Filing' }: FilingModalTriggerProps) {
    const [isOpen, setIsOpen] = useState(false);

    const buttonClass =
        variant === 'bottom'
            ? 'w-full inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-primary to-teal-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition active:scale-[0.99]'
            : variant === 'full'
              ? 'w-full inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-primary to-teal-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:shadow-md active:scale-[0.99]'
              : 'w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-primary to-teal-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:shadow-md active:scale-[0.99]';

    return (
        <>
            <button onClick={() => setIsOpen(true)} className={buttonClass}>
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                </svg>
                {label}
            </button>

            {isOpen && (
                <div
                    className="fixed inset-0 z-[60] flex items-end justify-center bg-black/50 px-0 py-0 sm:items-center sm:px-4 sm:py-6"
                    onClick={(e) => {
                        if (e.target === e.currentTarget) {
                            setIsOpen(false);
                        }
                    }}
                >
                    <div className="relative flex h-[92dvh] w-full max-w-xl flex-col overflow-hidden rounded-t-2xl bg-paper shadow-2xl sm:h-auto sm:max-h-[90dvh] sm:rounded-2xl">
                        <div className="flex items-center justify-between border-b border-hairline px-4 py-3 sm:px-6 sm:py-4">
                            <div>
                                <p className="text-sm font-semibold text-ink">New Wyoming LLC Filing</p>
                                <p className="text-xs text-ink-soft">Complete the details below to start your filing</p>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="flex h-8 w-8 items-center justify-center rounded-full text-ink-soft transition hover:bg-cloud hover:text-ink"
                                aria-label="Close"
                            >
                                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <div className="flex-1 overflow-y-auto overscroll-contain">
                            <CompanyForm />
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
