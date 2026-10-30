import type { Metadata, Viewport } from "next";
import { Manrope, Unbounded } from "next/font/google";
import "./globals.css";
import { brand, isPreview, siteUrl } from "@/data/site";
import Header from "@/components/Header";
import { Footer, WhatsAppFab } from "@/components/Sections";
import JsonLd from "@/components/JsonLd";
import Analytics from "@/components/Analytics";
import { businessSchema, websiteSchema } from "@/lib/seo";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `Rent a Car in Pakistan: Self Drive & With Driver | ${brand.fullName}`,
    template: `%s | ${brand.fullName}`,
  },
  description: brand.tagline,
  applicationName: brand.fullName,
  alternates: { canonical: "/" },
  robots: isPreview
    ? { index: false, follow: false }
    : { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large" } },
  openGraph: { siteName: brand.fullName, locale: "en_PK", type: "website", url: "/", images: [{ url: "/images/cities/islamabad.webp" }] },
  twitter: { card: "summary_large_image" },
  // Paste the Search Console verification code here at launch.
  verification: { google: process.env.NEXT_PUBLIC_GSC_VERIFICATION || undefined },
};

const display = Unbounded({ subsets: ["latin"], weight: ["400", "500", "600", "700", "800"], variable: "--font-display", display: "swap" });
const body = Manrope({ subsets: ["latin"], weight: ["400", "500", "600", "700", "800"], variable: "--font-body", display: "swap" });

export const viewport: Viewport = { themeColor: "#07070a" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-PK" className={`${display.variable} ${body.variable}`}>
      <body>
        <JsonLd data={[businessSchema(), websiteSchema()]} />
        <Header />
        {children}
        <Footer />
        <WhatsAppFab />
        <Analytics />
      </body>
    </html>
  );
}
