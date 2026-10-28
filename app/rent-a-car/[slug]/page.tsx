import Link from "next/link";
import { notFound } from "next/navigation";
import { Clock, MapPin, Navigation } from "lucide-react";
import { carBySlug, cars, type Car } from "@/data/cars";
import { locationBySlug, locationImage, locations } from "@/data/locations";
import { brand, faqs as generalFaqs } from "@/data/site";
import { abs, faqSchema, pageMeta } from "@/lib/seo";
import BookingForm from "@/components/BookingForm";
import JsonLd from "@/components/JsonLd";
import { Checklist, CtaBand, FaqList, MapEmbed, PageHero } from "@/components/Page";
import { CarGrid } from "@/components/Sections";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;
export function generateStaticParams() {
  return locations.map((l) => ({ slug: l.slug }));
}

export async function generateMetadata({ params }: Props) {
  const loc = locationBySlug((await params).slug);
  if (!loc) return {};
  return pageMeta({
    title: `Rent a Car in ${loc.place}: Self Drive & With Driver`,
    description: loc.metaDescription,
    path: `/rent-a-car/${loc.slug}/`,
  });
}

export default async function LocationPage({ params }: Props) {
  const loc = locationBySlug((await params).slug);
  if (!loc) notFound();

  const featured = loc.carSlugs.map(carBySlug).filter((c): c is Car => !!c);
  const more = cars.filter((c) => !loc.carSlugs.includes(c.slug)).slice(0, 3);
  const nearby = loc.nearby.map(locationBySlug).filter((l) => !!l);
  const faqs = [...loc.faqs, generalFaqs[2], generalFaqs[5]];
  const path = `/rent-a-car/${loc.slug}/`;

  return (
    <main>
      <JsonLd
        data={[
          faqSchema(faqs),
          {
            "@context": "https://schema.org",
            "@type": "Service",
            name: `Car rental in ${loc.place}`,
            serviceType: "Car rental",
            url: abs(path),
            provider: { "@id": abs("/#business") },
            areaServed: { "@type": "Place", name: loc.place },
          },
        ]}
      />

      <PageHero
        eyebrow={loc.kind === "sector" ? "Islamabad sector" : loc.kind === "destination" ? "Trips & tours" : loc.kind === "city" ? "City" : "Service area"}
        title={`Rent a car in ${loc.place}`}
        blurb={`Self-drive cars and cars with drivers in ${loc.name}: hatchbacks, sedans, SUVs and vans, with doorstep delivery, fixed quotes and 24/7 support from ${brand.fullName}.`}
        image={locationImage(loc.slug)}
        color
        crumbs={[{ name: "Locations", path: "/rent-a-car/" }, { name: loc.place, path }]}
      />

      <section className="bg-white py-14 md:py-16">
        <div className="container-x grid gap-10 lg:grid-cols-[1.25fr_0.75fr]">
          <div>
            <h2 className="text-[26px] font-bold md:text-[30px]">Car rental in {loc.name}</h2>
            <div className="mt-4 space-y-4 text-[15.5px] leading-relaxed text-muted">
              {loc.intro.map((p) => <p key={p.slice(0, 24)}>{p}</p>)}
            </div>

            <div className="mt-10 grid gap-6 md:grid-cols-2">
              <div className="rounded-[var(--radius-card)] border border-edge bg-mist p-6">
                <h3 className="flex items-center gap-2 text-[17px] font-bold"><MapPin className="size-4 text-ink" aria-hidden /> Landmarks we cover</h3>
                <div className="mt-4"><Checklist items={loc.landmarks} /></div>
              </div>
              <div className="rounded-[var(--radius-card)] border border-edge bg-mist p-6">
                <h3 className="flex items-center gap-2 text-[17px] font-bold"><Navigation className="size-4 text-ink" aria-hidden /> Pickup in {loc.name}</h3>
                <p className="mt-4 text-[14.5px] leading-relaxed text-muted">{loc.pickup}</p>
              </div>
            </div>

            <h3 className="mt-10 flex items-center gap-2 text-[19px] font-bold"><Clock className="size-4 text-ink" aria-hidden /> Popular trips from {loc.name}</h3>
            <div className="mt-4 overflow-hidden rounded-[var(--radius-card)] border border-edge">
              <table className="w-full text-left text-[14.5px]">
                <thead className="bg-mist text-[12px] tracking-wider text-muted uppercase">
                  <tr><th className="px-4 py-3 font-bold">Trip</th><th className="px-4 py-3 font-bold">Typical drive time</th></tr>
                </thead>
                <tbody className="divide-y divide-edge">
                  {loc.trips.map((t) => (
                    <tr key={t.to}><td className="px-4 py-3">{t.to}</td><td className="px-4 py-3 text-muted">{t.time}</td></tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-2 text-[12.5px] text-muted">Times are typical and depend on traffic and weather.</p>

            <div className="mt-10">
              <h3 className="mb-4 text-[19px] font-bold">{loc.name} on the map</h3>
              <MapEmbed query={loc.mapQuery} title={`Map of ${loc.place}`} />
            </div>
          </div>

          <aside className="lg:sticky lg:top-24 lg:self-start">
            <BookingForm id="book" title={`Book a car in ${loc.name}`} defaultCity={loc.kind === "city" ? loc.name : ""} />
          </aside>
        </div>
      </section>

      <section className="bg-mist py-14">
        <div className="container-x">
          <h2 className="text-[26px] font-bold md:text-[30px]">Popular cars in {loc.name}</h2>
          <div className="mt-8"><CarGrid cars={featured} /></div>
          <h3 className="mt-12 text-[19px] font-bold">More from the fleet</h3>
          <div className="mt-6"><CarGrid cars={more} /></div>
        </div>
      </section>

      <section className="bg-white py-14">
        <div className="container-x grid gap-12 lg:grid-cols-[1.4fr_0.6fr]">
          <FaqList items={faqs} title={`Car rental in ${loc.name}: FAQs`} />
          {nearby.length > 0 && (
            <div>
              <h2 className="text-[20px] font-bold">Nearby areas</h2>
              <ul className="mt-4 space-y-2">
                {nearby.map((n) => (
                  <li key={n!.slug}>
                    <Link href={`/rent-a-car/${n!.slug}/`} className="flex min-h-11 items-center rounded-lg border border-edge px-4 text-[14px] font-medium hover:border-ink hover:text-ink">
                      Rent a car in {n!.place}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </section>

      <CtaBand title={`Need a car in ${loc.name}?`} body="Send your pickup point and dates. We reply with a fixed quote, usually within minutes." />
    </main>
  );
}
