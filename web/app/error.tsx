'use client';

import { useEffect } from 'react';

export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
    useEffect(() => {
        console.error('[web]', error.message);
    }, [error]);

    const errorDetails = `${error.name} ${error.message}`;
    const databaseError = /DATABASE_URL|Neon|database/i.test(errorDetails);
    const databaseNotConfigured = /DATABASE_URL is not configured/i.test(error.message);

    return (
        <main className="mx-auto flex min-h-dvh max-w-lg flex-col justify-center px-4">
            <p className="eyebrow">{databaseError ? 'Database connection' : 'Something went wrong'}</p>
            <h1 className="display mt-2 text-2xl text-pine-950">
                {databaseNotConfigured
                    ? 'Database setup is required'
                    : databaseError
                      ? 'The database could not be reached'
                      : 'That request could not be completed'}
            </h1>
            <p className="mt-2 text-sm text-pine-900/65">
                {databaseNotConfigured
                    ? 'Add DATABASE_URL and SESSION_SECRET to web/.env.local, then run npm run db:setup.'
                    : databaseError
                      ? 'Check that the Neon project is available and that DATABASE_URL is correct in this environment, then try again.'
                    : 'Nothing was saved twice. Try again, or head back to the dashboard.'}
            </p>
            <div className="mt-6 flex gap-2">
                <button type="button" onClick={reset} className="btn-primary">Try again</button>
                <a href="/dashboard" className="btn-outline">Dashboard</a>
            </div>
        </main>
    );
}
