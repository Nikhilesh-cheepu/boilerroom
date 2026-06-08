import { PhotosSection } from "@/components/gallery/PhotosSection";
import { getSiteContactForHome } from "@/lib/data/home-page";
import { getGalleryAll } from "@/lib/gallery-data";
import { buildWhatsAppHref } from "@/lib/whatsapp";

export async function GallerySection() {
  const [images, contact] = await Promise.all([
    getGalleryAll(),
    getSiteContactForHome(),
  ]);

  const photoUrls = images.map((img) => img.url);
  const whatsappHref = buildWhatsAppHref(
    contact.whatsappE164,
    "Hi Boiler Room — I'd love to see more photos from the venue!",
  );

  return (
    <PhotosSection
      images={photoUrls}
      accentColor="#ff6b3d"
      venueName="Boiler Room"
      instagramUrl={contact.instagramUrl}
      whatsappHref={whatsappHref}
    />
  );
}
