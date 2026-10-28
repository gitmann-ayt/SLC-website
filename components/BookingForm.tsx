"use client";

import type { FormEvent, ReactNode } from "react";
import { cars, carName } from "@/data/cars";
import { cities } from "@/data/locations";
import { waLink } from "@/data/site";
import { WhatsAppIcon } from "./ui";

function Field({ label, children, className = "" }: { label: string; children: ReactNode; className?: string }) {
  return (
    <label className={`block rounded-xl border border-edge bg-white px-4 py-2.5 transition focus-within:border-ink ${className}`}>
      <span className="block text-[11px] font-semibold tracking-[0.12em] text-muted uppercase">{label}</span>
      {children}
    </label>
  );
}

const control = "mt-0.5 w-full min-w-0 bg-transparent text-[15px] font-semibold text-ink outline-none placeholder:font-normal placeholder:text-muted/70";

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

  const fields = (
    <>
      <Field label="Rental type">
        <select name="type" defaultValue={defaultType} className={control}>
          <option>With driver</option>
          <option>Self drive</option>
        </select>
      </Field>
      <Field label="Vehicle">
        <select name="car" defaultValue={defaultCar} className={control}>
          <option value="">Any car</option>
          {cars.map((c) => <option key={c.slug}>{carName(c)}</option>)}
        </select>
      </Field>
      <Field label="Pickup city">
        <select name="city" defaultValue={defaultCity} className={control}>
          <option value="">Select city</option>
          {cities().map((c) => <option key={c.slug}>{c.name}</option>)}
        </select>
      </Field>
      <Field label="Pickup date">
        <input name="start" type="date" className={control} />
      </Field>
      <Field label="Return date">
        <input name="end" type="date" className={control} />
      </Field>
    </>
  );

  const button = (
    <button type="submit" className="flex min-h-14 items-center justify-center gap-2 rounded-xl bg-ink px-6 text-[15px] font-semibold text-white transition hover:bg-neutral-800">
      <WhatsAppIcon className="size-5 text-[#25d366]" /> Get a quote
    </button>
  );

  if (layout === "bar") {
    return (
      <form id={id} onSubmit={submit} className={`scroll-mt-28 rounded-2xl border border-edge bg-white p-3 shadow-[0_24px_60px_-28px_rgb(0_0_0/0.35)] ${className}`}>
        <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-[repeat(5,minmax(0,1fr))_auto]">
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
        <Field label="Your name">
          <input name="name" autoComplete="name" placeholder="Full name" className={control} />
        </Field>
        {fields}
        <Field label="Destination">
          <input name="destination" placeholder="Where are you going?" className={control} />
        </Field>
        {button}
      </div>
      <p className="mt-3 text-[12.5px] text-muted">Opens WhatsApp with your details filled in. No sign-up needed.</p>
    </form>
  );
}
