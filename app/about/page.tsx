import Image from "next/image";
import Link from "next/link";
import { BadgeCheck, Car as CarIcon, CheckCircle2, Clock, KeyRound, MapPin, Quote, ShieldCheck, Sparkles, Tag } from "lucide-react";
import { about, yearsInBusiness } from "@/data/about";
import { cars } from "@/data/cars";
import { brand } from "@/data/site";
import { abs, pageMeta, personSchema } from "@/lib/seo";
import JsonLd from "@/components/JsonLd";
import { CtaBand, PageHero } from "@/components/Page";
import { AreasWeServe } from "@/components/Sections";
import { SectionHead } from "@/components/ui";

const { ceo, company } = about;

export const metadata = pageMeta({
  title: "About SLC Car Rental: Our Story, CEO & Fleet Standards",
  description: `Meet ${brand.fullName}: ${yearsInBusiness()}+ years of car rental across Pakistan, self drive or with driver. Our founder and CEO, fleet standards and service commitments.`,
  path: "/about/",
  image: ceo.photo,
});

const commitmentIcons = [Tag, KeyRound, BadgeCheck, Clock];
const standardIcons = [ShieldCheck, Sparkles, CarIcon, CheckCircle2];

export default function AboutPage() {
  const stats = [
    { value: `${yearsInBusiness()}+`, label: "Years of experience", icon: BadgeCheck },
    { value: `${cars.length}+`, label: "Car models, hatchback to Coaster", icon: CarIcon },
    { value: "All", label: "Cities across Pakistan", icon: MapPin },
    { value: "24/7", label: "Bookings and roadside help", icon: Clock },
  ];

  return (
    <main>
      <JsonLd
        data={[
          { "@context": "https://schema.org", "@type": "AboutPage", name: `About ${brand.fullName}`, url: abs("/about/"), about: { "@id": abs("/#business") } },
          // Only publish Person schema once the real name is in place.
          ...(about.isPlaceholder ? [] : [personSchema({ name: ceo.name, role: ceo.role, photo: ceo.photo, description: ceo.bio[0] })]),
        ]}
      />

      <PageHero eyebrow="About SLC" title={`About ${brand.fullName}`} blurb={company.intro} crumbs={[{ name: "About", path: "/about/" }]} image="/images/cities/islamabad.webp" />

      {/* ---------- CEO: text left, photo right ---------- */}
      <section id="ceo" className="scroll-mt-24 overflow-x-clip bg-white py-16 md:py-24">
        <div className="container-x">
          {about.isPlaceholder && (
            <p className="mb-8 inline-block rounded-lg border border-dashed border-star bg-star/10 px-3 py-2 text-[12px] text-fg">
              Draft: add the founding year and confirm the CEO&apos;s bio in <code>data/about.ts</code> before launch.
            </p>
          )}
          <div className="grid items-center gap-12 md:grid-cols-[1.15fr_0.85fr] lg:gap-16">
            <div>
              <p className="eyebrow text-muted">Meet our CEO</p>
              <h2 className="mt-3 text-[32px] leading-tight font-bold md:text-[44px]">{ceo.name}</h2>
              <p className="mt-2 text-[15px] font-semibold text-muted">{ceo.role}, {brand.fullName}</p>
              <div className="mt-6 space-y-4 text-[16px] leading-relaxed text-muted">
                {ceo.bio.map((p) => <p key={p.slice(0, 24)}>{p}</p>)}
              </div>
              <blockquote className="mt-8 rounded-[var(--radius-card)] border-l-4 border-ink bg-mist p-6">
                <Quote className="size-6 text-gold-ink" aria-hidden />
                <p className="mt-3 text-[17px] leading-relaxed font-medium text-fg">&ldquo;{ceo.quote}&rdquo;</p>
                <footer className="mt-3 text-[13px] text-muted">— {ceo.name}, {ceo.role}</footer>
              </blockquote>
              <ul className="mt-8 flex flex-wrap gap-2" aria-label="Areas of focus">
                {ceo.focus.map((f) => (
                  <li key={f} className="rounded-full border border-edge bg-card px-3.5 py-1.5 text-[13px] font-medium text-fg">{f}</li>
                ))}
              </ul>
            </div>

            <figure className="relative order-first mx-auto w-full max-w-sm md:order-last md:max-w-none">
              <div aria-hidden className="absolute -inset-3 translate-x-4 translate-y-4 rounded-3xl bg-accent md:-inset-4" />
              <div className="relative overflow-hidden rounded-3xl border border-edge bg-mist shadow-xl">
                <Image src={ceo.photo} alt={`${ceo.name}, ${ceo.role} of ${brand.fullName}`} width={ceo.photoWidth} height={ceo.photoHeight} sizes="(min-width: 768px) 40vw, 90vw" priority className="aspect-[4/5] w-full object-cover object-top" />
                <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/90 to-transparent p-5 pt-16 text-white">
                  <span className="font-heading block text-[17px] font-bold">{ceo.name}</span>
                  <span className="text-[13px] text-white/75">{ceo.role}</span>
                </figcaption>
              </div>
            </figure>
          </div>
        </div>
      </section>

      {/* ---------- Experience in numbers ---------- */}
      <section className="bg-ink py-14">
        <div className="container-x grid grid-cols-2 gap-4 md:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="rounded-[var(--radius-card)] border border-ink-3 bg-ink-2 p-6">
              <s.icon className="size-5 text-white/70" aria-hidden />
              <p className="font-heading mt-4 text-[32px] font-extrabold text-white md:text-[40px]">{s.value}</p>
              <p className="mt-1 text-[13.5px] text-white/65">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ---------- Company background ---------- */}
      <section id="company" className="scroll-mt-24 bg-mist py-16 md:py-24">
        <div className="container-x grid gap-12 lg:grid-cols-2">
          <div>
            <SectionHead align="left" eyebrow="Our story" title={`${yearsInBusiness()}+ years of car rental in Pakistan`} />
            <div className="mt-6 space-y-4 text-[16px] leading-relaxed text-muted">
              {company.story.map((p) => <p key={p.slice(0, 24)}>{p}</p>)}
            </div>
            <p className="mt-6 text-[15px]">
              <Link href="/cars/" className="font-semibold text-fg underline decoration-ink decoration-2 underline-offset-4 hover:text-ink">Browse the fleet</Link>
              <span className="text-muted"> or see </span>
              <Link href="/services/" className="font-semibold text-fg underline decoration-ink decoration-2 underline-offset-4 hover:text-ink">our services</Link>.
            </p>
          </div>
          <div>
            <h2 className="text-[24px] font-bold md:text-[28px]">Who we work with</h2>
            <ul className="mt-5 grid gap-3 sm:grid-cols-2">
              {company.clients.map((c) => (
                <li key={c} className="flex items-center gap-3 rounded-xl border border-edge bg-card px-4 py-3.5 text-[14.5px] font-medium">
                  <BadgeCheck className="size-4 shrink-0 text-ink" aria-hidden /> {c}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ---------- Fleet standards ---------- */}
      <section id="standards" className="scroll-mt-24 bg-white py-16 md:py-24">
        <div className="container-x">
          <SectionHead eyebrow="Fleet standards" title="Every car, every time" blurb="What we check before a car is handed over to you." />
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {company.standards.map((v, i) => {
              const Icon = standardIcons[i % standardIcons.length];
              return (
                <article key={v.title} className="rounded-[var(--radius-card)] border border-edge bg-mist p-6">
                  <span className="grid size-12 place-items-center rounded-xl bg-ink text-white"><Icon className="size-5" aria-hidden /></span>
                  <h3 className="mt-5 text-[17px] font-bold">{v.title}</h3>
                  <p className="mt-2 text-[14.5px] leading-relaxed text-muted">{v.body}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* ---------- Service commitments ---------- */}
      <section className="bg-ink py-16 md:py-24">
        <div className="container-x">
          <SectionHead dark eyebrow="Our commitments" title="What we promise on every booking" />
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {company.commitments.map((v, i) => {
              const Icon = commitmentIcons[i % commitmentIcons.length];
              return (
                <article key={v.title} className="rounded-[var(--radius-card)] border border-ink-3 bg-ink-2 p-6">
                  <span className="grid size-12 place-items-center rounded-xl bg-white text-ink"><Icon className="size-5" aria-hidden /></span>
                  <h3 className="mt-5 text-[17px] font-bold text-white">{v.title}</h3>
                  <p className="mt-2 text-[14.5px] leading-relaxed text-white/65">{v.body}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <AreasWeServe showAll={false} />
      <CtaBand title="Ready to book with SLC?" body="Send your trip details and we will reply with a fixed quote, usually within minutes." />
    </main>
  );
}
