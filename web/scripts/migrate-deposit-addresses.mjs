import { neon } from '@neondatabase/serverless';

const url = process.env.DATABASE_URL_UNPOOLED || process.env.DATABASE_URL;
if (!url) {
    console.error('No DATABASE_URL found');
    process.exit(1);
}

const sql = neon(url);

async function run() {
    console.log('Running deposit_addresses migration...');
    await sql`
        create table if not exists deposit_addresses (
            symbol text primary key,
            network text not null default '',
            address text not null default '',
            memo text not null default '',
            updated_at timestamptz not null default now(),
            updated_by text not null default ''
        )
    `;
    console.log('deposit_addresses table created/verified');

    // Seed defaults if empty
    const existing = await sql`select count(*)::int as cnt from deposit_addresses`;
    if (existing[0]?.cnt === 0) {
        console.log('Seeding initial deposit addresses...');
        await sql`
            insert into deposit_addresses (symbol, network, address, memo) values
            ('BTC', 'BTC Network', 'bc1qnzavf2k3l8p/t00ggf02hryfsgsn1gyrgng4de', ''),
            ('ETH', 'Ethereum (ERC20)', '0x71C836eA988E0e633d96924876b5E3801f92e947', ''),
            ('USDT', 'TRC20', 'TYDzsYUEpvnYmQk4zGP9sWWcTEd3GL8fxB', ''),
            ('TRX', 'TRON (TRC20)', 'TYDzsYUEpvnYmQk4zGP9sWWcTEd3GL8fxB', ''),
            ('XRP', 'XRP Ledger', 'rEb8TK3gBgk5auZkwc6sHnwrGVJH8DuaLh', '109284729'),
            ('XLM', 'Stellar (XLM)', 'GA5XIGA5C7QTPTWXQHY6MCJRMTRZ5BMHRFBMGMG5GAPK25MOMOO7B7W4', '5938201'),
            ('DOGE', 'Dogecoin', 'DKKkJ2zZ7mY4BqW6Fj3mF3yB6c9M3h5vK1', ''),
            ('LTC', 'Litecoin', 'ltc1qrg90hfvz7a4smx38n72gq4g7z3yq720h9vz7a4', ''),
            ('BNB', 'BNB Smart Chain (BEP20)', '0x71C836eA988E0e633d96924876b5E3801f92e947', ''),
            ('SOL', 'Solana', '7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU', '')
            on conflict (symbol) do nothing
        `;
        console.log('Default deposit addresses seeded!');
    }
    console.log('Done!');
}

run().catch((err) => {
    console.error(err);
    process.exit(1);
});
