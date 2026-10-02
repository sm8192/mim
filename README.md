This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Authentication

This app includes username/password authentication backed by Neon Postgres.

- **Pages:** `/signup`, `/login`, and a protected `/dashboard`.
- **Server Actions** (`src/app/actions/auth.ts`) handle signup, login, and logout.
- **Sessions** are stateless, signed JWTs stored in an `httpOnly` cookie (`src/lib/session.ts`), set and cleared via `src/lib/session-cookie.ts`.
- **Route protection** uses an optimistic cookie check in `src/proxy.ts` plus a secure check in the Data Access Layer (`src/lib/dal.ts`) at the data source.
- Passwords are hashed with `bcryptjs`; inputs are validated with `zod`.

### Environment variables

Copy `.env.example` to `.env.local` and fill in both values:

```bash
# Neon Postgres connection string (use the pooled connection string).
DATABASE_URL=

# Secret used to sign session cookies. Generate one with:
#   node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
SESSION_SECRET=
```

Because Neon is already connected to the Vercel deployment, you can pull the
production values locally with the Vercel CLI:

```bash
vercel env pull .env.local
```

`DATABASE_URL` is provided by the Neon integration on Vercel. Still set your own
`SESSION_SECRET` there (Project Settings → Environment Variables) if it isn't
already present.

### Database setup

Create the `users` table by running `db/schema.sql` against your Neon database.
You can paste it into the Neon SQL Editor, or use `psql`:

```bash
psql "$DATABASE_URL" -f db/schema.sql
```

## Getting Started

First, set up your environment variables and database (see
[Authentication](#authentication) above), then run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
