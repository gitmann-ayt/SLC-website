import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { locationGroups, locationImage, locations } from "@/data/locations";
import { pageMeta } from "@/lib/seo";
import { CtaBand, PageHero } from "@/components/Page";

export const metadata = pageMeta({
  title: "Rent a Car Locations: 10 Cities Across Pakistan",
  description: "Rent a car in Islamabad, Rawalpindi, Lahore, Karachi, Peshawar, Faisalabad, Multan, Sialkot, Gujranwala and Abbottabad, self drive or with driver. Choose your city for local details.",
  path: "/rent-a-car/",
});

export default function LocationsHub() {
  const cityList = locations.filter((l) => l.kind === "city");
  return (
    <main>
      <PageHero
        eyebrow="Locations"
        title="Rent a car in 10 cities across Pakistan"
        blurb="Pick your area to see local pickup details, popular trips, drive times and the cars people there book most."
        crumbs={[{ name: "Locations", path: "/rent-a-car/" }]}
      />

      <section className="bg-white py-14 md:py-20">
        <div className="container-x">
          <h2 className="text-[24px] font-semibold md:text-[30px]">Cities</h2>
          <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
            {cityList.map((l, i) => (
              <Link key={l.slug} href={`/rent-a-car/${l.slug}/`} className={`group relative isolate overflow-hidden rounded-[22px] border border-white/10 ${i === 0 ? "col-span-2 row-span-2 min-h-[22rem]" : "min-h-[11rem] md:min-h-[13rem]"}`}>
                <Image src={locationImage(l.slug)} alt={`Rent a car in ${l.name}`} fill sizes={i === 0 ? "(min-width:1024px) 40vw, 100vw" : "(min-width:1024px) 20vw, 50vw"} className="-z-10 object-cover grayscale transition duration-700 group-hover:scale-110 group-hover:grayscale-0" />
                <span className="absolute inset-0 -z-10 bg-gradient-to-t from-ink via-ink/40 to-transparent" />
                <span className="absolute top-3 right-3 grid size-9 place-items-center rounded-full bg-white/10 text-white transition group-hover:rotate-45 group-hover:bg-white group-hover:text-ink">
                  <ArrowUpRight className="size-4" />
                </span>
                <span className="absolute inset-x-4 bottom-4">
                  <span className="block text-[10.5px] font-semibold tracking-[0.18em] text-white/70 uppercase">Rent a car in</span>
                  <span className={`font-heading block font-semibold text-white ${i === 0 ? "text-[30px]" : "text-[18px]"}`}>{l.name}</span>
                  {i === 0 && <span className="mt-2 line-clamp-2 block max-w-md text-[13.5px] text-white/70">{l.metaDescription}</span>}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {locationGroups.filter((g) => g.kind !== "city").map((g, gi) => (
        <section key={g.kind} className={`py-12 md:py-14 ${gi % 2 ? "bg-white" : "bg-mist"}`}>
          <div className="container-x">
            <h2 className="text-[22px] font-semibold md:text-[26px]">{g.title}</h2>
            <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {locations.filter((l) => l.kind === g.kind).map((l) => (
                <Link key={l.slug} href={`/rent-a-car/${l.slug}/`} className="group flex items-center justify-between gap-3 rounded-2xl border border-edge bg-white px-5 py-4 transition hover:border-ink">
                  <span>
                    <span className="block text-[11px] font-semibold tracking-[0.14em] text-muted uppercase">Rent a car in</span>
                    <span className="font-heading text-[15px] font-medium text-ink">{l.place}</span>
                  </span>
                  <ArrowUpRight className="size-5 shrink-0 text-accent transition group-hover:rotate-45" aria-hidden />
                </Link>
              ))}
            </div>
          </div>
        </section>
      ))}
      <CtaBand title="Your area not listed?" body="We travel anywhere in Pakistan. Just send us your pickup point." />
    </main>
  );
}
