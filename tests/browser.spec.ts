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
  await faq.scrollIntoViewIfNeeded();
  await faq.focus();
  await expect(faq).toBeFocused();
  await faq.press("Enter");
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


test("GPU mountain completes its one-shot reveal where WebGL2 is supported", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  const supported = await page.evaluate(() => {
    const probe = document.createElement("canvas");
    return Boolean(probe.getContext("webgl2"));
  });
  const stage = page.locator('[data-scene="particle-mountain"]');
  if (!supported) {
    await expect(stage).toHaveAttribute("data-phase", "poster");
    await expect(page.locator(".mountain-webgl-canvas")).toHaveCount(0);
    return;
  }
  await expect(page.locator(".mountain-webgl-canvas")).toHaveCount(1, { timeout: 10000 });
  await expect(stage).toHaveAttribute("data-phase", "revealed", { timeout: 13000 });
  await expect(page.locator("#home-title")).toBeVisible();
});


test("revolving Earth renders with moving channel icons when motion is enabled", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  const globe = page.locator('[data-scene="orbit-globe"]').first();
  await globe.scrollIntoViewIfNeeded();
  const webgl = await page.evaluate(() => Boolean(document.createElement("canvas").getContext("webgl2")));
  if (!webgl) {
    await expect(globe).toHaveAttribute("data-phase", "poster");
    await expect(globe.locator(".globe-webgl-canvas")).toHaveCount(0);
    return;
  }
  await expect(globe).toHaveAttribute("data-phase", "orbiting", { timeout: 20000 });
  await expect(globe.locator(".globe-webgl-canvas")).toHaveCount(1);
  const tiles = globe.locator(".orbit-platform");
  await expect(tiles).toHaveCount(6);
  const before = await tiles.first().evaluate((element: HTMLElement) => element.style.left);
  await page.waitForTimeout(1000);
  const after = await tiles.first().evaluate((element: HTMLElement) => element.style.left);
  expect(before).not.toBe(after);
  await expect(page.getByRole("heading", { name: /Multiple channels/i })).toBeVisible();
});

test("globe respects reduced-motion and preserves the static illustration", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  const globe = page.locator('[data-scene="orbit-globe"]').first();
  await globe.scrollIntoViewIfNeeded();
  await expect(globe).toHaveAttribute("data-phase", "poster");
  await expect(globe.locator(".globe-webgl-canvas")).toHaveCount(0);
  await expect(globe.locator(".globe-image")).toBeVisible();
});


test("About page animates the guiding approach without showing invented statistics", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/about");
  const hero = page.locator(".about-hero");
  await expect(hero).toBeVisible();
  const bounds = await hero.boundingBox();
  expect(bounds).not.toBeNull();
  await page.mouse.move(bounds!.x + bounds!.width * 0.75, bounds!.y + bounds!.height * 0.35);
  await expect.poll(async () => hero.evaluate((el) =>
    (el as HTMLElement).style.getPropertyValue("--about-parallax-x")
  )).not.toBe("");
  await page.getByRole("button", { name: "Pause hero animation" }).click();
  await expect.poll(() => hero.evaluate((element) =>
    element.getAnimations({ subtree: true }).filter((animation) => animation.playState === "running").length
  )).toBe(0);
  await page.mouse.move(bounds!.x + bounds!.width * 0.8, bounds!.y + bounds!.height * 0.4);
  await expect.poll(() => hero.evaluate((element) =>
    (element as HTMLElement).style.getPropertyValue("--about-parallax-x")
  )).toBe("");
  await page.getByRole("button", { name: "Play hero animation" }).click();
  await expect.poll(() => hero.evaluate((element) =>
    element.getAnimations({ subtree: true }).filter((animation) => animation.playState === "running").length
  )).toBeGreaterThan(0);
  const journey = page.locator(".about-journey");
  await journey.scrollIntoViewIfNeeded();
  await expect.poll(() => hero.evaluate((element) =>
    element.getAnimations({ subtree: true }).filter((animation) => animation.playState === "running").length
  )).toBe(0);
  await expect(journey).toHaveAttribute("data-about-motion", "entered");
  const steps = journey.locator(".about-journey-step");
  await expect(steps).toHaveCount(4);
  await expect(steps.first()).toHaveAttribute("data-about-motion", "entered");
  await expect(journey.getByRole("list", { name: "Four parts of our approach" }))
    .toContainText("Understand");
  await expect(page.locator(".about-verified-stats")).toContainText("Verification pending");
  await expect(page.locator(".about-verified-stats")).not.toContainText("100%");
});

