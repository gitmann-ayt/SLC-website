import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { ChevronRight, Phone } from "lucide-react";
import { brand, waLink } from "@/data/site";
import { breadcrumbSchema } from "@/lib/seo";
import JsonLd from "./JsonLd";
import { Button, WhatsAppIcon } from "./ui";

export type Crumb = { name: string; path: string };

/** Visible breadcrumb trail plus matching BreadcrumbList schema. */
export function Breadcrumbs({ items }: { items: Crumb[] }) {
  const all = [{ name: "Home", path: "/" }, ...items];
  return (
    <>
      <JsonLd data={breadcrumbSchema(all)} />
      <nav aria-label="Breadcrumb" className="text-[12.5px] text-white/60">
        <ol className="flex flex-wrap items-center gap-1">
          {all.map((c, i) => (
            <li key={c.path} className="flex items-center gap-1">
              {i > 0 && <ChevronRight className="size-3.5" />}
              {i === all.length - 1 ? (
                <span aria-current="page" className="text-white/90">{c.name}</span>
              ) : (
                <Link href={c.path} className="hover:text-white">{c.name}</Link>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
}

/** Dark page header used by every inner page. Holds the page's only H1. */
export function PageHero({
  eyebrow,
  title,
  blurb,
  crumbs,
  image = "/images/cities/islamabad.webp",
  children,
}: {
  image?: string;
  eyebrow?: string;
  title: ReactNode;
  blurb?: string;
  crumbs: Crumb[];
  children?: ReactNode;
}) {
  return (
    <section className="relative isolate mt-[76px] overflow-hidden bg-ink">
      <Image src={image} alt="" fill priority sizes="100vw" className="-z-20 object-cover opacity-40 grayscale" />
      <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-r from-ink via-ink/85 to-ink/40" />
      <div className="container-x py-14 md:py-20">
        <Breadcrumbs items={crumbs} />
        {eyebrow && (
          <p className="mt-6 inline-flex items-center gap-2 rounded-full border border-white/15 px-3 py-1 text-[11px] font-semibold tracking-[0.18em] text-white/75 uppercase">
            <span className="size-1.5 rounded-full bg-white" /> {eyebrow}
          </p>
        )}
        <h1 className="mt-4 max-w-3xl text-[34px] leading-[1.1] font-bold text-white md:text-[50px]">{title}</h1>
        {blurb && <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-white/75 md:text-[16px]">{blurb}</p>}
        {children ?? (
          <div className="mt-7 flex flex-wrap gap-3">
            <Button href={waLink()} target="_blank" variant="light"><WhatsAppIcon className="size-4 text-[#25d366]" /> Book on WhatsApp</Button>
            <a href={brand.phoneHref} className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-white/70 px-6 text-[13px] font-semibold text-white hover:bg-white/10">
              <Phone className="size-4" /> Call {brand.phoneDisplay}
            </a>
          </div>
        )}
      </div>
    </section>
  );
}

/** Light FAQ list (native details, works without JS). */
export function FaqList({ items, title = "Frequently asked questions" }: { items: { q: string; a: string }[]; title?: string }) {
  return (
    <div>
      <h2 className="text-[24px] font-bold md:text-[30px]">{title}</h2>
      <div className="mt-6 space-y-3">
        {items.map((f, i) => (
          <details key={f.q} open={i === 0} className="group rounded-xl border border-edge bg-white px-5 open:pb-5">
            <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 text-[15px] font-semibold [&::-webkit-details-marker]:hidden">
              <h3>{f.q}</h3>
              <span className="grid size-7 shrink-0 place-items-center rounded-full bg-ink text-white transition group-open:rotate-45">+</span>
            </summary>
            <p className="text-[14px] leading-relaxed text-muted">{f.a}</p>
          </details>
        ))}
      </div>
    </div>
  );
}

/** Google map without an API key, loaded lazily so it does not slow the page. */
export function MapEmbed({ query, title }: { query: string; title: string }) {
  return (
    <div className="overflow-hidden rounded-[var(--radius-card)] border border-edge bg-card">
      <iframe
        title={title}
        src={`https://www.google.com/maps?q=${encodeURIComponent(query)}&output=embed`}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        className="block h-72 w-full md:h-80"
      />
    </div>
  );
}

/** Closing call-to-action band. */
export function CtaBand({ title, body }: { title: string; body: string }) {
  return (
    <section className="bg-white py-14">
      <div className="container-x">
        <div className="flex flex-col items-start justify-between gap-6 rounded-3xl bg-ink px-6 py-10 md:flex-row md:items-center md:px-12">
          <div>
            <h2 className="text-[24px] font-semibold text-white md:text-[30px]">{title}</h2>
            <p className="mt-2 max-w-xl text-[15px] text-white/70">{body}</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button href={waLink()} target="_blank" variant="light"><WhatsAppIcon className="size-4 text-[#25d366]" /> WhatsApp</Button>
            <Button href="/contact/" variant="ghost-dark" >Booking form</Button>
          </div>
        </div>
      </div>
    </section>
  );
}

export function Checklist({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2.5">
      {items.map((t) => (
        <li key={t} className="flex gap-2.5 text-[14.5px] text-muted">
          <span className="mt-1.5 size-2 shrink-0 rounded-full bg-ink" /> {t}
        </li>
      ))}
    </ul>
  );
}
