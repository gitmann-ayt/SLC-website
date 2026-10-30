import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight, Armchair, BadgeCheck, Briefcase, CalendarCheck, Car, ChevronRight, CircleCheck, KeyRound,
  MapPinned, MessageSquareText, Mountain, Phone, Plane, ShieldCheck, Sparkles, Tag,
} from "lucide-react";
import { about, yearsInBusiness } from "@/data/about";
import { cars, carsIn, categories, type CategorySlug } from "@/data/cars";
import { locationGroups, locationImage, locations } from "@/data/locations";
import { brand, carMakes, footerCols, services, steps, waLink } from "@/data/site";
import { Logo } from "./Header";
import { BrandLogo, Button, SectionHead, WhatsAppIcon } from "./ui";

export { CarCard, CarGrid } from "./CarCard";

/* ---------- Car types strip (under the hero) ---------- */
const categoryImages: Record<CategorySlug, string> = {
  hatchback: "/images/cutouts/suzuki-alto-white.webp",
  sedan: "/images/cutouts/toyota-corolla-black.webp",
  suv: "/images/cutouts/kia-sportage-black.webp",
  luxury: "/images/cutouts/mercedes-s500-black.webp",
  van: "/images/cutouts/toyota-hiace-grey.webp",
};

export function CategoryStrip() {
  return (
    <ul className="grid grid-cols-2 overflow-hidden rounded-2xl border border-edge bg-white sm:grid-cols-3 lg:grid-cols-5">
      {categories.map((c) => (
        <li key={c.slug} className="border-edge [&:not(:last-child)]:border-r [&:not(:last-child)]:border-b lg:[&:not(:last-child)]:border-b-0">
          <Link href={`/cars/?type=${c.slug}`} className="group flex flex-col items-center px-4 pt-4 pb-5 text-center transition hover:bg-mist">
            <span className="relative block aspect-[16/9] w-full max-w-[200px]">
              <Image src={categoryImages[c.slug]} alt="" fill sizes="200px" className="object-contain transition duration-500 group-hover:-translate-y-1 group-hover:scale-105" />
            </span>
            <span className="mt-2 text-[15px] font-semibold text-ink">{c.title}</span>
            <span className="text-[12.5px] text-muted">{carsIn(c.slug).length} cars</span>
          </Link>
        </li>
      ))}
    </ul>
  );
}

/* ---------- Brands: dark box with three tilted logo columns ---------- */
const columnAnimations = ["animate-marquee-up", "animate-marquee-down", "animate-marquee-up-slow"];

