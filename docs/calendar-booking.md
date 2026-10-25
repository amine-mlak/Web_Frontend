# Connecting the BEER calendar (Microsoft Bookings)

Goal: `/beratung` becomes the appointment booking in the website's design. It shows real free times and enters the appointment in BEER's Microsoft Bookings calendar, the same one as `bookings.cloud.microsoft/book/BEERGmbH@beer.de` today.

## How it fits together

```
Website /beratung ──► Next.js /api/booking/* ──► n8n webhooks ──► Microsoft Graph (Bookings)
   (BEER design)        (spam check, validation)    (holds the Microsoft     │
                                                     credentials)            ▼
                                                              BEER Bookings calendar
                                                              (Outlook calendars of the staff)
```

- The website never sees Microsoft credentials. Only n8n stores them.
- n8n has two webhooks:
  - **availability**: service + date range → free start times;
  - **book**: service + time + customer → creates the appointment and returns a confirmation.
- Microsoft Bookings keeps sending its own confirmation and reminder mails, and the appointment appears in the staff's Outlook calendars as it does today.

## What the Microsoft 365 admin sets up (once, about 15 minutes)

You need someone with the **Global Administrator** or **Privileged Role Administrator** role for beer.de.

1. Open **https://entra.microsoft.com** → *Applications* → *App registrations* → **New registration**.
   - Name: `BEER Website Bookings (n8n)`
   - Supported account types: *Accounts in this organizational directory only*
   - Leave the redirect URI empty → **Register**.
2. On the overview page, note the **Application (client) ID** and the **Directory (tenant) ID**.
3. *Certificates & secrets* → **New client secret** → description `n8n`, validity 24 months → copy the **Value** right away (it's shown only once).
4. *API permissions* → **Add a permission** → *Microsoft Graph* → **Application permissions**:
   - `Bookings.Read.All` (services, staff, free times)
   - `BookingsAppointment.ReadWrite.All` (create appointments)

   Then **Grant admin consent for BEER GmbH**.
5. Put the three values (tenant ID, client ID, client secret) **straight into n8n** (see below). Don't send them by mail or chat.

These two permissions apply only to Bookings. The app can't read mail or other calendars.

## In n8n (n8n.beer.de)

*Credentials* → **New** → *OAuth2 API*:

| Field | Value |
| --- | --- |
| Grant type | Client Credentials |
| Access token URL | `https://login.microsoftonline.com/<tenant ID>/oauth2/v2.0/token` |
| Client ID / Client secret | from step 2 and 3 |
| Scope | `https://graph.microsoft.com/.default` |
| Authentication | Body |

The Bookings calendar ID is the address from the booking link: `BEERGmbH@beer.de`.

## The Graph calls the workflows use

| Purpose | Request |
| --- | --- |
| Services (Showroom 2 h, phone 15 min) | `GET /v1.0/solutions/bookingBusinesses/BEERGmbH@beer.de/services` |
| Staff | `GET …/staffMembers` |
| Free times | `POST …/getStaffAvailability` with `staffIds`, `startDateTime`, `endDateTime` |
| Book | `POST …/appointments` with `serviceId`, `startDateTime`, `endDateTime`, `customers` (name, email, phone), `customerNotes` |

Free start times are worked out from the staff availability, the service duration, and the 15-minute step the current booking page uses.

## On the website

- `/beratung`: service → date → time → details (name, email, phone, address for the phone consultation, "Informationen zur Küche", referral code) → book. It's the same flow as today, in BEER's design.
- The service texts and durations come from Bookings itself. The page texts come from the CMS.
- If Graph can't be reached, the visitor can still send a **request with a preferred time**, which reaches the team through the lead workflow.
- `/kueche-planen` stays the kitchen planner. Its "Danke" screen can offer the booking as the next step.

## Order of work

1. The admin does the setup above.
2. Build the two n8n workflows and test them against the real calendar with a test booking that you cancel again.
3. Build `/beratung` on top, deploy to staging, and make a test booking from the site.
