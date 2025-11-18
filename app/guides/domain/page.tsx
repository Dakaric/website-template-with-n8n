import Link from "next/link";

export const metadata = {
  title: "Domain-Setup & DNS Anleitung",
  description:
    "Schritt-für-Schritt-Anleitung zum Kauf einer Domain (z. B. bei Namecheap) und zur Konfiguration von DNS-Einträgen für Web + n8n.",
};

const steps = [
  {
    title: "Domain bei Namecheap kaufen",
    bullets: [
      "Öffne https://www.namecheap.com und suche dir eine freie Domain (z. B. deineagentur.de).",
      "Leg ein Konto an oder logge dich ein und schließe den Kauf ab.",
      "Aktiviere kostenloses DNS (Namecheap Basic DNS) – reicht aus, solange kein externer Provider genutzt wird.",
    ],
  },
  {
    title: "DNS-Records anlegen",
    bullets: [
      "Im Namecheap Dashboard → Domain List → Manage → Advanced DNS wechseln.",
      "Lege A-Records für die Hauptdomain (`@`) und für Subdomains an, die auf deinen Server zeigen.",
      "Für IPv6 kannst du zusätzlich AAAA-Einträge setzen (optional).",
    ],
  },
  {
    title: "Caddy / Docker vorbereiten",
    bullets: [
      "Trage `SITE_DOMAIN` und (optional) `N8N_DOMAIN` in deiner `.env` ein.",
      "Nutze `make setup-prod` – das Script sorgt dafür, dass Docker & Compose installiert sind.",
      "Starte anschließend `make prod-n8n`, damit Caddy Zertifikate via Let’s Encrypt zieht.",
    ],
  },
  {
    title: "Finale Checks",
    bullets: [
      "Nutze `dig deineagentur.de A` bzw. `nslookup`, um sicherzustellen, dass die DNS-Einträge live sind.",
      "`curl -I https://deineagentur.de` sollte nach einigen Minuten ein gültiges Zertifikat liefern.",
      "Für n8n z. B. `https://n8n.deineagentur.de` testen (Basic Auth aus `.env`).",
    ],
  },
];

const records = [
  {
    host: "@",
    type: "A",
    value: "123.45.67.89",
    ttl: "Automatic",
    purpose: "Hauptdomain (Landingpage / Next.js)",
  },
  {
    host: "@",
    type: "AAAA",
    value: "2001:db8::1 (optional)",
    ttl: "Automatic",
    purpose: "IPv6, falls Server eine Adresse hat",
  },
  {
    host: "n8n",
    type: "A",
    value: "123.45.67.89",
    ttl: "Automatic",
    purpose: "Subdomain für n8n",
  },
  {
    host: "n8n",
    type: "AAAA",
    value: "2001:db8::1 (optional)",
    ttl: "Automatic",
    purpose: "IPv6 für n8n-Subdomain",
  },
];

export default function DomainGuidePage() {
  return (
    <div className="space-y-12">
      <header className="space-y-6 rounded-3xl border border-zinc-200 bg-white/80 p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/40">
        <div className="flex flex-wrap items-center gap-4">
          <span className="inline-flex items-center rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 dark:border-blue-500/40 dark:bg-blue-500/10 dark:text-blue-100">
            Domain Setup Guide
          </span>
          <Link
            href="/"
            className="text-sm font-medium text-blue-600 hover:underline dark:text-blue-400"
          >
            Zurück zur Startseite
          </Link>
        </div>
        <div className="space-y-3">
          <h1 className="text-3xl font-semibold text-zinc-900 dark:text-zinc-50">
            Domain kaufen, DNS setzen & n8n Subdomains vorbereiten
          </h1>
          <p className="text-zinc-600 dark:text-zinc-300">
            Diese Anleitung zeigt dir, wie du bei Namecheap eine Domain sicherst,
            DNS-Einträge für deine Webseite und n8n anlegst und anschließend per
            `make setup-prod`/`make prod-n8n` live gehst.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <a
            href="https://www.namecheap.com/domains/domain-name-search/"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center rounded-full bg-blue-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-blue-500"
          >
            Domain bei Namecheap suchen
          </a>
          <a
            href="https://docs.namecheap.com/domains/dns/"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center rounded-full border border-zinc-300 px-5 py-2 text-sm font-semibold text-zinc-800 transition hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-100 dark:hover:bg-zinc-800/60"
          >
            Namecheap DNS Docs
          </a>
        </div>
      </header>

      <section className="space-y-6">
        <h2 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
          Schritt-für-Schritt Plan
        </h2>
        <div className="grid gap-6 lg:grid-cols-2">
          {steps.map((step) => (
            <article
              key={step.title}
              className="rounded-2xl border border-zinc-200 bg-white/70 p-6 dark:border-zinc-800 dark:bg-zinc-900/40"
            >
              <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                {step.title}
              </h3>
              <ul className="mt-4 space-y-2 text-sm text-zinc-600 dark:text-zinc-300">
                {step.bullets.map((bullet) => (
                  <li key={bullet} className="flex gap-2">
                    <span className="text-blue-500">•</span>
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <div>
          <p className="text-xs uppercase tracking-wide text-blue-500">
            DNS-Konfiguration
          </p>
          <h2 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
            Beispiel-Records für Web & n8n
          </h2>
        </div>
        <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white/70 dark:border-zinc-800 dark:bg-zinc-900/40">
          <div className="grid grid-cols-5 border-b border-zinc-100 bg-zinc-50 px-4 py-2 text-xs font-semibold uppercase text-zinc-500 dark:border-zinc-800 dark:bg-zinc-900">
            <span>Host</span>
            <span>Typ</span>
            <span>Wert</span>
            <span>TTL</span>
            <span>Verwendung</span>
          </div>
          {records.map((record) => (
            <div
              key={`${record.host}-${record.type}`}
              className="grid grid-cols-5 gap-2 border-t border-zinc-100 px-4 py-3 text-sm text-zinc-700 dark:border-zinc-800 dark:text-zinc-200"
            >
              <span>{record.host}</span>
              <span>{record.type}</span>
              <span className="font-mono text-xs">{record.value}</span>
              <span>{record.ttl}</span>
              <span>{record.purpose}</span>
            </div>
          ))}
        </div>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Tipp: Wenn dein Server eine feste IPv4 hat, reichen die A-Records. Für
          IPv6-Only oder Dual-Stack brauchst du zusätzlich AAAA-Einträge.
        </p>
      </section>

      <section className="space-y-4 rounded-3xl border border-zinc-200 bg-gradient-to-br from-zinc-900 to-zinc-800 p-8 text-white">
        <h2 className="text-2xl font-semibold">Deployment-Checkliste</h2>
        <ol className="space-y-3 text-sm">
          <li>1. `make setup-prod` ausführen → Script prüft/ installiert Docker & Compose.</li>
          <li>2. `.env` mit Produktionswerten speichern (`SITE_DOMAIN`, `N8N_DOMAIN`).</li>
          <li>3. `make prod-n8n` starten, Caddy kümmert sich um HTTPS.</li>
          <li>4. Health-Checks testen: `curl -k https://<domain>/api/health`.</li>
          <li>5. n8n Basic Auth verifizieren: `curl -I -u user:pass https://n8n.<domain>`.</li>
        </ol>
        <p className="text-sm text-white/80">
          Sobald DNS propagiert ist (5–15 Minuten), wird Caddy automatisch valide
          Zertifikate erstellen. Falls du weitere Subdomains brauchst, einfach
          zusätzliche Records + Caddy-Sites ergänzen.
        </p>
      </section>
    </div>
  );
}

