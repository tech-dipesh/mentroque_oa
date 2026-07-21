# Mentorque Backend

Express + TypeScript + Prisma (Neon Postgres). Strict TS, Zod validation on every
request, JWT auth with three role-scoped login endpoints, and a small local
RAG-style recommendation engine for matching mentors to call requests.

## Setup

```bash
pnpm install
cp .env.example .env   # fill in DATABASE_URL with your Neon connection string
pnpm prisma:migrate    # creates tables
pnpm seed               # 1 admin, 5 mentors, 10 users + weekly availability
pnpm dev
```

Server runs on `http://localhost:5000` by default.

## Seeded accounts

Every seeded account (except admin) uses the password `password123`.
Admin credentials come from `ADMIN_EMAIL` / `ADMIN_PASSWORD` in your `.env`.

Emails follow the pattern `firstname.user@mentorque.com` /
`firstname.mentor@mentorque.com` — check `src/scripts/seed.ts` for the full list.

## How matching works

Each mentor's tags + description + domain get embedded locally with
`@xenova/transformers` (`all-MiniLM-L6-v2`, runs in-process, no API key). When
an admin looks at a pending request, the request's description + the user's
tags/domain get embedded the same way, ranked against mentors by cosine
similarity, then boosted for rule-based trait matches per call type
(big-tech tag for Resume Revamp, good-communication tag for Job Market
Guidance, same domain for Mock Interviews). Availability overlap is computed
separately and attached to each recommendation.

## Notes

- No Google OAuth, no Google Calendar. Auth is plain JWT (Bearer token).
- Meeting links are generated placeholders (`meet.mentorque.dev/...`) — there's
  no real video integration, admins are expected to swap in a real link if this
  goes further than a demo.
- Availability is a simple weekly recurring model (day of week + start/end
  time), not the old template/exception/snapshot system.