function LogoColumn({ offset, animation }: { offset: number; animation: string }) {
  const list = [...carMakes.slice(offset), ...carMakes.slice(0, offset)];
  const loop = [...list, ...list];
  return (
    <div className="relative h-full">
      <ul className={`flex flex-col gap-4 ${animation}`}>
        {loop.map((m, i) => (
          <li
            key={i}
            aria-hidden={i >= list.length}
            className="flex h-32 flex-col items-center justify-center gap-3 rounded-2xl border border-white/10 bg-graphite"
          >
            {/* Glow on a wrapper: the logo's mask would clip a filter on the logo itself */}
            <span className="flex drop-shadow-glow">
              <BrandLogo logo={m.logo} name={m.name} className={`logo-gold ${m.logo === "changan" || m.logo === "haval" ? "h-8 w-24" : "size-12"}`} />
            </span>
            {m.logo !== "haval" && <span className="text-[11px] font-semibold tracking-[0.18em] text-white/45 uppercase">{m.name}</span>}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function BrandBox() {
  return (
    <section className="bg-mist py-16 md:py-24" aria-label="Car brands we offer">
      <div className="container-x">
        <div className="relative isolate min-h-[520px] overflow-hidden rounded-[28px] bg-charcoal md:min-h-[560px]">
          {/* Tilted logo columns in the background */}
          <div aria-hidden className="absolute -top-[30%] -right-[8%] -bottom-[30%] -z-20 grid w-[115%] rotate-[-14deg] grid-cols-3 gap-4 opacity-70 sm:w-[90%] md:-right-[4%] md:w-[62%] md:opacity-100">
            {columnAnimations.map((anim, i) => (
              <LogoColumn key={anim} offset={i * 3} animation={anim} />
            ))}
          </div>
          {/* Fade so the text stays readable */}
          <div aria-hidden className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,var(--color-charcoal)_0%,var(--color-charcoal)_30%,rgb(24_24_27/0.75)_52%,transparent_80%)] max-md:bg-[linear-gradient(180deg,var(--color-charcoal)_0%,rgb(24_24_27/0.9)_55%,rgb(24_24_27/0.6)_100%)]" />

          <div className="flex min-h-[520px] max-w-xl flex-col justify-center p-8 md:min-h-[560px] md:p-14">
            <p className="eyebrow inline-flex items-center gap-2 text-gold-light"><span className="h-px w-6 bg-gold" />Brands we offer</p>
            <h2 className="mt-4 text-[30px] leading-[1.12] font-semibold text-white md:text-[42px]">Pakistan&apos;s favourite car brands, in one fleet</h2>
            <p className="mt-4 text-[16px] leading-relaxed text-white/65">
              Toyota, Honda and Suzuki for everyday driving, Hyundai and Kia for modern SUVs, and Mercedes-Benz, Audi and Lexus when the occasion calls for it.
            </p>
            <div className="mt-8 flex gap-8 border-t border-white/10 pt-6">
              <div><p className="font-heading text-[28px] font-semibold text-gold-light">{carMakes.length}</p><p className="text-[13px] text-white/50">Brands</p></div>
              <div><p className="font-heading text-[28px] font-semibold text-gold-light">{cars.length}+</p><p className="text-[13px] text-white/50">Models</p></div>
              <div><p className="font-heading text-[28px] font-semibold text-gold-light">{categories.length}</p><p className="text-[13px] text-white/50">Car types</p></div>
            </div>
            <div className="mt-8"><Button href="/cars/" variant="gold">Browse the fleet <ArrowRight className="size-4" /></Button></div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- Services (dark band) ---------- */
const serviceIcons = { key: KeyRound, pin: MapPinned, plane: Plane, briefcase: Briefcase, calendar: CalendarCheck, mountain: Mountain };

export function Services() {
  return (
    <section id="services" className="scroll-mt-24 bg-charcoal py-16 md:py-24">
      <div className="container-x">
        <SectionHead dark eyebrow="Our services" title="One company for every kind of trip" blurb="Self drive or with driver, for an hour, a wedding or a whole year." />
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s, i) => {
            const Icon = serviceIcons[s.icon];
            return (
              <Link key={s.title} href={s.href} className="group relative overflow-hidden rounded-2xl border border-white/10 bg-graphite p-7 transition duration-300 hover:-translate-y-1 hover:border-gold/50 hover:shadow-glow-lg">
                <span aria-hidden className="font-heading absolute top-5 right-6 text-[48px] leading-none font-bold text-gold/[0.09]">0{i + 1}</span>
                <span className="grid size-12 place-items-center rounded-xl bg-gold-sheen text-ink shadow-glow-sm"><Icon className="size-6" aria-hidden /></span>
                <h3 className="mt-6 text-[19px] font-semibold text-white">{s.title}</h3>
                <p className="mt-2 text-[14.5px] leading-relaxed text-white/60">{s.body}</p>
                <span className="mt-6 inline-flex items-center gap-2 text-[13px] font-semibold text-white">
                  Explore <span className="grid size-7 place-items-center rounded-full border border-gold/40 text-gold transition group-hover:bg-gold group-hover:text-ink"><ChevronRight className="size-4" aria-hidden /></span>
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ---------- Why SLC (company only; the CEO is on /about/) ---------- */
export function WhySLC() {
  const stats = [
    { value: `${yearsInBusiness()}+`, label: "Years in operation" },
    { value: `${cars.length}+`, label: "Car models" },
    { value: "All", label: "Cities across Pakistan" },
    { value: "24/7", label: "Support" },
  ];
  const points = [
    { icon: Tag, title: "Fixed, upfront prices", body: "The quote you accept is the price you pay." },
    { icon: ShieldCheck, title: "Checked before every rental", body: "Tyres, brakes, AC and documents inspected each time." },
    { icon: Sparkles, title: "Clean, recent cars", body: "Washed and sanitised between every customer." },
    { icon: BadgeCheck, title: "Verified drivers", body: "Trained, courteous and experienced on every route." },
  ];
  return (
    <section className="bg-white py-16 md:py-24">
      <div className="container-x grid items-center gap-12 lg:grid-cols-2">
        <div>
          <SectionHead align="left" eyebrow="Why SLC" title="Car rental you can count on, in every city we serve" blurb={about.company.story[0]} />
          <ul className="mt-8 grid gap-5 sm:grid-cols-2">
            {points.map((p) => (
              <li key={p.title} className="flex gap-3">
                <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-ink text-gold"><p.icon className="size-5" aria-hidden /></span>
                <span>
                  <span className="block text-[15px] font-bold">{p.title}</span>
                  <span className="text-[14px] text-muted">{p.body}</span>
                </span>
              </li>
            ))}
          </ul>
          <Button href="/about/" className="mt-9">About SLC <ChevronRight className="size-4" /></Button>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {stats.map((s, i) => (
            <div key={s.label} className={`rounded-2xl p-7 ${i === 0 ? "bg-ink text-white shadow-glow-lg" : i === 3 ? "bg-charcoal text-white" : "bg-stone"}`}>
              <p className={`font-heading text-[38px] font-bold md:text-[46px] ${i === 0 || i === 3 ? "text-gold-light" : ""}`}>{s.value}</p>
              <p className={`mt-1 text-[14px] ${i === 0 || i === 3 ? "text-white/60" : "text-muted"}`}>{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- Areas we serve: city photo cards + all location links ---------- */
export function AreasWeServe({ showAll = true }: { showAll?: boolean }) {
  const cityList = locations.filter((l) => l.kind === "city");
  return (
    <section id="areas" className="scroll-mt-24 bg-white py-16 md:py-24">
      <div className="container-x">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <SectionHead align="left" eyebrow="Areas we serve" title="Car rental across Pakistan" blurb="Local pickup and delivery in every city below, and trips anywhere in the country." />
          <Button href="/rent-a-car/" variant="ghost-light">All locations <ChevronRight className="size-4" /></Button>
        </div>
        <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
          {cityList.map((c) => (
            <Link key={c.slug} href={`/rent-a-car/${c.slug}/`} className="group relative h-48 overflow-hidden rounded-2xl md:h-56">
              <Image src={locationImage(c.slug)} alt={`Rent a car in ${c.name}`} fill sizes="(min-width:1024px) 20vw, (min-width:768px) 33vw, 50vw" className="object-cover transition duration-700 group-hover:scale-105" />
              <span className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/15 to-transparent" />
              <span className="absolute inset-x-4 bottom-4 text-white">
                <span className="block text-[11px] font-semibold tracking-[0.16em] text-white/70 uppercase">Rent a car in</span>
                <span className="font-heading text-[20px] font-bold">{c.name}</span>
              </span>
            </Link>
          ))}
        </div>

        {showAll && (
          <div className="mt-12 grid gap-8 rounded-2xl bg-mist p-6 sm:grid-cols-2 md:p-8 lg:grid-cols-3">
            {locationGroups.filter((g) => g.kind !== "city").map((g) => (
              <div key={g.kind}>
                <h3 className="text-[15px] font-bold">{g.title}</h3>
                <ul className="mt-3 space-y-0.5">
                  {locations.filter((l) => l.kind === g.kind).map((l) => (
                    <li key={l.slug}>
                      <Link href={`/rent-a-car/${l.slug}/`} className="inline-flex min-h-9 items-center gap-1.5 text-[14px] text-muted hover:text-ink">
                        <ChevronRight className="size-3.5" aria-hidden /> Rent a car in {l.place}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

/* ---------- How to book ---------- */
const stepIcons = { car: Car, message: MessageSquareText, check: CircleCheck, seat: Armchair };

export function HowToBook() {
  return (
    <section id="how-to-book" className="scroll-mt-24 bg-stone py-16 md:py-24">
      <div className="container-x">
        <SectionHead eyebrow="How it works" title="Book your car in four easy steps" blurb="Most bookings are confirmed in a few minutes on WhatsApp." />
        <ol className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((s, i) => {
            const Icon = stepIcons[s.icon];
            return (
              <li key={s.title} className="relative rounded-2xl border border-edge bg-white p-6">
                <span className="font-heading absolute top-5 right-5 text-[40px] leading-none font-bold text-ink/[0.07]">0{i + 1}</span>
                <span className="grid size-12 place-items-center rounded-xl bg-charcoal text-gold"><Icon className="size-5" aria-hidden /></span>
                <h3 className="mt-5 text-[17px] font-bold">{s.title}</h3>
                <p className="mt-2 text-[14px] leading-relaxed text-muted">{s.body}</p>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}

/* ---------- FAQ (dark band; native details for a no-JS accordion) ---------- */
export function FAQ({ items }: { items: { q: string; a: string }[] }) {
  return (
    <section id="faq" className="scroll-mt-24 bg-charcoal py-16 md:py-24">
      <div className="container-x grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
        <div>
          <SectionHead dark align="left" eyebrow="FAQ" title="Questions people ask before renting" blurb="Can't find your answer? Message us on WhatsApp and a real person will reply." />
          <Button href={waLink()} target="_blank" variant="light" className="mt-8"><WhatsAppIcon className="size-4 text-[#25d366]" /> Ask on WhatsApp</Button>
        </div>
        <div className="space-y-3">
          {items.map((f, i) => (
            <details key={f.q} open={i === 0} className="group rounded-xl border border-white/10 bg-graphite px-5 open:pb-5">
              <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 text-[15.5px] font-semibold text-white [&::-webkit-details-marker]:hidden">
                {f.q}
                <span className="grid size-7 shrink-0 place-items-center rounded-full bg-gold/15 text-gold transition group-open:rotate-45">+</span>
              </summary>
              <p className="text-[14.5px] leading-relaxed text-white/70">{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- Closing CTA (dark box on white) ---------- */
export function ClosingCTA() {
  return (
    <section className="bg-mist py-16 md:py-24">
      <div className="container-x">
        <div className="relative isolate grid items-center gap-8 overflow-hidden rounded-[28px] bg-[linear-gradient(135deg,#27272a_0%,#0e0e10_70%)] px-6 py-12 md:grid-cols-[1.2fr_0.8fr] md:px-12">
          {/* Soft gold glow behind the car */}
          <div aria-hidden className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_45%_60%_at_80%_55%,rgb(201_160_106/0.22),transparent_70%)]" />
          <div>
            <h2 className="text-[28px] leading-tight font-bold text-white md:text-[38px]">Ready for your next journey?</h2>
            <p className="mt-3 max-w-xl text-[16px] text-white/65">Tell us the city, dates and car, and we will send a fixed price in minutes.</p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Button href="/contact/" variant="gold">Book your car</Button>
              <Button href={waLink()} target="_blank" variant="ghost-dark"><WhatsAppIcon className="size-4 text-[#25d366]" /> Chat on WhatsApp</Button>
            </div>
          </div>
          <Image src="/images/cutouts/mercedes-s500-black.webp" alt="Mercedes S500 from the SLC fleet" width={1341} height={633} sizes="(min-width:768px) 35vw, 90vw" className="h-auto w-full [filter:drop-shadow(0_25px_30px_rgb(0_0_0/0.6))_drop-shadow(0_10px_40px_rgb(201_160_106/0.35))]" />
        </div>
      </div>
    </section>
  );
}

/* ---------- Footer ---------- */
export function Footer() {
  return (
    <footer className="border-t border-gold/30 bg-ink pt-16 pb-8 text-white">
      <div className="container-x grid gap-10 md:grid-cols-[1.4fr_repeat(4,1fr)]">
        <div>
          <Logo size={64} dark />
          <p className="mt-5 max-w-xs text-[14px] leading-relaxed text-white/60">{brand.tagline}</p>
          <p className="mt-2 text-[14px] font-semibold text-white">{brand.slogan}</p>
          <p className="mt-5 flex items-center gap-2 text-[14px]"><Phone className="size-4 text-gold" /><a href={brand.phoneHref} className="hover:underline">{brand.phoneDisplay}</a></p>
          <p className="mt-1 text-[14px]"><a href={`mailto:${brand.email}`} className="hover:underline">{brand.email}</a></p>
          <p className="mt-1 text-[14px] text-white/60">{brand.address.street}, {brand.address.locality}</p>
        </div>
        {footerCols.map((col) => (
          <div key={col.title}>
            <p className="font-heading text-[15px] font-bold text-gold-light">{col.title}</p>
            <ul className="mt-4 space-y-2.5">
              {col.links.map((l) => (
                <li key={l.href}><Link href={l.href} className="text-[14px] text-white/60 hover:text-white">{l.label}</Link></li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="container-x mt-12 flex flex-wrap justify-between gap-3 border-t border-ink-3 pt-6 text-[13px] text-white/45">
        <p>© {brand.year} {brand.fullName}. All rights reserved.</p>
        <p>Car makes and logos are trademarks of their owners.</p>
      </div>
    </footer>
  );
}

/* ---------- Floating WhatsApp ---------- */
export function WhatsAppFab() {
  return (
    <Link
      href={waLink()}
      target="_blank"
      aria-label="Chat on WhatsApp"
      className="fixed right-5 bottom-5 z-40 grid size-14 place-items-center rounded-full bg-[#25d366] text-white shadow-lg transition hover:scale-105"
    >
      <WhatsAppIcon className="size-7" />
    </Link>
  );
}
