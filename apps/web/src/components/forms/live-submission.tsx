"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Send } from "lucide-react";
import {
  submissionStatus, submitInquiry, type SubmissionValue,
} from "@/lib/submission-client";

/** Never imply review == submission. Only activate after server confirms readiness. */
export function LiveSubmission({ value }: { value: SubmissionValue }) {
  const [status, setStatus] = useState<{ enabled: boolean; noticeVersion: string | null }>({
    enabled: false, noticeVersion: null,
  });
  const [consent, setConsent] = useState(false);
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState("");
  const [error, setError] = useState("");
  const requestId = useRef<string | null>(null);
  useEffect(() => {
    let active = true;
    void submissionStatus().then((data) => { if (active) setStatus(data); });
    return () => { active = false; };
  }, []);
  async function send() {
    if (!status.enabled || !status.noticeVersion || !consent || sending || result) return;
    if (!requestId.current) requestId.current = crypto.randomUUID();
    setError("");
    setSending(true);
    try {
      const receipt = await submitInquiry(value, status.noticeVersion, requestId.current);
      setResult("Your inquiry was received. Reference: " + receipt.receipt +
        ". This does not confirm enrollment, employment, a partnership or email delivery.");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not submit. Please retry.");
    } finally { setSending(false); }
  }
  if (!status.enabled || !status.noticeVersion) return null;
  return (
    <div className="live-submission" aria-label="Secure inquiry submission">
      {result ? (
        <p role="status" className="live-submission-success">{result}</p>
      ) : (
        <>
          <label className="live-submission-consent">
            <input type="checkbox" checked={consent} onChange={(event) => setConsent(event.target.checked)} />
            <span>I have reviewed the <Link href="/privacy" target="_blank" rel="noopener noreferrer">privacy policy</Link> and consent to MOUNDWEB storing and processing this inquiry for a response (notice {status.noticeVersion}).</span>
          </label>
          <button type="button" className="button button--primary"
            disabled={!consent || sending} onClick={() => void send()}>
            <Send size={16} aria-hidden="true" />
            {sending ? "Sending securely…" : "Submit inquiry"}
          </button>
          {error && <p role="alert" className="field-error">{error}</p>}
          <p className="micro-note">Submitting saves your inquiry on the server; the response acknowledges receipt only. No course seat, job or business agreement is reserved.</p>
        </>
      )}
    </div>
  );
}
