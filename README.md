# bottegadakris.pl

Website and admin panel of the Bottega da Kris ceramics studio (Łódź), rewritten from the old Nx monorepo
(Vite + React frontend, Express + MySQL backend) into a single **Next.js 16** app. The UI and URLs are unchanged;
the backend now runs as Next.js route handlers on the same MySQL/MariaDB database.

## Stack

Next.js 16 (App Router) · React 19 · antd 6 · Tailwind CSS 4 · next-auth 4 · mysql2 · nodemailer · React Email · @react-pdf/renderer · Przelewy24

## Getting started

```bash
npm install
cp .env.example .env      # fill in the values (see below)
npm run dev               # http://localhost:3000
```

Local database: `docker compose up -d` starts MariaDB on port 3307. The schema is not in this repo (only the
2025-06 migration from the old project is); import a dump of production to work with real data.

For local work, put overrides in `.env.local` (also git-ignored), e.g. `DB_HOST=127.0.0.1`, `DB_PORT=3307`,
`MOCK_SMTP=true` (mail goes to a catcher on `localhost:1025`) and `MOCK_PAYMENT=true` (vouchers are marked paid
without calling Przelewy24). Never point a local run at the production database with mocks off.

| Script | |
| --- | --- |
| `npm run dev` | development server |
| `npm run build` / `npm start` | production build / server |
| `npm run lint` / `npm run typecheck` | ESLint / TypeScript |

## Environment

All credentials live in `.env` (git-ignored); `.env.example` lists every key.

| Key | Purpose |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | public origin: canonical URLs, sitemap, links in e-mails, P24 return/notification URLs |
| `DB_HOST` `DB_PORT` `DB_NAME` `DB_USER` `DB_PASSWORD` | MySQL / MariaDB |
| `SMTP_HOST` `SMTP_PORT` `SMTP_USER` `SMTP_PASSWORD` `MAIL_FROM` `MAIL_OFFICE` `MOCK_SMTP` | outgoing mail; `MAIL_OFFICE` gets a copy of every customer mail |
| `P24_MERCHANT_ID` `P24_POS_ID` `P24_CRC` `P24_API_KEY` `P24_API_URL` `MOCK_PAYMENT` | Przelewy24 (`P24_API_URL=https://sandbox.przelewy24.pl` for the sandbox) |
| `NEXTAUTH_SECRET` `NEXTAUTH_URL` | admin sessions (`openssl rand -base64 32`) |
| `UPLOAD_DIR` | where blog/gallery uploads are stored (default `./uploads`) |

## Project layout

Follows the conventions of `new.centrumszkolen.net`:

```
src/
  app/(site)/        public pages (/, /o-mnie, /warsztaty/[slug], /pracownia, /vouchery, /blog, /kontakt, /galeria, …)
  app/olimp/         admin panel: /olimp (login) and /olimp/(panel)/* (dashboard, schedule, vouchers, …)
  app/api/           public API (booking calendar, bookings, vouchers, P24, contact, files)
  app/api/olimp/     admin API (login required)
  modules/           page bodies          components/   shared UI
  hooks/             client data hooks    lib/*.inc.ts  server code (DB, mail, payments, auth)
  emails/            React Email templates
  types/             I*.ts interfaces     proxy.ts      guards /olimp/* and /api/olimp/*
```

Public data (workshop prices, blog, gallery) is cached on the server with `unstable_cache`; admin changes revalidate it
immediately (`revalidateTag`), so new posts, gallery items and prices show up without a redeploy.

## Deploying (migration from the old servers)

1. Set `.env` on the server with `NEXT_PUBLIC_SITE_URL` / `NEXTAUTH_URL` = the live domain (`https://bottegadakris.pl`
   or `https://www.bottegadakris.pl`, whichever is canonical — the old sitemap used `www`).
2. `npm ci && npm run build && npm start` (Node ≥ 20.9). The database needs no migration.
3. Copy the old backend's `uploads/` folder into `UPLOAD_DIR` — stored blog/gallery links (`/files/…`) keep working.
4. Point `system.bottegadakris.pl` at the new app as well (or redirect it). E-mails already sent link to
   `system.bottegadakris.pl/api/trainings/cancel/<uuid>` and `/assets/logo.png`, and Przelewy24 transactions started
   on the old system notify `system.bottegadakris.pl/api/payment/status`; the new app serves all three paths.
5. Admin logins and passwords are unchanged (same `uzytkownicy` table).

## Changes compared with the old system

- On-site workshop booking (calendar) and gift-voucher purchase with Przelewy24 are enabled again (they were switched off in favour of reservio).
- Security: all SQL is parameterized; the admin API requires login (it was public); credentials moved from source code to `.env`;
  voucher codes are no longer readable by numeric id; P24 notifications must match the purchase and are idempotent; uploads
  cannot be read outside the upload folder; contact mail input is HTML-escaped.
- Fixes: voucher usage was stored as concatenated strings; cancelling a booking restored too much voucher value and could be
  repeated; group workshop price was multiplied by persons; overlapping bookings were only checked at their first hour;
  partly used vouchers were missing from the admin list; the payment report's first load was always empty; blog status could
  not be changed on edit; broken links to `/about-me`, `/studio`, `/contact`; payment-status polling stacked timers.
- Blog and gallery render on the server (crawlable), images are served optimized, the sitemap includes blog posts.
- Voucher PDF is rendered with `@react-pdf/renderer` (embedded Poppins for Polish letters) instead of `html-pdf`/PhantomJS.
- Not ported: the unused `POST /api/login/password` endpoint (no screen called it).
