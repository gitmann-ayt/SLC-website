"use client";

import { useEffect, useMemo, useState } from "react";
import { SlidersHorizontal } from "lucide-react";
import { cars as allCars, categories, fromPrice, type CategorySlug } from "@/data/cars";
import { CarCard } from "./CarCard";

type Mode = "all" | "self" | "driver";
type Sort = "popular" | "low" | "high";

/**
 * Filterable vehicle listing. The full list is rendered on the server (so
 * search engines see every car); filtering happens in the browser.
 * `?type=suv` in the URL preselects a category (used by the nav menu).
 */
export default function FleetFilter({ limit, showControls = true }: { limit?: number; showControls?: boolean }) {
  const [type, setType] = useState<CategorySlug | "all">("all");
  const [mode, setMode] = useState<Mode>("all");
  const [gear, setGear] = useState<"all" | "Automatic" | "Manual">("all");
  const [seats, setSeats] = useState<"all" | "5" | "7">("all");
  const [sort, setSort] = useState<Sort>("popular");

  useEffect(() => {
    const read = () => {
      const t = new URLSearchParams(window.location.search).get("type");
      if (t && categories.some((c) => c.slug === t)) setType(t as CategorySlug);
    };
    read();
    window.addEventListener("popstate", read);
    return () => window.removeEventListener("popstate", read);
  }, []);

  const pickType = (t: CategorySlug | "all") => {
    setType(t);
    if (showControls) {
      const url = new URL(window.location.href);
      if (t === "all") url.searchParams.delete("type");
      else url.searchParams.set("type", t);
      window.history.replaceState(null, "", url);
    }
  };

  const list = useMemo(() => {
    let l = allCars.filter(
      (c) =>
        (type === "all" || c.category === type) &&
        (mode === "all" || (mode === "self" ? c.priceSelfDrive !== null : true)) &&
        (gear === "all" || c.transmission === gear) &&
        (seats === "all" || c.seats >= Number(seats)),
    );
    if (sort === "low") l = [...l].sort((a, b) => fromPrice(a) - fromPrice(b));
    if (sort === "high") l = [...l].sort((a, b) => fromPrice(b) - fromPrice(a));
    if (sort === "popular" && limit) l = [...l].sort((a, b) => Number(!!b.featured) - Number(!!a.featured));
    return limit ? l.slice(0, limit) : l;
  }, [type, mode, gear, seats, sort, limit]);

  const chip = (active: boolean) =>
    `min-h-10 rounded-full border px-4 text-[13.5px] font-semibold transition ${active ? "border-ink bg-ink text-white" : "border-edge bg-white text-ink/80 hover:border-ink hover:text-ink"}`;
  const select = "min-h-10 rounded-xl border border-edge bg-white px-3 text-[13.5px] font-medium text-ink";

  return (
    <div>
      <div className="flex flex-wrap gap-2" role="group" aria-label="Car type">
        <button type="button" className={chip(type === "all")} onClick={() => pickType("all")} aria-pressed={type === "all"}>All cars</button>
        {categories.map((c) => (
          <button key={c.slug} type="button" className={chip(type === c.slug)} onClick={() => pickType(c.slug)} aria-pressed={type === c.slug}>
            {c.title}
          </button>
        ))}
      </div>

      {showControls && (
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <span className="flex items-center gap-2 text-[13px] font-semibold text-muted"><SlidersHorizontal className="size-4" /> Filter</span>
          <select aria-label="Rental type" className={select} value={mode} onChange={(e) => setMode(e.target.value as Mode)}>
            <option value="all">Self drive or with driver</option>
            <option value="self">Self drive available</option>
            <option value="driver">With driver</option>
          </select>
          <select aria-label="Gearbox" className={select} value={gear} onChange={(e) => setGear(e.target.value as typeof gear)}>
            <option value="all">Any gearbox</option>
            <option value="Automatic">Automatic</option>
            <option value="Manual">Manual</option>
          </select>
          <select aria-label="Seats" className={select} value={seats} onChange={(e) => setSeats(e.target.value as typeof seats)}>
            <option value="all">Any seats</option>
            <option value="5">5+ seats</option>
            <option value="7">7+ seats</option>
          </select>
          <select aria-label="Sort" className={select} value={sort} onChange={(e) => setSort(e.target.value as Sort)}>
            <option value="popular">Most popular</option>
            <option value="low">Price: low to high</option>
            <option value="high">Price: high to low</option>
          </select>
          <span className="text-[13px] text-muted" aria-live="polite">{list.length} cars</span>
        </div>
      )}

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((c) => <CarCard key={c.slug} car={c} />)}
      </div>
      {list.length === 0 && <p className="mt-8 text-[15px] text-muted">No cars match these filters. Try removing one.</p>}
    </div>
  );
}
