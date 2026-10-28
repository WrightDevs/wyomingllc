import { CryptoAssetsView } from '@/components/portal/CryptoAssetsView';
import { getBalances } from '@/lib/queries';
import { requireUser } from '@/lib/session';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Crypto Assets — Wyoming Attorney' };

export default async function WalletsPage() {
    const viewer = await requireUser();
    const balances = await getBalances(viewer.user.id);

    return <CryptoAssetsView balances={balances} />;
}
