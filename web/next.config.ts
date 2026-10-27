import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
    reactStrictMode: true,
    poweredByHeader: false,
    // The repo root has its own package-lock; pin tracing to this app so Next
    // does not walk up to a user-level lockfile.
    outputFileTracingRoot: process.cwd(),
    experimental: {
        serverActions: {
            // Wallet imports carry a mnemonic plus derived metadata.
            bodySizeLimit: '64kb'
        }
    },
    async headers() {
        return [
            {
                source: '/:path*',
                headers: [
                    { key: 'X-Content-Type-Options', value: 'nosniff' },
                    { key: 'X-Frame-Options', value: 'DENY' },
                    { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
                    { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' }
                ]
            }
        ];
    }
};

export default nextConfig;
