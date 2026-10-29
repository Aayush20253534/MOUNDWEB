import { Facebook, Instagram, Linkedin } from "lucide-react";
import { socialProfiles, type SocialPlatform } from "@/lib/social-profiles";

const icons = {
  instagram: Instagram,
  facebook: Facebook,
  linkedin: Linkedin,
} satisfies Record<SocialPlatform, typeof Instagram>;

export function SocialLinks({
  variant = "compact",
}: {
  variant?: "compact" | "labeled";
}) {
  const hasLinks = socialProfiles.some((profile) => profile.url !== null);
  const hasPendingProfiles = socialProfiles.some(
    (profile) => profile.url === null,
  );

  return (
    <div className={`social-links social-links--${variant}`}>
      <ul className="social-links-list" aria-label="MOUNDWEB social media">
        {socialProfiles.map(({ platform, name, url }) => {
          const Icon = icons[platform];
          const content = (
            <>
              <Icon size={20} aria-hidden="true" focusable="false" />
              <span
                className={
                  variant === "compact" ? "sr-only" : "social-link-name"
                }
              >
                {name}
                {!url && (
                  <span className="social-link-status">Not yet available</span>
                )}
              </span>
            </>
          );

          return (
            <li key={platform}>
              {url ? (
                <a
                  className="social-link"
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`MOUNDWEB on ${name} (opens in a new tab)`}
                  title={`MOUNDWEB on ${name} (opens in a new tab)`}
                >
                  {content}
                </a>
              ) : (
                <span
                  className="social-link social-link--pending"
                  title={`${name}: not yet available`}
                >
                  {content}
                </span>
              )}
            </li>
          );
        })}
      </ul>
      {hasPendingProfiles && (
        <p className="social-links-note">
          {hasLinks
            ? "More social profiles will be added once confirmed."
            : "Our social profile links will appear here once confirmed."}
        </p>
      )}
    </div>
  );
}
