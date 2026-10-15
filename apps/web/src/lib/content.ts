export const navigation = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Our Programs", href: "/programs" },
  { label: "Our Services", href: "/services" },
] as const;

export const exploreLinks = [
  {
    label: "Podcast",
    href: "/podcast",
    detail: "Conversations that move us forward",
  },
  {
    label: "Media",
    href: "/media",
    detail: "Ideas, perspectives, and updates",
  },
  { label: "Career", href: "/career", detail: "Create your next chapter" },
  {
    label: "Training & Placements",
    href: "/training-placements",
    detail: "Learning, opportunity, and progress",
  },
] as const;
export const partnerLinks = [
  {
    label: "College Partnerships",
    href: "/partners/colleges",
    detail: "Connect classrooms with industry",
  },
  {
    label: "Franchise Partnerships",
    href: "/partners/franchise",
    detail: "Explore a shared growth journey",
  },
] as const;

export type IconName =
  | "search"
  | "chart"
  | "users"
  | "pen"
  | "grid"
  | "target"
  | "code"
  | "brain"
  | "book"
  | "briefcase"
  | "cap"
  | "building"
  | "handshake"
  | "lightbulb"
  | "settings"
  | "layers"
  | "rocket"
  | "mail"
  | "phone"
  | "pin"
  | "clock"
  | "play"
  | "globe"
  | "sparkles";
export type Service = {
  slug: string;
  title: string;
  shortTitle: string;
  summary: string;
  icon: IconName;
  image: string;
  features: string[];
};
export const services: Service[] = [
  {
    slug: "seo",
    title: "Search Engine Optimization",
    shortTitle: "SEO",
    summary: "Be found by the people already looking for you.",
    icon: "search",
    image: "seo",
    features: [
      "Search & keyword strategy",
      "On-page & technical SEO",
      "Content planning",
      "Local search visibility",
    ],
  },
  {
    slug: "social-media",
    title: "Social Media Marketing",
    shortTitle: "Social Media",
    summary: "Build a community around what makes your brand matter.",
    icon: "users",
    image: "social-media",
    features: [
      "Content & channel strategy",
      "Community management",
      "Campaign creative",
      "Social performance insights",
    ],
  },
  {
    slug: "performance-marketing",
    title: "Performance Marketing",
    shortTitle: "Performance",
    summary: "Turn the right attention into meaningful action.",
    icon: "chart",
    image: "performance",
    features: [
      "Paid search campaigns",
      "Paid social campaigns",
      "Campaign optimization",
      "Conversion measurement",
    ],
  },
  {
    slug: "content-creative",
    title: "Content & Creative Marketing",
    shortTitle: "Content & Creative",
    summary: "Make your brand worth watching, reading, and remembering.",
    icon: "pen",
    image: "content-creative",
    features: [
      "Creative strategy",
      "Visual storytelling",
      "Short-form content",
      "Campaign concepts",
    ],
  },
  {
    slug: "brand-identity",
    title: "Brand Identity & Growth",
    shortTitle: "Brand Identity",
    summary: "Build a clear identity with a distinctive point of view.",
    icon: "grid",
    image: "branding",
    features: [
      "Brand strategy",
      "Visual identity",
      "Brand positioning",
      "Brand communication",
    ],
  },
  {
    slug: "growth-strategy",
    title: "Growth Strategy & Consulting",
    shortTitle: "Growth Strategy",
    summary: "Connect your goals, channels, and next steps.",
    icon: "target",
    image: "growth-strategy",
    features: [
      "Market research",
      "Audience understanding",
      "Growth roadmap",
      "Measurement planning",
    ],
  },
];

