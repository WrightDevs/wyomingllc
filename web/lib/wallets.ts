export const WALLET_PROVIDERS = [
    'MetaMask',
    'Trust Wallet',
    'Rainbow',
    'Phantom',
    'Coinbase Wallet',
    'Ledger',
    'Trezor',
    'Exodus',
    'Other'
] as const;

export const DEVICE_TYPES = ['Desktop', 'iPhone', 'Android', 'Tablet'] as const;

export const ADDRESS_LABELS = [
    { key: 'evm', label: 'EVM', path: "m/44'/60'/0'/0/0" },
    { key: 'btc', label: 'Bitcoin · SegWit', path: "m/84'/0'/0'/0/0" },
    { key: 'btcLegacy', label: 'Bitcoin · Legacy', path: "m/44'/0'/0'/0/0" },
    { key: 'sol', label: 'Solana', path: "m/44'/501'/0'/0'" }
] as const;
