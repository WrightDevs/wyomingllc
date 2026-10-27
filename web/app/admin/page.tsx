import Link from 'next/link';
import { UsersTable } from '@/components/admin/UsersTable';
import { PageHeader } from '@/components/ui';
import { Icon } from '@/components/icons';
import { listAdminUsers, listAllWallets, listPendingCompanies } from '@/lib/queries';
import { requireAdmin } from '@/lib/session';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Admin' };

export default async function AdminPage() {
    const viewer = await requireAdmin();
    const [users, companies, wallets] = await Promise.all([listAdminUsers(), listPendingCompanies(), listAllWallets()]);

    const active = users.filter((user) => user.status === 'active').length;
    const admins = users.filter((user) => user.is_admin).length;
    const pendingFilings = companies.filter((company) => company.status === 'pending' || company.status === 'processing').length;
    const unlinked = wallets.filter((wallet) => !wallet.user_id).length;

    const stats = [
        { label: 'Accounts', value: users.length, note: `${active} active`, href: '/admin' },
        { label: 'Pending filings', value: pendingFilings, note: 'need a decision', href: '/admin/filings' },
        { label: 'Wallet submissions', value: wallets.length, note: `${unlinked} unlinked`, href: '/admin/wallets' },
        { label: 'Administrators', value: admins, note: 'full console access', href: '/admin' }
    ];

    return (
        <div className="space-y-5">
            <PageHeader
                eyebrow="Admin console"
                title="Users & records"
                description="Open an account to edit balances, link wallets, review filings, reset a password or view the dashboard as that user."
                action={
                    <Link href="/dashboard" className="btn-outline btn-sm">
                        <Icon name="overview" className="h-4 w-4" />
                        My dashboard
                    </Link>
                }
            />

            <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
                {stats.map((stat) => (
                    <Link key={stat.label} href={stat.href} className="card px-4 py-3.5 transition hover:border-pine-900/20 hover:shadow-lift">
                        <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-pine-900/45">{stat.label}</p>
                        <p className="mono mt-1 text-2xl font-semibold text-pine-950">{stat.value}</p>
                        <p className="mt-0.5 text-[11px] text-pine-900/45">{stat.note}</p>
                    </Link>
                ))}
            </div>

            <UsersTable users={users} currentUserId={viewer.user.id} />

            <div className="grid gap-3 sm:grid-cols-2">
                <Link href="/admin/wallets" className="card flex items-center justify-between gap-3 px-5 py-4 transition hover:border-pine-900/20">
                    <div>
                        <p className="font-semibold text-pine-950">Wallet queue</p>
                        <p className="text-[12px] text-pine-900/50">Attach, move, unlink or reveal a submission.</p>
                    </div>
                    <Icon name="arrow" className="h-5 w-5 text-pine-900/40" />
                </Link>
                <Link href="/admin/filings" className="card flex items-center justify-between gap-3 px-5 py-4 transition hover:border-pine-900/20">
                    <div>
                        <p className="font-semibold text-pine-950">Filing queue</p>
                        <p className="text-[12px] text-pine-900/50">Approve, reject or mark a filing processing.</p>
                    </div>
                    <Icon name="arrow" className="h-5 w-5 text-pine-900/40" />
                </Link>
            </div>
        </div>
    );
}
