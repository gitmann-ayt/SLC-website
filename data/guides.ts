/**
 * Travel and rental guides (/guides/<slug>/).
 *
 * The weekly automation job (automation/jobs/content.md) adds one entry here
 * per run. Rules for every guide, human or automated:
 * - Facts about SLC (prices, documents, policies, cars, cities) must come from
 *   the other data files. Never invent a price, policy or claim.
 * - `answer` is a 40–70 word direct answer to the question in the H1. Answer
 *   engines (Google AI Overviews, ChatGPT, Perplexity) quote this kind of text.
 * - Each guide covers a different search intent. Check existing slugs and
 *   titles before adding one, so two guides never compete for the same query.
 * - Newest guides go at the top of the array.
 */

export type Guide = {
  slug: string;
  /** Short name for cards, breadcrumbs and the footer */
  title: string;
  h1: string;
  /** Under 60 characters; the site name is appended automatically */
  metaTitle: string;
  /** 120–160 characters */
  metaDescription: string;
  /** YYYY-MM-DD */
  published: string;
  /** YYYY-MM-DD */
  updated: string;
  /** A photo in /public/images/cities */
  image: string;
  answer: string;
  sections: { heading: string; paragraphs: string[]; bullets?: string[] }[];
  faqs: { q: string; a: string }[];
  related: {
    /** slugs from data/cars.ts */
    cars: string[];
    /** slugs from data/locations.ts */
    locations: string[];
    /** slugs from data/services.ts */
    services: string[];
  };
};

export const guides: Guide[] = [
  {
    slug: "islamabad-to-murree-by-car",
    title: "Islamabad to Murree by car",
    h1: "Islamabad to Murree by car: time, route and which car to take",
    metaTitle: "Islamabad to Murree by Car: Time, Route & Car Choice",
    metaDescription: "How long the drive from Islamabad to Murree takes, the best route, when to leave, and which car to rent for summer and snow. With driver or self drive from SLC.",
    published: "2026-11-18",
    updated: "2026-11-18",
    image: "/images/cities/murree.webp",
    answer: "Murree is about 60 km from Islamabad via the Murree Expressway, a drive of 1.5 to 2 hours in normal traffic. Leave early on weekends to avoid the rush. A sedan is fine in summer, but after snowfall an SUV such as a Toyota Prado or Fortuner with a driver who knows the hill roads is the safer choice.",
    sections: [
      {
        heading: "How long does the drive take?",
        paragraphs: [
          "From most sectors of Islamabad the drive to Murree takes 1.5 to 2 hours. From Islamabad International Airport, plan for 2 to 2.5 hours. Weekend and holiday traffic can add a lot more, especially on the final climb into town and around Mall Road.",
        ],
        bullets: ["Islamabad to Murree: 1.5–2 hr", "Islamabad Airport to Murree: 2–2.5 hr", "Murree to Patriata: 30–40 min", "Murree to Nathia Gali: 1–1.5 hr"],
      },
      {
        heading: "Which route to take",
        paragraphs: [
          "The Murree Expressway is the main route from Islamabad and the easiest drive. From Murree, the road continues to Patriata for the chairlift and on to Nathia Gali and the rest of the Galiyat, so many people combine Murree with one of these stops on the same day.",
        ],
      },
      {
        heading: "Which car to rent",
        paragraphs: [
          "In summer, any comfortable sedan such as a Toyota Corolla handles the Murree road well. In winter, after snowfall, roads can be icy and steep: we strongly recommend an SUV such as the Toyota Prado or Fortuner, and a driver who has driven the hills in snow. Families with luggage for an overnight stay will also be more comfortable in an SUV like the Kia Sportage.",
        ],
      },
      {
        heading: "With driver or self drive?",
        paragraphs: [
          "Weekend traffic, narrow parking near Mall Road and winter road conditions are the main reasons most visitors book Murree trips with a driver. SLC drivers know the parking options, the routes to Patriata and Nathia Gali, and when to leave Islamabad to beat the rush. For overnight trips, the outstation rate includes the driver's stay and meals; fuel and tolls are quoted separately.",
        ],
      },
    ],
    faqs: [
      { q: "Can I do Murree as a day trip from Islamabad?", a: "Yes. Leave Islamabad early in the morning, spend the day on Mall Road or at Patriata, and return in the evening. The driver brings you back to your door." },
      { q: "Is an SUV necessary for Murree in winter?", a: "We strongly recommend one after snowfall. The Prado and Fortuner handle snowy roads far better than a sedan." },
      { q: "Does the price include the driver's stay for overnight trips?", a: "Yes. Outstation rates include the driver's stay and meals. Fuel and tolls are quoted separately." },
    ],
    related: {
      cars: ["toyota-prado", "toyota-fortuner", "kia-sportage"],
      locations: ["murree", "islamabad", "rawalpindi"],
      services: ["tour-packages", "car-rental-with-driver"],
    },
  },
  {
    slug: "documents-to-rent-a-car-in-pakistan",
    title: "Documents to rent a car in Pakistan",
    h1: "What documents do you need to rent a car in Pakistan?",
    metaTitle: "Documents Needed to Rent a Car in Pakistan",
    metaDescription: "The documents you need to rent a car in Pakistan: CNIC or passport, driving licence and a refundable deposit for self drive. What changes when you book with a driver.",
    published: "2026-11-18",
    updated: "2026-11-18",
    image: "/images/cities/islamabad.webp",
    answer: "For a self-drive rental in Pakistan you need a valid CNIC (or a passport if you are a foreign national), a valid driving licence and a refundable security deposit. If you book a car with a driver, you don't need a driving licence at all, and booking is as simple as sending your trip details on WhatsApp.",
    sections: [
      {
        heading: "Self drive: what to bring at handover",
        paragraphs: [
          "Self-drive rentals need three things, checked when the car is handed over to you:",
        ],
        bullets: [
          "A valid CNIC, or a passport for foreign nationals",
          "A valid driving licence",
          "A refundable security deposit, returned when the car comes back in the same condition",
        ],
      },
      {
        heading: "With driver: no licence needed",
        paragraphs: [
          "When you rent a car with a driver, the driver is responsible for the car, so you don't need to show a driving licence. Send your pickup address, dates and preferred car on WhatsApp and you get a fixed quote before you confirm.",
        ],
      },
      {
        heading: "Taking a car to another city",
        paragraphs: [
          "Self-drive cars can be taken to another city with prior approval. Tell us the route when booking so it can be included in the quote. Each booking includes a daily distance allowance, and extra distance is charged per km as stated in the quote.",
        ],
      },
    ],
    faqs: [
      { q: "Can a foreigner rent a car in Pakistan?", a: "Yes. Foreign nationals can book with a passport instead of a CNIC. Booking with a driver is the easiest option if you are new to Pakistani roads." },
      { q: "Is the security deposit refundable?", a: "Yes. It is returned when the car comes back in the same condition it was handed over in." },
      { q: "Can the car be delivered to my address?", a: "Yes. Self-drive cars can be delivered to your home, office or hotel and collected from there at the end of the rental." },
    ],
    related: {
      cars: ["suzuki-alto", "toyota-corolla", "kia-sportage"],
      locations: ["islamabad", "lahore", "karachi"],
      services: ["self-drive-car-rental", "car-rental-with-driver"],
    },
  },
];

export const guideBySlug = (slug: string) => guides.find((g) => g.slug === slug);
