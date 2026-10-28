#!/usr/bin/env node
/**
 * Apply db/schema.sql to the configured Neon database and optionally seed the
 * first administrator.
 *
 *   npm run db:setup
 *
 * Reads DATABASE_URL_UNPOOLED (preferred) or DATABASE_URL, plus ADMIN_EMAIL,
 * ADMIN_PASSWORD and ADMIN_NAME from the environment. `npm run db:setup`
 * already loads .env.local when it exists.
 *
 * DDL runs over the direct endpoint on purpose: the pooled PgBouncer connection
 * can hand a backend over between statements, which breaks session state and
 * multi-statement migrations. See the Neon `neon-postgres` skill.
 *
 * Safe to re-run: every statement in the schema is idempotent.
 */
import { readFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { randomBytes, scrypt } from 'node:crypto';

const here = dirname(fileURLToPath(import.meta.url));
const schemaPath = resolve(here, '..', 'db', 'schema.sql');

function fail(message) {
    console.error('\n✖ ' + message + '\n');
    process.exit(1);
}

const pooled = (process.env.DATABASE_URL || '').trim();
const databaseUrl = (process.env.DATABASE_URL_UNPOOLED || pooled).trim();
if (!databaseUrl || databaseUrl.includes('user:password@')) {
    fail(
        'DATABASE_URL is not set. Copy web/.env.example to web/.env.local and paste the Neon connection string, or run `neon env pull`.'
    );
}
if (databaseUrl === pooled && databaseUrl.includes('-pooler.')) {
    console.warn(
        '\n! Only a pooled DATABASE_URL was found. Schema DDL is safer over the direct URL.\n'
    );
}

let neon;
try {
    ({ neon } = await import('@neondatabase/serverless'));
} catch {
    fail('@neondatabase/serverless is not installed. Run `npm install` in web/ first.');
}

const sql = neon(databaseUrl);

/** Split the schema into single statements. The file has no dollar-quoting. */
function statements(source) {
    return source
        .split(/;\s*(?:\r?\n|$)/)
        .map((chunk) => chunk.replace(/^\s*--.*$/gm, '').trim())
        .filter(Boolean);
}

function hashPassword(password) {
    const N = 16384;
    const r = 8;
    const p = 1;
    const salt = randomBytes(16).toString('base64url');
    return new Promise((resolvePromise, reject) => {
        scrypt(password.normalize('NFKC'), salt, 64, { N, r, p, maxmem: 64 * 1024 * 1024 }, (error, key) => {
            if (error) reject(error);
            else
                resolvePromise(
                    ['scrypt', N, r, p, salt, key.toString('base64url')].join('$')
                );
        });
    });
}

console.log('→ Applying db/schema.sql');

const source = await readFile(schemaPath, 'utf8');
const batch = statements(source);

for (const [index, statement] of batch.entries()) {
    const label = statement.split(/\s+/).slice(0, 3).join(' ').replace(/\($/, '');
    try {
        await sql.query(statement);
        process.stdout.write(`  ${String(index + 1).padStart(2, '0')}  ${label}\n`);
    } catch (error) {
        fail(`Statement ${index + 1} (${label}) failed: ${error.message}`);
    }
}

console.log(`\n✔ Schema applied (${batch.length} statements).`);

const adminEmail = (process.env.ADMIN_EMAIL || '').trim().toLowerCase();
const adminPassword = process.env.ADMIN_PASSWORD || '';
const adminName = (process.env.ADMIN_NAME || 'Console Admin').trim();

if (!adminEmail && !adminPassword) {
    console.log('\nNo ADMIN_EMAIL / ADMIN_PASSWORD set — skipping the administrator seed.');
    console.log('Set both in web/.env.local and re-run `npm run db:setup` to create one.\n');
    process.exit(0);
}

if (!adminEmail || !adminPassword) {
    fail('Set both ADMIN_EMAIL and ADMIN_PASSWORD, or neither.');
}
if (adminPassword.length < 8) {
    fail('ADMIN_PASSWORD must be at least 8 characters.');
}

try {
    const existing = await sql.query('select id, is_admin from users where lower(email) = $1 limit 1', [adminEmail]);

    if (existing.length > 0) {
        const id = existing[0].id;
        await sql.query('update users set is_admin = true, status = $2, display_name = coalesce(nullif(display_name, $3), $3) where id = $1', [
            id,
            'active',
            adminName
        ]);
        await sql.query(
            'insert into user_balances (user_id, display_name, user_email) values ($1, $2, $3) on conflict (user_id) do nothing',
            [id, adminName, adminEmail]
        );
        console.log(`✔ Promoted existing account ${adminEmail} to administrator.`);
    } else {
        const passwordHash = await hashPassword(adminPassword);
        const rows = await sql.query(
            'insert into users (email, password_hash, display_name, is_admin) values ($1, $2, $3, true) returning id',
            [adminEmail, passwordHash, adminName]
        );
        const id = rows[0]?.id;
        if (!id) fail('The administrator account could not be created.');
        await sql.query(
            'insert into user_balances (user_id, display_name, user_email) values ($1, $2, $3) on conflict (user_id) do nothing',
            [id, adminName, adminEmail]
        );
        console.log(`✔ Created administrator ${adminEmail}.`);
    }
} catch (error) {
    fail('Administrator seed failed: ' + error.message);
}

console.log('\nDone. Start the app with `npm run dev` and sign in at /login.\n');
process.exit(0);
