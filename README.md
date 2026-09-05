# Marholmen Lag 2

Team 2's project, built during the Marholmen conference.

## What is this?

**Vibe Check** — a live "room energy" board for the conference. People post their vibe (a colour, a face, one line — "how are you, really?") and the board aggregates it live: a team/room energy meter, loudest colour, hype leaders.

Initial design work (Claude Design canvas export, Modernist design system, iOS frame) lives under `design/vibe-check/` — open `Vibe Check v2.dc.html` (the current iteration) in a browser to view it. A first pass at the API is in `api/vibe-check.openapi.yaml`.

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

## Tech Stack

- **Design:** Claude Design
- **API:** OpenAPI spec
- **Database:** PostgreSQL
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

_TBD — setup instructions will go here once the project scaffolding exists._

## Status

🚧 Just kicked off — nothing built yet.
