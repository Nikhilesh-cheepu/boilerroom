# Boiler Room — club site

Next.js (App Router) marketing site: Netflix-style horizontal rows for events and DJs, food and drink menus, FAQs, hero video, and a sticky bottom bar for **Book a table** (WhatsApp) and **Contact** (call, WhatsApp, Instagram, maps + address).

## Setup

```bash
npm install
cp .env.example .env.local
```

Edit `.env.local` (see [`.env.example`](.env.example)):

- `DATABASE_PUBLIC_URL` — Postgres public proxy URL (for local dev from your laptop).
- `DATABASE_URL` — primary Postgres URL (often internal/private in production).
- `ADMIN_PASSWORD` — only field needed to sign in to `/admin` (e.g. `9550`). Session cookies are signed with a key derived from this password unless you set `ADMIN_SESSION_SECRET` (16+ chars).
- `BLOB_READ_WRITE_TOKEN` — Vercel Blob read/write token for **hero video** uploads (server-only).
- `NEXT_PUBLIC_*` — phone, WhatsApp, Instagram, maps, address (see table below).
- `EVENTS_API_BASE_URL` — server-only Bassik Lineup API (not `NEXT_PUBLIC_*`).
- `EVENTS_API_FETCH_TIMEOUT_MS` — optional (default `4000`).

Create the database and seed demo content (from [lib/content/site.ts](lib/content/site.ts)):

```bash
npm run db:push
npm run db:seed
```

Run the app:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Admin: [http://localhost:3000/admin/login](http://localhost:3000/admin/login).

## Logo

Place your mark at [public/boilerroom-logo.png](public/boilerroom-logo.png) (the header uses this path).

## Lineup (Bassik API)

The homepage **Lineup** block (`#events`) loads offers from `{EVENTS_API_BASE_URL}/api/venues/boiler-room` with `fetch` caching (`revalidate: 30`) and a configurable timeout. Responses may be shaped as `{ offers }` or `{ venue: { offers } }`. If the base URL is unset, the section shows setup instructions for developers.

## Admin panel

After logging in, you can:

- **Hero & copy** — edit headline/subcopy and **upload a hero video** to **Vercel Blob** (MP4, WebM, MOV, max 100MB). The public site stores the blob HTTPS URL in Postgres.
- **Events, DJs, Menu, FAQ, Weekly** — add/remove rows (editing existing rows is delete + re-add for now).

## Database

The app uses **PostgreSQL** ([`prisma/schema.prisma`](prisma/schema.prisma)). Runtime selects the DB URL like this:

- local dev: prefer `DATABASE_PUBLIC_URL` (reachable from laptop)
- production: use `DATABASE_URL` (can be internal/private)

For Prisma CLI commands (`db:push`, `db:seed`, `db:studio`) run with public URL locally:

```bash
DATABASE_URL="$DATABASE_PUBLIC_URL" npm run db:push
DATABASE_URL="$DATABASE_PUBLIC_URL" npm run db:seed
DATABASE_URL="$DATABASE_PUBLIC_URL" npm run db:studio
```

## Environment variables

| Variable | Purpose |
| --- | --- |
| `DATABASE_PUBLIC_URL` | Public Postgres URL used by app runtime in local dev. |
| `DATABASE_URL` | Primary Postgres URL used by app runtime in production and by Prisma CLI. |
| `ADMIN_PASSWORD` | Plain password for `/admin` (keep private). |
| `ADMIN_SESSION_SECRET` | Optional. If set (16+ chars), used to sign admin JWT instead of deriving from `ADMIN_PASSWORD`. |
| `BLOB_READ_WRITE_TOKEN` | Vercel Blob — hero video uploads from `/admin/settings`. |
| `EVENTS_API_BASE_URL` | Server-only. Bassik API origin (no trailing slash required); `GET …/api/venues/boiler-room`. |
| `EVENTS_API_FETCH_TIMEOUT_MS` | Optional. Abort slow Lineup fetches (default `4000`). |
| `NEXT_PUBLIC_PHONE_E164` | Digits only (country code, no `+`). Powers `tel:` and `wa.me`. |
| `NEXT_PUBLIC_WHATSAPP_MESSAGE_BOOKING` | Prefilled text for “Book a table”. |
| `NEXT_PUBLIC_INSTAGRAM_URL` | Instagram profile URL in the contact sheet. |
| `NEXT_PUBLIC_MAPS_URL` | Opens from Location rows. |
| `NEXT_PUBLIC_ADDRESS_LINE` | One-line address in the UI and contact sheet. |

Public `NEXT_PUBLIC_*` values fall back in [lib/env.ts](lib/env.ts) if unset.

## Scripts

| Script | Description |
| --- | --- |
| `npm run dev` | Development server |
| `npm run build` | `prisma generate` + production build |
| `npm run start` | Serve production build |
| `npm run lint` | ESLint |
| `npm run db:push` | Push schema to the database (dev) |
| `npm run db:seed` | Seed default content |
| `npm run db:studio` | Prisma Studio |

## Motion

[Framer Motion](https://www.framer.com/motion/) with `useReducedMotion()`; smooth scrolling is reduced when `prefers-reduced-motion` is set ([app/globals.css](app/globals.css)).

## Stack

Next.js 16, React 19, Tailwind CSS 4, Prisma (PostgreSQL), [@vercel/blob](https://vercel.com/docs/storage/vercel-blob), Framer Motion, [Vaul](https://github.com/emilkowalski/vaul), [jose](https://github.com/panva/jose) (admin session).
