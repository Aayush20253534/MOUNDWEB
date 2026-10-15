import {
  SupportingPage,
  supportingMetadata,
} from "@/components/sections/supporting-page";

export const metadata = supportingMetadata("media");

export default function Page() {
  return <SupportingPage section="media" />;
}
