# bottegadakris.pl

Website and admin panel of the Bottega da Kris ceramics studio (Łódź), rewritten from the old Nx monorepo
(Vite + React frontend, Express + MySQL backend) into a single **Next.js 16** app. The UI and URLs are unchanged;
the backend now runs as Next.js route handlers on the same MySQL/MariaDB database.

## Stack

Next.js 16 (App Router) · React 19 · antd 6 · Tailwind CSS 4 · next-auth 4 · mysql2 · nodemailer · React Email · @react-pdf/renderer · Przelewy24

## Running the app locally

You need no real credentials for this: the database runs in Docker, e-mails go to a local test inbox, and
payments are simulated.

### 1. Install the tools

- [Node.js](https://nodejs.org) **20.9 or newer** (check with `node -v`)
- [Docker Desktop](https://www.docker.com/products/docker-desktop/), started and running (check with `docker info`)
- Git

### 2. Get the code and install packages

```bash
git clone <repository-url> bottegadakris
cd bottegadakris
npm install
```

### 3. Start the database and the test mailbox

```bash
docker compose up -d
```

This starts two containers:

| Container | Address | What it is |
| --- | --- | --- |
| MariaDB 10.11 | `127.0.0.1:3307` (user `root`, password `admin`) | the database |
| Mailpit | <http://localhost:8025> | test inbox; every e-mail the app sends shows up here |

On the **first** start MariaDB creates the tables (`db/init/01-schema.sql`) and the starting data
(`db/init/02-seed.sql`):

- the admin account **`admin` / `admin`**
- the six workshops with their prices, durations and group limits (ids 1–6, used by the workshop pages)
- opening hours: Mon–Fri 10:00–20:00, Sat 10:00–16:00, Sunday closed

Blog posts, gallery items, customers, bookings and vouchers start empty; you add them through the site and the admin panel.

### 4. Create the environment file

Create a file named `.env.local` in the project root (it is git-ignored) with this content:

```ini
NEXT_PUBLIC_SITE_URL=http://localhost:3000

DB_HOST=127.0.0.1
DB_PORT=3307
DB_NAME=siegeventure_bottegadakris
DB_USER=root
DB_PASSWORD=admin

MAIL_FROM="Bottega da Kris" <biuro@bottegadakris.pl>
MAIL_OFFICE=biuro@bottegadakris.pl
MOCK_SMTP=true

MOCK_PAYMENT=true

NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=any-long-random-text-for-local-use
```

- `MOCK_SMTP=true` sends e-mails to Mailpit instead of a real mail server.
- `MOCK_PAYMENT=true` marks bookings and vouchers as paid at once, without opening Przelewy24.

### 5. Run the app

```bash
npm run dev
```

| Address | Page |
| --- | --- |
| <http://localhost:3000> | public website |
| <http://localhost:3000/olimp> | admin panel; log in with `admin` / `admin` |
| <http://localhost:8025> | e-mails sent by the app |

To try the whole flow: book a workshop or buy a voucher on the website, check the confirmation e-mail (with the
voucher PDF) in Mailpit, then find the booking under *Grafik* or the voucher under *Vouchery* in the admin panel.

### Stopping and resetting

```bash
docker compose down        # stop the containers; the data is kept
docker compose down -v     # stop and delete the data; the next "up" recreates the tables and the starting data
```

The `db/init` scripts only run when the database is empty. If you edit them, or the admin login fails because the
database was created before they existed, reset with `docker compose down -v` and start again.

### Common problems

| Problem | Fix |
| --- | --- |
| `docker: error during connect … docker_engine` | Docker Desktop is not running. Start it and wait until it says *Engine running*. |
| Port `3307`, `1025` or `8025` already in use | Stop the other program, or change the left-hand port in `docker-compose.yml` (and `DB_PORT` to match). |
| Login says the user or password is wrong | The database was created before the seed existed. Run `docker compose down -v`, then `docker compose up -d`. |
| `ECONNREFUSED 127.0.0.1:3307` | The database is still starting. Wait a few seconds, or check `docker compose logs bottegadakris_mysql`. |

### Scripts

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
