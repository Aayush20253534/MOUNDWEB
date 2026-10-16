"use client";

import { useRef, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { CheckCircle2, X } from "lucide-react";
import { CopyDraft } from "./copy-draft";
import { Field } from "@/components/ui/primitives";
import {
  formatPartnershipDraft, partnershipOptions, validatePartnershipDraft,
  type PartnershipDraft, type PartnershipErrors, type PartnershipKind,
} from "@/lib/partnership-inquiry";

const fields = ["name", "email", "phone", "organization", "role", "location", "interest", "message"] as const;

export function PartnershipForm({ kind }: { kind: PartnershipKind }) {
  const [errors, setErrors] = useState<PartnershipErrors>({});
  const [review, setReview] = useState<PartnershipDraft | null>(null);
  const [attempted, setAttempted] = useState(false);
  const [messageLength, setMessageLength] = useState(0);
  const formRef = useRef<HTMLFormElement>(null);
  const reviewButton = useRef<HTMLButtonElement>(null);
  const fieldProps = (field: keyof PartnershipErrors) => ({
    id: "partner-" + field,
    name: field,
    "aria-invalid": Boolean(errors[field]),
    "aria-describedby": errors[field] ? "partner-" + field + "-error" : undefined,
  });

  function prepareReview(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const values = Object.fromEntries(fields.map((field) => [field, String(data.get(field) ?? "").trim()]));
    const draft: PartnershipDraft = {
      ...values,
      kind,
      acknowledged: data.get("acknowledged") === "on",
    } as PartnershipDraft;
    const validation = validatePartnershipDraft(draft);
    setAttempted(true);
    setErrors(validation);
    if (Object.keys(validation).length > 0) {
      requestAnimationFrame(() => formRef.current?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus());
      return;
    }
    setReview(draft);
  }

  return (
    <>
      <form
        ref={formRef}
        id="partnership-inquiry"
        className="inquiry-form partnership-form"
        onSubmit={prepareReview}
        noValidate
        aria-describedby="partner-preview-disclosure"
      >
        <div className="partnership-form-heading">
          <p className="eyebrow">Partner inquiry · Draft preparation</p>
          <h2>Tell us about your <em>idea.</em></h2>
          <p>Prepare a structured {kind === "colleges" ? "institutional collaboration" : "franchise opportunity"} inquiry. Review and copy it for later use. Nothing is submitted.</p>
        </div>
        <div className="form-grid">
          <Field label="Your full name" id="partner-name" required error={errors.name}>
            <input {...fieldProps("name")} autoComplete="name" required maxLength={100} placeholder="Name of the contact person" />
          </Field>
          <Field label="Email address" id="partner-email" required error={errors.email}>
            <input {...fieldProps("email")} type="email" autoComplete="email" required maxLength={254} placeholder="name@example.com" />
          </Field>
          <Field label="Phone (optional)" id="partner-phone" error={errors.phone}>
            <input {...fieldProps("phone")} type="tel" autoComplete="tel" maxLength={24} placeholder="Include country code" />
          </Field>
          <Field
            label={kind === "colleges" ? "College / institution name" : "Organization / business name"}
            id="partner-organization" required error={errors.organization}
          >
            <input {...fieldProps("organization")} autoComplete="organization" maxLength={140} required placeholder={kind === "colleges" ? "Institution name" : "Organization name"} />
          </Field>
          <Field label="Your role" id="partner-role" required error={errors.role}>
            <input {...fieldProps("role")} autoComplete="organization-title" maxLength={90} required placeholder="Role or designation" />
          </Field>
          <Field label={kind === "colleges" ? "Institution city" : "Proposed city / region"} id="partner-location" required error={errors.location}>
            <input {...fieldProps("location")} autoComplete="address-level2" required maxLength={120} placeholder="City or region" />
          </Field>
          <Field className="field--full" label="Primary area of interest" id="partner-interest" required error={errors.interest}>
            <select {...fieldProps("interest")} defaultValue="" required>
              <option value="" disabled>Select an area to explore</option>
              {partnershipOptions[kind].map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
            </select>
          </Field>
          <Field className="field--full" label="Proposed collaboration" id="partner-message" required error={errors.message}>
            <textarea {...fieldProps("message")} required rows={5} minLength={20} maxLength={3000}
              onChange={(event) => setMessageLength(event.target.value.length)}
              placeholder="Share your goals, audience, proposed activities, or questions. Please do not include identity documents or confidential information." />
            <span className="character-count">{messageLength.toLocaleString()} / 3,000</span>
          </Field>
        </div>
        <div className="partner-preview-ack">
          <input id="partner-acknowledged" type="checkbox" name="acknowledged"
            aria-invalid={Boolean(errors.acknowledged)}
            aria-describedby={errors.acknowledged ? "partner-acknowledged-error" : "partner-preview-disclosure"} />
          <label htmlFor="partner-acknowledged">
            I understand this is a local preview, not a submitted application, reservation, or agreement.
          </label>
          {errors.acknowledged && <p id="partner-acknowledged-error" className="field-error">{errors.acknowledged}</p>}
        </div>
        <p id="partner-preview-disclosure" className="form-preview-note">
          Preview only. Your details will not be uploaded, emailed, saved, or shared with MOUNDWEB.
          Partnership terms and availability remain unconfirmed.
        </p>
        <p aria-live="polite" className="form-validation-status">
          {attempted && Object.keys(errors).length ? "Please correct the highlighted fields before reviewing." : ""}
        </p>
        <button type="submit" ref={reviewButton} className="button button--primary form-submit">
          Review partnership inquiry <span aria-hidden="true">→</span>
        </button>
      </form>
      <Dialog.Root open={Boolean(review)} onOpenChange={(open) => { if (!open) setReview(null); }}>
        <Dialog.Portal>
          <Dialog.Overlay className="dialog-overlay" />
          <Dialog.Content
            className="dialog-content partnership-review"
            onCloseAutoFocus={(event) => { event.preventDefault(); reviewButton.current?.focus(); }}
          >
            <CheckCircle2 className="review-icon" size={31} aria-hidden="true" />
            <Dialog.Title>Review partnership inquiry</Dialog.Title>
            <Dialog.Description>This is a local draft. No application has been sent, recorded or approved.</Dialog.Description>
            {review && (
              <>
                <dl>
                  <div><dt>Partnership</dt><dd>{review.kind === "colleges" ? "College / Institution" : "Franchise"}</dd></div>
                  <div><dt>Contact</dt><dd>{review.name}</dd></div>
                  <div><dt>Email</dt><dd>{review.email}</dd></div>
                  {review.phone && <div><dt>Phone</dt><dd>{review.phone}</dd></div>}
                  <div><dt>Organization</dt><dd>{review.organization}</dd></div>
                  <div><dt>Role</dt><dd>{review.role}</dd></div>
                  <div><dt>Location</dt><dd>{review.location}</dd></div>
                  <div><dt>Area of interest</dt><dd>{partnershipOptions[kind].find((o) => o.value === review.interest)?.label}</dd></div>
                  <div><dt>Message</dt><dd>{review.message}</dd></div>
                </dl>
                <CopyDraft text={formatPartnershipDraft(review)} />
              </>
            )}
            <Dialog.Close asChild>
              <button type="button" className="button button--secondary">Back to draft</button>
            </Dialog.Close>
            <Dialog.Close className="icon-button dialog-close" aria-label="Close partnership inquiry review"><X size={20} /></Dialog.Close>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
}
