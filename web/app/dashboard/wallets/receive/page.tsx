import { ReceiveCryptoView } from '@/components/portal/ReceiveCryptoView';
import { listDepositAddresses } from '@/lib/queries';
import { requireUser } from '@/lib/session';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Receive Crypto — Wyoming Attorney' };

export default async function ReceiveCryptoPage() {
    await requireUser();
    const addresses = await listDepositAddresses();

    return <ReceiveCryptoView initialAddresses={addresses} />;
}
