/**
 * The fleet. Car pages (/cars/<slug>/), the fleet filter, the quote form and
 * the sitemap all read from this array, so adding a car here adds its page
 * everywhere.
 *
 * Daily prices follow the price list. PLACEHOLDER: weekly, monthly and
 * outstation rates (see rate()) and model years are estimates. Set real ones.
 * Photos are licensed images of each model (credits in data/credits.ts),
 * cut out with a transparent background. Swap in photos of your own cars when
 * you have them (1600×1000, transparent or plain background).
 */

export type CategorySlug = "hatchback" | "sedan" | "suv" | "luxury" | "van";

export type Car = {
  slug: string;
  /** Display name when it isn't simply "make model" (e.g. "Mercedes S400") */
  name?: string;
  make: string;
  model: string;
  /** file name in /public/images/brands (without .svg) */
  logo: string;
  year: number;
  category: CategorySlug;
  badge?: string;
  seats: number;
  luggage: number;
  transmission: "Automatic" | "Manual";
  fuel: "Petrol" | "Diesel" | "Hybrid";
  /** PKR per day for self drive, or null if the car is only rented with a driver */
  priceSelfDrive: number | null;
  /** PKR per day with driver, city use */
  priceDay: number;
  priceWeek: number;
  priceMonth: number;
  /** PKR per day with driver outside the city (driver stay included) */
  priceOutstationDay: number;
  colors: string[];
  images: string[];
  /** Unique copy for the car page. Keep each one specific to the car. */
  summary: string;
  bestFor: string[];
  featured?: boolean;
};

export const categories: { slug: CategorySlug; title: string; short: string; blurb: string }[] = [
  { slug: "hatchback", title: "Hatchbacks", short: "Hatchback", blurb: "Small, economical cars for city errands, daily commutes and tight parking." },
  { slug: "sedan", title: "Sedans", short: "Sedan", blurb: "Comfortable everyday sedans for office travel, families and motorway trips." },
  { slug: "suv", title: "SUVs & 4x4", short: "SUV", blurb: "Crossovers, SUVs and 4x4s for families, luggage and mountain roads." },
  { slug: "luxury", title: "Luxury Cars", short: "Luxury", blurb: "Mercedes and Audi sedans for weddings, VIP guests and executive travel." },
  { slug: "van", title: "Vans & Coasters", short: "Van", blurb: "Hiace vans and Coaster buses for groups, events and staff transport." },
];

const img = (slug: string) => [`/images/cars/${slug}.webp`];

/**
 * Daily rate from the price list, plus placeholder weekly, monthly and
 * outstation rates worked out from it. Replace those with real rates.
 * selfDrive: whether the car can be rented without a driver (same daily rate).
 */
const rate = (day: number, selfDrive: boolean) => ({
  priceDay: day,
  priceSelfDrive: selfDrive ? day : null,
  priceWeek: day * 6,
  priceMonth: day * 24,
  priceOutstationDay: Math.round((day * 1.25) / 500) * 500,
});

const WB = ["White", "Black"];

