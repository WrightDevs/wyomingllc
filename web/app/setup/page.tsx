import Link from 'next/link';

export const metadata = { title: 'Database setup' };

export default function SetupPage() {
    return (
        <main className="mx-auto flex min-h-dvh max-w-2xl flex-col justify-center px-4 py-16">
            <p className="eyebrow">Before you sign in</p>
            <h1 className="display mt-2 text-3xl text-pine-950">Connect a Neon database</h1>
            <p className="mt-3 text-sm leading-relaxed text-pine-900/70">
                This build is running without <code className="mono rounded bg-pine-900/5 px-1.5 py-0.5">DATABASE_URL</code>. Create a
                Neon project, copy the pooled connection string, and add it to <code className="mono rounded bg-pine-900/5 px-1.5 py-0.5">web/.env.local</code>.
            </p>

            <ol className="mt-6 space-y-4 text-sm text-pine-900/80">
                <li className="card p-4">
                    <span className="mono text-xs text-pine-900/50">01</span>
                    <p className="mt-1 font-semibold text-pine-950">Create the file</p>
                    <pre className="mono mt-2 overflow-x-auto rounded-lg bg-pine-950 px-3 py-2 text-[12px] text-pine-100">cp .env.example .env.local</pre>
                </li>
                <li className="card p-4">
                    <span className="mono text-xs text-pine-900/50">02</span>
                    <p className="mt-1 font-semibold text-pine-950">Add the connection string and a secret</p>
                    <p className="mt-1 text-pine-900/60">
                        <code className="mono">DATABASE_URL</code> wants the pooled Neon string. <code className="mono">SESSION_SECRET</code> can be any
                        48+ random bytes.
                    </p>
                </li>
                <li className="card p-4">
                    <span className="mono text-xs text-pine-900/50">03</span>
                    <p className="mt-1 font-semibold text-pine-950">Create the tables</p>
                    <pre className="mono mt-2 overflow-x-auto rounded-lg bg-pine-950 px-3 py-2 text-[12px] text-pine-100">npm run db:setup</pre>
                    <p className="mt-1 text-pine-900/60">Set ADMIN_EMAIL and ADMIN_PASSWORD first to create the first administrator.</p>
                </li>
            </ol>

            <div className="mt-8 flex gap-2">
                <Link href="/" className="btn-outline">Back to the site</Link>
                <Link href="/login" className="btn-primary">Try signing in</Link>
            </div>
        </main>
    );
}
