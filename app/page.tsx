import Link from "next/link";

type Feature = {
  title: string;
  icon: string;
  description: string;
  bullets: string[];
};

type RolloutStep = {
  label: string;
  title: string;
  description: string;
  hint: string;
};

type IntegrationPoint = {
  name: string;
  endpoint: string;
  target: string;
  note: string;
};

type DeploymentPreset = {
  title: string;
  description: string;
  bullets: string[];
};

type ResourceLink = {
  label: string;
  title: string;
  description: string;
  href?: string;
};

const features = [
  {
    title: "Sofort einsatzbereit",
    icon: "⚡️",
    description:
      "Ein universelles Boilerplate, das du direkt auf Kunden- oder interne Server pushen kannst.",
    bullets: [
      "Next.js 15 (App Router) + Tailwind 4",
      "Prisma + Postgres + Mailpit",
      "Token-geschützte Admin- & Chat-APIs",
    ],
  },
  {
    title: "n8n Deep Integration",
    icon: "🕸️",
    description:
      "Webhook-Routen, Auth-Gates und Beispiel-Workflow sorgen für eine nahtlose Orchestrierung.",
    bullets: [
      "Webhook-Proxy `/api/chat` → `N8N_WEBHOOK_URL`",
      "Admin-Token Check per `requireAdminToken`",
      "Beispiel-Workflow unter `n8n_workflows/chatbot.json`",
    ],
  },
  {
    title: "Agent & Blog Ready",
    icon: "🧱",
    description:
      "UI-Bausteine und Prisma-Modelle ermöglichen skalierbare Chat-, Voice- oder Content-Use-Cases.",
    bullets: [
      "Floating Chatbot-Komponente",
      "Blogpost-Modell + Beispielseite",
      "Klares Styling & Theming via Geist Fonts",
    ],
  },
] satisfies Feature[];

const rolloutSteps = [
  {
    label: "1",
    title: ".env vorbereiten",
    description:
      "Aus `env.template` kopieren und Admin-, Datenbank- sowie n8n-Zugänge hinterlegen.",
    hint: "Ohne `X-Admin-Token` sind die Admin-Routen gesperrt.",
  },
  {
    label: "2",
    title: "Stack starten",
    description:
      "Docker-Compose Profile für Web, DB, n8n, Mailpit & PgAdmin sind enthalten.",
    hint: "`make dev-n8n` oder `docker compose --profile dev --profile n8n up -d`.",
  },
  {
    label: "3",
    title: "Flows testen",
    description:
      "n8n-Webhooks mappen, Health-Checks aufrufen und erste Chatbots durchspielen.",
    hint: "`curl /api/health` und `/api/admin/ping` mit Token.",
  },
] satisfies RolloutStep[];

const integrationPoints = [
  {
    name: "Health Check",
    endpoint: "GET /api/health",
    target: "Liveness Probe",
    note: "Antwortet immer mit Status 200 für Monitoring & Load-Balancer.",
  },
  {
    name: "Admin Ping",
    endpoint: "POST /api/admin/ping",
    target: "X-Admin-Token geschützt",
    note: "Nutze ihn für Smoke-Tests nach Deployments.",
  },
  {
    name: "Chat Proxy",
    endpoint: "POST /api/chat",
    target: "→ n8n Webhook `/webhook/chat`",
    note: "Beliebige Payload, Antwort wird 1:1 vom Flow zurückgegeben.",
  },
  {
    name: "n8n Webhook",
    endpoint: "POST /api/webhooks/n8n",
    target: "Server-zu-Server",
    note: "Beispiel für sichere n8n → Next.js Kommunikation.",
  },
] satisfies IntegrationPoint[];

