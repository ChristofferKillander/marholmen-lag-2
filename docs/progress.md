# Progress Log

Running, dated log of decisions and steps taken on this project. Newest entries at the bottom.

---

## 2026-09-05

- Kicked off the repo, added initial README describing the team, tech stack (Claude Design, OpenAPI spec, PostgreSQL), and the convention for AI agents to commit design/API/code artifacts and log progress here as work happens.
- Added "Vibe Check hackathon board.zip" (Claude Design export) and extracted it into `design/vibe-check/` — contains `Vibe Check v2.dc.html` (the current design), an earlier `Vibe Check.dc.html`, the `modernist` design-system bundle/styles, `ios-frame.jsx`, and `support.js`.
- Wrote `api/vibe-check.openapi.yaml` (OpenAPI 3.1) covering the backend implied by `Vibe Check v2.dc.html`: `GET/POST /vibes` (the wall + posting a vibe), `GET /pulse` (room energy, mood, colour board, hype leaders), and `GET /options` (palette/emoji/energy choices for the compose sheet). Live "simulate live" behaviour in the design is modeled as polling (`since` param) rather than a socket endpoint — worth revisiting if the team wants real-time push.
- Filled in the README's project description from the design (Vibe Check: a live "room energy" board — post a vibe, see it aggregate into a team energy meter, loudest colour, hype leaders), and added "weekend throwaway project" ground rules: push straight to `main`, pull often, since all four of us commit directly to `main` in parallel.
- Added the workshop's 8-step workflow (idea → design in Claude Design → OpenAPI spec as contract → backend from spec → Prisma + database → SwiftUI app → deploy to Vercel → wrap-up) to the README as a flexible guideline, and filled in the tech stack with SwiftUI, Prisma, and Vercel now that they're confirmed.
