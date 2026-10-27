import { redirect } from 'next/navigation';
import { AuthShell } from '@/components/auth/AuthShell';
import { SignupForm } from '@/components/auth/SignupForm';
import { hasDatabase } from '@/lib/env';
import { getViewer } from '@/lib/session';

export const metadata = { title: 'Create an account' };
export const dynamic = 'force-dynamic';

export default async function SignupPage() {
    if (!hasDatabase()) redirect('/setup');
    const viewer = await getViewer();
    if (viewer && !viewer.impersonator && viewer.user.status === 'active') redirect('/dashboard');

    return (
        <AuthShell
            eyebrow="Open an account"
            title="Start your Wyoming LLC"
            description="Create one account for filings, annual reports and the read-only wallet view. You can add more companies later."
        >
            <SignupForm />
        </AuthShell>
    );
}
