'use client';

import { useActionState } from 'react';
import { resetUserPasswordAction, saveUserProfileAction } from '@/app/actions/admin';
import { FormMessage, SubmitButton } from '@/components/ui';

export function AdminProfileForm({
    userId,
    displayName,
    email,
    phone
}: {
    userId: string;
    displayName: string;
    email: string;
    phone: string;
}) {
    const [state, action] = useActionState(saveUserProfileAction, null);

    return (
        <form action={action} className="space-y-3.5">
            <input type="hidden" name="userId" value={userId} />
            <FormMessage state={state} />
            <div>
                <label htmlFor="admin_displayName" className="label">Name</label>
                <input id="admin_displayName" name="displayName" required maxLength={80} defaultValue={displayName} className="field" />
            </div>
            <div>
                <label htmlFor="admin_email" className="label">Email</label>
                <input id="admin_email" name="email" type="email" required defaultValue={email} className="field" />
            </div>
            <div>
                <label htmlFor="admin_phone" className="label">Phone</label>
                <input id="admin_phone" name="phone" maxLength={40} defaultValue={phone} className="field" placeholder="Optional" />
            </div>
            <SubmitButton className="btn-primary btn-sm" pendingLabel="Saving…">Save profile</SubmitButton>
        </form>
    );
}

export function ResetPasswordForm({ userId, email }: { userId: string; email: string }) {
    const [state, action] = useActionState(resetUserPasswordAction, null);

    return (
        <form action={action} className="space-y-3">
            <input type="hidden" name="userId" value={userId} />
            <FormMessage state={state} />
            <div>
                <label htmlFor="admin_password" className="label">Temporary password for {email}</label>
                <input
                    id="admin_password"
                    name="password"
                    type="text"
                    required
                    minLength={8}
                    autoComplete="off"
                    className="field mono"
                    placeholder="At least 8 characters"
                />
            </div>
            <SubmitButton className="btn-danger btn-sm" pendingLabel="Resetting…">Reset password</SubmitButton>
            <p className="text-[11px] leading-relaxed text-pine-900/45">Signs out every device on that account. Share the temporary password out of band.</p>
        </form>
    );
}
