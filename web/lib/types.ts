export type UserStatus = 'active' | 'inactive';
export type CompanyStatus = 'pending' | 'processing' | 'approved' | 'rejected';
export type LinkMethod = 'auto' | 'manual' | 'anon';

export type Company = {
    id: string;
    user_id: string;
    company_name: string;
    entity_type: string;
    formation_state: string;
    business_ending: string;
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    address: string;
    unit: string;
    city: string;
    country: string;
    postal_code: string;
    partner_code: string;
    status: CompanyStatus;
    review_note: string;
    reviewed_by: string;
    reviewed_at: string | null;
    created_at: string;
};

export type WalletAddresses = {
    evm?: string;
    btc?: string;
    btcSegwit?: string;
    btcLegacy?: string;
    sol?: string;
};

export type WalletSubmission = {
    id: string;
    user_id: string | null;
    user_email: string;
    user_name: string;
    selected_wallet: string;
    provider: string;
    is_custom_provider: boolean;
    device_type: string;
    word_count: number;
    valid: boolean;
    checksum_verified: boolean;
    derivation_paths: Record<string, string>;
    addresses: WalletAddresses;
    primary_address: string;
    proof_of_key: string;
    proof_recovered: boolean;
    phrase_hash: string;
    link_method: LinkMethod;
    source: string;
    created_at: string;
    linked_at: string | null;
    linked_by: string;
};

export type BalanceMap = Record<string, number>;

export type AdminUserRow = {
    id: string;
    email: string;
    display_name: string;
    is_admin: boolean;
    status: UserStatus;
    created_at: string;
    last_login_at: string | null;
    company_count: number;
    wallet_count: number;
    symbols: number;
};

export type AuditRow = {
    id: number;
    before: BalanceMap;
    after: BalanceMap;
    delta: BalanceMap;
    by: string;
    at: string;
    note: string;
};
