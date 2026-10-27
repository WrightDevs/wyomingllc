import { PortalShell } from '@/components/portal/PortalShell';
import { requireUser } from '@/lib/session';

export const dynamic = 'force-dynamic';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
    const viewer = await requireUser();

    return (
        <PortalShell
            viewer={{
                id: viewer.user.id,
                email: viewer.user.email,
                displayName: viewer.user.displayName,
                isAdmin: viewer.user.isAdmin
            }}
            impersonator={
                viewer.impersonator
                    ? { displayName: viewer.impersonator.displayName, email: viewer.impersonator.email }
                    : null
            }
        >
            {children}
        </PortalShell>
    );
}
