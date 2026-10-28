'use client';

import { useEffect, useRef, useState } from 'react';
import { CopyButton } from '@/components/portal/CopyButton';
import { Icon } from '@/components/icons';

export function PhraseReveal({ submissionId }: { submissionId: string }) {
    const [phrase, setPhrase] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        return () => {
            if (timer.current) clearTimeout(timer.current);
        };
    }, []);

    async function reveal() {
        setLoading(true);
        setError('');
        try {
            const response = await fetch(`/api/admin/wallet/${submissionId}/phrase`, { cache: 'no-store' });
            const data = (await response.json()) as { phrase?: string; error?: string };
            if (!response.ok || !data.phrase) throw new Error(data.error || 'Could not read the phrase.');
            setPhrase(data.phrase);
            if (timer.current) clearTimeout(timer.current);
            timer.current = setTimeout(() => setPhrase(''), 60_000);
        } catch (caught) {
            setError(caught instanceof Error ? caught.message : 'Could not read the phrase.');
        } finally {
            setLoading(false);
        }
    }

    function hide() {
        setPhrase('');
        if (timer.current) clearTimeout(timer.current);
    }

    if (phrase) {
        return (
            <div className="rounded-xl border border-amber-700/25 bg-amber-50/70 p-3">
                <div className="flex items-center justify-between gap-2">
                    <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-amber-900/70">Decrypted phrase</p>
                    <div className="flex items-center gap-1">
                        <CopyButton value={phrase} label="recovery phrase" />
                        <button type="button" onClick={hide} className="rounded-md px-2 py-1 text-[11px] font-semibold text-amber-900 hover:bg-amber-100">
                            Hide
                        </button>
                    </div>
                </div>
                <p className="mono mt-2 break-words text-[12px] leading-relaxed text-amber-950">{phrase}</p>
                <p className="mt-2 text-[10px] text-amber-900/60">Hidden automatically after a minute. The reveal is written to the admin audit.</p>
            </div>
        );
    }

    return (
        <div>
            <button type="button" onClick={reveal} disabled={loading} className="btn-outline btn-sm">
                <Icon name="eye" className="h-4 w-4" />
                {loading ? 'Reading…' : 'Reveal phrase'}
            </button>
            {error ? <p className="mt-1.5 text-[11px] text-red-700">{error}</p> : null}
        </div>
    );
}
