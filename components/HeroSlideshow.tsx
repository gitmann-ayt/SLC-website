"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

/**
 * Hero photos, in play order. `position` is the object-position (phones, then
 * md and up). `shade` (0–1) darkens the left of that photo on md and up, on
 * top of the hero's shared overlays, so the text stays readable over it.
 */
const slides = [
  {
    src: "/images/hero/hero-mountain-road.webp",
    alt: "Cars driving a winding mountain road above a green valley, with snow-capped peaks behind",
    position: "object-[75%_50%] md:object-[50%_55%]",
    shade: 0.15,
  },
  {
    src: "/images/hero/hero-amg-gt.webp",
    alt: "Matte grey Mercedes-AMG GT R with yellow accents parked on open tarmac",
    position: "object-[40%_60%] md:object-[60%_60%]",
    shade: 0.5,
  },
  {
    src: "/images/hero/hero-mirror-road.webp",
    alt: "View along a car's side mirror down a country road towards green mountains",
    position: "object-[55%_50%] md:object-[50%_55%]",
    shade: 0.35,
  },
  {
    src: "/images/hero/hero-audi-sunset.webp",
    alt: "White Audi RS 7 and black Audi RS 6 Avant parked on a mountain overlook at sunset",
    position: "object-[30%_60%] md:object-[50%_65%]",
    shade: 0.65,
  },
  {
    src: "/images/hero/hero-road.webp",
    alt: "Black sedan with its headlights on, driving along a road past a tree line at dusk",
    position: "object-[68%_50%] md:object-[50%_75%]",
    shade: 0,
  },
];

/** How long each photo stays up, in ms. */
const INTERVAL = 6000;

/**
 * Background layer for the hero: cross-fades through the photos with a slow
 * zoom, plus dots to jump to one. Autoplay is off for reduced motion.
 */
export default function HeroSlideshow() {
  const [active, setActive] = useState(0);
  const [autoplay, setAutoplay] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setAutoplay(!mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  // Restarts on every change, so picking a dot gives that photo a full turn.
  useEffect(() => {
    if (!autoplay) return;
    const t = setTimeout(() => setActive((i) => (i + 1) % slides.length), INTERVAL);
    return () => clearTimeout(t);
  }, [active, autoplay]);

  return (
    <>
      {/* Photos */}
      <div className="absolute inset-0 -z-20">
        {slides.map((s, i) => {
          const on = i === active;
          return (
            <div key={s.src} aria-hidden={!on} className={`absolute inset-0 transition-opacity duration-[1200ms] ${on ? "opacity-100" : "opacity-0"}`}>
              <Image
                src={s.src}
                alt={s.alt}
                fill
                priority={i === 0}
                sizes="100vw"
                className={`object-cover ${s.position} ${
                  on
                    ? "scale-[1.08] [transition:transform_8s_linear]"
                    : // Reset the zoom only once the photo has faded out
                      "scale-100 [transition:transform_0s_linear_1.2s]"
                } motion-reduce:scale-100`}
              />
              {/* Extra shade behind the text for photos with a busy or bright left side (phones are already dark enough) */}
              {s.shade > 0 && (
                <div
                  className="absolute inset-0 hidden bg-[linear-gradient(90deg,rgb(8_9_11)_0%,rgb(8_9_11/0.85)_35%,rgb(8_9_11/0.35)_55%,transparent_72%)] md:block"
                  style={{ opacity: s.shade }}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Dots (left on md and up, clear of the floating WhatsApp button) */}
      <div className="container-x pointer-events-none absolute inset-x-0 bottom-4 flex justify-center md:bottom-7 md:justify-start">
        <div className="pointer-events-auto flex items-center gap-2">
          {slides.map((s, i) => (
            <button
              key={s.src}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`Show photo ${i + 1} of ${slides.length}`}
              aria-current={i === active}
              className="group flex h-6 items-center"
            >
              <span
                className={`block h-1.5 rounded-full transition-all duration-300 ${
                  i === active ? "w-8 bg-gold" : "w-2 bg-white/55 group-hover:bg-white"
                }`}
              />
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
