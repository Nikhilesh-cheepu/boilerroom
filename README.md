# Boiler Room — club site

Next.js (App Router) marketing site: Netflix-style horizontal rows for events and DJs, food and drink menus, FAQs, hero video, and a sticky bottom bar for **Book a table** (WhatsApp) and **Contact** (call, WhatsApp, Instagram, maps + address).

## Setup

```bash
npm install
cp .env.example .env.local
```

Edit `.env.local`:

- `DATABASE_URL` — SQLite path (default `file:./prisma/dev.db`) for local dev.
- `ADMIN_PASSWORD` — password for `/admin` (min 8 characters).
- `ADMIN_SESSION_SECRET` — long random string (min 16 characters) to sign admin cookies.
- `NEXT_PUBLIC_*` — phone, WhatsApp message, Instagram, maps, address (see table below).

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

## Admin panel

After logging in, you can:

- **Hero & copy** — edit headline/subcopy and **upload a hero video** (MP4, WebM, or MOV, max 100MB). Video is stored under `public/uploads/hero/` and served from `/uploads/hero/...`.
- **Events, DJs, Menu, FAQ, Weekly** — add/remove rows (editing existing rows is delete + re-add for now).

## Database

- **SQLite** by default (`prisma/dev.db`), ideal for local development and small single-server deploys.
- For **serverless** platforms (e.g. Vercel), SQLite on the filesystem is not durable; switch the datasource in [prisma/schema.prisma](prisma/schema.prisma) to **PostgreSQL** (e.g. Neon, Supabase) and set `DATABASE_URL` accordingly.

## Environment variables

| Variable | Purpose |
| --- | --- |
| `DATABASE_URL` | Prisma connection string (SQLite file or Postgres URL). |
| `ADMIN_PASSWORD` | Plain password for `/admin` login (keep private). |
| `ADMIN_SESSION_SECRET` | HMAC secret for admin session JWT (min 16 chars). |
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

Next.js 16, React 19, Tailwind CSS 4, Prisma (SQLite by default), Framer Motion, [Vaul](https://github.com/emilkowalski/vaul), [jose](https://github.com/panva/jose) (admin session).
