import { StickyDock } from "@/components/sticky/StickyDock";
import { getSiteContactForHome } from "@/lib/data/home-page";

export async function HomeStickyDock() {
  const contact = await getSiteContactForHome();
  return <StickyDock contact={contact} />;
}
