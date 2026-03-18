# Welcome to your Lovable project

## AI Landing Generator Setup

### Environment variables

Create a `.env` file based on `.env.example`:

```bash
OPENAI_API_KEY=your_key_here
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_APP_URL=http://localhost:8080
NEXT_PUBLIC_STRIPE_PRO_PRICE_ID=price_xxx
STRIPE_SECRET_KEY=sk_live_or_test_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx
SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

`OPENAI_API_KEY` is server-side only and used by the API route.

`VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are used by the dashboard frontend to authenticate users and persist:

- plan/usage state via `profiles` and `usage_daily`
- generated landing page projects via `projects`

Stripe integration uses server-side routes and helpers:

- Checkout route: `api/stripe/checkout.ts`
- Webhook route: `api/stripe/webhook.ts`
- Stripe helper: `lib/stripe/stripe.ts`
- Webhook sync logic: `lib/stripe/handleWebhook.ts`

Do not expose `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, or `SUPABASE_SERVICE_ROLE_KEY` in frontend code.

### Auth flow

- Route `/auth` uses Supabase magic link authentication.
- Route `/dashboard` is protected and redirects unauthenticated users to `/auth`.
- Configure your Supabase Auth redirect URLs to include your app URL (for local dev: `http://localhost:8080/dashboard`).

### API route

This project exposes a server endpoint at `/api/generate-landing`.

- Route file: `api/generate-landing.ts`
- OpenAI helper: `lib/ai/openai.ts`
- Frontend caller: `src/lib/generator/generateLandingPage.ts`

If the API route fails, frontend generation automatically falls back to the existing mock generator.
