# Marholmen Lag 2

Team 2's project, built during the Marholmen conference.

## What is this?

**Vibe Check** — a live "room energy" board for the conference. People post their vibe (a colour, a face, one line — "how are you, really?") and the board aggregates it live: a team/room energy meter, loudest colour, hype leaders.

**Was live at marholmen-lag-2.vercel.app during the conference** — torn down afterward (Vercel projects + Neon Postgres both deleted) since the event is over. See `docs/wrap-up.md` and `docs/demo-manus.md` for what it was and how it worked; the code + `docs/` here still show the full contract-first build (design → OpenAPI spec → backend → app).

Initial design work (Claude Design canvas export, Modernist design system, iOS frame) lives under `design/vibe-check/` — open `Vibe Check v2.dc.html` (the current iteration) in a browser to view it. The API contract is `api/vibe-check.openapi.yaml`; the app is `app/` (see `app/README.md`).

## Weekend project

This is a throwaway weekend hackathon project, not production software. To keep four people moving in parallel without friction:

- **Push straight to `main`.** No branches/PRs needed — this is a low-stakes, short-lived repo.
- **Pull often.** Since everyone commits directly to `main`, pull frequently to stay in sync and avoid conflicts.

## Team

| Name | Role |
| --- | --- |
| Alice Darner | |
| Christoffer Killander | |
| Linda Storgård | |
| Mattias Norling | |

## How we're running this

A loose guideline for the day, not a strict order — steps can overlap or loop back:

1. **The idea** — what the app should do.
2. **Design prompt** → design in Claude Design.
3. **OpenAPI spec** — the design becomes a contract.
4. **Backend** built directly from the spec.
5. **Prisma + database** — persistent data.
6. **The app** — React Native against the design and spec.
7. **Deploy to Vercel** — and debugging.
8. **Wrap-up** — how we collaborated.

## Tech Stack

- **Design:** Claude Design
- **API:** OpenAPI spec
- **Backend:** Vercel serverless functions (TypeScript, `api/*.ts`), built from the OpenAPI spec
- **ORM:** Prisma
- **Database:** PostgreSQL
- **App:** React Native
- _More to be added as decisions are made._

## For AI agents working in this repo

Humans and AI agents are pairing on this project side by side. Because sessions end and context gets lost, **this repo is the shared memory** — every output an agent produces should be committed here as it's created, not left only in chat history or a local scratchpad. That includes:

- **Design work** — Claude Design canvases/exports, mockups, wireframes → `design/`
- **API work** — OpenAPI specs, endpoint definitions, schema drafts → `api/`
- **Code** — once implementation starts, normal project source layout (e.g. `src/`)
- **Decisions & progress** — a running, dated log of what was decided and why → `docs/progress.md`

Guidelines for any agent picking up work here:

1. **Log as you go.** Append a short dated entry to `docs/progress.md` for any meaningful step (a decision made, a design produced, an API shape agreed on, a feature implemented) — not just a final summary at the end.
2. **Commit artifacts, don't just describe them.** If you produce a design export, spec file, or snippet, save the actual file into the repo (`design/`, `api/`, etc.) rather than only pasting it in chat.
3. **Prefer small, frequent commits** over one large one, so the next agent (or teammate) can see how the project evolved.
4. **Update this README** if the project's purpose, stack, or structure changes — keep it accurate, not just the first draft.

## Getting Started

**Backend** lives at the repo root as Vercel serverless functions (`api/*.ts`) built directly from `api/vibe-check.openapi.yaml`, using Prisma against PostgreSQL (Neon, provisioned via the Vercel integration).

1. `npm install`
2. Copy `.env.example` to `.env` and point `DATABASE_URL` at a Postgres instance (the comment in that file has a one-line `docker run` for a local one), or pull the real one with `npx vercel env pull`.
3. `npx prisma db push` — creates the `Vibe` table from `prisma/schema.prisma`.
4. `npx vercel dev` — serves `GET/POST /api/vibes`, `GET /api/pulse`, `GET /api/options` locally.

`npm run build` at the repo root also builds **the app** for web straight into `public/` (see `app/README.md`) — that's what's actually live at the root of the deployed domain; the repo-root steps above are backend-only.

**App**: see `app/README.md` — `cd app && npm install && npm run web` runs it locally (mock data by default; point it at the real backend per that README).

## Status

🏁 Conference is over. Design, OpenAPI spec, backend, and the React Native app were all built, deployed, and demoed live — see `docs/wrap-up.md` and `docs/demo-manus.md`. Vercel projects and the Neon database have since been deleted (nothing left running); anyone wanting to run it again needs to redo the deploy steps in `Getting Started` above with a fresh Vercel project + Postgres instance.
