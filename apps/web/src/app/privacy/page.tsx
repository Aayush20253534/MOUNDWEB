import {
  SupportingPage,
  supportingMetadata,
} from "@/components/sections/supporting-page";

export const metadata = supportingMetadata("privacy");

export default function Page() {
  return <SupportingPage section="privacy" />;
}
