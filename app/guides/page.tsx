import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { guides } from "@/data/guides";
import { pageMeta } from "@/lib/seo";
import { CtaBand, PageHero } from "@/components/Page";

export const metadata = pageMeta({
  title: "Car Rental & Travel Guides for Pakistan",
  description: "Practical guides for renting a car and road trips in Pakistan: travel times, routes, documents, which car to choose and what to expect, from SLC Car Rental Services.",
  path: "/guides/",
});

export default function GuidesHub() {
  return (
    <main>
      <PageHero
        eyebrow="Guides"
        title="Car rental and travel guides"
        blurb="Straight answers on documents, routes, travel times and choosing the right car, from the team that drives these roads every day."
        crumbs={[{ name: "Guides", path: "/guides/" }]}
      />
      <section className="bg-surface py-14 md:py-20">
        <div className="container-x grid gap-5 md:grid-cols-2">
          {guides.map((g) => (
            <Link key={g.slug} href={`/guides/${g.slug}/`} className="group relative isolate flex min-h-[15rem] flex-col overflow-hidden rounded-[22px] border border-ink bg-ink p-7 transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_50px_-24px_rgb(0_0_0/0.6)]">
              <Image src={g.image} alt="" fill sizes="(min-width:768px) 50vw, 100vw" className="-z-20 object-cover opacity-40 transition duration-700 group-hover:scale-105 group-hover:opacity-55" />
              <span className="absolute inset-0 -z-10 bg-gradient-to-r from-ink via-ink/80 to-transparent" />
              <h2 className="text-[22px] leading-tight font-semibold text-white">{g.h1}</h2>
              <p className="mt-3 line-clamp-3 text-[14px] leading-relaxed text-white/60">{g.answer}</p>
              <span className="mt-auto inline-flex items-center gap-2 pt-5 text-[13px] font-semibold text-white">
                Read guide <span className="grid size-8 place-items-center rounded-full bg-white text-ink transition group-hover:rotate-45"><ArrowUpRight className="size-4" /></span>
              </span>
            </Link>
          ))}
        </div>
      </section>
      <CtaBand title="Have a trip in mind?" body="Tell us where you are going and we will suggest the right car and a fixed price." />
    </main>
  );
}
