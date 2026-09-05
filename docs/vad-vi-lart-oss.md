# Vad vi har lärt oss

Reflektioner efter helgens Vibe Check-projekt — tekniskt och samarbetsmässigt.

## Arbetssätt

- **Kontrakt-först fungerade.** Design i Claude Design → OpenAPI-spec som kontrakt → backend och app byggdes sedan parallellt av olika personer utan att blockera varandra. Appen kunde köras mot en mock byggd på samma schema redan från dag ett.
- **Push direkt till `main` med fyra personer gav riktiga merge-konflikter** (samma fil, samma rad i `docs/progress.md`, README-ändringar) — helt hanterbart i den här skalan, men det lönar sig att dra (`git pull`) ofta, särskilt innan man börjar på något nytt.
- **En delad, append-only progresslogg (`docs/progress.md`) var genuint användbar.** Att kunna läsa vad som hänt — och varför — mellan personer och AI-sessioner var bättre än att lita på commit-meddelanden ensamma.
- **Två personer deployade webb-appen parallellt utan att veta om varandra** — en löste det rätt (samma origin för app och API), en löste det fel (separat cross-origin-projekt med en trasig bas-URL som gav CORS-fel i webbläsaren). Värt en snabb koll på vem som jobbar med infra/deploy just nu, även i ett "push direkt till main"-arbetssätt — kod går att slå ihop automatiskt, dubbla molnresurser gör det inte.
- **Git/SSH-uppsättning (nycklar, `known_hosts`, collaborator-access) tog mer tid än själva kodandet.** Värt att lösa för alla *innan* klockan startar nästa gång.

## Tekniskt

- **Zero-config-deploy på Vercel förväntar sig en statisk output-mapp** (`public`) — ett rent API-projekt utan den mappen failar bygget tills man lägger till något att servera (i vårt fall en enkel statussida, senare ersatt av själva appen).
- **Neon Postgres-provisionering via Vercels integration krävde ett engångssteg i webbläsaren** för att acceptera marketplace-villkoren — allt annat (provisionering, env-variabler, schema-push) gick att automatisera via CLI.
- **`vercel dev` vägrar köras i en AI-agent/CI-liknande miljö** ("must not recursively invoke itself") — det är CLI:ns egen skyddsmekanism, inte en bugg i vår kod. En människa som kör det interaktivt i en vanlig terminal påverkas inte.
- **Vercels Git-integration triggade inte auto-deploy på push, två gånger i rad.** Man kan inte anta att "pushat till `main`" betyder "live" — kolla den faktiska URL:en efter en push, och trigga en deploy manuellt om den ser gammal ut.
- **Miljövariabler som bakas in i en statisk webb-build (`EXPO_PUBLIC_*`) måste finnas *innan* bygget körs**, inte bara vid runtime — och Metros transform-cache nyckelar inte alltid på env-variabler, så ett `--clear` vid buggiga builds var nödvändigt för att inte råka baka in en gammal (mock-)version av appen.
- **Testdata hopar sig snabbt.** Upprepad "Hello"-spam från test-postningar (`"you"`) behövde städas bort innan skarp demo — bra att ha ett enkelt sätt att rensa väggen snabbt.

## Sammanfattning

Fyra personer, en helg, ett AI-understött arbetsflöde från idé till en live, delad webbapp med riktig databas — och trots parallella missförstånd (dubbeldeploy, merge-konflikter) landade allt i en fungerande produkt utan att någon blockerade någon annan särskilt länge.