const deploymentPresets = [
  {
    title: "Lokal / Staging",
    description:
      "Nutze die dev-Profile mit Hot-Reload, Mailpit & PgAdmin für schnelle Iterationen.",
    bullets: [
      "`make dev` startet Web + DB",
      "`make dev-n8n` ergänzt n8n & Worker",
      "Env-Wechsel via `make env-dev`",
    ],
  },
  {
    title: "Produktiv-Server",
    description:
      "Caddy-Reverse-Proxy kümmert sich um TLS, der prod-Stack läuft ohne Hot-Reload.",
    bullets: [
      "Setze `SITE_DOMAIN`, `ACME_EMAIL`, optional `N8N_DOMAIN`",
      "`make prod-n8n` baut & startet alles mit TLS",
      "Systemd-/Cron-Einbindung via klassischem Docker Compose",
    ],
  },
] satisfies DeploymentPreset[];

const resourceLinks = [
  {
    label: "Docs",
    title: "README & env.template",
    description: "Dateien im Repo erklären Variablen, Tokens & Profile.",
  },
  {
    label: "Flows",
    title: "n8n Webhook (lokal)",
    description: "http://localhost:5678/webhook/chat",
    href: "http://localhost:5678",
  },
  {
    label: "DB",
    title: "Prisma Studio",
    description: "Mit `make studio` öffnen und Daten prüfen.",
  },
  {
    label: "Coaching",
    title: "AI-Automation-Kurs buchen",
    description: "Unterstützung von Christian Langer & ki-experten-beratung.de.",
    href: "https://ki-experten-beratung.de",
  },
] satisfies ResourceLink[];

