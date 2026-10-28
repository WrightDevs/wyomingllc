import Link from 'next/link';

export default function NotFound() {
    return (
        <main className="mx-auto flex min-h-dvh max-w-lg flex-col justify-center px-4 text-center">
            <p className="eyebrow">404</p>
            <h1 className="display mt-2 text-3xl text-pine-950">That page is not on file</h1>
            <p className="mt-2 text-sm text-pine-900/60">The link may be old, or the record was moved. Start from the dashboard or the home page.</p>
            <div className="mt-6 flex justify-center gap-2">
                <Link href="/" className="btn-outline">Home</Link>
                <Link href="/dashboard" className="btn-primary">Dashboard</Link>
            </div>
        </main>
    );
}
