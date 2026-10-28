import { neon } from '@neondatabase/serverless';

const url = process.env.DATABASE_URL;
if (!url) {
    console.error('No DATABASE_URL found');
    process.exit(1);
}

const sql = neon(url);

async function run() {
    console.log('Running migration...');
    await sql`
        create table if not exists email_logs (
            id uuid primary key default gen_random_uuid(),
            to_email text not null,
            subject text not null,
            template text not null,
            metadata jsonb not null default '{}'::jsonb,
            created_at timestamptz not null default now()
        )
    `;
    console.log('email_logs created');

    await sql`
        create table if not exists verification_tokens (
            token text primary key,
            user_id uuid not null references users(id) on delete cascade,
            email text not null,
            expires_at timestamptz not null,
            created_at timestamptz not null default now()
        )
    `;
    console.log('verification_tokens created');

    await sql`
        alter table users add column if not exists email_verified boolean not null default false
    `;
    console.log('users email_verified column added');
    console.log('Migration complete!');
}

run().catch((err) => {
    console.error(err);
    process.exit(1);
});
