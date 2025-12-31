"use client";

import { useCallback, useMemo, useState } from "react";

type AutomationState =
  | { status: "idle" }
  | { status: "running" }
  | { status: "success"; result: AutomationResult }
  | { status: "error"; message: string };

type AutomationResult = {
  sentTo: string;
  eventsCount: number;
  summary: string;
  windowStart: string;
  windowEnd: string;
};

export default function Home() {
  const [state, setState] = useState<AutomationState>({ status: "idle" });

  const requirements = useMemo(
    () => [
      "GOOGLE_CLIENT_EMAIL",
      "GOOGLE_PRIVATE_KEY",
      "GOOGLE_CALENDAR_ID",
      "OPENAI_API_KEY",
      "TWILIO_ACCOUNT_SID",
      "TWILIO_AUTH_TOKEN",
      "TWILIO_WHATSAPP_FROM",
      "WHATSAPP_TO",
    ],
    [],
  );

  const runAutomation = useCallback(async () => {
    setState({ status: "running" });

    try {
      const response = await fetch("/api/automation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      const payload = await response.json();

      if (!response.ok || !payload.success) {
        throw new Error(payload.error ?? "Automation failed.");
      }

      setState({ status: "success", result: payload.result });
    } catch (error) {
      setState({
        status: "error",
        message: error instanceof Error ? error.message : "Unexpected error.",
      });
    }
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <main className="mx-auto flex w-full max-w-4xl flex-col gap-16 px-6 py-16">
        <section className="flex flex-col gap-6 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 p-10 shadow-2xl ring-1 ring-white/10">
          <div className="flex flex-col gap-2">
            <span className="text-sm uppercase tracking-[0.35em] text-slate-400">
              Agentic Ops
            </span>
            <h1 className="text-4xl font-semibold leading-tight md:text-5xl">
              AI assistant that syncs your calendar to WhatsApp
            </h1>
            <p className="text-lg text-slate-300 md:text-xl">
              Connect Google Calendar, let our AI craft human sounding updates,
              and push them to WhatsApp in one automated flow.
            </p>
          </div>

          <div className="flex flex-col gap-4 rounded-2xl bg-black/40 p-6 ring-1 ring-white/10">
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={runAutomation}
                disabled={state.status === "running"}
                className="inline-flex items-center justify-center rounded-full bg-emerald-500 px-6 py-3 text-sm font-semibold text-emerald-950 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:bg-emerald-500/40"
              >
                {state.status === "running" ? "Running..." : "Run automation"}
              </button>
              {state.status === "success" && (
                <span className="rounded-full bg-emerald-500/10 px-4 py-2 text-xs font-medium text-emerald-300">
                  Sent {state.result.eventsCount} event
                  {state.result.eventsCount === 1 ? "" : "s"} to{" "}
                  {state.result.sentTo}
                </span>
              )}
              {state.status === "error" && (
                <span className="rounded-full bg-rose-500/10 px-4 py-2 text-xs font-medium text-rose-300">
                  {state.message}
                </span>
              )}
            </div>
            <p className="text-sm text-slate-400">
              Tip: schedule a Vercel Cron to POST{" "}
              <code className="rounded bg-white/10 px-2 py-1 font-mono text-xs">
                /api/automation
              </code>{" "}
              daily.
            </p>
          </div>
        </section>

        <section className="grid gap-6 md:grid-cols-2">
          <div className="flex flex-col gap-4 rounded-3xl bg-slate-900/60 p-8 ring-1 ring-white/10">
            <h2 className="text-xl font-semibold text-white">
              What the agent does
            </h2>
            <ul className="space-y-3 text-sm text-slate-300">
              <li className="rounded-2xl bg-white/5 p-4">
                <span className="font-semibold text-slate-100">
                  1. Ingest calendar
                </span>
                <p>Pulls upcoming events with a Google service account.</p>
              </li>
              <li className="rounded-2xl bg-white/5 p-4">
                <span className="font-semibold text-slate-100">
                  2. Generate context
                </span>
                <p>
                  Summarises the agenda with OpenAI for a WhatsApp-ready brief.
                </p>
              </li>
              <li className="rounded-2xl bg-white/5 p-4">
                <span className="font-semibold text-slate-100">
                  3. Ship to WhatsApp
                </span>
                <p>Relays the update via Twilio&apos;s WhatsApp Business API.</p>
              </li>
            </ul>
          </div>
          <div className="flex flex-col gap-4 rounded-3xl bg-slate-900/60 p-8 ring-1 ring-white/10">
            <h2 className="text-xl font-semibold text-white">
              Required environment
            </h2>
            <ul className="grid grid-cols-1 gap-2 text-sm text-slate-300">
              {requirements.map((variable) => (
                <li
                  key={variable}
                  className="flex items-center justify-between rounded-2xl bg-white/5 px-4 py-3 font-mono text-xs uppercase tracking-wide text-slate-200"
                >
                  {variable}
                  <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] text-emerald-300">
                    required
                  </span>
                </li>
              ))}
            </ul>
            <p className="text-xs text-slate-400">
              Optional: set <code className="font-mono">TIMEZONE</code>,{" "}
              <code className="font-mono">AUTOMATION_WINDOW_HOURS</code>, and{" "}
              <code className="font-mono">AUTOMATION_WINDOW_OFFSET_HOURS</code>{" "}
              for custom scheduling.
            </p>
          </div>
        </section>

        {state.status === "success" && (
          <section className="rounded-3xl bg-slate-900/40 p-8 ring-1 ring-white/10">
            <h2 className="text-xl font-semibold text-white">
              Last WhatsApp draft
            </h2>
            <p className="mt-2 text-xs text-slate-400">
              Window: {new Date(state.result.windowStart).toLocaleString()} →{" "}
              {new Date(state.result.windowEnd).toLocaleString()}
            </p>
            <pre className="mt-4 whitespace-pre-wrap rounded-2xl bg-black/60 p-6 text-sm leading-relaxed text-slate-200">
              {state.result.summary}
            </pre>
          </section>
        )}
      </main>
    </div>
  );
}
