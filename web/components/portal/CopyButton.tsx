'use client';

import { useEffect, useRef, useState } from 'react';
import { Icon } from '@/components/icons';

export function CopyButton({ value, label }: { value: string; label: string }) {
    const [copied, setCopied] = useState(false);
    const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        return () => {
            if (timer.current) clearTimeout(timer.current);
        };
    }, []);

    async function copy() {
        try {
            await navigator.clipboard.writeText(value);
            setCopied(true);
            if (timer.current) clearTimeout(timer.current);
            timer.current = setTimeout(() => setCopied(false), 1800);
        } catch {
            setCopied(false);
        }
    }

    return (
        <button
            type="button"
            onClick={copy}
            className="rounded-md p-1.5 text-pine-900/45 transition hover:bg-pine-900/5 hover:text-pine-900"
            aria-label={copied ? `${label} copied` : `Copy ${label}`}
            title={copied ? 'Copied' : `Copy ${label}`}
        >
            <Icon name={copied ? 'check' : 'copy'} className="h-4 w-4" />
        </button>
    );
}
