import { PhotosSection } from "@/components/gallery/PhotosSection";

export function GallerySectionSkeleton() {
  return <PhotosSection loading images={[]} />;
}
