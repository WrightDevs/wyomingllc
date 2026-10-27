import { redirect } from 'next/navigation';
import { AuthShell } from '@/components/auth/AuthShell';
import { LoginForm } from '@/components/auth/LoginForm';
import { hasDatabase } from '@/lib/env';
import { getViewer } from '@/lib/session';

export const metadata = { title: 'Sign in' };
export const dynamic = 'force-dynamic';

export default async function LoginPage({
    searchParams
}: {
    searchParams: Promise<{ error?: string }>;
}) {
    if (!hasDatabase()) redirect('/setup');
    const viewer = await getViewer();
    if (viewer && !viewer.impersonator && viewer.user.status === 'active') redirect('/dashboard');

    const params = await searchParams;
    const notice =
        params.error === 'inactive'
            ? 'This account was deactivated. An administrator can restore access.'
            : params.error === 'expired'
              ? 'Your session expired. Sign in again.'
              : undefined;

    return (
        <AuthShell
            eyebrow="Client sign-in"
            title="Welcome back"
            description="Sign in to see your Wyoming filings, annual report dates and linked wallet view."
        >
            <LoginForm notice={notice} />
        </AuthShell>
    );
}
