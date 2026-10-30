import Image from "next/image";
import Link from "next/link";
import { waLink } from "@/data/site";
import BookingForm from "./BookingForm";

/**
 * Full-screen photo hero: car on a road at dusk, the transparent header on
 * top, a large left-aligned headline, two buttons, the quote bar and a
 * scroll hint.
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
          className="-z-20 object-cover object-[68%_50%] md:object-[50%_75%]"
        />
        {/* Dim the whole photo so the text and quote bar stand out */}
        <div aria-hidden className="absolute inset-0 -z-10 bg-black/40" />
        {/* Darken the left for the text, the top for the header and the bottom edge */}
        <div aria-hidden className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgb(8_9_11/0.8)_0%,rgb(8_9_11/0.5)_40%,transparent_70%)]" />
        <div aria-hidden className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgb(8_9_11/0.55)_0%,transparent_22%,transparent_70%,rgb(8_9_11/0.6)_100%)]" />
        {/* Phones: the text sits over the photo, so darken more */}
        <div aria-hidden className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgb(8_9_11/0.7)_0%,rgb(8_9_11/0.35)_55%,transparent_80%)] md:hidden" />

        {/* Text */}
        <div className="container-x flex flex-1 pt-[130px] pb-10 md:items-center md:pt-[110px] md:pb-12">
          <div className="max-w-[800px]">
            <h1 className="text-[40px] leading-[1.1] font-semibold tracking-[-0.02em] text-white font-sans! [text-shadow:0_2px_20px_rgb(0_0_0/0.35)] sm:text-[54px] lg:text-[60px] xl:text-[68px]">
              Rent the right car,
              <br />
              <span className="text-gradient-accent drop-shadow-glow [text-shadow:none]">anywhere in Pakistan</span>
            </h1>
            <p className="mt-6 text-[16px] leading-[1.7] font-medium text-white/90 md:text-[19px]">
              Hatchbacks, sedans, SUVs and luxury cars across Pakistan.
              <br className="hidden sm:block" /> Self drive or with a professional driver.
            </p>
            <div className="mt-10 flex flex-col gap-4 sm:flex-row md:mt-12 md:gap-5">
              <Link href="/cars/" className="inline-flex h-[54px] items-center justify-center rounded-[6px] bg-gold-sheen px-8 text-[15px] font-bold text-ink shadow-glow transition hover:-translate-y-0.5 hover:shadow-glow-lg hover:brightness-110 sm:w-[220px] md:h-[58px]">
                Choose a car
              </Link>
              <Link href={waLink()} target="_blank" className="inline-flex h-[54px] items-center justify-center rounded-[6px] border-2 border-white/85 bg-black/40 px-8 text-[15px] font-bold text-white backdrop-blur-md transition hover:border-white hover:bg-black/55 sm:w-[220px] md:h-[58px]">
                Book on WhatsApp
              </Link>
            </div>
          </div>
        </div>

        {/* Quote bar */}
        <div className="container-x pb-12 md:pb-[84px]">
          <BookingForm id="quote" layout="bar" />
        </div>

        {/* Scroll hint */}
        <a href="#fleet" aria-label="Scroll to our fleet" className="absolute bottom-6 left-1/2 hidden h-[30px] w-[18px] -translate-x-1/2 justify-center rounded-full border border-white/70 pt-1.5 transition hover:border-white md:flex">
          <span className="animate-scroll-dot h-1.5 w-0.5 rounded-full bg-gold" />
        </a>
      </section>
    </>
  );
}
