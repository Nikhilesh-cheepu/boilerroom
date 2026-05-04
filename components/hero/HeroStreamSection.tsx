import { getHeroVideoForHome } from "@/lib/data/home-page";
import { FullBleedHero } from "./FullBleedHero";

export async function HeroStreamSection() {
  const videoSrc = await getHeroVideoForHome();

  return (
    <>
      {videoSrc ? (
        <link rel="preload" href={videoSrc} as="video" />
      ) : null}
      <FullBleedHero videoSrc={videoSrc} />
    </>
  );
}
