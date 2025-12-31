## Agentic Calendar → WhatsApp automation

This project ships an agentic workflow that pulls events from Google Calendar, drafts a natural-language update with OpenAI, and pushes the message to WhatsApp via Twilio.

### Features

- Google Calendar ingestion via service account credentials.
- Agenda summarisation powered by OpenAI (falls back to a deterministic digest if no key is supplied).
- WhatsApp delivery using Twilio's Business API.
- One-click manual trigger plus guidance for wiring up Vercel Cron.

### Configuration

Create an `.env.local` (or configure environment variables in Vercel) using `.env.example` as a reference:

```bash
cp .env.example .env.local
```

Provide credentials for:

- Google Cloud service account with Calendar read access.
- OpenAI API key.
- Twilio WhatsApp sandbox or Business profile (from/to numbers must include country codes).

Optional tuning knobs:

- `TIMEZONE` – displayed in summaries (defaults to `UTC`).
- `AUTOMATION_WINDOW_HOURS` – how long of a window to scan (default `24`).
- `AUTOMATION_WINDOW_OFFSET_HOURS` – shift the window into the future.

### Local development

```bash
npm install
npm run dev
```

Visit http://localhost:3000 to run the assistant UI and trigger automations.

### Production

Deploy with Vercel. For scheduled sends, add a Vercel Cron that POSTs `/api/automation` on your desired cadence.
