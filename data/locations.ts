/**
 * Location landing pages (/rent-a-car/<slug>/).
 *
 * Every location has its own copy, landmarks, trips and FAQs. Do not clone one
 * entry and swap the name: near-identical pages get filtered by Google as
 * doorway pages.
 *
 * Travel times are typical ranges and depend on traffic. Check landmarks and
 * pickup notes against your real operations before launch.
 */

export type LocationKind = "city" | "sector" | "area" | "destination";

export type Location = {
  slug: string;
  name: string;
  /** Used in titles and H1: "Rent a Car in {place}" */
  place: string;
  kind: LocationKind;
  metaDescription: string;
  intro: string[];
  landmarks: string[];
  pickup: string;
  trips: { to: string; time: string }[];
  faqs: { q: string; a: string }[];
  /** Search term for the embedded Google map */
  mapQuery: string;
  /** Slugs of cars to feature first */
  carSlugs: string[];
  nearby: string[];
};

export const locations: Location[] = [
  /* ---------------- Priority sectors ---------------- */
  {
    slug: "g-8-islamabad",
    name: "G-8",
    place: "G-8 Islamabad",
    kind: "sector",
    metaDescription: "Rent a car with driver in G-8 Islamabad. Doorstep pickup across G-8/1 to G-8/4, PIMS hospital runs, airport transfers and outstation trips. Fixed quotes on WhatsApp.",
    intro: [
      "G-8 sits in the middle of Islamabad, between the busy commercial spine of Blue Area and the residential sectors to the west. It is home to PIMS, the city's largest public hospital, and to G-8 Markaz, so the sector sees a steady flow of patients, visiting relatives, students and office workers every day. Parking around the hospital and the Markaz fills up early, which is why so many G-8 families book a car with a driver rather than drive themselves.",
      "SLC picks up from any street in G-8/1, G-8/2, G-8/3 and G-8/4. Our drivers know the hospital gates and drop points, the service roads around the Markaz, and the quickest way onto Srinagar Highway for the airport. Whether you need a sedan for a hospital appointment, an SUV for relatives arriving from abroad, or a car on a monthly plan for the office commute, you get a fixed quote before you confirm.",
    ],
    landmarks: [
      "PIMS (Pakistan Institute of Medical Sciences), G-8/3",
      "G-8 Markaz shops, banks and restaurants",
      "Srinagar Highway, the direct route to the airport",
      "Jinnah Avenue and Blue Area, a few minutes east",
    ],
    pickup: "Door-to-door pickup from any house, apartment, hospital gate or office in G-8. For PIMS we confirm the exact gate on WhatsApp so the driver is waiting where you walk out.",
    trips: [
      { to: "Islamabad International Airport", time: "30–40 min" },
      { to: "Blue Area", time: "10–15 min" },
      { to: "Saddar, Rawalpindi", time: "25–35 min" },
      { to: "Murree", time: "1.5–2 hr" },
    ],
    faqs: [
      { q: "Can I book a car for a PIMS hospital visit in G-8?", a: "Yes. Book a few hours or a full day. The driver waits during the appointment and can drop and collect family members between visits, so you do not have to look for parking near the hospital." },
      { q: "How quickly can a car reach G-8?", a: "Most same-day bookings in G-8 are covered within an hour, subject to availability. For early-morning airport runs, book the evening before." },
      { q: "Do you offer monthly cars for G-8 residents?", a: "Yes. A monthly car with driver covers the daily office run and family errands. The monthly rate on each car page is noticeably lower per day than booking day by day." },
    ],
    mapQuery: "G-8 Markaz, Islamabad",
    carSlugs: ["toyota-corolla", "honda-br-v", "toyota-prado"],
    nearby: ["g-9-islamabad", "g-10-islamabad", "blue-area-islamabad"],
  },
  {
    slug: "g-9-islamabad",
    name: "G-9",
    place: "G-9 Islamabad",
    kind: "sector",
    metaDescription: "Rent a car with driver in G-9 Islamabad, near Karachi Company. Doorstep pickup across G-9/1 to G-9/4, airport transfers, wedding cars and trips north. Fixed price quotes.",
    intro: [
      "G-9 is one of Islamabad's most lived-in sectors. Its Markaz, better known as Karachi Company, is among the busiest shopping areas in the city, with markets, coaching centres, bus stops and wedding shops packed into a few blocks. Traffic around Karachi Company backs up in the evenings and on weekends, and finding parking for a family car can take longer than the shopping itself.",
      "SLC covers every part of G-9, from G-9/1 to G-9/4. Families book us for wedding shopping days, out-of-town guests arriving at the airport, and trips to relatives in Rawalpindi, Lahore or up north. Students and professionals living in G-9 hostels and flats book sedans for interviews, exam days and airport drops. Our drivers know the back lanes that avoid the Karachi Company jam and the easiest exits onto Srinagar Highway and Ninth Avenue.",
    ],
    landmarks: [
      "Karachi Company (G-9 Markaz) markets and bus stops",
      "Ninth Avenue, linking G-9 to the F sectors and H-9",
      "Sunday Bazaar in neighbouring H-9",
      "Srinagar Highway towards the airport and Rawalpindi",
    ],
    pickup: "Pickup from your door anywhere in G-9. For Karachi Company we suggest a meeting point on a side street, which saves 10 to 15 minutes in peak hours. We confirm it with you on WhatsApp.",
    trips: [
      { to: "Islamabad International Airport", time: "30–40 min" },
      { to: "Blue Area", time: "15–20 min" },
      { to: "Saddar, Rawalpindi", time: "25–35 min" },
      { to: "Lahore (M-2 motorway)", time: "4.5–5 hr" },
    ],
    faqs: [
      { q: "Can I book a car for a shopping day at Karachi Company?", a: "Yes. Book by the hour or the day. The driver drops you at the market, waits nearby and loads your bags, so you are not circling for parking." },
      { q: "Do you provide wedding cars in G-9?", a: "Yes. We arrange decorated luxury cars for the couple and SUVs or BR-Vs for family shuttles, all with drivers, collected from your home in G-9." },
      { q: "Is there a cheaper option for a short airport drop from G-9?", a: "The Corolla Altis is our lowest-cost airport car. Ask for a one-way airport transfer quote instead of a full-day rate." },
    ],
    mapQuery: "Karachi Company, G-9 Markaz, Islamabad",
    carSlugs: ["toyota-corolla", "honda-civic", "honda-br-v"],
    nearby: ["g-8-islamabad", "g-10-islamabad", "g-11-islamabad"],
  },
  {
    slug: "g-10-islamabad",
    name: "G-10",
    place: "G-10 Islamabad",
    kind: "sector",
    metaDescription: "Rent a car with driver in G-10 Islamabad. Pickup from G-10/1 to G-10/4 and G-10 Markaz for airport transfers, office commutes, events and tours. Get a fixed quote on WhatsApp.",
    intro: [
      "G-10 is a family sector on Islamabad's western side, quieter than its neighbours but well connected. G-10 Markaz has the everyday shops, banks and restaurants, and Srinagar Highway runs along the sector's southern edge, which makes G-10 one of the faster sectors to reach the airport from. Many residents work in Blue Area or the F sectors and commute east every morning.",
      "SLC serves all four sub-sectors, G-10/1 to G-10/4. Monthly corporate clients in G-10 use our sedans and hybrids for the daily office run, and families book SUVs for trips to Murree, Nathia Gali and the Kaghan valley on long weekends. Because G-10 sits so close to Srinagar Highway, it is also a common pickup point for early-morning flights and late-night arrivals.",
    ],
    landmarks: [
      "G-10 Markaz shops, banks and food streets",
      "Srinagar Highway along the southern edge",
      "Neighbouring G-9 (Karachi Company) and G-11 Markaz",
      "Quick access west towards the airport and Golra",
    ],
    pickup: "Doorstep pickup anywhere in G-10, including flats and offices around the Markaz. For airport runs the driver arrives 15 minutes early and helps with luggage.",
    trips: [
      { to: "Islamabad International Airport", time: "25–35 min" },
      { to: "Blue Area", time: "15–20 min" },
      { to: "Saddar, Rawalpindi", time: "30–40 min" },
      { to: "Murree", time: "1.5–2 hr" },
    ],
    faqs: [
      { q: "Can I get a car for a 4 a.m. flight from G-10?", a: "Yes. We run around the clock. Book at least the evening before and the driver will be at your door with time to spare." },
      { q: "Do you offer monthly office cars for G-10 residents?", a: "Yes. Many G-10 clients take a Corolla Altis or Corolla Cross Hybrid on a monthly plan for the daily commute to Blue Area and back." },
      { q: "Can I book an SUV from G-10 for a Murree trip?", a: "Yes. The Prado and Fortuner are the most popular choices. The quote covers the driver; fuel and tolls are listed separately." },
    ],
    mapQuery: "G-10 Markaz, Islamabad",
    carSlugs: ["toyota-corolla-grande", "toyota-corolla", "toyota-fortuner"],
    nearby: ["g-9-islamabad", "g-11-islamabad", "islamabad-airport"],
  },
  {
    slug: "g-11-islamabad",
    name: "G-11",
    place: "G-11 Islamabad",
    kind: "sector",
    metaDescription: "Rent a car with driver in G-11 Islamabad. Doorstep pickup across G-11/1 to G-11/4, airport transfers, corporate monthly cars and northern tours with fixed quotes.",
    intro: [
      "G-11 is one of Islamabad's newer, fast-growing sectors on the western edge of the G series. G-11 Markaz has become a busy commercial hub with restaurants, banks and shops, and the sector's position near Srinagar Highway gives it a short, direct drive to Islamabad International Airport. Families, young professionals and government employees make up most of its residents.",
      "SLC covers G-11/1 to G-11/4 and the Markaz. G-11 is a natural base for airport transfers, so many of our airport bookings start here. Residents also use us for weekday office cars, wedding events and family trips north, with SUVs that can handle the Murree, Naran and Swat roads. Choose self drive or a car with driver, with a fixed quote before you confirm.",
    ],
    landmarks: [
      "G-11 Markaz restaurants and commercial area",
      "Srinagar Highway for the airport and Rawalpindi",
      "Neighbouring G-10 and the F-10/F-11 sectors",
      "Short drive to the Golra and Margalla Avenue routes",
    ],
    pickup: "Pickup from any address in G-11. For group bookings or events we can send several cars to one meeting point near the Markaz.",
    trips: [
      { to: "Islamabad International Airport", time: "20–30 min" },
      { to: "Blue Area", time: "20–25 min" },
      { to: "Saddar, Rawalpindi", time: "30–40 min" },
      { to: "Naran (Kaghan valley)", time: "6–7 hr" },
    ],
    faqs: [
      { q: "How far is G-11 from Islamabad airport by car?", a: "Usually 20 to 30 minutes via Srinagar Highway, depending on traffic. We recommend leaving three hours before an international flight." },
      { q: "Can you send several cars to G-11 for an event?", a: "Yes. We regularly send matching cars for weddings and corporate events, coordinated by one SLC contact on the day." },
      { q: "Can I rent a self-drive car in G-11?", a: "Yes. Hatchbacks, sedans and most SUVs are available for self drive with a CNIC, driving licence and refundable deposit. We can deliver the car to your door in G-11." },
    ],
    mapQuery: "G-11 Markaz, Islamabad",
    carSlugs: ["kia-sportage", "toyota-prado", "toyota-corolla"],
    nearby: ["g-10-islamabad", "islamabad-airport", "g-9-islamabad"],
  },

  /* ---------------- Other Islamabad areas ---------------- */
  {
    slug: "f-7-islamabad",
    name: "F-7",
    place: "F-7 Islamabad",
    kind: "sector",
    metaDescription: "Rent a car with driver in F-7 Islamabad, near Jinnah Super Market. Luxury cars, airport transfers and executive SUVs with doorstep pickup and fixed quotes.",
    intro: [
      "F-7 is one of Islamabad's most established sectors, at the foot of the Margalla Hills. Jinnah Super Market is its commercial heart, with cafés, bookshops and boutiques, and the leafy residential streets around it house diplomats, senior professionals and long-time Islamabad families.",
      "Clients in F-7 tend to book our executive SUVs and luxury sedans for guests from abroad, embassy and NGO visits, and evening events at hotels and restaurants. Our drivers are used to formal pickups, dress-code expectations and waiting discreetly. We pick up from homes, guest houses and offices across F-7/1 to F-7/4.",
    ],
    landmarks: ["Jinnah Super Market", "Margalla Hills to the north", "Guest houses and embassies' staff residences", "Jinnah Avenue and Blue Area to the south-east"],
    pickup: "Doorstep pickup from any home, guest house or office in F-7. Drivers can wait at the gate and help guests with luggage.",
    trips: [
      { to: "Islamabad International Airport", time: "35–45 min" },
      { to: "Blue Area", time: "10 min" },
      { to: "Diplomatic Enclave", time: "15–20 min" },
      { to: "Murree", time: "1.5 hr" },
    ],
    faqs: [
      { q: "Do you provide cars for foreign guests staying in F-7 guest houses?", a: "Yes. We do airport pickups, daily hire and sightseeing for guests, with drivers who speak English." },
      { q: "Which cars suit formal events in F-7?", a: "The Mercedes E-Class, Audi A6 and Land Cruiser V8 are the usual choices for formal events and protocol visits." },
    ],
    mapQuery: "Jinnah Super Market, F-7 Markaz, Islamabad",
    carSlugs: ["mercedes-benz-e-class", "toyota-land-cruiser", "audi-a6"],
    nearby: ["blue-area-islamabad", "g-8-islamabad", "islamabad"],
  },
  {
    slug: "blue-area-islamabad",
    name: "Blue Area",
    place: "Blue Area Islamabad",
    kind: "area",
    metaDescription: "Rent a car with driver in Blue Area Islamabad for meetings, roadshows and corporate travel. Executive cars, monthly office plans and airport transfers with fixed quotes.",
    intro: [
      "Blue Area is Islamabad's business district, a long strip of offices, banks, hotels and corporate headquarters along Jinnah Avenue. Meetings run back to back, parking is tight, and visiting executives often need a car that waits outside while they move between offices.",
      "SLC handles corporate travel in Blue Area daily: monthly cars for company staff, day hire for visiting teams, and executive SUVs or Mercedes sedans for board members and guests. We invoice companies monthly and can keep the same driver on a long contract so your team always knows who is coming.",
    ],
    landmarks: ["Jinnah Avenue offices and bank headquarters", "Hotels along Jinnah Avenue", "Constitution Avenue and the Parliament area to the east", "F-6 and F-7 markets to the north"],
    pickup: "Pickup and drop at any office tower in Blue Area. Drivers wait in the nearest legal parking and come to the entrance when you message.",
    trips: [
      { to: "Islamabad International Airport", time: "35–45 min" },
      { to: "Diplomatic Enclave", time: "10–15 min" },
      { to: "Saddar, Rawalpindi", time: "25–35 min" },
      { to: "Lahore (M-2 motorway)", time: "4.5 hr" },
    ],
    faqs: [
      { q: "Can my company get a monthly invoice?", a: "Yes. Corporate accounts get one monthly invoice covering all cars, drivers and trips." },
      { q: "Can a driver wait between meetings in Blue Area?", a: "Yes. With day hire the driver stays with you all day and moves you between meetings on your schedule." },
    ],
    mapQuery: "Blue Area, Jinnah Avenue, Islamabad",
    carSlugs: ["mercedes-benz-e-class", "honda-civic", "toyota-fortuner"],
    nearby: ["f-7-islamabad", "g-8-islamabad", "islamabad"],
  },
  {
    slug: "islamabad-airport",
    name: "Islamabad Airport",
    place: "Islamabad Airport",
    kind: "area",
    metaDescription: "Islamabad International Airport car rental with driver. Flight-tracked pickups, meet and greet at arrivals, and drops to Islamabad, Rawalpindi, Murree and beyond. Fixed fares.",
    intro: [
      "Islamabad International Airport is on the Fateh Jang side of the city, a 25 to 45 minute drive from most of Islamabad and Rawalpindi. Flights from the Gulf, Europe and the UK often land late at night or before dawn, exactly when finding a reliable ride is hardest.",
      "SLC tracks your flight number and adjusts the pickup time if you land early or late. The driver waits at arrivals with your name, helps with luggage, and takes you straight to your home, hotel or onward destination, whether that is a sector in Islamabad, Rawalpindi, or a long drive to Murree, Abbottabad or Lahore.",
    ],
    landmarks: ["Arrivals hall meeting point", "Srinagar Highway into Islamabad", "Motorway links towards Lahore and Peshawar", "Fateh Jang road"],
    pickup: "Meet and greet inside the arrivals area with a name board. For departures, the driver collects you from home and drops you at the departure gate.",
    trips: [
      { to: "G-11 Islamabad", time: "20–30 min" },
      { to: "Blue Area", time: "35–45 min" },
      { to: "Bahria Town", time: "40–50 min" },
      { to: "Murree", time: "2–2.5 hr" },
    ],
    faqs: [
      { q: "What happens if my flight is delayed?", a: "We track the flight and move the pickup to match. There is no charge for normal delays." },
      { q: "Do you serve late-night and early-morning flights?", a: "Yes, around the clock, every day of the year." },
      { q: "Can you take me straight from the airport to Murree or Lahore?", a: "Yes. Book an airport-to-destination transfer and the same driver takes you the whole way." },
    ],
    mapQuery: "Islamabad International Airport",
    carSlugs: ["toyota-prado", "kia-sportage", "toyota-corolla"],
    nearby: ["g-11-islamabad", "g-10-islamabad", "islamabad"],
  },
  {
    slug: "bahria-town",
    name: "Bahria Town",
    place: "Bahria Town Islamabad & Rawalpindi",
    kind: "area",
    metaDescription: "Rent a car with driver in Bahria Town Islamabad and Rawalpindi, all phases. Airport transfers, wedding cars, monthly plans and northern tours with fixed quotes.",
    intro: [
      "Bahria Town stretches across several phases along the Islamabad Expressway and GT Road, between Islamabad and Rawalpindi. It has its own markets, schools and wedding venues, but most residents still travel into Islamabad for work, to the airport, or to Rawalpindi for family.",
      "SLC serves every phase of Bahria Town. Wedding season is busy here, and we supply decorated luxury cars and matching guest cars for events at Bahria venues. We also run airport transfers, monthly office cars and family trips north from Bahria Town addresses.",
    ],
    landmarks: ["Islamabad Expressway", "GT Road", "Bahria Town wedding halls and marquees", "Neighbouring DHA Islamabad"],
    pickup: "Pickup from any phase. Share your phase and street number and the driver will meet you at your gate.",
    trips: [
      { to: "Islamabad International Airport", time: "40–50 min" },
      { to: "Blue Area", time: "30–40 min" },
      { to: "Saddar, Rawalpindi", time: "25–30 min" },
      { to: "Murree", time: "1.5–2 hr" },
    ],
    faqs: [
      { q: "Do you supply wedding cars for Bahria Town venues?", a: "Yes. We provide decorated cars for the couple and guest cars, all with drivers, timed to your event schedule." },
      { q: "Do you cover all phases of Bahria Town?", a: "Yes, every phase in both the Islamabad and Rawalpindi parts of Bahria Town." },
    ],
    mapQuery: "Bahria Town, Rawalpindi",
    carSlugs: ["mercedes-benz-s-class", "toyota-prado", "honda-br-v"],
    nearby: ["rawalpindi", "islamabad", "islamabad-airport"],
  },

  /* ---------------- Cities ---------------- */
  {
    slug: "islamabad",
    name: "Islamabad",
    place: "Islamabad",
    kind: "city",
    metaDescription: "Rent a car in Islamabad with driver from SLC. Sedans, SUVs and luxury cars for airport transfers, corporate travel, weddings and tours, with fixed quotes on WhatsApp.",
    intro: [
      "Islamabad is our home city. We serve every sector, from the G and F series to E-7, I-8, DHA, Bahria Town and the airport, with cars and drivers available around the clock. The city's wide avenues are easy to drive, but parking near markets, hospitals and offices is not, and that is why most of our Islamabad clients choose a car with a driver.",
      "Our Islamabad bookings range from a two-hour hospital visit to a month-long corporate contract. Popular uses are airport transfers, office commutes to Blue Area, wedding events, and weekend trips to Murree, Nathia Gali and the Kaghan valley. Pick a car, send your route, and we send a fixed quote.",
    ],
    landmarks: ["Blue Area and Jinnah Avenue", "Faisal Mosque and the Margalla Hills", "G and F sector markets", "Islamabad International Airport"],
    pickup: "Pickup from any address in Islamabad. Popular sector pages: G-8, G-9, G-10, G-11, F-7 and Blue Area.",
    trips: [
      { to: "Rawalpindi", time: "25–40 min" },
      { to: "Murree", time: "1.5–2 hr" },
      { to: "Abbottabad", time: "2–2.5 hr" },
      { to: "Lahore", time: "4.5–5 hr" },
    ],
    faqs: [
      { q: "How much does it cost to rent a car with driver in Islamabad?", a: "Daily rates start from about PKR 6,500 for a Corolla Altis with driver. Each car page lists daily, weekly and monthly prices." },
      { q: "Can I book a car in Islamabad for just a few hours?", a: "Yes. Short bookings are available for hospital visits, meetings and shopping. Ask on WhatsApp for an hourly quote." },
      { q: "Do you cover all sectors of Islamabad?", a: "Yes, every sector and housing society in Islamabad, plus the airport." },
    ],
    mapQuery: "Islamabad, Pakistan",
    carSlugs: ["toyota-corolla", "toyota-prado", "mercedes-benz-e-class"],
    nearby: ["g-8-islamabad", "g-9-islamabad", "g-10-islamabad", "g-11-islamabad", "rawalpindi"],
  },
  {
    slug: "rawalpindi",
    name: "Rawalpindi",
    place: "Rawalpindi",
    kind: "city",
    metaDescription: "Rent a car in Rawalpindi with driver. Pickup from Saddar, Satellite Town, Bahria Town and DHA for airport transfers, weddings, and trips north. Fixed quotes on WhatsApp.",
    intro: [
      "Rawalpindi is Islamabad's twin city and runs at a different pace: old bazaars, dense traffic around Raja Bazaar and Committee Chowk, and wide new housing societies along the Expressway. Many families here have relatives landing at Islamabad airport, weddings to attend across both cities, and regular trips to Murree, which starts just up the road.",
      "SLC covers Rawalpindi with the same fleet and drivers as Islamabad. Our drivers know the Murree Road corridor, Saddar's one-way streets and the quickest way to the airport. We pick up from Saddar, Satellite Town, Chaklala, Westridge, Bahria Town and DHA.",
    ],
    landmarks: ["Saddar and the Cantonment", "Murree Road and the Metro Bus corridor", "Raja Bazaar and Committee Chowk", "Islamabad Expressway"],
    pickup: "Doorstep pickup across Rawalpindi. In the old city we agree a nearby pickup point if lanes are too narrow for an SUV.",
    trips: [
      { to: "Islamabad International Airport", time: "40–50 min" },
      { to: "Blue Area, Islamabad", time: "25–35 min" },
      { to: "Murree", time: "1.5 hr" },
      { to: "Lahore", time: "4.5–5 hr" },
    ],
    faqs: [
      { q: "Do you charge extra for Rawalpindi pickups?", a: "No. Rawalpindi and Islamabad share the same city rates." },
      { q: "Can you pick up from the old city in Rawalpindi?", a: "Yes. If the street is too narrow we agree the nearest convenient pickup point with you." },
    ],
    mapQuery: "Saddar, Rawalpindi",
    carSlugs: ["toyota-corolla", "honda-br-v", "toyota-fortuner"],
    nearby: ["bahria-town", "islamabad", "murree"],
  },
  {
    slug: "lahore",
    name: "Lahore",
    place: "Lahore",
    kind: "city",
    metaDescription: "Rent a car in Lahore, self drive or with driver. Pickup in Gulberg, DHA, Johar Town, Model Town and Allama Iqbal Airport. Hatchbacks to SUVs with fixed quotes from SLC.",
    intro: [
      "Lahore is Pakistan's second-largest city and its cultural heart, from the Walled City and Badshahi Mosque to the cafés of Gulberg and the wide boulevards of DHA. It is also a city of long distances: a trip from Johar Town to the old city or from DHA to the airport can take most of an hour, which makes having your own car the easiest way to get around.",
      "SLC Car Rental serves all of Lahore with self-drive cars and cars with drivers. Visitors book a Corolla or City for business meetings on Main Boulevard, families take a BR-V or Hiace for weddings in the city's marquees, and travellers collect an SUV for the M-2 to Islamabad or the drive north. We pick up and drop at homes, hotels and Allama Iqbal International Airport.",
    ],
    landmarks: ["Gulberg and Liberty Market", "DHA Lahore phases", "Johar Town and Model Town", "Allama Iqbal International Airport", "Walled City and Badshahi Mosque"],
    pickup: "Doorstep delivery and collection anywhere in Lahore, including hotels on Mall Road and the Gulberg business district. Airport pickups are timed to your flight.",
    trips: [
      { to: "Allama Iqbal Airport from Gulberg", time: "25–35 min" },
      { to: "Lahore to Islamabad (M-2)", time: "4.5–5 hr" },
      { to: "Lahore to Sialkot (motorway)", time: "1.5 hr" },
      { to: "Lahore to Faisalabad (M-3)", time: "2–2.5 hr" },
    ],
    faqs: [
      { q: "Can I rent a self-drive car in Lahore?", a: "Yes. Hatchbacks, sedans and most SUVs are available for self drive in Lahore with a CNIC, driving licence and refundable deposit." },
      { q: "Do you deliver cars to DHA and Bahria Town Lahore?", a: "Yes. We deliver and collect anywhere in Lahore, including all DHA phases, Bahria Town, Johar Town and Model Town." },
      { q: "Can I take a Lahore rental to Islamabad?", a: "Yes. One-way and return trips on the M-2 are available. Ask for an outstation quote." },
    ],
    mapQuery: "Gulberg, Lahore",
    carSlugs: ["toyota-corolla", "honda-city", "kia-sportage"],
    nearby: ["sialkot", "gujranwala", "faisalabad"],
  },
  {
    slug: "karachi",
    name: "Karachi",
    place: "Karachi",
    kind: "city",
    metaDescription: "Rent a car in Karachi, self drive or with driver. Pickup in Clifton, DHA, PECHS, Gulshan-e-Iqbal and Jinnah International Airport. Fixed quotes from SLC Car Rental.",
    intro: [
      "Karachi is Pakistan's largest city and its business capital, stretching from the port and I.I. Chundrigar Road to Clifton, DHA and the fast-growing suburbs along the Super Highway. Distances are big and public transport is limited, so a reliable car makes all the difference for meetings, family visits and airport runs.",
      "SLC Car Rental offers self-drive and chauffeur-driven cars across Karachi. Business travellers book sedans for days of meetings along Shahrah-e-Faisal, families choose SUVs and vans for weddings, and visitors arriving at Jinnah International Airport are met by a driver at arrivals. Every car is cleaned and checked before handover, and every quote is fixed upfront.",
    ],
    landmarks: ["Clifton and Sea View", "DHA Karachi", "Shahrah-e-Faisal and PECHS", "I.I. Chundrigar Road business district", "Jinnah International Airport"],
    pickup: "Doorstep delivery across Karachi, from Clifton and DHA to Gulshan-e-Iqbal and North Nazimabad, plus meet and greet at Jinnah International Airport.",
    trips: [
      { to: "Jinnah Airport from Clifton", time: "30–45 min" },
      { to: "Clifton to I.I. Chundrigar Road", time: "20–30 min" },
      { to: "Karachi to Hyderabad (M-9)", time: "2–2.5 hr" },
      { to: "Karachi to Thatta", time: "1.5–2 hr" },
    ],
    faqs: [
      { q: "Do you provide cars with drivers in Karachi?", a: "Yes. Drivers who know Karachi's roads are available for hourly, daily and monthly bookings." },
      { q: "Can you meet me at Jinnah International Airport?", a: "Yes. We track your flight and the driver waits at arrivals with your name." },
      { q: "Can I rent a car in Karachi for a trip to Hyderabad?", a: "Yes. Outstation trips on the M-9 and beyond are quoted with fuel and tolls listed separately." },
    ],
    mapQuery: "Clifton, Karachi",
    carSlugs: ["toyota-corolla", "honda-civic", "toyota-fortuner"],
    nearby: ["lahore", "multan", "islamabad"],
  },
  {
    slug: "peshawar",
    name: "Peshawar",
    place: "Peshawar",
    kind: "city",
    metaDescription: "Rent a car in Peshawar, self drive or with driver. Pickup in Hayatabad, University Town, Saddar and Bacha Khan Airport, plus trips to Swat and Islamabad. Fixed quotes.",
    intro: [
      "Peshawar is one of the oldest cities in South Asia, where the bazaars of Qissa Khwani sit a short drive from the leafy streets of University Town and the planned phases of Hayatabad. It is the gateway to Swat, Chitral and the Khyber Pass, and only a couple of hours from Islamabad on the M-1.",
      "SLC Car Rental provides self-drive cars and cars with drivers in Peshawar for family visits, business trips, university travel and tours to Swat and Kalam. Our drivers know the city's traffic and the safest routes north, and SUVs are available for mountain roads.",
    ],
    landmarks: ["Hayatabad", "University Town", "Saddar and the Cantonment", "Qissa Khwani Bazaar", "Bacha Khan International Airport"],
    pickup: "Pickup and delivery across Peshawar, including Hayatabad, University Town, the Cantonment and Bacha Khan International Airport.",
    trips: [
      { to: "Peshawar to Islamabad (M-1)", time: "2–2.5 hr" },
      { to: "Peshawar to Swat (Mingora)", time: "3–3.5 hr" },
      { to: "Hayatabad to Bacha Khan Airport", time: "20–30 min" },
      { to: "Peshawar to Nowshera", time: "45–60 min" },
    ],
    faqs: [
      { q: "Can I hire a car in Peshawar for a Swat trip?", a: "Yes. We recommend an SUV with one of our drivers experienced on the Swat roads." },
      { q: "Do you do one-way trips from Peshawar to Islamabad?", a: "Yes. One-way trips on the M-1 are priced to include the driver's return." },
    ],
    mapQuery: "University Town, Peshawar",
    carSlugs: ["toyota-corolla", "toyota-fortuner", "toyota-hiace"],
    nearby: ["islamabad", "abbottabad", "rawalpindi"],
  },
  {
    slug: "faisalabad",
    name: "Faisalabad",
    place: "Faisalabad",
    kind: "city",
    metaDescription: "Rent a car in Faisalabad, self drive or with driver. Pickup near the Clock Tower, D Ground, Peoples Colony and Faisalabad Airport. Cars for business, weddings and travel.",
    intro: [
      "Faisalabad is Pakistan's textile capital, built around the famous Clock Tower and its eight bazaars laid out in the pattern of the Union Jack. Buyers and business visitors travel between mills, factories and offices every day, and the city's motorway links make it easy to reach Lahore, Islamabad and Multan.",
      "SLC Car Rental supports Faisalabad's business community with sedans and SUVs for factory visits and buyer meetings, and families with cars and vans for weddings and functions. Choose self drive or a driver who knows the industrial areas and the quickest routes to the motorway.",
    ],
    landmarks: ["Clock Tower (Ghanta Ghar) and the eight bazaars", "D Ground and Peoples Colony", "Textile mills and industrial estates", "Faisalabad International Airport"],
    pickup: "Delivery to homes, hotels, offices and mills across Faisalabad, and pickup at Faisalabad International Airport.",
    trips: [
      { to: "Faisalabad to Lahore (M-3)", time: "2–2.5 hr" },
      { to: "Faisalabad to Islamabad (M-4/M-2)", time: "3.5–4 hr" },
      { to: "Faisalabad to Multan (M-4)", time: "2.5–3 hr" },
      { to: "City centre to Faisalabad Airport", time: "20–30 min" },
    ],
    faqs: [
      { q: "Do you provide cars for visiting textile buyers?", a: "Yes. Day hire with a driver is popular with buyers visiting several mills in one day." },
      { q: "Can I book a Hiace for a wedding in Faisalabad?", a: "Yes. Hiace vans and Coasters are available for guest transport." },
    ],
    mapQuery: "Clock Tower, Faisalabad",
    carSlugs: ["honda-city", "toyota-corolla", "toyota-hiace"],
    nearby: ["lahore", "multan", "gujranwala"],
  },
  {
    slug: "multan",
    name: "Multan",
    place: "Multan",
    kind: "city",
    metaDescription: "Rent a car in Multan, self drive or with driver. Pickup in Cantt, Bosan Road, Gulgasht and Multan Airport, with trips on the M-4 and M-5. Fixed quotes from SLC.",
    intro: [
      "Multan, the City of Saints, is known for the shrines of Bahauddin Zakariya and Shah Rukn-e-Alam, its blue pottery and its mangoes. It is also a major hub of southern Punjab, connected by motorway to Faisalabad and Lahore in one direction and Sukkur in the other.",
      "SLC Car Rental offers self-drive cars and cars with drivers in Multan for business travel, shrine visits, weddings and intercity trips. Summers are hot, so every car is checked for strong air conditioning before handover.",
    ],
    landmarks: ["Shrines of Bahauddin Zakariya and Shah Rukn-e-Alam", "Multan Cantt", "Bosan Road and Gulgasht", "Hussain Agahi Bazaar", "Multan International Airport"],
    pickup: "Doorstep delivery across Multan, including Cantt, Gulgasht, Bosan Road and Multan International Airport.",
    trips: [
      { to: "Multan to Lahore (M-3/M-4)", time: "4–4.5 hr" },
      { to: "Multan to Faisalabad (M-4)", time: "2.5–3 hr" },
      { to: "Multan to Bahawalpur", time: "1.5–2 hr" },
      { to: "City centre to Multan Airport", time: "20–30 min" },
    ],
    faqs: [
      { q: "Do your cars have good air conditioning for Multan summers?", a: "Yes. Air conditioning is checked on every car before each booking." },
      { q: "Can I rent a car in Multan for a trip to Bahawalpur?", a: "Yes. Outstation trips are quoted with fuel and tolls listed separately." },
    ],
    mapQuery: "Multan Cantt, Multan",
    carSlugs: ["toyota-corolla", "honda-br-v", "kia-sportage"],
    nearby: ["faisalabad", "lahore", "karachi"],
  },
  {
    slug: "sialkot",
    name: "Sialkot",
    place: "Sialkot",
    kind: "city",
    metaDescription: "Rent a car in Sialkot, self drive or with driver. Pickup in Cantt, Sialkot city and Sialkot International Airport, with fast motorway trips to Lahore. Fixed quotes.",
    intro: [
      "Sialkot is one of Pakistan's most successful export cities, known worldwide for sports goods, surgical instruments and leather. Its business community even built the city its own international airport, and the Lahore–Sialkot motorway puts Lahore about an hour and a half away.",
      "SLC Car Rental serves Sialkot's exporters, visiting buyers and families. Book a sedan with driver to visit several factories in a day, a self-drive car for a family stay, or an airport transfer for overseas Pakistanis flying into Sialkot International Airport.",
    ],
    landmarks: ["Sialkot Cantonment", "Sports goods and surgical instrument industries", "Clock Tower and the old city", "Sialkot International Airport"],
    pickup: "Delivery to homes, factories and hotels in Sialkot, and meet and greet at Sialkot International Airport.",
    trips: [
      { to: "Sialkot to Lahore (motorway)", time: "1.5 hr" },
      { to: "Sialkot to Gujranwala", time: "1 hr" },
      { to: "Sialkot to Islamabad", time: "3.5–4 hr" },
      { to: "City to Sialkot Airport", time: "25–35 min" },
    ],
    faqs: [
      { q: "Do you provide airport pickup at Sialkot International Airport?", a: "Yes. We track your flight, and the driver waits at arrivals." },
      { q: "Can visiting buyers hire a car with driver for factory visits?", a: "Yes. Day hire with a driver is the easiest way to visit several factories in one day." },
    ],
    mapQuery: "Sialkot Cantonment",
    carSlugs: ["honda-civic", "toyota-corolla", "toyota-fortuner"],
    nearby: ["gujranwala", "lahore", "islamabad"],
  },
  {
    slug: "gujranwala",
    name: "Gujranwala",
    place: "Gujranwala",
    kind: "city",
    metaDescription: "Rent a car in Gujranwala, self drive or with driver, along GT Road. Cars for weddings, business and trips to Lahore, Sialkot and Islamabad with fixed quotes from SLC.",
    intro: [
      "Gujranwala is a busy industrial city on the GT Road, known for its manufacturing, its wrestlers and, above all, its food. It sits between Lahore and Sialkot, so residents and businesses travel constantly to both cities and to Lahore and Sialkot airports.",
      "SLC Car Rental provides self-drive cars and cars with drivers in Gujranwala for weddings, family events, factory visits and airport transfers. Large wedding parties can book matching cars, Hiace vans and Coasters together.",
    ],
    landmarks: ["GT Road", "Satellite Town and Model Town", "Industrial areas", "Easy access to Lahore and Sialkot airports"],
    pickup: "Doorstep pickup anywhere in Gujranwala, with airport transfers to Lahore and Sialkot.",
    trips: [
      { to: "Gujranwala to Lahore", time: "1.5–2 hr" },
      { to: "Gujranwala to Sialkot", time: "1 hr" },
      { to: "Gujranwala to Islamabad", time: "3.5–4 hr" },
      { to: "Gujranwala to Sialkot Airport", time: "45–60 min" },
    ],
    faqs: [
      { q: "Can you provide several cars for a wedding in Gujranwala?", a: "Yes. We supply decorated cars for the couple plus sedans, vans and Coasters for guests." },
      { q: "Do you offer transfers from Gujranwala to Lahore airport?", a: "Yes. Book an airport transfer and we will time pickup to your flight." },
    ],
    mapQuery: "Gujranwala",
    carSlugs: ["honda-city", "honda-br-v", "toyota-coaster"],
    nearby: ["lahore", "sialkot", "faisalabad"],
  },
  {
    slug: "abbottabad",
    name: "Abbottabad",
    place: "Abbottabad",
    kind: "city",
    metaDescription: "Rent a car in Abbottabad, self drive or with driver, for Nathia Gali, Ayubia and trips up the Karakoram Highway. SUVs and sedans with fixed quotes from SLC Car Rental.",
    intro: [
      "Abbottabad is a green, cool hill city in Hazara, home to well-known schools and colleges and the gateway to the Galiyat, Nathia Gali and Ayubia. The Hazara Motorway has brought it within easy reach of Islamabad, and it is the natural stop on the way up the Karakoram Highway towards Naran and Gilgit-Baltistan.",
      "SLC Car Rental serves Abbottabad with self-drive cars and SUVs with experienced drivers. Families visiting students, tourists heading to the Galiyat, and travellers going further north all book with us.",
    ],
    landmarks: ["Hazara Motorway", "Nathia Gali and Ayubia", "Karakoram Highway", "Schools and colleges of Abbottabad"],
    pickup: "Pickup and delivery across Abbottabad and Mansehra, and transfers from Islamabad International Airport.",
    trips: [
      { to: "Abbottabad to Islamabad (Hazara Motorway)", time: "1.5–2 hr" },
      { to: "Abbottabad to Nathia Gali", time: "1–1.5 hr" },
      { to: "Abbottabad to Naran", time: "4–5 hr" },
      { to: "Abbottabad to Mansehra", time: "40–50 min" },
    ],
    faqs: [
      { q: "Which car is best for Nathia Gali from Abbottabad?", a: "Any car in summer. In winter, after snowfall, choose an SUV and one of our drivers." },
      { q: "Can I continue from Abbottabad to Naran or Hunza?", a: "Yes. Book a northern tour and keep the same car and driver the whole way." },
    ],
    mapQuery: "Abbottabad",
    carSlugs: ["toyota-fortuner", "kia-sportage", "toyota-corolla"],
    nearby: ["islamabad", "murree", "peshawar"],
  },
  {
    slug: "murree",
    name: "Murree",
    place: "Murree",
    kind: "destination",
    metaDescription: "Rent a car with driver for Murree from Islamabad or Rawalpindi. SUVs and sedans with drivers experienced on hill roads, day trips and overnight tours. Fixed quotes.",
    intro: [
      "Murree is the closest hill station to the twin cities, about 60 km from Islamabad via the Murree Expressway. In summer it is a cool escape, and in winter it draws crowds for the snow. Weekend traffic can be heavy, and winter roads need a driver who knows the hills and how to handle snow and ice.",
      "SLC runs Murree day trips and overnight tours with SUVs and sedans. Our drivers know the parking options near Mall Road, the routes to Patriata and Nathia Gali, and when to leave Islamabad to beat the weekend rush. For winter trips we recommend an SUV and check road conditions before departure.",
    ],
    landmarks: ["Mall Road", "Patriata chairlift", "Nathia Gali and the Galiyat", "Murree Expressway"],
    pickup: "We pick up from your address in Islamabad or Rawalpindi and bring you back the same day or after your stay.",
    trips: [
      { to: "Islamabad to Murree", time: "1.5–2 hr" },
      { to: "Murree to Nathia Gali", time: "1–1.5 hr" },
      { to: "Murree to Patriata", time: "30–40 min" },
      { to: "Islamabad Airport to Murree", time: "2–2.5 hr" },
    ],
    faqs: [
      { q: "Is an SUV necessary for Murree in winter?", a: "We strongly recommend one after snowfall. The Prado and Fortuner handle snowy roads far better than a sedan." },
      { q: "Does the price include the driver's stay for overnight trips?", a: "Yes. Outstation rates include the driver's stay and meals. Fuel and tolls are quoted separately." },
    ],
    mapQuery: "Mall Road, Murree",
    carSlugs: ["toyota-prado", "toyota-fortuner", "kia-sportage"],
    nearby: ["islamabad", "rawalpindi", "bahria-town"],
  },
];

export const locationBySlug = (slug: string) => locations.find((l) => l.slug === slug);

export const locationGroups: { kind: LocationKind; title: string }[] = [
  { kind: "city", title: "Cities" },
  { kind: "sector", title: "Islamabad sectors" },
  { kind: "area", title: "Islamabad & Rawalpindi areas" },
  { kind: "destination", title: "Trips & destinations" },
];

/** Photo for each location page. City photos are CC0 / public domain; Multan and Sialkot use SLC fleet tiles until real photos arrive. */
const locationImages: Record<string, string> = {
  islamabad: "islamabad", rawalpindi: "rawalpindi", lahore: "lahore", karachi: "karachi", peshawar: "peshawar",
  faisalabad: "faisalabad", multan: "multan", sialkot: "sialkot", gujranwala: "gujranwala", abbottabad: "abbottabad",
  murree: "murree", "islamabad-airport": "airport",
};
export const locationImage = (slug: string) => `/images/cities/${locationImages[slug] ?? "islamabad"}.webp`;
export const cities = () => locations.filter((l) => l.kind === "city");
