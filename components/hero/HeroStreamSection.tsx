import { getHeroVideoForHome } from "@/lib/data/home-page";
import { FullBleedHero } from "./FullBleedHero";

export async function HeroStreamSection() {
  const videoSrc = await getHeroVideoForHome();
  return <FullBleedHero videoSrc={videoSrc} />;
}
