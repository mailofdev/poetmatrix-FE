# PoetMatrix

Next.js 16 app for the PoetMatrix reading room and writing desk. It keeps the Geist type and the light/dark zinc palette from the starter, and talks to the NestJS API through server actions. Access and refresh tokens stay in httpOnly cookies. `API_URL` is server-only and is not exposed to the browser.

## Layout

- `app` — routes, including auth pages and the protected library, writer, and account sections
- `proxy.ts` — optimistic redirect when a protected route has no session cookie. The API still enforces access.
- `components` — header, forms, and fields
- `lib/api` — typed backend client
- `lib/auth` — cookie session, server actions, and redirect checks
- `lib/validation` — Zod schemas for forms

Protected screens are `/library`, `/write`, and `/account`. A reader who opens `/write` sees an explanation instead of the editor. Drafts and mutations are still rejected by the API when the role does not allow them.

## Setup

```bash
npm install
cp .env.example .env.local
npm run dev
```

The app runs at [http://localhost:3000](http://localhost:3000) and expects the API at `http://localhost:4000`.

## Scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
npm run typecheck
npm test
```
