# Mentorque Frontend

React + TypeScript + Vite + Tailwind. Plain hand-built components, no UI kit.

## Setup

```bash
pnpm install
cp .env.example .env   # point VITE_API_URL at your backend
pnpm dev
```

Runs on `http://localhost:5173`.

## Routes

- `/` — pick a role
- `/login/user`, `/login/mentor`, `/login/admin` — separate login screens per role
- `/user` — add weekly availability, submit a call request, see request status
- `/mentor` — add weekly availability only
- `/admin` — edit mentor tags/description, review pending requests, see
  ranked mentor recommendations with overlapping time windows, book a call,
  see everything that's been booked

Auth is a Bearer token stored in `localStorage`, attached manually on every
request (matches the current repo's approach rather than cookies).
