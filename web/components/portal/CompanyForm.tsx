'use client';

import { useActionState } from 'react';
import { createCompanyAction } from '@/app/actions/companies';
import { FormMessage } from '@/components/ui';

export function CompanyForm() {
    const [state, action] = useActionState(createCompanyAction, null);

    return (
        <form action={action} className="flex flex-col">
            <div className="px-4 py-4 sm:px-6 sm:py-5">
                <div className="mb-4 flex items-center justify-between rounded-lg border border-hairline bg-cloud/60 px-3 py-2.5">
                    <div className="text-sm">
                        <p className="font-medium text-ink">Fees</p>
                        <p className="text-xs text-ink-soft">Service $99 · State $102</p>
                    </div>
                    <p className="text-sm font-semibold text-ink">Total $201</p>
                </div>
                <FormMessage state={state} />
            </div>

            <div className="space-y-6 px-4 pb-6 sm:px-6">
                <section className="space-y-3">
                    <div className="flex items-center gap-2">
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">1</span>
                        <h3 className="text-sm font-semibold text-ink">Company details</h3>
                    </div>
                    <div className="grid gap-3">
                        <div>
                            <label htmlFor="companyName" className="mb-1 block text-xs font-medium text-ink">
                                Company name
                            </label>
                            <input
                                id="companyName"
                                name="companyName"
                                required
                                maxLength={120}
                                className="w-full rounded-lg border border-hairline-strong bg-paper px-3 py-2 text-sm text-ink transition focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/40"
                                placeholder="North Platte Holdings"
                            />
                        </div>
                        <div className="grid gap-3 sm:grid-cols-2">
                            <div>
                                <label htmlFor="entityType" className="mb-1 block text-xs font-medium text-ink">
                                    Entity type
                                </label>
                                <select
                                    id="entityType"
                                    name="entityType"
                                    className="w-full rounded-lg border border-hairline-strong bg-paper px-3 py-2 text-sm text-ink transition focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/40"
                                    defaultValue="LLC"
                                >
                                    <option value="LLC">LLC</option>
                                    <option value="PLLC">PLLC</option>
                                    <option value="LP">LP</option>
                                    <option value="Corporation">Corporation</option>
                                </select>
                            </div>
                            <div>
                                <label htmlFor="formationState" className="mb-1 block text-xs font-medium text-ink">
                                    Formation state
                                </label>
                                <select
                                    id="formationState"
                                    name="formationState"
                                    className="w-full rounded-lg border border-hairline-strong bg-paper px-3 py-2 text-sm text-ink transition focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/40"
                                    defaultValue="Wyoming"
                                >
                                    <option value="Wyoming">Wyoming</option>
                                </select>
                            </div>
                        </div>
                        <div>
                            <label htmlFor="businessEnding" className="mb-1 block text-xs font-medium text-ink">
                                Business ending
                            </label>
                            <select
                                id="businessEnding"
                                name="businessEnding"
                                className="w-full rounded-lg border border-hairline-strong bg-paper px-3 py-2 text-sm text-ink transition focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/40"
                                defaultValue="LLC"
                            >
                                <option value="LLC">LLC</option>
                                <option value="L.L.C.">L.L.C.</option>
                                <option value="Limited Liability Company">Limited Liability Company</option>
                                <option value="Inc.">Inc.</option>
                                <option value="Corp.">Corp.</option>
                            </select>
                        </div>
                    </div>
                </section>

                <section className="space-y-3">
                    <div className="flex items-center gap-2">
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">2</span>
                        <h3 className="text-sm font-semibold text-ink">Registered contact</h3>
                    </div>
                    <div className="grid gap-3 sm:grid-cols-2">
                        <div>
                            <label htmlFor="firstName" className="mb-1 block text-xs font-medium text-ink">
                                First name
                            </label>
                            <input
                                id="firstName"
                                name="firstName"
                                required
                                maxLength={60}
                                className="w-full rounded-lg border border-hairline-strong bg-paper px-3 py-2 text-sm text-ink transition focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/40"
                                placeholder="John"
                                autoComplete="given-name"
                            />
                        </div>
                        <div>
                            <label htmlFor="lastName" className="mb-1 block text-xs font-medium text-ink">
                                Last name
                            </label>
                            <input
                                id="lastName"
                                name="lastName"
                                required
                                maxLength={60}
                                className="w-full rounded-lg border border-hairline-strong bg-paper px-3 py-2 text-sm text-ink transition focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/40"
                                placeholder="Doe"
                                autoComplete="family-name"
                            />
                        </div>
                    </div>
                    <div>
                        <label htmlFor="companyEmail" className="mb-1 block text-xs font-medium text-ink">
                            Email
                        </label>
                        <input
                            id="companyEmail"
                            name="email"
                            type="email"
                            required
                            maxLength={160}
                            className="w-full rounded-lg border border-hairline-strong bg-paper px-3 py-2 text-sm text-ink transition focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/40"
                            placeholder="you@company.com"
                            autoComplete="email"
                        />
                    </div>
                    <div>
                        <label htmlFor="phone" className="mb-1 block text-xs font-medium text-ink">
                            Phone <span className="text-ink-soft">(optional)</span>
                        </label>
                        <input
                            id="phone"
                            name="phone"
                            type="tel"
                            maxLength={40}
                            className="w-full rounded-lg border border-hairline-strong bg-paper px-3 py-2 text-sm text-ink transition focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/40"
                            placeholder="+1 307 555 0100"
                            autoComplete="tel"
                        />
                    </div>
                </section>

                <section className="space-y-3">
                    <div className="flex items-center gap-2">
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">3</span>
                        <h3 className="text-sm font-semibold text-ink">Business address</h3>
                    </div>
                    <div>
                        <label htmlFor="address" className="mb-1 block text-xs font-medium text-ink">
                            Street address
                        </label>
                        <input
                            id="address"
                            name="address"
                            required
                            maxLength={160}
                            className="w-full rounded-lg border border-hairline-strong bg-paper px-3 py-2 text-sm text-ink transition focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/40"
                            placeholder="1309 Coffeen Ave"
                            autoComplete="street-address"
                        />
                    </div>
                    <div className="grid gap-3 sm:grid-cols-2">
                        <div>
                            <label htmlFor="unit" className="mb-1 block text-xs font-medium text-ink">
                                Unit/Suite <span className="text-ink-soft">(optional)</span>
                            </label>
                            <input
                                id="unit"
                                name="unit"
                                maxLength={40}
                                className="w-full rounded-lg border border-hairline-strong bg-paper px-3 py-2 text-sm text-ink transition focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/40"
                                placeholder="Suite 100"
                            />
                        </div>
                        <div>
                            <label htmlFor="city" className="mb-1 block text-xs font-medium text-ink">
                                City
                            </label>
                            <input
                                id="city"
                                name="city"
                                required
                                maxLength={80}
                                className="w-full rounded-lg border border-hairline-strong bg-paper px-3 py-2 text-sm text-ink transition focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/40"
                                placeholder="Sheridan"
                                autoComplete="address-level2"
                            />
                        </div>
                    </div>
                    <div className="grid gap-3 sm:grid-cols-2">
                        <div>
                            <label htmlFor="country" className="mb-1 block text-xs font-medium text-ink">
                                Country
                            </label>
                            <input
                                id="country"
                                name="country"
                                maxLength={80}
                                className="w-full rounded-lg border border-hairline-strong bg-paper px-3 py-2 text-sm text-ink transition focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/40"
                                defaultValue="United States"
                                autoComplete="country-name"
                            />
                        </div>
                        <div>
                            <label htmlFor="postalCode" className="mb-1 block text-xs font-medium text-ink">
                                ZIP/Postal code
                            </label>
                            <input
                                id="postalCode"
                                name="postalCode"
                                required
                                maxLength={20}
                                className="w-full rounded-lg border border-hairline-strong bg-paper px-3 py-2 text-sm text-ink transition focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/40"
                                placeholder="82801"
                                autoComplete="postal-code"
                            />
                        </div>
                    </div>
                    <div>
                        <label htmlFor="partnerCode" className="mb-1 block text-xs font-medium text-ink">
                            Referral/Partner code <span className="text-ink-soft">(optional)</span>
                        </label>
                        <input
                            id="partnerCode"
                            name="partnerCode"
                            maxLength={40}
                            className="w-full rounded-lg border border-hairline-strong bg-paper px-3 py-2 text-sm text-ink transition focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/40"
                            placeholder="Enter code if you have one"
                        />
                    </div>
                </section>

                <div className="pt-2">
                    <button
                        type="submit"
                        className="w-full rounded-lg bg-gradient-to-r from-primary to-teal-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:shadow-md active:scale-[0.99]"
                    >
                        Submit filing application
                    </button>
                    <p className="mt-2 text-center text-[11px] leading-relaxed text-ink-soft">
                        A filing is reviewed before submission to the Wyoming Secretary of State. No attorney reviews your answers.
                    </p>
                </div>
            </div>
        </form>
    );
}
