"use client";

import { useState } from "react";
import { Copy } from "lucide-react";

export function CopyDraft({ text, label = "Copy inquiry draft" }: { text: string; label?: string }) {
  const [status, setStatus] = useState("");
  async function copy() {
    try {
      if (!navigator.clipboard?.writeText) throw new Error("Clipboard unavailable");
      await navigator.clipboard.writeText(text);
      setStatus("Draft copied to clipboard. It has not been submitted.");
    } catch {
      setStatus("Clipboard access was blocked. Select and copy the draft details manually.");
    }
  }
  return (
    <div className="draft-copy-actions">
      <button type="button" className="button button--secondary draft-copy-button" onClick={copy}>
        <Copy size={16} aria-hidden="true" /> {label}
      </button>
      <p role="status" aria-live="polite" className="draft-copy-status">{status}</p>
    </div>
  );
}
