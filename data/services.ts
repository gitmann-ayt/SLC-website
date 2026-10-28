/** Service pages (/services/<slug>/). Each one has its own copy and FAQs. */

export type Service = {
  slug: string;
  title: string;
  h1: string;
  metaDescription: string;
  image: string;
  intro: string[];
  includes: string[];
  idealFor: string[];
  faqs: { q: string; a: string }[];
  carSlugs: string[];
};

export const servicePages: Service[] = [
  {
    slug: "self-drive-car-rental",
    title: "Self Drive Car Rental",
    h1: "Self drive car rental in Pakistan",
    metaDescription: "Self drive car rental in Islamabad, Lahore, Karachi and across Pakistan. Hatchbacks, sedans and SUVs with clear deposit and fuel rules. Book on WhatsApp with SLC Car Rental.",
    image: "/images/cars/suzuki-swift.webp",
    intro: [
      "Sometimes you just want the keys. SLC self-drive rentals give you the freedom to go where you like, when you like, in a clean, checked car, from an economical Suzuki Alto to a Kia Sportage or Toyota Fortuner.",
      "Booking is simple: choose a car, send your dates, and bring your CNIC and driving licence at handover. A refundable security deposit is taken and returned when the car comes back in the same condition. We can deliver the car to your home, office or hotel.",
    ],
    includes: ["Clean, inspected car with a full walkaround at handover", "Delivery and collection at your address on request", "Clear fuel policy: return at the same level", "Roadside help by phone, day and night", "Daily, weekly and monthly self-drive rates"],
    idealFor: ["Visitors who prefer to drive themselves", "Families on holiday", "Business travellers on flexible schedules", "Long weekends and road trips"],
    faqs: [
      { q: "What documents do I need for self drive?", a: "A valid CNIC (or passport for foreign nationals), a valid driving licence and the refundable security deposit." },
      { q: "Is there a mileage limit on self-drive rentals?", a: "Each booking includes a daily distance allowance. Extra distance is charged per km, as stated in your quote." },
      { q: "Can I take a self-drive car to another city?", a: "Yes, with prior approval. Tell us your route when booking so we can include it in the quote." },
    ],
    carSlugs: ["suzuki-alto", "toyota-corolla", "kia-sportage"],
  },
  {
    slug: "car-rental-with-driver",
    title: "Car Rental with Driver",
    h1: "Car rental with driver in Pakistan",
    metaDescription: "Chauffeur-driven car rental in Islamabad, Rawalpindi, Lahore, Karachi and across Pakistan by the hour, day or month. Trained drivers, clean cars, fixed quotes from SLC.",
    image: "/images/cars/toyota-prado.webp",
    intro: [
      "Prefer to sit back? Every SLC car can be booked with a trained, verified driver who knows the city and the main highways. You get door-to-door travel without traffic, parking or fuel stops to worry about.",
      "Book for a few hours, a full day, a week or a month. Our drivers are courteous, smartly dressed and experienced on motorways and mountain roads alike.",
    ],
    includes: ["Verified, experienced driver", "Car cleaned and inspected before every trip", "City fuel up to the daily limit", "Driver's meals and stay on outstation trips", "WhatsApp contact with our team throughout"],
    idealFor: ["Hospital and family visits", "Business meetings across the city", "Visitors new to the city", "Anyone who prefers not to drive"],
    faqs: [
      { q: "How long is a day booking with driver?", a: "A standard day is 10 hours within the city. Extra hours are billed at a set hourly rate." },
      { q: "Can I keep the same driver on repeat bookings?", a: "On repeat and monthly bookings we try to keep the same driver for you." },
    ],
    carSlugs: ["toyota-corolla", "honda-civic", "toyota-prado"],
  },
  {
    slug: "airport-transfer",
    title: "Airport Transfers",
    h1: "Airport pickup and drop with driver",
    metaDescription: "Airport pickup and drop at Islamabad, Lahore, Karachi, Peshawar, Multan, Faisalabad and Sialkot airports. Flight tracking, meet and greet, 24/7 service. Fixed fares from SLC.",
    image: "/images/cities/airport.webp",
    intro: [
      "Landing after a long flight is the worst time to bargain for a ride. With an SLC airport transfer, your car and driver are booked before you take off. We track the flight, adjust for delays, and the driver meets you in arrivals with a name board.",
      "We cover Islamabad, Lahore, Karachi, Peshawar, Multan, Faisalabad and Sialkot airports, with onward trips to any city. Departures work the same way in reverse: the driver arrives at your door with time to spare.",
    ],
    includes: ["Flight tracking and free waiting for normal delays", "Meet and greet with a name board", "Luggage help at both ends", "Fixed fare quoted before booking", "Service 24 hours a day, 7 days a week"],
    idealFor: ["Overseas Pakistanis visiting family", "Business travellers and delegations", "Late-night and early-morning flights", "Families with heavy luggage"],
    faqs: [
      { q: "How early should I book an airport pickup?", a: "Any time before your flight, but booking at least 12 hours ahead guarantees your preferred car." },
      { q: "Is there a charge if my flight is late?", a: "No. We track the flight and adjust the pickup at no extra cost for normal delays." },
      { q: "Which car fits four suitcases?", a: "A Sportage, Corolla Cross, Fortuner or Prado. For bigger groups, choose a Hiace." },
    ],
    carSlugs: ["toyota-corolla", "kia-sportage", "toyota-hiace"],
  },
  {
    slug: "corporate-car-rental",
    title: "Corporate Car Rental",
    h1: "Corporate car rental and contracts",
    metaDescription: "Corporate car rental across Pakistan: monthly staff cars, delegations, roadshows and executive transport, self drive or with drivers. One monthly invoice from SLC Car Rental.",
    image: "/images/cars/mercedes-benz-e-class.webp",
    intro: [
      "Companies, NGOs and embassies use SLC to move staff and guests without running their own fleet. We supply cars, vans and drivers on daily, weekly, monthly and annual contracts, from a single sedan for a manager to a convoy of SUVs for a visiting delegation.",
      "You get one point of contact, one monthly invoice, and a replacement car if a vehicle needs servicing. Contracts can cover several cities at once.",
    ],
    includes: ["Daily, weekly, monthly and annual contracts", "One consolidated monthly invoice", "Replacement car during servicing", "Dedicated account contact", "Multi-city and multi-car bookings"],
    idealFor: ["Head offices and branch networks", "NGOs and development projects", "Embassy and protocol visits", "Conferences and roadshows"],
    faqs: [
      { q: "Do you sign written contracts with companies?", a: "Yes. We offer written monthly and annual agreements with fixed rates." },
      { q: "Can one contract cover several cities?", a: "Yes. Cars can be placed in any of the cities we serve under one agreement." },
    ],
    carSlugs: ["toyota-corolla-cross", "mercedes-benz-e-class", "toyota-coaster"],
  },
  {
    slug: "monthly-car-rental",
    title: "Monthly Car Rental",
    h1: "Monthly car rental in Pakistan",
    metaDescription: "Monthly car rental, self drive or with driver, in Islamabad, Lahore, Karachi and more. Lower daily rates for commutes, families and businesses. See monthly prices for every car.",
    image: "/images/cars/honda-city.webp",
    intro: [
      "A monthly SLC car gives you a car for the office run, school pickups and family errands, without buying a car or paying for maintenance. Choose self drive, or add a driver for a fully managed service.",
      "Monthly rates work out much cheaper per day than daily hire, and every car page lists its monthly price. Servicing and maintenance are our job, and if the car needs a workshop visit we send a replacement.",
    ],
    includes: ["Fixed monthly price per car", "Self drive or with driver", "Servicing and maintenance covered", "Replacement car during repairs", "Flexible working hours by agreement"],
    idealFor: ["Office commuters", "Families new to a city", "Expats on short postings", "Small businesses"],
    faqs: [
      { q: "What hours does a monthly booking with driver cover?", a: "Usually 10 hours a day, six days a week. Other schedules can be agreed." },
      { q: "Is fuel included in the monthly price?", a: "For self drive, you pay for your own fuel. With driver, city fuel up to an agreed monthly distance is included." },
    ],
    carSlugs: ["suzuki-cultus", "honda-city", "toyota-corolla-cross"],
  },
  {
    slug: "wedding-car-rental",
    title: "Wedding Car Rental",
    h1: "Wedding car rental",
    metaDescription: "Wedding car rental in Islamabad, Lahore, Karachi and across Pakistan: decorated Mercedes and Audi for the couple, plus sedans, vans and Coasters for guests. Drivers included.",
    image: "/images/cars/mercedes-benz-s-class.webp",
    intro: [
      "The car for the barat arrival is in half the wedding photos. SLC supplies the Mercedes S-Class, E-Class and Audi A6 for the couple, decorated to your colours, with a driver in formal dress.",
      "We also handle the rest of the wedding transport: SUVs for close family, sedans, Hiace vans and Coasters for guests, and airport pickups for relatives flying in. One coordinator keeps every car on schedule across mehndi, barat and walima.",
    ],
    includes: ["Decorated car for the couple", "Formally dressed, experienced driver", "Guest cars, vans and Coasters", "One coordinator on the day", "Airport pickups for wedding guests"],
    idealFor: ["Barat, mehndi and walima", "Nikah ceremonies", "Wedding photo shoots", "Guest transport between venues"],
    faqs: [
      { q: "How far ahead should I book a wedding car?", a: "In wedding season, two to four weeks ahead to secure the S-Class or E-Class." },
      { q: "Do you decorate the car?", a: "Yes. Floral decoration can be arranged in your colours for an extra charge." },
    ],
    carSlugs: ["mercedes-benz-s-class", "mercedes-benz-e-class", "audi-a6"],
  },
  {
    slug: "tour-packages",
    title: "Northern Area Tours",
    h1: "Car rental for northern Pakistan tours",
    metaDescription: "Rent a car with driver for Murree, Naran, Kaghan, Swat, Hunza and Skardu tours. SUVs, sedans and Hiace vans with drivers experienced on mountain roads. Fixed quotes from SLC.",
    image: "/images/cities/hunza.webp",
    intro: [
      "The roads to Naran, Swat, Hunza and Skardu are beautiful and demanding. Our tour drivers have driven them for years and know where to stop, where to refuel and when to wait for the weather.",
      "We supply SUVs for mountain trips, Hiace vans for groups, and sedans for easier routes like Murree and Abbottabad. Quotes include the driver's stay and meals; fuel and tolls are listed separately.",
    ],
    includes: ["Drivers experienced on mountain roads", "SUVs and vans suited to northern routes", "Driver's stay and meals included", "Flexible itinerary", "Pickup from any city we serve"],
    idealFor: ["Family holidays", "Honeymoon trips", "Group tours", "Photography trips"],
    faqs: [
      { q: "Which car is best for Hunza or Skardu?", a: "An SUV such as the Prado or Fortuner for comfort and ground clearance, or a Hiace for groups." },
      { q: "How many days should I book for Hunza?", a: "Five to seven days from Islamabad lets you travel at a comfortable pace." },
    ],
    carSlugs: ["toyota-prado", "toyota-fortuner", "toyota-hiace"],
  },
];

export const serviceBySlug = (slug: string) => servicePages.find((s) => s.slug === slug);
