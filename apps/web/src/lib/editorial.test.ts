import { describe, expect, it } from "vitest";
import {
  episodes, mediaItems, safeMediaSource, isPublishedEpisode, isPublishedMedia,
  durationLabel, getEpisode, getMedia,
} from "./editorial";

describe("Part 09 editorial publication gate", () => {
  it("keeps all proposed episode and media items explicitly unpublished", () => {
    expect(episodes).toHaveLength(3);
    expect(mediaItems).toHaveLength(4);
    expect(episodes.every((item) => item.status === "draft" && !isPublishedEpisode(item))).toBe(true);
    expect(mediaItems.every((item) => item.status === "draft" && !isPublishedMedia(item))).toBe(true);
    expect(new Set(episodes.map((item) => item.slug)).size).toBe(episodes.length);
    expect(new Set(mediaItems.map((item) => item.slug)).size).toBe(mediaItems.length);
    for (const item of [...episodes, ...mediaItems]) {
      expect(item.title.length).toBeGreaterThan(5);
      expect(item.summary.length).toBeGreaterThan(20);
      expect(item.artwork.startsWith("/assets/")).toBe(true);
      expect(item.outline.length).toBeGreaterThanOrEqual(3);
    }
    expect(getEpisode(episodes[0]!.slug)).toEqual(episodes[0]);
    expect(getMedia(mediaItems[0]!.slug)).toEqual(mediaItems[0]);
  });
  it("requires audio, transcript, duration and date for published episodes", () => {
    const base = episodes[0]!;
    const ready = {
      ...base, status: "published" as const, publishedAt: "2026-10-16",
      audioSrc: "/assets/audio/approved-episode.mp3",
      transcript: "Hello and welcome to our released conversation.",
      durationSeconds: 150,
    };
    expect(isPublishedEpisode(base)).toBe(false);
    expect(isPublishedEpisode(ready)).toBe(true);
    expect(isPublishedEpisode({ ...ready, transcript: "" })).toBe(false);
    expect(isPublishedEpisode({ ...ready, audioSrc: "javascript:alert(1)" })).toBe(false);
    expect(isPublishedEpisode({ ...ready, durationSeconds: 0 })).toBe(false);
    expect(isPublishedEpisode({ ...ready, publishedAt: undefined })).toBe(false);
  });
  it("rejects unapproved media records and unsafe audio URLs", () => {
    const base = mediaItems[0]!;
    const ready = { ...base, status: "published" as const, publishedAt: "2026-10-16", author: "Editorial Team", body: ["An approved, verified story."] };
    expect(isPublishedMedia(ready)).toBe(true);
    expect(isPublishedMedia({ ...ready, body: [""] })).toBe(false);
    expect(isPublishedMedia({ ...ready, author: "" })).toBe(false);
    expect(safeMediaSource("/assets/audio/good.mp3")).toBe("/assets/audio/good.mp3");
    expect(safeMediaSource("https://media.example.com/episode.m4a")).toBe("https://media.example.com/episode.m4a");
    expect(safeMediaSource("http://media.example.com/episode.mp3")).toBeUndefined();
    expect(safeMediaSource("javascript:alert(1)")).toBeUndefined();
    expect(safeMediaSource("/assets/img/poster.svg")).toBeUndefined();
  });
  it("formats duration only when a valid recording duration is known", () => {
    expect(durationLabel()).toBe("Duration pending");
    expect(durationLabel(125)).toBe("2 min 05 sec");
  });
});
