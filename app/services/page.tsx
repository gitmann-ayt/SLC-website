import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { servicePages } from "@/data/services";
import { pageMeta } from "@/lib/seo";
import { CtaBand, PageHero } from "@/components/Page";

export const metadata = pageMeta({
  title: "Car Rental Services: Self Drive, With Driver & More",
  description: "Self drive and chauffeur-driven car rental, airport transfers, corporate and monthly rentals, wedding cars and northern tours across Pakistan from SLC Car Rental.",
  path: "/services/",
});

export default function ServicesHub() {
  return (
    <main>
      <PageHero
        eyebrow="Services"
        title="Car rental services across Pakistan"
        blurb="From a self-drive weekend to a year-long corporate contract, every service comes with a fixed quote and 24/7 support."
        crumbs={[{ name: "Services", path: "/services/" }]}
      />
      <section className="bg-surface py-14 md:py-20">
        <div className="container-x grid gap-5 md:grid-cols-2">
          {servicePages.map((s, i) => {
            const isCar = s.image.includes("/cutouts/");
            return (
              <Link key={s.slug} href={`/services/${s.slug}/`} className="group relative isolate grid min-h-[15rem] overflow-hidden rounded-[22px] border border-ink bg-ink p-7 transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_50px_-24px_rgb(0_0_0/0.6)] sm:grid-cols-[1fr_0.9fr]">
                {!isCar && (
                  <>
                    <Image src={s.image} alt="" fill sizes="(min-width:768px) 50vw, 100vw" className="-z-20 object-cover opacity-40 transition duration-700 group-hover:scale-105 group-hover:opacity-55" />
                    <span className="absolute inset-0 -z-10 bg-gradient-to-r from-ink via-ink/80 to-transparent" />
                  </>
                )}
                <div className="relative z-10 flex flex-col">
                  <span className="font-heading text-[13px] font-semibold text-white/50">0{i + 1}</span>
                  <h2 className="mt-2 text-[22px] leading-tight font-semibold text-white">{s.title}</h2>
                  <p className="mt-3 line-clamp-3 text-[14px] leading-relaxed text-white/60">{s.intro[0]}</p>
                  <span className="mt-auto inline-flex items-center gap-2 pt-5 text-[13px] font-semibold text-white">
                    View service <span className="grid size-8 place-items-center rounded-full bg-white text-ink transition group-hover:rotate-45"><ArrowUpRight className="size-4" /></span>
                  </span>
                </div>
                {isCar && (
                  <div className="relative -mr-10 hidden sm:block">
                    <div aria-hidden className="absolute inset-x-4 top-1/2 h-24 -translate-y-1/2 rounded-[50%] bg-white/10 blur-2xl transition group-hover:bg-white/20" />
                    <Image src={s.image} alt="" fill sizes="25vw" className="object-contain transition duration-500 group-hover:translate-x-2 group-hover:scale-105" />
                  </div>
                )}
              </Link>
            );
          })}
        </div>
      </section>
      <CtaBand title="Tell us what you need" body="Share the trip and we will recommend the right service, car and price." />
    </main>
  );
}
