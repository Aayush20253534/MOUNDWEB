/**
 * Editorial publishing is explicitly gated. These drafts are hypothetical topics
 * and layouts, not recordings, published journalism, interviews or press coverage.
 */
export type EditorialStatus = "draft" | "published";
export type Episode = {
  slug: string;
  title: string;
  summary: string;
  category: "Brand Growth" | "Creative Thinking" | "Digital Learning";
  status: EditorialStatus;
  artwork: string;
  topics: string[];
  outline: string[];
  publishedAt?: string;
  durationSeconds?: number;
  audioSrc?: string;
  transcript?: string;
  guest?: string;
};
export type MediaItem = {
  slug: string;
  title: string;
  summary: string;
  category: "Perspectives" | "Learning" | "Studio Notes";
  status: EditorialStatus;
  artwork: string;
  caption: string;
  outline: string[];
  publishedAt?: string;
  body?: string[];
  author?: string;
};

export const episodes: Episode[] = [
  {
    slug: "the-questions-behind-good-brands",
    title: "The Questions Behind Good Brands",
    category: "Brand Growth",
    summary: "A possible conversation about audience understanding, useful positioning and creative decisions.",
    status: "draft",
    artwork: "/assets/services/branding.webp",
    topics: ["Audience research", "Positioning", "Creative consistency"],
    outline: ["What does a brand promise?", "How does useful research change decisions?", "What makes a message recognizable?"],
  },
  {
    slug: "creativity-with-ai-in-the-loop",
    title: "Creativity With AI in the Loop",
    category: "Creative Thinking",
    summary: "An editorial concept exploring where AI tools help creative work and where human judgment matters.",
    status: "draft",
    artwork: "/assets/courses/dm-ai-master.webp",
    topics: ["Creative workflows", "Human review", "Responsible tooling"],
    outline: ["What makes AI useful for idea generation?", "How should outputs be verified?", "How do teams protect brand voice?"],
  },
  {
    slug: "learning-digital-skills-by-doing",
    title: "Learning Digital Skills by Doing",
    category: "Digital Learning",
    summary: "A possible episode on practice projects, feedback, and building confidence through experimentation.",
    status: "draft",
    artwork: "/assets/landscapes/programs-ascent.webp",
    topics: ["Learning design", "Practice projects", "Reflective feedback"],
    outline: ["Why does practice matter?", "How can beginners choose suitable projects?", "How does feedback support progress?"],
  },
];

export const mediaItems: MediaItem[] = [
  {
    slug: "what-makes-a-useful-growth-plan",
    title: "What Makes a Useful Growth Plan?",
    category: "Perspectives",
    summary: "A possible editorial perspective on aligning marketing priorities with business context.",
    status: "draft",
    artwork: "/assets/services/growth-strategy.webp",
    caption: "Concept visual: orange-toned digital strategy artwork. Not a client project.",
    outline: ["Understand the decision", "Choose relevant channels", "Measure what matters"],
  },
  {
    slug: "inside-an-ideas-workshop",
    title: "Inside an Ideas Workshop",
    category: "Studio Notes",
    summary: "A design concept for a future behind-the-scenes creative process feature.",
    status: "draft",
    artwork: "/assets/services/content-creative.webp",
    caption: "Illustrative creative artwork, not a photograph of a MOUNDWEB event.",
    outline: ["Start with the audience", "Explore formats", "Review and iterate"],
  },
  {
    slug: "learning-through-small-projects",
    title: "Learning Through Small Projects",
    category: "Learning",
    summary: "A proposed feature on practical learning pathways and incremental projects.",
    status: "draft",
    artwork: "/assets/courses/web-foundation.webp",
    caption: "Concept artwork of digital learning, not a real training cohort.",
    outline: ["Keep the first scope small", "Build a reusable habit", "Reflect on feedback"],
  },
  {
    slug: "where-brand-storytelling-meets-search",
    title: "Where Brand Storytelling Meets Search",
    category: "Perspectives",
    summary: "A working title on balancing audience-focused writing and discoverability.",
    status: "draft",
    artwork: "/assets/services/seo.webp",
    caption: "Illustrative search-focused artwork, not a published campaign result.",
    outline: ["Start with audience questions", "Organize useful material", "Review clarity and relevance"],
  },
];

export const episodeCategories = ["All topics", "Brand Growth", "Creative Thinking", "Digital Learning"] as const;
export const mediaCategories = ["All formats", "Perspectives", "Learning", "Studio Notes"] as const;

export function safeMediaSource(value: string | undefined): string | undefined {
  if (!value) return undefined;
  // Use only local audio assets or HTTPS files from a reviewed delivery origin.
  if (value.startsWith("/assets/audio/") && /\.(mp3|m4a|ogg|wav)(\?.*)?$/i.test(value)) return value;
  if (/^https:\/\/[a-z0-9.-]+\/[^\s]+?\.(mp3|m4a|ogg|wav)(\?.*)?$/i.test(value)) return value;
  return undefined;
}
export function isPublishedEpisode(episode: Episode): boolean {
  return episode.status === "published" &&
    Boolean(episode.publishedAt && episode.transcript?.trim() && safeMediaSource(episode.audioSrc) && episode.durationSeconds && episode.durationSeconds > 0);
}
export function isPublishedMedia(item: MediaItem): boolean {
  return item.status === "published" &&
    Boolean(item.publishedAt && item.author?.trim() && item.body?.length && item.body.every((p) => p.trim().length > 0));
}
export function getEpisode(slug: string) { return episodes.find((episode) => episode.slug === slug); }
export function getMedia(slug: string) { return mediaItems.find((item) => item.slug === slug); }
export function durationLabel(seconds?: number) {
  if (!seconds || seconds < 0 || !Number.isFinite(seconds)) return "Duration pending";
  const m = Math.floor(seconds / 60);
  return m + " min " + String(Math.floor(seconds % 60)).padStart(2, "0") + " sec";
}
