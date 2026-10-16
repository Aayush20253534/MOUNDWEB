import { describe, expect, it } from "vitest";
import {
  isVerifiedReport, metricDefinitions, placementReports, verifiedReports,
  type PlacementReport,
} from "./placements";
const example: PlacementReport = {
  id: "verified-illustration",
  track: "Digital Marketing",
  periodStart: "2026-01-01", periodEnd: "2026-03-31",
  status: "verified", reviewedAt: "2026-04-12",
  sourceDescription: "Reviewed test attendance and outcome records",
  consentAndPrivacyReviewed: true,
  figures: { enrolled: 50, completed: 40, assisted: 24, employed: 8 },
};

describe("Part 10 placement reporting", () => {
  it("publishes no invented student or employment figures", () => {
    expect(placementReports).toEqual([]);
    expect(verifiedReports()).toEqual([]);
    expect(metricDefinitions.map((item) => item.key)).toEqual(["enrolled", "completed", "assisted", "employed"]);
    expect(metricDefinitions.every((item) => item.excluded.length > 10)).toBe(true);
  });
  it("requires verified status, consent, source and valid reporting period", () => {
    expect(isVerifiedReport(example)).toBe(true);
    expect(isVerifiedReport({ ...example, status: "draft" })).toBe(false);
    expect(isVerifiedReport({ ...example, consentAndPrivacyReviewed: false })).toBe(false);
    expect(isVerifiedReport({ ...example, sourceDescription: " " })).toBe(false);
    expect(isVerifiedReport({ ...example, reviewedAt: undefined })).toBe(false);
    expect(isVerifiedReport({ ...example, periodStart: "2026-02-31" })).toBe(false);
    expect(isVerifiedReport({ ...example, periodEnd: "2025-12-31" })).toBe(false);
  });
  it("rejects negative, fractional and impossible counts", () => {
    expect(isVerifiedReport({ ...example, figures: { ...example.figures, enrolled: -1 } })).toBe(false);
    expect(isVerifiedReport({ ...example, figures: { ...example.figures, employed: 12.3 } })).toBe(false);
    expect(isVerifiedReport({ ...example, figures: { ...example.figures, completed: 55 } })).toBe(false);
    expect(isVerifiedReport({ ...example, figures: { ...example.figures, employed: 70 } })).toBe(false);
  });
});
