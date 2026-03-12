# SPIMS — Smart Public Infrastructure Monitoring System

A full-stack web application for reporting, tracking, and managing public infrastructure complaints. Citizens can report issues (potholes, streetlights, water problems, etc.), enterprises handle resolution, and admins oversee the system.

---

## Features

### For Public Users
- Register and log in
- Submit complaints with location, photos, and category
- View complaint status and history
- Track complaints on an interactive map
- View analytics and statistics

### For Enterprise Users
- Register enterprise and get admin approval
- Manage assigned complaints
- Update complaint status (reported → in progress → resolved)
- View dashboard and workload

### For Admins
- Manage system users and enterprises
- Approve or reject enterprise registrations
- Assign complaints to enterprises
- View system analytics and reports
- Monitor complaints, users, and activity

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 16, React 19, Tailwind CSS 4 |
| Backend | Next.js API Routes (App Router) |
| Database | PostgreSQL |
| Auth | JWT (HTTP-only cookies) |
| Maps | Leaflet, React-Leaflet |
| Forms | React Hook Form, Yup |

---

## Project Structure

```
smart-public-infrastructure-monitoring/
├── spims-nextjs/                 # Main Next.js application
│   ├── src/
│   │   ├── app/                  # App Router pages & API routes
│   │   │   ├── page.tsx          # Home / landing page
│   │   │   ├── admin/            # Admin dashboard, login, settings
│   │   │   ├── enterprise/       # Enterprise dashboard, auth
│   │   │   ├── users-dashboard/ # Public user dashboard
│   │   │   └── api/             # API routes
│   │   ├── components/
│   │   ├── lib/                  # Database, helpers
│   │   └── contexts/
│   ├── database/                 # Schema, migrations, seeds
│   ├── scripts/                  # DB setup, migrations, fixes
│   └── package.json
└── README.md                     # This file
```

---

## Prerequisites

- **Node.js** 18+
- **PostgreSQL** 12+
- **npm** or **yarn**

---

## Quick Start

### 1. Clone and install

```bash
cd smart-public-infrastructure-monitoring/spims-nextjs
npm install
```

### 2. Environment variables

Create `.env.local` in `spims-nextjs/`:

```env
# Database (local PostgreSQL)
DB_HOST=localhost
DB_PORT=5432
DB_NAME=spims_db
DB_USER=spims_user
DB_PASSWORD=your_secure_password

# Or use Neon/Vercel: DATABASE_URL=postgresql://...

# JWT for authentication (required)
JWT_SECRET=your-secret-key-at-least-32-chars
```

### 3. Database setup

**Option A: Local PostgreSQL**

```bash
cd spims-nextjs

# Create database and user, run schema
npm run db:setup
```

**Option B: Neon (cloud)**

```bash
# Add DATABASE_URL to .env.local from console.neon.tech
npm run db:setup:neon
```

### 4. Run the app

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run db:setup` | Setup database (local PostgreSQL) |
| `npm run db:setup:neon` | Setup database (Neon) |
| `npm run db:fix-admin-email` | Fix admin email typo |
| `npm run db:reset-admin-password` | Reset admin password |
| `npm run db:fix-assign-fk` | Fix complaint assignments foreign key |

---

## Routes Overview

| Path | Description |
|------|-------------|
| `/` | Home page / landing |
| `/admin/auth/login` | Admin login |
| `/admin/dashboard` | Admin dashboard |
| `/enterprise/auth/login` | Enterprise login |
| `/enterprise/auth/register` | Enterprise registration |
| `/enterprise/dashboard` | Enterprise dashboard |
| `/users-dashboard/auth/login` | Public user login |
| `/users-dashboard/auth/register` | Public user registration |
| `/users-dashboard` | Public user dashboard |
| `/users-dashboard/complaints/map` | Complaints map view |
| `/users-dashboard/complaints/new` | Submit new complaint |

---

## Default Admin Credentials

After running `db:setup` with seed data:

- **Email:** `admin@spims.gov`
- **Password:** Set via seed or `npm run db:reset-admin-password`

---

## Database

See `spims-nextjs/database/README.md` for:

- Schema overview
- Tables and relationships
- Migrations
- Useful queries

---

## Deployment

### Vercel + Neon

1. Create a Neon project and copy `DATABASE_URL`
2. Deploy to Vercel and add env vars: `DATABASE_URL`, `JWT_SECRET`
3. Run `npm run db:setup:neon` if needed for schema

### Docker / self-hosted

1. Run PostgreSQL and set `DB_*` or `DATABASE_URL`
2. Run `npm run db:setup` or migrations manually
3. Build and run: `npm run build && npm run start`

---

## License

Private / Internal use.