test("About page reduced-motion mode is accessible without animations", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize({ width: 375, height: 900 });
  await page.goto("/about");
  const hero = page.locator(".about-hero");
  await expect(hero.getByRole("heading", { level: 1 })).toBeVisible();
  await expect(hero.locator(".hero-pillar")).toHaveCount(4);
  for (const card of await hero.locator(".hero-pillar").all()) {
    await expect(card).toBeVisible();
  }
  await expect(page.getByRole("button", { name: "Pause hero animation" })).toBeHidden();
  expect(await hero.evaluate((element) =>
    element.getAnimations({ subtree: true }).filter((animation) => animation.playState === "running").length
  )).toBe(0);
  const journey = page.locator(".about-journey");
  await journey.scrollIntoViewIfNeeded();
  await expect(journey).toBeVisible();
  await expect(journey).not.toHaveAttribute("data-about-motion", "entered");
  await expect(journey.locator(".about-journey-step")).toHaveCount(4);
  await expect(page.getByRole("heading", { name: "Our mission" })).toBeVisible();
  const motion = await journey.evaluate((element) =>
    getComputedStyle(element.querySelector(".about-journey-step")!).animationName
  );
  expect(motion).toBe("none");
});


test("program catalog filters course categories, experience and search", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/programs");
  await expect(page.locator(".course-card")).toHaveCount(11);
  await expect(page.locator(".catalog-result-count")).toContainText("11 programs");
  await page.getByRole("button", { name: "Web Development", exact: true }).click();
  await expect(page.locator(".course-card")).toHaveCount(5);
  await expect(page.locator("#web-development")).toBeVisible();
  await expect(page.locator("#digital-marketing")).toHaveCount(0);
  await page.getByRole("combobox", { name: "Experience level" }).selectOption("Intermediate");
  await expect(page.locator(".course-card")).toHaveCount(3);
  await page.getByRole("searchbox", { name: "Search courses" }).fill("full-stack");
  await expect(page.locator(".course-card")).toHaveCount(1);
  await expect(page.locator(".course-card").first()).toContainText("Full-Stack Development");
  await page.getByRole("searchbox", { name: "Search courses" }).fill("nonexistent course name");
  await expect(page.locator(".catalog-empty")).toBeVisible();
  await page.getByRole("button", { name: "Show all programs" }).click();
  await expect(page.locator(".course-card")).toHaveCount(11);
});

test("course detail offers proposed modules and preserves Web Development category", async ({ page }) => {
  await page.goto("/programs/full-stack-development");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Full-Stack Development");
  await expect(page.locator(".course-admissions")).toContainText("To be confirmed");
  await expect(page.locator(".course-admissions")).toContainText("Information requests only");
  await expect(page.locator(".course-curriculum summary")).toHaveCount(3);
  await page.locator(".course-curriculum summary").first().click();
  await expect(page.locator(".course-curriculum details").first()).toHaveAttribute("open", "");
  await expect(page.locator(".course-outcome-list li")).toHaveCount(3);
  await expect(page.getByRole("link", { name: /Back to Web Development/ })).toHaveAttribute("href", "/programs#web-development");
});

test("course inquiry builder prefills contact without submitting an application", async ({ page }) => {
  const posts: string[] = [];
  page.on("request", (request) => {
    if (request.method() === "POST") posts.push(request.url());
  });
  await page.goto("/programs/ai-master");
  await page.getByLabel("Your experience").selectOption("Some prior experience");
  await page.getByLabel("What would help most?").selectOption("Ask about eligibility, fees and dates");
  await page.getByRole("link", { name: /Prepare program inquiry/ }).click();
  await expect(page).toHaveURL(/\/contact\?type=course/);
  await expect(page.getByLabel("Inquiry type")).toHaveValue("course");
  await expect(page.getByLabel("Subject", { exact: false })).toHaveValue("AI Master");
  await expect(page.getByLabel(/^Message/)).toHaveValue(/Some prior experience/);
  await expect(page.getByLabel(/^Message/)).toHaveValue(/eligibility, fees and dates/);
  await expect(page.locator(".form-preview-note")).toContainText("not be sent or saved");
  expect(posts).toEqual([]);
});

