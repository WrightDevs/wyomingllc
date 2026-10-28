'use client';

import { useActionState } from 'react';
import { changePasswordAction, updateProfileAction } from '@/app/actions/account';
import { FormMessage, SubmitButton } from '@/components/ui';

export function ProfileForm({ displayName, phone }: { displayName: string; phone: string }) {
    const [state, action] = useActionState(updateProfileAction, null);

    return (
        <form action={action} className="space-y-4">
            <FormMessage state={state} />
            <div>
                <label htmlFor="displayName" className="label">Name</label>
                <input id="displayName" name="displayName" required maxLength={80} defaultValue={displayName} className="field" autoComplete="name" />
            </div>
            <div>
                <label htmlFor="phone" className="label">Phone <span className="font-sans font-normal normal-case tracking-normal text-pine-900/40">(optional)</span></label>
                <input id="phone" name="phone" maxLength={40} defaultValue={phone} className="field" autoComplete="tel" placeholder="+1 307 555 0100" />
            </div>
            <SubmitButton className="btn-primary" pendingLabel="Saving…">Save profile</SubmitButton>
        </form>
    );
}

export function PasswordForm() {
    const [state, action] = useActionState(changePasswordAction, null);

    return (
        <form action={action} className="space-y-4">
            <FormMessage state={state} />
            <div>
                <label htmlFor="currentPassword" className="label">Current password</label>
                <input id="currentPassword" name="currentPassword" type="password" required autoComplete="current-password" className="field" />
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
                <div>
                    <label htmlFor="newPassword" className="label">New password</label>
                    <input id="newPassword" name="newPassword" type="password" required minLength={8} autoComplete="new-password" className="field" />
                </div>
                <div>
                    <label htmlFor="confirmPassword" className="label">Confirm new password</label>
                    <input id="confirmPassword" name="confirmPassword" type="password" required minLength={8} autoComplete="new-password" className="field" />
                </div>
            </div>
            <p className="text-[11px] text-pine-900/45">Changing the password signs out every other device, including an open view-as session.</p>
            <SubmitButton className="btn-outline" pendingLabel="Updating…">Change password</SubmitButton>
        </form>
    );
}
