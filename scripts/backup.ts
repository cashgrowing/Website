/**
 * Weekly backup of the two things that cannot be rebuilt from the repository:
 * the words in Sanity, and the enquiries in Supabase.
 *
 * Everything else - the code, the design, the committed fallback copy - is
 * already in git. These two are not.
 *
 *   node scripts/backup.ts ./backup
 *
 * Skips whatever is not configured rather than failing, so a partial setup
 * still backs up what it can and says what it skipped.
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const outDir = process.argv[2] ?? "./backup";
mkdirSync(outDir, { recursive: true });

const stamp = new Date().toISOString().slice(0, 10);
const done: string[] = [];
const skipped: string[] = [];

async function backupSanity() {
  const projectId = process.env.SANITY_PROJECT_ID;
  const dataset = process.env.SANITY_DATASET ?? "production";
  if (!projectId) {
    skipped.push("Sanity (SANITY_PROJECT_ID not set)");
    return;
  }

  // The export endpoint streams the whole dataset as NDJSON.
  const url = `https://${projectId}.api.sanity.io/v2024-10-01/data/export/${dataset}`;
  const token = process.env.SANITY_API_READ_TOKEN;

  const res = await fetch(url, {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });
  if (!res.ok) {
    throw new Error(`Sanity export failed: ${res.status} ${await res.text()}`);
  }

  const body = await res.text();
  const file = join(outDir, `sanity-${dataset}-${stamp}.ndjson`);
  writeFileSync(file, body);
  done.push(`${file} (${body.split("\n").filter(Boolean).length} documents)`);
}

async function backupInquiries() {
  const url = process.env.SUPABASE_URL?.replace(/\/+$/, "");
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    skipped.push("Supabase (SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY not set)");
    return;
  }

  // Paged, so a growing table does not silently truncate at the API's default.
  const pageSize = 1000;
  const rows: unknown[] = [];
  for (let from = 0; ; from += pageSize) {
    const res = await fetch(
      `${url}/rest/v1/inquiries?select=*&order=created_at.asc&offset=${from}&limit=${pageSize}`,
      { headers: { apikey: key, Authorization: `Bearer ${key}` } },
    );
    if (!res.ok) throw new Error(`Supabase export failed: ${res.status} ${await res.text()}`);
    const page = (await res.json()) as unknown[];
    rows.push(...page);
    if (page.length < pageSize) break;
  }

  const file = join(outDir, `inquiries-${stamp}.json`);
  writeFileSync(file, JSON.stringify(rows, null, 2));
  done.push(`${file} (${rows.length} enquiries)`);
}

const failures: string[] = [];
for (const [name, task] of [
  ["Sanity", backupSanity],
  ["Supabase", backupInquiries],
] as const) {
  try {
    await task();
  } catch (error) {
    failures.push(`${name}: ${error instanceof Error ? error.message : String(error)}`);
  }
}

if (done.length) console.log("Backed up:\n  " + done.join("\n  "));
if (skipped.length) console.log("Skipped:\n  " + skipped.join("\n  "));
if (failures.length) {
  console.error("Failed:\n  " + failures.join("\n  "));
  process.exit(1);
}
