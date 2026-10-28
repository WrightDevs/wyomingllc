import Link from 'next/link';
import type { Metadata } from 'next';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';
import { Icon, type IconName } from '@/components/icons';

export const metadata: Metadata = {
    title: 'Form a Wyoming LLC — $99 plus state fees',
    description:
        'Wyoming LLC formation, registered agent service and annual reports. File online for $99 plus the $102 state fee, then manage filings and linked wallets in one dashboard.',
    alternates: { canonical: '/' }
};

const facts = [
    { label: 'State filing fee', value: '$102', note: 'paid to Wyoming' },
    { label: 'Our service fee', value: '$99', note: 'one time' },
    { label: 'Annual report', value: '$60', note: 'state minimum' },
    { label: 'Formation time', value: '1–2 days', note: 'after state receipt' }
];

const services: Array<{ icon: IconName; title: string; body: string }> = [
    {
        icon: 'building',
        title: 'LLC formation',
        body: 'Articles of Organization prepared, checked against Wyoming’s naming rules, and filed with the Secretary of State.'
    },
    {
        icon: 'shield',
        title: 'Registered agent',
        body: 'A Wyoming address for service of process and state mail, with the statutory agent listed on your filing.'
    },
    {
        icon: 'filings',
        title: 'EIN assistance',
        body: 'We prepare the SS-4 details you need for a federal Employer Identification Number and walk the IRS form with you.'
    },
    {
        icon: 'refresh',
        title: 'Annual reports',
        body: 'A reminder before your anniversary month, with the $60 minimum state report prepared from your existing record.'
    },
    {
        icon: 'lock',
        title: 'Operating agreement',
        body: 'An internal membership agreement that sets ownership, voting and transfer terms. Not filed with the state.'
    },
    {
        icon: 'coins',
        title: 'Records dashboard',
        body: 'Company details, filing status and a read-only wallet view kept in one account you can sign in to.'
    }
];

const benefits = [
    {
        title: 'No state income tax',
        body: 'Wyoming levies no personal or corporate income tax. Revenue is taxed where you actually operate and reside.'
    },
    {
        title: 'Privacy by default',
        body: 'Wyoming does not publish member or manager names in its public entity search. Your registered agent’s address is what appears.'
    },
    {
        title: 'Low, fixed fees',
        body: 'The online filing fee is $102 and the annual report minimum is $60. There is no franchise tax and no minimum capital requirement.'
    },
    {
        title: 'Flexible management',
        body: 'Members or managers may run the company. Ownership percentages and profit splits are set in the operating agreement, not the filing.'
    }
];

const steps = [
    {
        number: '01',
        title: 'Open an account',
        body: 'Create one login for the whole record. Nothing is filed until you submit a company application from the dashboard.'
    },
    {
        number: '02',
        title: 'Send the details',
        body: 'Company name, registered contact and address. The form checks what Wyoming requires and keeps a draft you can revisit.'
    },
    {
        number: '03',
        title: 'We file, you track',
        body: 'Your application moves from pending to processing to a decision. The status and any reviewer note show on your dashboard.'
    }
];

const faqs = [
    {
        q: 'How much does a Wyoming LLC cost in total?',
        a: 'Our service fee is $99. Wyoming charges $102 to file Articles of Organization online. Budget $201 for the first filing, then a $60 minimum annual report in your anniversary month.'
    },
    {
        q: 'How long does formation take?',
        a: 'Once the state accepts the filing, approval is usually one to two business days. We submit the application after it clears our own review; the status on your dashboard is the source of truth.'
    },
    {
        q: 'Do I need a Wyoming address?',
        a: 'You need a registered agent with a physical Wyoming address, which can be ours. Your operating address does not have to be in Wyoming.'
    },
    {
        q: 'Is a Wyoming LLC private?',
        a: 'Member and manager names are not part of the public record, so the registered agent’s address is what the state search shows. Privacy is not anonymity from banks, courts or the IRS.'
    },
    {
        q: 'What is the annual report?',
        a: 'A short filing each year in your anniversary month that confirms your mailing and registered agent addresses. The state minimum fee is $60, based on Wyoming assets. Miss it and the state can dissolve the company.'
    },
    {
        q: 'What is the wallet view in the dashboard?',
        a: 'An optional, read-only record of addresses derived from a recovery phrase. It displays balances an administrator records; it never signs or broadcasts a transaction and cannot move funds.'
    },
    {
        q: 'Is this a law firm?',
        a: 'No. This is a filing service. We prepare and submit forms and do not give legal advice or represent you in a legal matter.'
    }
];

