import Link from 'next/link';
import { Brand } from './Brand';

export function SiteFooter() {
    return (
        <footer id="contact" className="mt-20 border-t border-pine-900/10 bg-pine-950 text-pine-100">
            <div className="shell grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-4">
                <div>
                    <Brand tone="light" />
                    <p className="mt-4 max-w-xs text-sm leading-relaxed text-pine-100/65">
                        Wyoming LLC filings, annual reports and records — with a read-only portfolio view attached to your account.
                    </p>
                </div>

                <div>
                    <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-pine-100/40">Services</p>
                    <ul className="mt-3 space-y-2 text-sm text-pine-100/75">
                        <li><Link href="/#services" className="hover:text-white">LLC formation</Link></li>
                        <li><Link href="/#services" className="hover:text-white">Registered agent</Link></li>
                        <li><Link href="/#services" className="hover:text-white">EIN &amp; annual reports</Link></li>
                        <li><Link href="/#pricing" className="hover:text-white">Pricing</Link></li>
                    </ul>
                </div>

                <div>
                    <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-pine-100/40">Account</p>
                    <ul className="mt-3 space-y-2 text-sm text-pine-100/75">
                        <li><Link href="/login" className="hover:text-white">Sign in</Link></li>
                        <li><Link href="/signup" className="hover:text-white">Create an account</Link></li>
                        <li><Link href="/dashboard" className="hover:text-white">Client dashboard</Link></li>
                        <li><Link href="/#faq" className="hover:text-white">Common questions</Link></li>
                    </ul>
                </div>

                <div>
                    <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-pine-100/40">Contact</p>
                    <ul className="mt-3 space-y-2 text-sm text-pine-100/75">
                        <li>
                            <a href="mailto:support@wyomingllclimited.xyz" className="hover:text-white">
                                support@wyomingllclimited.xyz
                            </a>
                        </li>
                        <li>Monday–Friday, 9am–5pm MT</li>
                        <li className="text-pine-100/50">www.wyomingllclimited.xyz</li>
                    </ul>
                </div>
            </div>

            <div className="border-t border-white/10">
                <div className="shell flex flex-col gap-2 py-6 text-[12px] leading-relaxed text-pine-100/50 sm:flex-row sm:items-center sm:justify-between">
                    <p>© {new Date().getFullYear()} Wyoming LLC Attorney. All rights reserved.</p>
                    <p className="max-w-xl">
                        Wyoming LLC Attorney is an independent filing service, is not a law firm, and does not give legal advice.
                    </p>
                </div>
            </div>
        </footer>
    );
}
