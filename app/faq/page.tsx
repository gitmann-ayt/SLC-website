import { faqs } from "@/data/site";
import { servicePages } from "@/data/services";
import { faqSchema, pageMeta } from "@/lib/seo";
import JsonLd from "@/components/JsonLd";
import { CtaBand, FaqList, PageHero } from "@/components/Page";

export const metadata = pageMeta({
  title: "Car Rental FAQs: Self Drive, Driver, Prices",
  description: "Answers about renting a car from SLC in Pakistan: self drive requirements, drivers, prices, fuel, airport pickups, monthly rental, wedding cars and trips north.",
  path: "/faq/",
});

export default function FaqPage() {
  const all = [...faqs, ...servicePages.flatMap((s) => s.faqs)];
  return (
    <main>
      <JsonLd data={faqSchema(all)} />
      <PageHero
        eyebrow="Support"
        title="Car rental FAQs"
        blurb="Plain answers about renting a car from SLC, self drive or with driver, in cities across Pakistan."
        crumbs={[{ name: "FAQ", path: "/faq/" }]}
      />
      <section className="bg-mist py-14 md:py-16">
        <div className="container-x max-w-3xl space-y-14">
          <FaqList items={faqs} title="Booking and general" />
          {servicePages.map((s) => (
            <FaqList key={s.slug} items={s.faqs} title={s.title} />
          ))}
        </div>
      </section>
      <CtaBand title="Still have a question?" body="Message us on WhatsApp and a real person will reply." />
    </main>
  );
}
