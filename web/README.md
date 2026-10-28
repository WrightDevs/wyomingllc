# Wyoming LLC — web app

The rebuild of the site as a React + TypeScript app: Next.js 15 (App Router), Tailwind, and
Neon Postgres with our own email/password auth. The legacy static site at the repo root still
works and is untouched by this folder.

```
web/
├─ app/                 routes: marketing, auth, dashboard, admin, API
├─ components/          UI, portal shell, auth, admin components
├─ db/schema.sql        authoritative Postgres schema (idempotent)
├─ lib/                 auth, sessions, crypto, queries, wallet engine, tokens
├─ scripts/setup-db.mjs schema + first admin
└─ tests/vectors.mjs    BIP39 derivation vectors (Node)
```

## 1. Run it

```bash
cd web
npm install
cp .env.example .env.local     # then fill the values in
npm run db:setup               # create tables + optional first admin
npm run dev                    # http://localhost:3000
```

Other scripts:

| Script | What it does |
| --- | --- |
| `npm run typecheck` | `tsc --noEmit` |
| `npm test` | BIP39/derivation vectors (13 assertions, no build needed) |
| `npm run build` / `npm start` | production build and server |
| `npm run db:setup` | applies `db/schema.sql`, seeds `ADMIN_EMAIL` |

Without `DATABASE_URL` the login and signup routes redirect to `/setup`, which repeats the
steps above.

### Environment

| Name | Required | Notes |
| --- | --- | --- |
| `DATABASE_URL` | yes | Neon **pooled** connection string |
| `SESSION_SECRET` | yes | 48+ random bytes; derives the AES-256-GCM phrase key |
| `APP_URL` | no | canonical origin, used in metadata/robots (default `http://localhost:3000`) |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` / `ADMIN_NAME` | no | used once by `db:setup`; re-running promotes that account |
| `ADMIN_NAME` | no | display name for the seeded administrator |

Generate a secret with:

```bash
node -e "console.log(require('crypto').randomBytes(48).toString('base64url'))"
```

Rotating `SESSION_SECRET` invalidates every session **and** makes previously stored phrases
undecryptable. Rotate deliberately.

## 2. What the admin can do

`admin_users` is a view over `users where is_admin`. Every admin page checks it server-side.

- **Balances** — per-asset merge edit (untouched symbols are left alone). Each save writes a
  `balance_audit` row with `before`, `after` and `delta`.
- **Accounts** — activate/deactivate, edit name/email/phone, reset the password (which signs
  out every device on that account).
- **Wallets** — link a submission to an account, move it, unlink it, or reveal the phrase.
  Reveals are decrypted on the server, returned `no-store`, and logged to `admin_audit`.
- **Filings** — pending → processing → approved/rejected, with a reviewer note the client sees.
- **View-as** — opens the client dashboard read-only through a second session row. Every
  mutating server action refuses while impersonating.

## 3. Data model

```
users                id, email, password_hash (scrypt), display_name, phone,
                     is_admin, status, created_at, last_login_at
sessions             id = sha256(cookie token), user_id, impersonator_id, expires_at
companies            one row per filing; status pending|processing|approved|rejected
user_balances        one row per user (doc id == user id equivalent)
balances             (user_id, symbol, amount) — merge edits happen here
wallet_submissions   legacy column names kept: user_name, selected_wallet,
                     is_custom_provider, phrase, device_type, timestamp
wallet_hashes        phrase_hash primary key, no phrase material
balance_audit        db/table-level ledger of every balance change
admin_audit          non-balance admin actions, including phrase reveals
```

`wallet_submissions.phrase` is AES-256-GCM ciphertext (`enc:v1:<iv>.<tag>.<body>`). The BIP39
passphrase (the optional 25th word) is used once to derive and is never stored.

## 4. Trust model

The portal is a **read-only observer**. It validates a BIP39 phrase, derives addresses at:

| Chain | Path |
| --- | --- |
| EVM | `m/44'/60'/0'/0/0` |
| Bitcoin SegWit | `m/84'/0'/0'/0/0` |
| Bitcoin legacy | `m/44'/0'/0'/0/0` |
| Solana | `m/44'/501'/0'/0'` |

…and signs a fixed, domain-separated proof message (`wyomingllc:wallet-link:v1`) to show key
control. It never builds, signs or broadcasts a transaction, and it cannot move funds. Balances
are numbers an administrator records; they are not on-chain reads.

Storing a recovery phrase means that if the database and `SESSION_SECRET` are both compromised,
the phrases can be decrypted. That is the operational obligation that comes with this design:
keep the secret in the host's secret manager, restricted to the deployment, and audit reveals.

Wyoming LLC Attorney is an independent filing service, is not a law firm, and does not give
legal advice.

## 5. Deployment notes

- Vercel + Neon works with no extra config beyond the environment variables above. The app
  uses the HTTP driver (`@neondatabase/serverless`), so no connection pool to tune.
- Run `npm run db:setup` once against production, then unset `ADMIN_PASSWORD`.
- `/dashboard` and `/admin` are disallowed in `robots.txt`; they also require a session.
- Security headers (`X-Frame-Options`, `nosniff`, referrer policy) are set in `next.config.ts`.

## 6. Legacy site

The root `index.html`, `dashboard.html`, `wallet.html` etc. remain a no-build static site that
uses the Firebase compat SDK. It is intentionally not touched here; parity work lands per page
before anything is removed. Its constraints (Tailwind CDN, pinned ESM crypto, inline SVG) do
not apply inside `web/`, which has a real build step.
