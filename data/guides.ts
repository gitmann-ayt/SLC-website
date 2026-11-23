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
    slug: "islamabad-to-hunza-road-trip",
    title: "Islamabad to Hunza road trip",
    h1: "Islamabad to Hunza road trip: route, days needed and best car",
    metaTitle: "Islamabad to Hunza Road Trip: Route & Car",
    metaDescription: "Plan an Islamabad to Hunza road trip: the Karakoram Highway route, how many days to allow, the best season and which SUV or van to hire with a driver from SLC.",
    published: "2026-11-23",
    updated: "2026-11-23",
    image: "/images/cities/hunza.webp",
    answer: "Hunza is reached from Islamabad by the Karakoram Highway, a long mountain drive usually split into two driving days with a night near Chilas or Besham. Allow five to seven days in total to enjoy the valley without rushing. An SUV such as a Toyota Prado or Fortuner, or a Hiace for groups, with an experienced driver is the usual choice.",
    sections: [
      {
        heading: "How many days do you need?",
        paragraphs: [
          "The drive itself takes two long days, and the road is slow because of mountain sections, checkposts, roadworks and landslide delays. Most travellers who want to see Hunza properly, rather than just reach it, plan five to seven days from Islamabad at a comfortable pace.",
        ],
        bullets: [
          "Day 1: Islamabad to an overnight stop near Besham or Chilas (a full day of driving)",
          "Day 2: on to Gilgit and Karimabad in Hunza",
          "Days 3 to 5: Karimabad, Attabad Lake, Passu and the upper valley",
          "Final days: the return drive, again over two days",
        ],
      },
      {
        heading: "Which route do you take?",
        paragraphs: [
          "Almost all trips follow the Karakoram Highway (KKH): out of Islamabad towards Hasan Abdal, then through Abbottabad and Mansehra, along the Indus through Besham, Dasu and Chilas, and on to Gilgit before turning up the Hunza valley. Abbottabad is a natural first break, and our Abbottabad page covers pickups there if you are joining from the Hazara side.",
          "In summer some travellers return through Naran and over the Babusar Pass instead, which is a scenic alternative but a seasonal one. Road and pass conditions change, so check the current situation before you travel and ask your driver to confirm the plan the day before.",
        ],
      },
      {
        heading: "When is the best time to go?",
        paragraphs: [
          "Late spring to early autumn is the usual window, when the valley is open, green and clear. In winter, snow and cold can close mountain roads and some services in Hunza shut down, so check conditions and plan extra days if you travel then. Peak summer weekends and public holidays bring heavy traffic and full hotels, so book early.",
        ],
      },
      {
        heading: "Which car is best for Hunza?",
        paragraphs: [
          "The KKH is paved for most of the way, but it is long, with steep sections, rockfall areas and bumpy stretches. An SUV with good ground clearance is more comfortable than a sedan on a trip this long. Our tour page recommends a Toyota Prado or Fortuner, and a Hiace for groups.",
          "The Prado is rented with a driver only. The Fortuner seats seven with room for luggage. For families or friends travelling together with several bags, the Hiace Grand Cabin carries a much larger group in one vehicle.",
        ],
      },
      {
        heading: "How booking with a driver works",
        paragraphs: [
          "Send your dates, number of passengers, pickup city and the places you want to see on WhatsApp. We reply with a fixed quote for the whole trip. Prices for Hunza tours are not listed on the website, so they are quoted on WhatsApp.",
        ],
        bullets: [
          "Outstation rates include the driver's stay and meals",
          "Fuel and tolls are quoted separately",
          "The itinerary is flexible, so you can add stops or extra nights",
          "The same car and driver stay with you for the whole trip",
        ],
      },
    ],
    faqs: [
      { q: "Can I do Hunza as a short weekend trip from Islamabad?", a: "It is not practical. The drive alone takes two long days each way, so a weekend would be spent almost entirely on the road. Five to seven days is a much better plan." },
      { q: "Is it safe to travel to Hunza by road?", a: "Many families and tourists make the trip every season. Travel in the open months, check road and weather conditions before leaving, and use a driver who knows the mountain roads." },
      { q: "Can we visit Attabad Lake and Passu on the same trip?", a: "Yes. They are in the upper Hunza valley and can be added as day trips from Karimabad. Tell us your list when you ask for a quote." },
      { q: "Can I start my Hunza trip from Lahore or Peshawar instead?", a: "Yes. We pick up from any city we serve, and the quote reflects the longer or shorter distance. Send us your starting city on WhatsApp." },
    ],
    related: {
      cars: ["toyota-prado", "toyota-fortuner", "toyota-hiace"],
      locations: ["islamabad", "abbottabad"],
      services: ["tour-packages", "car-rental-with-driver"],
    },
  },
  {
    slug: "islamabad-to-lahore-by-car-with-driver",
    title: "Islamabad to Lahore by car with driver",
    h1: "Islamabad to Lahore by car with driver: travel time, motorway, tolls and best car",
    metaTitle: "Islamabad to Lahore by Car with Driver: Time & Tolls",
    metaDescription: "How long Islamabad to Lahore takes on the M-2 motorway, how tolls and fuel are handled, and which car to hire with a driver for the trip. Fixed quotes from SLC.",
    published: "2026-11-18",
    updated: "2026-11-18",
    image: "/images/cities/lahore.webp",
    answer: "Islamabad to Lahore by car takes about 4.5 to 5 hours on the M-2 motorway, depending on traffic, weather and stops. With a driver, you are picked up at your door and dropped at your Lahore address. A Toyota Corolla suits most travellers; for larger groups with luggage, choose an SUV. Fuel and tolls are quoted separately.",
    sections: [
      {
        heading: "How long does the drive take?",
        paragraphs: [
          "The usual range is 4.5 to 5 hours from Islamabad or Rawalpindi to Lahore on the M-2 motorway. Add time for prayer and meal stops, for fog in winter, and for the city traffic at either end, since reaching a Lahore address in Gulberg or DHA can take a further 30 to 45 minutes after leaving the motorway.",
        ],
        bullets: [
          "Islamabad to Lahore (M-2): 4.5–5 hr",
          "Islamabad International Airport to Lahore: allow 5–5.5 hr including the drive out of the airport",
          "Lahore to Islamabad (M-2): 4.5–5 hr",
          "Allama Iqbal Airport to Gulberg: 25–35 min",
        ],
      },
      {
        heading: "Which route and what about tolls?",
        paragraphs: [
          "Almost everyone takes the M-2 motorway, a controlled-access road with service areas along the way for fuel, food and prayer. It is the fastest and most comfortable way to drive between the two cities.",
          "The M-2 is a tolled road, and toll rates change from time to time. We do not publish a fixed toll figure here: your SLC quote lists tolls separately, and it is worth checking current rates and any road closures before you travel.",
        ],
      },
      {
        heading: "Which car should you choose?",
        paragraphs: [
          "For one to four people, a Toyota Corolla is the usual choice: a quiet motorway ride and a boot that takes airport luggage. If the trip is a business one, the Honda Civic is a sharper option. For five to seven people, or a family with a lot of luggage, a Toyota Fortuner gives more space on a five-hour drive.",
        ],
      },
      {
        heading: "How booking with a driver works",
        paragraphs: [
          "Send your pickup address, your Lahore drop address, travel date and the number of passengers on WhatsApp. We reply with a fixed quote, and you confirm once you are happy with it. Prices for this route are not listed on the website, so they are quoted on WhatsApp.",
        ],
        bullets: [
          "Ask for a one-way or a return quote; both are available",
          "Outstation rates include the driver's stay and meals",
          "Fuel and tolls are quoted separately",
          "Airport pickups are timed to your flight, so you can go straight from arrivals to Lahore",
        ],
      },
    ],
    faqs: [
      { q: "Can I go to Lahore and back in one day?", a: "It is possible, but the drive alone is roughly 9 to 10 hours for the round trip. Most people prefer to stay at least one night. Tell us your schedule and we will advise on timings." },
      { q: "Is the M-2 affected by fog in winter?", a: "Dense fog in the winter months can slow traffic or lead to closures on the motorway. Allow extra time, avoid very early starts on foggy days, and check conditions before you leave." },
      { q: "Can I go straight from the airport to Lahore?", a: "Yes. Book an airport-to-destination transfer and the same driver takes you the whole way." },
      { q: "Can I drive myself to Lahore in a rental car?", a: "Self-drive cars can be taken to another city with prior approval. Tell us your route when booking so it is included in the quote." },
    ],
    related: {
      cars: ["toyota-corolla", "honda-civic", "toyota-fortuner"],
      locations: ["islamabad", "lahore", "islamabad-airport"],
      services: ["car-rental-with-driver", "airport-transfer"],
    },
  },
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

/**
 * Guides whose `related` list names this car, location or service. Those pages
 * link back to them, so each new guide gets internal links as soon as it is
 * published.
 */
export const guidesFor = (kind: keyof Guide["related"], slug: string) =>
  guides.filter((g) => g.related[kind].includes(slug));
