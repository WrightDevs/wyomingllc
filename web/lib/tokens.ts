/**
 * Canonical asset list. This is the only place asset metadata lives — pages and
 * admin editors read from here. Balance keys are symbols, matching the legacy
 * `user_balances.balances` map and the new `balances.symbol` column.
 */
export type Token = {
    id: string;
    symbol: string;
    name: string;
    color: string;
    image: string;
    coingecko: string;
    fallback: number;
};

export const TOKENS: Token[] = [
    { id: 'usdt', symbol: 'USDT', name: 'Tether USD', color: '#26A17B', image: 'https://assets.coingecko.com/coins/images/325/large/Tether-logo.png', coingecko: 'tether', fallback: 0.9994 },
    { id: 'btc', symbol: 'BTC', name: 'Bitcoin', color: '#F7931A', image: 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png', coingecko: 'bitcoin', fallback: 87816 },
    { id: 'ethereum', symbol: 'ETH', name: 'Ethereum', color: '#627EEA', image: 'https://assets.coingecko.com/coins/images/279/large/ethereum.png', coingecko: 'ethereum', fallback: 2945.82 },
    { id: 'bnb', symbol: 'BNB', name: 'BNB', color: '#F3BA2F', image: 'https://assets.coingecko.com/coins/images/825/large/binance-coin-logo.png', coingecko: 'binancecoin', fallback: 864 },
    { id: 'sol', symbol: 'SOL', name: 'Solana', color: '#14F195', image: 'https://assets.coingecko.com/coins/images/4128/large/coinmarketcap-solana-200.png', coingecko: 'solana', fallback: 124.5 },
    { id: 'tron', symbol: 'TRX', name: 'TRON', color: '#FF0013', image: 'https://coin-images.coingecko.com/coins/images/1094/large/tron-logo.png', coingecko: 'tron', fallback: 0.2839 },
    { id: 'doge', symbol: 'DOGE', name: 'Dogecoin', color: '#C2A633', image: 'https://assets.coingecko.com/coins/images/5/large/dogecoin.png', coingecko: 'dogecoin', fallback: 0.1243 },
    { id: 'shib', symbol: 'SHIB', name: 'Shiba Inu', color: '#FFA409', image: 'https://assets.coingecko.com/coins/images/11939/large/shiba.png', coingecko: 'shiba-inu', fallback: 0.00000734 },
    { id: 'xrp', symbol: 'XRP', name: 'Ripple', color: '#23292F', image: 'https://assets.coingecko.com/coins/images/44/large/xrp.png', coingecko: 'ripple', fallback: 1.87 },
    { id: 'bch', symbol: 'BCH', name: 'Bitcoin Cash', color: '#8DC351', image: 'https://coin-images.coingecko.com/coins/images/780/large/bitcoin-cash-circle.png', coingecko: 'bitcoin-cash', fallback: 631.73 },
    { id: 'xlm', symbol: 'XLM', name: 'Stellar', color: '#14B6E7', image: 'https://assets.coingecko.com/coins/images/100/large/Stellar_symbol_black_RGB.png', coingecko: 'stellar', fallback: 0.2226 },
    { id: 'ltc', symbol: 'LTC', name: 'Litecoin', color: '#BFBBBB', image: 'https://assets.coingecko.com/coins/images/2/large/litecoin.png', coingecko: 'litecoin', fallback: 79.49 },
    { id: 'algo', symbol: 'ALGO', name: 'Algorand', color: '#000000', image: 'https://assets.coingecko.com/coins/images/4380/large/download.png', coingecko: 'algorand', fallback: 0.1202 },
    { id: 'dot', symbol: 'DOT', name: 'Polkadot', color: '#E6007A', image: 'https://coin-images.coingecko.com/coins/images/12171/large/polkadot.png', coingecko: 'polkadot', fallback: 1.88 },
    { id: 'ada', symbol: 'ADA', name: 'Cardano', color: '#0033AD', image: 'https://assets.coingecko.com/coins/images/975/large/cardano.png', coingecko: 'cardano', fallback: 0.3703 },
    { id: 'usdtt', symbol: 'USDT', name: 'Tether USD (TRC20)', color: '#26A17B', image: 'https://assets.coingecko.com/coins/images/325/large/Tether-logo.png', coingecko: 'tether', fallback: 0.9994 },
    { id: 'usdtb', symbol: 'USDT', name: 'Tether USD (BSC)', color: '#26A17B', image: 'https://assets.coingecko.com/coins/images/325/large/Tether-logo.png', coingecko: 'tether', fallback: 0.9994 },
    { id: 'usdte', symbol: 'USDT', name: 'Tether USD (ERC20)', color: '#26A17B', image: 'https://assets.coingecko.com/coins/images/325/large/Tether-logo.png', coingecko: 'tether', fallback: 0.9994 },
    { id: 'pepe', symbol: 'PEPE', name: 'Pepe', color: '#61C554', image: 'https://coin-images.coingecko.com/coins/images/29850/large/pepe-token.jpeg', coingecko: 'pepe', fallback: 0.00000421 },
    { id: 'link', symbol: 'LINK', name: 'Chainlink', color: '#2A5ADA', image: 'https://coin-images.coingecko.com/coins/images/877/large/chainlink-new-logo.png', coingecko: 'chainlink', fallback: 12.52 },
    { id: 'jasmy', symbol: 'JASMY', name: 'JasmyCoin', color: '#4F46E5', image: 'https://coin-images.coingecko.com/coins/images/13876/large/JASMY200x200.jpg', coingecko: 'jasmycoin', fallback: 0.006076 },
    { id: 'pol', symbol: 'POL', name: 'Polygon', color: '#8247E5', image: 'https://coin-images.coingecko.com/coins/images/32440/large/polygon.png', coingecko: 'polygon-ecosystem-token', fallback: 0.1077 },
    { id: 'celo', symbol: 'CELO', name: 'Celo', color: '#FCFF52', image: 'https://assets.coingecko.com/coins/images/11090/standard/InjXBNx9_400x400.jpg', coingecko: 'celo', fallback: 0.1217 },
    { id: 'hbar', symbol: 'HBAR', name: 'Hedera', color: '#000000', image: 'https://coin-images.coingecko.com/coins/images/3688/large/hbar.png', coingecko: 'hedera-hashgraph', fallback: 0.1161 },
    { id: 'qnt', symbol: 'QNT', name: 'Quant', color: '#5B5B5B', image: 'https://coin-images.coingecko.com/coins/images/3370/large/5ZOu7brX_400x400.jpg', coingecko: 'quant-network', fallback: 73.73 },
    { id: 'ondo', symbol: 'ONDO', name: 'Ondo', color: '#0052FF', image: 'https://coin-images.coingecko.com/coins/images/26580/large/ONDO.png', coingecko: 'ondo-finance', fallback: 0.3898 },
    { id: 'trb', symbol: 'TRB', name: 'Tellor Tributes', color: '#00E0FF', image: 'https://assets.coingecko.com/coins/images/9644/large/TRB-New_Logo.png', coingecko: 'tellor', fallback: 20.62 },
    { id: 'flr', symbol: 'FLR', name: 'Flare', color: '#E84142', image: 'https://coin-images.coingecko.com/coins/images/28624/large/FLR-icon200x200.png', coingecko: 'flare-networks', fallback: 0.0112 },
    { id: 'vet', symbol: 'VET', name: 'VeChain', color: '#15BDFF', image: 'https://coin-images.coingecko.com/coins/images/1167/large/VET.png', coingecko: 'vechain', fallback: 0.0113 },
    { id: 'iotx', symbol: 'IOTX', name: 'IoTeX', color: '#00D4AA', image: 'https://assets.coingecko.com/coins/images/3334/large/20250731-171811.png', coingecko: 'iotex', fallback: 0.007438 },
    { id: 'zbcn', symbol: 'ZBCN', name: 'Zebec Network', color: '#7C3AED', image: 'https://assets.coingecko.com/coins/images/37052/large/zbcn.jpeg', coingecko: 'zebec-network', fallback: 0.001127 },
    { id: 'lcx', symbol: 'LCX', name: 'LCX', color: '#0052FF', image: 'https://assets.coingecko.com/coins/images/9985/large/zRPSu_0o_400x400.jpg', coingecko: 'lcx', fallback: 0.0575 },
    { id: 'cro', symbol: 'CRO', name: 'Cronos', color: '#002D74', image: 'https://coin-images.coingecko.com/coins/images/7310/large/cro_token_logo.png', coingecko: 'crypto-com-chain', fallback: 0.0934 }
];

export const TOKENS_BY_SYMBOL: Record<string, Token> = TOKENS.reduce<Record<string, Token>>((acc, token) => {
    if (!acc[token.symbol]) acc[token.symbol] = token;
    return acc;
}, {});

export const ASSET_SYMBOLS: string[] = Object.keys(TOKENS_BY_SYMBOL);

export function coingeckoIds(): string[] {
    return Array.from(new Set(TOKENS.map((token) => token.coingecko)));
}

export type PriceMap = Record<string, number>;

export function fallbackPrices(): PriceMap {
    const out: PriceMap = {};
    TOKENS.forEach((token) => {
        if (!(token.coingecko in out)) out[token.coingecko] = token.fallback;
    });
    return out;
}

/** Magnitude-aware price formatting. Avoids "$87816.0000". */
export function formatPrice(value: number): string {
    const number = Number(value);
    if (!Number.isFinite(number)) return '$0.00';
    let decimals: number;
    if (number >= 1) decimals = 2;
    else if (number >= 0.01) decimals = 4;
    else decimals = 8;
    return (
        '$' +
        number.toLocaleString('en-US', {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals
        })
    );
}

export function formatUsd(value: number): string {
    const number = Number(value);
    return (
        '$' +
        (Number.isFinite(number) ? number : 0).toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        })
    );
}

/** Trim trailing zeros from a token amount, keeping up to 8 decimals. */
export function formatAmount(value: number): string {
    const number = Number(value);
    if (!Number.isFinite(number) || number === 0) return '0';
    return number.toLocaleString('en-US', { maximumFractionDigits: 8 });
}
