import CardSkeleton from "@/components/skeleton/Skeleton";
import Container from "./container";

export default async function Loading() {
  return (
    <Container>
      <div className="my-8 grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-6">
        {[...Array(36)].map((_, index) => (
          <CardSkeleton key={index} />
        ))}
      </div>
    </Container>
  );
}
