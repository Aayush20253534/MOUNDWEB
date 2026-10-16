"use client";

import { useState } from "react";
import { Headphones, LockKeyhole } from "lucide-react";
import { safeMediaSource, durationLabel } from "@/lib/editorial";

/** Browser-native accessible player. Never pretends a recording exists. */
export function AudioPlayer({
  title, audioSrc, durationSeconds, transcriptAvailable = false,
}: {
  title: string; audioSrc?: string; durationSeconds?: number; transcriptAvailable?: boolean;
}) {
  const source = safeMediaSource(audioSrc);
  const [error, setError] = useState(false);
  return (
    <section className="editorial-audio" aria-label={"Audio player for " + title}>
      <div className="editorial-audio-head">
        <Headphones size={25} aria-hidden="true" />
        <div><span>Episode audio</span><strong>{source ? durationLabel(durationSeconds) : "Recording not yet available"}</strong></div>
      </div>
      {source ? (
        <>
          <audio
            aria-label={"Play " + title}
            controls
            preload="none"
            controlsList="nodownload"
            onError={() => setError(true)}
            src={source}
          >
            Your browser does not support HTML audio.
          </audio>
          {error && <p role="alert">Audio could not be loaded. Please try again later.</p>}
          {!transcriptAvailable && <p className="editorial-access-note">A verified transcript is needed before publication.</p>}
        </>
      ) : (
        <div className="editorial-audio-unavailable" role="status">
          <LockKeyhole size={18} aria-hidden="true" />
          <p>Playback will be enabled when a verified audio file and accessible transcript are published. This is an unpublished episode concept, not a recording.</p>
        </div>
      )}
    </section>
  );
}
