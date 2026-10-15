import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const routes = [
  ["home", "/"],
  ["about", "/about"],
  ["programs", "/programs"],
  ["services", "/services"],
  ["contact", "/contact"],
] as const;
const widths = [375, 768, 1024, 1440, 1920];
const discovered = new Set<string>();

for (const width of widths) {
  for (const [name, route] of routes) {
    test(`${name} renders accessibly at ${width}px`, async ({
      page,
    }, testInfo) => {
      await page.setViewportSize({ width, height: 900 });
      const errors: string[] = [];
      page.on("pageerror", (error) => errors.push(error.message));
      page.on("console", (message) => {
        if (message.type() === "error") errors.push(message.text());
      });
      const response = await page.goto(route, { waitUntil: "networkidle" });
      expect(response?.status()).toBe(200);
      await expect(page.locator("main h1")).toHaveCount(1);
      await page.evaluate(async () => {
        await document.fonts.ready;
      });
      const height = await page.evaluate(() => document.body.scrollHeight);
      for (let y = 0; y < height; y += 750) {
        await page.evaluate(
          (y) => window.scrollTo({ top: y, behavior: "instant" }),
          y,
        );
        await page.waitForTimeout(65);
      }
      await page.evaluate(async () => {
        for (const image of document.images) image.loading = "eager";
        await Promise.all(
          [...document.images]
            .filter((i) => i.getClientRects().length > 0)
            .map((i) => i.decode().catch(() => {})),
        );
        window.scrollTo({ top: 0, behavior: "instant" });
      });
      await page.waitForTimeout(150);
      const dimensions = await page.evaluate(() => ({
        viewport: innerWidth,
        scroll: document.documentElement.scrollWidth,
      }));
      expect(dimensions.scroll).toBeLessThanOrEqual(dimensions.viewport);
      const brokenImages = await page.evaluate(() =>
        [...document.images]
          .filter(
            (i) =>
              i.getClientRects().length > 0 &&
              (!i.complete || i.naturalWidth === 0),
          )
          .map((i) => i.getAttribute("src")),
      );
      expect(brokenImages).toEqual([]);
      const clipped = await page
        .locator("a.button,button.button")
        .evaluateAll((elements) =>
          elements
            .filter(
              (el) =>
                el.clientWidth > 0 &&
                (el.scrollWidth > el.clientWidth + 2 ||
                  el.scrollHeight > el.clientHeight + 2),
            )
            .map((el) => el.textContent),
        );
      expect(clipped).toEqual([]);
      for (const href of await page
        .locator("a[href]")
        .evaluateAll((elements) =>
          elements.map((el) => el.getAttribute("href") ?? ""),
        )) {
        if (href.startsWith("/") || href.startsWith("#"))
          discovered.add(
            new URL(href, page.url()).pathname + new URL(href, page.url()).hash,
          );
      }
      if (width === 375 || width === 1440) {
        const a11y = await new AxeBuilder({ page })
          .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
          .analyze();
        await testInfo.attach("accessibility.json", {
          body: JSON.stringify(a11y.violations, null, 2),
          contentType: "application/json",
        });
        expect(
          a11y.violations.map((v) => ({
            id: v.id,
            impact: v.impact,
            nodes: v.nodes.map((n) => ({
              target: n.target,
              summary: n.failureSummary,
            })),
          })),
        ).toEqual([]);
      }
      await page.screenshot({
        path: testInfo.outputPath(`${name}-${width}.png`),
        fullPage: true,
      });
      await testInfo.attach("full-page", {
        path: testInfo.outputPath(`${name}-${width}.png`),
        contentType: "image/png",
      });
      expect(errors).toEqual([]);
      await testInfo.attach("layout.json", {
        body: JSON.stringify({
          route,
          width,
          height,
          dimensions,
          brokenImages,
          consoleErrors: errors,
        }),
        contentType: "application/json",
      });
    });
  }
}

test("mobile navigation traps focus, closes on Escape, and follows links", async ({
  page,
}) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto("/");
  await page.getByRole("button", { name: "Open navigation" }).click();
  const dialog = page.getByRole("dialog", { name: "MOUNDWEB navigation" });
  await expect(dialog).toBeVisible();
  for (let i = 0; i < 18; i++) {
    await page.keyboard.press("Tab");
    expect(
      await dialog.evaluate((el) => el.contains(document.activeElement)),
    ).toBe(true);
  }
  await page.keyboard.press("Escape");
  await expect(dialog).not.toBeVisible();
  await expect(
    page.getByRole("button", { name: "Open navigation" }),
  ).toBeFocused();
  await page.getByRole("button", { name: "Open navigation" }).click();
  await dialog
    .getByRole("link", { name: "College Partnerships", exact: true })
    .click();
  await expect(page).toHaveURL(/\/partners\/colleges$/);
  await expect(dialog).not.toBeVisible();
});

