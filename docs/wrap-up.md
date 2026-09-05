# Wrap-up

## What we built

**Vibe Check** — a live "room energy" board for the conference: post a colour +
emoji + one-line status, watch it aggregate into a team energy meter, loudest
colour, and hype leaders.

## What we did

- **Design** in Claude Design (`design/vibe-check/`), then an **OpenAPI spec**
  written from that design as the shared contract (`api/vibe-check.openapi.yaml`).
- **Backend** built straight from the spec: Vercel serverless functions +
  Prisma/PostgreSQL (`api/`, `lib/`, `prisma/`) — smoke-tested end-to-end
  against a local Postgres (all three endpoints, validation, `/pulse`
  recompute all confirmed working), but not yet deployed with a real
  production database.
- **App**: Expo/React Native client (`app/`) ported 1:1 from the design, built
  against an in-memory mock so it was demoable immediately. Switching to the
  real backend is a single env var (`EXPO_PUBLIC_API_BASE_URL`) — no code
  changes needed.
- **Vercel project** linked for auto-deploy on push to `main`.

## What's left

Provision a real (production) Postgres instance, set `DATABASE_URL` on
Vercel and deploy the backend, then point the app at it. Everything else
(design, contract, backend logic, app, deploy pipeline) is done and verified
locally.

## Learnings

- **Contract-first (design → OpenAPI → parallel backend/app work) let two
  people build independently** without blocking on each other — the app
  worked from day one against a mock built to the same schema.
- **Push-straight-to-`main` for 4 people caused real merge conflicts** (same
  file, same anchor line in `docs/progress.md`, README tech-stack edits) —
  fine at this scale, but worth pulling before starting new work.
- **Git/SSH auth setup (keys, `known_hosts`, collaborator access) took more
  back-and-forth than the actual coding** — worth sorting out for everyone
  *before* the clock starts next time.
- **A shared, append-only progress log (`docs/progress.md`) was genuinely
  useful** for picking up context across people/sessions — better than
  relying on commit messages alone.
- **`vercel dev` refuses to run under an AI-agent/CI-like environment**
  ("must not recursively invoke itself") — that's the Vercel CLI's own
  guard, not a bug; testing had to hit the compiled endpoints directly
  instead. A human running it interactively should be unaffected.
