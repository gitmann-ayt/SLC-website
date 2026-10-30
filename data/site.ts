/**
 * Brand, contact details, navigation and home-page copy.
 *
 * Items marked PLACEHOLDER must be replaced with real details before launch
 * (see REPLACE_GUIDE.md). Search engines read the address, phone and domain
 * from here, so wrong values here hurt rankings.
 */

/** Live domain. Canonical tags, the sitemap, robots.txt and schema all use it. */
export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.slccarrental.com").replace(/\/$/, ""); // PLACEHOLDER: confirm the real domain

/**
 * A build without NEXT_PUBLIC_SITE_URL is a preview (local, or the CloudFront
 * address before the domain is live): robots.txt and every page tell search
 * engines not to index it, so the temporary address never competes with the
 * real domain.
 */
export const isPreview = !process.env.NEXT_PUBLIC_SITE_URL;

export const brand = {
  name: "SLC",
  fullName: "SLC Car Rental",
  slogan: "Your Journey, Our Priority.",
  tagline: "Affordable car rental, luxury vehicles, airport transfers and corporate transport across Pakistan. Self drive or with a professional driver.",
  phoneDisplay: "0310-0000132",
  phoneHref: "tel:+923100000132",
  phoneE164: "+923100000132",
  whatsapp: "923100000132", // international format, digits only
  email: "smartlinkservicesg8@gmail.com",
  logo: "/images/brand/slc-logo.png",
  address: {
    street: "Office# 216, 2nd Floor, Kashif Bell-Air Plaza, G-8 Markaz",
    locality: "Islamabad",
    region: "Islamabad Capital Territory",
    postalCode: "44000",
    country: "PK",
  },
  /** Office pin. Left null, it is omitted from schema. */
  geo: { lat: 33.698034838870456, lng: 73.04803654211084 } as null | { lat: number; lng: number },
  /** Google Business Profile link. Used in schema (sameAs) and for the office map link. */
  googleMapsUrl: "", // add once SLC has a Google Business Profile
  openingHours: { days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"], opens: "00:00", closes: "23:59" },
  /** Social profiles. Empty strings are skipped. */
  social: {
    facebook: "",
    instagram: "",
    tiktok: "",
    youtube: "",
  },
  priceRange: "PKR 4,000 – 110,000 per day",
  year: new Date().getFullYear(),
};

export const sameAs = Object.values(brand.social).filter(Boolean).concat(brand.googleMapsUrl ? [brand.googleMapsUrl] : []);

/** Google Maps link to the office: the Business Profile if set, else the pin. */
export const mapLink = brand.googleMapsUrl || (brand.geo ? `https://www.google.com/maps?q=${brand.geo.lat},${brand.geo.lng}` : "");

export const waLink = (text = "Hi SLC, I'd like to book a car.") =>
  `https://wa.me/${brand.whatsapp}?text=${encodeURIComponent(text)}`;

export const pkr = (n: number) => `PKR ${n.toLocaleString("en-PK")}`;

/* ---------------- Navigation (mega-menu dropdowns) ---------------- */

export type NavLink = { label: string; href: string; logo?: string };
export type NavItem = { label: string; href: string; groups?: { title: string; links: NavLink[] }[] };

export const nav: NavItem[] = [
  { label: "Home", href: "/" },
  {
    label: "Our Fleet",
    href: "/cars/",
    groups: [
      {
        title: "By car type",
        links: [
          { label: "Hatchbacks", href: "/cars/?type=hatchback" },
          { label: "Sedans", href: "/cars/?type=sedan" },
          { label: "SUVs & 4x4", href: "/cars/?type=suv" },
          { label: "Luxury cars", href: "/cars/?type=luxury" },
          { label: "Vans & coasters", href: "/cars/?type=van" },
          { label: "View all cars", href: "/cars/" },
        ],
      },
      {
        title: "Popular cars",
        links: [
          { label: "Suzuki Alto", href: "/cars/suzuki-alto/", logo: "suzuki" },
          { label: "Toyota Corolla", href: "/cars/toyota-corolla/", logo: "toyota" },
          { label: "Honda Civic", href: "/cars/honda-civic/", logo: "honda" },
          { label: "Toyota Prado", href: "/cars/toyota-prado/", logo: "toyota" },
          { label: "Kia Sportage", href: "/cars/kia-sportage/", logo: "kia" },
          { label: "Mercedes S-Class", href: "/cars/mercedes-benz-s-class/", logo: "mercedes-benz" },
        ],
      },
      {
        title: "Rental type",
        links: [
          { label: "Self drive", href: "/services/self-drive-car-rental/" },
          { label: "With driver", href: "/services/car-rental-with-driver/" },
          { label: "Monthly rental", href: "/services/monthly-car-rental/" },
        ],
      },
    ],
  },
  {
    label: "Locations",
    href: "/rent-a-car/",
    groups: [
      {
        title: "Cities",
        links: [
          { label: "Islamabad", href: "/rent-a-car/islamabad/" },
          { label: "Rawalpindi", href: "/rent-a-car/rawalpindi/" },
          { label: "Lahore", href: "/rent-a-car/lahore/" },
          { label: "Karachi", href: "/rent-a-car/karachi/" },
          { label: "Peshawar", href: "/rent-a-car/peshawar/" },
          { label: "Faisalabad", href: "/rent-a-car/faisalabad/" },
          { label: "Multan", href: "/rent-a-car/multan/" },
          { label: "Sialkot", href: "/rent-a-car/sialkot/" },
          { label: "Gujranwala", href: "/rent-a-car/gujranwala/" },
          { label: "Abbottabad", href: "/rent-a-car/abbottabad/" },
        ],
      },
      {
        title: "Islamabad areas",
        links: [
          { label: "G-8", href: "/rent-a-car/g-8-islamabad/" },
          { label: "G-9", href: "/rent-a-car/g-9-islamabad/" },
          { label: "G-10", href: "/rent-a-car/g-10-islamabad/" },
          { label: "G-11", href: "/rent-a-car/g-11-islamabad/" },
          { label: "F-7", href: "/rent-a-car/f-7-islamabad/" },
          { label: "Blue Area", href: "/rent-a-car/blue-area-islamabad/" },
          { label: "Bahria Town", href: "/rent-a-car/bahria-town/" },
          { label: "Islamabad Airport", href: "/rent-a-car/islamabad-airport/" },
        ],
      },
      {
        title: "Trips",
        links: [
          { label: "Murree", href: "/rent-a-car/murree/" },
          { label: "Northern tours", href: "/services/tour-packages/" },
          { label: "All locations", href: "/rent-a-car/" },
        ],
      },
    ],
  },
  {
    label: "Services",
    href: "/services/",
    groups: [
      {
        title: "Rentals",
        links: [
          { label: "Self drive car rental", href: "/services/self-drive-car-rental/" },
          { label: "Car rental with driver", href: "/services/car-rental-with-driver/" },
          { label: "Monthly car rental", href: "/services/monthly-car-rental/" },
        ],
      },
      {
        title: "Occasions",
        links: [
          { label: "Airport transfers", href: "/services/airport-transfer/" },
          { label: "Corporate contracts", href: "/services/corporate-car-rental/" },
          { label: "Wedding cars", href: "/services/wedding-car-rental/" },
          { label: "Northern area tours", href: "/services/tour-packages/" },
        ],
      },
    ],
  },
  {
    label: "About",
    href: "/about/",
    groups: [
      {
        title: "Company",
        links: [
          { label: "About SLC", href: "/about/" },
          { label: "Our CEO", href: "/about/#ceo" },
          { label: "Fleet standards", href: "/about/#standards" },
          { label: "FAQ", href: "/faq/" },
        ],
      },
    ],
  },
  { label: "Contact", href: "/contact/" },
];

export const carMakes: { name: string; logo: string }[] = [
  { name: "Toyota", logo: "toyota" },
  { name: "Honda", logo: "honda" },
  { name: "Suzuki", logo: "suzuki" },
  { name: "Hyundai", logo: "hyundai" },
  { name: "Kia", logo: "kia" },
  { name: "Mercedes-Benz", logo: "mercedes-benz" },
  { name: "Audi", logo: "audi" },
  { name: "Lexus", logo: "lexus" },
];

export const steps = [
  { title: "Choose a car", body: "Browse hatchbacks, sedans, SUVs, luxury cars and vans, and pick self drive or with driver.", icon: "car" },
  { title: "Request a quote", body: "Send your city, dates and destination on WhatsApp or the quote form.", icon: "message" },
  { title: "Get confirmed", body: "We reply with a fixed price. Confirm, and the car is reserved for you.", icon: "check" },
  { title: "Drive or ride", body: "Collect the car or meet your driver at your door, on time.", icon: "seat" },
] as const;

/** General FAQs: shown on the home page and /faq/, and marked up as FAQPage schema. */
export const faqs = [
  { q: "Can I rent a car without a driver (self drive)?", a: "Yes. Most hatchbacks, sedans and SUVs are available for self drive. You need a valid CNIC and driving licence, and a refundable security deposit is taken at handover." },
  { q: "Which cities does SLC Car Rental cover?", a: "All of Pakistan. That includes Islamabad, Rawalpindi, Lahore, Karachi, Peshawar, Faisalabad, Multan, Sialkot, Gujranwala and Abbottabad, as well as Murree and the northern areas." },
  { q: "How is a booking confirmed?", a: "Send your trip details on WhatsApp or the quote form. We reply with a fixed price, and the booking is confirmed once you accept it. No sign-up or SMS code needed." },
  { q: "Do you offer airport pickup and drop?", a: "Yes, at Islamabad, Lahore, Karachi, Peshawar, Multan, Faisalabad and Sialkot airports. Share your flight number and the driver will track it." },
  { q: "What do I need to book?", a: "For a car with driver: your name, phone number and trip details. For self drive: a CNIC, a valid driving licence and the security deposit." },
  { q: "How does fuel work?", a: "Self-drive cars are handed over with fuel and returned at the same level. Cars with driver include city fuel up to a daily limit; outstation fuel and tolls are quoted separately." },
  { q: "Do you offer weekly and monthly rates?", a: "Yes. Weekly and monthly rentals cost less per day. Every car page lists its daily, weekly and monthly price." },
  { q: "Which car is cheapest to rent?", a: "The Suzuki Alto and Suzuki Wagon R are our most affordable cars, ideal for city errands and daily commutes." },
];

export const services = [
  { title: "Self drive", body: "Take the wheel yourself. Hatchbacks, sedans and SUVs with clear deposit and fuel rules.", icon: "key", href: "/services/self-drive-car-rental/" },
  { title: "With driver", body: "A trained, verified driver who knows the city, for hours, days or months.", icon: "pin", href: "/services/car-rental-with-driver/" },
  { title: "Airport transfers", body: "Flight-tracked pickups and drops with a driver waiting at arrivals.", icon: "plane", href: "/services/airport-transfer/" },
  { title: "Corporate contracts", body: "Monthly staff cars and delegation convoys with one monthly invoice.", icon: "briefcase", href: "/services/corporate-car-rental/" },
  { title: "Weddings & events", body: "Decorated luxury cars for the couple and guest shuttles on the day.", icon: "calendar", href: "/services/wedding-car-rental/" },
  { title: "Northern area tours", body: "SUVs and drivers experienced on the roads to Naran, Swat, Hunza and Skardu.", icon: "mountain", href: "/services/tour-packages/" },
] as const;

export const footerCols = [
  {
    title: "Company",
    links: [
      { label: "About SLC", href: "/about/" },
      { label: "Our fleet", href: "/cars/" },
      { label: "FAQ", href: "/faq/" },
      { label: "Contact", href: "/contact/" },
    ],
  },
  {
    title: "Services",
    links: [
      { label: "Self drive", href: "/services/self-drive-car-rental/" },
      { label: "With driver", href: "/services/car-rental-with-driver/" },
      { label: "Airport transfers", href: "/services/airport-transfer/" },
      { label: "Monthly rental", href: "/services/monthly-car-rental/" },
      { label: "Wedding cars", href: "/services/wedding-car-rental/" },
    ],
  },
  {
    title: "Cities",
    links: [
      { label: "Islamabad", href: "/rent-a-car/islamabad/" },
      { label: "Rawalpindi", href: "/rent-a-car/rawalpindi/" },
      { label: "Lahore", href: "/rent-a-car/lahore/" },
      { label: "Karachi", href: "/rent-a-car/karachi/" },
      { label: "Peshawar", href: "/rent-a-car/peshawar/" },
    ],
  },
  {
    title: "More cities",
    links: [
      { label: "Faisalabad", href: "/rent-a-car/faisalabad/" },
      { label: "Multan", href: "/rent-a-car/multan/" },
      { label: "Sialkot", href: "/rent-a-car/sialkot/" },
      { label: "Gujranwala", href: "/rent-a-car/gujranwala/" },
      { label: "Abbottabad", href: "/rent-a-car/abbottabad/" },
    ],
  },
];
