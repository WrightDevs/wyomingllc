import { AdminDepositAddressesManager } from '@/components/admin/AdminDepositAddressesManager';
import { PageHeader } from '@/components/ui';
import { listDepositAddresses } from '@/lib/queries';
import { requireAdmin } from '@/lib/session';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Manage Deposit Addresses — Wyoming Attorney Admin' };

export default async function AdminDepositAddressesPage() {
    await requireAdmin();
    const depositAddresses = await listDepositAddresses();

    return (
        <div className="space-y-6">
            <PageHeader
                eyebrow="Administration · Digital Assets"
                title="Manage Deposit Addresses"
                description="Configure the official receiving addresses, destination tags/memos, and network labels displayed on the client Receive Crypto screens."
            />

            <AdminDepositAddressesManager initialAddresses={depositAddresses} />
        </div>
    );
}
