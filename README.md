# SubPacket

Next.js-app för små amerikanska villabyggare och renoverare (1–10 anställda). Byggaren lägger till sina underentreprenörer (UE) och sms:ar eller mejlar dem en länk. UE:n laddar upp COI, workers' comp-intyg, W-9, licens och signerat avtal från mobilen, utan konto. Byggaren ser grönt/gult/rött per UE, får påminnelse 30 dagar före utgång och kan exportera 1099-listan. Pro ger obegränsat antal UE och en delbar revisionslänk med ZIP-nedladdning.

Tillväxt: SEO-sidor som är gratisverktyg (avtalsgenerator per delstat, 1099-checker, workers' comp-kalkylator) och guider. Spridningsloopen är att varje byggare bjuder in sina UE.

## Stack
Next.js 15 (App Router, TypeScript) · Tailwind + shadcn-komponenter · Supabase (Postgres, RLS, Auth med magic link, Storage) · @react-pdf/renderer · Resend · Stripe Checkout + Customer Portal · Vercel + Vercel Cron

## Kom igång lokalt
1. `npm install`
2. Kopiera `.env.example` till `.env.local` och fyll i nycklarna (se nedan).
3. `npm run dev` och öppna http://localhost:3000

Utan `RESEND_API_KEY` loggas mejl i terminalen i stället för att skickas.

## Supabase
1. Skapa ett projekt. Kopiera URL, anon key och service role key till `.env.local`.
2. SQL Editor: kör hela `supabase/schema.sql`. Det skapar tabeller, RLS, gratisgränsen på 3 UE (trigger i databasen) och den privata bucketen `documents`.
3. Authentication → URL Configuration:
   - Site URL: din produktions-URL
   - Redirect URLs: `http://localhost:3000/auth/callback` och `https://DIN-DOMÄN/auth/callback`
4. Authentication → Emails: byt till egen SMTP (t.ex. Resend SMTP) innan lansering. Supabases inbyggda mejl har låg sändningsgräns.

## Stripe
1. Skapa en produkt "Pro" med ett återkommande pris på $39/månad. Kopiera price-id till `STRIPE_PRICE_ID`.
2. Developers → Webhooks → lägg till endpoint `https://DIN-DOMÄN/api/stripe/webhook` med händelserna `checkout.session.completed`, `customer.subscription.created`, `customer.subscription.updated`, `customer.subscription.deleted`. Kopiera signing secret till `STRIPE_WEBHOOK_SECRET`.
3. Settings → Billing → Customer portal: aktivera uppsägning och fakturahistorik.
4. Lokalt: `stripe listen --forward-to localhost:3000/api/stripe/webhook`

## Resend
Verifiera din domän och sätt `EMAIL_FROM`, t.ex. `SubPacket <reminders@dindomän.com>`.

## Vercel
1. Importera repot, lägg in alla miljövariabler och sätt `NEXT_PUBLIC_SITE_URL` till produktionsdomänen.
2. `vercel.json` kör `/api/cron/check-expirations` dagligen 13:00 UTC (morgon i USA). Sätt `CRON_SECRET`; Vercel skickar den automatiskt som Bearer-token.
3. Testa cron manuellt: `curl -H "Authorization: Bearer $CRON_SECRET" https://DIN-DOMÄN/api/cron/check-expirations`

## Struktur
```
app/(marketing)/                      publika SEO-sidor (statiska)
  page.tsx                            startsida
  guides/[slug]                       guider (FAQPage-schema)
  tools/1099-checker                  gratisverktyg
  tools/workers-comp-audit-calculator gratisverktyg
  subcontractor-agreement-template/[state]  PDF-avtal per delstat (HowTo-schema), 51 sidor
app/u/[token]                         UE:ns uppladdningssida (ingen inloggning, noindex)
app/p/[shareToken]                    revisionspaket för försäkringsrevisor/långivare (Pro, noindex)
app/dashboard                         byggarens app (Supabase Auth)
app/api/upload/{sign,complete}        signerad uppladdning direkt till Storage
app/api/packet/[shareToken]           ZIP med alla filer + summary.csv
app/api/export/1099                   CSV för 1099-säsongen
app/api/cron/check-expirations        dagliga påminnelser (en gång per dokument och typ)
app/api/stripe/{checkout,portal,webhook}
supabase/schema.sql                   schema, RLS, gratisgräns, bucket
data/guides.ts, data/states.ts        SEO-innehåll
```

## Säkerhet i korthet
- Byggarens data skyddas av RLS. Fakturerings- och delningskolumner går inte att skriva från webbläsaren (kolumnrättigheter i SQL).
- Dokument skrivs bara av servern efter att UE-länken validerats. Filer ligger i en privat bucket och delas ut via signerade URL:er som gäller 60 sekunder.
- Gratisgränsen upprätthålls i databasen, inte bara i UI:t.
- UE-länken och revisionslänken kan bytas ut, så att den gamla slutar fungera.
- W-9:or (SSN/EIN) delas aldrig via revisionslänken: de filtreras bort redan i databasfrågan, i ZIP-filen och i enskilda nedladdningar. Bara byggaren själv kan ladda ner dem.

## Innan lansering (att göra)
- **Juridik:** låt en amerikansk byggjurist granska avtalstexten i `lib/agreement.ts` en gång. Skriv riktig integritetspolicy och villkor (`/privacy`, `/terms`). W-9:or innehåller personnummer/EIN.
- **Delstatssidorna:** 18 delstater (TX, FL, CA, NC, GA, OH, WA, NY, PA, TN, VA, MD, NJ, MI, IL, SC, CO, AZ) har verifierade noter med källor (granskade 2026-10-06) och indexeras. Övriga är `noindex` och utanför sitemapen tills `data/states.ts` har minst 2 `notes` och 1 `sources`-URL för delstaten (`hasStateContent`). Börja med de 5–10 största marknaderna (t.ex. TX, FL, CA, NC, GA, AZ) och verifiera mot officiell lagtext eller myndighetssida: retainage-gränser, preliminary notice-frister, lien waiver-formulär, licenskrav och workers' comp-krav.
- **1099-gränsen:** `TAX_1099` i `lib/site.ts` är $2 000 för betalningar 2026. Uppdatera varje höst (inflationsjusteras från 2027).
- **Rate limiting** på `/api/upload/*` (t.ex. Upstash eller Vercel Firewall).
- **Google Search Console:** skicka in `/sitemap.xml`.
- Egen domän och `NEXT_PUBLIC_APP_NAME` om du byter namn.

## Innehåll och länkar (det som gör att sajten kan ranka)
- `data/guides.ts`: 6 guider med exempel, tabeller, källor och granskningsdatum (`reviewed`). Uppdatera datumet när du kontrollerar fakta igen.
- `data/states.ts`: lägg till en delstat i `CONTENT` först när varje rad är kontrollerad mot källan som länkas. Källorna måste vara officiella: `isOfficialSource` i `data/states.ts` släpper bara igenom .gov, .us och en uttrycklig lista (myfloridacfo.com, nclbgc.org). En enda icke-officiell källa gör sidan noindex. Nästa kandidater: MA, MN, WI, MO, IN, OR, UT, NV, KY, AL.
- `/embed/workers-comp-calculator`: inbäddningsbar kalkylator med länk tillbaka. Erbjud den till försäkringsagenter och branschföreningar; det är den enklaste vägen till externa länkar.
