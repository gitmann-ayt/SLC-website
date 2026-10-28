import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

type Variant = "primary" | "light" | "ghost-dark" | "ghost-light";

/** primary/ghost-light for white sections, light/ghost-dark for dark sections */
const variants: Record<Variant, string> = {
  primary: "bg-ink text-white hover:bg-neutral-800",
  light: "bg-white text-ink hover:bg-neutral-200",
  "ghost-dark": "border border-white/35 text-white hover:border-white hover:bg-white/5",
  "ghost-light": "border border-edge bg-white text-ink hover:border-ink",
};

export function Button({
  variant = "primary",
  className = "",
  children,
  ...props
}: { variant?: Variant; className?: string; children: ReactNode } & ComponentProps<typeof Link>) {
  return (
    <Link
      {...props}
      className={`inline-flex min-h-12 items-center justify-center gap-2 rounded-xl px-6 text-[14px] font-semibold transition ${variants[variant]} ${className}`}
    >
      {children}
    </Link>
  );
}

export function SectionHead({
  eyebrow,
  title,
  blurb,
  dark = false,
  align = "center",
}: {
  eyebrow?: string;
  title: string;
  blurb?: string;
  dark?: boolean;
  align?: "center" | "left";
}) {
  return (
    <div className={align === "center" ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
      {eyebrow && <p className={`eyebrow mb-4 inline-flex items-center gap-2 ${dark ? "text-white/60" : "text-muted"}`}><span className="h-px w-6 bg-current" />{eyebrow}</p>}
      <h2 className={`text-[26px] leading-[1.15] font-semibold md:text-[36px] ${dark ? "text-white" : "text-fg"}`}>
        {title}
      </h2>
      {blurb && <p className={`mt-3 text-[16px] leading-relaxed ${dark ? "text-white/70" : "text-muted"}`}>{blurb}</p>}
    </div>
  );
}

export function WhatsAppIcon({ className = "size-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={className}>
      <path d="M17.47 14.38c-.3-.15-1.75-.86-2.02-.96-.27-.1-.47-.15-.67.15-.2.3-.77.96-.94 1.16-.17.2-.35.22-.64.07-.3-.15-1.25-.46-2.38-1.47-.88-.79-1.47-1.76-1.65-2.06-.17-.3-.02-.46.13-.6.13-.14.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.03-.52-.07-.15-.67-1.6-.92-2.2-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.21 3.08c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.7.63.71.22 1.36.19 1.87.12.57-.09 1.75-.72 2-1.41.25-.7.25-1.29.17-1.41-.07-.13-.27-.2-.57-.35zM12.05 21.8h-.01a9.8 9.8 0 0 1-5-1.37l-.36-.21-3.72.98 1-3.63-.24-.37a9.8 9.8 0 1 1 8.33 4.6zm8.35-18.15A11.75 11.75 0 0 0 12.04 0C5.5 0 .2 5.3.2 11.84c0 2.09.55 4.13 1.59 5.93L.1 24l6.39-1.68a11.8 11.8 0 0 0 5.55 1.41h.01c6.53 0 11.84-5.3 11.84-11.84 0-3.16-1.23-6.13-3.47-8.37z" />
    </svg>
  );
}

/**
 * Car-maker logo. Logos are single-colour SVGs used as a CSS mask, so they take
 * the text colour (navy on light, white on dark).
 */
export function BrandLogo({ logo, name, className = "size-6" }: { logo: string; name: string; className?: string }) {
  const url = `url(/images/brands/${logo}.svg)`;
  return (
    <span
      role="img"
      aria-label={`${name} logo`}
      className={`inline-block shrink-0 bg-current ${className}`}
      style={{ maskImage: url, WebkitMaskImage: url, maskSize: "contain", WebkitMaskSize: "contain", maskRepeat: "no-repeat", WebkitMaskRepeat: "no-repeat", maskPosition: "center", WebkitMaskPosition: "center" }}
    />
  );
}
