import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Fuel, Gauge, Luggage, Phone, Users } from "lucide-react";
import { carBySlug, carName, cars, categoryOf, fromPrice, isStudioPhoto } from "@/data/cars";
import { cities } from "@/data/locations";
import { brand, pkr, waLink } from "@/data/site";
import { carSchema, faqSchema, pageMeta } from "@/lib/seo";
import BookingForm from "@/components/BookingForm";
import JsonLd from "@/components/JsonLd";
import { Checklist, CtaBand, FaqList, PageHero } from "@/components/Page";
import { CarGrid } from "@/components/Sections";
import { BrandLogo, Button, WhatsAppIcon } from "@/components/ui";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;
export function generateStaticParams() {
  return cars.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Props) {
  const car = carBySlug((await params).slug);
  if (!car) return {};
  const name = carName(car);
  const mode = car.priceSelfDrive !== null ? "self drive or with driver" : "with driver";
  return pageMeta({
    title: `${name} for Rent: ${car.priceSelfDrive !== null ? "Self Drive & " : ""}With Driver`,
    description: `Rent a ${name} ${car.year} ${mode} in Islamabad, Lahore, Karachi and across Pakistan from ${pkr(fromPrice(car))} a day. ${car.seats} seats, ${car.transmission.toLowerCase()}, ${car.fuel.toLowerCase()}. Weekly and monthly rates.`,
    path: `/cars/${car.slug}/`,
    image: car.images[0],
  });
}

