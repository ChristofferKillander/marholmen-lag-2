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

**Nothing blocking — confirmed live.** `https://marholmen-lag-2.vercel.app`
now returns 200 on `/`, `/api/options`, and `/api/pulse`; the earlier bot
"Security Checkpoint" 403 was a stale deploy and cleared once the unified
build was pushed to production. `/api/pulse` shows real vibes already
posted by teammates (energy, mood, colour board, hype leaders all
recomputing correctly), so the whole path — design → contract → backend →
app, all sharing one live URL — is verified working end to end. The earlier
duplicate `vibe-check-web` Vercel project is also resolved: left in place
(not worth touching mid-event) but nothing links to it, so
`marholmen-lag-2.vercel.app` is the one URL to use.

Nice-to-haves if there's time: mirror the compose sheet's chosen emoji on
the "drop your vibe" button (currently fixed), consider a TTL on old vibes
so the wall doesn't grow unbounded over a long event, and one teammate
posted a vibe with a color (`#AABBCC`) outside the fixed palette — harmless
(just doesn't count toward the colour board), but worth validating
server-side against `/options`' palette if there's time.

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
- **Vercel's Git integration silently didn't auto-deploy on push for two
  pushes in a row** — the production URL kept serving a stale build (which
  is likely why it showed a bot-challenge page rather than the real app) until
  someone ran `vercel deploy --prod` manually. Don't assume "pushed to main"
  means "live" — check the actual deployed URL after pushing, and manually
  trigger a deploy if it looks stale.
- **Two people deployed the app's web build in parallel without realizing
  it** — one folded it into the existing backend project (same-origin,
  correct), one stood up a separate cross-origin project (wrong base URL,
  broken). Worth a quick "who's touching deploy/infra right now" check
  before starting infra work, even in a push-straight-to-`main` workflow —
  code conflicts merge cleanly, but duplicate cloud resources don't.
