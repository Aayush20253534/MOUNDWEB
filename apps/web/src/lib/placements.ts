/** Reporting categories must not be conflated or derived from marketing claims. */
export type TrainingMetric = "enrolled" | "completed" | "assisted" | "employed";
export type TrainingTrack = "Digital Marketing" | "Web Development";
export type PlacementReport = {
  id: string;
  track: TrainingTrack;
  periodStart: string;
  periodEnd: string;
  status: "draft" | "verified";
  sourceDescription: string;
  reviewedAt?: string;
  consentAndPrivacyReviewed: boolean;
  figures: Record<TrainingMetric, number>;
};
export const placementReports: PlacementReport[] = [];

export const metricDefinitions: {
  key: TrainingMetric; label: string; title: string; definition: string; excluded: string;
}[] = [
  {
    key: "enrolled", label: "Enrollment", title: "Confirmed enrollments",
    definition: "Unique learners formally admitted in the reporting period, according to enrollment records.",
    excluded: "Inquiries, expressions of interest, abandoned registration and duplicate entries.",
  },
  {
    key: "completed", label: "Completion", title: "Verified course completions",
    definition: "Unique learners who met the documented completion criteria for a defined training track.",
    excluded: "Simple attendance, incomplete work or participation outside the reporting period.",
  },
  {
    key: "assisted", label: "Placement assistance", title: "Learners receiving support",
    definition: "Learners with documented, consented career assistance during the reporting period.",
    excluded: "Unverified advice, unsolicited employer referrals, and implied job offers.",
  },
  {
    key: "employed", label: "Verified employment", title: "Confirmed employment outcomes",
    definition: "Documented employment outcomes attributable to people in the reporting cohort, counted according to an approved methodology.",
    excluded: "Interviews, applications, informal promises, self-reported offers without confirmation, and guaranteed placement claims.",
  },
];

function isoDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const parsed = new Date(value + "T00:00:00.000Z");
  return !Number.isNaN(parsed.valueOf()) && parsed.toISOString().slice(0, 10) === value;
}
export function isVerifiedReport(report: PlacementReport): boolean {
  if (report.status !== "verified" || !report.consentAndPrivacyReviewed ||
      !report.sourceDescription.trim() || !report.reviewedAt ||
      !isoDate(report.periodStart) || !isoDate(report.periodEnd) ||
      report.periodEnd < report.periodStart || !isoDate(report.reviewedAt)) return false;
  const values = Object.values(report.figures);
  if (values.length !== 4 || values.some((value) => !Number.isSafeInteger(value) || value < 0)) return false;
  // Completion and employment counts must not exceed the enrolled cohort.
  if (report.figures.completed > report.figures.enrolled ||
      report.figures.employed > report.figures.enrolled) return false;
  return true;
}
export function verifiedReports() {
  return placementReports.filter(isVerifiedReport);
}
