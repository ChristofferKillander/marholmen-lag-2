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
  recompute all confirmed working), then deployed for real (see below).
- **App**: Expo/React Native client (`app/`) ported 1:1 from the design, built
  against an in-memory mock so it was demoable immediately. Switching to the
  real backend is a single env var (`EXPO_PUBLIC_API_BASE_URL`) — no code
  changes needed.
- **Vercel project** linked for auto-deploy on push to `main`, Deployment
  Protection turned off (public preview/prod URLs — fine for a weekend
  project), Neon Postgres provisioned via the Vercel integration, schema
  pushed, and the backend deployed to **production**:
  `https://marholmen-lag-2.vercel.app` (all three endpoints verified live
  against the real database).
- **App wired into the same deploy** as a real shared web app (matching the
  original pitch): the root `build` script now also runs the app's
  `build:web` (`expo export --platform web`) straight into `public/`, with
  `EXPO_PUBLIC_API_BASE_URL=/api` baked in — so the deployed web app hits the
  same live Postgres data everyone else does, not an isolated per-visitor
  mock. `public/` is generated output now (gitignored), replacing the
  earlier hand-written status page. Local dev (`expo start`) still defaults
  to the mock for fast iteration.

## What's left

Nothing blocking — design, contract, backend (deployed, real Postgres), and
the app (deployed, both as the live web app and available via Expo Go for
local dev) are all done and verified. Nice-to-haves if there's time: mirror
the compose sheet's chosen emoji on the "drop your vibe" button (currently
fixed), and consider a TTL on old vibes so the wall doesn't grow unbounded
over a long event.

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
