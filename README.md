# BuzzAlert

Monitor Reddit for specific keywords and get real-time email alerts. Built for indie hackers, marketers, and founders.

## Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **Database & Auth**: Supabase
- **Payments**: Paystack (USD)
- **Emails**: Resend
- **Background Jobs**: Vercel Cron

## Prerequisites

- Node.js 18+
- Supabase account (free tier works)
- Paystack account (for USD payments)
- Resend account (for email sending)
- Vercel account (for deployment)

## Environment Variables

Copy `.env.example` to `.env.local` and fill in the values:

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anon/public key |
| `SUPABASE_SERVICE_ROLE_KEY` | Your Supabase service role key (for admin operations) |
| `PAYSTACK_SECRET_KEY` | Your Paystack secret key |
| `NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY` | Your Paystack public key |
| `RESEND_API_KEY` | Your Resend API key |
| `CRON_SECRET` | A random string to secure the cron endpoint |
| `NEXT_PUBLIC_SITE_URL` | Your site URL (e.g., `http://localhost:3000`) |

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Run Supabase Migrations

1. Go to your Supabase project dashboard → SQL Editor
2. Open `supabase/migrations/00001_initial_schema.sql`
3. Copy and paste the entire SQL content
4. Run the query

This will create all tables (`profiles`, `keywords`, `mentions`), enable Row Level Security, set up RLS policies, and create a trigger that automatically creates a profile row when a new user signs up.

### 3. Configure Supabase Auth

1. In Supabase dashboard → Authentication → Providers
2. Enable Google provider
3. Add your Google OAuth client ID and secret
4. Add the callback URL: `http://localhost:3000/auth/callback` (or your production URL)

### 4. Run Locally

```bash
npm run dev
```

Visit `http://localhost:3000`.

### 5. Test Paystack Webhooks Locally

1. Install ngrok: `npm install -g ngrok`
2. Start ngrok: `ngrok http 3000`
3. Copy the ngrok URL (e.g., `https://abc123.ngrok.io`)
4. In your Paystack dashboard → Settings → Webhooks
5. Add webhook URL: `https://abc123.ngrok.io/api/paystack/webhook`
6. The webhook route verifies the `x-paystack-signature` header using HMAC SHA512

### 6. Deploy to Vercel

1. Push your code to GitHub
2. Import the repository in Vercel
3. Add all environment variables in Vercel project settings
4. Deploy
5. The cron job (`/api/cron/check-reddit`) runs automatically every 5 minutes

## Project Structure

```
src/
├── app/
│   ├── (auth)/
│   │   ├── callback/route.ts    # Supabase OAuth callback
│   │   └── login/page.tsx       # Login page with Google OAuth
│   ├── (dashboard)/
│   │   ├── layout.tsx           # Dashboard layout with sidebar
│   │   ├── keywords/
│   │   │   ├── page.tsx         # Keywords management page
│   │   │   └── keywords-table.tsx
│   │   ├── mentions/
│   │   │   ├── page.tsx         # Mentions listing page
│   │   │   └── mentions-table.tsx
│   │   └── upgrade/
│   │       ├── page.tsx         # Pricing/upgrade page
│   │       └── pricing-cards.tsx
│   ├── actions/
│   │   ├── auth.ts              # Sign in/out server actions
│   │   ├── keywords.ts          # Keyword CRUD server actions
│   │   ├── mentions.ts          # Mark as read server action
│   │   └── payments.ts          # Paystack initialization action
│   ├── api/
│   │   ├── paystack/
│   │   │   └── webhook/route.ts # Paystack webhook handler
│   │   └── cron/
│   │       └── check-reddit/route.ts  # Reddit polling cron
│   └── page.tsx                 # Landing page
├── components/
│   ├── Sidebar.tsx              # Dashboard sidebar navigation
│   ├── AddKeywordModal.tsx      # Add keyword dialog
│   └── ui/                      # shadcn/ui components
├── emails/
│   ├── mention-alert.tsx        # Email template
│   └── index.ts                 # Resend email sender
├── lib/
│   └── supabase/
│       ├── client.ts            # Browser Supabase client
│       ├── server.ts            # Server Supabase client
│       └── middleware.ts        # Auth middleware helper
└── middleware.ts                # Next.js middleware for auth
```

## API Routes

### `POST /api/paystack/webhook`
Paystack payment webhook. Verifies HMAC SHA512 signature, updates user plan on successful charge.

### `GET /api/cron/check-reddit`
Secured with `CRON_SECRET` Bearer token. Fetches Reddit for all keywords, inserts new mentions, and sends email alerts via Resend.

## Plans

| Plan | Keywords | Price |
|------|----------|-------|
| Free | 3 | $0 |
| Starter | 25 | $15/mo |
| Pro | 100 | $39/mo |

## License

MIT
