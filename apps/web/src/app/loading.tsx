import { Container, Skeleton } from "@/components/ui/primitives";
export default function Loading() {
  return (
    <Container>
      <div className="section" role="status" aria-label="Loading page">
        <Skeleton className="h-6 w-40 mb-8" />
        <Skeleton className="h-24 w-3/4 mb-8" />
        <Skeleton className="h-80 w-full" />
        <span className="sr-only">Loading MOUNDWEB…</span>
      </div>
    </Container>
  );
}
