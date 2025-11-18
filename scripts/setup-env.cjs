#!/usr/bin/env node

const fs = require("node:fs");
const path = require("node:path");
const readline = require("node:readline/promises");
const { stdin, stdout } = require("node:process");

const descriptions = {
  NODE_ENV: "Node.js Umgebung (development oder production)",
  NEXT_PUBLIC_SITE_URL: "Öffentliche URL deiner Webseite",
  COMPOSE_PROFILES: "Docker Compose Profile (z. B. dev oder prod,n8n)",
  SITE_DOMAIN: "Domain ohne Schema für Caddy/HTTPS",
  ACME_EMAIL: "E-Mail für Let's-Encrypt-Benachrichtigungen",
  N8N_DOMAIN: "Optionale Domain, falls n8n öffentlich erreichbar sein soll",
  NEW_REMOTE_URL:
    "Optional: neues Git-Remote (git@github.com:user/repo.git) für automatische Umschaltung",
  POSTGRES_USER: "Postgres Benutzername",
  POSTGRES_DB: "Postgres Datenbankname",
  POSTGRES_PASSWORD: "Postgres Passwort (auch in DATABASE_URL nutzen)",
  DATABASE_URL: "Direkter Prisma-Connection-String",
  ADMIN_TOKEN: "X-Admin-Token für geschützte API-Routen",
  AUTH_DISABLED: "Nur lokal true setzen, um Token-Checks zu deaktivieren",
  N8N_BASIC_AUTH_USER: "n8n Basic-Auth Benutzer",
  N8N_BASIC_AUTH_PASSWORD: "n8n Basic-Auth Passwort",
  N8N_EMAIL_MODE: "E-Mail Modus für n8n (z. B. smtp)",
  N8N_SMTP_HOST: "SMTP Host für n8n (lokal Mailpit)",
  N8N_SMTP_PORT: "SMTP Port für n8n",
  N8N_SMTP_SSL: "true, wenn SMTP über SSL läuft",
  N8N_SMTP_USER: "SMTP Benutzername (falls benötigt)",
  N8N_SMTP_PASS: "SMTP Passwort (falls benötigt)",
  N8N_SMTP_SENDER: "Absenderadresse für n8n-E-Mails",
  N8N_PROTOCOL: "Protokoll für n8n-Links (http oder https)",
  N8N_HOST: "Host/Domain, den n8n in Links verwenden soll",
  N8N_WEBHOOK_URL: "Externe URL, unter der Webhooks erreichbar sind",
  PGADMIN_DEFAULT_EMAIL: "Login-E-Mail für pgAdmin",
  PGADMIN_DEFAULT_PASSWORD: "Passwort für pgAdmin",
  N8N_CHATBOT_WEBHOOK_URL: "Produktiver Webhook-Endpunkt für den Chatbot",
};

const templatePath = path.resolve(__dirname, "..", "env.template");
const targetPath = path.resolve(__dirname, "..", ".env");

async function main() {
  if (!fs.existsSync(templatePath)) {
    console.error(`❌ env.template nicht gefunden unter ${templatePath}`);
    process.exit(1);
  }

  if (fs.existsSync(targetPath)) {
    const confirmRl = readline.createInterface({ input: stdin, output: stdout });
    const answer = (
      await confirmRl.question(
        ".env existiert bereits. Überschreiben? (y/N) "
      )
    )
      .trim()
      .toLowerCase();
    confirmRl.close();

    if (answer !== "y" && answer !== "yes") {
      console.log("➡️  Vorgang abgebrochen – bestehende .env bleibt erhalten.");
      process.exit(0);
    }
  }

  console.log("🔧 Erstelle .env auf Basis von env.template");
  console.log("   Enter oder 'skip' übernimmt den Standardwert, '.' setzt den Wert leer.\n");

  const templateLines = fs.readFileSync(templatePath, "utf8").split(/\r?\n/);
  const rl = readline.createInterface({ input: stdin, output: stdout });
  const resultLines = [];

  try {
    for (const line of templateLines) {
      if (line.trim().length === 0 || line.trim().startsWith("#")) {
        resultLines.push(line);
        continue;
      }

      const separatorIndex = line.indexOf("=");
      if (separatorIndex === -1) {
        resultLines.push(line);
        continue;
      }

      const key = line.slice(0, separatorIndex).trim();
      const defaultValue = line.slice(separatorIndex + 1);
      const description =
        descriptions[key] ?? "Keine Beschreibung hinterlegt (Enter = Standard).";
      const defaultDisplay = defaultValue === "" ? "<leer>" : defaultValue;
      const answer = (
        await rl.question(
          `\n${key}\n  ${description}\n  Standard: ${defaultDisplay}\n> `
        )
      ).trim();

      let finalValue = defaultValue;
      if (answer === ".") {
        finalValue = "";
      } else if (answer.length > 0 && answer.toLowerCase() !== "skip") {
        finalValue = answer;
      }

      resultLines.push(`${key}=${finalValue}`);
    }
  } finally {
    rl.close();
  }

  fs.writeFileSync(targetPath, resultLines.join("\n"), "utf8");
  console.log(`\n✅ .env gespeichert unter ${targetPath}`);
}

main().catch((error) => {
  console.error("❌ Setup fehlgeschlagen:", error);
  process.exit(1);
});

