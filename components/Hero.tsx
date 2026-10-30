import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import BookingForm from "./BookingForm";
import HeroSlideshow from "./HeroSlideshow";

/** Trust line under the intro. Each point matches a promise made elsewhere on the site. */
const perks = ["Fixed-price quotes", "Verified drivers", "No sign-up", "24/7 on WhatsApp"];

/**
 * Full-screen photo hero: a slideshow of car and road photos, the transparent header on
 * top, a large left-aligned headline, a trust line, a fleet link, the quote
 * bar (the main action) and a scroll hint.
 */
export default function Hero() {
  return (
    <>
      <section className="relative isolate flex min-h-[100svh] flex-col overflow-hidden bg-[#0b0c0e] lg:max-h-[1100px]">
        {/* Photos (slideshow) and its dots */}
        <HeroSlideshow />
        {/* Light dim only, so the bright daytime photos still read as daytime */}
        <div aria-hidden className="absolute inset-0 -z-10 bg-black/15" />
        {/* Darken the left for the text (eased so there's no visible edge), the top for the header and the bottom edge */}
        <div aria-hidden className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgb(8_9_11/0.8)_0%,rgb(8_9_11/0.65)_28%,rgb(8_9_11/0.35)_48%,rgb(8_9_11/0.1)_62%,transparent_72%)]" />
        <div aria-hidden className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgb(8_9_11/0.45)_0%,transparent_20%,transparent_70%,rgb(8_9_11/0.5)_100%)]" />
        {/* Soft dark pool right behind the text block, so no photo detail competes with it */}
        <div aria-hidden className="absolute inset-0 -z-10 hidden bg-[radial-gradient(ellipse_50%_45%_at_22%_60%,rgb(8_9_11/0.45)_0%,rgb(8_9_11/0.2)_55%,transparent_100%)] md:block" />
        {/* Phones: the text sits over the photo, so darken more */}
        <div aria-hidden className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgb(8_9_11/0.7)_0%,rgb(8_9_11/0.5)_55%,rgb(8_9_11/0.2)_80%)] md:hidden" />

        {/* Text */}
        <div className="container-x flex flex-1 pt-[120px] pb-8 md:items-end md:pt-[110px] md:pb-10">
          <div className="max-w-[800px]">
            <p className="eyebrow text-gold-light [text-shadow:0_1px_10px_rgb(0_0_0/0.6)]">Car rental across Pakistan</p>
            <h1 className="mt-4 text-[40px] leading-[1.1] font-semibold tracking-[-0.02em] text-white font-sans! [text-shadow:0_2px_24px_rgb(0_0_0/0.55)] sm:text-[54px] lg:text-[60px] xl:text-[68px]">
              {/* Phones: no forced break, so it wraps to "Drive your journey / with SLC" */}
              Drive your journey with{" "}
              <br className="hidden sm:block" />
              <span className="text-gradient-accent [text-shadow:none] [filter:drop-shadow(0_2px_10px_rgb(0_0_0/0.6))_drop-shadow(0_0_22px_rgb(245_194_17/0.3))]">SLC</span>
            </h1>
            <p className="mt-6 max-w-[560px] text-[16px] leading-[1.7] text-pretty text-white/90 [text-shadow:0_1px_12px_rgb(0_0_0/0.6)] md:text-[18px]">
              Your trusted partner for affordable car rentals, luxury vehicles, airport transfers, and corporate transportation. Choose the freedom of <span className="whitespace-nowrap">self-drive</span> or enjoy the comfort of a professional driver.
            </p>
            <ul className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-[13.5px] font-semibold text-white/90 [text-shadow:0_1px_10px_rgb(0_0_0/0.6)] md:text-[14.5px]">
              {perks.map((p) => (
                <li key={p} className="flex items-center gap-2">
                  <Check className="size-4 text-gold" strokeWidth={3} aria-hidden />
                  {p}
                </li>
              ))}
            </ul>
            <Link href="/cars/" className="group mt-8 inline-flex items-center gap-2 text-[15px] font-semibold text-white underline decoration-white/40 underline-offset-[6px] transition hover:text-gold-light hover:decoration-gold-light">
              Browse the fleet
              <ArrowRight className="size-4 transition group-hover:translate-x-1" aria-hidden />
            </Link>
          </div>
        </div>

        {/* Quote bar: the hero's one main action */}
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
