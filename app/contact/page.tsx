import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { brand, mapLink, waLink } from "@/data/site";
import { pageMeta } from "@/lib/seo";
import BookingForm from "@/components/BookingForm";
import { MapEmbed, PageHero } from "@/components/Page";
import { WhatsAppIcon } from "@/components/ui";

export const metadata = pageMeta({
  title: "Contact & Book a Car in Islamabad",
  description: `Book a car with driver in Islamabad and Rawalpindi. WhatsApp or call ${brand.fullName} on ${brand.phoneDisplay} or ${brand.landlineDisplay}, 24 hours a day, or send your trip details with the booking form.`,
  path: "/contact/",
});

export default function ContactPage() {
  const a = brand.address;
  const rows = [
    { icon: WhatsAppIcon, label: "WhatsApp", value: "Chat with us", href: waLink() },
    { icon: Phone, label: "Phone", value: brand.phoneDisplay, href: brand.phoneHref },
    { icon: Phone, label: "Landline", value: brand.landlineDisplay, href: brand.landlineHref },
    { icon: Mail, label: "Email", value: brand.email, href: `mailto:${brand.email}` },
    { icon: MapPin, label: "Office", value: `${a.street}, ${a.locality}`, href: mapLink || undefined },
    { icon: Clock, label: "Hours", value: "Open 24 hours, 7 days a week" },
  ];
  return (
    <main>
      <PageHero
        eyebrow="Contact"
        title="Contact SLC & book your car"
        blurb="The quickest way to book is WhatsApp. Send your pickup point, dates and car, and we reply with a fixed quote."
        crumbs={[{ name: "Contact", path: "/contact/" }]}
      />
      <section className="bg-surface py-14 md:py-16">
        <div className="container-x grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <h2 className="text-[24px] font-semibold tracking-tight">Get in touch</h2>
            <ul className="mt-6 space-y-3">
              {rows.map((r) => {
                const inner = (
                  <>
                    <span className="grid size-11 shrink-0 place-items-center rounded-full bg-ink text-white"><r.icon className="size-5" /></span>
                    <span>
                      <span className="block text-[12px] font-semibold tracking-wider text-muted uppercase">{r.label}</span>
                      <span className="text-[15px] font-medium">{r.value}</span>
                    </span>
                  </>
                );
                return (
                  <li key={r.label}>
                    {r.href ? (
                      <a href={r.href} target={r.href.startsWith("http") ? "_blank" : undefined} rel="noopener" className="flex items-center gap-4 rounded-xl border border-edge bg-white p-4 hover:border-ink">{inner}</a>
                    ) : (
                      <div className="flex items-center gap-4 rounded-xl border border-edge bg-white p-4">{inner}</div>
                    )}
                  </li>
                );
              })}
            </ul>
            <div className="mt-8"><MapEmbed query={brand.geo ? `${brand.geo.lat},${brand.geo.lng}` : `${brand.fullName} ${a.locality}`} title={`${brand.fullName} location`} /></div>
          </div>
          <BookingForm id="book" title="Request a quote" />
        </div>
      </section>
    </main>
  );
}
