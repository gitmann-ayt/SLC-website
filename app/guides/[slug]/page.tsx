import Link from "next/link";
import { notFound } from "next/navigation";
import { carBySlug, type Car } from "@/data/cars";
import { guideBySlug, guides } from "@/data/guides";
import { locationBySlug } from "@/data/locations";
import { serviceBySlug } from "@/data/services";
import { articleSchema, faqSchema, pageMeta } from "@/lib/seo";
import BookingForm from "@/components/BookingForm";
import JsonLd from "@/components/JsonLd";
import { Checklist, CtaBand, FaqList, PageHero } from "@/components/Page";
import { CarGrid } from "@/components/Sections";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;
export function generateStaticParams() {
  return guides.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({ params }: Props) {
  const g = guideBySlug((await params).slug);
  if (!g) return {};
  return pageMeta({ title: g.metaTitle, description: g.metaDescription, path: `/guides/${g.slug}/`, image: g.image });
}

const nice = (d: string) => new Date(`${d}T00:00:00Z`).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });

export default async function GuidePage({ params }: Props) {
  const g = guideBySlug((await params).slug);
  if (!g) notFound();
  const path = `/guides/${g.slug}/`;
  const carsFor = g.related.cars.map(carBySlug).filter((c): c is Car => !!c);
  const places = g.related.locations.map(locationBySlug).filter((l) => !!l);
  const services = g.related.services.map(serviceBySlug).filter((s) => !!s);
  const others = guides.filter((o) => o.slug !== g.slug).slice(0, 5);

  return (
    <main>
      <JsonLd
        data={[
          articleSchema({ headline: g.h1, description: g.metaDescription, path, image: g.image, published: g.published, updated: g.updated }),
          faqSchema(g.faqs),
        ]}
      />
      <PageHero eyebrow="Guide" title={g.h1} crumbs={[{ name: "Guides", path: "/guides/" }, { name: g.title, path }]} image={g.image} />

      <section className="bg-white py-14 md:py-16">
        <div className="container-x grid gap-10 lg:grid-cols-[1.25fr_0.75fr]">
          <article>
            <p className="text-[13px] text-muted">
              Updated <time dateTime={g.updated}>{nice(g.updated)}</time>
            </p>
            <div className="mt-4 rounded-[var(--radius-card)] border-l-4 border-gold bg-mist p-6">
              <h2 className="text-[13px] font-semibold tracking-[0.14em] text-muted uppercase">Short answer</h2>
              <p className="mt-2 text-[16px] leading-relaxed text-ink">{g.answer}</p>
            </div>
            {g.sections.map((s) => (
              <section key={s.heading} className="mt-10">
                <h2 className="text-[22px] font-semibold tracking-tight md:text-[26px]">{s.heading}</h2>
                <div className="mt-4 space-y-4 text-[15.5px] leading-relaxed text-muted">
                  {s.paragraphs.map((p) => <p key={p.slice(0, 32)}>{p}</p>)}
                </div>
                {s.bullets && <div className="mt-4"><Checklist items={s.bullets} /></div>}
              </section>
            ))}
            <div className="mt-12"><FaqList items={g.faqs} /></div>
          </article>

          <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
            <BookingForm id="book" title="Get a fixed quote" defaultType="With driver" />
            {(services.length > 0 || places.length > 0) && (
              <div className="rounded-[var(--radius-card)] border border-edge bg-mist p-6">
                <h2 className="text-[16px] font-semibold">Related</h2>
                <ul className="mt-3 space-y-1">
                  {services.map((s) => (
                    <li key={s.slug}><Link href={`/services/${s.slug}/`} className="flex min-h-10 items-center text-[14px] text-muted hover:text-ink">{s.title}</Link></li>
                  ))}
                  {places.map((l) => (
                    <li key={l.slug}><Link href={`/rent-a-car/${l.slug}/`} className="flex min-h-10 items-center text-[14px] text-muted hover:text-ink">Rent a car in {l.place}</Link></li>
                  ))}
                </ul>
              </div>
            )}
            {others.length > 0 && (
              <div className="rounded-[var(--radius-card)] border border-edge bg-mist p-6">
                <h2 className="text-[16px] font-semibold">More guides</h2>
                <ul className="mt-3 space-y-1">
                  {others.map((o) => (
                    <li key={o.slug}><Link href={`/guides/${o.slug}/`} className="flex min-h-10 items-center text-[14px] text-muted hover:text-ink">{o.title}</Link></li>
                  ))}
                </ul>
              </div>
            )}
          </aside>
        </div>
      </section>

      {carsFor.length > 0 && (
        <section className="bg-mist py-14">
          <div className="container-x">
            <h2 className="text-[24px] font-semibold tracking-tight">Recommended cars</h2>
            <div className="mt-8"><CarGrid cars={carsFor} /></div>
          </div>
        </section>
      )}
      <CtaBand title="Planning this trip?" body="Send your dates and route on WhatsApp and get a fixed quote." />
    </main>
  );
}
