"use client";

import Script from "next/script";
import { useEffect } from "react";

/**
 * Google Analytics 4 / Google Ads, plus a conversion event on every WhatsApp
 * and phone click, so ad spend can be tied to leads.
 *
 * Set NEXT_PUBLIC_GA_ID (G-XXXX or AW-XXXX) to turn it on. Optional:
 * NEXT_PUBLIC_ADS_CONVERSION ("AW-XXXX/label") to also fire an Ads conversion.
 */
const GA_ID = process.env.NEXT_PUBLIC_GA_ID;
const ADS_CONVERSION = process.env.NEXT_PUBLIC_ADS_CONVERSION;

type Gtag = (...args: unknown[]) => void;

export default function Analytics() {
  useEffect(() => {
    function onClick(e: MouseEvent) {
      const a = (e.target as HTMLElement | null)?.closest?.("a");
      if (!a) return;
      const href = a.getAttribute("href") ?? "";
      const method = href.startsWith("https://wa.me") ? "whatsapp" : href.startsWith("tel:") ? "phone" : null;
      if (!method) return;
      const gtag = (window as unknown as { gtag?: Gtag }).gtag;
      if (!gtag) return;
      gtag("event", "generate_lead", { method, page_path: window.location.pathname, link_text: a.textContent?.trim().slice(0, 60) });
      if (ADS_CONVERSION) gtag("event", "conversion", { send_to: ADS_CONVERSION });
    }
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  if (!GA_ID) return null;
  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
      <Script id="gtag-init" strategy="afterInteractive">
        {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${GA_ID}');`}
      </Script>
    </>
  );
}