test("young learner page requests guardian consent rather than direct enrollment", async ({ page }) => {
  await page.goto("/programs/ai-digital-ninja");
  await expect(page.locator(".course-details")).toContainText("Parents or guardians");
  await expect(page.locator(".course-info-panel").first()).toContainText("guardian consent");
  await expect(page.locator(".course-interest")).toContainText("No application, payment, seat reservation");
});

test("program hero animates the learning studio with working pause and resume controls", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/programs");
  const studio = page.getByTestId("program-studio");
  await expect(studio).toHaveAttribute("data-motion", "running");
  await expect(page.locator(".programs-hero img")).toHaveCount(0);
  await expect(studio.getByRole("img")).toHaveAccessibleName(/Code becomes a website/);
  await expect.poll(() => studio.evaluate((element) => element.getAnimations({ subtree: true })
    .some((animation) => animation.playState === "running"))).toBe(true);
  await page.getByRole("button", { name: "Pause learning studio animation" }).click();
  await expect(studio).toHaveAttribute("data-motion", "paused");
  await expect.poll(() => studio.evaluate((element) => element.getAnimations({ subtree: true })
    .every((animation) => animation.playState === "paused"))).toBe(true);
  const pausedTime = await studio.evaluate((element) => Number(element.getAnimations({ subtree: true })[0].currentTime));
  await page.waitForTimeout(200);
  expect(await studio.evaluate((element) => Number(element.getAnimations({ subtree: true })[0].currentTime))).toBe(pausedTime);
  await page.getByRole("button", { name: "Resume learning studio animation" }).click();
  await expect(studio).toHaveAttribute("data-motion", "running");
  await expect.poll(() => studio.evaluate((element) => Number(element.getAnimations({ subtree: true })[0].currentTime))).toBeGreaterThan(pausedTime);
  await page.locator("footer").scrollIntoViewIfNeeded();
  await expect(studio).toHaveAttribute("data-motion", "paused");
  await studio.scrollIntoViewIfNeeded();
  await expect(studio).toHaveAttribute("data-motion", "running");
  await page.getByRole("link", { name: "Explore programs", exact: true }).click();
  await expect(page).toHaveURL(/#learning-paths$/);
  await expect(page.locator("#learning-paths")).toBeInViewport();
});

test("program animations respect reduced-motion and leave course information visible", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/programs");
  await expect(page.locator(".program-catalog")).toBeVisible();
  const studio = page.getByTestId("program-studio");
  await expect(studio).toHaveAttribute("data-motion", "static");
  await expect(studio.getByRole("img")).toBeVisible();
  expect(await studio.evaluate((element) => element.getAnimations({ subtree: true }).length)).toBe(0);
  await expect(studio.getByRole("button", { includeHidden: true })).toBeHidden();
  const animation = await page.locator(".program-reveal").first().evaluate((element) => getComputedStyle(element).animationName);
  expect(animation).toBe("none");
});


test("services page offers only six brand-growth services and working detail links", async ({ page }) => {
  await page.goto("/services");
  await expect(page.locator(".services-full-grid .service-card")).toHaveCount(6);
  await expect(page.locator(".services-full-grid .service-card-explore")).toHaveCount(6);
  const titles = await page.locator(".services-full-grid h3").allTextContents();
  expect(titles.join(" ")).not.toMatch(/web.*development/i);
  await page.getByRole("link", { name: "Explore Search Engine Optimization service details" }).click();
  await expect(page).toHaveURL(/\/services\/seo$/);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Search Engine Optimization");
});

test("interactive service explorer selects a goal and updates the linked recommendation", async ({ page }) => {
  await page.goto("/services");
  const explorer = page.locator(".service-explorer");
  await expect(explorer.getByRole("button", { name: /Help people find us/ })).toHaveAttribute("aria-pressed", "true");
  await explorer.getByRole("button", { name: /Plan paid campaigns/ }).click();
  await expect(explorer.getByRole("heading", { level: 3 })).toHaveText("Performance Marketing");
  await expect(explorer.getByRole("link", { name: /Explore this service/ })).toHaveAttribute("href", "/services/performance-marketing");
  await explorer.getByRole("button", { name: /Clarify our identity/ }).click();
  await expect(explorer.getByRole("heading", { level: 3 })).toHaveText("Brand Identity & Growth");
  await expect(explorer.getByRole("button", { name: /Clarify our identity/ })).toHaveAttribute("aria-pressed", "true");
  await expect(explorer.getByRole("link", { name: /Discuss with us/ })).toHaveAttribute("href", /subject=Brand%20Identity%20%26%20Growth/);
});

