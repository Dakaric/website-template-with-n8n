import Link from "next/link";

export const metadata = {
  title: "Postgres & Daten-Workflow Guide",
  description:
    "Zugriff auf Postgres, Prisma Studio, pgAdmin und Kommandozeilen-Tools für das Website Starter Template.",
};

const accessOptions = [
  {
    title: "Prisma Studio (Empfohlen lokal)",
    description:
      "Grafische Oberfläche zum Lesen/Schreiben deiner Tabellen. Läuft im Web-Container.",
    command: "docker compose exec web-dev npx prisma studio",
    notes: [
      "Shortcut: `make studio` führt denselben Befehl im dev-Profil aus",
      "Nach dem Start öffnet sich automatisch https://localhost:5555 (bei Bedarf manuell im Browser aufrufen)",
      "Authentifizierung nicht nötig; greift direkt auf `DATABASE_URL` zu",
      "Perfekt zum schnellen Testen neuer Modelle oder Inhalte",
    ],
  },
  {
    title: "pgAdmin (im dev-Profil)",
    description:
      "Web-UI für Admins, praktisch wenn mehrere Datenbanken parallel verwaltet werden.",
    command: "http://localhost:5050",
    notes: [
      "Login mit `PGADMIN_DEFAULT_EMAIL` & `PGADMIN_DEFAULT_PASSWORD`",
      "Nach dem Login: Rechtsklick auf \"Servers\" → Register → Server",
      "Tab Allgemein: sprechenden Namen vergeben (z. B. Website Starter)",
      "Tab Verbindung: Host `db`, Port `5432`, Maintenance DB = `POSTGRES_DB`, Benutzer + Passwort aus `.env` eintragen",
      "Kann (und sollte) in Produktion deaktiviert bleiben – dort arbeitest du über Prisma, direkte `psql`-Sessions oder eigene Bastion Hosts",
    ],
  },
  {
    title: "psql im Container",
    description:
      "Direkter Zugriff via CLI – gut für Skripte, Dumps und Fehleranalysen.",
    command:
      "docker compose exec db psql -U $POSTGRES_USER -d $POSTGRES_DB -h localhost",
    notes: [
      "Innerhalb des Containers kein TLS nötig",
      "Nutze SQL-Dateien via `psql -f file.sql`",
      "Für Dumps: `docker compose exec db pg_dump ... > backup.sql`",
    ],
  },
];

const workflows = [
  {
    title: "Migrationen & Schema",
    steps: [
      "`prisma/schema.prisma` bearbeiten",
      "`docker compose exec web-dev npx prisma migrate dev --name add_field`",
      "Für Prod: `docker compose exec web npx prisma migrate deploy`",
    ],
  },
  {
    title: "Seed / Demo-Daten",
    steps: [
      "Seed-Skripte in `prisma/seed.ts` oder beliebiger Datei erstellen",
      "`docker compose exec web-dev node scripts/seed` (Beispiel)",
      "Alternativ per Prisma Client im `app/api/admin/*` Kontext einspielen",
    ],
  },
  {
    title: "Backups & Restore",
    steps: [
      "`docker compose exec db pg_dump -U $POSTGRES_USER -d $POSTGRES_DB > backup.sql`",
      "Restore: `docker compose exec -T db psql -U $POSTGRES_USER -d $POSTGRES_DB < backup.sql`",
      "Für Prod Backups automatisieren (Cron + Object Storage)",
    ],
  },
];

