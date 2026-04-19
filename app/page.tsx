import { Section } from "@/components/layout/Section";
import { SiteHeader } from "@/components/nav/SiteHeader";
import { Hero } from "@/components/sections/Hero";
import { ContentRow } from "@/components/sections/ContentRow";
import { ShelfScroller } from "@/components/sections/ShelfScroller";
import { EventCard } from "@/components/sections/EventCard";
import { DJCard } from "@/components/sections/DJCard";
import { WeeklyRhythm } from "@/components/sections/WeeklyRhythm";
import { MenuShelves } from "@/components/sections/MenuShelves";
import { VenueStory } from "@/components/sections/VenueStory";
import { FaqSection } from "@/components/sections/FaqSection";
import { LocationTeaser } from "@/components/sections/LocationTeaser";
import { StickyDock } from "@/components/sticky/StickyDock";
import { getPublicSiteData } from "@/lib/data/public-site";

export const dynamic = "force-dynamic";

export default async function Home() {
  const data = await getPublicSiteData();

  return (
    <>
      <SiteHeader />
      <main className="pb-dock overflow-x-hidden">
        <Hero
          tagline={data.copy.tagline}
          heroSub={data.copy.heroSub}
          videoSrc={data.copy.heroVideoPath}
        />

        <Section className="bg-gradient-to-b from-br-bg to-br-elevated/40">
          <ContentRow
            id="events"
            title="Featured events"
            subtitle="Tonight and the weekend — tap a card, then lock a table when you’re ready."
          >
            {data.events.length === 0 ? (
              <p className="px-4 text-center text-sm text-br-muted sm:px-6">
                Events coming soon — check back or message us on WhatsApp.
              </p>
            ) : (
              <ShelfScroller ariaLabel="Featured events">
                {data.events.map((e, i) => (
                  <EventCard key={e.id} event={e} index={i} />
                ))}
              </ShelfScroller>
            )}
          </ContentRow>
        </Section>

        <Section>
          <ContentRow
            id="djs"
            title="Residents & guests"
            subtitle="Faces behind the booth — tags are a vibe check, not a contract."
          >
            {data.residents.length === 0 ? (
              <p className="px-4 text-center text-sm text-br-muted sm:px-6">
                Lineup updates soon.
              </p>
            ) : (
              <ShelfScroller ariaLabel="DJs and residents">
                {data.residents.map((dj, i) => (
                  <DJCard key={dj.id} dj={dj} index={i} />
                ))}
              </ShelfScroller>
            )}
          </ContentRow>
        </Section>

        <Section>
          <ContentRow
            title="Weekly rhythm"
            subtitle="Rough guide — doors swing with the night."
          />
          <WeeklyRhythm slots={data.weekly} />
        </Section>

        <Section id="menu" className="scroll-mt-24">
          <ContentRow
            title="Food"
            subtitle="Small plates through late night — built for the floor, not the photo."
          />
          {data.foodMenu.length === 0 ? (
            <p className="px-4 text-center text-sm text-br-muted">
              Food menu updating — ask staff tonight.
            </p>
          ) : (
            <MenuShelves categories={data.foodMenu} />
          )}
        </Section>

        <Section>
          <ContentRow
            title="Drinks"
            subtitle="Signatures and classics — ask for tonight’s batch."
          />
          {data.drinksMenu.length === 0 ? (
            <p className="px-4 text-center text-sm text-br-muted">
              Drinks list updating.
            </p>
          ) : (
            <MenuShelves categories={data.drinksMenu} />
          )}
        </Section>

        <Section>
          <VenueStory />
        </Section>

        <Section id="faq" className="scroll-mt-24">
          <FaqSection items={data.faq} />
        </Section>

        <Section className="pb-8">
          <LocationTeaser />
        </Section>
      </main>

      <StickyDock />
    </>
  );
}
