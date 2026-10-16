import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const routes = [
  "/",
  "/about",
  "/programs",
  "/programs/ai-master",
  "/programs/full-stack-development",
  "/services",
  "/services/seo",
  "/services/performance-marketing",
  "/services/advertising-coming-soon",
  "/contact",
  "/partners",
  "/partners/colleges",
  "/partners/franchise",
  "/podcast",
  "/podcast/the-questions-behind-good-brands",
  "/media",
  "/media/what-makes-a-useful-growth-plan",
  "/career",
  "/training-placements",
  "/privacy",
  "/terms",
  "/design-system",
] as const;

const widths = [320, 360, 375, 430, 600, 768, 1024, 1280, 1440, 1920] as const;

for (const route of routes) {
  test("global responsive and accessibility audit: " + route, async ({ page }) => {
    test.setTimeout(120_000);
    await page.setViewportSize({ width: 375, height: 900 });
    const response = await page.goto(route, { waitUntil: "domcontentloaded" });
    expect(response?.status(), "HTTP status for " + route).toBe(200);
    await expect(page.locator("#main-content h1")).toHaveCount(1);
    const viewportMeta = await page.locator('meta[name="viewport"]').getAttribute("content");
    expect(viewportMeta).toContain("width=device-width");

    for (const width of widths) {
      await page.setViewportSize({ width, height: 900 });
      const dimensions = await page.evaluate(() => ({
        viewport: document.documentElement.clientWidth,
        document: document.documentElement.scrollWidth,
        body: document.body.scrollWidth,
        main: document.getElementById("main-content")?.scrollWidth ?? 0,
      }));
      expect(dimensions.document, route + " document at " + width).toBeLessThanOrEqual(dimensions.viewport);
      expect(dimensions.body, route + " body at " + width).toBeLessThanOrEqual(dimensions.viewport);
      expect(dimensions.main, route + " main at " + width).toBeLessThanOrEqual(dimensions.viewport);

      if (width === 375 || width === 1440) {
        const a11y = await new AxeBuilder({ page })
          .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
          .analyze();
        expect(a11y.violations.map((violation) => ({
          id: violation.id,
          impact: violation.impact,
          nodes: violation.nodes.map((node) => ({
            target: node.target,
            summary: node.failureSummary,
          })),
        })), route + " accessibility at " + width).toEqual([]);
      }
    }
  });
}

test("global navigation has valid controlled dropdowns and responds to client route changes", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  for (const label of ["Explore", "Partner With Us"]) {
    const trigger = page.getByRole("button", { name: label, exact: true });
    const controlledId = await trigger.getAttribute("aria-controls");
    expect(controlledId).toBeTruthy();
    expect(controlledId).not.toContain(" ");
    await trigger.click();
    await expect(trigger).toHaveAttribute("aria-expanded", "true");
    await expect(page.locator("#" + CSS.escape(controlledId!))).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(trigger).toHaveAttribute("aria-expanded", "false");
  }
  await page.getByRole("link", { name: "About", exact: true }).click();
  await expect(page).toHaveURL(/\/about$/);
  await expect(page.locator("#main-content h1")).toContainText("The story");
  await expect(page.locator("#main-content")).toHaveAttribute("data-route-transition", "entering");
  await expect(page.locator("#main-content")).not.toHaveAttribute("data-route-transition", "entering");
});

test("reduced-motion preference disables route-arrival Web Animations", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  await page.getByRole("link", { name: "About", exact: true }).click();
  await expect(page).toHaveURL(/\/about$/);
  const running = await page.locator("#main-content").evaluate((main) =>
    main.getAnimations().filter((animation) => animation.playState === "running").length
  );
  expect(running).toBe(0);
});

test("global touch controls preserve targets without hover-only transforms", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto("/services");
  const controls = page.locator(".service-explorer .service-goal");
  await expect(controls.first()).toBeVisible();
  const minTarget = await controls.first().evaluate((element) => {
    const rect = element.getBoundingClientRect();
    return { width: rect.width, height: rect.height };
  });
  expect(minTarget.width).toBeGreaterThanOrEqual(44);
  expect(minTarget.height).toBeGreaterThanOrEqual(44);
  const toggle = page.getByRole("button", { name: "Open navigation" });
  await expect(toggle).toBeVisible();
  const box = await toggle.boundingBox();
  expect(box?.width).toBeGreaterThanOrEqual(40);
  expect(box?.height).toBeGreaterThanOrEqual(40);
});
