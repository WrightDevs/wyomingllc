import type { Config } from 'tailwindcss';

const config: Config = {
    content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './lib/**/*.{ts,tsx}'],
    theme: {
        extend: {
            colors: {
                pine: {
                    50: '#f1f7f4',
                    100: '#dcebe4',
                    200: '#b8d7cb',
                    300: '#8bbcab',
                    400: '#5b9a87',
                    500: '#3c7d6c',
                    600: '#2b6455',
                    700: '#235145',
                    800: '#1d423a',
                    900: '#112e28',
                    950: '#081d19'
                },
                ember: {
                    50: '#fdf4ec',
                    100: '#fae4ce',
                    200: '#f4c79c',
                    300: '#eda464',
                    400: '#e6833a',
                    500: '#d2691e',
                    600: '#b4520f',
                    700: '#8f3d0e',
                    800: '#743313',
                    900: '#5f2b12'
                },
                bone: '#f8f4ea',
                sand: '#eee6d6',
                ink: '#10201c'
            },
            fontFamily: {
                display: ['Iowan Old Style', 'Palatino Linotype', 'Book Antiqua', 'Palatino', 'Georgia', 'serif'],
                sans: ['ui-sans-serif', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
                mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Consolas', 'Liberation Mono', 'monospace']
            },
            borderRadius: {
                card: '1.125rem'
            },
            boxShadow: {
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
