export type SocialPlatform = "instagram" | "facebook" | "linkedin";

type SocialProfile = {
  platform: SocialPlatform;
  name: string;
  url: `https://${string}` | null;
};

// Add only owner-confirmed MOUNDWEB profile URLs. null renders a noninteractive
// icon, never a guessed handle, platform homepage, or placeholder link.
export const socialProfiles: readonly SocialProfile[] = [
  {
    platform: "instagram",
    name: "Instagram",
    url: "https://www.instagram.com/mound_web/",
  },
  {
    platform: "facebook",
    name: "Facebook",
    url: "https://www.facebook.com/share/1A55kyXKqC/",
  },
  { platform: "linkedin", name: "LinkedIn", url: null },
];
