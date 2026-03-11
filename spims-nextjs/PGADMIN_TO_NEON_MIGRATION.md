# Migrate from pgAdmin to Neon – Step-by-Step Guide

Use this guide to switch your SPIMS project from pgAdmin to Neon so **public**, **admin**, and **enterprise** logins work in deployment.

---

## Overview

| Login Type   | Route                     | Database Requirements                                   |
|-------------|---------------------------|--------------------------------------------------------|
| **Public**  | `/api/auth/login`         | `users` table (basic columns)                         |
| **Admin**   | `/api/admin/auth/login`   | `users` with `role='admin'` + admin user record       |
| **Enterprise** | `/api/enterprise/auth/login` | `users` + `enterprises` + `approval_status`, `enterprise_id` on users |

---

## Step 1: Create Neon Project

1. Go to **[console.neon.tech](https://console.neon.tech)** and sign in.
2. Click **New Project**.
3. Set project name (e.g. `spims`) and region.
4. Click **Create Project**.
5. Copy the **connection string** (use the **Pooler** one, with `-pooler` in the host).

---

## Step 2: Update database.ts (Already Done)

The `src/lib/database.ts` file now uses `DATABASE_URL` when set, so Neon connections work in deployment.

---

## Step 3: Set Environment Variables

### Local (.env)

In `spims-nextjs/.env`:

```env
# Neon – used when set (for deployment or local Neon testing)
DATABASE_URL=postgresql://USER:PASSWORD@HOST-POOLER.REGION.aws.neon.tech/neondb?sslmode=require

# For deployment, also set:
JWT_SECRET=your-secure-jwt-secret
NODE_ENV=production
```

When `DATABASE_URL` is set, the app uses Neon instead of pgAdmin.

### Deployment (Vercel / Railway / Render / etc.)

Add these environment variables in your hosting dashboard:

| Variable      | Value                          |
|---------------|---------------------------------|
| `DATABASE_URL` | Your Neon connection string    |
| `JWT_SECRET`   | Same as in .env or a new secret |

---

## Step 4: Run Neon Database Setup

From the project root:

```bash
cd spims-nextjs
npm install
npm run db:setup:neon
```

This script will:

- Create tables: `users`, `enterprises`, `complaints`, `status_updates`, `notifications`, `enterprise_workers`, `complaint_assignments`
- Add `approval_status`, `enterprise_id` (and related) to `users`
- Seed 3 sample enterprises
- Create admin user: **admin@spims.gov** / **admin123**

---

## Step 5: Verify Admin & Enterprise Setup

### Admin Login

- Email: `admin@spims.gov`
- Password: `admin123`
- URL: `/admin/auth/login`

### Enterprise Login

1. An enterprise user must first **register** at `/enterprise/auth/register`.
2. An admin must approve the enterprise in the admin dashboard.
3. After approval, the enterprise user can log in at `/enterprise/auth/login`.

---

## Step 6: Deploy Your App

1. Ensure `DATABASE_URL` and `JWT_SECRET` are set in your deployment environment.
2. Commit and push your code (including the updated `database.ts`).
3. Deploy.

---

## Step 7: Test After Deployment

| Test               | URL                    | Credentials                            |
|--------------------|------------------------|----------------------------------------|
| Public login       | `/users-dashboard/auth/login` | Your registered public user          |
| Admin login        | `/admin/auth/login`    | admin@spims.gov / admin123             |
| Enterprise login   | `/enterprise/auth/login` | After registration + admin approval  |

---

## Troubleshooting

| Issue                    | What to check                                                        |
|--------------------------|---------------------------------------------------------------------|
| Admin login fails         | 1. Run `npm run db:setup:neon` so the admin user exists.            |
|                          | 2. Verify `DATABASE_URL` is set in the deployment environment.     |
| Enterprise login fails   | 1. Ensure `approval_status` and `enterprise_id` exist on `users`.   |
|                          | 2. Enterprise user must be approved by admin.                      |
| DB connection errors     | Use the Neon **pooler** connection string, not the direct one.     |
| "column does not exist"  | Run `npm run db:setup:neon` again to apply schema updates.         |

---

## Summary Checklist

- [ ] Neon project created
- [ ] `DATABASE_URL` in `.env` (local)
- [ ] `DATABASE_URL` and `JWT_SECRET` in deployment env vars
- [ ] `npm run db:setup:neon` executed
- [ ] Code pushed and app redeployed
- [ ] Admin login works (admin@spims.gov / admin123)
- [ ] Enterprise login works after registration and approval
