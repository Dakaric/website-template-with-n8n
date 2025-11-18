#!/usr/bin/env node

const fs = require("node:fs");
const path = require("node:path");
const readline = require("node:readline/promises");
const { stdin, stdout } = require("node:process");

const templatePath = path.resolve(__dirname, "..", "env.template");
const targetPath = path.resolve(__dirname, "..", ".env");
const scopeFromEnv =
  process.env.SETUP_ENV_SCOPE ||
  (process.argv.find((arg) => arg.startsWith("--scope=")) || "")
    .split("=")[1];
const activeScope = scopeFromEnv ? scopeFromEnv.trim().toLowerCase() : "";

async function main() {
  if (!fs.existsSync(templatePath)) {
    console.error(`❌ env.template nicht gefunden unter ${templatePath}`);
    process.exit(1);
  }

  if (fs.existsSync(targetPath)) {
    const confirmRl = readline.createInterface({ input: stdin, output: stdout });
    const answer = (
      await confirmRl.question(
        ".env existiert bereits. Überschreiben? (y/N) ",
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
  if (activeScope) {
    console.log(`   Setup-Modus: ${activeScope}`);
  }
  console.log(
    "   Enter oder 'skip' übernimmt den Standardwert, '.' setzt den Wert leer.\n",
  );

  const templateLines = fs
    .readFileSync(templatePath, "utf8")
    .split(/\r?\n/);
  const rl = readline.createInterface({ input: stdin, output: stdout });
  const resultLines = [];
  let pendingMeta = null;

  try {
    for (const line of templateLines) {
      const trimmed = line.trim();

      if (trimmed.startsWith("# @meta")) {
        const json = trimmed.slice(7).trim();
        try {
          pendingMeta = JSON.parse(json);
        } catch (err) {
          console.warn(`⚠️  Konnte Meta-Daten nicht parsen (${json}):`, err);
          pendingMeta = null;
        }
        continue;
      }

      if (trimmed.length === 0 || trimmed.startsWith("#")) {
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
      const meta = pendingMeta;
      pendingMeta = null;

      const scopeList = Array.isArray(meta?.scopes)
        ? meta.scopes.map((s) => String(s).toLowerCase())
        : null;
      const scopeIncluded =
        !activeScope ||
        !scopeList ||
        scopeList.length === 0 ||
        scopeList.includes(activeScope);

      if (!scopeIncluded) {
        resultLines.push(line);
        continue;
      }

      const description =
        meta?.description ??
        "Keine Beschreibung hinterlegt (Enter = Standard).";
      const scopedDefault = pickScopedValue(meta?.defaults, defaultValue);
      const placeholder =
        pickScopedValue(meta?.placeholders || meta?.placeholder, scopedDefault) ??
        "";
      const defaultDisplay =
        placeholder && placeholder.length > 0
          ? placeholder
          : scopedDefault || "<leer>";

      const answer = (
        await rl.question(
          `\n${key}\n  ${description}\n  Standard: ${defaultDisplay}\n> `,
        )
      ).trim();

      let finalValue = scopedDefault ?? defaultValue;
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

function pickScopedValue(source, fallback) {
  if (!source) {
    return fallback;
  }

  if (typeof source === "string") {
    return source;
  }

  if (typeof source === "object") {
    if (activeScope && source[activeScope] !== undefined) {
      return source[activeScope];
    }
    if (source.all !== undefined) {
      return source.all;
    }
  }

  return fallback;
}

main().catch((error) => {
  console.error("❌ Setup fehlgeschlagen:", error);
  process.exit(1);
});