test("marketing service details have process, scope, meaningful metrics and honest FAQs", async ({ page }) => {
  await page.goto("/services/performance-marketing");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Performance Marketing");
  await expect(page.locator(".service-activity")).toHaveCount(6);
  await expect(page.locator(".service-detail-steps li")).toHaveCount(3);
  await expect(page.locator(".service-signal-list > div")).toHaveCount(3);
  const faq = page.locator(".service-detail-faq details").first();
  await faq.locator("summary").click();
  await expect(faq).toHaveAttribute("open", "");
  await expect(page.locator(".service-detail-signals")).toContainText("not achieved client results");
  await expect(page.getByRole("link", { name: /Discuss this service/ })).toHaveAttribute("href", /type=growth/);
});

test("Advertising Coming Soon teaser opens a dedicated non-bookable page", async ({ page }) => {
  await page.goto("/services");
  await page.locator(".advertising-banner").getByRole("link", { name: /Explore what/ }).click();
  await expect(page).toHaveURL(/\/services\/advertising-coming-soon$/);
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Something powerful");
  await expect(page.locator(".advertising-coming-status")).toContainText("Coming Soon");
  await expect(page.locator(".advertising-coming-content")).toContainText("not available to book today");
  await expect(page.getByRole("link", { name: /Explore current services/ })).toHaveAttribute("href", "/services");
});

test("services hero connects brand-growth disciplines and can pause and resume", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/services");
  const studio = page.getByTestId("growth-studio");
  await expect(studio).toHaveAttribute("data-motion", "running");
  await expect(studio.getByRole("img")).toHaveAccessibleName(/six connected marketing disciplines/);
  await expect(page.locator(".services-hero img")).toHaveCount(0);
  await expect.poll(() => studio.evaluate((element) => element.getAnimations({ subtree: true })
    .some((animation) => animation.playState === "running"))).toBe(true);
  await page.getByRole("button", { name: "Pause brand growth animation" }).click();
  await expect(studio).toHaveAttribute("data-motion", "paused");
  await expect.poll(() => studio.evaluate((element) => element.getAnimations({ subtree: true })
    .every((animation) => animation.playState === "paused"))).toBe(true);
  const pausedTime = await studio.evaluate((element) => Number(element.getAnimations({ subtree: true })[0].currentTime));
  await page.waitForTimeout(200);
  expect(await studio.evaluate((element) => Number(element.getAnimations({ subtree: true })[0].currentTime))).toBe(pausedTime);
  await page.getByRole("button", { name: "Resume brand growth animation" }).click();
  await expect(studio).toHaveAttribute("data-motion", "running");
  await expect.poll(() => studio.evaluate((element) => Number(element.getAnimations({ subtree: true })[0].currentTime))).toBeGreaterThan(pausedTime);
  await page.locator("footer").scrollIntoViewIfNeeded();
  await expect(studio).toHaveAttribute("data-motion", "paused");
  await studio.scrollIntoViewIfNeeded();
  await expect(studio).toHaveAttribute("data-motion", "running");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(studio).toHaveAttribute("data-motion", "static");
  expect(await studio.evaluate((element) => element.getAnimations({ subtree: true }).length)).toBe(0);
  const hero = page.locator(".services-hero");
  await expect(hero.getByRole("link", { name: "Discuss your project" })).toHaveAttribute("href", "/contact?type=growth#inquiry");
  await hero.getByRole("link", { name: "Explore services", exact: true }).click();
  await expect(page).toHaveURL(/#growth-services$/);
  await expect(page.locator("#growth-services")).toBeInViewport();
});