export default function Home() {
  return (
    <div className="space-y-16">
      <section className="grid gap-10 rounded-3xl border border-zinc-200 bg-white/70 p-10 shadow-sm ring-1 ring-black/5 dark:border-zinc-800 dark:bg-zinc-900/50 lg:grid-cols-[1.1fr,0.9fr]">
        <div className="space-y-6">
          <span className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-medium text-blue-800 dark:border-blue-500/40 dark:bg-blue-500/10 dark:text-blue-100">
            Next.js + n8n Deployment Template
          </span>
          <div className="space-y-4">
            <h1 className="text-3xl font-semibold leading-tight text-zinc-900 dark:text-zinc-50 md:text-4xl">
              Starte innerhalb von Minuten deine AI-Automation-Webseite.
            </h1>
            <p className="text-lg text-zinc-600 dark:text-zinc-300">
              Diese Landingpage dient als universelles Template: Branding tauschen,
              Texte anpassen – Infrastruktur, Security und n8n-Anbindung bleiben
              einsatzbereit. Ideal für schnelle POCs, Kunden-Demos oder den
              nächsten Launch.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="#install"
              className="inline-flex items-center justify-center rounded-full bg-blue-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-blue-500"
            >
              Template installieren
            </Link>
            <a
              href="https://ki-experten-beratung.de"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center rounded-full border border-zinc-300 px-5 py-2 text-sm font-semibold text-zinc-800 transition hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-100 dark:hover:bg-zinc-800/60"
            >
              AI-Automation-Kurs entdecken
            </a>
            <a
              href="http://localhost:5678"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center rounded-full border border-zinc-300 px-5 py-2 text-sm font-semibold text-zinc-800 transition hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-100 dark:hover:bg-zinc-800/60"
            >
              n8n Dashboard (lokal)
            </a>
          </div>
          <div className="grid grid-cols-1 gap-6 text-sm text-zinc-500 sm:grid-cols-3">
            <div>
              <p className="text-xs uppercase tracking-wide text-zinc-400">
                Deploy Targets
              </p>
              <p className="text-base font-semibold text-zinc-900 dark:text-zinc-50">
                Docker + Caddy
              </p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-zinc-400">
                Integrationen
              </p>
              <p className="text-base font-semibold text-zinc-900 dark:text-zinc-50">
                n8n · Postgres · Mailpit
              </p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-zinc-400">
                Security
              </p>
              <p className="text-base font-semibold text-zinc-900 dark:text-zinc-50">
                X-Admin-Token + Header-Gates
              </p>
            </div>
          </div>
        </div>
        <div className="rounded-2xl border border-zinc-200 bg-white/60 p-6 dark:border-zinc-700 dark:bg-zinc-900/60">
          <div className="space-y-4">
            <div>
              <p className="text-xs uppercase tracking-wide text-zinc-400">
                Schnellstart
              </p>
              <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
                Befehle, die du immer brauchst
              </h2>
            </div>
            <pre className="rounded-2xl bg-black p-5 text-sm text-white">
{`make setup-env
make dev-n8n
open http://localhost:3000`}
            </pre>
            <dl className="grid grid-cols-1 gap-4 text-sm text-zinc-600 dark:text-zinc-300">
              <div>
                <dt className="text-xs uppercase tracking-wide text-zinc-400">
                  Services
                </dt>
                <dd>web, db, n8n, mailpit, pgadmin</dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-wide text-zinc-400">
                  Monitoring
                </dt>
                <dd>curl /api/health · curl /api/admin/ping -H X-Admin-Token</dd>
              </div>
            </dl>
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-wide text-blue-500">
            Bausteine
          </p>
          <h2 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
            Module, die du nach Bedarf aktivierst
          </h2>
          <p className="text-zinc-600 dark:text-zinc-300">
            Passe Texte & Icons an deine Use-Cases an, behalte aber die Struktur,
            um jederzeit neue Seiten oder Integrationen ergänzen zu können.
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {features.map((feature) => (
            <article
              key={feature.title}
              className="flex h-full flex-col rounded-2xl border border-zinc-200 bg-white/70 p-5 dark:border-zinc-800 dark:bg-zinc-900/40"
            >
              <div className="mb-4 flex items-center gap-3 text-zinc-900 dark:text-zinc-50">
                <span className="text-2xl" aria-hidden="true">
                  {feature.icon}
                </span>
                <h3 className="text-lg font-semibold">{feature.title}</h3>
              </div>
              <p className="text-sm text-zinc-600 dark:text-zinc-300">
                {feature.description}
              </p>
              <ul className="mt-4 list-disc space-y-1 pl-5 text-sm text-zinc-500 dark:text-zinc-400">
                {feature.bullets.map((bullet) => (
                  <li key={bullet}>{bullet}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section id="install" className="space-y-6">
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-wide text-blue-500">
            Rollout Guide
          </p>
          <h2 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
            Drei Schritte von Klon bis Live-Schaltung
          </h2>
          <p className="text-zinc-600 dark:text-zinc-300">
            Nutze die Timeline als Checklist für dich oder Kund:innen. Alles ist
            so geschrieben, dass du lediglich Tokens, Domains und Branding
            ersetzen musst.
          </p>
        </div>
        <div className="grid gap-6 lg:grid-cols-[0.9fr,1.1fr]">
          <div className="rounded-2xl border border-zinc-200 bg-white/70 p-6 dark:border-zinc-800 dark:bg-zinc-900/40">
            <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
              Befehls-Referenz
            </h3>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">
              Ersetze `dev` durch `prod`, sobald du auf dem Server bist.
            </p>
            <pre className="mt-4 rounded-2xl bg-black/90 p-5 text-sm text-white">
{`make dev        # Web + DB
make dev-n8n    # inkl. n8n
make dev-logs   # tail -f web-dev`}
            </pre>
            <p className="mt-3 text-xs text-zinc-500">
              Alternativ direkt über `docker compose --profile ...`.
            </p>
          </div>
          <ol className="space-y-4">
            {rolloutSteps.map((step) => (
              <li
                key={step.title}
                className="flex gap-4 rounded-2xl border border-zinc-200 bg-white/70 p-5 dark:border-zinc-800 dark:bg-zinc-900/40"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-sm font-semibold text-white">
                  {step.label}
                </span>
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                    {step.title}
                  </h3>
                  <p className="text-sm text-zinc-600 dark:text-zinc-300">
                    {step.description}
                  </p>
                  <p className="text-xs font-medium text-zinc-500">
                    {step.hint}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="space-y-6">
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-wide text-blue-500">
            Integrationen
          </p>
          <h2 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
            Wichtige Endpunkte & n8n-Schnittstellen
          </h2>
          <p className="text-zinc-600 dark:text-zinc-300">
            Diese Tabelle dient als lebende Doku — perfekt für Onboarding oder
            Handover.
          </p>
        </div>
        <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white/70 dark:border-zinc-800 dark:bg-zinc-900/40">
          <div className="grid divide-y divide-zinc-100 dark:divide-zinc-800">
            {integrationPoints.map((point) => (
              <div
                key={point.endpoint}
                className="grid gap-4 p-5 sm:grid-cols-[1.1fr,0.9fr,1fr]"
              >
                <div>
                  <p className="text-xs uppercase tracking-wide text-zinc-400">
                    Endpoint
                  </p>
                  <p className="font-semibold text-zinc-900 dark:text-zinc-50">
                    {point.endpoint}
                  </p>
                  <p className="text-sm text-zinc-500">{point.name}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wide text-zinc-400">
                    Ziel
                  </p>
                  <p className="text-sm text-zinc-600 dark:text-zinc-300">
                    {point.target}
                  </p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wide text-zinc-400">
                    Hinweis
                  </p>
                  <p className="text-sm text-zinc-600 dark:text-zinc-300">
                    {point.note}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-wide text-blue-500">
            Deploy Optionen
          </p>
          <h2 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
            Wähle dein Ziel – Settings sind bereits vorbereitet
          </h2>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {deploymentPresets.map((preset) => (
            <article
              key={preset.title}
              className="rounded-2xl border border-zinc-200 bg-white/70 p-5 dark:border-zinc-800 dark:bg-zinc-900/40"
            >
              <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                {preset.title}
              </h3>
              <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">
                {preset.description}
              </p>
              <ul className="mt-4 space-y-1 text-sm text-zinc-500 dark:text-zinc-400">
                {preset.bullets.map((bullet) => (
                  <li key={bullet} className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-blue-500" />
                    {bullet}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section className="space-y-6">
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-wide text-blue-500">
            Ressourcen
          </p>
          <h2 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
            Handliche Links für dich oder dein Team
          </h2>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {resourceLinks.map((resource) => {
            const content = (
              <>
                <p className="text-xs font-semibold uppercase tracking-wide text-blue-500">
                  {resource.label}
                </p>
                <h3 className="mt-2 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                  {resource.title}
                </h3>
                <p className="text-sm text-zinc-600 dark:text-zinc-300">
                  {resource.description}
                </p>
              </>
            );

            if (resource.href) {
              const external = resource.href.startsWith("http");
              return (
                <a
                  key={resource.title}
                  href={resource.href}
                  className="rounded-2xl border border-zinc-200 bg-white/70 p-5 transition hover:-translate-y-1 hover:border-blue-500 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900/40"
                  {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
                >
                  {content}
                </a>
              );
            }

            return (
              <div
                key={resource.title}
                className="rounded-2xl border border-dashed border-zinc-300 bg-white/50 p-5 dark:border-zinc-700 dark:bg-zinc-900/30"
              >
                {content}
              </div>
            );
          })}
        </div>
      </section>

      <section className="space-y-6">
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-wide text-blue-500">
            Coaching & Beratung
          </p>
          <h2 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
            Persönliche Unterstützung durch Christian Langer
          </h2>
          <p className="text-zinc-600 dark:text-zinc-300">
            Du möchtest mehr als ein Template? Ich begleite dich bei Strategie,
            Implementierung und Automations-Coaching – remote oder vor Ort.
          </p>
        </div>
        <div className="grid gap-6 lg:grid-cols-[1.1fr,0.9fr]">
          <article className="rounded-2xl border border-zinc-200 bg-white/70 p-6 dark:border-zinc-800 dark:bg-zinc-900/40">
            <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
              Leistungen
            </h3>
            <ul className="mt-4 space-y-2 text-sm text-zinc-600 dark:text-zinc-300">
              <li>• AI-Automations-Strategie & Toolauswahl</li>
              <li>• n8n-Architektur, Security-Review & Deployments</li>
              <li>• Team-Enablement, Kurs- und 1:1-Coaching</li>
              <li>• Done-for-you Integrationen (CRM, Support, Ops)</li>
            </ul>
            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href="mailto:cl@ki-experten-beratung.de"
                className="inline-flex items-center justify-center rounded-full bg-blue-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-blue-500"
              >
                Kontakt aufnehmen
              </a>
              <a
                href="https://ki-experten-beratung.de"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center rounded-full border border-zinc-300 px-5 py-2 text-sm font-semibold text-zinc-800 transition hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-100 dark:hover:bg-zinc-800/60"
              >
                Kurs & Angebote ansehen
              </a>
            </div>
          </article>
          <div className="rounded-2xl border border-zinc-200 bg-white/70 p-6 text-sm text-zinc-600 dark:border-zinc-800 dark:bg-zinc-900/40 dark:text-zinc-300">
            <p className="text-xs uppercase tracking-wide text-zinc-400">
              Ansprechpartner
            </p>
            <p className="mt-2 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
              Christian Langer
            </p>
            <p className="text-sm text-zinc-500">AI-Automation-Manager</p>
            <dl className="mt-4 space-y-2">
              <div>
                <dt className="text-xs uppercase tracking-wide text-zinc-400">
                  E-Mail
                </dt>
                <dd>
                  <a
                    href="mailto:cl@ki-experten-beratung.de"
                    className="font-medium text-blue-600 hover:underline dark:text-blue-400"
                  >
                    cl@ki-experten-beratung.de
                  </a>
                </dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-wide text-zinc-400">
                  Website
                </dt>
                <dd>
                  <a
                    href="https://ki-experten-beratung.de"
                    target="_blank"
                    rel="noreferrer"
                    className="font-medium text-blue-600 hover:underline dark:text-blue-400"
                  >
                    ki-experten-beratung.de
                  </a>
                </dd>
              </div>
            </dl>
            <p className="mt-6 text-xs text-zinc-500">
              Hinweis: Dieses Template darf frei angepasst werden – Coaching und
              Done-for-you-Projekte buche direkt über meine Seite.
            </p>
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-zinc-200 bg-gradient-to-br from-blue-600 to-blue-700 p-10 text-center text-white shadow-xl dark:border-blue-500/40">
        <p className="text-sm uppercase tracking-[0.3em] text-white/70">
          Bereit zum Ausrollen?
        </p>
        <h3 className="mt-4 text-3xl font-semibold">
          Passe Branding an, deploye – und kombiniere das Template mit Coaching,
          wenn du mehr Rückenwind willst.
        </h3>
        <p className="mt-3 text-blue-100">
          Ich helfe dir, AI-Automations vom MVP bis zum Rollout zu begleiten –
          inklusive n8n, Prozesse und Schulung.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link
            href="/blog"
            className="rounded-full bg-white/10 px-6 py-2 text-sm font-semibold text-white ring-1 ring-white/40 transition hover:bg-white/20"
          >
            Blog-Demo ansehen
          </Link>
          <a
            href="mailto:cl@ki-experten-beratung.de"
            className="rounded-full bg-white px-6 py-2 text-sm font-semibold text-blue-700 transition hover:bg-blue-50"
          >
            Kontakt aufnehmen
          </a>
          <a
            href="https://ki-experten-beratung.de"
            target="_blank"
            rel="noreferrer"
            className="rounded-full bg-white px-6 py-2 text-sm font-semibold text-blue-700 transition hover:bg-blue-50"
          >
            AI-Automation-Kurs buchen
          </a>
        </div>
      </section>
    </div>
  );
}
