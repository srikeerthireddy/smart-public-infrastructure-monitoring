# SPIMS Next.js App

Next.js frontend and API for the **Smart Public Infrastructure Monitoring System**.

For full project documentation, setup, and deployment, see the [root README](../README.md).

## Quick start

```bash
npm install
# Add .env.local with DB_*, JWT_SECRET or DATABASE_URL
npm run db:setup        # or db:setup:neon for Neon
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

- `npm run dev` — Development server
- `npm run build` — Production build
- `npm run start` — Production server
- `npm run db:setup` — Setup database (local)
- `npm run db:setup:neon` — Setup database (Neon)
