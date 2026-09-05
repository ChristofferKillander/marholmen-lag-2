# Demo-manus (2 min)

Kort körschema för demot. Ha **https://marholmen-lag-2.vercel.app** uppe på storskärm/projektor innan ni börjar, gärna på en telefon redo också för live-postning.

## 0:00–0:15 — Hooken

> "Vi byggde Vibe Check — en live 'room energy'-tavla för konferensen. Man postar sin vibe — en färg, en emoji, en rad text — och den dyker upp direkt för alla, tillsammans med lagets samlade energi."

## 0:15–0:40 — Visa väggen

- Peka på skärmen: väggen med redan postade vibes (namn, emoji, statusrad, färg).
- Peka på **Pulse**-fliken: energimätare, "loudest colour", hype leaders — allt uträknat live från det som redan postats.

## 0:40–1:25 — Live-postning

- Ta upp telefonen (eller be någon i publiken): posta en egen vibe — välj färg, emoji, energi, skriv en rad.
- Skicka in — **peka tillbaka på storskärmen** och visa att den nya posten dyker upp på väggen direkt, och att Pulse-siffrorna (energi/mood/färgtavla) uppdateras.
- Det här är poängen med demot: *alla* som öppnar länken ser samma, delade, levande data — inte en egen isolerad kopia.

## 1:25–1:50 — Snabbt "hur det byggdes"

> "Vi gjorde det här på en helg med fyra personer och AI som parhäst genom hela kedjan: idé → design i Claude Design → en OpenAPI-spec som blev ett kontrakt mellan backend och app → backend byggd direkt från specen mot Prisma och en riktig Postgres-databas → appen i React Native/Expo, byggd mot samma kontrakt — och allt ligger på en och samma Vercel-deploy."

(Valfritt: nämn att appen och API:t delar samma domän, så det inte finns några cross-origin-problem.)

## 1:50–2:00 — Avslut

> "En helg, fyra personer, en AI-driven arbetsprocess från idé till en riktig live-app med delad data. Det här är Vibe Check."

---

## Backup-plan om nätet strular

- Ha en skärmdump/kort skärminspelning av väggen + Pulse-fliken redo som fallback.
- Om live-postningen inte går igenom på scen: visa istället en tidigare postning i `docs/progress.md`/väggen och förklara flödet muntligt istället.