export default function HomePage() {
    return (
        <div className="min-h-dvh bg-bone">
            <SiteHeader />

            <main>
                {/* Hero */}
                <section className="relative overflow-hidden border-b border-hairline bg-gradient-to-br from-primary-deep via-primary to-teal-700">
                    <div className="absolute inset-0 opacity-10">
                        <div className="absolute top-20 right-10 w-72 h-72 bg-white rounded-full blur-3xl"></div>
                        <div className="absolute bottom-10 left-10 w-96 h-96 bg-accent-cta rounded-full blur-3xl"></div>
                    </div>

                    <div className="shell relative grid gap-12 py-20 lg:py-28 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-16">
                        <div className="max-w-xl">
                            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
                                <span className="inline-block w-2 h-2 bg-accent-cta rounded-full"></span>
                                <span className="text-white/90 text-sm">Wyoming filings · Sheridan, WY</span>
                            </div>
                            <div className="mb-4">
                                <div className="text-accent-cta text-sm font-bold uppercase tracking-widest mb-3">Limited Liability, Limitless Potential ℠</div>
                                <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-4">
                                    Register Your Business in
                                    <span className="bg-gradient-to-r from-accent-cta to-yellow-400 bg-clip-text text-transparent"> Wyoming</span>
                                </h1>
                                <p className="text-xl text-white/80">The Best State To Register Your Business</p>
                            </div>
                            <p className="mt-5 max-w-lg text-lg text-white/80 leading-relaxed">
                                Articles of Organization, a registered agent and the annual report that follows — prepared once, with the
                                record kept in an account you can actually open.
                            </p>

                            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                                <Link href="/signup" className="bg-gradient-to-r from-accent-cta to-yellow-500 text-white px-10 py-4 rounded-lg text-lg font-bold hover:shadow-2xl transform hover:scale-105 transition inline-flex items-center justify-center gap-2">
                                    Start Your Business
                                    <Icon name="arrow" className="h-5 w-5" />
                                </Link>
                                <Link href="#pricing" className="px-10 py-4 border border-white/40 text-white rounded-lg text-lg font-semibold hover:bg-white/10 transition inline-flex items-center justify-center">
                                    See what the state charges
                                </Link>
                            </div>

                            <dl className="mt-10 grid max-w-md grid-cols-2 gap-x-6 gap-y-4 border-t border-white/20 pt-6">
                                {facts.map((fact) => (
                                    <div key={fact.label}>
                                        <dt className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-white/60">
                                            {fact.label}
                                        </dt>
                                        <dd className="mt-0.5 flex items-baseline gap-2">
                                            <span className="text-xl font-bold text-white">{fact.value}</span>
                                            <span className="text-[11px] text-white/60">{fact.note}</span>
                                        </dd>
                                    </div>
                                ))}
                            </dl>
                        </div>

                        {/* Filing sheet — the hero artifact */}
                        <div className="relative mx-auto w-full max-w-md lg:mx-0">
                            <div className="bg-white/95 backdrop-blur rounded-3xl p-8 shadow-2xl max-w-md w-full border border-white/20">
                                <div className="text-center">
                                    <div className="w-20 h-20 bg-gradient-to-br from-primary to-teal-600 rounded-2xl mx-auto mb-4 flex items-center justify-center">
                                        <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                                        </svg>
                                    </div>
                                    <h3 className="text-2xl font-bold text-ink mb-3">Business Formations Made Safe and Easy</h3>
                                    <div className="text-accent-cta text-5xl font-extrabold mb-1">+100,000</div>
                                    <div className="text-ink-soft text-lg mb-6">Companies Formed</div>
                                    <Link href="/signup" className="w-full bg-gradient-to-r from-primary to-teal-600 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition inline-flex items-center justify-center">
                                        Start Your Business
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Services */}
                <section id="services" className="scroll-mt-20 border-b border-pine-900/10 bg-white py-16 sm:py-20">
                    <div className="shell">
                        <div className="max-w-2xl">
                            <p className="eyebrow">01 — Services</p>
                            <h2 className="display mt-2 text-3xl text-pine-950 sm:text-4xl">
                                Everything the state asks for, nothing it doesn’t.
                            </h2>
                            <p className="mt-3 text-[15px] leading-relaxed text-pine-900/65">
                                Wyoming keeps the requirements short. We prepare the filings, hold the registered address and keep the dates
                                where you can see them.
                            </p>
                        </div>

                        <div className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {services.map((service) => (
                                <article key={service.title} className="card group p-5 transition hover:border-pine-900/20 hover:shadow-lift">
                                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-pine-50 text-pine-700 transition group-hover:bg-pine-100">
                                        <Icon name={service.icon} className="h-5 w-5" />
                                    </span>
                                    <h3 className="display mt-4 text-lg text-pine-950">{service.title}</h3>
                                    <p className="mt-1.5 text-[13px] leading-relaxed text-pine-900/60">{service.body}</p>
                                </article>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Why Wyoming */}
                <section id="benefits" className="scroll-mt-20 border-b border-pine-900/10 py-16 sm:py-20">
                    <div className="shell grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-start lg:gap-16">
                        <div className="lg:sticky lg:top-24">
                            <p className="eyebrow">02 — Why Wyoming</p>
                            <h2 className="display mt-2 text-3xl text-pine-950 sm:text-4xl">
                                Small state, quiet advantages.
                            </h2>
                            <p className="mt-3 text-[15px] leading-relaxed text-pine-900/65">
                                Wyoming is attractive for what it does not do: no income tax, no franchise tax, and no public member list.
                                Those are statutory facts, not a promise about your own tax position.
                            </p>
                            <div className="mt-6 rounded-card border border-pine-900/10 bg-pine-50/60 p-4">
                                <p className="flex items-center gap-2 text-[12px] font-semibold text-pine-900/80">
                                    <Icon name="alert" className="h-4 w-4" />
                                    Check your own situation
                                </p>
                                <p className="mt-1.5 text-[12px] leading-relaxed text-pine-900/60">
                                    Forming in Wyoming does not by itself change where you owe tax or where you must register as a foreign
                                    entity. Ask an accountant about your facts.
                                </p>
                            </div>
                        </div>

                        <dl className="divide-y divide-pine-900/10 border-y border-pine-900/10">
                            {benefits.map((benefit, index) => (
                                <div key={benefit.title} className="grid gap-2 py-5 sm:grid-cols-[auto_1fr] sm:gap-5">
                                    <dt className="flex items-baseline gap-3">
                                        <span className="mono text-[10px] text-pine-900/35">{String(index + 1).padStart(2, '0')}</span>
                                        <span className="display text-lg text-pine-950">{benefit.title}</span>
                                    </dt>
                                    <dd className="text-[13px] leading-relaxed text-pine-900/60 sm:pt-1">{benefit.body}</dd>
                                </div>
                            ))}
                        </dl>
                    </div>
                </section>

                {/* Process */}
                <section id="process" className="scroll-mt-20 border-b border-pine-900/10 bg-pine-950 py-16 text-bone sm:py-20">
                    <div className="relative overflow-hidden">
                        <div className="absolute inset-0 bg-ledger-grid bg-ledger opacity-[0.14]" aria-hidden="true" />
                        <div className="shell relative">
                            <div className="max-w-2xl">
                                <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.22em] text-ember-300">
                                    03 — How it works
                                </p>
                                <h2 className="display mt-2 text-3xl text-bone sm:text-4xl">Three steps, one record.</h2>
                                <p className="mt-3 text-[15px] leading-relaxed text-pine-100/70">
                                    No phone call required. Every status change is visible from your dashboard, and nothing is submitted to the
                                    state until you send the application.
                                </p>
                            </div>

                            <ol className="mt-10 grid gap-4 sm:grid-cols-3">
                                {steps.map((step) => (
                                    <li key={step.number} className="rounded-card border border-white/10 bg-white/[0.04] p-5">
                                        <div className="flex items-baseline justify-between gap-3">
                                            <span className="mono text-2xl font-semibold text-ember-300">{step.number}</span>
                                            <span className="h-px flex-1 bg-white/15" aria-hidden="true" />
                                        </div>
                                        <h3 className="display mt-4 text-lg text-bone">{step.title}</h3>
                                        <p className="mt-1.5 text-[13px] leading-relaxed text-pine-100/65">{step.body}</p>
                                    </li>
                                ))}
                            </ol>

                            <div className="mt-9 flex flex-wrap items-center gap-3">
                                <Link href="/signup" className="btn-accent">
                                    Create an account
                                    <Icon name="arrow" className="h-4 w-4" />
                                </Link>
                                <Link href="/login" className="btn inline-flex border border-white/20 text-bone hover:bg-white/10">
                                    I already have one
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Pricing */}
                <section id="pricing" className="scroll-mt-20 border-b border-pine-900/10 bg-white py-16 sm:py-20">
                    <div className="shell">
                        <div className="max-w-2xl">
                            <p className="eyebrow">04 — Pricing</p>
                            <h2 className="display mt-2 text-3xl text-pine-950 sm:text-4xl">The whole bill, before you start.</h2>
                            <p className="mt-3 text-[15px] leading-relaxed text-pine-900/65">
                                One service fee, one state fee. Annual reports are billed at the state minimum when they come due.
                            </p>
                        </div>

                        <div className="mt-9 grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
                            <div className="card overflow-hidden">
                                <div className="flex flex-wrap items-end justify-between gap-4 border-b border-pine-900/10 bg-pine-50/60 px-5 py-5 sm:px-6">
                                    <div>
                                        <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-pine-900/45">
                                            Wyoming LLC formation
                                        </p>
                                        <p className="mt-1 flex items-baseline gap-1.5">
                                            <span className="display text-4xl text-pine-950">$99</span>
                                            <span className="text-sm text-pine-900/55">+ $102 state fee</span>
                                        </p>
                                    </div>
                                    <span className="badge-neutral">one-time</span>
                                </div>

                                <ul className="grid gap-3 px-5 py-5 sm:grid-cols-2 sm:px-6">
                                    {[
                                        'Articles of Organization prepared and filed',
                                        'Registered agent listed on the filing',
                                        'Name availability checked against state records',
                                        'EIN preparation guidance',
                                        'Operating agreement template',
                                        'Dashboard with filing status and records'
                                    ].map((item) => (
                                        <li key={item} className="flex items-start gap-2 text-[13px] leading-relaxed text-pine-900/70">
                                            <Icon name="check" className="mt-0.5 h-4 w-4 shrink-0 text-pine-700" />
                                            {item}
                                        </li>
                                    ))}
                                </ul>

                                <div className="flex flex-wrap items-center justify-between gap-3 border-t border-pine-900/10 px-5 py-4 sm:px-6">
                                    <p className="text-[12px] text-pine-900/55">Total due at filing: <strong className="font-semibold text-pine-950">$201</strong></p>
                                    <Link href="/signup" className="btn-primary btn-sm">
                                        Start filing
                                    </Link>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="card p-5">
                                    <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-pine-900/45">
                                        Every year after
                                    </p>
                                    <p className="mt-1 flex items-baseline gap-1.5">
                                        <span className="display text-2xl text-pine-950">$60</span>
                                        <span className="text-[12px] text-pine-900/55">state minimum</span>
                                    </p>
                                    <p className="mt-2 text-[13px] leading-relaxed text-pine-900/60">
                                        The annual report is due in your anniversary month. Wyoming sets the fee from in-state assets, so the
                                        minimum is what most small LLCs pay.
                                    </p>
                                </div>

                                <div className="rounded-card border border-pine-900/10 bg-pine-50/60 p-5">
                                    <p className="flex items-center gap-2 text-[12px] font-semibold text-pine-900/80">
                                        <Icon name="lock" className="h-4 w-4" />
                                        No upsell at checkout
                                    </p>
                                    <p className="mt-1.5 text-[13px] leading-relaxed text-pine-900/60">
                                        The service fee and the state fee are shown separately. Nothing recurring is added without you asking for
                                        it.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Wallet note */}
                <section className="border-b border-pine-900/10 py-14">
                    <div className="shell grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
                        <div className="max-w-2xl">
                            <p className="eyebrow">Optional · for existing accounts</p>
                            <h2 className="display mt-2 text-2xl text-pine-950">A read-only view of linked wallets.</h2>
                            <p className="mt-2 text-[13px] leading-relaxed text-pine-900/60">
                                The dashboard can derive EVM, Bitcoin and Solana addresses from a recovery phrase and display balances recorded
                                by an administrator. It is an observer: it never builds, signs or broadcasts a transaction.
                            </p>
                        </div>
                        <Link href="/dashboard/wallets" className="btn-outline">
                            <Icon name="wallet" className="h-4 w-4" />
                            Open wallet tools
                        </Link>
                    </div>
                </section>

                {/* FAQ */}
                <section id="faq" className="scroll-mt-20 bg-white py-16 sm:py-20">
                    <div className="shell grid gap-10 lg:grid-cols-[0.75fr_1.25fr] lg:gap-16">
                        <div>
                            <p className="eyebrow">05 — Questions</p>
                            <h2 className="display mt-2 text-3xl text-pine-950 sm:text-4xl">Asked before signing up.</h2>
                            <p className="mt-3 text-[15px] leading-relaxed text-pine-900/65">
                                Still stuck? Email <a href="mailto:support@wyomingllclimited.xyz" className="link">support@wyomingllclimited.xyz</a>{' '}
                                and a person answers, usually the same business day.
                            </p>
                        </div>

                        <div className="divide-y divide-pine-900/10 border-y border-pine-900/10">
                            {faqs.map((item) => (
                                <details key={item.q} className="group py-4">
                                    <summary className="flex cursor-pointer list-none items-start justify-between gap-4 text-[15px] font-semibold text-pine-950 marker:hidden">
                                        {item.q}
                                        <Icon
                                            name="chevron"
                                            className="mt-1 h-4 w-4 shrink-0 text-pine-900/40 transition group-open:rotate-90"
                                        />
                                    </summary>
                                    <p className="mt-2 pr-8 text-[13px] leading-relaxed text-pine-900/65">{item.a}</p>
                                </details>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Closing CTA */}
                <section className="border-t border-pine-900/10 bg-bone py-14 sm:py-16">
                    <div className="shell">
                        <div className="rounded-card border border-pine-900/15 bg-pine-900 px-6 py-8 text-bone sm:px-10 sm:py-10">
                            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                                <div className="max-w-xl">
                                    <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-ember-300">
                                        Ready when you are
                                    </p>
                                    <h2 className="display mt-2 text-2xl text-bone sm:text-3xl">
                                        Start the Wyoming filing in about ten minutes.
                                    </h2>
                                    <p className="mt-2 text-[13px] leading-relaxed text-pine-100/70">
                                        Create an account, send the company details, and follow the application from pending to a decision.
                                    </p>
                                </div>
                                <div className="flex flex-col gap-2 sm:flex-row">
                                    <Link href="/signup" className="btn-accent">
                                        Start filing — $99
                                    </Link>
                                    <Link href="/login" className="btn border border-white/25 text-bone hover:bg-white/10">
                                        Sign in
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <SiteFooter />
        </div>
    );
}
