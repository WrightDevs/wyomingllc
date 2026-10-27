'use client';

import { useActionState } from 'react';
import { createCompanyAction } from '@/app/actions/companies';
import { FormMessage, SubmitButton } from '@/components/ui';

export function CompanyForm() {
    const [state, action] = useActionState(createCompanyAction, null);

    return (
        <form action={action} className="card p-5 sm:p-6">
            <p className="eyebrow">New filing</p>
            <h2 className="display mt-1 text-xl text-pine-950">Form another LLC</h2>
            <p className="mt-1 text-[13px] text-pine-900/55">
                Wyoming only. The state charges $102 to file online; our service fee is $99.
            </p>

            <div className="mt-4">
                <FormMessage state={state} />
            </div>

            <div className="mt-4 space-y-4">
                <div>
                    <label htmlFor="companyName" className="label">Company name</label>
                    <input id="companyName" name="companyName" required maxLength={120} className="field" placeholder="North Platte Holdings" />
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                        <label htmlFor="entityType" className="label">Entity type</label>
                        <select id="entityType" name="entityType" className="field" defaultValue="LLC">
                            <option value="LLC">LLC</option>
                            <option value="PLLC">PLLC</option>
                            <option value="LP">LP</option>
                            <option value="Corporation">Corporation</option>
                        </select>
                    </div>
                    <div>
                        <label htmlFor="formationState" className="label">Formation state</label>
                        <select id="formationState" name="formationState" className="field" defaultValue="Wyoming">
                            <option value="Wyoming">Wyoming</option>
                        </select>
                    </div>
                </div>

                <div>
                    <label htmlFor="businessEnding" className="label">Business ending</label>
                    <select id="businessEnding" name="businessEnding" className="field" defaultValue="LLC">
                        <option value="LLC">LLC</option>
                        <option value="L.L.C.">L.L.C.</option>
                        <option value="Limited Liability Company">Limited Liability Company</option>
                        <option value="Inc.">Inc.</option>
                        <option value="Corp.">Corp.</option>
                    </select>
                </div>

                <fieldset className="space-y-4">
                    <legend className="label">Registered contact</legend>
                    <div className="grid gap-3 sm:grid-cols-2">
                        <div>
                            <label htmlFor="firstName" className="sr-only">First name</label>
                            <input id="firstName" name="firstName" required maxLength={60} className="field" placeholder="First name" autoComplete="given-name" />
                        </div>
                        <div>
                            <label htmlFor="lastName" className="sr-only">Last name</label>
                            <input id="lastName" name="lastName" required maxLength={60} className="field" placeholder="Last name" autoComplete="family-name" />
                        </div>
                    </div>
                    <div>
                        <label htmlFor="companyEmail" className="label">Contact email</label>
                        <input id="companyEmail" name="email" type="email" required maxLength={160} className="field" placeholder="you@company.com" autoComplete="email" />
                    </div>
                    <div>
                        <label htmlFor="phone" className="label">Phone <span className="font-sans font-normal normal-case tracking-normal text-pine-900/40">(optional)</span></label>
                        <input id="phone" name="phone" type="tel" maxLength={40} className="field" placeholder="+1 307 555 0100" autoComplete="tel" />
                    </div>
                    <div>
                        <label htmlFor="address" className="label">Street address</label>
                        <input id="address" name="address" required maxLength={160} className="field" placeholder="1309 Coffeen Ave" autoComplete="street-address" />
                    </div>
                    <div className="grid gap-3 sm:grid-cols-2">
                        <div>
                            <label htmlFor="unit" className="label">Unit <span className="font-sans font-normal normal-case tracking-normal text-pine-900/40">(optional)</span></label>
                            <input id="unit" name="unit" maxLength={40} className="field" placeholder="Suite 1200" />
                        </div>
                        <div>
                            <label htmlFor="city" className="label">City</label>
                            <input id="city" name="city" required maxLength={80} className="field" placeholder="Sheridan" autoComplete="address-level2" />
                        </div>
                    </div>
                    <div className="grid gap-3 sm:grid-cols-2">
                        <div>
                            <label htmlFor="country" className="label">Country</label>
                            <input id="country" name="country" maxLength={80} className="field" defaultValue="United States" autoComplete="country-name" />
                        </div>
                        <div>
                            <label htmlFor="postalCode" className="label">Postal code</label>
                            <input id="postalCode" name="postalCode" required maxLength={20} className="field" placeholder="82801" autoComplete="postal-code" />
                        </div>
                    </div>
                    <div>
                        <label htmlFor="partnerCode" className="label">Partner code <span className="font-sans font-normal normal-case tracking-normal text-pine-900/40">(optional)</span></label>
                        <input id="partnerCode" name="partnerCode" maxLength={40} className="field" placeholder="Referral or partner code" />
                    </div>
                </fieldset>

                <SubmitButton className="btn-primary w-full" pendingLabel="Submitting filing…">
                    Submit filing
                </SubmitButton>
                <p className="text-center text-[11px] leading-relaxed text-pine-900/45">
                    A filing is reviewed before it is submitted to the state. No attorney reviews your answers.
                </p>
            </div>
        </form>
    );
}
