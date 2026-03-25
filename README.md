# MedFlow — Healthcare Management Platform

Platform manajemen klinik all-in-one untuk fasilitas kesehatan di Indonesia. Dibangun dengan Next.js 14, Supabase, dan modern UI components.

## Tech Stack

- **Frontend:** Next.js 14 (App Router), TypeScript, Tailwind CSS, shadcn/ui, Framer Motion
- **State:** Zustand (UI state), TanStack Query (server state)
- **Forms:** React Hook Form + Zod validation
- **Charts:** Recharts + D3.js
- **Database:** Supabase (PostgreSQL) with RLS
- **Auth:** Supabase Auth
- **Realtime:** Supabase Realtime (notifications)

## Getting Started

### Prerequisites

- Node.js 18+
- Supabase project (free tier works)

### Setup

1. Clone the repository

2. Install dependencies:
```bash
npm install
```

3. Create `.env.local` from the example:
```bash
cp .env.example .env.local
```

4. Fill in your Supabase credentials in `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

5. Run Supabase migrations:
   - Go to your Supabase dashboard > SQL Editor
   - Run each migration file in order from `supabase/migrations/`
   - Optionally run `supabase/seed.sql` for demo data

6. Start the development server:
```bash
npm run dev
```

7. Open [http://localhost:3000](http://localhost:3000)

## Features

- **Multi-role Dashboard** — Different views for clinic owner, doctor, nurse, receptionist, pharmacist
- **Patient Management** — Full CRUD with search, filter, and patient detail pages
- **Appointment Calendar** — Weekly/daily views with status workflow
- **Electronic Medical Records** — SOAP format with vital signs, ICD-10 codes
- **Prescription & Pharmacy** — Create prescriptions, dispense medications, track stock
- **Medication Inventory** — Stock tracking with low-stock alerts
- **Billing & Invoices** — Create invoices, track payments, multiple payment methods
- **Analytics Dashboard** — Revenue trends, patient demographics, top diagnoses
- **Notification System** — Real-time notifications via Supabase Realtime
- **Command Palette** — Quick search and navigation (Ctrl+K)
- **Dark Mode** — Full dark mode support
- **Responsive** — Mobile-first, works on tablet and desktop
- **Row Level Security** — Multi-layer RLS policies for data isolation
- **Audit Logging** — Automatic audit trail for all data changes

## Project Structure

```
├── app/                    # Next.js App Router pages
│   ├── (auth)/            # Login, forgot password
│   ├── (dashboard)/       # All dashboard pages
│   └── (onboarding)/     # First-time setup wizard
├── components/
│   ├── ui/               # shadcn/ui base components
│   ├── layout/           # Sidebar, Topbar, CommandPalette
│   ├── dashboard/        # Role-specific dashboard views
│   └── common/           # DataTable, StatusBadge
├── hooks/                # React Query hooks
├── stores/               # Zustand stores
├── lib/                  # Supabase client, utils, validations
├── types/                # TypeScript type definitions
└── supabase/
    ├── migrations/       # SQL migration files
    └── seed.sql          # Demo data
```

## Database

The database includes 12 tables with full RLS policies:
- `clinics`, `users`, `patients`, `appointments`
- `medical_records`, `prescriptions`, `prescription_items`
- `medications`, `invoices`, `invoice_items`
- `audit_logs`, `notifications`

See `supabase/migrations/` for complete schema.

## Deployment

Deploy to Vercel:

```bash
npm run build
```

Set environment variables in Vercel dashboard, then deploy.

## License

Private — All rights reserved.
