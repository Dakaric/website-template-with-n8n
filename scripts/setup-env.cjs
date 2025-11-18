#!/usr/bin/env node

const fs = require("node:fs");
const path = require("node:path");
const readline = require("node:readline/promises");
const { stdin, stdout } = require("node:process");

const templatePath = path.resolve(__dirname, "..", "env.template");
const targetPath = path.resolve(__dirname, "..", ".env");

function findArgValue(flag) {
  const prefix = `--${flag}=`;
  const hit = process.argv.find((arg) => arg.startsWith(prefix));
  return hit ? hit.slice(prefix.length) : "";
}

const scopeFromEnv = process.env.SETUP_ENV_SCOPE || findArgValue("scope");
const featuresFromEnv =
  process.env.SETUP_FEATURES || findArgValue("features");
const activeScope = scopeFromEnv ? scopeFromEnv.trim().toLowerCase() : "";

function parseFeatureList(input) {
  return input
    ? input
        .split(",")
        .map((entry) => entry.trim().toLowerCase())
        .filter(Boolean)
    : [];
}

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

  const templateLines = fs.readFileSync(templatePath, "utf8").split(/\r?\n/);
  const rl = readline.createInterface({ input: stdin, output: stdout });
  const resultLines = [];
  let pendingMeta = null;
  const activeFeatures = new Set(parseFeatureList(featuresFromEnv));

  if (!featuresFromEnv) {
    const includeN8n = await askYesNo(
      rl,
      "n8n Integration konfigurieren? (Y/n)",
      true,
    );
    if (includeN8n) {
      activeFeatures.add("n8n");
    }
  }

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

      const featureList = Array.isArray(meta?.features)
        ? meta.features.map((f) => String(f).toLowerCase())
        : null;
      const featureIncluded =
        !featureList ||
        featureList.length === 0 ||
        featureList.some((feature) => activeFeatures.has(feature));

      if (!scopeIncluded || !featureIncluded) {
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

async function askYesNo(rl, question, defaultYes = true) {
  const hint = defaultYes ? "(Y/n)" : "(y/N)";
  const answer = (
    await rl.question(`${question} ${hint} `)
  ).trim().toLowerCase();

  if (!answer) {
    return defaultYes;
  }

  if (["y", "yes", "j", "ja"].includes(answer)) {
    return true;
  }
  if (["n", "no", "nein"].includes(answer)) {
    return false;
  }
  return defaultYes;
}

main().catch((error) => {
  console.error("❌ Setup fehlgeschlagen:", error);
  process.exit(1);
});