test("marketing services and Coming Soon respect reduced motion", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize({ width: 375, height: 900 });
  await page.goto("/services");
  const hero = page.locator(".services-hero");
  await expect(hero).toBeVisible();
  const studio = page.getByTestId("growth-studio");
  await expect(studio).toHaveAttribute("data-motion", "static");
  await expect(studio.getByRole("img")).toBeVisible();
  expect(await studio.evaluate((element) => element.getAnimations({ subtree: true }).length)).toBe(0);
  await expect(studio.getByRole("button", { includeHidden: true })).toBeHidden();
  await page.goto("/services/advertising-coming-soon");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  const animation = await page.locator(".advertising-coming-ring").first().evaluate(
    (el) => getComputedStyle(el).animationName,
  );
  expect(animation).toBe("none");
});


test("Contact page routes visitors into dedicated college and franchise inquiries", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/contact");
  const chooser = page.locator(".connection-pathways");
  await expect(chooser.locator(".connection-path-card")).toHaveCount(4);
  await chooser.getByRole("link", { name: /College partnership/ }).click();
  await expect(page).toHaveURL(/\/partners\/colleges#partnership-inquiry$/);
  await expect(page.locator("#partnership-inquiry")).toBeVisible();
  await expect(page.locator(".page-hero .eyebrow")).toHaveText("College Partnerships");
  await expect(page.locator(".partner-process-step")).toHaveCount(3);
});

test("college partnership form validates field errors, acknowledges draft and reviews locally", async ({ page }) => {
  const posts: string[] = [];
  page.on("request", (request) => {
    if (request.method() === "POST") posts.push(request.url());
  });
  await page.goto("/partners/colleges");
  const form = page.locator("#partnership-inquiry");
  await form.getByRole("button", { name: /Review partnership inquiry/ }).click();
  await expect(form.locator("#partner-name")).toHaveAttribute("aria-invalid", "true");
  await expect(form.locator("#partner-acknowledged")).toHaveAttribute("aria-invalid", "true");
  await form.locator("#partner-name").fill("Academic Coordinator");
  await form.locator("#partner-email").fill("person@example.edu");
  await form.locator("#partner-organization").fill("Example College");
  await form.locator("#partner-role").fill("Program Coordinator");
  await form.locator("#partner-location").fill("Prayagraj");
  await form.locator("#partner-interest").selectOption("workshops");
  await form.locator("#partner-message").fill("We would like to explore a supervised learning workshop for students.");
  await form.getByRole("checkbox").check();
  await form.getByRole("button", { name: /Review partnership inquiry/ }).click();
  const review = page.getByRole("dialog", { name: "Review partnership inquiry" });
  await expect(review).toBeVisible();
  await expect(review).toContainText("Example College");
  await expect(review).toContainText("No application has been sent");
  await review.getByRole("button", { name: "Copy inquiry draft" }).click();
  await expect(review.getByRole("status")).not.toBeEmpty();
  await review.getByRole("button", { name: "Back to draft" }).click();
  await expect(review).not.toBeVisible();
  expect(posts).toEqual([]);
});

test("franchise form offers region-specific choices and avoids an implied business offer", async ({ page }) => {
  await page.goto("/partners/franchise");
  const form = page.locator("#partnership-inquiry");
  await expect(page.locator(".page-hero .eyebrow")).toHaveText("Franchise Partnerships");
  await expect(form.getByRole("option", { name: "Explore a local learning centre" })).toHaveCount(1);
  await expect(form.getByRole("option", { name: "Workshops and training sessions" })).toHaveCount(0);
  await expect(form).toContainText("not a submitted application");
  await expect(page.locator(".partner-faq")).toContainText("No investment return");
  await form.locator("#partner-name").fill("Regional Partner");
  await form.locator("#partner-email").fill("regional@example.com");
  await form.locator("#partner-organization").fill("Sample Training Business");
  await form.locator("#partner-role").fill("Owner");
  await form.locator("#partner-location").fill("Lucknow");
  await form.locator("#partner-interest").selectOption("market");
  await form.locator("#partner-message").fill("We want to understand the possible partnership terms for our region.");
  await form.getByRole("checkbox").check();
  await form.getByRole("button", { name: /Review partnership inquiry/ }).click();
  await expect(page.getByRole("dialog", { name: "Review partnership inquiry" })).toContainText("Discuss regional opportunities");
});