export const cars: Car[] = [
  /* ---------- Hatchbacks ---------- */
  {
    slug: "suzuki-alto", make: "Suzuki", model: "Alto", logo: "suzuki", year: 2024, category: "hatchback",
    seats: 4, luggage: 1, transmission: "Manual", fuel: "Petrol", ...rate(4000, true),
    colors: ["White"], images: img("suzuki-alto"),
    summary: "The Alto is Pakistan's favourite small car and our most affordable rental. Its 660cc engine sips fuel, it slips into parking spots other cars can't, and it is easy for new drivers to handle in city traffic.",
    bestFor: ["Daily city errands", "Students and first-time renters", "Lowest fuel cost"], featured: true,
  },
  {
    slug: "suzuki-wagon-r", make: "Suzuki", model: "Wagon R", logo: "suzuki", year: 2022, category: "hatchback",
    seats: 4, luggage: 2, transmission: "Automatic", fuel: "Petrol", ...rate(5000, true),
    colors: WB, images: img("suzuki-wagon-r"),
    summary: "The Wagon R's tall body gives more headroom and boot space than its size suggests. Families like it for school runs and shopping, and it is a dependable, low-cost car for monthly use.",
    bestFor: ["School and shopping runs", "Monthly budget rental", "Tall passengers"],
  },

  /* ---------- Sedans ---------- */
  {
    slug: "toyota-yaris", make: "Toyota", model: "Yaris", logo: "toyota", year: 2024, category: "sedan",
    seats: 5, luggage: 2, transmission: "Automatic", fuel: "Petrol", ...rate(6000, true),
    colors: WB, images: img("toyota-yaris"),
    summary: "The Yaris sedan brings Toyota reliability at an entry-level price. Its boot fits airport luggage easily, and its fuel economy makes it a favourite for ride-heavy monthly rentals.",
    bestFor: ["Airport runs", "Monthly office car", "Budget sedan comfort"],
  },
  {
    slug: "honda-city", make: "Honda", model: "City", logo: "honda", year: 2024, category: "sedan",
    seats: 5, luggage: 2, transmission: "Automatic", fuel: "Petrol", ...rate(6000, true),
    colors: WB, images: img("honda-city"),
    summary: "The Honda City is roomy in the back, smooth on bad roads and cheap to run. Families book it for weddings and visits, and companies use it as a staff car across the cities we serve.",
    bestFor: ["Family visits", "Staff transport", "Comfortable rear seats"], featured: true,
  },
  {
    slug: "toyota-corolla", make: "Toyota", model: "Corolla", logo: "toyota", year: 2024, category: "sedan", badge: "Popular",
    seats: 5, luggage: 2, transmission: "Automatic", fuel: "Petrol", ...rate(6000, true),
    colors: WB, images: img("toyota-corolla"),
    summary: "The Corolla is the car most of our customers ask for by name. It is dependable on the motorway, quiet in town and has a large boot, which makes it the default choice for business trips and family travel alike.",
    bestFor: ["Business travel", "Motorway trips between cities", "Everyday reliability"], featured: true,
  },
  {
    slug: "toyota-corolla-grande", make: "Toyota", model: "Corolla Grande", logo: "toyota", year: 2024, category: "sedan", badge: "Grande",
    seats: 5, luggage: 2, transmission: "Automatic", fuel: "Petrol", ...rate(7000, true),
    colors: WB, images: img("toyota-corolla"),
    summary: "The Grande is the top Corolla trim, with a 1.8 litre engine, leather seats, a sunroof and more cabin tech. It suits customers who want Corolla reliability with a more premium feel for business days and family functions.",
    bestFor: ["Premium everyday sedan", "Business days", "Family functions"],
  },
  {
    slug: "honda-civic", name: "Honda Civic 2022", make: "Honda", model: "Civic 2022", logo: "honda", year: 2022, category: "sedan",
    seats: 5, luggage: 2, transmission: "Automatic", fuel: "Petrol", ...rate(7000, true),
    colors: WB, images: img("honda-civic"),
    summary: "The Civic sits between everyday sedans and luxury cars. Customers choose it for client meetings, interviews and family functions where they want a sharper car without the cost of a Mercedes.",
    bestFor: ["Client meetings", "Family functions", "Comfortable motorway runs"], featured: true,
  },
  {
    slug: "honda-civic-2025", name: "Honda Civic 2025", make: "Honda", model: "Civic 2025", logo: "honda", year: 2025, category: "sedan", badge: "New",
    seats: 5, luggage: 2, transmission: "Automatic", fuel: "Petrol", ...rate(10000, true),
    colors: WB, images: img("honda-civic"),
    summary: "The newest Civic in the fleet, with the latest cabin screens, driver-assist features and a refined, quiet ride. Book it when the car itself is part of the impression: launches, interviews and wedding guests.",
    bestFor: ["Newest sedan in the fleet", "Important meetings", "Wedding guests"], featured: true,
  },
  {
    slug: "hyundai-elantra", make: "Hyundai", model: "Elantra", logo: "hyundai", year: 2023, category: "sedan",
    seats: 5, luggage: 2, transmission: "Automatic", fuel: "Petrol", ...rate(10000, true),
    colors: WB, images: img("hyundai-elantra"),
    summary: "The Elantra's bold styling and quiet, well-equipped cabin make it stand out at events and office entrances. It is a smooth highway cruiser for long business trips.",
    bestFor: ["Executive day hire", "Long business trips", "Stylish arrivals"],
  },

  /* ---------- SUVs & 4x4 ---------- */
  {
    slug: "honda-br-v", make: "Honda", model: "BR-V", logo: "honda", year: 2023, category: "suv",
    seats: 7, luggage: 2, transmission: "Automatic", fuel: "Petrol", ...rate(7000, true),
    colors: WB, images: img("honda-br-v"),
    summary: "The BR-V is the budget answer for seven passengers. It fits a family with grandparents into one car for a wedding day or a day trip, and stays easy to park in busy markets.",
    bestFor: ["Large families", "Wedding guest shuttles", "Seven seats on a budget"],
  },
  {
    slug: "toyota-revo", name: "Toyota Revo", make: "Toyota", model: "Hilux Revo", logo: "toyota", year: 2023, category: "suv",
    seats: 5, luggage: 4, transmission: "Automatic", fuel: "Diesel", ...rate(12000, true),
    colors: WB, images: img("toyota-revo"),
    summary: "The Revo is the pick-up for jobs that carry equipment as well as people: film shoots, event setups and camping trips up north. Four-wheel drive and a diesel engine make it the toughest car in the fleet.",
    bestFor: ["Event and film crews", "Camping and adventure trips", "Rough or unpaved roads"],
  },
  {
    slug: "toyota-prado", name: "Toyota Prado", make: "Toyota", model: "Land Cruiser Prado", logo: "toyota", year: 2022, category: "suv", badge: "Signature",
    seats: 7, luggage: 3, transmission: "Automatic", fuel: "Diesel", ...rate(15000, false),
    colors: WB, images: img("toyota-prado"),
    summary: "The Prado is our most-booked executive SUV. Seven seats suit a family or small delegation, and it handles the climb to Murree, Naran and Skardu without strain. Rented with a driver.",
    bestFor: ["Family trips up north", "Small delegations", "Executive travel"], featured: true,
  },
  {
    slug: "toyota-fortuner", make: "Toyota", model: "Fortuner", logo: "toyota", year: 2023, category: "suv",
    seats: 7, luggage: 3, transmission: "Automatic", fuel: "Diesel", ...rate(14000, true),
    colors: WB, images: img("toyota-fortuner"),
    summary: "The Fortuner gives seven-seat SUV space and real ground clearance for less than a Prado. Corporate clients book it for site visits, and families pick it for northern trips with plenty of luggage.",
    bestFor: ["Site visits and field work", "Groups of five to seven", "Northern area trips"],
  },
  {
    slug: "kia-sportage", make: "Kia", model: "Sportage", logo: "kia", year: 2024, category: "suv", badge: "Popular",
    seats: 5, luggage: 3, transmission: "Automatic", fuel: "Petrol", ...rate(15000, true),
    colors: WB, images: img("kia-sportage"),
    summary: "The Sportage is one of the most-requested SUVs in Pakistan: comfortable, well equipped and confident on both city roads and the Murree hills. It has room for a family and their airport luggage.",
    bestFor: ["Family road trips", "Airport runs with luggage", "Comfortable SUV for self drive"], featured: true,
  },
  {
    slug: "hyundai-tucson", make: "Hyundai", model: "Tucson", logo: "hyundai", year: 2024, category: "suv",
    seats: 5, luggage: 3, transmission: "Automatic", fuel: "Petrol", ...rate(15000, true),
    colors: WB, images: img("hyundai-tucson"),
    summary: "The Tucson's striking design and spacious cabin suit customers who want a modern SUV for business or leisure. The all-wheel-drive version handles hill roads in poor weather with ease.",
    bestFor: ["Business and leisure", "Hill stations", "Modern tech and comfort"],
  },

  /* ---------- Luxury ---------- */
  {
    slug: "mercedes-s400", name: "Mercedes S400", make: "Mercedes-Benz", model: "S400", logo: "mercedes-benz", year: 2019, category: "luxury",
    seats: 5, luggage: 2, transmission: "Automatic", fuel: "Petrol", ...rate(110000, false),
    colors: WB, images: img("mercedes-benz-s-class"),
    summary: "The S400 gives you S-Class comfort for barats, visiting executives and formal events: a whisper-quiet cabin, reclining rear seats and the presence only a Mercedes flagship has. Always chauffeur driven.",
    bestFor: ["Barat and wedding arrivals", "Visiting executives", "Formal events"],
  },
  {
    slug: "mercedes-benz-s-class", name: "Mercedes S500", make: "Mercedes-Benz", model: "S500", logo: "mercedes-benz", year: 2019, category: "luxury", badge: "VIP",
    seats: 5, luggage: 2, transmission: "Automatic", fuel: "Petrol", ...rate(110000, false),
    colors: WB, images: img("mercedes-benz-s-class"),
    summary: "The S500 is the top of the fleet: a chauffeur-only flagship for barats, visiting chairmen and once-in-a-lifetime arrivals. The rear seat is where the comfort is, so it always comes with our most experienced drivers.",
    bestFor: ["VIP and protocol travel", "Visiting chairmen", "Red-carpet events"], featured: true,
  },
  {
    slug: "mercedes-benz-e-class", name: "Mercedes E250", make: "Mercedes-Benz", model: "E250", logo: "mercedes-benz", year: 2020, category: "luxury",
    seats: 5, luggage: 2, transmission: "Automatic", fuel: "Petrol", ...rate(75000, false),
    colors: WB, images: img("mercedes-benz-e-class"),
    summary: "The E250 brings Mercedes comfort at a lower price than the S-Class. It is popular for corporate roadshows, mehndi and walima events, and executives moving between back-to-back meetings.",
    bestFor: ["Corporate roadshows", "Mehndi and walima", "Executive day hire"],
  },
  {
    slug: "mercedes-benz-c-class", name: "Mercedes C180", make: "Mercedes-Benz", model: "C180", logo: "mercedes-benz", year: 2021, category: "luxury",
    seats: 5, luggage: 2, transmission: "Automatic", fuel: "Petrol", ...rate(60000, false),
    colors: WB, images: img("mercedes-benz-c-class"),
    summary: "The C180 is the most affordable way into a Mercedes. It is a favourite for engagement and nikah days, airport pickups for family visiting from abroad, and anyone who wants the three-pointed star at a sensible price.",
    bestFor: ["Engagement and nikah days", "Airport pickups for guests", "Entry-level luxury"],
  },
  {
    slug: "audi-a6", make: "Audi", model: "A6", logo: "audi", year: 2021, category: "luxury",
    seats: 5, luggage: 2, transmission: "Automatic", fuel: "Petrol", ...rate(55000, false),
    colors: WB, images: img("audi-a6"),
    summary: "The Audi A6 suits customers who want understated luxury: a clean, modern cabin, a smooth ride and a car that looks the part at a hotel entrance without drawing a crowd.",
    bestFor: ["Hotel and embassy pickups", "Product launches", "Photo shoots"],
  },
  {
    slug: "audi-a5", make: "Audi", model: "A5", logo: "audi", year: 2021, category: "luxury",
    seats: 5, luggage: 2, transmission: "Automatic", fuel: "Petrol", ...rate(45000, false),
    colors: WB, images: img("audi-a5"),
    summary: "The A5 Sportback has a sleek coupe roofline with four doors and a practical hatch. It is the stylish choice for wedding photos, brand shoots and evening events where the car should look as good as the guests.",
    bestFor: ["Wedding and brand shoots", "Evening events", "Stylish arrivals"],
  },
  {
    slug: "audi-a4", make: "Audi", model: "A4", logo: "audi", year: 2021, category: "luxury",
    seats: 5, luggage: 2, transmission: "Automatic", fuel: "Petrol", ...rate(35000, false),
    colors: WB, images: img("audi-a4"),
    summary: "The A4 is our entry luxury sedan: German build quality, a calm cabin and a smooth ride for long days of meetings. A smart step up from a Civic for corporate guests and family occasions.",
    bestFor: ["Corporate guests", "Family occasions", "Entry-level luxury"],
  },
  {
    slug: "lexus-lx-570", name: "Lexus LX 570", make: "Lexus", model: "LX 570", logo: "lexus", year: 2020, category: "suv", badge: "Luxury",
    seats: 7, luggage: 4, transmission: "Automatic", fuel: "Petrol", ...rate(150000, false),
    colors: WB, images: img("lexus-lx-570"),
    summary: "The LX 570 is the most luxurious SUV we offer: a V8, a hand-finished cabin and the go-anywhere ability of a Land Cruiser underneath. It is booked for VIP protocol, high-profile guests and grand wedding arrivals. Rented with a driver.",
    bestFor: ["VIP and protocol travel", "High-profile guests", "Grand wedding arrivals"], featured: true,
  },
  {
    slug: "toyota-land-cruiser", name: "Toyota Land Cruiser V8", make: "Toyota", model: "Land Cruiser V8", logo: "toyota", year: 2022, category: "suv", badge: "Executive",
    seats: 7, luggage: 4, transmission: "Automatic", fuel: "Petrol", ...rate(25000, false),
    colors: WB, images: img("toyota-land-cruiser"),
    summary: "The Land Cruiser is the car we send when the guest matters most. It has the presence protocol teams expect for government, embassy and corporate visits, and the capability for any road in the north.",
    bestFor: ["Diplomatic and VIP protocol", "Security-conscious travel", "Any terrain"], featured: true,
  },

  /* ---------- Vans & coasters ---------- */
  {
    slug: "toyota-hiace", name: "Grand Cabin", make: "Toyota", model: "Hiace Grand Cabin", logo: "toyota", year: 2022, category: "van",
    seats: 13, luggage: 6, transmission: "Manual", fuel: "Diesel", ...rate(15000, false),
    colors: ["White", "Grey"], images: img("toyota-hiace"),
    summary: "The Hiace Grand Cabin carries a whole family or team in one vehicle, with air conditioning and luggage space for a week away. It is the standard choice for group tours, wedding guests and staff pick-and-drop.",
    bestFor: ["Group tours up north", "Wedding guest transport", "Staff pick and drop"],
  },
  {
    slug: "toyota-coaster", name: "Coaster (4C)", make: "Toyota", model: "Coaster 4C", logo: "toyota", year: 2021, category: "van",
    seats: 22, luggage: 8, transmission: "Manual", fuel: "Diesel", ...rate(18000, false),
    colors: ["White", "Grey"], images: img("toyota-coaster"),
    summary: "The 22-seat Coaster moves mid-sized groups comfortably: corporate offsites, school trips and wedding parties. One bus, one driver and everyone arrives together.",
    bestFor: ["Corporate offsites", "School and university trips", "Wedding parties"],
  },
  {
    slug: "toyota-coaster-5c", name: "Coaster (5C)", make: "Toyota", model: "Coaster 5C", logo: "toyota", year: 2021, category: "van",
    seats: 28, luggage: 10, transmission: "Manual", fuel: "Diesel", ...rate(22000, false),
    colors: ["White", "Grey"], images: img("toyota-coaster"),
    summary: "The longer 28-seat Coaster is for big groups: conference delegates, large barats and tour parties heading north. More seats and more luggage room in a single air-conditioned bus.",
    bestFor: ["Large barats", "Conference delegates", "Big tour groups"],
  },
];

export const carName = (c: Car) => c.name ?? `${c.make} ${c.model}`;
export const carBySlug = (slug: string) => cars.find((c) => c.slug === slug);
export const carsIn = (cat: CategorySlug) => cars.filter((c) => c.category === cat);
export const categoryOf = (c: Car) => categories.find((k) => k.slug === c.category)!;
/** Lowest daily price the car can be rented for. */
export const fromPrice = (c: Car) => Math.min(c.priceDay, c.priceSelfDrive ?? Infinity);
export const logoSrc = (logo: string) => `/images/brands/${logo}.svg`;
