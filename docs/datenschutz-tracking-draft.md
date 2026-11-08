# ENTWURF: Datenschutzerklärung, Abschnitte Cookies, Statistik und Werbung

> **Entwurf, nicht veröffentlichen.** Muss vor dem Livegang von jemandem geprüft werden,
> der BEER rechtlich berät. Stellen mit **[prüfen]** sind nicht sicher belegt.
> Danach kommt der Text in die Seite „Datenschutz" im CMS (nur mit Amines Ja,
> CMS-Schreibvorgänge können sofort veröffentlichen). Die Cookie-Tabelle im Banner
> steht in `lib/consent-copy.ts`; beide müssen übereinstimmen.

## Deutsch

### Cookies und Einwilligung

Beim ersten Besuch fragen wir, ob wir Statistik- und Marketing-Dienste verwenden
dürfen. Ohne Ihre Zustimmung laden wir keinen dieser Dienste und speichern nichts
außer Ihrer Auswahl. „Alle ablehnen" ist so einfach wie „Alle akzeptieren".

Ihre Auswahl speichern wir im Cookie `beer_consent` (6 Monate). Sie können sie jederzeit
über den Link „Cookie-Einstellungen" unten auf jeder Seite ändern oder widerrufen; der
Widerruf gilt für die Zukunft. Beim Widerruf löschen wir die Cookies der betroffenen
Dienste in Ihrem Browser.

Um nachweisen zu können, dass Sie eingewilligt haben (Art. 7 Abs. 1 DSGVO), speichern wir zu
jeder Auswahl: eine zufällige Kennung (die auch im Cookie steht), die gewählten Kategorien,
die Version des Banners, die Sprache, den Zeitpunkt und die aufgerufene Seite. Wir speichern
dabei keine IP-Adresse. Speicherdauer: 3 Jahre **[prüfen]**, danach gelöscht. Speicherort: unser
eigener Automatisierungsserver (n8n) bei **[Hoster prüfen]** in der EU.

Rechtsgrundlage für Dienste, die eine Einwilligung brauchen: Art. 6 Abs. 1 lit. a DSGVO und
§ 25 Abs. 1 TDDDG. Für das Speichern Ihrer Auswahl: § 25 Abs. 2 Nr. 2 TDDDG und Art. 6 Abs. 1
lit. c DSGVO.

### Google Tag Manager

Anbieter: Google Ireland Limited, Gordon House, Barrow Street, Dublin 4, Irland.
Der Tag Manager lädt die übrigen Dienste in diesem Abschnitt. Er setzt selbst keine Cookies,
überträgt aber Ihre IP-Adresse an Google. Wir laden ihn erst nach Ihrer Einwilligung
(Statistik oder Marketing). Rechtsgrundlage: Art. 6 Abs. 1 lit. a DSGVO, § 25 Abs. 1 TDDDG.
Drittland: USA möglich; Google LLC ist nach dem EU-US Data Privacy Framework zertifiziert.
https://policies.google.com/privacy

### Statistik

**Umami** (ohne Cookies). Wir zählen Seitenaufrufe und Klicks mit Umami auf unserem eigenen
Server **[Standort prüfen]**. Umami setzt keine Cookies und speichert keine IP-Adressen; Besuche
werden über einen täglich wechselnden, nicht rückführbaren Wert unterschieden **[prüfen, je nach
Umami-Version]**. Rechtsgrundlage: Art. 6 Abs. 1 lit. f DSGVO (unser Interesse, die Website zu
verbessern); es wird nichts auf Ihrem Gerät gespeichert. Daten verlassen unseren Server nicht.