test("Contact review supports copyable local drafts and never makes a network submission", async ({ page }) => {
  await page.goto("/contact?type=growth&subject=Digital%20growth#inquiry");
  const form = page.locator(".inquiry-form");
  await form.locator("#name").fill("Example Client");
  await form.locator("#email").fill("client@example.com");
  await form.locator("#message").fill("I would like information about your marketing strategy services.");
  await form.getByRole("button", { name: /Review inquiry/ }).click();
  const dialog = page.getByRole("dialog", { name: "Review your inquiry" });
  await expect(dialog).toContainText("Digital growth");
  await expect(dialog).toContainText("Nothing has been sent or saved");
  await dialog.getByRole("button", { name: "Copy inquiry draft" }).click();
  await expect(dialog.getByRole("status")).not.toBeEmpty();
});

test("Contact hero animates inquiry preparation with pause, resume and working entry points", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  const posts: string[] = [];
  page.on("request", (request) => { if (request.method() === "POST") posts.push(request.url()); });
  await page.goto("/contact");
  const studio = page.getByTestId("conversation-studio");
  await expect(studio).toHaveAttribute("data-motion", "running");
  await expect(studio.getByRole("img")).toHaveAccessibleName(/A draft inquiry opens into a conversation/);
  await expect(page.locator(".contact-hero img")).toHaveCount(0);
  await expect.poll(() => studio.evaluate((element) => element.getAnimations({ subtree: true })
    .some((animation) => animation.playState === "running"))).toBe(true);
  await page.getByRole("button", { name: "Pause conversation animation" }).click();
  await expect(studio).toHaveAttribute("data-motion", "paused");
  await expect.poll(() => studio.evaluate((element) => element.getAnimations({ subtree: true })
    .every((animation) => animation.playState === "paused"))).toBe(true);
  const pausedTime = await studio.evaluate((element) => Number(element.getAnimations({ subtree: true })[0].currentTime));
  await page.waitForTimeout(200);
  expect(await studio.evaluate((element) => Number(element.getAnimations({ subtree: true })[0].currentTime))).toBe(pausedTime);
  await page.getByRole("button", { name: "Resume conversation animation" }).click();
  await expect.poll(() => studio.evaluate((element) => Number(element.getAnimations({ subtree: true })[0].currentTime))).toBeGreaterThan(pausedTime);
  await page.locator("footer").scrollIntoViewIfNeeded();
  await expect(studio).toHaveAttribute("data-motion", "paused");
  await studio.scrollIntoViewIfNeeded();
  await expect(studio).toHaveAttribute("data-motion", "running");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(studio).toHaveAttribute("data-motion", "static");
  expect(await studio.evaluate((element) => element.getAnimations({ subtree: true }).length)).toBe(0);
  const hero = page.locator(".contact-hero");
  await hero.getByRole("link", { name: "Find your starting point" }).click();
  await expect(page).toHaveURL(/#conversation-paths$/);
  await expect(page.locator("#conversation-paths")).toBeInViewport();
  await hero.getByRole("link", { name: "Prepare an inquiry", exact: true }).click();
  await expect(page).toHaveURL(/#inquiry$/);
  await expect(page.locator("#inquiry")).toBeInViewport();
  expect(posts).toEqual([]);
});

test("partnership and contact motion respect reduced-motion preference", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize({ width: 375, height: 900 });
  await page.goto("/partners/colleges");
  await expect(page.locator(".partner-process-step")).toHaveCount(3);
  await expect(page.locator("#partnership-inquiry")).toBeVisible();
  const anim = await page.locator(".connection-reveal").first().evaluate((el) => getComputedStyle(el).animationName);
  expect(anim).toBe("none");
  await page.goto("/contact");
  await expect(page.locator(".connection-pathways .connection-path-card")).toHaveCount(4);
  const studio = page.getByTestId("conversation-studio");
  await expect(studio).toHaveAttribute("data-motion", "static");
  await expect(studio.getByRole("img")).toBeVisible();
  expect(await studio.evaluate((element) => element.getAnimations({ subtree: true }).length)).toBe(0);
  await expect(studio.getByRole("button", { includeHidden: true })).toBeHidden();
});


