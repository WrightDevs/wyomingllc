'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { q } from '@/lib/db';
import { requireUser } from '@/lib/session';
import { friendlyError } from '@/lib/request';
import type { FormState } from '@/lib/form';

const text = (max: number) => z.string().trim().max(max);
const required = (label: string, max: number) =>
    z.string().trim().min(1, `${label} is required.`).max(max, `${label} is too long.`);

const companySchema = z.object({
    companyName: required('Company name', 120),
    entityType: text(40),
    formationState: text(40),
    businessEnding: text(20),
    firstName: required('First name', 60),
    lastName: required('Last name', 60),
    email: z.string().trim().email('Enter a valid contact email.').max(160),
    phone: text(40),
    address: required('Street address', 160),
    unit: text(40),
    city: required('City', 80),
    country: text(80),
    postalCode: required('Postal code', 20),
    partnerCode: text(40)
});

export async function createCompanyAction(_prev: FormState, formData: FormData): Promise<FormState> {
    const viewer = await requireUser();
    if (viewer.impersonator) return { ok: false, message: 'View-as mode is read-only. Exit to make changes.' };

    const parsed = companySchema.safeParse({
        companyName: formData.get('companyName'),
        entityType: formData.get('entityType') || 'LLC',
        formationState: formData.get('formationState') || 'Wyoming',
        businessEnding: formData.get('businessEnding') || 'LLC',
        firstName: formData.get('firstName'),
        lastName: formData.get('lastName'),
        email: formData.get('email'),
        phone: formData.get('phone') || '',
        address: formData.get('address'),
        unit: formData.get('unit') || '',
        city: formData.get('city'),
        country: formData.get('country') || 'United States',
        postalCode: formData.get('postalCode'),
        partnerCode: formData.get('partnerCode') || ''
    });

    if (!parsed.success) {
        return { ok: false, message: parsed.error.issues[0]?.message || 'Check the highlighted fields.' };
    }

    const data = parsed.data;

    try {
        await q`
            insert into companies (
                user_id, company_name, entity_type, formation_state, business_ending,
                first_name, last_name, email, phone, address, unit, city, country,
                postal_code, partner_code, status
            ) values (
                ${viewer.user.id}, ${data.companyName}, ${data.entityType || 'LLC'}, ${data.formationState || 'Wyoming'},
                ${data.businessEnding || 'LLC'}, ${data.firstName}, ${data.lastName}, ${data.email}, ${data.phone},
                ${data.address}, ${data.unit}, ${data.city}, ${data.country || 'United States'},
                ${data.postalCode}, ${data.partnerCode}, 'pending'
            )
        `;
    } catch (error) {
        return { ok: false, message: friendlyError(error) };
    }

    revalidatePath('/dashboard');
    revalidatePath('/dashboard/filings');
    redirect('/dashboard/filings?created=1');
}
