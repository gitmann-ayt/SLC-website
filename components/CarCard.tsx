import Image from "next/image";
import Link from "next/link";
import { Phone } from "lucide-react";
import { carName, type Car } from "@/data/cars";
import { brand, pkr, waLink } from "@/data/site";
import { BrandLogo, WhatsAppIcon } from "./ui";

/**
 * Car card: photo with tag and price, the essentials as chips, then three
 * actions (WhatsApp, call, inquiry form on the car page).
 */
export function CarCard({ car }: { car: Car }) {
  const name = carName(car);
  const href = `/cars/${car.slug}/`;
  const price = pkr(car.priceDay);
  const chips = [`${car.seats} Seats`, car.transmission, car.fuel, car.colors.join(" / ")];
  const btn = "flex h-11 min-w-0 items-center justify-center gap-1 rounded-xl px-1.5 text-[13px] font-bold whitespace-nowrap transition";

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-edge bg-white shadow-[0_10px_30px_-22px_rgb(0_0_0/0.35)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_50px_-28px_rgb(0_0_0/0.45)]">
      <Link href={href} aria-label={`${name} details`} className="relative block aspect-[16/11] overflow-hidden bg-[linear-gradient(180deg,#f3f3f2_0%,#e4e4e2_100%)]">
        <Image
          src={car.images[0]}
          alt={`${name} for rent`}
          fill
          sizes="(min-width:1280px) 22vw, (min-width:1024px) 30vw, (min-width:640px) 46vw, 92vw"
          className="object-contain px-4 pt-7 pb-9 transition duration-500 ease-out group-hover:scale-105"
        />
        {car.badge && (
          <span className="absolute top-3 left-3 rounded-full bg-ink px-3 py-1 text-[12px] font-bold text-white">{car.badge}</span>
        )}
        <span className="absolute bottom-3 left-3 rounded-full bg-white px-3 py-1 text-[12.5px] text-muted shadow-[0_4px_14px_-6px_rgb(0_0_0/0.35)]">
          <span className="font-bold text-ink">{price}</span> / day
        </span>
      </Link>

      <div className="flex flex-1 flex-col p-4">
        <p className="flex items-center gap-1.5 text-[11.5px] font-semibold tracking-[0.12em] text-muted uppercase">
          <BrandLogo logo={car.logo} name={car.make} className="size-3.5 text-ink/70" /> {car.make}
        </p>
        <h3 className="mt-1.5 text-[18px] leading-snug font-bold tracking-[-0.01em] text-ink font-sans!">
          <Link href={href} className="hover:underline hover:underline-offset-4">{name}</Link>
        </h3>
        <ul className="mt-3 flex flex-wrap gap-1.5">
          {chips.map((c) => (
            <li key={c} className="rounded-full bg-mist px-2.5 py-1 text-[12px] text-ink/70">{c}</li>
          ))}
        </ul>
        <p className="mt-4 text-[15px] text-muted">
          <span className="font-bold text-ink">{price}</span> / day
        </p>

        <div className="mt-auto grid grid-cols-[1.35fr_1fr_1fr] gap-1.5 pt-4">
          <Link href={waLink(`Hi SLC, is the ${name} available?`)} target="_blank" aria-label={`WhatsApp about the ${name}`} className={`${btn} bg-[#25d366] text-ink hover:bg-[#1fbf5b]`}>
            <WhatsAppIcon className="size-4 shrink-0" /> WhatsApp
          </Link>
          <a href={brand.phoneHref} aria-label={`Call about the ${name}`} className={`${btn} border border-edge bg-mist text-ink hover:border-ink`}>
            <Phone className="size-4 shrink-0" /> Call
          </a>
          <Link href={`${href}#book`} aria-label={`Send an inquiry about the ${name}`} className={`${btn} bg-ink text-white hover:bg-neutral-800`}>
            Inquiry
          </Link>
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
