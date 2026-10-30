"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { ChevronDown, Menu, Phone, X } from "lucide-react";
import { brand, nav, waLink } from "@/data/site";
import { BrandLogo, WhatsAppIcon } from "./ui";

/** Long link lists get two columns in the mega menu. */
const span = (n: number) => (n > 7 ? 2 : 1);

export function Logo({ className = "", size = 52, dark = false }: { className?: string; size?: number; dark?: boolean }) {
  return (
    <Link href="/" className={`flex items-center gap-3 ${className}`} aria-label={`${brand.fullName} home`}>
      <Image src={brand.logo} alt={`${brand.fullName} logo`} width={size} height={size} priority className="h-auto" style={{ width: size }} />
      <span className="flex flex-col leading-none">
        <span className={`font-heading text-[21px] font-bold tracking-[0.04em] ${dark ? "text-white [text-shadow:0_1px_10px_rgb(0_0_0/0.7)]" : "text-ink"}`}>SLC</span>
        <span className={`mt-1.5 border-t pt-1 font-sans text-[10px] tracking-[0.42em] uppercase ${dark ? "border-white/45 font-semibold text-white/90 [text-shadow:0_1px_8px_rgb(0_0_0/0.8)]" : "border-ink/15 font-medium text-muted"}`}>Car Rental</span>
      </span>
    </Link>
  );
}

export default function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [openSub, setOpenSub] = useState<string | null>(null);
  const pathname = usePathname() || "/";
  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href.split(/[?#]/)[0]));

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Home page: transparent header over the hero until the page scrolls.
  const overlay = pathname === "/" && !scrolled && !open;
  // Black header once the page has scrolled (or the mobile menu is open).
  // White text on the transparent home header too.
  const dark = (scrolled && !open) || overlay;

  // Close the mobile menu after navigating.
  useEffect(() => setOpen(false), [pathname]);

  return (
    <header className={`fixed inset-x-0 top-0 z-50 border-b transition-colors ${overlay ? "border-transparent bg-origin-border bg-[linear-gradient(180deg,rgb(0_0_0/0.7),rgb(0_0_0/0.35)_70%,transparent)] [text-shadow:0_1px_8px_rgb(0_0_0/0.6)]" : dark ? "border-white/10 bg-[#0e0e10]/95 shadow-[0_8px_30px_-12px_rgb(0_0_0/0.6)] backdrop-blur" : "border-edge bg-white"}`}>
      <div className="container-x flex h-[76px] items-center justify-between gap-6">
        <Logo dark={dark} />

        <nav className="hidden items-stretch xl:flex" aria-label="Main">
          {nav.map((item) => (
            <div key={item.label} className="group relative flex items-center">
              <Link
                href={item.href}
                className={`flex h-[76px] items-center gap-1 px-3.5 text-[14px] font-medium transition-colors ${overlay ? "text-white hover:text-white/80" : dark ? "text-white/75 hover:text-white" : "text-ink/75 hover:text-ink"} ${isActive(item.href) ? (dark ? "border-b-2 border-gold text-white" : "border-b-2 border-gold-deep text-ink") : "border-b-2 border-transparent"}`}
              >
                {item.label}
                {item.groups && <ChevronDown className="size-3.5 transition group-hover:rotate-180" />}
              </Link>
              {item.groups && (
                <div
                  className={`invisible absolute top-full left-1/2 -translate-x-1/2 translate-y-1 rounded-2xl border border-edge bg-white p-5 opacity-0 shadow-[0_24px_60px_-20px_rgb(0_0_0/0.3)] transition group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100`}
                  style={{ width: `${item.groups.reduce((n, g) => n + span(g.links.length), 0) * 12 + 2.5}rem` }}
                >
                  <div className="grid gap-6" style={{ gridTemplateColumns: item.groups.map((g) => `${span(g.links.length)}fr`).join(" ") }}>
                    {item.groups.map((g) => (
                      <div key={g.title}>
                        <p className="mb-2 px-2 text-[11px] font-semibold tracking-[0.16em] text-muted uppercase">{g.title}</p>
                        <ul className={g.links.length > 7 ? "grid grid-cols-2 gap-x-2" : ""}>
                          {g.links.map((l) => (
                            <li key={l.href}>
                              <Link href={l.href} className="flex items-center gap-2.5 rounded-lg px-2 py-2 text-[13.5px] text-ink/80 hover:bg-mist hover:text-ink">
                                {l.logo && <BrandLogo logo={l.logo} name={l.label.split(" ")[0]} className="size-4 text-ink/70" />}
                                {l.label}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </nav>

        <div className="hidden items-center gap-3 xl:flex">
          <a href={brand.phoneHref} className={`${overlay ? "hidden" : "flex"} h-11 items-center gap-2 rounded-xl border px-4 text-[13px] font-semibold transition-colors ${dark ? "border-white/25 text-white hover:border-white" : "border-edge text-ink hover:border-ink"}`}>
            <Phone className="size-4" /> {brand.phoneDisplay}
          </a>
          <Link href="/contact/" className={`flex h-11 items-center rounded-xl px-5 text-[13px] font-semibold transition-colors ${overlay || dark ? "bg-gold-sheen text-ink shadow-glow-sm [text-shadow:none] hover:shadow-glow hover:brightness-110" : "bg-ink text-white hover:bg-neutral-800"}`}>
            Book your car
          </Link>
        </div>

        <button
          className={`grid size-11 place-items-center rounded-lg xl:hidden ${dark ? "text-white" : "text-ink"}`}
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label={open ? "Close menu" : "Open menu"}
        >
          {open ? <X /> : <Menu />}
        </button>
      </div>

      {open && (
        <div className="max-h-[calc(100dvh-76px)] overflow-y-auto border-t border-edge bg-white xl:hidden">
          <div className="container-x py-3">
            {nav.map((item) => (
              <div key={item.label} className="border-b border-edge last:border-0">
                {item.groups ? (
                  <>
                    <button
                      className="flex min-h-12 w-full items-center justify-between text-left text-[15px] text-ink"
                      onClick={() => setOpenSub(openSub === item.label ? null : item.label)}
                      aria-expanded={openSub === item.label}
                    >
                      {item.label}
                      <ChevronDown className={`size-4 transition ${openSub === item.label ? "rotate-180" : ""}`} />
                    </button>
                    {openSub === item.label && (
                      <div className="space-y-4 pb-4 pl-2">
                        {item.groups.map((g) => (
                          <div key={g.title}>
                            <p className="mb-1 text-[11px] font-semibold tracking-[0.16em] text-muted uppercase">{g.title}</p>
                            <div className="grid grid-cols-2 gap-x-3">
                              {g.links.map((l) => (
                                <Link key={l.href} href={l.href} onClick={() => setOpen(false)} className="flex min-h-10 items-center text-[14px] text-ink/75">
                                  {l.label}
                                </Link>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <Link href={item.href} onClick={() => setOpen(false)} className="flex min-h-12 items-center text-[15px] text-ink">
                    {item.label}
                  </Link>
                )}
              </div>
            ))}
            <div className="grid grid-cols-2 gap-3 pt-4 pb-2">
              <Link href={waLink()} target="_blank" className="flex h-11 items-center justify-center gap-2 rounded-xl border border-edge text-[13px] font-semibold text-ink"><WhatsAppIcon className="size-4 text-[#25d366]" /> WhatsApp</Link>
              <Link href="/contact/" onClick={() => setOpen(false)} className="flex h-11 items-center justify-center rounded-xl bg-ink text-[13px] font-semibold text-white">Book your car</Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