test("college and franchise pages have no horizontal overflow or critical a11y failures", async ({ page }) => {
  for (const kind of ["colleges", "franchise"]) {
    for (const width of [375, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      const response = await page.goto("/partners/" + kind, { waitUntil: "networkidle" });
      expect(response?.status()).toBe(200);
      await expect(page.locator("main h1")).toHaveCount(1);
      const widths = await page.evaluate(() => ({
        viewport: window.innerWidth,
        document: document.documentElement.scrollWidth,
      }));
      expect(widths.document, kind + ": " + width).toBeLessThanOrEqual(widths.viewport);
      const a11y = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
        .analyze();
      expect(
        a11y.violations.map((item) => ({
          id: item.id,
          impact: item.impact,
          nodes: item.nodes.map((node) => node.target),
        })),
        kind + ": " + width,
      ).toEqual([]);
    }
  }
});


test("Podcast discovery filters draft episodes and never claims a released recording", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/podcast");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("The minds behind");
  await expect(page.locator(".editorial-empty-live")).toContainText("No published episodes yet");
  await expect(page.locator(".editorial-card")).toHaveCount(3);
  await expect(page.locator(".editorial-status")).toHaveCount(3);
  await page.getByRole("button", { name: "Creative Thinking", exact: true }).click();
  await expect(page.locator(".editorial-card")).toHaveCount(1);
  await expect(page.locator(".editorial-card")).toContainText("Creativity With AI");
  await expect(page.getByRole("button", { name: "Creative Thinking", exact: true })).toHaveAttribute("aria-pressed", "true");
  await page.getByRole("searchbox", { name: "Search podcast concepts" }).fill("unmatched query");
  await expect(page.locator(".editorial-filter-empty")).toBeVisible();
  await page.getByRole("button", { name: "Reset filters" }).click();
  await expect(page.locator(".editorial-card")).toHaveCount(3);
  await page.getByRole("link", { name: /Explore draft: The Questions Behind Good Brands/ }).click();
  await expect(page).toHaveURL(/\/podcast\/the-questions-behind-good-brands$/);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("The Questions Behind Good Brands");
  await expect(page.locator(".editorial-audio audio")).toHaveCount(0);
  await expect(page.locator(".editorial-audio-unavailable")).toContainText("not a recording");
  await expect(page.locator(".editorial-transcript")).toContainText("No transcript or episode audio is published yet");
  const robots = await page.locator('meta[name="robots"]').getAttribute("content");
  expect(robots).toMatch(/noindex/);
});

test("Media library categories, detail previews and original artwork lightbox work", async ({ page }) => {
  await page.goto("/media");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Ideas worth");
  await expect(page.locator(".editorial-empty-live")).toContainText("No published media releases yet");
  await expect(page.locator(".editorial-card")).toHaveCount(4);
  await page.getByRole("button", { name: "Learning", exact: true }).click();
  await expect(page.locator(".editorial-card")).toHaveCount(1);
  await expect(page.locator(".editorial-card")).toContainText("Learning Through Small Projects");
  await page.getByRole("button", { name: "All formats" }).click();
  await expect(page.locator(".editorial-card")).toHaveCount(4);
  const tile = page.getByRole("button", { name: /View concept artwork: Inside an Ideas Workshop/ });
  await tile.click();
  const dialog = page.getByRole("dialog", { name: "Inside an Ideas Workshop — Concept artwork" });
  await expect(dialog).toBeVisible();
  await expect(dialog).toContainText("not a photograph");
  await page.keyboard.press("Escape");
  await expect(dialog).not.toBeVisible();
  await expect(tile).toBeFocused();
  await page.getByRole("link", { name: /Explore draft: What Makes a Useful Growth Plan/ }).click();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("What Makes a Useful Growth Plan?");
  await expect(page.locator(".editorial-draft-disclosure")).toContainText("not published journalism");
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
});

for (const route of ["/podcast", "/media", "/podcast/the-questions-behind-good-brands", "/media/what-makes-a-useful-growth-plan"]) {
  for (const width of [375, 1440]) {
    test("Editorial " + route + " fits and passes accessibility checks at " + width + "px", async ({ page }) => {
      test.setTimeout(90_000);
      await page.setViewportSize({ width, height: 900 });
      const response = await page.goto(route, { waitUntil: "domcontentloaded" });
      expect(response?.status(), route).toBe(200);
      await expect(page.locator("main h1")).toHaveCount(1);
      const sizes = await page.evaluate(() => ({ viewport: innerWidth, scroll: document.documentElement.scrollWidth }));
      expect(sizes.scroll, route + " / " + width).toBeLessThanOrEqual(sizes.viewport);
      const axe = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze();
      expect(axe.violations.map((item) => ({
        id: item.id,
        nodes: item.nodes.map((node) => node.target),
      })), route + " / " + width).toEqual([]);
    });
  }
}

