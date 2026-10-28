import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Fuel, Gauge, Users } from "lucide-react";
import { carName, categoryOf, type Car } from "@/data/cars";
import { pkr, waLink } from "@/data/site";
import { BrandLogo, WhatsAppIcon } from "./ui";

/** Car card: real photo on a white panel, then the essentials and one clear action. */
export function CarCard({ car }: { car: Car }) {
  const name = carName(car);
  const href = `/cars/${car.slug}/`;
  const specs = [
    { icon: Users, text: `${car.seats} seats` },
    { icon: Gauge, text: car.transmission },
    { icon: Fuel, text: car.fuel },
  ];
  return (
    <article className="group relative flex flex-col overflow-hidden rounded-2xl border border-edge bg-white transition duration-300 hover:-translate-y-1 hover:border-ink/30 hover:shadow-[0_24px_50px_-28px_rgb(0_0_0/0.45)]">
      <Link href={href} className="relative block aspect-[16/10] overflow-hidden bg-[linear-gradient(180deg,#f7f7f6_0%,#ececea_100%)]" aria-label={`${name} details`}>
        <Image
          src={car.images[0]}
          alt={`${name} ${car.year}`}
          fill
          sizes="(min-width:1280px) 24vw, (min-width:1024px) 32vw, (min-width:640px) 48vw, 92vw"
          className="object-contain px-3 transition duration-500 ease-out group-hover:scale-105"
        />
        <span className="absolute top-3 left-3 rounded-md bg-ink px-2 py-1 text-[10.5px] font-semibold tracking-wider text-white uppercase">{categoryOf(car).short}</span>
        {car.badge && <span className="absolute top-3 right-3 rounded-md border border-black/10 bg-white px-2 py-1 text-[10.5px] font-semibold tracking-wider text-ink uppercase">{car.badge}</span>}
      </Link>

      <div className="flex flex-1 flex-col p-5">
        <p className="flex items-center gap-1.5 text-[12px] font-medium text-muted">
          <BrandLogo logo={car.logo} name={car.make} className="size-3.5 text-ink/70" /> {car.make} · {car.year}
        </p>
        <h3 className="mt-1 text-[18px] leading-snug font-semibold text-ink">
          <Link href={href} className="hover:underline hover:underline-offset-4">{car.model}</Link>
        </h3>
        <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-[12.5px] text-muted">
          {specs.map((s) => (
            <li key={s.text} className="flex items-center gap-1.5"><s.icon className="size-3.5" aria-hidden /> {s.text}</li>
          ))}
        </ul>

        <div className="mt-auto pt-4">
        <div className="flex items-end justify-between gap-3 border-t border-edge pt-4">
          <div className="min-w-0">
            <p className="text-[11px] tracking-wide text-muted uppercase">{car.priceSelfDrive !== null ? "Self drive · Driver" : "With driver"}</p>
            <p className="whitespace-nowrap text-[12.5px] text-muted">
              <span className="font-heading text-[18px] font-semibold text-ink">{pkr(car.priceSelfDrive ?? car.priceDay)}</span> /day
            </p>
          </div>
          <div className="flex shrink-0 gap-2">
            <Link href={waLink(`Hi SLC, is the ${name} available?`)} target="_blank" aria-label={`Ask about the ${name} on WhatsApp`} className="grid size-10 place-items-center rounded-full border border-edge text-[#25d366] transition hover:border-[#25d366]">
              <WhatsAppIcon className="size-[18px]" />
            </Link>
            <Link href={href} className="flex h-10 items-center gap-1.5 rounded-full bg-ink px-4 text-[13px] font-semibold text-white transition hover:bg-neutral-800">
              Book <ArrowRight className="size-4 transition group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>
        </div>
      </div>
    </article>
  );
}

export function CarGrid({ cars }: { cars: Car[] }) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {cars.map((c) => <CarCard key={c.slug} car={c} />)}
    </div>
  );
}
