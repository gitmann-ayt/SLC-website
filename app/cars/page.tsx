import { categories, cars, carsIn } from "@/data/cars";
import { pageMeta } from "@/lib/seo";
import FleetFilter from "@/components/FleetFilter";
import { CtaBand, PageHero } from "@/components/Page";

export const metadata = pageMeta({
  title: "Our Fleet: Cars for Rent in Pakistan with Prices",
  description: `Browse ${cars.length} cars for rent: Suzuki Alto, Honda City, Toyota Corolla, Civic, Sportage, Fortuner, Prado, Land Cruiser, Lexus LX 570, Mercedes and Audi. Self drive or with driver, daily, weekly and monthly prices.`,
  path: "/cars/",
  image: "/images/fleet/toyota-corolla-white.webp",
});

export default function CarsPage() {
  return (
    <main>
      <PageHero
        eyebrow="Our fleet"
        title="Cars for rent, from hatchbacks to SUVs"
        blurb={`${cars.length} models across hatchbacks, sedans, SUVs, luxury cars and vans. Choose self drive or a professional driver, with every price shown upfront.`}
        crumbs={[{ name: "Our fleet", path: "/cars/" }]}
        image="/images/cities/lahore.webp"
      />
      <section className="bg-stone py-12 md:py-16">
        <div className="container-x"><FleetFilter /></div>
      </section>
      <section className="bg-mist py-14">
        <div className="container-x grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
          {categories.map((c) => (
            <div key={c.slug}>
              <h2 className="text-[17px] font-bold">{c.title}</h2>
              <p className="mt-2 text-[14px] leading-relaxed text-muted">{c.blurb}</p>
              <p className="mt-2 text-[13px] text-muted">{carsIn(c.slug).map((x) => x.model).join(", ")}</p>
            </div>
          ))}
        </div>
      </section>
      <CtaBand title="Not sure which car fits?" body="Tell us the passengers, luggage and route. We will suggest the right car and send a fixed quote." />
    </main>
  );
}
