# KaamSetu

KaamSetu is a mobile-first Indian labour, construction and home services marketplace starter built with Next.js App Router, TypeScript and Tailwind CSS.

## Current implementation

- Responsive marketplace homepage, 22 service categories and category detail pages.
- Searchable sample worker directory with category, location, experience and rate filters.
- Worker public profiles, indicative rates, reviews, availability, call links and prefilled WhatsApp links.
- Customer and worker demo registration flows with validation, demo dashboards, browser-local enquiries and cancellation.
- Worker demo enquiry response actions and browser-local admin controls for sample workers, categories, locations, enquiries and review visibility.
- Admin route surfaces are browser-only controls, deliberately unavailable for live management pending real authentication and server-side role authorization.
- SEO metadata, sitemap and robots policy.
- Supabase PostgreSQL schema with relationships, indexes and Row Level Security policies.

## Demo mode and limits

With no Supabase environment values, the site explicitly labels all worker listings as sample data. Demo profile and enquiry submissions, enquiry status transitions and admin control changes are stored in the current browser's localStorage. They are not synced, delivered outside the browser, or visible to another device. The admin demo has no real authorization and must not be used with real data. Phone OTP, identity verification, photo uploads, live notifications, review submission and live database search are not configured. The sample phone numbers are illustrative; do not contact them. Do not publish this demo directory as live inventory.

## Run locally

Requirements: Node.js 18.17+ and npm.

```bash
npm install
Copy-Item .env.example .env.local
npm run dev
```

Open http://localhost:3000. Build for production using `npm run build`, then `npm start`.

## Supabase setup

1. Create a Supabase project and copy its project URL and anon/public key into `.env.local` as `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
2. Run `supabase/schema.sql` in the Supabase SQL editor.
3. Seed the 22 category records and their subcategories. The starter category catalog is in `lib/data.ts`.
4. Configure Supabase Auth phone OTP with an SMS provider before offering verified phone sign-in. Do not claim an OTP was sent until the provider confirms it.
5. Configure private storage buckets and policies for verification documents; worker work-photo uploads must use a separate bucket and never contain identity documents.
6. Add admin membership only through a trusted server-side process. Never expose the service-role key in browser code.
7. Before launch, connect each form and dashboard to server-side validated Supabase operations, implement middleware/route authorization, add rate limiting, and replace the sample directory with opt-in listings.

The Supabase helper in `lib/supabase.ts` creates a browser client only when public credentials exist. This repository does not claim database-backed workflows until those connections are implemented and verified.

## Technology

Next.js App Router, React, TypeScript, Tailwind CSS, Lucide React, React Hook Form, Zod and Supabase JS.
