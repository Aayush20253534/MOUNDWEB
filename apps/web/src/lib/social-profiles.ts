export type SocialPlatform = "instagram" | "facebook" | "linkedin" | "youtube";

type SocialProfile = {
  platform: SocialPlatform;
  name: string;
  url: `https://${string}` | null;
};

// Add only owner-confirmed MOUNDWEB profile URLs. null renders a noninteractive
// icon, never a guessed handle, platform homepage, or placeholder link.
export const socialProfiles: readonly SocialProfile[] = [
  { platform: "instagram", name: "Instagram", url: null },
  { platform: "facebook", name: "Facebook", url: null },
  { platform: "linkedin", name: "LinkedIn", url: null },
  { platform: "youtube", name: "YouTube", url: null },
];