test("desktop dropdowns, skip link, and FAQ work from the keyboard", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/programs");
  await page.keyboard.press("Tab");
  await expect(
    page.getByRole("link", { name: "Skip to content" }),
  ).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.locator("main")).toBeFocused();
  const explore = page.getByRole("button", { name: "Explore", exact: true });
  await explore.focus();
  await page.keyboard.press("Enter");
  await expect(explore).toHaveAttribute("aria-expanded", "true");
  await page.keyboard.press("Tab");
  await expect(
    page.getByRole("link", { name: /Podcast Conversations/ }),
  ).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(explore).toBeFocused();
  await expect(explore).toHaveAttribute("aria-expanded", "false");
  const faq = page.locator("summary").first();
  await faq.focus();
  await page.keyboard.press("Enter");
  await expect(page.locator("details").first()).toHaveAttribute("open", "");
});

test("inquiry validates, reviews locally, preserves text, and never submits data", async ({
  page,
}) => {
  await page.setViewportSize({ width: 375, height: 900 });
  const transmissions: string[] = [];
  page.on("request", (request) => {
    if (request.method() === "POST") transmissions.push(request.url());
  });
  await page.goto("/contact?type=course&subject=AI%20Special#inquiry");
  await expect(page.getByLabel("Inquiry type")).toHaveValue("course");
  await expect(page.getByLabel("Subject", { exact: false })).toHaveValue(
    "AI Special",
  );
  await page.getByRole("button", { name: "Review inquiry" }).click();
  await expect(page.getByLabel("Full name")).toBeFocused();
  await expect(page.locator("#name-error")).toBeVisible();
  await page.getByLabel("Full name").fill("Test Learner");
  await page.getByLabel("Email address").fill("learner@example.com");
  await page
    .getByLabel(/^Message/)
    .fill(
      "Please explain the program learning format. <script>alert(1)</script>",
    );
  await page.getByRole("button", { name: "Review inquiry" }).click();
  const review = page.getByRole("dialog", { name: "Review your inquiry" });
  await expect(review).toBeVisible();
  await expect(review).toContainText("Nothing has been sent or saved.");
  await expect(review).toContainText("<script>alert(1)</script>");
  await expect(review.locator("script")).toHaveCount(0);
  await page.keyboard.press("Escape");
  await expect(review).not.toBeVisible();
  await expect(
    page.getByRole("button", { name: "Review inquiry" }),
  ).toBeFocused();
  await expect(page.getByLabel("Full name")).toHaveValue("Test Learner");
  expect(transmissions).toEqual([]);
});

test("all internal destinations, fragments, course pages and assets resolve", async ({
  page,
  request,
}) => {
  const targets = new Set(discovered);
  for (const target of [
    "/podcast",
    "/media",
    "/career",
    "/training-placements",
    "/partners",
    "/partners/colleges",
    "/partners/franchise",
    "/privacy",
    "/terms",
    "/design-system",
  ])
    targets.add(target);
  // Also derive links independently so this check can be run alone.
  for (const [, route] of routes) {
    await page.goto(route);
    for (const href of await page
      .locator("a[href]")
      .evaluateAll((els) => els.map((el) => el.getAttribute("href") ?? ""))) {
      if (href.startsWith("/") || href.startsWith("#")) {
        const url = new URL(href, page.url());
        targets.add(url.pathname + url.hash);
      }
    }
  }
  for (const target of targets) {
    const response = await request.get(target);
    expect(response.status(), target).toBe(200);
    if (target.includes("#")) {
      const [route, hash] = target.split("#");
      await page.goto(route!);
      await expect(page.locator(`[id="${hash}"]`), target).toHaveCount(1);
    }
  }
  const manifest = await (await request.get("/assets/manifest.json")).json();
  for (const item of manifest) {
    const response = await request.get(item.path);
    expect(response.status(), item.path).toBe(200);
    expect((await response.body()).length, item.path).toBe(item.bytes);
  }
  expect((await request.get("/a-page-that-does-not-exist")).status()).toBe(404);
  await mkdir("test-results", { recursive: true });
  await writeFile(
    path.resolve("test-results/verified-links.json"),
    JSON.stringify([...targets].sort(), null, 2),
  );
});

test("reduced motion keeps all content visible and removes animation", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await expect(page.locator("h1")).toBeVisible();
  await expect(
    page.locator('[data-scene="particle-mountain"]'),
  ).toHaveAttribute("data-phase", "poster");
  expect(
    await page
      .locator(".button")
      .first()
      .evaluate((el) => getComputedStyle(el).transitionDuration),
  ).toBe("0s");
  expect(
    await page.evaluate(() => document.querySelectorAll("canvas,video").length),
  ).toBe(0);
});
