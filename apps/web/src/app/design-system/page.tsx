import type { Metadata } from "next";
import { Brand } from "@/components/layout/brand";
import {
  Section,
  SectionHeading,
  Button,
  ButtonLink,
  Badge,
  FeaturePanel,
  EmptyState,
  Skeleton,
  Divider,
  Field,
  Grid,
} from "@/components/ui/primitives";
import { Dialog } from "@/components/ui/dialog";
import { Accordion } from "@/components/ui/accordion";
import { TestimonialCard, StatCard } from "@/components/ui/cards";
export const metadata: Metadata = {
  title: "Design system",
  robots: { index: false, follow: false },
};
export default function DesignSystemPage() {
  return (
    <>
      <Section>
        <div className="design-system-page-heading">
          <p className="eyebrow">MOUNDWEB · Internal reference</p>
          <h1>The design system.</h1>
          <p className="body-copy">
            Components, tokens, and interaction states used throughout the site.
            Examples on this page are design samples.
          </p>
        </div>
        <Brand />
        <div className="design-swatches mt-10">
          {[
            ["Background", "var(--background)"],
            ["Surface", "var(--surface)"],
            ["Primary", "var(--accent-strong)"],
            ["Accent", "var(--accent)"],
            ["Text", "var(--text)"],
            ["Muted", "var(--muted)"],
          ].map(([name, color]) => (
            <div className="design-swatch" key={name}>
              <div style={{ background: color }} />
              <p>{name}</p>
            </div>
          ))}
        </div>
      </Section>
      <Section>
        <SectionHeading eyebrow="01 / Actions" title="Clear next steps." />
        <div className="design-actions">
          <ButtonLink href="/contact">Primary action</ButtonLink>
          <ButtonLink href="/programs" variant="secondary">
            Secondary action
          </ButtonLink>
          <Button variant="ghost" disabled>
            Disabled action
          </Button>
          <Badge>Coming soon</Badge>
          <Dialog
            title="A focused conversation"
            description="Accessible dialog with focus management, Escape to close, and background scroll locking."
            trigger={
              <Button variant="secondary" arrow={false}>
                Open sample dialog
              </Button>
            }
          >
            <p className="body-copy">
              This is a design-system demonstration. It does not submit or save
              anything.
            </p>
          </Dialog>
        </div>
      </Section>
      <Section>
        <SectionHeading
          eyebrow="02 / Content"
          title="Reusable, with purpose."
        />
        <Grid className="md:grid-cols-2">
          <FeaturePanel icon="target" title="Feature panel">
            An icon, a clear title, and a concise description.
          </FeaturePanel>
          <StatCard
            label="Example metric"
            value="—"
            note="No business claim implied"
            icon="chart"
          />
          <TestimonialCard
            quote="This sample demonstrates the testimonial layout only."
            person="Sample profile"
            role="Not a real client"
          />
          <EmptyState title="No records yet">
            Use an honest empty state until verified content is ready.
          </EmptyState>
        </Grid>
      </Section>
      <Section>
        <SectionHeading
          eyebrow="03 / Forms & feedback"
          title="Every state considered."
        />
        <div className="feature-grid">
          <Field
            id="sample-input"
            label="Default field"
            hint="A supporting hint"
          >
            <input
              id="sample-input"
              aria-describedby="sample-input-hint"
              placeholder="Enter a value"
            />
          </Field>
          <Field
            id="sample-error"
            label="Validation state"
            error="Enter a valid email address."
          >
            <input
              id="sample-error"
              type="email"
              aria-invalid="true"
              aria-describedby="sample-error-error"
              defaultValue="invalid"
            />
          </Field>
        </div>
        <Divider />
        <Skeleton className="h-20" />
        <div className="mt-8">
          <Accordion
            items={[
              {
                question: "Does this system support reduced motion?",
                answer:
                  "Yes. The operating system preference disables transitions and loading animation. Core content is never hidden behind animation.",
              },
            ]}
          />
        </div>
      </Section>
    </>
  );
}
