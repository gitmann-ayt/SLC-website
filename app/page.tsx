import FleetFilter from "@/components/FleetFilter";
import Hero from "@/components/Hero";
import JsonLd from "@/components/JsonLd";
import {
  AreasWeServe, BrandBox, ClosingCTA, FAQ, HowToBook, Reviews, Services, WhySLC,
} from "@/components/Sections";
import { faqs } from "@/data/site";
import { faqSchema } from "@/lib/seo";

export default function Home() {
  return (
    <main>
      <JsonLd data={faqSchema(faqs)} />
      <Hero />

      <section id="fleet" className="scroll-mt-20 bg-mist py-16 md:py-20">
        <div className="container-x">
          <FleetFilter title="Our fleet" limit={8} showControls={false} />
        </div>
      </section>

      <BrandBox />
      <AreasWeServe showAll={false} />
      <Services />
      <WhySLC />
      <HowToBook />
      <FAQ items={faqs} />
      <Reviews />
      <ClosingCTA />
    </main>
  );
}
