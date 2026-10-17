#!/usr/bin/env node
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

const LOCAL_HOSTS = new Set(["localhost", "127.0.0.1", "::1"]);

export function normalizeOrigin(raw, label) {
  if (typeof raw !== "string" || !raw.trim()) {
    throw new Error(label + " is required.");
  }
  let url;
  try {
    url = new URL(raw);
  } catch {
    throw new Error(label + " must be a valid absolute URL.");
  }
  const localHttp = url.protocol === "http:" && LOCAL_HOSTS.has(url.hostname);
  if (url.protocol !== "https:" && !localHttp) {
    throw new Error(label + " must use HTTPS, except for localhost development.");
  }
  if (url.username || url.password || url.search || url.hash || url.pathname !== "/") {
    throw new Error(label + " must be an origin only, without credentials, path, query or fragment.");
  }
  return url.origin;
}

async function requireSuccess(fetchImpl, url, init, label, timeoutMs) {
  let response;
  try {
    response = await fetchImpl(url, {
      ...init,
      redirect: "follow",
      signal: AbortSignal.timeout(timeoutMs),
    });
  } catch {
    throw new Error("Request failed or timed out.");
  }
  if (!response.ok) throw new Error("Expected a 2xx response; received HTTP " + response.status + ".");
  return response;
}

async function readJson(response, label) {
  try {
    return await response.json();
  } catch {
    throw new Error(label + " did not return valid JSON.");
  }
}

export async function runDeploymentSmoke({
  siteUrl,
  apiUrl,
  databaseRequired = true,
  fetchImpl = globalThis.fetch,
  timeoutMs = 15000,
} = {}) {
  const siteOrigin = normalizeOrigin(siteUrl, "SITE_URL");
  const apiOrigin = normalizeOrigin(apiUrl, "API_URL");
  const results = [];

  async function check(name, run) {
    try {
      await run();
      results.push({ name, status: "passed" });
    } catch (error) {
      results.push({
        name,
        status: "failed",
        detail: error instanceof Error ? error.message : "Unexpected check failure.",
      });
    }
  }

  await check("Frontend homepage", async () => {
    await requireSuccess(fetchImpl, siteOrigin + "/", {}, "Frontend homepage", timeoutMs);
  });

  await check("robots.txt points to the deployed sitemap", async () => {
    const response = await requireSuccess(fetchImpl, siteOrigin + "/robots.txt", {}, "robots.txt", timeoutMs);
    const body = await response.text();
    if (!body.includes(siteOrigin + "/sitemap.xml")) {
      throw new Error("robots.txt does not reference the configured canonical sitemap URL.");
    }
  });

  await check("Sitemap contains only the configured canonical origin", async () => {
    const response = await requireSuccess(fetchImpl, siteOrigin + "/sitemap.xml", {}, "sitemap.xml", timeoutMs);
    const body = await response.text();
    if (!/<(?:urlset|sitemapindex)\b/i.test(body)) {
      throw new Error("sitemap.xml does not contain a sitemap document.");
    }
    const locations = [...body.matchAll(/<loc>\s*([^<]+)\s*<\/loc>/gi)]
      .map((match) => match[1].trim().replace(/&amp;/g, "&"));
    if (locations.length === 0) throw new Error("sitemap.xml contains no URL locations.");
    for (const location of locations) {
      let parsed;
      try {
        parsed = new URL(location);
      } catch {
        throw new Error("sitemap.xml contains an invalid URL.");
      }
      if (parsed.origin !== siteOrigin) {
        throw new Error("sitemap.xml contains a URL outside SITE_URL.");
      }
    }
  });

  await check("API liveness", async () => {
    const response = await requireSuccess(fetchImpl, apiOrigin + "/api/health", {}, "API health", timeoutMs);
    const body = await readJson(response, "API health");
    if (body.status !== "ok" || body.service !== "moundweb-api") {
      throw new Error("API health response does not match the expected service identity.");
    }
  });

  if (databaseRequired) {
    await check("API and database readiness", async () => {
      const response = await requireSuccess(fetchImpl, apiOrigin + "/api/ready", {}, "API readiness", timeoutMs);
      const body = await readJson(response, "API readiness");
      if (body.status !== "ready" || body.database !== "reachable") {
        throw new Error("API readiness did not confirm database connectivity.");
      }
    });
  } else {
    results.push({
      name: "API and database readiness",
      status: "skipped",
      detail: "Explicitly skipped. This is not a production release pass.",
    });
  }

  await check("Submission status endpoint fails closed", async () => {
    const response = await requireSuccess(fetchImpl, apiOrigin + "/api/submission-status", {}, "Submission status", timeoutMs);
    const body = await readJson(response, "Submission status");
    if (typeof body.enabled !== "boolean") {
      throw new Error("Submission status must expose a boolean enabled field.");
    }
    if (body.enabled && (typeof body.noticeVersion !== "string" || !body.noticeVersion || body.noticeVersion === "pending")) {
      throw new Error("Enabled submissions must expose an approved privacy notice version.");
    }
    if (!body.enabled && body.noticeVersion !== null) {
      throw new Error("Disabled submissions must not expose an active privacy notice version.");
    }
  });

  await check("Credentialed API CORS allows the exact site origin", async () => {
    const response = await requireSuccess(
      fetchImpl,
      apiOrigin + "/api/v1/inquiries",
      {
        method: "OPTIONS",
        headers: {
          Origin: siteOrigin,
          "Access-Control-Request-Method": "POST",
          "Access-Control-Request-Headers": "content-type",
        },
      },
      "API CORS preflight",
      timeoutMs,
    );
    if (response.headers.get("access-control-allow-origin") !== siteOrigin) {
      throw new Error("API CORS does not allow the exact SITE_URL origin.");
    }
    if (response.headers.get("access-control-allow-credentials") !== "true") {
      throw new Error("API CORS must allow credentials for admin session cookies.");
    }
  });

  return {
    ok: results.every((result) => result.status !== "failed"),
    results,
  };
}

function usage() {
  return [
    "Usage:",
    "  SITE_URL=https://www.example.com API_URL=https://api.example.com npm run smoke:deployment",
    "  SITE_URL=https://www.example.com API_URL=https://api.example.com npm run smoke:deployment -- --skip-database-check",
    "",
    "The database check is required by default. Skipping it is only for an early infrastructure check, never final release acceptance.",
  ].join("\n");
}

async function main() {
  const args = process.argv.slice(2);
  if (args.includes("--help")) {
    console.log(usage());
    return;
  }
  const unknown = args.filter((argument) => argument !== "--skip-database-check");
  if (unknown.length) throw new Error("Unknown argument: " + unknown[0] + "\n" + usage());
  const result = await runDeploymentSmoke({
    siteUrl: process.env.SITE_URL,
    apiUrl: process.env.API_URL,
    databaseRequired: !args.includes("--skip-database-check"),
  });
  for (const item of result.results) {
    const detail = item.detail ? " (" + item.detail + ")" : "";
    console.log(item.status.toUpperCase() + "  " + item.name + detail);
  }
  if (!result.ok) process.exitCode = 1;
}

const invokedPath = process.argv[1] ? resolve(process.argv[1]) : "";
if (invokedPath === fileURLToPath(import.meta.url)) {
  main().catch((error) => {
    console.error(error instanceof Error ? error.message : "Deployment smoke check failed.");
    process.exitCode = 2;
  });
}
