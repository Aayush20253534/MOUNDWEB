import { services, type Service } from "./content";

export type ServiceGuide = {
  slug: Service["slug"];
  positioning: string;
  clientQuestion: string;
  direction: string;
  overview: string;
  activities: string[];
  steps: { title: string; description: string }[];
  signals: string[];
  faqs: { question: string; answer: string }[];
};

/**
 * Editorial descriptions of potential engagement activities.
 * No numeric results, guarantees, plans or contracted deliverables are claimed.
 */
export const serviceGuides: Record<string, ServiceGuide> = {
  seo: {
    slug: "seo",
    positioning: "Build discoverability that makes sense for your audience.",
    clientQuestion: "How can more relevant people find our brand?",
    direction: "Search visibility",
    overview: "Search starts with understanding what people need. We explore technical foundations, content, and discoverability through a measured, audience-first lens.",
    activities: ["Website visibility review", "Search-intent and content research", "On-page improvement priorities", "Technical SEO observations", "Local discoverability opportunities", "Measurement recommendations"],
    steps: [
      { title: "Understand search demand", description: "Explore how the intended audience researches its problems." },
      { title: "Identify priorities", description: "Review search opportunities, site content and technical constraints." },
      { title: "Plan improvements", description: "Outline practical actions and useful measurement signals." },
    ],
    signals: ["Relevant search impressions", "Search-engaged visitors", "Organic inquiry paths"],
    faqs: [
      { question: "Is a first-page ranking guaranteed?", answer: "No. Search ranking depends on multiple factors outside any provider's control. Scope and expectations are agreed after discovery." },
      { question: "Can local search be part of the work?", answer: "Local visibility may be included where it is relevant to the business and confirmed in the engagement scope." },
    ],
  },
  "social-media": {
    slug: "social-media",
    positioning: "Shape conversations people choose to join.",
    clientQuestion: "How do we connect with the right audience consistently?",
    direction: "Social engagement",
    overview: "A considered social presence balances channel choice, useful content and community interaction rather than chasing impressions alone.",
    activities: ["Channel and audience review", "Content pillar proposals", "Creative calendar ideas", "Community interaction approach", "Campaign narrative planning", "Engagement measurement"],
    steps: [
      { title: "Understand the community", description: "Review where conversations happen and what the audience values." },
      { title: "Build a content direction", description: "Identify consistent themes, formats and creative priorities." },
      { title: "Learn from engagement", description: "Use meaningful interactions to refine the approach." },
    ],
    signals: ["Meaningful audience interactions", "Content engagement trends", "Qualified visits from social channels"],
    faqs: [
      { question: "Which social platforms are included?", answer: "Platform selection depends on audience relevance and the agreed scope. Not every business needs every platform." },
      { question: "Does this include paid media?", answer: "Paid media planning belongs to Performance Marketing, while this service focuses on social presence and audience connection." },
    ],
  },
  "performance-marketing": {
    slug: "performance-marketing",
    positioning: "Connect paid campaign activity with meaningful action.",
    clientQuestion: "How can we approach paid campaigns more thoughtfully?",
    direction: "Campaign performance",
    overview: "Performance Marketing brings audience thinking, campaign structure, creative tests and measurement together around specific business objectives.",
    activities: ["Campaign objective workshops", "Audience and channel planning", "Paid search and social strategy", "Creative testing approach", "Conversion measurement planning", "Campaign reporting recommendations"],
    steps: [
      { title: "Define the goal", description: "Agree what an inquiry, conversion or other meaningful action looks like." },
      { title: "Structure the campaign", description: "Plan channel, message and measurement choices based on the budget and context." },
      { title: "Review and iterate", description: "Evaluate signals and recommend informed adjustments." },
    ],
    signals: ["Qualified conversion actions", "Cost per meaningful inquiry", "Channel-level campaign performance"],
    faqs: [
      { question: "Do you guarantee a return on ad spend?", answer: "No. Results are affected by product, audience, competition, budget and other variables." },
      { question: "How is this different from Advertising Coming Soon?", answer: "Existing Performance Marketing covers paid campaign strategy and optimization. The separate Advertising offering is a future expansion and is not currently available." },
    ],
  },
  "content-creative": {
    slug: "content-creative",
    positioning: "Make the message as considered as the medium.",
    clientQuestion: "How can our brand tell a clearer story?",
    direction: "Brand storytelling",
    overview: "Content and creative planning help translate complex ideas into consistent stories for the formats and channels that matter.",
    activities: ["Message and tone exploration", "Content theme planning", "Campaign creative direction", "Short-form format ideas", "Visual storytelling concepts", "Content performance review"],
    steps: [
      { title: "Find the message", description: "Define the ideas and audience needs at the heart of the brand story." },
      { title: "Choose the formats", description: "Explore content styles that fit the channel and intended audience." },
      { title: "Review clarity", description: "Evaluate whether creative choices support the communication objective." },
    ],
    signals: ["Engagement by content theme", "Content-assisted audience actions", "Message consistency"],
    faqs: [
      { question: "Will you create content for every platform?", answer: "The final mix of channels, formats and creative outputs depends on a confirmed project scope." },
      { question: "Is video production always included?", answer: "Video concepts can be discussed, but production arrangements must be confirmed separately." },
    ],
  },
  "brand-identity": {
    slug: "brand-identity",
    positioning: "Build recognition through clarity and consistency.",
    clientQuestion: "How should people understand and remember our brand?",
    direction: "Brand positioning",
    overview: "A clear identity aligns a brand's promise, expression and audience experience. We explore positioning and communications before individual visual choices.",
    activities: ["Brand and market discovery", "Audience and positioning exploration", "Messaging principles", "Visual identity direction", "Brand voice recommendations", "Consistency guidelines"],
    steps: [
      { title: "Discover the difference", description: "Explore what makes the brand relevant to its audience." },
      { title: "Clarify expression", description: "Develop a coherent direction for message, voice and visual identity." },
      { title: "Apply consistently", description: "Map how brand expression can remain coherent across touchpoints." },
    ],
    signals: ["Brand consistency observations", "Audience perception feedback", "Engagement with key brand messages"],
    faqs: [
      { question: "Is this a website-development service?", answer: "No. MOUNDWEB's client services are digital marketing and brand growth. Web Development is offered as education under Our Programs." },
      { question: "Do you provide logo design?", answer: "Visual identity and brand assets can be discussed during scoping. Exact deliverables are agreed before work starts." },
    ],
  },
  "growth-strategy": {
    slug: "growth-strategy",
    positioning: "Choose the next useful move, not every possible move.",
    clientQuestion: "Where should we focus our marketing efforts?",
    direction: "Strategic clarity",
    overview: "Growth Strategy connects business context, audience understanding and channel choices into a decision-making framework that can evolve with evidence.",
    activities: ["Growth goal discovery", "Audience and market review", "Channel opportunity mapping", "Marketing priorities", "Measurement framework design", "Iterative roadmap proposals"],
    steps: [
      { title: "Understand the business", description: "Clarify goals, practical constraints and current priorities." },
      { title: "Map opportunities", description: "Explore channels, audience behaviors and meaningful choices." },
      { title: "Decide what to test", description: "Build an actionable direction with review points." },
    ],
    signals: ["Progress toward selected goals", "Channel contribution patterns", "Quality of marketing inquiries"],
    faqs: [
      { question: "Does consulting guarantee business growth?", answer: "No. Strategy provides a framework for decisions; outcomes depend on many internal and external factors." },
      { question: "Can this connect with another service?", answer: "Yes. Any combination of activities depends on priorities and the agreed scope." },
    ],
  },
};

export function getServiceGuide(service: Service): ServiceGuide {
  const guide = serviceGuides[service.slug];
  if (!guide) throw new Error("Missing marketing guide for " + service.slug);
  return guide;
}

export const serviceGoals = [
  { label: "Help people find us", description: "Search and discovery", slug: "seo" },
  { label: "Grow a community", description: "Social connection", slug: "social-media" },
  { label: "Plan paid campaigns", description: "Conversion-oriented marketing", slug: "performance-marketing" },
  { label: "Tell a better story", description: "Content and creative", slug: "content-creative" },
  { label: "Clarify our identity", description: "Positioning and consistency", slug: "brand-identity" },
  { label: "Choose a growth direction", description: "Cross-channel strategy", slug: "growth-strategy" },
] as const;
export const serviceSlugs = services.map((service) => service.slug);
