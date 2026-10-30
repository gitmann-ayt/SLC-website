import type { MetadataRoute } from "next";
import { cars } from "@/data/cars";
import { locations } from "@/data/locations";
import { servicePages } from "@/data/services";
import { abs } from "@/lib/seo";

/**
 * Built from the same data as the pages, so it can never list a page that
 * doesn't exist or miss one that does.
 */
export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const entry = (path: string, priority: number, changeFrequency: "weekly" | "monthly" = "monthly") => ({
    url: abs(path),
    lastModified: now,
    changeFrequency,
    priority,
  });
  return [
    entry("/", 1, "weekly"),
    entry("/cars/", 0.9, "weekly"),
    entry("/rent-a-car/", 0.9),
    entry("/services/", 0.8),
    entry("/about/", 0.7),
    entry("/faq/", 0.6),
    entry("/contact/", 0.7),
    ...locations.map((l) => entry(`/rent-a-car/${l.slug}/`, l.kind === "sector" ? 0.9 : 0.8)),
    ...cars.map((c) => entry(`/cars/${c.slug}/`, 0.7)),
    ...servicePages.map((s) => entry(`/services/${s.slug}/`, 0.8)),
  ];
}
