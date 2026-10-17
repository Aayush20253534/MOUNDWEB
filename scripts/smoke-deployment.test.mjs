import assert from "node:assert/strict";
import test from "node:test";
import { normalizeOrigin, runDeploymentSmoke } from "./smoke-deployment.mjs";

const SITE = "https://www.moundweb.test";
const API = "https://api.moundweb.test";

function response(body, status = 200, headers = {}) {
  return new Response(body, { status, headers });
}

function mockFetch({ readyStatus = 200 } = {}) {
  return async (input, init = {}) => {
    const url = new URL(input);
    if (url.origin === SITE && url.pathname === "/") return response("homepage");
    if (url.origin === SITE && url.pathname === "/robots.txt") {
      return response("User-agent: *\nSitemap: " + SITE + "/sitemap.xml\n");
    }
    if (url.origin === SITE && url.pathname === "/sitemap.xml") {
      return response('<?xml version="1.0"?><urlset><url><loc>' + SITE +
        '/</loc></url><url><loc>' + SITE + '/services</loc></url></urlset>');
    }
    if (url.origin === API && url.pathname === "/api/health") {
      return response(JSON.stringify({ status: "ok", service: "moundweb-api" }));
    }
    if (url.origin === API && url.pathname === "/api/ready") {
      if (readyStatus !== 200) return response(JSON.stringify({ status: "not-ready" }), readyStatus);
      return response(JSON.stringify({ status: "ready", database: "reachable" }));
    }
    if (url.origin === API && url.pathname === "/api/submission-status") {
      return response(JSON.stringify({ enabled: false, noticeVersion: null }));
    }
    if (url.origin === API && url.pathname === "/api/v1/inquiries" && init.method === "OPTIONS") {
      return response(null, 204, {
        "access-control-allow-origin": SITE,
        "access-control-allow-credentials": "true",
      });
    }
    return response("not found", 404);
  };
}

test("accepts secure origins and local development origins", () => {
  assert.equal(normalizeOrigin("https://www.moundweb.test/", "SITE_URL"), SITE);
  assert.equal(normalizeOrigin("http://localhost:3000", "SITE_URL"), "http://localhost:3000");
});

test("rejects paths, credentials and non-HTTPS public origins", () => {
  assert.throws(() => normalizeOrigin("https://user:pass@example.com", "SITE_URL"));
  assert.throws(() => normalizeOrigin("https://example.com/path", "SITE_URL"));
  assert.throws(() => normalizeOrigin("http://example.com", "SITE_URL"));
});

test("passes a complete deployment check without submitting personal data", async () => {
  const result = await runDeploymentSmoke({
    siteUrl: SITE,
    apiUrl: API,
    fetchImpl: mockFetch(),
  });
  assert.equal(result.ok, true);
  assert.equal(result.results.length, 7);
  assert.ok(result.results.every((item) => item.status === "passed"));
});

test("fails release acceptance when the database is not ready", async () => {
  const result = await runDeploymentSmoke({
    siteUrl: SITE,
    apiUrl: API,
    fetchImpl: mockFetch({ readyStatus: 503 }),
  });
  assert.equal(result.ok, false);
  assert.equal(result.results.find((item) => item.name === "API and database readiness").status, "failed");
});

test("allows an explicitly non-release liveness check without database readiness", async () => {
  const result = await runDeploymentSmoke({
    siteUrl: SITE,
    apiUrl: API,
    databaseRequired: false,
    fetchImpl: mockFetch({ readyStatus: 503 }),
  });
  assert.equal(result.ok, true);
  assert.equal(result.results.find((item) => item.name === "API and database readiness").status, "skipped");
});
