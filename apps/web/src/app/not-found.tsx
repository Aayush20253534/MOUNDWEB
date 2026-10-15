import { ButtonLink, Section, Eyebrow } from "@/components/ui/primitives";
export default function NotFound() {
  return (
    <Section className="not-found">
      <Eyebrow>404 · A different path</Eyebrow>
      <h1>This trail ends here.</h1>
      <p>The page you’re looking for isn’t available.</p>
      <ButtonLink href="/">Back to MOUNDWEB</ButtonLink>
    </Section>
  );
}
