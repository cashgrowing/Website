import "server-only";

/**
 * Reads from Sanity over its HTTP query API, with plain fetch.
 *
 * No client library on purpose. `@sanity/client` and `next-sanity` would pull a
 * large dependency into the site for what is one GET request with a query
 * string, and the studio - which genuinely needs those packages - lives in its
 * own workspace under /studio and is deployed separately.
 *
 * The dataset is read with a token so it can stay private. Nothing here ever
 * reaches the browser: the site renders Sanity content on the server.
 */
const API_VERSION = "2024-10-01";

export function isSanityConfigured(): boolean {
  return Boolean(process.env.SANITY_PROJECT_ID && process.env.SANITY_DATASET);
}

type FetchOptions = {
  /** Seconds before Next revalidates. Content changes are not urgent. */
  revalidate?: number;
  params?: Record<string, string | number | boolean>;
};

/**
 * Run a GROQ query. Returns null rather than throwing on any failure, so a
 * Sanity outage degrades to the copy committed in the repo instead of an error
 * page. Callers treat null as "fall back".
 */
export async function sanityQuery<T>(
  query: string,
  { revalidate = 300, params }: FetchOptions = {},
): Promise<T | null> {
  const projectId = process.env.SANITY_PROJECT_ID;
  const dataset = process.env.SANITY_DATASET;
  if (!projectId || !dataset) return null;

  const url = new URL(
    `https://${projectId}.api.sanity.io/v${API_VERSION}/data/query/${dataset}`,
  );
  url.searchParams.set("query", query);
  for (const [key, value] of Object.entries(params ?? {})) {
    url.searchParams.set(`$${key}`, JSON.stringify(value));
  }

  const token = process.env.SANITY_API_READ_TOKEN;

  try {
    const res = await fetch(url, {
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      next: { revalidate, tags: ["sanity"] },
    });

    if (!res.ok) {
      console.error("[sanity] query failed:", res.status, await res.text());
      return null;
    }

    const json = (await res.json()) as { result?: T };
    return json.result ?? null;
  } catch (error) {
    console.error("[sanity] query threw:", error);
    return null;
  }
}
