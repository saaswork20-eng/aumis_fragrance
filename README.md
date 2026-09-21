# AUMIS Fragrance — Luxury Fragrance Marketplace

A high-performance luxury fragrance e-commerce and multi-vendor marketplace platform built with **Next.js 16 (App Router)**, **React 19**, **Tailwind CSS v4**, **Auth.js v5**, and **Prisma ORM** targeting **PostgreSQL (Neon Serverless)**.

---

## Architecture & Features

### 1. User Roles & Access Control
- **BUYER:**
  - Discover artisanal perfumes, pure aged oud, and concentrated attars.
  - Interactive search, real-time category filtering, and sorting.
  - Formulation/variant selection (e.g. 12ml oil, 50ml spray, 100ml spray).
  - Client-side Cart with `localStorage` persistence and live counter.
  - Secure checkout with atomic server-side inventory deduction.
  - Buyer Dashboard (`/account/orders`) with order receipts and status tracking.
  - Direct WhatsApp consultation link for bespoke fragrance orders.
- **SELLER (Fragrance Distiller):**
  - Dedicated Seller Hub (`/seller`).
  - Real-time catalog analytics, units sold, and earnings metrics.
  - Automated low-stock alerts (< 10 units).
  - Product CRUD: add new fragrances with custom formulations, edit, activate/deactivate, delete.
  - Strict IDOR data isolation: sellers can only view and manage their own products and sales.
  - Seller Orders View (`/seller/orders`) isolating purchased items from their store.
- **ADMIN:**
  - Executive Control Portal (`/admin`).
  - Platform-wide KPI analytics (gross platform revenue, orders, catalog size, user counts).
  - Global catalog moderation (`/admin/products`): activate/deactivate or delete any product.
  - Order Fulfillment Management (`/admin/orders`): transition statuses (`PENDING`, `CONFIRMED`, `PROCESSING`, `SHIPPED`, `DELIVERED`, `CANCELLED`).
  - User & Role Management (`/admin/users`): promote users, modify roles (`BUYER`, `SELLER`, `ADMIN`), toggle account suspensions.
  - Advertisements Management (`/admin/ads`): create, schedule, and audit promotional banners.

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | Next.js 16 (App Router, Server Components & Server Actions) |
| **Frontend UI** | React 19, Tailwind CSS v4, Lucide Icons, Framer Motion |
| **Authentication** | Auth.js v5 (`next-auth@beta`) with bcrypt password hashing |
| **Database** | PostgreSQL (Neon Serverless Postgres recommended) |
| **ORM** | Prisma 6 with connection pooling |
| **Validation** | Zod 4 for server-side type-safe schemas |
| **Deployment** | Vercel (Free Tier) |

---

## Local Development Setup

### 1. Prerequisites
- **Node.js**: v18.18+ or v20+
- **npm**: v9+
- A PostgreSQL database (e.g., free tier on [Neon](https://neon.tech) or local PostgreSQL)

### 2. Installation
```bash
git clone https://github.com/saaswork20-eng/aumis_fragrance.git
cd aumis_fragrance
npm install
```

### 3. Environment Configuration
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Fill in your database URL and a random 32-character secret:
```env
DATABASE_URL="postgresql://user:password@ep-sample-123456.us-east-2.aws.neon.tech/neondb?sslmode=require"
DIRECT_URL="postgresql://user:password@ep-sample-123456.us-east-2.aws.neon.tech/neondb?sslmode=require"
NEXTAUTH_SECRET="your-32-char-random-secret"
AUTH_SECRET="your-32-char-random-secret"
NEXTAUTH_URL="http://localhost:3000"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 4. Database Migration & Seeding
Deploy database tables and populate safe idempotent demo accounts:
```bash
# Apply committed PostgreSQL migrations
npx prisma migrate deploy

# Seed the database with demo accounts and products:
npx tsx prisma/seed.ts
```

### 5. Run the Application
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Demo Accounts

The seed script creates three ready-to-test demo accounts:

| Role | Email | Password | Access Portal |
|---|---|---|---|
| **ADMIN** | `admin@aumisfragrance.com` | `DemoAdmin123!` | `/admin` |
| **SELLER** | `seller@aumisfragrance.com` | `DemoSeller123!` | `/seller` |
| **BUYER** | `buyer@aumisfragrance.com` | `DemoBuyer123!` | `/account/orders` |

*(You can override default demo passwords via `DEMO_ADMIN_PASSWORD`, `DEMO_SELLER_PASSWORD`, and `DEMO_BUYER_PASSWORD` environment variables).*

---

## Production Deployment (Vercel + Neon)

1. Push your repository to GitHub.
2. Sign in to [Vercel](https://vercel.com) and import the repository.
3. In Project Settings &rarr; Environment Variables, add:
   - `DATABASE_URL` (Pooled connection string from Neon)
   - `DIRECT_URL` (Direct connection string from Neon)
   - `AUTH_SECRET` (Generated 32-char secret)
   - `NEXTAUTH_SECRET` (Same secret)
   - `NEXTAUTH_URL` (Your Vercel deployment URL, e.g. `https://aumis-fragrance.vercel.app`)
   - `NEXT_PUBLIC_APP_URL` (Your Vercel deployment URL)
4. Deploy!
5. After deployment, apply migrations and seed the production database:
   ```bash
   DATABASE_URL="your-production-url" npx prisma migrate deploy
   DATABASE_URL="your-production-url" npx tsx prisma/seed.ts
   ```

---

## Quality & Build Verification
```bash
# Verify TypeScript typing
npx tsc --noEmit

# Run Next.js production bundle build
npm run build
```