**Umami-Sitzungsaufzeichnung** (nur mit Einwilligung „Statistik"). Zeichnet Klicks, Scrollen und
Seitenwechsel auf, damit wir Formulare verbessern können. Eingaben in Formularfeldern werden
nicht aufgezeichnet **[prüfen: Maskierung in der Umami-Konfiguration]**. Speicherdauer: **[prüfen]**.

**Google Analytics 4** (nur mit Einwilligung „Statistik"). Anbieter: Google Ireland Limited.
Zweck: Reichweite messen, Anfragen zählen. Verarbeitet: gekürzte IP-Adresse, Geräte- und
Browserangaben, besuchte Seiten, Klicks, ungefährer Standort, Referrer. Cookies: `_ga`, `_ga_*`
(2 Jahre). Speicherdauer der Analysedaten bei Google: 14 Monate. Drittland: USA möglich (EU-US
Data Privacy Framework). https://policies.google.com/privacy

### Marketing (nur mit Einwilligung „Marketing")

Mit diesen Diensten sehen wir, ob eine Anzeige zu einer Anfrage geführt hat, und können unsere
Anzeigen Menschen zeigen, die unsere Website schon besucht haben (Remarketing).

Wenn Sie den Küchenplaner absenden, geben wir Ihre E-Mail-Adresse und Telefonnummer nur
**gehasht** (SHA-256, eine nicht umkehrbare Prüfsumme) und Ihre Postleitzahl an die Plattformen
weiter, damit diese die Anfrage einer Anzeige zuordnen können („erweiterte Conversions"). Wenn
Sie über eine Anzeige kommen, merken wir uns deren Kennung (z. B. `gclid`, `fbclid`) bis zum
Schließen des Fensters (Sitzungsspeicher `beer_click_ids`, `beer_utm`) und speichern sie mit Ihrer
Anfrage, um später zu sehen, welche Anzeigen zu Aufträgen führen.

| Dienst | Anbieter | Cookies (Laufzeit) | Drittland |
|---|---|---|---|
| Google Ads (Conversion-Tracking, erweiterte Conversions, Remarketing) | Google Ireland Limited, Gordon House, Barrow Street, Dublin 4, Irland | `_gcl_au`, `_gcl_aw` (90 Tage) | USA, DPF |
| Meta-Pixel (Facebook, Instagram) | Meta Platforms Ireland Ltd., Merrion Road, Dublin 4, D04 X2K5, Irland | `_fbp`, `_fbc` (90 Tage) | USA, DPF |
| Pinterest-Tag | Pinterest Europe Ltd., Palmerston House, Fenian Street, Dublin 2, Irland | `_pin_unauth`, `_epik` (1 Jahr) | USA, DPF **[prüfen]** |
| Microsoft Advertising (UET) | Microsoft Ireland Operations Ltd., One Microsoft Place, South County Business Park, Leopardstown, Dublin 18, Irland | `_uetsid` (1 Tag), `_uetvid` (13 Monate), `MUID` (1 Jahr) | USA, DPF |
| TikTok-Pixel | TikTok Technology Ltd., 10 Earlsfort Terrace, Dublin, D02 T380, Irland | `_ttp` (13 Monate) | USA, Singapur, China möglich; Standardvertragsklauseln **[prüfen]** |
| LinkedIn Insight Tag | LinkedIn Ireland Unlimited Company, Wilton Plaza, Wilton Place, Dublin 2, Irland | `li_fat_id` (30 Tage), `li_sugr`, `bcookie` (bis 1 Jahr) | USA, DPF |

Rechtsgrundlage: Art. 6 Abs. 1 lit. a DSGVO, § 25 Abs. 1 TDDDG. Für Google Ads und Meta sind wir
für die Erhebung gemeinsam mit dem Anbieter verantwortlich (Art. 26 DSGVO) **[prüfen: jeweilige
Controller-Vereinbarung]**. Datenschutzhinweise der Anbieter: policies.google.com/privacy,
facebook.com/privacy/policy, policy.pinterest.com/de/privacy-policy, privacy.microsoft.com,
tiktok.com/legal/privacy-policy-eea, linkedin.com/legal/privacy-policy.

Werbe-Einstellungen bei den Anbietern: adssettings.google.com, facebook.com/adpreferences,
pinterest.com/settings/privacy.

## English

### Cookies and consent

On your first visit we ask whether we may use statistics and marketing services. Without
your consent we load none of them and store nothing except your choice. "Reject all" is as
easy as "Accept all".

Your choice is stored in the cookie `beer_consent` (6 months). You can change or withdraw it at
any time via "Cookie settings" at the bottom of every page, with effect for the future; the
services' cookies are then deleted from your browser.

To prove consent (Art. 7(1) GDPR) we store per choice: a random ID (also in the cookie), the
chosen categories, the banner version, the language, the time and the page, but no IP address.
Kept for 3 years **[check]**, on our own automation server (n8n) in the EU **[check host]**.

Legal basis for services that need consent: Art. 6(1)(a) GDPR and § 25(1) TDDDG. For storing
your choice: § 25(2) no. 2 TDDDG and Art. 6(1)(c) GDPR.

### Google Tag Manager

Google Ireland Limited, Gordon House, Barrow Street, Dublin 4, Ireland. Loads the other
services below, sets no cookies itself but sends your IP address to Google. Loaded only after
your consent. Possible transfer to the USA (Google LLC is certified under the EU-US Data
Privacy Framework).

### Statistics

**Umami** (no cookies): page views and clicks counted on our own server, no cookies, no IP
addresses stored. Legal basis: Art. 6(1)(f) GDPR. **Umami session recording** (only with
"Statistics" consent): clicks, scrolling and page changes, to improve our forms; form input is
not recorded **[check]**.

**Google Analytics 4** (only with "Statistics" consent): Google Ireland Limited. Reach and
enquiries; truncated IP, device and browser data, pages, clicks, approximate location. Cookies
`_ga`, `_ga_*` (2 years); data kept 14 months. Possible transfer to the USA (DPF).

### Marketing (only with "Marketing" consent)

Google Ads, Meta Pixel, Pinterest Tag, Microsoft Advertising (UET), TikTok Pixel and LinkedIn
Insight Tag show us whether an ad led to an enquiry and let us show our ads to previous
visitors. Providers, cookies and transfers: see the table in the German section. When you send
the kitchen planner, your e-mail address and phone number are passed on only hashed (SHA-256),
with your postcode. Ad click IDs (e.g. `gclid`, `fbclid`) are kept in session storage until you
close the window and saved with your enquiry. Legal basis: Art. 6(1)(a) GDPR, § 25(1) TDDDG.

## Open points for the legal check

1. Retention of the consent log (3 years proposed) and where n8n is hosted.
2. Umami: version, hosting location, whether the recorder masks form fields.
3. TikTok: transfer basis outside the EU.
4. Joint controllership (Art. 26) for Google Ads and Meta: link the vendors' terms.
5. Whether the click-ID storage with the lead in the CRM needs its own retention period.
6. Newsletter section (separate open item).

> **Entwurf.** Rechtliche Prüfung vor Veröffentlichung erforderlich.
