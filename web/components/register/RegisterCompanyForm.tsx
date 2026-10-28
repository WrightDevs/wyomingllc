'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useActionState } from 'react';
import { registerCompanyAction } from '@/app/actions/register-company';
import { COUNTRIES, US_STATES } from '@/lib/countries';
import type { FormState } from '@/lib/form';

interface RegisterFormProps {
    currentUser: {
        id: string;
        email: string;
        displayName: string;
    } | null;
}

export function RegisterCompanyForm({ currentUser }: RegisterFormProps) {
    const [state, formAction, isPending] = useActionState(registerCompanyAction, null);

    const [formationState, setFormationState] = useState('Wyoming');
    const [entityType, setEntityType] = useState('Limited Liability Company (LLC)');
    const [companyName, setCompanyName] = useState('');
    const [businessEnding, setBusinessEnding] = useState('Prefer No Ending');

    const nameParts = currentUser?.displayName ? currentUser.displayName.trim().split(' ') : [];
    const initialFirst = nameParts[0] || '';
    const initialLast = nameParts.slice(1).join(' ') || '';

    const [firstName, setFirstName] = useState(initialFirst);
    const [lastName, setLastName] = useState(initialLast);
    const [email, setEmail] = useState(currentUser?.email || '');
    const [password, setPassword] = useState('');
    const [selectedCountryCode, setSelectedCountryCode] = useState('US');
    const [phone, setPhone] = useState('');

    const [streetAddress, setStreetAddress] = useState('');
    const [unit, setUnit] = useState('');
    const [city, setCity] = useState('');
    const [country, setCountry] = useState('United States');
    const [postalCode, setPostalCode] = useState('');
    const [partnerCode, setPartnerCode] = useState('');
    const [partnerApplied, setPartnerApplied] = useState(false);

    const activeCountry = COUNTRIES.find((c) => c.code === selectedCountryCode) || COUNTRIES[0];

    const entityOptions = [
        {
            id: 'Limited Liability Company (LLC)',
            title: 'Limited Liability Company (LLC)',
            desc: 'Flexible structure with simplified management and tax options. Ideal for most small and online businesses.',
            icon: (
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
            )
        },
        {
            id: 'Corporation (C-Corp)',
            title: 'Corporation (C-CORP)',
            desc: 'Classic structure built for raising capital, issuing stock, and scaling globally.',
            icon: (
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
            )
        },
        {
            id: 'Close LLC',
            title: 'Close LLC',
            desc: 'Unique to Wyoming, great for single owners or family businesses with reduced formalities but same protection and privacy.',
            icon: (
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
            )
        },
        {
            id: 'Close Corporation',
            title: 'Close Corporation',
            desc: 'Corporation-style protection and stock structure with less ongoing maintenance than a traditional C-Corp.',
            icon: (
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
            )
        }
    ];

    const isFormValid =
        entityType &&
        companyName.trim() &&
        firstName.trim() &&
        lastName.trim() &&
        email.trim() &&
        (currentUser || (password && password.length >= 8)) &&
        streetAddress.trim() &&
        city.trim() &&
        postalCode.trim();

    return (
        <form action={formAction} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Hidden field mirrors */}
            <input type="hidden" name="entityType" value={entityType} />
            <input type="hidden" name="formationState" value={formationState} />
            <input type="hidden" name="businessEnding" value={businessEnding} />

            {/* Left Column: Form Sections */}
            <div className="lg:col-span-8 space-y-8">
                {/* Error Banner */}
                {state && !state.ok && (
                    <div
                        role="alert"
                        aria-live="polite"
                        className="rounded-lg border border-[#ef4444]/40 bg-[#fef2f2] p-4 text-[14px] text-[#b91c1c] leading-relaxed"
                    >
                        {state.message}
                    </div>
                )}

                {/* Card 1: Formation State */}
                <div className="rounded-2xl border border-[#d1d5db] bg-white p-6 sm:p-8">
                    <div className="flex items-center justify-between gap-4 mb-4">
                        <div>
                            <h2 className="text-[18px] font-semibold text-[#0f172a] leading-[1.4]">Formation state</h2>
                            <p className="text-[12px] text-[#6b7280] leading-[1.5] mt-0.5">
                                You can choose another state if needed.
                            </p>
                        </div>
                        <div className="flex items-center gap-1.5 text-[12px] font-medium text-[#f97316]">
                            <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                            </svg>
                            <span className="hidden sm:inline">Wyoming is our most popular choice</span>
                        </div>
                    </div>

                    <div className="relative">
                        <select
                            id="formationState"
                            value={formationState}
                            onChange={(e) => setFormationState(e.target.value)}
                            className="w-full h-11 px-4 border border-[#d1d5db] rounded-lg bg-white text-[#0f172a] text-[14px] leading-[1.5] focus:outline-none focus:border-[#1e3a8a] cursor-pointer appearance-none pr-10 transition-colors duration-150"
                        >
                            {US_STATES.map((state) => (
                                <option key={state} value={state}>
                                    {state}
                                </option>
                            ))}
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-[#6b7280]">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                            </svg>
                        </div>
                    </div>
                </div>

                {/* Card 2: Entity Type */}
                <div className="rounded-2xl border border-[#d1d5db] bg-white p-6 sm:p-8">
                    <h2 className="text-[18px] font-semibold text-[#0f172a] leading-[1.4] mb-2">Entity type</h2>
                    <p className="text-[14px] text-[#6b7280] leading-[1.5] mb-6">
                        Select the legal structure that best fits your business goals.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {entityOptions.map((opt) => {
                            const isSelected = entityType === opt.id;
                            return (
                                <div
                                    key={opt.id}
                                    onClick={() => setEntityType(opt.id)}
                                    role="radio"
                                    aria-checked={isSelected}
                                    tabIndex={0}
                                    onKeyDown={(e) => {
                                        if (e.key === ' ' || e.key === 'Enter') {
                                            e.preventDefault();
                                            setEntityType(opt.id);
                                        }
                                    }}
                                    className={`relative p-5 rounded-lg border transition-all duration-150 cursor-pointer text-left bg-white select-none ${
                                        isSelected
                                            ? 'border-[#1e3a8a] ring-1 ring-[#1e3a8a]'
                                            : 'border-[#d1d5db] hover:border-[#1e3a8a]'
                                    }`}
                                >
                                    <div className="flex items-start gap-3.5">
                                        <div className="w-8 h-8 rounded-md bg-[#1e3a8a] flex items-center justify-center flex-shrink-0 mt-0.5">
                                            {opt.icon}
                                        </div>
                                        <div className="flex-1 pr-6">
                                            <h3 className="text-[14px] font-semibold text-[#0f172a] leading-[1.4] mb-1">
                                                {opt.title}
                                            </h3>
                                            <p className="text-[12px] text-[#6b7280] leading-[1.5]">{opt.desc}</p>
                                        </div>
                                    </div>
                                    {isSelected && (
                                        <div className="absolute top-4 right-4 text-[#16a34a]">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                                            </svg>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Card 3: Company Name */}
                <div className="rounded-2xl border border-[#d1d5db] bg-white p-6 sm:p-8">
                    <h2 className="text-[18px] font-semibold text-[#0f172a] leading-[1.4] mb-2">Company name</h2>
                    <p className="text-[14px] text-[#6b7280] leading-[1.5] mb-6">
                        Provide the name you wish to register with the Secretary of State.
                    </p>

                    <div className="space-y-4">
                        <div>
                            <label htmlFor="companyName" className="block text-[14px] font-medium text-[#0f172a] mb-1.5">
                                Proposed company name <span className="text-[#1e3a8a]">*</span>
                            </label>
                            <input
                                id="companyName"
                                name="companyName"
                                type="text"
                                required
                                value={companyName}
                                onChange={(e) => setCompanyName(e.target.value)}
                                placeholder="e.g. Apex Global Innovations"
                                className="w-full h-11 px-4 border border-[#d1d5db] rounded-lg bg-white text-[#0f172a] text-[14px] leading-[1.5] focus:outline-none focus:border-[#1e3a8a] transition-colors duration-150"
                            />
                        </div>

                        <div>
                            <label htmlFor="businessEnding" className="block text-[14px] font-medium text-[#0f172a] mb-1.5">
                                Business ending
                            </label>
                            <div className="relative">
                                <select
                                    id="businessEnding"
                                    value={businessEnding}
                                    onChange={(e) => setBusinessEnding(e.target.value)}
                                    className="w-full h-11 px-4 border border-[#d1d5db] rounded-lg bg-white text-[#0f172a] text-[14px] leading-[1.5] focus:outline-none focus:border-[#1e3a8a] cursor-pointer appearance-none pr-10 transition-colors duration-150"
                                >
                                    <option value="Prefer No Ending">Prefer No Ending</option>
                                    <option value="LLC">LLC</option>
                                    <option value="L.L.C.">L.L.C.</option>
                                    <option value="Limited Liability Company">Limited Liability Company</option>
                                    <option value="Corp">Corp</option>
                                    <option value="Corporation">Corporation</option>
                                    <option value="Inc">Inc</option>
                                    <option value="Incorporated">Incorporated</option>
                                </select>
                                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-[#6b7280]">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Card 4: Privacy Notice Callout */}
                <div className="rounded-2xl border border-[#d1d5db] bg-white p-6 sm:p-8">
                    <h2 className="text-[18px] font-semibold text-[#0f172a] leading-[1.4] mb-3">Privacy protection</h2>
                    <div className="rounded-lg bg-[#f3f4f6] p-4 flex items-start gap-3">
                        <div className="w-5 h-5 rounded-full bg-[#1e3a8a] text-white flex items-center justify-center flex-shrink-0 mt-0.5 text-[11px] font-bold">
                            i
                        </div>
                        <p className="text-[14px] text-[#0f172a] leading-[1.5]">
                            Your registered agent address will appear on public records instead of your personal address. This keeps your home and private contact details off public internet registers.
                        </p>
                    </div>
                </div>

                {/* Card 5: Contact Details */}
                <div className="rounded-2xl border border-[#d1d5db] bg-white p-6 sm:p-8">
                    <h2 className="text-[18px] font-semibold text-[#0f172a] leading-[1.4] mb-2">Contact details</h2>
                    <p className="text-[14px] text-[#6b7280] leading-[1.5] mb-6">
                        {currentUser
                            ? `Signed in as ${currentUser.email}. These details will be associated with the filing record.`
                            : 'Create your account and primary company officer contact record.'}
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="firstName" className="block text-[14px] font-medium text-[#0f172a] mb-1.5">
                                First name <span className="text-[#1e3a8a]">*</span>
                            </label>
                            <input
                                id="firstName"
                                name="firstName"
                                type="text"
                                required
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                placeholder="e.g. Alexander"
                                className="w-full h-11 px-4 border border-[#d1d5db] rounded-lg bg-white text-[#0f172a] text-[14px] leading-[1.5] focus:outline-none focus:border-[#1e3a8a] transition-colors duration-150"
                            />
                        </div>

                        <div>
                            <label htmlFor="lastName" className="block text-[14px] font-medium text-[#0f172a] mb-1.5">
                                Last name <span className="text-[#1e3a8a]">*</span>
                            </label>
                            <input
                                id="lastName"
                                name="lastName"
                                type="text"
                                required
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                placeholder="e.g. Vance"
                                className="w-full h-11 px-4 border border-[#d1d5db] rounded-lg bg-white text-[#0f172a] text-[14px] leading-[1.5] focus:outline-none focus:border-[#1e3a8a] transition-colors duration-150"
                            />
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-[14px] font-medium text-[#0f172a] mb-1.5">
                                Email <span className="text-[#1e3a8a]">*</span>
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                required
                                readOnly={!!currentUser}
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="alex@example.com"
                                className={`w-full h-11 px-4 border border-[#d1d5db] rounded-lg text-[14px] leading-[1.5] focus:outline-none focus:border-[#1e3a8a] transition-colors duration-150 ${
                                    currentUser ? 'bg-[#f3f4f6] text-[#6b7280] cursor-not-allowed' : 'bg-white text-[#0f172a]'
                                }`}
                            />
                        </div>

                        <div>
                            <label htmlFor="phone" className="block text-[14px] font-medium text-[#0f172a] mb-1.5">
                                Phone number
                            </label>
                            <div className="flex">
                                <select
                                    aria-label="Country dial code"
                                    value={selectedCountryCode}
                                    onChange={(e) => setSelectedCountryCode(e.target.value)}
                                    className="h-11 px-3 border border-r-0 border-[#d1d5db] rounded-l-lg bg-[#f3f4f6] text-[#0f172a] text-[14px] cursor-pointer focus:outline-none focus:border-[#1e3a8a]"
                                >
                                    {COUNTRIES.map((c) => (
                                        <option key={c.code} value={c.code}>
                                            {c.flag} {c.dial_code}
                                        </option>
                                    ))}
                                </select>
                                <input
                                    id="phone"
                                    name="phone"
                                    type="tel"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    placeholder={activeCountry.placeholder}
                                    className="flex-1 h-11 px-4 border border-[#d1d5db] rounded-r-lg bg-white text-[#0f172a] text-[14px] leading-[1.5] focus:outline-none focus:border-[#1e3a8a] transition-colors duration-150"
                                />
                            </div>
                        </div>

                        {!currentUser && (
                            <div className="md:col-span-2">
                                <label htmlFor="password" className="block text-[14px] font-medium text-[#0f172a] mb-1.5">
                                    Create portal password <span className="text-[#1e3a8a]">*</span>
                                </label>
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    required
                                    minLength={8}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Minimum 8 characters"
                                    className="w-full h-11 px-4 border border-[#d1d5db] rounded-lg bg-white text-[#0f172a] text-[14px] leading-[1.5] focus:outline-none focus:border-[#1e3a8a] transition-colors duration-150"
                                />
                                <p className="mt-1.5 text-[12px] text-[#6b7280]">
                                    You will use this password to log into your Wyoming Company LLC client dashboard.
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Card 6: Contact Address */}
                <div className="rounded-2xl border border-[#d1d5db] bg-white p-6 sm:p-8">
                    <h2 className="text-[18px] font-semibold text-[#0f172a] leading-[1.4] mb-2">Contact address</h2>
                    <p className="text-[14px] text-[#6b7280] leading-[1.5] mb-6">
                        This address is used for official filings and internal verification. It will remain strictly private.
                    </p>

                    <div className="space-y-4">
                        <div>
                            <label htmlFor="address" className="block text-[14px] font-medium text-[#0f172a] mb-1.5">
                                Street address <span className="text-[#1e3a8a]">*</span>
                            </label>
                            <input
                                id="address"
                                name="address"
                                type="text"
                                required
                                value={streetAddress}
                                onChange={(e) => setStreetAddress(e.target.value)}
                                placeholder="1309 Coffeen Ave"
                                className="w-full h-11 px-4 border border-[#d1d5db] rounded-lg bg-white text-[#0f172a] text-[14px] leading-[1.5] focus:outline-none focus:border-[#1e3a8a] transition-colors duration-150"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="unit" className="block text-[14px] font-medium text-[#0f172a] mb-1.5">
                                    Unit / Suite / Apt <span className="text-[#6b7280] font-normal">(optional)</span>
                                </label>
                                <input
                                    id="unit"
                                    name="unit"
                                    type="text"
                                    value={unit}
                                    onChange={(e) => setUnit(e.target.value)}
                                    placeholder="Suite 100"
                                    className="w-full h-11 px-4 border border-[#d1d5db] rounded-lg bg-white text-[#0f172a] text-[14px] leading-[1.5] focus:outline-none focus:border-[#1e3a8a] transition-colors duration-150"
                                />
                            </div>

                            <div>
                                <label htmlFor="city" className="block text-[14px] font-medium text-[#0f172a] mb-1.5">
                                    City <span className="text-[#1e3a8a]">*</span>
                                </label>
                                <input
                                    id="city"
                                    name="city"
                                    type="text"
                                    required
                                    value={city}
                                    onChange={(e) => setCity(e.target.value)}
                                    placeholder="Sheridan"
                                    className="w-full h-11 px-4 border border-[#d1d5db] rounded-lg bg-white text-[#0f172a] text-[14px] leading-[1.5] focus:outline-none focus:border-[#1e3a8a] transition-colors duration-150"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="country" className="block text-[14px] font-medium text-[#0f172a] mb-1.5">
                                    Country <span className="text-[#1e3a8a]">*</span>
                                </label>
                                <div className="relative">
                                    <select
                                        id="country"
                                        name="country"
                                        value={country}
                                        onChange={(e) => setCountry(e.target.value)}
                                        className="w-full h-11 px-4 border border-[#d1d5db] rounded-lg bg-white text-[#0f172a] text-[14px] leading-[1.5] focus:outline-none focus:border-[#1e3a8a] cursor-pointer appearance-none pr-10 transition-colors duration-150"
                                    >
                                        {COUNTRIES.map((c) => (
                                            <option key={c.code} value={c.name}>
                                                {c.flag} {c.name}
                                            </option>
                                        ))}
                                    </select>
                                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-[#6b7280]">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label htmlFor="postalCode" className="block text-[14px] font-medium text-[#0f172a] mb-1.5">
                                    Postal / ZIP code <span className="text-[#1e3a8a]">*</span>
                                </label>
                                <input
                                    id="postalCode"
                                    name="postalCode"
                                    type="text"
                                    required
                                    value={postalCode}
                                    onChange={(e) => setPostalCode(e.target.value)}
                                    placeholder="82801"
                                    className="w-full h-11 px-4 border border-[#d1d5db] rounded-lg bg-white text-[#0f172a] text-[14px] leading-[1.5] focus:outline-none focus:border-[#1e3a8a] transition-colors duration-150"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Card 7: Partner / Referral Code */}
                <div className="rounded-2xl border border-[#d1d5db] bg-white p-6 sm:p-8">
                    <div className="flex items-center gap-2 mb-3">
                        <svg className="w-5 h-5 text-[#1e3a8a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                        </svg>
                        <h2 className="text-[14px] font-semibold text-[#1e3a8a]">Have a partner code?</h2>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3">
                        <input
                            id="partnerCode"
                            name="partnerCode"
                            type="text"
                            value={partnerCode}
                            onChange={(e) => {
                                setPartnerCode(e.target.value);
                                setPartnerApplied(false);
                            }}
                            placeholder="Enter affiliate or partner code"
                            className="flex-1 h-11 px-4 border border-[#d1d5db] rounded-lg bg-white text-[#0f172a] text-[14px] leading-[1.5] focus:outline-none focus:border-[#1e3a8a] transition-colors duration-150"
                        />
                        <button
                            type="button"
                            onClick={() => {
                                if (partnerCode.trim()) setPartnerApplied(true);
                            }}
                            className="h-11 px-6 rounded-lg bg-[#f3f4f6] text-[#0f172a] font-medium text-[14px] hover:bg-[#e5e7eb] transition-colors duration-150 cursor-pointer"
                        >
                            {partnerApplied ? 'Applied' : 'Apply'}
                        </button>
                    </div>
                    {partnerApplied && (
                        <p className="mt-2 text-[12px] text-[#16a34a] font-medium flex items-center gap-1.5">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                            </svg>
                            Partner code &ldquo;{partnerCode}&rdquo; verified and applied to filing.
                        </p>
                    )}
                </div>

                {/* Primary Submit Button */}
                <div className="pt-2">
                    <button
                        type="submit"
                        disabled={!isFormValid || isPending}
                        className={`w-full h-12 rounded-lg font-bold text-[14px] text-white flex items-center justify-center gap-2 transition-colors duration-150 ${
                            isFormValid && !isPending
                                ? 'bg-[#1e3a8a] hover:bg-[#2548a8] cursor-pointer'
                                : 'bg-[#f3f4f6] text-[#9ca3af] cursor-not-allowed'
                        }`}
                    >
                        {isPending ? (
                            <>
                                <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                </svg>
                                <span>Submitting Application…</span>
                            </>
                        ) : (
                            'Submit Application'
                        )}
                    </button>
                    <p className="mt-3 text-center text-[11px] uppercase tracking-wider text-[#6b7280]">
                        Wyoming Company LLC · Not a law firm · Transparent $99 Flat Formation
                    </p>
                </div>
            </div>

            {/* Right Column: Order Summary & Review Box */}
            <div className="lg:col-span-4 lg:sticky lg:top-8 space-y-6">
                <div className="rounded-2xl border border-[#d1d5db] bg-white p-6 sm:p-8">
                    <div className="flex items-center justify-between pb-4 border-b border-[#d1d5db]">
                        <h2 className="text-[16px] font-bold text-[#0f172a]">Order Summary</h2>
                        <span className="text-[11px] font-semibold text-[#1e3a8a] uppercase tracking-wider bg-[#f3f4f6] px-2.5 py-1 rounded-full">
                            Flat pricing
                        </span>
                    </div>

                    <div className="py-4 space-y-3.5 border-b border-[#d1d5db]">
                        <div>
                            <p className="text-[11px] font-medium uppercase text-[#6b7280]">Company Name</p>
                            <p className="text-[14px] font-semibold text-[#0f172a] break-words mt-0.5">
                                {companyName.trim() ? (
                                    <>
                                        {companyName.trim()}{' '}
                                        {businessEnding !== 'Prefer No Ending' ? businessEnding : ''}
                                    </>
                                ) : (
                                    <span className="text-[#9ca3af] font-normal italic">Not selected</span>
                                )}
                            </p>
                        </div>

                        <div>
                            <p className="text-[11px] font-medium uppercase text-[#6b7280]">Structure</p>
                            <p className="text-[14px] font-medium text-[#0f172a] mt-0.5">
                                {entityType || <span className="text-[#9ca3af] font-normal italic">Not selected</span>}
                            </p>
                        </div>

                        <div>
                            <p className="text-[11px] font-medium uppercase text-[#6b7280]">Jurisdiction</p>
                            <p className="text-[14px] font-medium text-[#0f172a] mt-0.5">
                                {formationState}
                            </p>
                        </div>
                    </div>

                    {/* Price Breakdown */}
                    <div className="py-4 space-y-2.5 border-b border-[#d1d5db] text-[14px]">
                        <div className="flex justify-between text-[#0f172a]">
                            <span>Wyoming Formation Service</span>
                            <span className="font-semibold">$99.00</span>
                        </div>
                        <div className="flex justify-between text-[#0f172a]">
                            <span>State Filing Fee</span>
                            <span className="font-semibold">$102.00</span>
                        </div>
                        <div className="flex justify-between text-[#0f172a]">
                            <span>Registered Agent (1st Year)</span>
                            <span className="text-[#16a34a] font-semibold">FREE</span>
                        </div>
                    </div>

                    {/* Total */}
                    <div className="pt-4 flex items-baseline justify-between">
                        <span className="text-[16px] font-bold text-[#0f172a]">Total Due</span>
                        <div className="text-right">
                            <span className="text-[24px] font-extrabold text-[#1e3a8a]">$201.00</span>
                            <p className="text-[11px] text-[#6b7280]">One-time formation fee</p>
                        </div>
                    </div>
                </div>

                {/* Included Features Card */}
                <div className="rounded-2xl border border-[#d1d5db] bg-white p-6">
                    <h3 className="text-[14px] font-semibold text-[#0f172a] mb-3">Included with your filing</h3>
                    <ul className="space-y-2.5 text-[12px] text-[#0f172a]">
                        <li className="flex items-start gap-2">
                            <svg className="w-4 h-4 text-[#16a34a] flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                            </svg>
                            <span>Articles of Organization prepared & filed</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <svg className="w-4 h-4 text-[#16a34a] flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                            </svg>
                            <span>1 Year Wyoming Registered Agent address</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <svg className="w-4 h-4 text-[#16a34a] flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                            </svg>
                            <span>Initial Operating Agreement template</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <svg className="w-4 h-4 text-[#16a34a] flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                            </svg>
                            <span>Client portal dashboard access</span>
                        </li>
                    </ul>
                </div>

                {/* Back / Navigation Link */}
                <div className="text-center">
                    <Link
                        href={currentUser ? '/dashboard' : '/login'}
                        className="text-[14px] font-semibold text-[#1e3a8a] hover:underline"
                    >
                        {currentUser ? '← Back to dashboard' : 'Already have an account? Sign in →'}
                    </Link>
                </div>
            </div>
        </form>
    );
}
