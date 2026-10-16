import type { Course } from "./content";

export type CourseLevel = "Foundation" | "Intermediate" | "Advanced" | "Young learners";
export type CourseGuide = {
  slug: Course["slug"];
  level: CourseLevel;
  audience: string;
  prerequisites: string;
  sampleProject: string;
  outcomes: string[];
  modules: { title: string; topics: string[] }[];
};

/** Editorial DRAFTS for planning, not finalized curricula or advertised outcomes. */
export const courseGuides: Record<string, CourseGuide> = {
  "digital-marketing-foundation": {
    slug: "digital-marketing-foundation", level: "Foundation",
    audience: "Beginners interested in communication, brands, and marketing.",
    prerequisites: "No technical background proposed; final eligibility is pending.",
    sampleProject: "Draft a simple channel and content plan for a fictional local brand.",
    outcomes: ["Explain the main marketing channels", "Outline a basic audience journey", "Build a starter content calendar"],
    modules: [
      { title: "Marketing fundamentals", topics: ["Audience and positioning", "Customer journeys", "Organic versus paid channels"] },
      { title: "Search and social", topics: ["Search basics", "Social formats", "Responsible content planning"] },
      { title: "Measurement and practice", topics: ["Introductory metrics", "Campaign outline", "Portfolio reflection"] },
    ],
  },
  "ai-special": {
    slug: "ai-special", level: "Foundation",
    audience: "Learners starting with AI-assisted marketing tools.",
    prerequisites: "Basic computer familiarity is suggested.",
    sampleProject: "Create and critically review an AI-assisted social content workflow.",
    outcomes: ["Describe useful AI marketing applications", "Review outputs for accuracy and bias", "Produce a documented draft workflow"],
    modules: [
      { title: "AI and marketing essentials", topics: ["Models and limitations", "Useful marketing use cases", "Privacy and responsible use"] },
      { title: "Creative workflows", topics: ["Prompt development", "Drafting and revision", "Brand consistency"] },
      { title: "Applied exercise", topics: ["Small campaign mock-up", "Human review", "Quality evaluation"] },
    ],
  },
  "ai-master": {
    slug: "ai-master", level: "Intermediate",
    audience: "Learners expanding from marketing basics into campaign workflows.",
    prerequisites: "Introductory digital marketing familiarity is suggested.",
    sampleProject: "Prototype a multi-channel campaign plan with AI-assisted analysis.",
    outcomes: ["Connect strategy to campaign tasks", "Map measurable campaign objectives", "Evaluate tools before adoption"],
    modules: [
      { title: "Marketing strategy", topics: ["Audience research", "Channel selection", "Campaign briefs"] },
      { title: "AI workflow design", topics: ["Content operations", "Automation boundaries", "Human approval"] },
      { title: "Reporting essentials", topics: ["Useful metrics", "Interpretation", "Presentation of findings"] },
    ],
  },
  "ai-professional": {
    slug: "ai-professional", level: "Advanced",
    audience: "Learners exploring coordinated professional marketing practice.",
    prerequisites: "Some hands-on campaign or content practice is suggested.",
    sampleProject: "Prepare a reviewed integrated brand-growth proposal.",
    outcomes: ["Draft a cross-channel brief", "Explain marketing measurement trade-offs", "Document campaign operating procedures"],
    modules: [
      { title: "Integrated growth", topics: ["Search, social and paid channels", "Brand positioning", "Objectives and constraints"] },
      { title: "Operations and optimization", topics: ["Experiment design", "Creative review", "Budget reasoning"] },
      { title: "Portfolio project", topics: ["Strategy presentation", "Ethical AI use", "Feedback and iteration"] },
    ],
  },
  "ai-digi-hero": {
    slug: "ai-digi-hero", level: "Advanced",
    audience: "Learners seeking a longer, project-oriented marketing learning path.",
    prerequisites: "A learning plan and eligibility discussion are recommended.",
    sampleProject: "Build a portfolio of hypothetical marketing campaigns and reflective case studies.",
    outcomes: ["Connect brand and growth concepts", "Review AI-assisted deliverables", "Present a structured portfolio"],
    modules: [
      { title: "Brand and audience", topics: ["Brand research", "Campaign design", "Content strategy"] },
      { title: "AI and growth practice", topics: ["Assisted workflows", "Measurement planning", "Optimization principles"] },
      { title: "Portfolio development", topics: ["Project documentation", "Review cycles", "Presentation practice"] },
    ],
  },
  "ai-digital-ninja": {
    slug: "ai-digital-ninja", level: "Young learners",
    audience: "Children and their parents or guardians exploring guided digital creativity.",
    prerequisites: "Age suitability, supervision and guardian consent must be confirmed.",
    sampleProject: "Create a supervised digital storytelling project using age-appropriate tools.",
    outcomes: ["Explore digital creativity safely", "Recognize when AI needs human checking", "Practice sharing work responsibly"],
    modules: [
      { title: "Digital creativity", topics: ["Story structure", "Design basics", "Safe online habits"] },
      { title: "Responsible AI discovery", topics: ["Age-appropriate tools", "Checking generated answers", "Privacy"] },
      { title: "Guided creation", topics: ["Supervised project", "Creative feedback", "Reflection"] },
    ],
  },
  "web-development-foundation": {
    slug: "web-development-foundation", level: "Foundation",
    audience: "Beginners wanting to understand how the web works.",
    prerequisites: "No programming background proposed; final eligibility is pending.",
    sampleProject: "Build a responsive personal-information website with accessible navigation.",
    outcomes: ["Explain basic HTML and CSS", "Write simple JavaScript interactions", "Apply responsive layout principles"],
    modules: [
      { title: "Web foundations", topics: ["HTML semantics", "CSS fundamentals", "Browser basics"] },
      { title: "Interactive basics", topics: ["JavaScript essentials", "DOM events", "Form accessibility"] },
      { title: "Responsive practice", topics: ["Layouts", "Mobile first", "Quality checks"] },
    ],
  },
  "frontend-development": {
    slug: "frontend-development", level: "Intermediate",
    audience: "Learners building confidence in interactive interfaces.",
    prerequisites: "HTML, CSS and introductory JavaScript are suggested.",
    sampleProject: "Create an accessible multi-page interactive dashboard prototype.",
    outcomes: ["Compose reusable UI", "Handle simple application state", "Audit responsive accessibility"],
    modules: [
      { title: "Frontend foundations", topics: ["Modern JavaScript", "Component design", "TypeScript introduction"] },
      { title: "Interface engineering", topics: ["State", "Forms", "Routing"] },
      { title: "Quality and deployment", topics: ["Responsive testing", "Accessibility", "Frontend hosting"] },
    ],
  },
  "full-stack-development": {
    slug: "full-stack-development", level: "Intermediate",
    audience: "Learners connecting browser applications with data and APIs.",
    prerequisites: "Basic frontend development experience is suggested.",
    sampleProject: "Develop a small task-tracking application with an API and database.",
    outcomes: ["Describe client/server responsibilities", "Plan a basic REST API", "Use data validation and basic testing"],
    modules: [
      { title: "App architecture", topics: ["Frontend and backend", "HTTP and REST", "TypeScript patterns"] },
      { title: "API and data", topics: ["Express fundamentals", "SQL concepts", "Input validation"] },
      { title: "Integration", topics: ["Auth concepts", "Testing", "Deployment foundations"] },
    ],
  },
  "advanced-full-stack": {
    slug: "advanced-full-stack", level: "Advanced",
    audience: "Developers exploring maintainable and deployable applications.",
    prerequisites: "Full-stack development experience is suggested.",
    sampleProject: "Architect a documented, testable multi-role application prototype.",
    outcomes: ["Identify application architecture trade-offs", "Plan observability and tests", "Apply security and performance review"],
    modules: [
      { title: "Architecture", topics: ["Layered design", "Data modeling", "Integration contracts"] },
      { title: "Reliability", topics: ["Testing strategies", "Logging", "Performance profiling"] },
      { title: "Secure delivery", topics: ["Access controls", "CI/CD", "Operational readiness"] },
    ],
  },
  "ai-assisted-web-development": {
    slug: "ai-assisted-web-development", level: "Intermediate",
    audience: "Developers using AI while retaining engineering judgment.",
    prerequisites: "Basic coding experience and source-control familiarity are suggested.",
    sampleProject: "Build and independently validate an AI-assisted UI feature.",
    outcomes: ["Use AI as a coding aid", "Review generated code critically", "Verify security and accessibility"],
    modules: [
      { title: "AI-assisted planning", topics: ["Task decomposition", "Prompt design", "Limitations"] },
      { title: "Implementation review", topics: ["Code generation", "Testing", "Security awareness"] },
      { title: "Quality gates", topics: ["Human code review", "Performance checks", "Documentation"] },
    ],
  },
};

export const courseLevels: CourseLevel[] = ["Foundation", "Intermediate", "Advanced", "Young learners"];
export function getGuide(course: Course): CourseGuide {
  const guide = courseGuides[course.slug];
  if (!guide) throw new Error("Missing editorial course guide for " + course.slug);
  return guide;
}
