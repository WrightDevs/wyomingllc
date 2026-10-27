'use client';

import { useEffect } from 'react';

export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
    useEffect(() => {
        console.error('[web]', error.message);
    }, [error]);

    const missingDb = /DATABASE_URL|Neon/i.test(error.message);

    return (
        <main className="mx-auto flex min-h-dvh max-w-lg flex-col justify-center px-4">
            <p className="eyebrow">{missingDb ? 'Configuration' : 'Something went wrong'}</p>
            <h1 className="display mt-2 text-2xl text-pine-950">
                {missingDb ? 'The database is not connected' : 'That request could not be completed'}
            </h1>
            <p className="mt-2 text-sm text-pine-900/65">
                {missingDb
                    ? 'Add DATABASE_URL and SESSION_SECRET to web/.env.local, then run npm run db:setup.'
                    : 'Nothing was saved twice. Try again, or head back to the dashboard.'}
            </p>
            <div className="mt-6 flex gap-2">
                <button type="button" onClick={reset} className="btn-primary">Try again</button>
                <a href="/dashboard" className="btn-outline">Dashboard</a>
            </div>
        </main>
    );
}
