/**
 * Only reviewed vacancies may be published. No openings have been supplied.
 * Interest areas are editorial topics, never employment vacancies.
 */
export type EmploymentType = "Full time" | "Part time" | "Contract" | "Internship";
export type CareerDepartment = "Marketing & Growth" | "Creative & Content" | "Learning & Education" | "Operations";
export type Role = {
  slug: string; title: string; department: CareerDepartment; employmentType: EmploymentType;
  location: string; arrangement: "On-site" | "Hybrid" | "Remote";
  description: string; responsibilities: string[]; requirements: string[];
  applicationUrl?: string; approvedAt?: string; closingAt?: string;
  status: "draft" | "published" | "closed";
};
export const jobListings: Role[] = [];

export function isOpenRole(role: Role): boolean {
  return role.status === "published" && Boolean(
    role.approvedAt && role.applicationUrl?.startsWith("https://") &&
    role.title.trim() && role.location.trim() &&
    role.description.trim() && role.responsibilities.length > 0 &&
    role.requirements.length > 0
  );
}
export const careerDepartments: {
  name: CareerDepartment; tagline: string; description: string; focus: string[];
}[] = [
  {
    name: "Marketing & Growth", tagline: "Strategy built on questions.",
    description: "Explore the thinking behind audience research, discoverability and meaningful brand growth.",
    focus: ["SEO and research", "Social and performance", "Audience understanding"],
  },
  {
    name: "Creative & Content", tagline: "Ideas with a point of view.",
    description: "Consider the craft behind memorable communication, content planning and creative identity.",
    focus: ["Content direction", "Storytelling", "Creative review"],
  },
  {
    name: "Learning & Education", tagline: "Help people grow their skills.",
    description: "Explore educational practice, structured learning and thoughtful learner support.",
    focus: ["Learning design", "Workshops", "Mentoring principles"],
  },
  {
    name: "Operations", tagline: "Make thoughtful work possible.",
    description: "Discover the systems, communication and coordination supporting sustainable collaboration.",
    focus: ["Team processes", "Project coordination", "Quality practices"],
  },
];