export default async function CarPage({ params }: Props) {
  const car = carBySlug((await params).slug);
  if (!car) notFound();
  const name = carName(car);
  const cat = categoryOf(car);
  const related = cars.filter((c) => c.category === car.category && c.slug !== car.slug).slice(0, 3);
  const selfDrive = car.priceSelfDrive !== null;

  const specs = [
    { label: "Seats", value: car.seats, icon: Users },
    { label: "Large bags", value: car.luggage, icon: Luggage },
    { label: "Gearbox", value: car.transmission, icon: Gauge },
    { label: "Fuel", value: car.fuel, icon: Fuel },
  ];
  const prices = [
    ...(selfDrive ? [{ label: "Self drive, per day", value: car.priceSelfDrive! }] : []),
    { label: "With driver, per day (city)", value: car.priceDay },
    { label: "Weekly", value: car.priceWeek },
    { label: "Monthly", value: car.priceMonth },
    { label: "Outstation with driver, per day", value: car.priceOutstationDay },
  ];
  const faqs = [
    { q: `How much does it cost to rent a ${name}?`, a: `${selfDrive ? `Self drive costs ${pkr(car.priceSelfDrive!)} a day. ` : ""}With a driver it is ${pkr(car.priceDay)} a day for city use, ${pkr(car.priceWeek)} a week or ${pkr(car.priceMonth)} a month. Outstation trips with driver are ${pkr(car.priceOutstationDay)} a day plus fuel and tolls.` },
    { q: `Can I rent the ${name} without a driver?`, a: selfDrive ? `Yes. The ${name} is available for self drive with a valid CNIC, driving licence and a refundable security deposit.` : `The ${name} is rented with one of our trained drivers only, who handles parking, traffic and fuel stops.` },
    { q: `In which cities can I rent the ${name}?`, a: `In ${cities().map((c) => c.name).join(", ")}, subject to availability. Tell us your city when you request a quote.` },
  ];

  return (
    <main>
      <JsonLd data={[carSchema(car), faqSchema(faqs)]} />
      <PageHero
        eyebrow={cat.title}
        title={`${name} for rent`}
        blurb={`${car.year} model · ${car.seats} seats · ${car.transmission} · ${car.fuel}. ${selfDrive ? "Self drive or with driver" : "With driver"}, from ${pkr(fromPrice(car))} a day.`}
        crumbs={[{ name: "Our fleet", path: "/cars/" }, { name, path: `/cars/${car.slug}/` }]}
        image="/images/cities/hunza.webp"
      >
        <div className="mt-7 flex flex-wrap gap-3">
          <Button href={waLink(`Hi SLC, is the ${name} available?`)} target="_blank"><WhatsAppIcon /> Ask about this car</Button>
          <a href={brand.phoneHref} className="inline-flex min-h-12 items-center gap-2 rounded-xl border border-white/70 px-6 text-[14px] font-semibold text-white hover:bg-white/10">
            <Phone className="size-4" /> Call {brand.phoneDisplay}
          </a>
        </div>
      </PageHero>

      <section className="bg-white py-14 md:py-16">
        <div className="container-x grid gap-10 lg:grid-cols-[1.25fr_0.75fr]">
          <div>
            <div className="relative aspect-[16/11] overflow-hidden rounded-[22px] bg-[radial-gradient(ellipse_at_50%_35%,#ffffff_0%,#f3f3f5_60%,#e4e4e8_100%)] ring-1 ring-edge">
              <Image src={car.images[0]} alt={`${name} ${car.year} available for rent from SLC Car Rental`} fill priority sizes="(min-width:1024px) 60vw, 100vw" className={isStudioPhoto(car.images[0]) ? "object-cover" : "object-contain"} />
              {car.badge && <span className="absolute top-4 left-4 rounded-full bg-ink px-3 py-1 text-[12px] font-bold text-white">{car.badge}</span>}
            </div>

            <ul className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {specs.map((s) => (
                <li key={s.label} className="rounded-xl border border-edge bg-mist p-4">
                  <s.icon className="size-4 text-ink" aria-hidden />
                  <p className="mt-2 text-[16px] font-bold">{s.value}</p>
                  <p className="text-[12px] text-muted">{s.label}</p>
                </li>
              ))}
            </ul>

            <h2 className="mt-10 flex items-center gap-3 text-[26px] font-bold">
              <BrandLogo logo={car.logo} name={car.make} className="size-7 text-fg" /> About the {name}
            </h2>
            <p className="mt-3 text-[16px] leading-relaxed text-muted">{car.summary}</p>

            <h3 className="mt-8 text-[18px] font-bold">Best for</h3>
            <div className="mt-3"><Checklist items={car.bestFor} /></div>

            <h3 className="mt-8 text-[18px] font-bold">Rental options</h3>
            <div className="mt-3"><Checklist items={[
              selfDrive ? "Self drive with CNIC, licence and refundable deposit" : "Available with a professional driver only",
              "With driver: city fuel included up to the daily limit",
              "Self drive: car handed over with fuel, return at the same level",
              "Outstation trips: fuel and tolls quoted separately",
            ]} /></div>

            <h3 className="mt-8 text-[18px] font-bold">Colours available</h3>
            <p className="mt-2 text-[15px] text-muted">{car.colors.join(", ")}</p>

            <h3 className="mt-8 text-[18px] font-bold">Rent the {car.model} in</h3>
            <p className="mt-2 text-[15px] leading-loose text-muted">
              {cities().map((l, i) => (
                <span key={l.slug}>
                  {i > 0 && " · "}
                  <Link href={`/rent-a-car/${l.slug}/`} className="text-fg underline decoration-ink underline-offset-4 hover:text-ink">{l.name}</Link>
                </span>
              ))}
            </p>
          </div>

          <aside className="space-y-6">
            <div className="rounded-[var(--radius-card)] border border-edge bg-mist p-6">
              <h2 className="text-[18px] font-bold">{name} prices</h2>
              <dl className="mt-4 divide-y divide-edge">
                {prices.map((p) => (
                  <div key={p.label} className="flex items-center justify-between gap-4 py-3">
                    <dt className="text-[14px] text-muted">{p.label}</dt>
                    <dd className="font-heading text-[15px] font-bold">{pkr(p.value)}</dd>
                  </div>
                ))}
              </dl>
            </div>
            <BookingForm id="book" title={`Book the ${car.model}`} defaultCar={name} defaultType={selfDrive ? "Self drive" : "With driver"} />
          </aside>
        </div>
      </section>

      <section className="bg-mist py-14">
        <div className="container-x max-w-3xl"><FaqList items={faqs} title={`${name} rental FAQs`} /></div>
      </section>

      {related.length > 0 && (
        <section className="bg-white py-14">
          <div className="container-x">
            <h2 className="text-[26px] font-bold">Similar {cat.title.toLowerCase()}</h2>
            <div className="mt-8"><CarGrid cars={related} /></div>
          </div>
        </section>
      )}

      <CtaBand title={`Book the ${name} today`} body="Send your dates and city on WhatsApp and get a fixed quote." />
    </main>
  );
}
