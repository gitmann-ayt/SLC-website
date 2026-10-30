/**
 * About page content: CEO profile, company story, fleet standards.
 * The CEO appears on the About page only.
 *
 * Bio approved by SLC. While `isPlaceholder` is true the About page shows a
 * reminder banner and no Person schema is emitted.
 */

export const about = {
  isPlaceholder: false,

  ceo: {
    name: "Raja Qasim",
    role: "Founder & Chief Executive Officer",
    photo: "/images/team/ceo.jpg",
    photoWidth: 720,
    photoHeight: 1280,
    bio: [
      "As the founder and CEO of SLC Car Rental, he has built the company around a simple idea: renting a car in Pakistan should be as dependable as the people who book it. He still oversees the fleet personally, from the cars SLC buys to the standard each one must meet before it is handed over.",
      "Under his leadership SLC has grown from a handful of cars into a fleet that covers every everyday need, from the Suzuki Alto and Honda City to the Toyota Prado, Hiace and Mercedes S-Class, and from one city to all of Pakistan, serving families, businesses, embassies and wedding parties.",
      "He is closely involved in hiring and training SLC's drivers, and insists on fixed, upfront quotes so customers never meet a surprise at the end of a rental. Many of the company's corporate accounts still deal with him directly.",
    ],
    quote: "Our customers trust us with their families, their guests and their most important days. Every car we hand over has to be worthy of that trust.",
    focus: ["Fleet quality and safety", "Driver hiring and training", "Corporate partnerships", "Fixed, transparent pricing"],
  },

  company: {
    foundedYear: 2013,
    intro: "SLC Car Rental is a Pakistani car rental company offering self-drive cars and cars with professional drivers across Pakistan, from Islamabad and Lahore to Karachi and Peshawar.",
    story: [
      "SLC began with a small group of cars and a promise that still guides the company: clean cars, courteous service and a price agreed before the rental starts. Word spread through families, offices and wedding parties, and the fleet grew with them.",
      "Today SLC runs hatchbacks, sedans, SUVs, luxury cars, vans and Coasters across Pakistan, from Islamabad and Rawalpindi to Lahore, Karachi and Peshawar. Customers book us for self drive, chauffeur-driven hire, airport transfers, corporate contracts, weddings and tours to the northern areas.",
      "Whatever the booking, the approach is the same: the right car for the trip, honest advice, and a team that answers on WhatsApp day and night.",
    ],
    standards: [
      { title: "Inspected before every rental", body: "Tyres, brakes, lights, air conditioning and fluids are checked before each handover, not once a month." },
      { title: "Cleaned inside and out", body: "Every car is washed, vacuumed and sanitised between customers." },
      { title: "Recent models", body: "We keep the fleet young and retire cars before they become unreliable." },
      { title: "Documents in order", body: "Registration, tax and insurance papers are current and kept in every car." },
    ],
    commitments: [
      { title: "Fixed, upfront prices", body: "You see the full quote before you confirm. No hidden charges at the end." },
      { title: "Self drive or with driver", body: "Choose the freedom of driving yourself or the comfort of a professional driver." },
      { title: "Drivers you can trust", body: "Every driver is verified, trained in courteous service and experienced on highways and mountain roads." },
      { title: "Always reachable", body: "Bookings, changes and roadside help on WhatsApp or by phone, 24/7." },
    ],
    clients: ["Families and overseas Pakistanis", "Corporate offices and NGOs", "Embassies and protocol teams", "Wedding and event planners", "Tourists heading north"],
  },
};

export const yearsInBusiness = () => new Date().getFullYear() - about.company.foundedYear;
