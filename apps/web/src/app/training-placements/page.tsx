import {
  SupportingPage,
  supportingMetadata,
} from "@/components/sections/supporting-page";

export const metadata = supportingMetadata("training-placements");

export default function Page() {
  return <SupportingPage section="training-placements" />;
}
