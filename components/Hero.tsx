import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { brand, waLink } from "@/data/site";
import BookingForm from "./BookingForm";
import { CategoryStrip } from "./Sections";
import { Button, WhatsAppIcon } from "./ui";

/** Dark hero: full-width black & white photo with the headline on the left. */
export default function Hero() {
  return (
    <>
      <section className="relative isolate mt-[76px] overflow-hidden bg-ink">
        <Image
          src="/images/hero/hero-sedan.webp"
          alt="Black sedan, the kind of everyday car SLC rents across Pakistan"
          fill
          priority
          sizes="100vw"
          className="-z-20 object-cover object-[70%_50%]"
        />
        <div aria-hidden className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgb(10_10_10/0.92)_0%,rgb(10_10_10/0.7)_38%,rgb(10_10_10/0.1)_70%,transparent_100%)] max-md:bg-[linear-gradient(180deg,rgb(10_10_10/0.85)_0%,rgb(10_10_10/0.55)_60%,rgb(10_10_10/0.85)_100%)]" />

        <div className="container-x flex min-h-[560px] flex-col justify-center pt-16 pb-28 md:min-h-[640px] md:pb-32">
          <p className="inline-flex items-center gap-3 text-[11.5px] font-semibold tracking-[0.3em] text-white/70 uppercase">
            <span className="h-px w-8 bg-white/50" /> {brand.slogan}
          </p>
          <h1 className="mt-5 max-w-2xl text-[34px] leading-[1.08] font-bold text-white md:text-[56px]">
            The easiest way to rent a car in Pakistan
          </h1>
          <p className="mt-5 max-w-lg text-[16px] leading-relaxed text-white/75 md:text-[18px]">
            Everyday hatchbacks, sedans, SUVs and luxury cars. Self drive or with a professional driver, in 10 cities.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button href="/cars/" variant="light">Explore the fleet <ArrowRight className="size-4" /></Button>
            <Button href={waLink()} target="_blank" variant="ghost-dark"><WhatsAppIcon className="size-4 text-[#25d366]" /> Book on WhatsApp</Button>
          </div>
        </div>
      </section>

      {/* Quote bar overlapping the hero, then car types */}
      <section className="relative z-10 bg-white pb-14 md:pb-20">
        <div className="container-x">
          <BookingForm id="quote" layout="bar" className="-mt-14 md:-mt-16" />
          <div className="mt-8"><CategoryStrip /></div>
        </div>
      </section>
    </>
  );
}
