"use client";

import { useState, type FormEvent, type ReactNode } from "react";
import { cars, carName } from "@/data/cars";
import { cities } from "@/data/locations";
import { waLink } from "@/data/site";
import { WhatsAppIcon } from "./ui";

/** Bar fields: boxed when stacked; on desktop one continuous bar split by short dividers. */
const fieldBar =
  "relative border-neutral-200 px-4 py-3.5 hover:bg-neutral-50 lg:border-transparent lg:before:absolute lg:before:inset-y-4 lg:before:-left-px lg:before:w-px lg:before:bg-neutral-200 lg:first:before:hidden";

function Field({ label, children, big = false }: { label: string; children: ReactNode; big?: boolean }) {
  return (
    <label className={`block rounded-xl border bg-white transition focus-within:border-gold-deep ${big ? fieldBar : "border-edge px-4 py-2.5"}`}>
      <span className={`block tracking-[0.12em] uppercase ${big ? "text-[12px] font-bold text-ink/70" : "text-[11px] font-semibold text-muted"}`}>{label}</span>
      {children}
    </label>
  );
}

/** Date input that shows "Add date" while empty instead of the browser's mm/dd/yyyy. */
function DateInput({ name, className, big }: { name: string; className: string; big: boolean }) {
  const [value, setValue] = useState("");
  const [focused, setFocused] = useState(false);
  const empty = !value && !focused;
  // The margin moves to the wrapper so the overlay centres on the input itself
  return (
    <span className={`relative block ${big ? "mt-1" : "mt-0.5"}`}>
      <input
        name={name}
        type="date"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        onClick={(e) => { try { e.currentTarget.showPicker(); } catch {} }}
        className={`${className} mt-0! ${empty ? "text-transparent" : ""}`}
      />
      {empty && <span aria-hidden className={`pointer-events-none absolute inset-y-0 left-0 flex items-center font-medium text-ink/45 ${big ? "text-[16px]" : "text-[15px]"}`}>Add date</span>}
    </span>
  );
}

const control = "mt-0.5 w-full min-w-0 bg-transparent text-[15px] font-semibold text-ink outline-none placeholder:font-normal placeholder:text-muted/70";
/** Bigger, bolder text for the hero bar. */
const controlBig = "mt-1 w-full min-w-0 bg-transparent text-[16px] font-bold text-ink outline-none";

/**
 * Quote form. Builds a WhatsApp message from the details; no sign-up or SMS
 * code, so the first message is one tap away.
 *
 * layout="bar": one row under the hero (like a search bar).
 * layout="stack": single column, for sidebars and the contact page.
 */
export default function BookingForm({
  id,
  title = "Find your ideal rental",
  defaultCar = "",
  defaultCity = "",
  defaultType = "With driver",
  layout = "stack",
  className = "",
}: {
  id?: string;
  title?: string;
  defaultCar?: string;
  defaultCity?: string;
  defaultType?: "With driver" | "Self drive";
  layout?: "bar" | "stack";
  className?: string;
}) {
  function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const d = new FormData(e.currentTarget);
    const msg = [
      "Hi SLC, I'd like a quote.",
      d.get("name") ? `Name: ${d.get("name")}` : "",
      `Rental type: ${d.get("type")}`,
      `Car: ${d.get("car") || "Any"}`,
      `City: ${d.get("city") || "-"}`,
      `Pickup date: ${d.get("start") || "-"}  Return: ${d.get("end") || "-"}`,
      d.get("destination") ? `Destination: ${d.get("destination")}` : "",
    ].filter(Boolean).join("\n");
    window.open(waLink(msg), "_blank", "noopener");
  }

  const big = layout === "bar";
  const ctl = big ? controlBig : control;

  const fields = (
    <>
      <Field big={big} label="Rental type">
        <select name="type" defaultValue={defaultType} className={ctl}>
          <option>With driver</option>
          <option>Self drive</option>
        </select>
      </Field>
      <Field big={big} label="Vehicle">
        <select name="car" defaultValue={defaultCar} className={ctl}>
          <option value="">Any car</option>
          {cars.map((c) => <option key={c.slug}>{carName(c)}</option>)}
        </select>
      </Field>
      <Field big={big} label="Pickup city">
        <select name="city" defaultValue={defaultCity} className={ctl}>
          <option value="">Select city</option>
          {cities().map((c) => <option key={c.slug}>{c.name}</option>)}
        </select>
      </Field>
      <Field big={big} label="Pickup date">
        <DateInput name="start" big={big} className={ctl} />
      </Field>
      <Field big={big} label="Return date">
        <DateInput name="end" big={big} className={ctl} />
      </Field>
    </>
  );

  const button = (
    <button type="submit" className={`flex items-center justify-center gap-2.5 rounded-xl bg-gold-sheen text-ink shadow-glow transition hover:shadow-glow-lg hover:brightness-110 ${big ? "min-h-[72px] px-8 text-[17px] font-bold lg:ml-2" : "min-h-14 px-6 text-[15px] font-semibold"}`}>
      <WhatsAppIcon className={big ? "size-6" : "size-5"} /> Get a quote
    </button>
  );

  if (layout === "bar") {
    return (
      <form id={id} onSubmit={submit} className={`scroll-mt-28 rounded-2xl border border-white/20 bg-white p-3 shadow-[0_30px_80px_-20px_rgb(0_0_0/0.8),0_0_0_1px_rgb(245_194_17/0.35),0_40px_90px_-40px_rgb(245_194_17/0.3)] lg:p-2 ${className}`}>
        <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-[repeat(5,minmax(0,1fr))_auto] lg:gap-0">
          {fields}
          {button}
        </div>
      </form>
    );
  }

  return (
    <form id={id} onSubmit={submit} className={`scroll-mt-28 rounded-2xl border border-edge bg-mist p-5 md:p-6 ${className}`}>
      <h2 className="mb-4 text-[20px] font-semibold text-ink">{title}</h2>
      <div className="grid gap-3">
        <Field big={big} label="Your name">
          <input name="name" autoComplete="name" placeholder="Full name" className={ctl} />
        </Field>
        {fields}
        <Field big={big} label="Destination">
          <input name="destination" placeholder="Where are you going?" className={ctl} />
        </Field>
        {button}
      </div>
      <p className="mt-3 text-[12.5px] text-muted">Opens WhatsApp with your details filled in. No sign-up needed.</p>
    </form>
  );
}
