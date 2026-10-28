import Link from "next/link";
import { notFound } from "next/navigation";
import { carBySlug, type Car } from "@/data/cars";
import { serviceBySlug, servicePages } from "@/data/services";
import { faqSchema, pageMeta, serviceSchema } from "@/lib/seo";
import BookingForm from "@/components/BookingForm";
import JsonLd from "@/components/JsonLd";
import { Checklist, CtaBand, FaqList, PageHero } from "@/components/Page";
import { CarGrid } from "@/components/Sections";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;
export function generateStaticParams() {
  return servicePages.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Props) {
  const s = serviceBySlug((await params).slug);
  if (!s) return {};
  return pageMeta({ title: s.h1.replace(/^./, (c) => c.toUpperCase()), description: s.metaDescription, path: `/services/${s.slug}/` });
}

export default async function ServicePage({ params }: Props) {
  const s = serviceBySlug((await params).slug);
  if (!s) notFound();
  const path = `/services/${s.slug}/`;
  const carsFor = s.carSlugs.map(carBySlug).filter((c): c is Car => !!c);
  const others = servicePages.filter((o) => o.slug !== s.slug);

  return (
    <main>
      <JsonLd data={[serviceSchema({ name: s.title, description: s.metaDescription, path }), faqSchema(s.faqs)]} />
      <PageHero
        eyebrow={s.title}
        title={s.h1}
        blurb={s.intro[0]}
        crumbs={[{ name: "Services", path: "/services/" }, { name: s.title, path }]}
        image={s.image.startsWith("/images/cities") ? s.image : "/images/cities/islamabad.webp"}
      />

      <section className="bg-white py-14 md:py-16">
        <div className="container-x grid gap-10 lg:grid-cols-[1.25fr_0.75fr]">
          <div>
            <h2 className="text-[24px] font-semibold tracking-tight md:text-[28px]">How {s.title.toLowerCase()} works with SLC</h2>
            <div className="mt-4 space-y-4 text-[15.5px] leading-relaxed text-muted">
              {s.intro.map((p) => <p key={p.slice(0, 24)}>{p}</p>)}
            </div>
            <div className="mt-10 grid gap-6 md:grid-cols-2">
              <div className="rounded-[var(--radius-card)] border border-edge bg-mist p-6">
                <h3 className="text-[17px] font-semibold">What&apos;s included</h3>
                <div className="mt-4"><Checklist items={s.includes} /></div>
              </div>
              <div className="rounded-[var(--radius-card)] border border-edge bg-mist p-6">
                <h3 className="text-[17px] font-semibold">Ideal for</h3>
                <div className="mt-4"><Checklist items={s.idealFor} /></div>
              </div>
            </div>
            <div className="mt-12"><FaqList items={s.faqs} title={`${s.title}: FAQs`} /></div>
          </div>
          <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
            <BookingForm id="book" title={`Book: ${s.title}`} defaultType={s.slug === "self-drive-car-rental" ? "Self drive" : "With driver"} />
            <div className="rounded-[var(--radius-card)] border border-edge bg-mist p-6">
              <h2 className="text-[16px] font-semibold">Other services</h2>
              <ul className="mt-3 space-y-1">
                {others.map((o) => (
                  <li key={o.slug}><Link href={`/services/${o.slug}/`} className="flex min-h-10 items-center text-[14px] text-muted hover:text-ink">{o.title}</Link></li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </section>

      <section className="bg-mist py-14">
        <div className="container-x">
          <h2 className="text-[24px] font-semibold tracking-tight">Recommended cars</h2>
          <div className="mt-8"><CarGrid cars={carsFor} /></div>
        </div>
      </section>
      <CtaBand title={`Book ${s.title.toLowerCase()} today`} body="Send the details on WhatsApp and get a fixed quote." />
    </main>
  );
}
