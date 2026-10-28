/**
 * The fleet. Car pages (/cars/<slug>/), the fleet filter, the quote form and
 * the sitemap all read from this array, so adding a car here adds its page
 * everywhere.
 *
 * PLACEHOLDER: prices and model years are starting values. Set your real ones.
 * Photos are licensed images of each model (credits in data/credits.ts),
 * cut out with a transparent background. Swap in photos of your own cars when
 * you have them (1600×1000, transparent or plain background).
 */

export type CategorySlug = "hatchback" | "sedan" | "suv" | "luxury" | "van";

export type Car = {
  slug: string;
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

export const cars: Car[] = [
  /* ---------- Hatchbacks ---------- */
  {
    slug: "suzuki-alto", make: "Suzuki", model: "Alto", logo: "suzuki", year: 2024, category: "hatchback", badge: "Best value",
    seats: 4, luggage: 1, transmission: "Automatic", fuel: "Petrol",
    priceSelfDrive: 4000, priceDay: 5500, priceWeek: 25000, priceMonth: 90000, priceOutstationDay: 7000,
    colors: ["White", "Silver", "Red"], images: img("suzuki-alto"),
    summary: "The Alto is Pakistan's favourite small car and our most affordable rental. Its 660cc engine sips fuel, it slips into parking spots other cars can't, and it is easy for new drivers to handle in city traffic.",
    bestFor: ["Daily city errands", "Students and first-time renters", "Lowest fuel cost"], featured: true,
  },
  {
    slug: "suzuki-wagon-r", make: "Suzuki", model: "Wagon R", logo: "suzuki", year: 2022, category: "hatchback",
    seats: 4, luggage: 2, transmission: "Manual", fuel: "Petrol",
    priceSelfDrive: 4500, priceDay: 6000, priceWeek: 28000, priceMonth: 100000, priceOutstationDay: 7500,
    colors: ["White", "Silver"], images: img("suzuki-wagon-r"),
    summary: "The Wagon R's tall body gives more headroom and boot space than its size suggests. Families like it for school runs and shopping, and it is a dependable, low-cost car for monthly use.",
    bestFor: ["School and shopping runs", "Monthly budget rental", "Tall passengers"],
  },
  {
    slug: "suzuki-cultus", make: "Suzuki", model: "Cultus", logo: "suzuki", year: 2023, category: "hatchback",
    seats: 5, luggage: 2, transmission: "Automatic", fuel: "Petrol",
    priceSelfDrive: 5000, priceDay: 6500, priceWeek: 32000, priceMonth: 115000, priceOutstationDay: 8000,
    colors: ["White", "Grey", "Blue"], images: img("suzuki-cultus"),
    summary: "The Cultus AGS is a step up from the Alto: five seats, a 1000cc engine and an automatic gearbox that makes stop-start traffic painless. A popular pick for office commuters who want a small car that still feels grown-up.",
    bestFor: ["Office commutes", "Small families", "Easy automatic driving"],
  },
  {
    slug: "suzuki-swift", make: "Suzuki", model: "Swift", logo: "suzuki", year: 2024, category: "hatchback", badge: "New",
    seats: 5, luggage: 2, transmission: "Automatic", fuel: "Petrol",
    priceSelfDrive: 6000, priceDay: 7500, priceWeek: 38000, priceMonth: 140000, priceOutstationDay: 9000,
    colors: ["White", "Red", "Grey"], images: img("suzuki-swift"),
    summary: "The new Swift is the sportiest hatchback in the fleet, with a modern cabin, touchscreen and smooth CVT. It is comfortable enough for motorway trips between cities and fun to drive on open roads.",
    bestFor: ["Young professionals", "Weekend getaways", "Intercity trips for two"],
  },

  /* ---------- Sedans ---------- */
  {
    slug: "toyota-yaris", make: "Toyota", model: "Yaris", logo: "toyota", year: 2024, category: "sedan",
    seats: 5, luggage: 2, transmission: "Automatic", fuel: "Petrol",
    priceSelfDrive: 6500, priceDay: 8000, priceWeek: 42000, priceMonth: 150000, priceOutstationDay: 9500,
    colors: ["White", "Silver", "Black"], images: img("toyota-yaris"),
    summary: "The Yaris sedan brings Toyota reliability at an entry-level price. Its boot fits airport luggage easily, and its fuel economy makes it a favourite for ride-heavy monthly rentals.",
    bestFor: ["Airport runs", "Monthly office car", "Budget sedan comfort"],
  },
  {
    slug: "honda-city", make: "Honda", model: "City", logo: "honda", year: 2024, category: "sedan",
    seats: 5, luggage: 2, transmission: "Automatic", fuel: "Petrol",
    priceSelfDrive: 7000, priceDay: 8500, priceWeek: 45000, priceMonth: 160000, priceOutstationDay: 10000,
    colors: ["White", "Grey", "Red"], images: img("honda-city"),
    summary: "The Honda City is roomy in the back, smooth on bad roads and cheap to run. Families book it for weddings and visits, and companies use it as a staff car across the cities we serve.",
    bestFor: ["Family visits", "Staff transport", "Comfortable rear seats"], featured: true,
  },
  {
    slug: "toyota-corolla", make: "Toyota", model: "Corolla Altis", logo: "toyota", year: 2024, category: "sedan", badge: "Popular",
    seats: 5, luggage: 2, transmission: "Automatic", fuel: "Petrol",
    priceSelfDrive: 7500, priceDay: 9000, priceWeek: 48000, priceMonth: 170000, priceOutstationDay: 10500,
    colors: ["White", "Black", "Grey"], images: img("toyota-corolla"),
    summary: "The Corolla is the car most of our customers ask for by name. It is dependable on the motorway, quiet in town and has a large boot, which makes it the default choice for business trips and family travel alike.",
    bestFor: ["Business travel", "Motorway trips between cities", "Everyday reliability"], featured: true,
  },
  {
    slug: "changan-alsvin", make: "Changan", model: "Alsvin", logo: "changan", year: 2024, category: "sedan",
    seats: 5, luggage: 2, transmission: "Automatic", fuel: "Petrol",
    priceSelfDrive: 6500, priceDay: 8000, priceWeek: 42000, priceMonth: 150000, priceOutstationDay: 9500,
    colors: ["White", "Grey"], images: img("changan-alsvin"),
    summary: "The Alsvin offers features you usually pay more for, including a sunroof, touchscreen and cruise control, at a budget sedan price. A good choice when you want a modern feel without the Civic bill.",
    bestFor: ["Feature-rich budget sedan", "Long drives with cruise control", "Young families"],
  },
  {
    slug: "honda-civic", make: "Honda", model: "Civic", logo: "honda", year: 2023, category: "sedan",
    seats: 5, luggage: 2, transmission: "Automatic", fuel: "Petrol",
    priceSelfDrive: 10000, priceDay: 12000, priceWeek: 65000, priceMonth: 240000, priceOutstationDay: 14000,
    colors: ["White", "Black", "Silver"], images: img("honda-civic"),
    summary: "The Civic sits between everyday sedans and luxury cars. Customers choose it for client meetings, interviews and family functions where they want a newer, sharper car without the cost of a Mercedes.",
    bestFor: ["Client meetings", "Family functions", "Comfortable motorway runs"], featured: true,
  },
  {
    slug: "hyundai-elantra", make: "Hyundai", model: "Elantra", logo: "hyundai", year: 2023, category: "sedan",
    seats: 5, luggage: 2, transmission: "Automatic", fuel: "Petrol",
    priceSelfDrive: 11000, priceDay: 13000, priceWeek: 70000, priceMonth: 260000, priceOutstationDay: 15000,
    colors: ["Silver", "White"], images: img("hyundai-elantra"),
    summary: "The Elantra's bold styling and quiet, well-equipped cabin make it stand out at events and office entrances. It is a smooth highway cruiser for long business trips.",
    bestFor: ["Executive day hire", "Long business trips", "Stylish arrivals"],
  },

  /* ---------- SUVs & 4x4 ---------- */
  {
    slug: "honda-br-v", make: "Honda", model: "BR-V", logo: "honda", year: 2023, category: "suv",
    seats: 7, luggage: 2, transmission: "Automatic", fuel: "Petrol",
    priceSelfDrive: 9000, priceDay: 10500, priceWeek: 58000, priceMonth: 210000, priceOutstationDay: 12500,
    colors: ["White", "Silver"], images: img("honda-br-v"),
    summary: "The BR-V is the budget answer for seven passengers. It fits a family with grandparents into one car for a wedding day or a day trip, and stays easy to park in busy markets.",
    bestFor: ["Large families", "Wedding guest shuttles", "Seven seats on a budget"],
  },
  {
    slug: "toyota-corolla-cross", make: "Toyota", model: "Corolla Cross Hybrid", logo: "toyota", year: 2025, category: "suv", badge: "Hybrid",
    seats: 5, luggage: 3, transmission: "Automatic", fuel: "Hybrid",
    priceSelfDrive: 13000, priceDay: 15000, priceWeek: 82000, priceMonth: 300000, priceOutstationDay: 17000,
    colors: ["White", "Black"], images: img("toyota-corolla-cross"),
    summary: "The Corolla Cross Hybrid pairs crossover height with excellent fuel economy, so long city days and intercity drives cost less. Toyota reliability makes it a safe pick for monthly corporate contracts.",
    bestFor: ["Fuel-efficient SUV", "Monthly corporate use", "Daily intercity travel"],
  },
  {
    slug: "kia-sportage", make: "Kia", model: "Sportage", logo: "kia", year: 2024, category: "suv", badge: "Popular",
    seats: 5, luggage: 3, transmission: "Automatic", fuel: "Petrol",
    priceSelfDrive: 14000, priceDay: 16000, priceWeek: 88000, priceMonth: 320000, priceOutstationDay: 18000,
    colors: ["White", "Grey", "Black"], images: img("kia-sportage"),
    summary: "The Sportage is one of the most-requested SUVs in Pakistan: comfortable, well equipped and confident on both city roads and the Murree hills. It has room for a family and their airport luggage.",
    bestFor: ["Family road trips", "Airport runs with luggage", "Comfortable SUV for self drive"], featured: true,
  },
  {
    slug: "hyundai-tucson", make: "Hyundai", model: "Tucson", logo: "hyundai", year: 2024, category: "suv",
    seats: 5, luggage: 3, transmission: "Automatic", fuel: "Petrol",
    priceSelfDrive: 14000, priceDay: 16000, priceWeek: 88000, priceMonth: 320000, priceOutstationDay: 18000,
    colors: ["Grey", "White"], images: img("hyundai-tucson"),
    summary: "The Tucson's striking design and spacious cabin suit customers who want a modern SUV for business or leisure. The all-wheel-drive version handles hill roads in poor weather with ease.",
    bestFor: ["Business and leisure", "Hill stations", "Modern tech and comfort"],
  },
  {
    slug: "haval-h6", make: "Haval", model: "H6", logo: "haval", year: 2024, category: "suv",
    seats: 5, luggage: 3, transmission: "Automatic", fuel: "Petrol",
    priceSelfDrive: 15000, priceDay: 17000, priceWeek: 95000, priceMonth: 340000, priceOutstationDay: 19000,
    colors: ["White", "Grey"], images: img("haval-h6"),
    summary: "The Haval H6 offers premium touches like a panoramic roof, large screens and driver-assist features at a mid-SUV price. Customers who want a near-luxury SUV for a special trip often choose it.",
    bestFor: ["Near-luxury SUV feel", "Long highway drives", "Tech-savvy drivers"],
  },
  {
    slug: "toyota-fortuner", make: "Toyota", model: "Fortuner", logo: "toyota", year: 2023, category: "suv",
    seats: 7, luggage: 3, transmission: "Automatic", fuel: "Diesel",
    priceSelfDrive: 16000, priceDay: 18000, priceWeek: 100000, priceMonth: 370000, priceOutstationDay: 21000,
    colors: ["White", "Grey"], images: img("toyota-fortuner"),
    summary: "The Fortuner gives seven-seat SUV space and real ground clearance for less than a Prado. Corporate clients book it for site visits, and families pick it for northern trips with plenty of luggage.",
    bestFor: ["Site visits and field work", "Groups of five to seven", "Northern area trips"],
  },
  {
    slug: "toyota-revo", make: "Toyota", model: "Hilux Revo", logo: "toyota", year: 2023, category: "suv",
    seats: 5, luggage: 4, transmission: "Automatic", fuel: "Diesel",
    priceSelfDrive: 14000, priceDay: 16000, priceWeek: 90000, priceMonth: 330000, priceOutstationDay: 19000,
    colors: ["White"], images: img("toyota-revo"),
    summary: "The Revo is the pick-up for jobs that carry equipment as well as people: film shoots, event setups and camping trips up north. Four-wheel drive and a diesel engine make it the toughest car in the fleet.",
    bestFor: ["Event and film crews", "Camping and adventure trips", "Rough or unpaved roads"],
  },
  {
    slug: "toyota-prado", make: "Toyota", model: "Land Cruiser Prado", logo: "toyota", year: 2022, category: "suv", badge: "Executive",
    seats: 7, luggage: 3, transmission: "Automatic", fuel: "Diesel",
    priceSelfDrive: null, priceDay: 22000, priceWeek: 140000, priceMonth: 520000, priceOutstationDay: 26000,
    colors: ["White", "Black"], images: img("toyota-prado"),
    summary: "The Prado is our most-booked executive SUV. Seven seats suit a family or small delegation, and it handles the climb to Murree, Naran and Skardu without strain. Rented with a driver.",
    bestFor: ["Family trips up north", "Small delegations", "Executive travel"], featured: true,
  },
  {
    slug: "toyota-land-cruiser", make: "Toyota", model: "Land Cruiser", logo: "toyota", year: 2022, category: "suv", badge: "VIP",
    seats: 7, luggage: 4, transmission: "Automatic", fuel: "Petrol",
    priceSelfDrive: null, priceDay: 35000, priceWeek: 220000, priceMonth: 820000, priceOutstationDay: 40000,
    colors: ["White", "Black"], images: img("toyota-land-cruiser"),
    summary: "The Land Cruiser is the car we send when the guest matters most. It has the presence protocol teams expect for government, embassy and corporate visits, and the capability for any road in the north.",
    bestFor: ["Diplomatic and VIP protocol", "Security-conscious travel", "Any terrain"],
  },

  /* ---------- Luxury ---------- */
  {
    slug: "mercedes-benz-s-class", make: "Mercedes-Benz", model: "S-Class", logo: "mercedes-benz", year: 2019, category: "luxury", badge: "Flagship",
    seats: 4, luggage: 2, transmission: "Automatic", fuel: "Petrol",
    priceSelfDrive: null, priceDay: 110000, priceWeek: 700000, priceMonth: 2600000, priceOutstationDay: 125000,
    colors: ["Black", "White"], images: img("mercedes-benz-s-class"),
    summary: "The S-Class is the top of the fleet: a chauffeur-only flagship for barats, visiting chairmen and once-in-a-lifetime arrivals. The rear seat is where the comfort is, so it always comes with our most experienced drivers.",
    bestFor: ["Barat and wedding arrivals", "Visiting executives", "Red-carpet events"], featured: true,
  },
  {
    slug: "mercedes-benz-e-class", make: "Mercedes-Benz", model: "E-Class", logo: "mercedes-benz", year: 2020, category: "luxury",
    seats: 4, luggage: 2, transmission: "Automatic", fuel: "Petrol",
    priceSelfDrive: null, priceDay: 75000, priceWeek: 480000, priceMonth: 1800000, priceOutstationDay: 85000,
    colors: ["Grey", "Black", "White"], images: img("mercedes-benz-e-class"),
    summary: "The E-Class brings Mercedes comfort at a lower price than the S-Class. It is popular for corporate roadshows, mehndi and walima events, and executives moving between back-to-back meetings.",
    bestFor: ["Corporate roadshows", "Mehndi and walima", "Executive day hire"],
  },
  {
    slug: "audi-a6", make: "Audi", model: "A6", logo: "audi", year: 2021, category: "luxury",
    seats: 4, luggage: 2, transmission: "Automatic", fuel: "Petrol",
    priceSelfDrive: null, priceDay: 60000, priceWeek: 390000, priceMonth: 1450000, priceOutstationDay: 70000,
    colors: ["White", "Black"], images: img("audi-a6"),
    summary: "The Audi A6 suits customers who want understated luxury: a clean, modern cabin, a smooth ride and a car that looks the part at a hotel entrance without drawing a crowd.",
    bestFor: ["Hotel and embassy pickups", "Product launches", "Photo shoots"],
  },

  /* ---------- Vans & coasters ---------- */
  {
    slug: "toyota-hiace", make: "Toyota", model: "Hiace", logo: "toyota", year: 2022, category: "van",
    seats: 13, luggage: 6, transmission: "Manual", fuel: "Diesel",
    priceSelfDrive: null, priceDay: 16000, priceWeek: 100000, priceMonth: 380000, priceOutstationDay: 20000,
    colors: ["Silver", "White"], images: img("toyota-hiace"),
    summary: "The Hiace Grand Cabin carries a whole family or team in one vehicle, with air conditioning and luggage space for a week away. It is the standard choice for group tours, wedding guests and staff pick-and-drop.",
    bestFor: ["Group tours up north", "Wedding guest transport", "Staff pick and drop"],
  },
  {
    slug: "toyota-coaster", make: "Toyota", model: "Coaster", logo: "toyota", year: 2021, category: "van",
    seats: 29, luggage: 10, transmission: "Manual", fuel: "Diesel",
    priceSelfDrive: null, priceDay: 28000, priceWeek: 175000, priceMonth: 650000, priceOutstationDay: 32000,
    colors: ["White", "Silver"], images: img("toyota-coaster"),
    summary: "The Coaster moves large groups comfortably: corporate offsites, school trips, conference delegates and big wedding parties. One bus, one driver and everyone arrives together.",
    bestFor: ["Corporate offsites", "School and university trips", "Large wedding parties"],
  },
];

export const carName = (c: Car) => `${c.make} ${c.model}`;
export const carBySlug = (slug: string) => cars.find((c) => c.slug === slug);
export const carsIn = (cat: CategorySlug) => cars.filter((c) => c.category === cat);
export const categoryOf = (c: Car) => categories.find((k) => k.slug === c.category)!;
/** Lowest daily price the car can be rented for. */
export const fromPrice = (c: Car) => Math.min(c.priceDay, c.priceSelfDrive ?? Infinity);
export const logoSrc = (logo: string) => `/images/brands/${logo}.svg`;
