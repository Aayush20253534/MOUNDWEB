export const inquiryTypes = [
  { value: "growth", label: "Brand & marketing consultation" },
  { value: "course", label: "Program guidance" },
  { value: "college", label: "College partnership" },
  { value: "franchise", label: "Franchise partnership" },
  { value: "career", label: "Career opportunity" },
  { value: "media", label: "Media & collaboration" },
  { value: "other", label: "Something else" },
] as const;
export type Inquiry = {
  name: string;
  email: string;
  phone: string;
  type: string;
  subject: string;
  message: string;
};
export type InquiryErrors = Partial<Record<keyof Inquiry, string>>;
export function validateInquiry(value: Inquiry): InquiryErrors {
  const errors: InquiryErrors = {};
  if (value.name.trim().length < 2 || value.name.trim().length > 100)
    errors.name = "Enter a name between 2 and 100 characters.";
  if (
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.email.trim()) ||
    value.email.length > 254
  )
    errors.email = "Enter a valid email address.";
  if (
    value.phone.trim() &&
    (!/^[+\d\s().-]+$/.test(value.phone) ||
      value.phone.replace(/\D/g, "").length < 7 ||
      value.phone.replace(/\D/g, "").length > 15)
  )
    errors.phone = "Enter 7–15 digits, including your country code if needed.";
  if (!inquiryTypes.some((type) => type.value === value.type))
    errors.type = "Choose an inquiry type.";
  if (value.subject.trim().length < 3 || value.subject.length > 160)
    errors.subject = "Enter a subject between 3 and 160 characters.";
  if (value.message.trim().length < 10 || value.message.length > 3000)
    errors.message = "Enter a message between 10 and 3,000 characters.";
  return errors;
}


/** Copyable local draft text. This function performs no submission or storage. */
export function formatInquiryDraft(value: Inquiry): string {
  const label = inquiryTypes.find((item) => item.value === value.type)?.label ?? "General inquiry";
  return [
    "MOUNDWEB — Inquiry Draft",
    "Status: Local preview only. Not sent or saved.",
    "Full name: " + value.name,
    "Email: " + value.email,
    "Phone: " + (value.phone || "Not provided"),
    "Inquiry type: " + label,
    "Subject: " + value.subject,
    "",
    "Message:",
    value.message,
  ].join("\n");
}
