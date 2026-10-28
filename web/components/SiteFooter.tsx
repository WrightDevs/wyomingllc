import Link from 'next/link';
import { Brand } from './Brand';

export function SiteFooter() {
    return (
        <footer id="contact" className="bg-slate-900 text-white">
            <div className="shell grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-4">
                <div>
                    <div className="mb-4 flex items-center gap-3">
                        <Brand tone="light" compact />
                    </div>
                    <p className="max-w-xs text-sm leading-relaxed text-slate-300">
                        Wyoming LLC filings, annual reports and records — with a read-only portfolio view attached to your account.
                    </p>
                    <p className="mt-4 text-xs text-slate-400">1309 Coffeen Ave, Sheridan, WY 82801</p>
                </div>

                <div>
                    <p className="mb-4 text-lg font-bold text-white">Services</p>
                    <ul className="mt-3 space-y-2 text-sm text-slate-300">
                        <li><Link href="/#services" className="hover:text-orange-300 transition">LLC formation</Link></li>
                        <li><Link href="/#services" className="hover:text-orange-300 transition">Registered agent</Link></li>
                        <li><Link href="/#services" className="hover:text-orange-300 transition">EIN &amp; annual reports</Link></li>
                        <li><Link href="/#pricing" className="hover:text-orange-300 transition">Pricing</Link></li>
                    </ul>
                </div>

                <div>
                    <p className="mb-4 text-lg font-bold text-white">Account</p>
                    <ul className="mt-3 space-y-2 text-sm text-slate-300">
                        <li><Link href="/login" className="hover:text-orange-300 transition">Sign in</Link></li>
                        <li><Link href="/signup" className="hover:text-orange-300 transition">Create an account</Link></li>
                        <li><Link href="/dashboard" className="hover:text-orange-300 transition">Client dashboard</Link></li>
                        <li><Link href="/#faq" className="hover:text-orange-300 transition">Common questions</Link></li>
                    </ul>
                </div>

                <div>
                    <p className="mb-4 text-lg font-bold text-white">Contact</p>
                    <ul className="mt-3 space-y-2 text-sm text-slate-300">
                        <li>
                            <a href="mailto:support@wyomingllclimited.xyz" className="hover:text-orange-300 transition">
                                support@wyomingllclimited.xyz
                            </a>
                        </li>
                        <li>Monday–Friday, 9am–5pm MT</li>
                        <li className="text-slate-400">www.wyomingllclimited.xyz</li>
                    </ul>
                </div>
            </div>

            <div className="border-t border-slate-700">
                <div className="shell flex flex-col gap-2 py-6 text-[12px] leading-relaxed text-slate-400 sm:flex-row sm:items-center sm:justify-between">
                    <p>© {new Date().getFullYear()} Wyoming LLC Attorney. All rights reserved.</p>
                    <p className="max-w-xl">
                        wyomingllclimited.xyz is not a law firm and does not give legal advice.
                    </p>
                </div>
            </div>
        </footer>
    );
}
