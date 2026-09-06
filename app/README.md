# Vibe Check — app

React Native (Expo) client for "Vibe Check", built from the design
(`../design/vibe-check/Vibe Check v2.dc.html`) and the OpenAPI contract
(`../api/vibe-check.openapi.yaml`).

## Run it

```
npm install
npm run web      # opens in a browser via react-native-web — fastest way to preview
npm run ios      # iOS Simulator / Expo Go (simulator needs a Mac)
npm run android  # Android emulator / Expo Go
```

By default the app runs against an in-memory mock backend seeded with demo
data (see `src/api/mockClient.ts`) — no setup needed, and it simulates
teammates posting every ~7s so it feels alive.

## Pointing at the real backend

The backend is live at `https://marholmen-lag-2.vercel.app` (Vercel +
Neon Postgres). To develop locally against it instead of the mock:

1. Copy `.env.example` to `.env`.
2. Set `EXPO_PUBLIC_API_BASE_URL=https://marholmen-lag-2.vercel.app/api`.
3. Restart `expo start` — `src/api/index.ts` picks the real HTTP client
   automatically whenever that variable is set, no code changes needed.

## Shared web deploy

The app is also published as the actual web app at that same domain —
`npm run build:web` (invoked by the root `package.json`'s `build` script on
every push to `main`) exports the app for web straight into `../public`
with `EXPO_PUBLIC_API_BASE_URL=/api` baked in, so it's the same shared
Postgres-backed data everyone posts to, not an isolated mock per visitor.
`public/` is generated output — it's gitignored, don't hand-edit it or
commit it. See the root README/`package.json` for the combined build.

## Installing it as an app (PWA)

The deployed site is a real installable PWA — from a phone browser:

- **iOS Safari**: Share icon → **Add to Home Screen**.
- **Android Chrome**: ⋮ menu → **Add to Home screen** / **Install app**.

It then opens full-screen (no browser chrome) with the Vibe Check icon.
That's powered by `app/public/manifest.webmanifest` + the icons alongside it
(`icon-192.png`, `icon-512.png`, `apple-touch-icon.png`) — `app/public/*` is
copied verbatim into the web build's output root by `expo export`. Expo's
classic (non-router) web export doesn't link a manifest or add Apple's
"add to home screen" meta tags on its own, so `scripts/inject-pwa-head.mjs`
patches them into the exported `index.html` right after export (wired into
`build:web`; idempotent, safe to re-run). The master icon design lives only
as the rasterized PNGs in `assets/` and `public/` — regenerate all sizes
from one source if it ever needs to change.

## Structure

- `src/api/` — `types.ts` (mirrors the OpenAPI schemas), `client.ts` (real
  fetch client), `mockClient.ts` (in-memory demo backend), `index.ts` (picks
  one based on `EXPO_PUBLIC_API_BASE_URL`).
- `src/hooks/` — polling hooks (`useVibes`, `usePulse`) and a one-shot
  `useComposeOptions`.
- `src/components/` — the wall grid, pulse tab, ticker, compose sheet,
  confetti burst — one component per piece of the design.
- `src/theme/tokens.ts` — exact colours/fonts lifted from the design (this
  screen doesn't use the Modernist design-system's own tokens).
- `src/screens/VibeCheckScreen.tsx` — composes everything; owns
  tab/sheet/now state, mirroring the design's single component.
