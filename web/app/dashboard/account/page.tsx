import Link from 'next/link';
import { PageHeader, StatusPill } from '@/components/ui';
import { PasswordForm, ProfileForm } from '@/components/portal/AccountForms';
import { Icon } from '@/components/icons';
import { formatDateTime } from '@/lib/format';
import { getUserRecord } from '@/lib/queries';
import { requireUser } from '@/lib/session';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Account' };

export default async function AccountPage() {
    const viewer = await requireUser();
    const record = await getUserRecord(viewer.user.id);

    return (
        <div className="space-y-5">
            <PageHeader
                eyebrow="Account"
                title="Settings"
                description="Your name, contact number and sign-in password. Email changes go through support so the account cannot be taken over silently."
            />

            <div className="grid gap-5 lg:grid-cols-[1.2fr_1fr] lg:items-start">
                <section className="card p-5 sm:p-6">
                    <div className="flex items-center justify-between gap-3">
                        <div>
                            <p className="eyebrow">Profile</p>
                            <h2 className="display mt-1 text-xl text-pine-950">Who is on this account</h2>
                        </div>
                        <StatusPill status={viewer.user.status} />
                    </div>

                    {viewer.impersonator ? (
                        <p className="mt-4 rounded-xl border border-amber-700/25 bg-amber-50 px-3.5 py-2.5 text-sm text-amber-950">
                            View-as mode is read-only. Exit to edit this profile.
                        </p>
                    ) : (
                        <div className="mt-5">
                            <ProfileForm displayName={record?.display_name || viewer.user.displayName} phone={record?.phone || ''} />
                        </div>
                    )}
                </section>

                <div className="space-y-5">
                    <section className="card p-5 sm:p-6">
                        <p className="eyebrow">Sign-in</p>
                        <h2 className="display mt-1 text-xl text-pine-950">Password</h2>
                        <div className="mt-4">
                            {viewer.impersonator ? (
                                <p className="text-sm text-pine-900/55">Not available while viewing another account.</p>
                            ) : (
                                <PasswordForm />
                            )}
                        </div>
                    </section>

                    <section className="card p-5 sm:p-6">
                        <p className="eyebrow">Record</p>
                        <dl className="mt-3 space-y-2.5 text-sm">
                            <div className="flex items-baseline justify-between gap-3">
                                <dt className="text-pine-900/55">Email</dt>
                                <dd className="truncate font-medium text-pine-950">{viewer.user.email}</dd>
                            </div>
                            <div className="flex items-baseline justify-between gap-3">
                                <dt className="text-pine-900/55">Member since</dt>
                                <dd className="font-medium text-pine-950">{formatDateTime(record?.created_at)}</dd>
                            </div>
                            <div className="flex items-baseline justify-between gap-3">
                                <dt className="text-pine-900/55">Last sign-in</dt>
                                <dd className="font-medium text-pine-950">{formatDateTime(record?.last_login_at)}</dd>
                            </div>
                            <div className="flex items-baseline justify-between gap-3">
                                <dt className="text-pine-900/55">Admin access</dt>
                                <dd className="font-medium text-pine-950">{viewer.user.isAdmin ? 'Yes' : 'No'}</dd>
                            </div>
                        </dl>
                        {viewer.user.isAdmin && !viewer.impersonator ? (
                            <Link href="/admin" className="btn-outline btn-sm mt-4 w-full">
                                <Icon name="admin" className="h-4 w-4" />
                                Open admin console
                            </Link>
                        ) : null}
                    </section>

                    <div className="rounded-card border border-pine-900/10 bg-pine-50/60 px-5 py-4 text-[12px] leading-relaxed text-pine-900/60">
                        <p className="font-semibold text-pine-900/80">Need to change your email?</p>
                        <p className="mt-1">
                            Email support from the address on file and an administrator will update it. This keeps the account from being moved
                            without a record.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
