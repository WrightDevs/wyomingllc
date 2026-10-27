import { PortalShell } from '@/components/portal/PortalShell';
import { requireAdmin } from '@/lib/session';

export const dynamic = 'force-dynamic';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
    const viewer = await requireAdmin();

    return (
        <PortalShell
            viewer={{
                id: viewer.user.id,
                email: viewer.user.email,
                displayName: viewer.user.displayName,
                isAdmin: viewer.user.isAdmin
            }}
            impersonator={null}
        >
            {children}
        </PortalShell>
    );
}
