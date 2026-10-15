import {
  SupportingPage,
  supportingMetadata,
} from "@/components/sections/supporting-page";

export const metadata = supportingMetadata("career");

export default function Page() {
  return <SupportingPage section="career" />;
}
