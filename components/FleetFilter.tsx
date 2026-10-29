"use client";

import { useEffect, useMemo, useState } from "react";
import { ChevronDown, Search } from "lucide-react";
import { cars as allCars, carName, categories, fromPrice, type CategorySlug } from "@/data/cars";
import { CarCard } from "./CarCard";

type Mode = "all" | "self" | "driver";
type Sort = "list" | "low" | "high";

/** Makes and tags in the order they first appear in the fleet. */
const makes = [...new Set(allCars.map((c) => c.make))];
const tags = [...new Set(allCars.flatMap((c) => (c.badge ? [c.badge] : [])))];

/**
 * Filterable vehicle listing. The full list is rendered on the server (so
 * search engines see every car); filtering happens in the browser.
 * `?type=suv` or `?brand=Toyota` in the URL preselects a filter (used by the nav menu).
 *
 * title: heading shown to the left of the filters.
 * limit: how many cars to show before "Show all".
 * showControls: extra filters (rental type, gearbox, seats, sort) for the fleet page.
 */
export default function FleetFilter({ title, limit, showControls = true }: { title?: string; limit?: number; showControls?: boolean }) {
  const [query, setQuery] = useState("");
  const [type, setType] = useState<CategorySlug | "all">("all");
  const [make, setMake] = useState("all");
  const [tag, setTag] = useState("all");
  const [mode, setMode] = useState<Mode>("all");
  const [gear, setGear] = useState<"all" | "Automatic" | "Manual">("all");
  const [seats, setSeats] = useState<"all" | "5" | "7" | "10">("all");
  const [sort, setSort] = useState<Sort>("list");
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const read = () => {
      const p = new URLSearchParams(window.location.search);
      const t = p.get("type");
      if (t && categories.some((c) => c.slug === t)) setType(t as CategorySlug);
      const b = p.get("brand");
      if (b && makes.includes(b)) setMake(b);
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

  const matches = useMemo(() => {
    const q = query.trim().toLowerCase();
    let l = allCars.filter(
      (c) =>
        (!q || `${carName(c)} ${c.make} ${c.model} ${c.badge ?? ""}`.toLowerCase().includes(q)) &&
        (type === "all" || c.category === type) &&
        (make === "all" || c.make === make) &&
        (tag === "all" || c.badge === tag) &&
        (mode === "all" || (mode === "self" ? c.priceSelfDrive !== null : true)) &&
        (gear === "all" || c.transmission === gear) &&
        (seats === "all" || c.seats >= Number(seats)),
    );
    if (sort === "low") l = [...l].sort((a, b) => fromPrice(a) - fromPrice(b));
    if (sort === "high") l = [...l].sort((a, b) => fromPrice(b) - fromPrice(a));
    return l;
  }, [query, type, make, tag, mode, gear, seats, sort]);

  const filtering = query !== "" || type !== "all" || make !== "all" || tag !== "all";
  // Any filter shows every match; otherwise the first `limit` until "Show all".
  const list = limit && !expanded && !filtering ? matches.slice(0, limit) : matches;

  const reset = () => { setQuery(""); pickType("all"); setMake("all"); setTag("all"); };

  return (
    <div>
      <div className={`flex flex-col gap-5 ${title ? "xl:flex-row xl:items-end xl:justify-between" : ""}`}>
        {title && <h2 className="shrink-0 text-[34px] leading-none font-bold text-ink md:text-[44px]">{title}</h2>}

        <div className="grid gap-2.5 sm:grid-cols-2 lg:flex lg:flex-wrap lg:items-center xl:justify-end" role="search" aria-label="Filter cars">
          <label className="relative sm:col-span-2 lg:w-60">
            <span className="sr-only">Search cars</span>
            <Search className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted" aria-hidden />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search cars"
              className="h-11 w-full rounded-xl border border-edge bg-white pr-3 pl-10 text-[14px] font-medium text-ink outline-none placeholder:text-muted/70 focus:border-ink"
            />
          </label>
          <Select label="Car type" value={type} onChange={(v) => pickType(v as CategorySlug | "all")}>
            <option value="all">All types</option>
            {categories.map((c) => <option key={c.slug} value={c.slug}>{c.title}</option>)}
          </Select>
          <Select label="Brand" value={make} onChange={setMake}>
            <option value="all">All brands</option>
            {makes.map((m) => <option key={m} value={m}>{m}</option>)}
          </Select>
          <Select label="Tag" value={tag} onChange={setTag}>
            <option value="all">All tags</option>
            {tags.map((t) => <option key={t} value={t}>{t}</option>)}
          </Select>
          {showControls && (
            <>
              <Select label="Rental type" value={mode} onChange={(v) => setMode(v as Mode)}>
                <option value="all">Self drive or driver</option>
                <option value="self">Self drive available</option>
                <option value="driver">With driver</option>
              </Select>
              <Select label="Gearbox" value={gear} onChange={(v) => setGear(v as typeof gear)}>
                <option value="all">Any gearbox</option>
                <option value="Automatic">Automatic</option>
                <option value="Manual">Manual</option>
              </Select>
              <Select label="Seats" value={seats} onChange={(v) => setSeats(v as typeof seats)}>
                <option value="all">Any seats</option>
                <option value="5">5+ seats</option>
                <option value="7">7+ seats</option>
                <option value="10">10+ seats</option>
              </Select>
              <Select label="Sort" value={sort} onChange={(v) => setSort(v as Sort)}>
                <option value="list">Sort: default</option>
                <option value="low">Price: low to high</option>
                <option value="high">Price: high to low</option>
              </Select>
            </>
          )}
        </div>
      </div>

      <p className="mt-5 text-[13px] text-muted" aria-live="polite">
        {filtering ? `${matches.length} of ${allCars.length} cars` : `${allCars.length} cars`}
        {filtering && <button type="button" onClick={reset} className="ml-3 font-semibold text-ink underline underline-offset-4">Clear filters</button>}
      </p>

      <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-4">
        {list.map((c) => <CarCard key={c.slug} car={c} />)}
      </div>
      {matches.length === 0 && <p className="mt-8 text-[15px] text-muted">No cars match these filters. Try removing one.</p>}

      {list.length < matches.length && (
        <div className="mt-10 flex justify-center">
          <button type="button" onClick={() => setExpanded(true)} className="flex h-12 items-center gap-2 rounded-xl border border-ink px-6 text-[14px] font-bold text-ink transition hover:bg-ink hover:text-white">
            Show all {matches.length} cars <ChevronDown className="size-4" />
          </button>
        </div>
      )}
    </div>
  );
}

function Select({ label, value, onChange, children }: { label: string; value: string; onChange: (v: string) => void; children: React.ReactNode }) {
  return (
    <label className="relative">
      <span className="sr-only">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-11 w-full cursor-pointer appearance-none rounded-xl border border-edge bg-white pr-9 pl-3.5 text-[14px] font-semibold text-ink outline-none focus:border-ink lg:w-auto"
      >
        {children}
      </select>
      <ChevronDown className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-muted" aria-hidden />
    </label>
  );
}
