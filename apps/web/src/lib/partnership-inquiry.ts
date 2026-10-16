export type PartnershipKind = "colleges" | "franchise";
export type PartnershipDraft = {
  kind: PartnershipKind;
  name: string;
  email: string;
  phone: string;
  organization: string;
  role: string;
  location: string;
  interest: string;
  message: string;
  acknowledged: boolean;
};
export type PartnershipField = Exclude<keyof PartnershipDraft, "kind">;
export type PartnershipErrors = Partial<Record<PartnershipField, string>>;

export const partnershipOptions = {
  colleges: [
    { value: "workshops", label: "Workshops and training sessions" },
    { value: "programs", label: "Curriculum or program collaboration" },
    { value: "career", label: "Industry and career exposure" },
    { value: "other", label: "Other institutional collaboration" },
  ],
  franchise: [
    { value: "learning-center", label: "Explore a local learning centre" },
    { value: "market", label: "Discuss regional opportunities" },
    { value: "model", label: "Understand a potential business model" },
    { value: "other", label: "Other partnership questions" },
  ],
} as const;

export function validatePartnershipDraft(value: PartnershipDraft): PartnershipErrors {
  const errors: PartnershipErrors = {};
  if (value.name.trim().length < 2 || value.name.length > 100)
    errors.name = "Enter your name (2–100 characters).";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.email.trim()) || value.email.length > 254)
    errors.email = "Enter a valid email address.";
  if (value.phone.trim() && (!/^[+\d\s().-]+$/.test(value.phone) ||
      value.phone.replace(/\D/g, "").length < 7 ||
      value.phone.replace(/\D/g, "").length > 15))
    errors.phone = "Enter a phone number of 7–15 digits, or leave it blank.";
  if (value.organization.trim().length < 2 || value.organization.length > 140)
    errors.organization = "Enter the institution or organization name (2–140 characters).";
  if (value.role.trim().length < 2 || value.role.length > 90)
    errors.role = "Enter your role (2–90 characters).";
  if (value.location.trim().length < 2 || value.location.length > 120)
    errors.location = "Enter your city or proposed region (2–120 characters).";
  if (!partnershipOptions[value.kind].some((option) => option.value === value.interest))
    errors.interest = "Choose a partnership interest.";
  if (value.message.trim().length < 20 || value.message.length > 3000)
    errors.message = "Describe your idea in 20–3,000 characters.";
  if (!value.acknowledged)
    errors.acknowledged = "Please acknowledge this is only a local inquiry preview.";
  return errors;
}

/** Formatting is safe text only, intended for a manual copy action. */
export function formatPartnershipDraft(value: PartnershipDraft): string {
  const kindLabel = value.kind === "colleges" ? "College Partnership" : "Franchise Partnership";
  const interest = partnershipOptions[value.kind].find((option) => option.value === value.interest)?.label ?? "";
  return [
    "MOUNDWEB — " + kindLabel + " Inquiry Draft",
    "Status: Draft preview only. Not submitted.",
    "Contact: " + value.name,
    "Email: " + value.email,
    "Phone: " + (value.phone || "Not provided"),
    "Institution / organization: " + value.organization,
    "Role: " + value.role,
    "City / region: " + value.location,
    "Interest: " + interest,
    "",
    "Message:",
    value.message,
  ].join("\n");
}
