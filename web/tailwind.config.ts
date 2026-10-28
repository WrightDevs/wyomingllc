import type { Config } from 'tailwindcss';

const config: Config = {
    content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './lib/**/*.{ts,tsx}'],
    theme: {
        extend: {
            colors: {
                primary: '#0f766e',
                'primary-bright': '#0d9488',
                'primary-deep': '#0c6b63',
                'on-primary': '#ffffff',
                'accent-cta': '#fb923c',
                'on-accent': '#ffffff',
                ink: '#111827',
                'ink-soft': '#4b5563',
                'on-ink': '#94a3b8',
                canvas: '#f8fafc',
                paper: '#ffffff',
                cloud: '#f8fafc',
                'surface-dark': '#1e293b',
                hairline: '#e2e8f0',
                'hairline-strong': '#cbd5e1',
                link: '#7c3aed',
                'link-pressed': '#5b21b6',
                success: '#16a34a',
                warning: '#fb923c',
                error: '#dc2626',
                'feature-blue': '#4f46e5',
                'feature-pink': '#db2777',
                pine: {
                    50: '#f8fafc',
                    100: '#f1f5f9',
                    200: '#e2e8f0',
                    300: '#cbd5e1',
                    400: '#94a3b8',
                    500: '#64748b',
                    600: '#0d9488',
                    700: '#0f766e',
                    800: '#0c6b63',
                    900: '#111827',
                    950: '#111827'
                },
                ember: {
                    50: '#fff7ed',
                    100: '#ffedd5',
                    200: '#fed7aa',
                    300: '#fdba74',
                    400: '#fb923c',
                    500: '#f97316',
                    600: '#ea580c',
                    700: '#c2410c',
                    800: '#9a3412',
                    900: '#7c2d12'
                },
                accent: {
                    500: '#8b5cf6',
                    600: '#7c3aed'
                },
                secondary: '#fb923c',
                navy: '#1e3a8a',
                bone: '#f8fafc',
                sand: '#f1f5f9'
            },
            fontFamily: {
                sans: ['system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
                display: ['system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
                mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Consolas', 'Liberation Mono', 'monospace']
            },
            fontSize: {
                'display-xl': ['60px', { lineHeight: '1.1', fontWeight: '800' }],
                'display-lg': ['48px', { lineHeight: '1.1', fontWeight: '800' }],
                'display-md': ['36px', { lineHeight: '1.2', fontWeight: '800' }],
                'display-sm': ['24px', { lineHeight: '1.3', fontWeight: '800' }],
                'body-lg': ['20px', { lineHeight: '1.5', fontWeight: '400' }],
                'body-md': ['16px', { lineHeight: '1.6', fontWeight: '400' }],
                'body-emphasis': ['16px', { lineHeight: '1.6', fontWeight: '500' }],
                'caption-md': ['14px', { lineHeight: '1.4', fontWeight: '400' }],
                'caption-sm': ['12px', { lineHeight: '1.5', fontWeight: '500', letterSpacing: '0.06em' }],
                'button-md': ['16px', { lineHeight: '1', fontWeight: '600' }],
                'link-md': ['16px', { lineHeight: '1.5', fontWeight: '500' }]
            },
            borderRadius: {
                sm: '6px',
                md: '8px',
                lg: '12px',
                xl: '16px',
                xxl: '24px',
                card: '1rem',
                pill: '9999px'
            },
            spacing: {
                xxs: '4px',
                xs: '8px',
                sm: '12px',
                md: '16px',
                lg: '24px',
                xl: '32px',
                xxl: '48px',
                'section-sm': '64px',
                'section-md': '96px',
                'section-lg': '112px'
            },
            boxShadow: {
                'soft-lift': 'rgba(0, 0, 0, 0.05) 0px 1px 2px 0px',
                card: 'rgba(0, 0, 0, 0.05) 0px 1px 2px 0px',
                modal: 'rgba(0, 0, 0, 0.1) 0px 20px 25px -5px, rgba(0, 0, 0, 0.1) 0px 8px 10px -6px',
                sheet: '0 1px 0 rgba(16, 32, 28, 0.05), 0 18px 40px -28px rgba(16, 32, 28, 0.45)',
                lift: '0 2px 0 rgba(16, 32, 28, 0.05), 0 26px 60px -34px rgba(16, 32, 28, 0.55)'
            },
            backgroundImage: {
                'ledger-grid':
                    'linear-gradient(to right, rgba(17, 46, 40, 0.055) 1px, transparent 1px), linear-gradient(to bottom, rgba(17, 46, 40, 0.055) 1px, transparent 1px)'
            },
            backgroundSize: {
                ledger: '28px 28px'
            },
            transitionDuration: {
                fast: '150ms',
                base: '250ms',
                slow: '400ms'
            },
            transitionTimingFunction: {
                standard: 'cubic-bezier(0.4, 0, 0.2, 1)',
                emphasized: 'cubic-bezier(0.34, 1.56, 0.64, 1)'
            },
            keyframes: {
                rise: {
                    from: { opacity: '0', transform: 'translateY(10px)' },
                    to: { opacity: '1', transform: 'translateY(0)' }
                }
            },
            animation: {
                rise: 'rise 520ms cubic-bezier(0.22, 1, 0.36, 1) both'
            }
        }
    },
    plugins: []
};

export default config;