test("Editorial animations respect reduced motion and keep unpublished media discoverable", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize({ width: 375, height: 900 });
  await page.goto("/podcast");
  const animation = await page.locator(".podcast-artwork-circle").first().evaluate((el) => getComputedStyle(el).animationName);
  expect(animation).toBe("none");
  await expect(page.locator(".editorial-card")).toHaveCount(3);
  await page.goto("/media");
  const motion = await page.locator(".media-hero-collage > div").first().evaluate((el) => getComputedStyle(el).animationName);
  expect(motion).toBe("none");
  await expect(page.locator(".editorial-gallery-tile")).toHaveCount(4);
});


test("Careers explores work areas without creating false vacancies or applications", async ({ page }) => {
  await page.goto("/career");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Build ideas");
  await expect(page.locator(".career-open-count")).toContainText("0 verified open roles");
  await expect(page.locator(".career-no-roles")).toContainText("no confirmed open vacancies");
  await expect(page.locator(".career-domain-card")).toHaveCount(4);
  await expect(page.locator(".career-verified-role")).toHaveCount(0);
  await page.getByRole("button", { name: "Learning & Education", exact: true }).click();
  await expect(page.locator(".career-domain-card")).toHaveCount(1);
  await expect(page.locator(".career-domain-card")).toContainText("Learning & Education");
  await page.getByRole("searchbox", { name: "Search work areas" }).fill("no matching interest phrase");
  await expect(page.locator(".career-filter-empty")).toBeVisible();
  await page.getByRole("button", { name: "Reset filters" }).click();
  await expect(page.locator(".career-domain-card")).toHaveCount(4);
  await expect(page.locator(".career-domain-card a.text-link").first()).toHaveAttribute("href", /type=career/);
  await expect(page.locator("main")).toContainText("No application form, CV upload, payment");
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
});

test("Training and Placements offers verifiable methodology without fabricated results", async ({ page }) => {
  await page.goto("/training-placements");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Learn with purpose");
  await expect(page.locator(".training-track-grid > a")).toHaveCount(2);
  await expect(page.locator(".placement-verification-status")).toContainText("0");
  await expect(page.locator(".placement-no-data")).toContainText("No verified reports have been published");
  await page.getByLabel("Training track").selectOption("Web Development");
  await expect(page.locator(".placement-toolbar > span")).toContainText("0 verified reports");
  await page.getByRole("button", { name: "Verified employment", exact: true }).click();
  await expect(page.locator(".placement-definition-card h4")).toHaveText("Confirmed employment outcomes");
  await expect(page.locator(".placement-definition-card")).toContainText("Not included");
  await expect(page.locator(".placement-report")).toHaveCount(0);
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
});

for (const route of ["/career", "/training-placements"]) {
  for (const width of [375, 1440]) {
    test("Part 10 " + route + " has no overflow or accessibility failures at " + width + "px", async ({ page }) => {
      test.setTimeout(90_000);
      await page.setViewportSize({ width, height: 900 });
      const response = await page.goto(route, { waitUntil: "domcontentloaded" });
      expect(response?.status()).toBe(200);
      await expect(page.locator("main h1")).toHaveCount(1);
      const sizes = await page.evaluate(() => ({ viewport: innerWidth, content: document.documentElement.scrollWidth }));
      expect(sizes.content).toBeLessThanOrEqual(sizes.viewport);
      const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze();
      expect(results.violations.map((item) => ({
        id: item.id, nodes: item.nodes.map((node) => node.target),
      }))).toEqual([]);
    });
  }
}

test("Career and training pages disable decorative motion for reduced-motion visitors", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/career");
  await expect(page.locator(".career-domain-card")).toHaveCount(4);
  expect(await page.locator(".career-hero-orbit").first().evaluate((el) => getComputedStyle(el).animationName)).toBe("none");
  await page.goto("/training-placements");
  expect(await page.locator(".training-hero-ring").first().evaluate((el) => getComputedStyle(el).animationName)).toBe("none");
  await expect(page.locator(".placement-no-data")).toBeVisible();
});
