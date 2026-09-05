# Project idea pitch

Original idea pitch that led to the "Vibe Check" project (see `design/vibe-check/`
and `api/vibe-check.openapi.yaml`). Kept verbatim for reference.

---

"Vibe Check" — a live mood/energy board for the hackathon itself

A shared web app where everyone at the hackathon (or your team) can drop their
current "vibe" — pick a color + emoji + one-line status — and it renders as a
big, animated, colorful wall of everyone's energy in real time. Think a cross
between a mood ring and a group chat status board.

Why it's a good hackathon pick:

- Visually satisfying from minute one (colors, animation, confetti) — great demo energy
- Naturally splits into 4 workstreams for 4 people:
  1. Frontend/canvas — the animated color wall (React + canvas/SVG, particle effects)
  2. Backend/realtime — websocket or polling sync so everyone sees updates live
  3. "Vibe" input UI — color picker, emoji picker, quick-status composer, maybe a streak/history
  4. Extras — sound effects, a "team vibe average" meter, dark/light themes, a shareable snapshot/export
- No auth complexity needed — just names + colors
- Easy to extend if you have time left: reactions, vibe history graph, a "loudest color wins" leaderboard, team vs team battle mode

Other colorful/fun alternatives if that doesn't grab you:

- Confetti Cannon Slack-bot-for-your-team — trigger celebratory animated bursts on a shared screen when something ships
- Pixel garden — everyone "plants" a pixel-art flower that grows based on how many Claude Code commits/tasks they finish; whole garden blooms together
- Color-by-emotion Spotify-style visualizer — paste in text (Slack messages, commit messages) and it paints an abstract colorful canvas based on sentiment

Want me to scaffold the Vibe Check app (or one of the others) right now — pick a
stack (plain HTML/JS, React, Next.js, etc.) and I'll get the skeleton running?
