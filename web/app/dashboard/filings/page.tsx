import { LLCManagementView } from '@/components/portal/LLCManagementView';
import { listCompanies } from '@/lib/queries';
import { requireUser } from '@/lib/session';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'LLC Management — Wyoming Attorney' };

export default async function FilingsPage() {
    const viewer = await requireUser();
    const companies = await listCompanies(viewer.user.id);

    return <LLCManagementView companies={companies} />;
}
