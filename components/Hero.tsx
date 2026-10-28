import Image from "next/image";
import Link from "next/link";
import { waLink } from "@/data/site";
import BookingForm from "./BookingForm";
import { CategoryStrip } from "./Sections";

/**
 * Full-screen photo hero: car on a road at dusk, the transparent header on
 * top, a large left-aligned headline, two buttons and a scroll hint.
 */
export default function Hero() {
  return (
    <>
      <section className="relative isolate flex min-h-[100svh] flex-col overflow-hidden bg-[#0b0c0e] lg:max-h-[1100px]">
        {/* Photo */}
        <Image
          src="/images/hero/hero-road.webp"
          alt="Black sedan with its headlights on, driving along a highway at dusk"
          fill
          priority
          sizes="100vw"
          className="-z-20 object-cover object-[71%_50%] md:object-[70%_60%]"
        />
        {/* Darken the left for the text, the top for the header and the bottom edge */}
        <div aria-hidden className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgb(8_9_11/0.75)_0%,rgb(8_9_11/0.45)_35%,transparent_65%)]" />
        <div aria-hidden className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgb(8_9_11/0.55)_0%,transparent_22%,transparent_70%,rgb(8_9_11/0.6)_100%)]" />
        {/* Phones: the text sits over the photo, so darken more */}
        <div aria-hidden className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgb(8_9_11/0.7)_0%,rgb(8_9_11/0.35)_55%,transparent_80%)] md:hidden" />

        {/* Text */}
        <div className="container-x flex flex-1 pt-[130px] pb-16 md:items-center md:pt-[76px] md:pb-[14vh]">
          <div className="max-w-[620px]">
            <h1 className="text-[40px] leading-[1.15] font-normal tracking-[-0.01em] text-white font-sans! sm:text-[52px] lg:text-[56px] xl:text-[62px]">
              Rent the right car,
              <br />
              anywhere in Pakistan
            </h1>
            <p className="mt-6 text-[15px] leading-[1.75] text-white/80 md:text-[17px]">
              Hatchbacks, sedans, SUVs and luxury cars in 10 cities.
              <br className="hidden sm:block" /> Self drive or with a professional driver.
            </p>
            <div className="mt-10 flex flex-col gap-4 sm:flex-row md:mt-12 md:gap-5">
              <Link href="/cars/" className="inline-flex h-[54px] items-center justify-center rounded-[5px] bg-white px-8 text-[14px] font-medium text-ink transition hover:bg-neutral-200 sm:w-[220px] md:h-[58px]">
                Choose a car
              </Link>
              <Link href={waLink()} target="_blank" className="inline-flex h-[54px] items-center justify-center rounded-[5px] border border-white/80 bg-black/40 px-8 text-[14px] font-semibold text-white backdrop-blur-md transition hover:border-white hover:bg-black/55 sm:w-[220px] md:h-[58px]">
                Book on WhatsApp
              </Link>
            </div>
          </div>
        </div>

        {/* Scroll hint */}
        <a href="#quote" aria-label="Scroll to the quote form" className="absolute bottom-6 left-1/2 hidden h-[30px] w-[18px] -translate-x-1/2 justify-center rounded-full border border-white/70 pt-1.5 transition hover:border-white md:flex">
          <span className="animate-scroll-dot h-1.5 w-0.5 rounded-full bg-white" />
        </a>
      </section>

      {/* Quote bar and car types */}
      <section className="relative z-10 bg-white pt-10 pb-14 md:pb-20">
        <div className="container-x">
          <BookingForm id="quote" layout="bar" />
          <div className="mt-8"><CategoryStrip /></div>
        </div>
      </section>
    </>
  );
}
