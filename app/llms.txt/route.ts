import { about } from "@/data/about";
import { cars, carName } from "@/data/cars";
import { locations } from "@/data/locations";
import { servicePages } from "@/data/services";
import { brand, faqs, pkr } from "@/data/site";
import { abs } from "@/lib/seo";

export const dynamic = "force-static";

/** Plain-text summary for AI answer engines (ChatGPT, Perplexity, AI Overviews). */
export function GET() {
  const lines = [
    `# ${brand.fullName}`,
    "",
    `> ${about.company.intro} ${brand.tagline}`,
    "",
    `Phone/WhatsApp: ${brand.phoneDisplay}. Email: ${brand.email}. Open 24/7. Self drive or with a professional driver.`,
    "",
    "## Key pages",
    `- [About us and our CEO](${abs("/about/")})`,
    `- [All cars and prices](${abs("/cars/")})`,
    `- [Locations](${abs("/rent-a-car/")})`,
    `- [Services](${abs("/services/")})`,
    `- [FAQ](${abs("/faq/")})`,
    `- [Contact and booking](${abs("/contact/")})`,
    "",
    "## Locations served",
    ...locations.map((l) => `- [Rent a car in ${l.place}](${abs(`/rent-a-car/${l.slug}/`)}): ${l.metaDescription}`),
    "",
    "## Services",
    ...servicePages.map((s) => `- [${s.title}](${abs(`/services/${s.slug}/`)}): ${s.metaDescription}`),
    "",
    "## Fleet (from price per day)",
    ...cars.map((c) => `- [${carName(c)} ${c.year}](${abs(`/cars/${c.slug}/`)}): ${c.seats} seats, ${c.fuel}, ${pkr(c.priceSelfDrive ?? c.priceDay)}/day${c.priceSelfDrive ? " self drive" : " with driver"}, ${pkr(c.priceMonth)}/month`),
    "",
    "## FAQ",
    ...faqs.flatMap((f) => [`Q: ${f.q}`, `A: ${f.a}`, ""]),
  ];
  return new Response(lines.join("\n"), { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