export default function PostgresGuidePage() {
  return (
    <div className="space-y-12">
      <header className="space-y-6 rounded-3xl border border-zinc-200 bg-white/80 p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/40">
        <div className="flex flex-wrap items-center gap-4">
          <span className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 dark:border-emerald-500/40 dark:bg-emerald-500/10 dark:text-emerald-100">
            Daten & Postgres Guide
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
            So greifst du sicher auf Postgres zu – lokal und auf dem Server
          </h1>
          <p className="text-zinc-600 dark:text-zinc-300">
            Egal ob Prisma Studio, pgAdmin oder `psql`: hier sind die wichtigsten
            Befehle und Best Practices, damit du deine Datenbanken im Blick
            behältst und Änderungen sauber deployen kannst.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <a
            href="https://www.prisma.io/docs/concepts/components/prisma-client"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center rounded-full bg-emerald-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-emerald-500"
          >
            Prisma Docs
          </a>
          <a
            href="https://www.pgadmin.org/docs/"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center rounded-full border border-zinc-300 px-5 py-2 text-sm font-semibold text-zinc-800 transition hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-100 dark:hover:bg-zinc-800/60"
          >
            pgAdmin Docs
          </a>
        </div>
      </header>

      <section className="space-y-4">
        <div>
          <p className="text-xs uppercase tracking-wide text-emerald-500">
            Zugriffsmöglichkeiten
          </p>
          <h2 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
            Wähle das Tool, das zu deinem Workflow passt
          </h2>
        </div>
        <div className="grid gap-6 lg:grid-cols-3">
          {accessOptions.map((option) => (
            <article
              key={option.title}
              className="rounded-2xl border border-zinc-200 bg-white/70 p-6 break-words dark:border-zinc-800 dark:bg-zinc-900/40"
            >
              <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                {option.title}
              </h3>
              <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">
                {option.description}
              </p>
              <pre className="mt-4 overflow-x-auto rounded-2xl bg-black/90 p-4 text-xs text-white">
                {option.command}
              </pre>
              <ul className="mt-4 space-y-2 text-sm text-zinc-600 dark:text-zinc-300">
                {option.notes.map((note) => (
                  <li key={note} className="flex gap-2">
                    <span className="text-emerald-500">•</span>
                    <span>{note}</span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section className="space-y-6">
        <div>
          <p className="text-xs uppercase tracking-wide text-emerald-500">
            Arbeitsabläufe
          </p>
          <h2 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
            Migrationen, Seeds & Backups
          </h2>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {workflows.map((flow) => (
            <article
              key={flow.title}
              className="rounded-2xl border border-zinc-200 bg-white/70 p-6 dark:border-zinc-800 dark:bg-zinc-900/40"
            >
              <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                {flow.title}
              </h3>
              <ol className="mt-4 space-y-2 text-sm text-zinc-600 dark:text-zinc-300">
                {flow.steps.map((step, index) => (
                  <li key={step} className="flex gap-3">
                    <span className="text-xs font-semibold text-emerald-500">
                      {index + 1}.
                    </span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            </article>
          ))}
        </div>
      </section>

      <section className="space-y-4 rounded-3xl border border-zinc-200 bg-emerald-600/10 p-8 text-sm text-zinc-700 dark:border-emerald-500/30 dark:text-zinc-200">
        <h2 className="text-2xl font-semibold text-emerald-700 dark:text-emerald-300">
          Häufige Fragen
        </h2>
        <div className="space-y-3">
          <div>
            <p className="font-semibold text-zinc-900 dark:text-zinc-50">
              Wie verbinde ich lokale Tools wie TablePlus oder DBeaver?
            </p>
            <p>
              Nutze `localhost:5432`, User/Pass aus `.env` und aktiviere ggf.
              SSH-Tunneling, wenn du in Docker unterwegs bist. In Prod solltest
              du den DB-Port nicht öffentlich freigeben – arbeite über SSH-Tunnel
              oder Admin-APIs.
            </p>
          </div>
          <div>
            <p className="font-semibold text-zinc-900 dark:text-zinc-50">
              Wie ändere ich Passwörter sicher?
            </p>
            <p>
              Aktualisiere `.env`, führe `make setup-prod` oder die relevanten
              Docker-Neustarts durch und rotiere Secrets sowohl in der DB als
              auch in `DATABASE_URL`. Vergiss nicht, Services neu zu starten.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

