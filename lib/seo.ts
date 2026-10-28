import type { Metadata } from "next";
import { brand, faqs as _faqs, sameAs, siteUrl } from "@/data/site";
import { carName, type Car } from "@/data/cars";

export const abs = (path = "/") => `${siteUrl}${path.startsWith("/") ? path : `/${path}`}`;

/**
 * Per-page metadata with a self-referencing canonical on the live domain.
 * Every page should build its metadata through this.
 */
export function pageMeta({
  title,
  description,
  path,
  image = "/images/cities/islamabad.webp",
  absoluteTitle = false,
}: {
  title: string;
  description: string;
  path: string;
  image?: string;
  absoluteTitle?: boolean;
}): Metadata {
  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title,
      description,
      url: path,
      siteName: brand.fullName,
      locale: "en_PK",
      type: "website",
      images: [{ url: image }],
    },
    twitter: { card: "summary_large_image", title, description, images: [image] },
  };
}

/* ---------------- JSON-LD builders ---------------- */

const businessId = `${siteUrl}/#business`;

export function businessSchema() {
  const a = brand.address;
  return {
    "@context": "https://schema.org",
    "@type": "AutoRental",
    "@id": businessId,
    name: brand.fullName,
    description: brand.tagline,
    url: abs("/"),
    logo: abs("/images/brand/slc-logo.png"),
    image: abs("/images/cities/islamabad.webp"),
    telephone: brand.phoneE164,
    email: brand.email,
    priceRange: brand.priceRange,
    address: {
      "@type": "PostalAddress",
      streetAddress: a.street,
      addressLocality: a.locality,
      addressRegion: a.region,
      postalCode: a.postalCode,
      addressCountry: a.country,
    },
    ...(brand.geo && { geo: { "@type": "GeoCoordinates", latitude: brand.geo.lat, longitude: brand.geo.lng } }),
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: brand.openingHours.days,
        opens: brand.openingHours.opens,
        closes: brand.openingHours.closes,
      },
    ],
    areaServed: ["Islamabad", "Rawalpindi", "Lahore", "Karachi", "Peshawar", "Faisalabad", "Multan", "Sialkot", "Gujranwala", "Abbottabad"].map((name) => ({
      "@type": "Place",
      name,
    })),
    ...(sameAs.length && { sameAs }),
  };
}

export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${siteUrl}/#website`,
    url: abs("/"),
    name: brand.fullName,
    publisher: { "@id": businessId },
    inLanguage: "en-PK",
  };
}

export function breadcrumbSchema(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({ "@type": "ListItem", position: i + 1, name: it.name, item: abs(it.path) })),
  };
}

export function faqSchema(items: { q: string; a: string }[] = _faqs) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };
}

export function carSchema(car: Car) {
  const name = carName(car);
  return {
    "@context": "https://schema.org",
    "@type": "Car",
    name: `${name} ${car.year}`,
    brand: { "@type": "Brand", name: car.make },
    model: car.model,
    vehicleModelDate: String(car.year),
    vehicleSeatingCapacity: car.seats,
    vehicleTransmission: car.transmission,
    fuelType: car.fuel,
    color: car.colors.join(", "),
    image: car.images.map((i) => abs(i)),
    description: car.summary,
    url: abs(`/cars/${car.slug}/`),
    offers: {
      "@type": "Offer",
      priceCurrency: "PKR",
      price: car.priceSelfDrive ?? car.priceDay,
      availability: "https://schema.org/InStock",
      url: abs(`/cars/${car.slug}/`),
      seller: { "@id": businessId },
      priceSpecification: [
        ...(car.priceSelfDrive !== null ? [{ "@type": "UnitPriceSpecification", price: car.priceSelfDrive, priceCurrency: "PKR", unitCode: "DAY", name: "Daily self-drive rate" }] : []),
        { "@type": "UnitPriceSpecification", price: car.priceDay, priceCurrency: "PKR", unitCode: "DAY", name: "Daily rate with driver" },
        { "@type": "UnitPriceSpecification", price: car.priceWeek, priceCurrency: "PKR", unitCode: "WEE", name: "Weekly rate with driver" },
        { "@type": "UnitPriceSpecification", price: car.priceMonth, priceCurrency: "PKR", unitCode: "MON", name: "Monthly rate with driver" },
      ],
    },
  };
}

export function serviceSchema({ name, description, path }: { name: string; description: string; path: string }) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name,
    description,
    url: abs(path),
    provider: { "@id": businessId },
    areaServed: { "@type": "Country", name: "Pakistan" },
  };
}

export function personSchema(p: { name: string; role: string; photo: string; description: string }) {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: p.name,
    jobTitle: p.role,
    image: abs(p.photo),
    description: p.description,
    worksFor: { "@id": businessId },
  };
}
