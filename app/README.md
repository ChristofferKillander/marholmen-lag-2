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

Once the Vercel/Prisma backend (step 4 of the team's workflow) is deployed:

1. Copy `.env.example` to `.env`.
2. Set `EXPO_PUBLIC_API_BASE_URL` to its base URL (matching `servers[0].url`
   in `../api/vibe-check.openapi.yaml`).
3. Restart `expo start` — `src/api/index.ts` picks the real HTTP client
   automatically whenever that variable is set, no code changes needed.

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
