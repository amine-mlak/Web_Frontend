# Mautic plan: mail sequences by the way a contact reached BEER

Status 2026-11-12: Amine chose to start small: the newsletter with its opt-in, and the planner
sequence by interest. The other doors follow later. Mautic 7.2.2 runs on BEER's Coolify, still on a
temporary address. Nothing sends yet: Mautic has no own address and no confirmed mail sending, and
the website hand-over is off until `MAUTIC_URL` is set.

## Built so far

**Newsletter (set up by another agent, kept as it is):**
- Form 1 "Newsletter anmelden" → tag newsletter-pending, segment "Newsletter – unbestätigt", sends mail 8 (confirmation).
- Landing page "Newsletter bestätigen" with form 13 → tag newsletter-bestaetigt, segment "Newsletter – bestätigt" (id 2).
- Campaign 1 "Newsletter Willkommen & Pflege": welcome at once, projects after 7 days, showroom after 14 more.

**Planner (new):**
- Contact fields `beer_budget`, `beer_stil`, `beer_fronten`, `beer_arbeitsplatte`, `beer_geraete`, `beer_form`,
  `beer_vorhaben`, `beer_grundriss` (text; they hold the German labels the visitor picked).
- Form 17 "Küchenplaner (Website)": takes the lead from the website, sets tag kuechenplaner and segment
  "Küchenplaner" (id 6), sends mail 9 "Planer: Ihre Angaben" (their choices, link to the projects).
- Mails 10 to 14 "Planer Tag 3": one per worktop material (Naturstein, Keramik, Edelstahl, Massivholz) and a
  general one; mail 15 "Planer Tag 10: Ausstellung". The material facts are BEER's own care notes.
- Campaign 6 "Küchenplaner: Folge-Mails nach Interesse" (inactive): only for planner contacts who confirmed the
  newsletter. After 3 days the mail for the worktop they picked, after 10 days the showroom invitation.
  Planner contacts without newsletter consent get mail 9 only.

**Website (branch `feature/mautic-intake`):** `lib/mautic.ts` posts planner leads to form 17 and newsletter
sign-ups to form 1 once `MAUTIC_URL` is set. Until then sign-ups keep going to the n8n newsletter.

## Before it goes live

- Mautic gets its own address; the confirmation link in mail 8 and the landing pages use it.
- Mail sending set up and tested; background jobs (segments, campaigns, send queue) running.
- BEER reads mails 8 to 15 and 1 to 3. Mails 1 to 8 open with a broken greeting ("Guten Tag true .") and
  mail 1 has the line "Kein Takt. Kein Druck."; both need fixing.
- The mails link to www.beer.de, so they only work once the new site is live there.
- Form 17 has no honeypot yet; add one before `MAUTIC_URL` is set in production.
- Set `MAUTIC_URL` in Coolify, send one test lead and one test sign-up, then switch campaign 6 on.
- Not used by this plan and still in Mautic: forms 14 to 16, campaigns 3 to 5, mails 4 to 6, three landing
  pages, the stages. They can stay or be removed by hand.

## Roles

- **Website:** keeps its own forms (planner, newsletter sign-up, contact, later the appointment booking).
- **n8n:** passes each lead or sign-up to Mautic: creates or updates the contact, sets door, stage and fields.
- **Mautic:** contacts, stages, segments, sequences, sending, the call list for the team.
- The newsletter built in n8n (own subscriber tables and sending) is retired once Mautic sends.

## Contact fields (custom)

| Field | Alias | Type | Filled from |
|---|---|---|---|
| Door | `beer_door` | select: planer, termin, ausstellung, newsletter | n8n / team |
| Budget range | `beer_budget` | select: bis 35.000 €, 35.000 – 70.000 €, 70.000 – 100.000 €, über 100.000 €, keine Angabe | planner |
| Style | `beer_stil` | multiselect | planner |
| Fronts | `beer_fronten` | multiselect | planner |
| Worktop | `beer_arbeitsplatte` | multiselect | planner |
| Appliances | `beer_geraete` | multiselect | planner |
| Kitchen shape | `beer_form` | select | planner |
| Project | `beer_vorhaben` | select: Neubau, Umbau, … | planner |
| Floor plan sent | `beer_grundriss` | yes/no | planner |
| Postcode / town | core `zipcode`, `city` | text | planner |
| Appointment date | `beer_termin` | date and time | booking (Outlook, later) / team |
| Showroom visit date | `beer_besuch` | date | team |
| Newsletter confirmed | `beer_newsletter` | yes/no | double opt-in |

Option values are the planner's own values, so n8n can pass them through unchanged.

## Stages

1. Neu (address known, nothing else)
2. Qualifiziert (planner finished)
3. Termin gebucht
4. Ausstellung besucht
5. Angebot
6. Kunde
7. Verloren

Stages 4 to 7 are set by the team. Without that, the showroom, quote and customer sequences never start.

## Segments

- One per door: Planer, Termin, Ausstellung, Newsletter.
- One per stage that starts a sequence: Planer ohne Termin, Termin gebucht, Ausstellung besucht, Angebot offen, Kunden.
- Newsletter bestätigt (the only segment that gets the monthly mail).
- Interest segments from the planner fields and from clicks: by style, by worktop material, by region.
- Anrufen diese Woche: points above the threshold, stage below Angebot.

## Sequences

| Door / stage | Mails | Ends when |
|---|---|---|
| Planner, no appointment | Day 0: their choices and two matching kitchens. Day 3: the material and appliance pages they picked. Day 10: invitation to the showroom | appointment booked |
| Appointment booked | At once: confirmation, what to bring, link to the planner if it is empty. Day before: reminder | the visit |
| Showroom visited | Day 1: thank-you and what was discussed. Day 7: a reference kitchen near them | quote sent |
| Quote open | Day 5: answers on cost and timing. Day 14: invitation to look at materials again | customer or lost |
| Newsletter only | Welcome series of three, then the monthly mail | they unsubscribe |
| Customer | After fitting: care notes for their materials. After 12 months: check-in, review and referral request | – |

Each mail takes its project, material page or guide from the website by the contact's interests.
Mail texts are written in German first; nothing is sent until BEER has read them.

## Points

| Signal | Points |
|---|---|
| Budget 35.000 – 70.000 € | 10 |
| Budget above 70.000 € | 20 |
| Floor plan sent | 15 |
| Postcode in BEER's area | 10 |
| Appointment booked | 30 |
| Click in a mail | 3 each |
| Visit to /beratung or /kontakt after a mail | 10 |

Threshold for the call list: 40. The numbers are a first guess and get adjusted after a month of leads.

## Build order

1. Foundation: own address for Mautic, sending sub-domain with SPF, DKIM and DMARC, background jobs,
   legal footer, privacy page. Then fields, stages and segments from this file.
2. Planner door: n8n step from the lead to Mautic, the three planner mails.
3. Newsletter door: double opt-in through Mautic, welcome series, the monthly mail.
4. Showroom door: the team adds the visit or sets the stage.
5. Appointment door: with the Outlook booking.
6. Points and the call list.

## Open, needs Amine or BEER

- Address for Mautic and the sending sub-domain; the DNS records.
- Which mail service sends.
- An API user for n8n in Mautic (Amine enters the credentials in n8n).
- Who at BEER owns the monthly mail and keeps the stages current.
- Website tracking by Mautic only after consent in the cookie banner; wording for the privacy page.
