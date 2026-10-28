import { ChevronRight } from "lucide-react";
import FleetFilter from "@/components/FleetFilter";
import Hero from "@/components/Hero";
import JsonLd from "@/components/JsonLd";
import {
  AreasWeServe, BrandBox, ClosingCTA, FAQ, HowToBook, Reviews, Services, WhySLC,
} from "@/components/Sections";
import { Button, SectionHead } from "@/components/ui";
import { faqs } from "@/data/site";
import { faqSchema } from "@/lib/seo";

export default function Home() {
  return (
    <main>
      <JsonLd data={faqSchema(faqs)} />
      <Hero />
      <AreasWeServe showAll={false} />

      <section id="fleet" className="scroll-mt-24 bg-stone py-16 md:py-24">
        <div className="container-x">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <SectionHead align="left" eyebrow="Popular vehicles" title="From everyday hatchbacks to SUVs and luxury" blurb="Every car is available with a driver, and most are available for self drive." />
            <Button href="/cars/" variant="ghost-light">View full fleet <ChevronRight className="size-4" /></Button>
          </div>
          <div className="mt-8"><FleetFilter limit={6} showControls={false} /></div>
        </div>
      </section>

      <BrandBox />
      <Services />
      <WhySLC />
      <HowToBook />
      <FAQ items={faqs} />
      <Reviews />
      <ClosingCTA />
    </main>
  );
}
