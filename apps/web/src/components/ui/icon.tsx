import {
  Search,
  ChartNoAxesCombined,
  Users,
  PenTool,
  Grid2X2,
  Target,
  Code2,
  BrainCircuit,
  BookOpen,
  BriefcaseBusiness,
  GraduationCap,
  Landmark,
  Handshake,
  Lightbulb,
  Settings,
  Layers,
  Rocket,
  Mail,
  Phone,
  MapPin,
  Clock3,
  Play,
  Globe2,
  Sparkles,
} from "lucide-react";
import type { IconName } from "@/lib/content";

const icons = {
  search: Search,
  chart: ChartNoAxesCombined,
  users: Users,
  pen: PenTool,
  grid: Grid2X2,
  target: Target,
  code: Code2,
  brain: BrainCircuit,
  book: BookOpen,
  briefcase: BriefcaseBusiness,
  cap: GraduationCap,
  building: Landmark,
  handshake: Handshake,
  lightbulb: Lightbulb,
  settings: Settings,
  layers: Layers,
  rocket: Rocket,
  mail: Mail,
  phone: Phone,
  pin: MapPin,
  clock: Clock3,
  play: Play,
  globe: Globe2,
  sparkles: Sparkles,
};
export function Icon({
  name,
  size = 24,
  className,
}: {
  name: IconName;
  size?: number;
  className?: string;
}) {
  const Component = icons[name];
  return (
    <Component
      size={size}
      strokeWidth={1.65}
      aria-hidden="true"
      className={className}
    />
  );
}
