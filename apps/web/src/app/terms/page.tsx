import {
  SupportingPage,
  supportingMetadata,
} from "@/components/sections/supporting-page";

export const metadata = supportingMetadata("terms");

export default function Page() {
  return <SupportingPage section="terms" />;
}
