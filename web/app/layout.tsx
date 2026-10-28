import type { Metadata, Viewport } from 'next';
import Script from 'next/script';
import './globals.css';
import { APP_URL } from '@/lib/env';

export const metadata: Metadata = {
    metadataBase: new URL(APP_URL),
    title: {
        default: 'Wyoming LLC Attorney — form a Wyoming LLC and keep the records straight',
        template: '%s · Wyoming LLC Attorney'
    },
    description:
        'Wyoming LLC formation, registered agent service and annual reports. File online for $99 plus state fees, then manage your entity and linked wallets from one dashboard.',
    applicationName: 'Wyoming LLC Attorney',
    keywords: ['Wyoming LLC', 'LLC formation', 'registered agent', 'annual report', 'Wyoming'],
    openGraph: {
        title: 'Wyoming LLC Attorney',
        description: 'Form a Wyoming LLC for $99 plus state fees. Filings, annual reports and a read-only portfolio view in one account.',
        url: '/',
        siteName: 'Wyoming LLC Attorney',
        type: 'website'
    },
    robots: { index: true, follow: true }
};

export const viewport: Viewport = {
    width: 'device-width',
    initialScale: 1,
    themeColor: '#0f766e'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <body className="bg-canvas">
                {children}
                <Script id="smartsupp-widget" strategy="afterInteractive">
                    {`window._smartsupp = window._smartsupp || {};
window._smartsupp.key = '39b06ddf6254b8dd9eba8bc33b532cdef0a1c507';
window.smartsupp || (function (d) {
    var s, c, o = window.smartsupp = function () { o._.push(arguments); };
    o._ = [];
    s = d.getElementsByTagName('script')[0];
    c = d.createElement('script');
    c.type = 'text/javascript';
    c.charset = 'utf-8';
    c.async = true;
    c.src = 'https://www.smartsuppchat.com/loader.js?';
    if (s && s.parentNode) s.parentNode.insertBefore(c, s);
    else d.head.appendChild(c);
})(document);`}
                </Script>
            </body>
        </html>
    );
}
