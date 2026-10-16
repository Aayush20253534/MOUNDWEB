"use client";

import { useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import * as Dialog from "@radix-ui/react-dialog";
import { X, CheckCircle2 } from "lucide-react";
import { CopyDraft } from "./copy-draft";
import { Button, Field } from "../ui/primitives";
import {
  inquiryTypes,
  validateInquiry,
  formatInquiryDraft,
  type Inquiry,
  type InquiryErrors,
} from "@/lib/inquiry";

export function InquiryForm() {
  const search = useSearchParams();
  const initialType = search.get("type") ?? "";
  const initialMessage = search.get("message")?.slice(0, 3000) ?? "";
  const [errors, setErrors] = useState<InquiryErrors>({});
  const [review, setReview] = useState<Inquiry | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const submitRef = useRef<HTMLButtonElement>(null);
  const [attempted, setAttempted] = useState(false);
  const [messageLength, setMessageLength] = useState(initialMessage.length);
  const controlProps = (name: keyof Inquiry) => ({
    id: name,
    name,
    "aria-invalid": !!errors[name],
    "aria-describedby": errors[name] ? `${name}-error` : undefined,
  });
  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const value = Object.fromEntries(
      ["name", "email", "phone", "type", "subject", "message"].map((key) => [
        key,
        String(data.get(key) ?? "").trim(),
      ]),
    ) as Inquiry;
    const nextErrors = validateInquiry(value);
    setAttempted(true);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) {
      requestAnimationFrame(() =>
        formRef.current
          ?.querySelector<HTMLElement>('[aria-invalid="true"]')
          ?.focus(),
      );
      return;
    }
    setReview(value);
  }
  return (
    <>
      <form
        ref={formRef}
        className="inquiry-form"
        onSubmit={submit}
        noValidate
        aria-describedby="form-preview-note"
      >
        <div className="form-grid">
          <Field label="Full name" id="name" required error={errors.name}>
            <input
              {...controlProps("name")}
              autoComplete="name"
              placeholder="Your full name"
              required
              minLength={2}
              maxLength={100}
            />
          </Field>
          <Field label="Email address" id="email" required error={errors.email}>
            <input
              {...controlProps("email")}
              autoComplete="email"
              type="email"
              placeholder="you@example.com"
              required
              maxLength={254}
            />
          </Field>
          <Field
            label="Phone number (optional)"
            id="phone"
            error={errors.phone}
          >
            <input
              {...controlProps("phone")}
              autoComplete="tel"
              type="tel"
              placeholder="Include country code"
              maxLength={24}
            />
          </Field>
          <Field label="Inquiry type" id="type" required error={errors.type}>
            <select
              {...controlProps("type")}
              required
              defaultValue={
                inquiryTypes.some((t) => t.value === initialType)
                  ? initialType
                  : ""
              }
            >
              <option value="" disabled>
                Select an option
              </option>
              {inquiryTypes.map((type) => (
                <option value={type.value} key={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </Field>
          <Field
            className="field--full"
            label="Subject"
            id="subject"
            required
            error={errors.subject}
          >
            <input
              {...controlProps("subject")}
              placeholder="What would you like to explore?"
              defaultValue={search.get("subject")?.slice(0, 160) ?? ""}
              required
              minLength={3}
              maxLength={160}
            />
          </Field>
          <Field
            className="field--full"
            label="Message"
            id="message"
            required
            error={errors.message}
          >
            <textarea
              {...controlProps("message")}
              placeholder="Tell us about your goals or what you have in mind…"
              required
              minLength={10}
              maxLength={3000}
              rows={5}
              defaultValue={initialMessage}
              onChange={(e) => setMessageLength(e.target.value.length)}
            />
            <span className="character-count">
              {messageLength.toLocaleString()} / 3,000
            </span>
          </Field>
        </div>
        <p className="form-preview-note" id="form-preview-note">
          Preview only: you can review your inquiry, but it will not be sent or
          saved. Message delivery is coming soon.
        </p>
        <div aria-live="polite" className="form-validation-status">
          {attempted && Object.keys(errors).length > 0
            ? "Check the highlighted fields before reviewing your inquiry."
            : ""}
        </div>
        <button
          ref={submitRef}
          className="button button--primary form-submit"
          type="submit"
        >
          Review inquiry <span aria-hidden="true">→</span>
        </button>
      </form>
      <Dialog.Root
        open={!!review}
        onOpenChange={(open) => {
          if (!open) setReview(null);
        }}
      >
        <Dialog.Portal>
          <Dialog.Overlay className="dialog-overlay" />
          <Dialog.Content
            className="dialog-content inquiry-review"
            onCloseAutoFocus={(e) => {
              e.preventDefault();
              submitRef.current?.focus();
            }}
          >
            <CheckCircle2 className="review-icon" size={32} />
            <Dialog.Title>Review your inquiry</Dialog.Title>
            <Dialog.Description>
              This is a local preview. Nothing has been sent or saved.
            </Dialog.Description>
            {review && (
              <>
              <dl>
                <div>
                  <dt>Name</dt>
                  <dd>{review.name}</dd>
                </div>
                <div>
                  <dt>Email</dt>
                  <dd>{review.email}</dd>
                </div>
                {review.phone && (
                  <div>
                    <dt>Phone</dt>
                    <dd>{review.phone}</dd>
                  </div>
                )}
                <div>
                  <dt>Inquiry</dt>
                  <dd>
                    {inquiryTypes.find((t) => t.value === review.type)?.label}
                  </dd>
                </div>
                <div>
                  <dt>Subject</dt>
                  <dd>{review.subject}</dd>
                </div>
                <div>
                  <dt>Message</dt>
                  <dd>{review.message}</dd>
                </div>
              </dl>
              <CopyDraft text={formatInquiryDraft(review)} />
              </>
            )}
            <Dialog.Close asChild>
              <Button variant="secondary" arrow={false}>
                Back to inquiry
              </Button>
            </Dialog.Close>
            <Dialog.Close
              className="icon-button dialog-close"
              aria-label="Close inquiry review"
            >
              <X size={20} />
            </Dialog.Close>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
}
