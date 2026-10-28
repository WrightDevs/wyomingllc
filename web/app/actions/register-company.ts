'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { q } from '@/lib/db';
import { registerUser } from '@/lib/auth';
import { createSession, getViewer, requireUser, setSessionCookie } from '@/lib/session';
import { clientIp, friendlyError } from '@/lib/request';
import { rateLimit } from '@/lib/crypto';
import type { FormState } from '@/lib/form';

const text = (max: number) => z.string().trim().max(max);
const required = (label: string, max: number) =>
    z.string().trim().min(1, `${label} is required.`).max(max, `${label} is too long.`);

const registerCompanySchema = z.object({
    companyName: required('Company name', 120),
    entityType: required('Entity type', 40),
    formationState: text(40).default('Wyoming'),
    businessEnding: text(40).default('Prefer No Ending'),
    firstName: required('First name', 60),
    lastName: required('Last name', 60),
    email: z.string().trim().email('Enter a valid contact email.').max(160),
    password: z.string().min(8, 'Password must be at least 8 characters.').max(200).optional(),
    phone: text(40),
    address: required('Street address', 160),
    unit: text(40),
    city: required('City', 80),
    country: text(80),
    postalCode: required('Postal code', 20),
    partnerCode: text(40)
});

export async function registerCompanyAction(_prev: FormState, formData: FormData): Promise<FormState> {
    const rawData = {
        companyName: formData.get('companyName'),
        entityType: formData.get('entityType'),
        formationState: formData.get('formationState') || 'Wyoming',
        businessEnding: formData.get('businessEnding') || 'Prefer No Ending',
        firstName: formData.get('firstName'),
        lastName: formData.get('lastName'),
        email: formData.get('email'),
        password: formData.get('password') || undefined,
        phone: formData.get('phone') || '',
        address: formData.get('address'),
        unit: formData.get('unit') || '',
        city: formData.get('city'),
        country: formData.get('country') || 'United States',
        postalCode: formData.get('postalCode'),
        partnerCode: formData.get('partnerCode') || ''
    };

    const parsed = registerCompanySchema.safeParse(rawData);
    if (!parsed.success) {
        return { ok: false, message: parsed.error.issues[0]?.message || 'Please check the required fields.' };
    }

    const data = parsed.data;
    const viewer = await getViewer();
    let targetUserId = viewer?.user?.id;

    // If not signed in, create the user account
    if (!targetUserId) {
        if (!data.password || data.password.length < 8) {
            return { ok: false, message: 'Password is required and must be at least 8 characters.' };
        }

        if (!rateLimit(`register:${await clientIp()}`, 6, 60_000)) {
            return { ok: false, message: 'Too many sign-up attempts. Wait a minute and try again.' };
        }

        const fullName = `${data.firstName} ${data.lastName}`.trim();
        const authRes = await registerUser({
            email: data.email,
            password: data.password,
            displayName: fullName
        });

        if (!authRes.ok) {
            return { ok: false, message: authRes.error };
        }

        targetUserId = authRes.userId;
        const sessionToken = await createSession(targetUserId);
        await setSessionCookie(sessionToken);
    }

    try {
        await q`
            insert into companies (
                user_id, company_name, entity_type, formation_state, business_ending,
                first_name, last_name, email, phone, address, unit, city, country,
                postal_code, partner_code, status
            ) values (
                ${targetUserId}, ${data.companyName}, ${data.entityType}, ${data.formationState},
                ${data.businessEnding}, ${data.firstName}, ${data.lastName}, ${data.email}, ${data.phone},
                ${data.address}, ${data.unit}, ${data.city}, ${data.country},
                ${data.postalCode}, ${data.partnerCode}, 'pending'
            )
        `;

        try {
            const { sendNewFormationEmail, createAndSendVerificationEmail } = await import('@/lib/email');
            await sendNewFormationEmail({
                email: data.email,
                name: `${data.firstName} ${data.lastName}`.trim(),
                companyName: data.companyName,
                entityType: data.entityType,
                formationState: data.formationState
            });

            // If account was just registered, send verification email too
            if (!viewer?.user?.id && targetUserId) {
                await createAndSendVerificationEmail(targetUserId, data.email, `${data.firstName} ${data.lastName}`.trim());
            }
        } catch (e) {
            console.error('Failed to dispatch registration/formation emails:', e);
        }
    } catch (error) {
        return { ok: false, message: friendlyError(error) };
    }

    revalidatePath('/dashboard');
    revalidatePath('/dashboard/filings');
    redirect('/dashboard/filings?created=1');
}