export type Course = {
  slug: string;
  title: string;
  category: "Digital Marketing" | "Web Development";
  duration?: string;
  summary: string;
  image: string;
  focus: string[];
};
export const courses: Course[] = [
  {
    slug: "digital-marketing-foundation",
    title: "Foundation Course",
    category: "Digital Marketing",
    duration: "2 months",
    summary: "Build your foundation in digital marketing.",
    image: "dm-foundation",
    focus: ["Marketing fundamentals", "Search & social", "Content planning"],
  },
  {
    slug: "ai-special",
    title: "AI Special",
    category: "Digital Marketing",
    duration: "3 months",
    summary: "Explore the role of AI in modern marketing.",
    image: "dm-ai-special",
    focus: [
      "AI marketing tools",
      "Prompting fundamentals",
      "Content workflows",
    ],
  },
  {
    slug: "ai-master",
    title: "AI Master",
    category: "Digital Marketing",
    duration: "4.5+ months",
    summary: "Connect marketing strategy with intelligent tools.",
    image: "dm-ai-master",
    focus: ["Campaign planning", "AI workflows", "Marketing analytics"],
  },
  {
    slug: "ai-professional",
    title: "AI Professional",
    category: "Digital Marketing",
    duration: "6 months",
    summary: "Develop a broader professional marketing practice.",
    image: "dm-ai-professional",
    focus: ["Integrated strategy", "Campaign operations", "Applied projects"],
  },
  {
    slug: "ai-digi-hero",
    title: "AI Digi Hero",
    category: "Digital Marketing",
    duration: "1 year",
    summary: "A longer learning journey through digital marketing.",
    image: "dm-digi-hero",
    focus: ["Brand growth", "AI integration", "Portfolio development"],
  },
  {
    slug: "ai-digital-ninja",
    title: "AI Digital Ninja (Kids)",
    category: "Digital Marketing",
    duration: "1+ year",
    summary: "An introduction to digital creativity for young learners.",
    image: "dm-digital-ninja",
    focus: ["Digital creativity", "Responsible AI", "Guided exploration"],
  },
  {
    slug: "web-development-foundation",
    title: "Web Development Foundation",
    category: "Web Development",
    summary: "Start with the building blocks of the web.",
    image: "web-foundation",
    focus: ["HTML & CSS", "JavaScript foundations", "Responsive pages"],
  },
  {
    slug: "frontend-development",
    title: "Frontend Development",
    category: "Web Development",
    summary: "Bring thoughtful interfaces to life.",
    image: "web-frontend",
    focus: ["Interface development", "Component thinking", "Accessibility"],
  },
  {
    slug: "full-stack-development",
    title: "Full-Stack Development",
    category: "Web Development",
    summary: "Connect the interface with the systems behind it.",
    image: "web-fullstack",
    focus: ["Frontend & backend", "APIs & databases", "Application structure"],
  },
  {
    slug: "advanced-full-stack",
    title: "Advanced Full-Stack Development",
    category: "Web Development",
    summary: "Explore more complex application architecture.",
    image: "web-advanced",
    focus: ["System architecture", "Performance", "Deployment practices"],
  },
  {
    slug: "ai-assisted-web-development",
    title: "AI-Assisted Web Development",
    category: "Web Development",
    summary: "Use AI thoughtfully throughout the development process.",
    image: "web-ai",
    focus: ["AI-assisted workflows", "Code review", "Responsible tooling"],
  },
];

export const programFaqs = [
  {
    question: "Which learning path is right for me?",
    answer:
      "Start with Digital Marketing if you want to explore brand strategy, campaigns, content, and AI marketing tools. Choose Web Development if you want to learn how websites and applications are built.",
  },
  {
    question: "Where do the AI programs fit?",
    answer:
      "AI Special, AI Master, AI Professional, AI Digi Hero, and AI Digital Ninja are part of Digital Marketing. AI-Assisted Web Development belongs to the Web Development learning path.",
  },
  {
    question: "Are the programs online or offline?",
    answer:
      "Delivery format, schedules, fees, and admission details are being finalized. Request current details before making an enrollment decision.",
  },
  {
    question: "Is placement guaranteed?",
    answer:
      "No placement or employment guarantee is made. The scope of career guidance and placement support will be confirmed with each program.",
  },
];
export const contactFaqs = [
  {
    question: "How soon will you respond to my inquiry?",
    answer:
      "Response times will be confirmed when the contact service launches. This preview does not send messages or store your details.",
  },
  {
    question: "Can I ask about the training programs?",
    answer:
      "Yes. Select Program guidance and include the course you are interested in. Admission details, schedules, fees, and curriculum will be confirmed before enrollment.",
  },
  {
    question: "Do you work with colleges and institutions?",
    answer:
      "College partnerships are part of MOUNDWEB’s planned offering. Visit the College Partnerships page to explore the collaboration framework.",
  },
  {
    question: "Do you offer franchise opportunities?",
    answer:
      "Franchise partnerships are being developed. Commercial terms, eligibility, territory, and availability must be confirmed with the team.",
  },
  {
    question: "Can I request a marketing consultation?",
    answer:
      "The inquiry form supports growth and marketing consultations. Message delivery will be enabled in the contact integration phase.",
  },
];
