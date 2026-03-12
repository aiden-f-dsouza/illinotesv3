# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start dev server (Next.js, port 3000)
npm run build    # Production build
npm run lint     # ESLint check
npx prisma generate          # Regenerate Prisma client after schema changes
npx prisma db push           # Push schema to database
npx prisma migrate dev       # Create and run migrations
npx prisma studio            # Open Prisma Studio GUI
```

No test suite is configured.

## Architecture

**IlliNotes** is a UIUC-focused class notes sharing platform. Built with Next.js 16 App Router, React 19, TypeScript, Tailwind CSS v4, and shadcn/ui components.

### Dual-backend data layer

- **Supabase** handles authentication (via `@supabase/ssr`) and file storage (bucket: `note-attachments`). Profiles live in a Supabase `profiles` table protected by RLS.
- **Prisma + PostgreSQL** (via `@prisma/adapter-pg`) handles all application data: notes, attachments, likes, comments, mentions, and token tables. The Prisma client is a singleton at `src/lib/db/prisma.ts`.
- Auth state is always fetched with `supabase.auth.getUser()` (never `getSession()`), then the profile is looked up from the `profiles` table. The helper `getUserWithProfile()` (`src/lib/auth/server.ts`) is the standard way to get the current user in Server Actions and Route Handlers.

### Route structure

- `src/app/(auth)/` — Login, signup, forgot/reset password, verify email (unauthenticated)
- `src/app/(main)/` — Authenticated app: notes feed, summarizer, profile, leaderboard, blog, etc.
- `src/app/api/` — Route Handlers for chat, summarize, notes, mentions, file downloads, and landing page data
- `src/middleware.ts` — Protects `/notes`, `/profile`, `/leaderboard`, `/summarizer`; redirects authenticated users away from auth routes

### Key patterns

- **Server Actions** (`"use server"`) in `src/lib/notes/actions.ts` and `src/lib/auth/actions.ts` handle all mutations. They return `ActionResult = { success?: string; error?: string }`.
- **Rate limiting** via Upstash Redis (`src/lib/ratelimit/limiter.ts`): chat (30/day), login (10/min), signup (5/hr), forgot-password (3/hr). Limiters gracefully no-op if env vars are missing.
- **AI features**: OpenAI `gpt-4o-mini` for chat (`src/lib/ai/chat.ts`) and summarization (`src/lib/ai/summarize.ts`). Chat uses note context (body + attachment extracted text) injected into the system prompt.
- **Courses**: UIUC course list loaded from `courses.json` at the root via `src/lib/courses/loader.ts`. Exported as `CLASSES` and `SUBJECTS`.
- **Profanity filter**: `src/lib/profanity/checker.ts` wraps `leo-profanity` and is called in all content-creating actions.
- **@mentions**: Parsed from comment bodies, stored as `Mention` records, and trigger email notifications via Resend (`src/lib/email/resend.ts`).

### Required environment variables

```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
DATABASE_URL
OPENAI_API_KEY
UPSTASH_REDIS_REST_URL
UPSTASH_REDIS_REST_TOKEN
RESEND_API_KEY
```
