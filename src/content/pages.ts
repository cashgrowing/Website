import type { MarketingPage } from "./types";

/**
 * Copy migrated from the Wix site, wording preserved.
 *
 * Two edits were required by the brief and applied throughout:
 *   1. No person is named. The About page's founder sentence was rewritten to
 *      speak as the team without changing what it says.
 *   2. Inline "read about X" links became `related` links, so every page still
 *      carries its internal links without stranding half-sentences in the prose.
 */

const OWNER_FAQ_FEES = {
  question: "What does property management cost in Costa Rica?",
  answer:
    "Most structures combine three things: a one time setup fee before the house goes live, a flat monthly management fee, and a commission on booking revenue. Work outside the scope of management is billed separately and quoted before it starts wherever that is practical.",
};

export const MARKETING_PAGES: MarketingPage[] = [
  {
    path: "/property-management-costa-rica",
    title: "Property management in Costa Rica",
    description:
      "Boutique vacation rental property management in Uvita, Dominical and Ojochal. WildRoots handles pricing, marketing, maintenance and guest care.",
    h1: "Property Management Costa Rica",
    lede: "Boutique management for vacation homeowners seeking reliable local oversight, stronger rental performance, and long term asset protection.",
    audience: "owner",
    sections: [
      {
        kind: "prose",
        heading: "Managing a vacation property in Costa Rica requires local expertise",
        paragraphs: [
          "Owning a vacation home in Costa Rica offers exceptional lifestyle and investment opportunities.",
          "However, managing a property remotely can quickly become complex due to operational coordination, maintenance challenges, guest communication demands, and evolving short term rental market dynamics.",
          "WildRoots provides hands on local property management designed to simplify ownership while helping improve rental income performance and protect long term property value.",
        ],
      },
      {
        kind: "prose",
        heading: "Understanding the Costa Rica vacation rental market",
        paragraphs: [
          "Costa Rica continues to attract international travelers seeking nature, wellness, and luxury experiences.",
          "In regions such as Uvita, Dominical, and Ojochal, demand for well maintained vacation homes with professional guest support remains strong.",
          "Successful property performance depends on strategic pricing adjustments, professional marketing positioning, consistent property condition monitoring, and high quality guest experiences that generate repeat bookings.",
          "Working with an experienced local management partner helps homeowners navigate these factors with greater confidence.",
        ],
      },
      {
        kind: "list",
        heading: "Comprehensive property management services",
        intro:
          "WildRoots provides integrated support across all operational areas of vacation rental ownership.",
        items: [
          {
            title: "Rental management",
            body: "Coordination of reservations, guest communication, check in logistics, cleaning supervision, and listing performance monitoring.",
          },
          {
            title: "Marketing and revenue strategy",
            body: "Listing optimization, professional photography coordination, pricing analysis, and exposure across major booking platforms.",
          },
          {
            title: "Property maintenance oversight",
            body: "Routine inspections, preventative maintenance planning, and coordination of trusted local professionals to ensure property condition standards.",
          },
          {
            title: "Guest experience management",
            body: "Responsive assistance during stays, issue resolution, and experience curation designed to enhance guest satisfaction and property reputation.",
          },
        ],
      },
    ],
    faqs: [
      OWNER_FAQ_FEES,
      {
        question: "Which areas do you cover?",
        answer:
          "Uvita, Bahía Ballena, Dominical, Dominicalito and Ojochal, on the South Pacific coast. We keep the portfolio small on purpose, so we only take on homes we can actually look after.",
      },
      {
        question: "Can I still use the house myself?",
        answer:
          "Yes. Owner stays are blocked on the calendar like any other booking. It is your house, and using it is part of why you bought it.",
      },
      {
        question: "Do you handle ICT registration, IVA and electronic invoicing?",
        answer:
          "Short term rentals in Costa Rica have to be registered with the ICT under Law 9742, charge 13% IVA on stays and issue electronic invoices, and some cantons also require a municipal patente. How much of that we run day to day depends on how your ownership is set up, so we agree it before we start.",
      },
    ],
    related: [
      { label: "Vacation rental management in Uvita", href: "/vacation-rental-management-uvita" },
      { label: "Property manager in Dominical", href: "/property-manager-dominical" },
      { label: "Airbnb management in Costa Rica", href: "/airbnb-management-costa-rica" },
      { label: "How we charge", href: "/how-we-charge" },
    ],
  },

  {
    path: "/vacation-rental-management-uvita",
    title: "Vacation rental management in Uvita",
    description:
      "Local vacation rental management in Uvita and Bahía Ballena. WildRoots handles pricing, guests, cleaning and maintenance for homes near Marino Ballena.",
    h1: "Vacation Rental Management in Uvita",
    lede: "Boutique management for vacation homes in Uvita and Bahía Ballena, from the Whale's Tail to the hills above the bay.",
    audience: "owner",
    sections: [
      {
        kind: "prose",
        heading: "Managing a vacation home in Uvita takes a team that lives here",
        paragraphs: [
          "Uvita is the center of Bahía Ballena: the town at the entrance to Marino Ballena National Park and the base for whale watching, Caño Island trips and the waterfalls up the Uvita River. Guests book here in numbers from December to April and again for the southern whale migration from August to October.",
          "Running a rental here well means handling the practical side of a coastal, rainforest climate: salt air, humidity, heavy green season rain, power and water interruptions, and pool, garden and cleaning teams who show up in the low season as well as the high season.",
          "WildRoots is based on this coast. We manage a small number of homes in Uvita and Bahía Ballena so that each one gets regular inspections, quick responses and an owner who always knows what is happening at the property.",
        ],
      },
      {
        kind: "prose",
        heading: "What guests look for in Uvita, and how we price for it",
        paragraphs: [
          "Uvita draws families, couples and small groups who want to walk the Whale's Tail at low tide, take a boat out to see humpbacks or Caño Island, and come back to a private pool. Homes within a short drive of the park entrances, with reliable Wi-Fi, air conditioning in the bedrooms and a well kept pool, book first and hold their rates longest.",
          "We price each home against the Uvita calendar: dry season demand, Semana Santa, the September whale peak and the Festival de Ballenas y Delfines, and the quiet weeks of May, June and October. Listings on Airbnb, VRBO and direct channels are kept current, with photography that shows the home honestly and a house manual guests actually use.",
        ],
      },
      {
        kind: "list",
        heading: "Property management services in Uvita",
        intro: "Everything a home in Bahía Ballena needs to stay guest ready, handled by a local team.",
        items: [
          {
            title: "Rental management",
            body: "Reservations, guest messaging in English and Spanish, check in coordination and cleaning supervision between stays for homes in Uvita and Bahía Ballena.",
          },
          {
            title: "Marketing and revenue strategy",
            body: "Listing optimization for Airbnb and VRBO, professional photography, seasonal pricing built around the Uvita calendar, and exposure across booking platforms.",
          },
          {
            title: "Property maintenance oversight",
            body: "Routine inspections, preventative maintenance for pools, AC and roofs in a coastal climate, and coordination of vetted Uvita vendors.",
          },
          {
            title: "Guest experience management",
            body: "Local recommendations for Marino Ballena, whale tours and restaurants, responsive help during stays, and follow up that earns reviews and repeat bookings.",
          },
        ],
      },
    ],
    faqs: [
      {
        question: "When is high season in Uvita?",
        answer:
          "The dry season from December through April is the busiest stretch, and whale watching brings a second wave when the southern humpbacks arrive around September and October. The green season is quieter and prices differently. A house held at one rate all year gives up money in high season and sits empty in low.",
      },
      {
        question: "Do you manage homes up in the hills, not just near the beach?",
        answer:
          "Yes. A good part of Uvita and Bahía Ballena sits above the bay, and those homes usually have the better view. Access is the trade off. We will tell you honestly whether the road to your house will cost you bookings, and how to set expectations in the listing so guests arrive prepared instead of annoyed.",
      },
      {
        question: "How long until my home is ready to rent?",
        answer:
          "Once we have done a walk through and agreed on what the house needs, guest ready is usually a matter of weeks rather than months. The work that takes the time is the setup: photography, the listing itself, signage and the guest book. Skipping that part is what leaves a house underbooked later.",
      },
    ],
    related: [
      { label: "Stay in Uvita", href: "/stay/uvita" },
      { label: "Vacation rentals in Bahía Ballena", href: "/vacation-rentals-bahia-ballena" },
      { label: "Property management in Costa Rica", href: "/property-management-costa-rica" },
      { label: "How we charge", href: "/how-we-charge" },
    ],
  },

  {
    path: "/property-manager-dominical",
    title: "Property manager in Dominical",
    description:
      "Local property management for vacation homes in Dominical, Escaleras and Dominicalito. WildRoots handles guests, cleaning, maintenance and pricing.",
    h1: "Property Manager in Dominical",
    lede: "Boutique management for vacation homes in Dominical, Escaleras and Dominicalito, from the surf break to the ridgeline views.",
    audience: "owner",
    sections: [
      {
        kind: "prose",
        heading: "A vacation home in Dominical needs a manager who knows the hills",
        paragraphs: [
          "Dominical is the surf town of Costa Rica's South Pacific coast: a beach break that runs year round, the Barú river mouth, Nauyaca Waterfalls up the road and the forest of Hacienda Barú at the edge of town. Above it, the Escaleras ridge holds many of the best ocean view homes on this coast, and Dominicalito sits just south with its calmer bay.",
          "Managing a home here is different from managing one in town. Escaleras roads are steep and rough in the green season, water and power can be off grid or fragile, and the humidity works on wood, fabric and electronics every day the house sits empty. Guests still expect strong Wi-Fi, a cool house and a clear pool when they arrive after a long drive.",
          "WildRoots is based on this coast, fifteen minutes from Dominical. We manage a small number of homes between Dominical and Ojochal with regular inspections, vetted local vendors and guest support in English and Spanish, so the house is ready whether the next arrival is a surf group or a family heading to the waterfalls.",
        ],
      },
      {
        kind: "prose",
        heading: "Who books Dominical, and how we price for it",
        paragraphs: [
          "Dominical draws surfers, yoga and wellness travelers, digital nomads on longer stays, and couples who want a quiet hillside view with a busy beach town below. Homes with a reliable connection, an ocean view and an easy road to the beach book first, and monthly stays fill the slow weeks.",
          "We price each home against the Dominical calendar: dry season from December to April, the surf crowds of the green season, and the whale months of September and October in Bahía Ballena next door. Listings on Airbnb, VRBO and direct channels are kept current, with a house manual that covers the road, the water system and the wildlife.",
        ],
      },
      {
        kind: "list",
        heading: "Property management services in Dominical",
        intro:
          "Everything a hillside or beach home in Dominical needs to stay guest ready, handled by a local team.",
        items: [
          {
            title: "Rental management",
            body: "Reservations, guest messaging in English and Spanish, check in coordination for hard to find hillside homes, and cleaning supervision between stays.",
          },
          {
            title: "Marketing and revenue strategy",
            body: "Listing optimization for Airbnb and VRBO, photography that sells the view, seasonal pricing built around the Dominical calendar, and exposure across booking platforms.",
          },
          {
            title: "Property maintenance oversight",
            body: "Routine inspections, humidity and mold control, pool, AC, water system and generator checks, and coordination of vetted Dominical vendors.",
          },
          {
            title: "Guest experience management",
            body: "Directions guests can actually follow, recommendations for surf, Nauyaca and restaurants, responsive help during stays, and follow up that earns reviews.",
          },
        ],
      },
    ],
    faqs: [
      {
        question: "Do you cover Escaleras and Dominicalito too?",
        answer:
          "Yes. Dominical, Dominicalito and the Escaleras hills are all inside the area we work, along with Uvita, Bahía Ballena and Ojochal further south.",
      },
      {
        question: "What does the steep access in the Escaleras hills mean for management?",
        answer:
          "It changes how the house has to be run. Steep access means vendors take longer to reach you, deliveries are harder, and guests in a small rental car will struggle if nobody warned them. We say it plainly in the listing, which filters out the wrong guest before they book instead of after they arrive.",
      },
      {
        question: "What happens if something breaks while guests are in the house?",
        answer:
          "Somebody answers, and somebody goes. Guest messages are handled around the clock in English and Spanish, and we call vendors we already work with rather than whoever answers first. A pump or a pool problem at night is exactly the moment an owner living abroad cannot fix anything from a phone.",
      },
    ],
    related: [
      { label: "Stay in Dominical", href: "/stay/dominical" },
      { label: "Property management in Costa Rica", href: "/property-management-costa-rica" },
      { label: "Vacation rental management in Uvita", href: "/vacation-rental-management-uvita" },
      { label: "How we charge", href: "/how-we-charge" },
    ],
  },

  {
    path: "/airbnb-management-costa-rica",
    title: "Airbnb management in Costa Rica",
    description:
      "Airbnb and VRBO management for vacation homes in Uvita, Dominical and Ojochal. WildRoots runs the listing, guests, cleaning and pricing for you.",
    h1: "Airbnb Management in Costa Rica",
    lede: "Full service Airbnb and VRBO management for vacation homes on the South Pacific coast, from Dominical to Ojochal.",
    audience: "owner",
    sections: [
      {
        kind: "prose",
        heading: "Your listing is live. Now it needs someone to run it.",
        paragraphs: [
          "An Airbnb listing in Costa Rica competes with hundreds of homes for the same guests, and the platform rewards the ones that answer fast, keep an accurate calendar, avoid cancellations and collect steady reviews. A beautiful home that is slow to reply, or listed with the wrong photos and prices, sits empty in weeks when its neighbors are full.",
          "Running the listing well is a daily job. Prices change with the season, guest questions arrive at all hours, cleaners and check ins have to line up with every turnover, and every issue during a stay needs an answer before it turns into a review. From another country, or even another town, that is hard to do consistently.",
          "WildRoots takes over the listing on Airbnb and VRBO and runs it as if it were our own. Messages are answered around the clock in English and Spanish, usually within minutes. Cleaning, check ins and maintenance are coordinated by a team that lives on this coast. Reviews are requested after every stay, and damage claims are filed through the platform when something goes wrong.",
        ],
      },
      {
        kind: "prose",
        heading: "What we do inside your Airbnb account",
        paragraphs: [
          "Listing setup and optimization: a title and description written for search, professional photography, accurate amenities, house rules and a guest guide. Calendar sync across Airbnb, VRBO and direct bookings so the home is never double booked. Pricing adjusted for dry season, Semana Santa, whale season and the slow months.",
          "Guest communication from inquiry to checkout, screening of booking requests, coordination of cleaning and check ins, and support during the stay. After checkout we request the review, report any damage through the platform's resolution process and prepare the home for the next arrival. Owners receive a clear monthly statement.",
        ],
      },
      {
        kind: "list",
        heading: "Airbnb management services",
        intro: "Everything an Airbnb or VRBO listing needs to earn its rating, handled by a local team.",
        items: [
          {
            title: "Rental management",
            body: "Reservations, calendar sync across Airbnb, VRBO and direct channels, guest messaging in English and Spanish, and cleaning coordination for every turnover.",
          },
          {
            title: "Marketing and revenue strategy",
            body: "Listing optimization, professional photography, seasonal pricing and occupancy tracking, and exposure across the platforms that bring guests to the South Pacific coast.",
          },
          {
            title: "Property maintenance oversight",
            body: "Inspections between stays, preventative maintenance for pools, AC and appliances, and vetted local vendors so issues are fixed before the next guest arrives.",
          },
          {
            title: "Guest experience management",
            body: "Fast responses during stays, local recommendations, review requests after every checkout, and damage claims filed through the platform when needed.",
          },
        ],
      },
    ],
    faqs: [
      {
        question: "Do I keep my own Airbnb account?",
        answer:
          "Yes. The listing and the account stay yours, and the payouts go to you. We work inside it: the calendar, pricing, guest messages, reviews and the day to day. You keep visibility on everything rather than handing your property over to a black box.",
      },
      {
        question: "Do you manage VRBO and other channels too?",
        answer:
          "Yes. VRBO runs alongside Airbnb and the calendars stay in sync, so the same night cannot be sold twice. Listing on more than one channel widens the pool of guests without adding work for you.",
      },
      {
        question: "Who answers guests at night?",
        answer:
          "Guest messages are answered around the clock, in English and Spanish. Inquiries in particular get answered fast, because a guest shopping four houses at once usually books the first one that gives them a useful reply.",
      },
    ],
    related: [
      { label: "Property management in Costa Rica", href: "/property-management-costa-rica" },
      { label: "Vacation rental management in Uvita", href: "/vacation-rental-management-uvita" },
      { label: "Property manager in Dominical", href: "/property-manager-dominical" },
      { label: "How we charge", href: "/how-we-charge" },
    ],
  },

  {
    path: "/vacation-rentals-bahia-ballena",
    title: "Vacation rentals in Bahía Ballena",
    description:
      "Private vacation homes in Bahía Ballena near Marino Ballena National Park, cared for by a local team. Whale season, the Whale's Tail and quiet stays.",
    h1: "Vacation Rentals in Bahía Ballena",
    lede: "Private homes near Marino Ballena National Park, cared for by a team that lives here.",
    audience: "guest",
    sections: [
      {
        kind: "prose",
        heading: "Stay where the whales come",
        paragraphs: [
          "Bahía Ballena is the bay in front of Uvita, on Costa Rica's South Pacific coast. At its center is Marino Ballena National Park and the Whale's Tail, a sandbar shaped like a tail that appears at low tide. Humpback whales come here twice a year to give birth: from the north early in the year, and in far greater numbers from the south between August and October.",
          "The homes WildRoots looks after sit within a short drive of the park entrances, between the beach and the hills above the bay. They are private houses, not hotel rooms: your own kitchen, pool and terrace, with the town's restaurants, the weekly feria and the boat tours a few minutes away.",
          "Every home is cared for by a team that lives here. You get a guest guide with directions and local recommendations, and a WhatsApp line answered around the clock in English and Spanish, usually within minutes.",
        ],
      },
      {
        kind: "prose",
        heading: "When to visit Bahía Ballena",
        paragraphs: [
          "December to April is the dry season: clear skies, calm sea and the busiest weeks of the year, so book early. May to November is the green season, with afternoon rain, lush hills and lower rates. September and October are the peak of the southern whale migration and the Festival de Ballenas y Delfines in Uvita.",
          "From any of our homes you can walk the Whale's Tail at low tide, take a boat to see whales and dolphins or out to Caño Island, visit Nauyaca Waterfalls near Dominical, or drive to Ojochal for dinner. Ask us and we will point you to the tour operators and restaurants we trust.",
        ],
      },
      {
        kind: "list",
        heading: "What every stay includes",
        intro: "Private homes in Bahía Ballena, looked after by people who live here.",
        items: [
          {
            title: "Guest support",
            body: "A WhatsApp line answered around the clock in English and Spanish, help with check in, and a guest guide that covers the house, the road and the area.",
          },
          {
            title: "Local recommendations",
            body: "Whale and dolphin tours, Marino Ballena, Nauyaca Waterfalls, restaurants and the weekly feria, recommended by people who live here.",
          },
          {
            title: "A home that is ready",
            body: "Cleaned between every stay, pool and AC checked before you arrive, and a local team that fixes things quickly if something comes up.",
          },
          {
            title: "Direct contact",
            body: "Message us on WhatsApp for availability, longer stays or questions before you book. We answer quickly, in English and Spanish.",
          },
        ],
      },
    ],
    faqs: [
      {
        question: "When can I see whales in Bahía Ballena?",
        answer:
          "Humpbacks reach this bay twice a year. A smaller northern group arrives earlier in the year, and the larger southern group comes through around September and October. That second run is the one most people plan a trip around.",
      },
      {
        question: "Do I need a 4x4 to reach the house?",
        answer:
          "For some houses yes, for others no. Roads here vary a lot between the flat land near the bay and the hills above it, and the rainy months make the difference bigger. Ask us about the specific house before you book your car.",
      },
      {
        question: "How do I check availability?",
        answer:
          "Message us on WhatsApp and tell us your dates and how many people are coming. We will tell you what is open, what suits the group, and what the house is actually like, rather than sending you a brochure.",
      },
    ],
    related: [
      { label: "All homes", href: "/homes" },
      { label: "Stay in Uvita", href: "/stay/uvita" },
      { label: "Whale season", href: "/whale-season" },
      { label: "Vacation rental management in Uvita", href: "/vacation-rental-management-uvita" },
    ],
  },

  {
    path: "/whale-season",
    title: "Whale season in Uvita and Bahía Ballena",
    description:
      "When humpbacks pass Uvita, where to watch them, and where to stay. Two migrations a year reach Bahía Ballena, and the southern run is the big one.",
    h1: "Whale Season on the Ballena Coast",
    lede: "Two migrations a year reach this bay. The southern run, from August to October, is the one most people plan a trip around.",
    audience: "guest",
    sections: [
      {
        kind: "prose",
        heading: "Why the whales come here",
        paragraphs: [
          "Bahía Ballena is the bay in front of Uvita, and at its center is Marino Ballena National Park and the Whale's Tail, a sandbar shaped like a tail that appears at low tide. Humpback whales come here to give birth in warm, sheltered water.",
          "They arrive twice a year, from opposite ends of the planet. A smaller northern group passes earlier in the year. The southern group comes through in far greater numbers between August and October, which is why that second run is the one the season is named for.",
        ],
      },
      {
        kind: "list",
        heading: "When to come",
        intro: "Two windows, and they are not the same trip.",
        items: [
          {
            title: "August to October: the southern migration",
            body: "The larger of the two runs, and the peak of the season. September and October also bring the Festival de Ballenas y Delfines in Uvita. This is green season, so expect afternoon rain, lush hills and lower rates on the houses.",
          },
          {
            title: "Earlier in the year: the northern migration",
            body: "A smaller group, overlapping the dry season from December through April. Fewer whales, but clear skies, calm sea and the busiest weeks of the year for everything else. Book early.",
          },
        ],
      },
      {
        kind: "prose",
        heading: "Seeing them, and what else is here",
        paragraphs: [
          "Boat tours leave from the park entrances and run out to the whales and dolphins, and further out to Caño Island. Ask us and we will point you to the operators we trust rather than whoever is selling on the beach that morning.",
          "Around the whale watching there is the Whale's Tail itself, walkable at low tide, Nauyaca Waterfalls up the road near Dominical, and Ojochal for dinner. The tide table decides more of your day here than the clock does.",
        ],
      },
    ],
    faqs: [
      {
        question: "When exactly is whale season in Uvita?",
        answer:
          "Humpbacks reach this bay twice a year. A smaller northern group arrives earlier in the year, and the larger southern group comes through around September and October. That second run is the one most people plan a trip around.",
      },
      {
        question: "Is green season a bad time to visit?",
        answer:
          "Not for this. The southern whale migration falls inside the green season, and the rain usually comes in the afternoon rather than all day. The hills are at their greenest and the houses cost less than they do in February.",
      },
      {
        question: "How do I book a home for whale season?",
        answer:
          "Message us on WhatsApp with your dates and how many people are coming. September and October fill up, so the further ahead you ask, the more choice you have.",
      },
    ],
    related: [
      { label: "Vacation rentals in Bahía Ballena", href: "/vacation-rentals-bahia-ballena" },
      { label: "All homes", href: "/homes" },
      { label: "Stay in Uvita", href: "/stay/uvita" },
      { label: "Stay in Dominical", href: "/stay/dominical" },
    ],
  },

  {
    path: "/about",
    title: "About WildRoots",
    description:
      "A small property management company in Uvita, on Costa Rica's South Pacific coast, built around a few homes done well rather than many done fast.",
    h1: "About WildRoots",
    lede: "A small property management company on Costa Rica's South Pacific coast, built around a few homes done well.",
    audience: "owner",
    sections: [
      {
        kind: "prose",
        heading: "Why WildRoots exists",
        paragraphs: [
          "Most property management companies grow by adding homes. WildRoots was set up to do the opposite: keep the number of homes small enough that every one of them gets real oversight, fast communication and a guest experience that protects its long term value.",
          "We are based in Uvita, in the middle of the coast between Dominical and Ojochal. That matters here. Salt air, humidity and a long green season work on a house every day it sits empty, and guests who have driven hours from San José expect a cool house, a clean pool and a working connection when they arrive. Someone has to be close enough to make sure of it.",
          "The team also works in real estate on this coast, so we see both sides of a vacation home: what it is worth and what it earns. The homes in our care are managed to the standard we would want for our own.",
        ],
      },
      {
        kind: "prose",
        heading: "How we work",
        paragraphs: [
          "Guest messages are answered around the clock in English and Spanish, usually within minutes. Every job goes to a vetted local vendor. Reviews are requested after every stay, damage claims are filed through the platform when needed, and owners receive a clear monthly statement.",
          "Our fees are disclosed up front in three components: a one-time setup fee before launch, a flat monthly management fee, and a booking commission on the revenue generated. Work outside normal operations is quoted and itemized separately before it begins. No surprises in the statement.",
        ],
      },
      {
        kind: "list",
        heading: "What we care about",
        intro: "The things that shape how WildRoots is run.",
        items: [
          {
            title: "Quality over volume",
            body: "A limited number of homes, so each one gets inspections, attention and honest reporting instead of a place in a queue.",
          },
          {
            title: "Honest presentation",
            body: "Photography and listings that show the home as it is, so the guest who books is the guest who leaves a good review.",
          },
          {
            title: "Local employment",
            body: "Cleaners, technicians and guides from the communities between Dominical and Ojochal, paid for skilled work close to home.",
          },
          {
            title: "Care for the guest",
            body: "A guest guide, a WhatsApp line and local recommendations, because a well cared for guest is what keeps a home booked.",
          },
        ],
      },
    ],
    faqs: [],
    related: [
      { label: "Property management in Costa Rica", href: "/property-management-costa-rica" },
      { label: "How we charge", href: "/how-we-charge" },
      { label: "Contact WildRoots", href: "/contact" },
    ],
  },

  {
    path: "/how-we-charge",
    title: "How we charge",
    description:
      "Three components, disclosed up front: a one-time setup fee, a flat monthly management fee, and a commission on booking revenue. No surprise line items.",
    h1: "How We Charge",
    lede: "Three components, disclosed before you sign, and nothing that appears for the first time on a statement.",
    audience: "owner",
    sections: [
      {
        kind: "list",
        heading: "The three components",
        intro:
          "Management pricing in Costa Rica is not standardized, which makes comparing quotes harder than it should be. Ours is set out in three parts.",
        items: [
          {
            title: "A one-time setup fee",
            body: "Paid once, before the house goes live. It covers the work that only happens at the start: building and optimizing the listing, professional photography, interior and exterior signage, and the guest book for the house.",
          },
          {
            title: "A flat monthly management fee",
            body: "For ongoing care: the oversight, the vendor coordination, the maintenance schedule and the reporting. It is charged whether the house is booked that month or not, because the work happens either way.",
          },
          {
            title: "A commission on booking revenue",
            body: "A percentage of what the house actually earns, so the part of our income that moves is the part tied to how well the house performs.",
          },
        ],
      },
      {
        kind: "prose",
        heading: "Work outside the scope of management",
        paragraphs: [
          "This is the category that causes most of the friction between owners and managers: purchases on your behalf, capital repairs, bringing in a new vendor, hands-on labor by the team.",
          "That work is billed separately, and quoted or itemized before it starts wherever that is practical. Not as a line item on a statement three weeks later.",
        ],
      },
      {
        kind: "prose",
        heading: "A word on comparing quotes",
        paragraphs: [
          "Be careful with anyone quoting a single low percentage and nothing else. Setup, oversight, maintenance coordination and guest support still have to happen. If that work is not in the fee, it is either being billed somewhere you have not seen yet, or it is not being done.",
        ],
      },
    ],
    faqs: [
      OWNER_FAQ_FEES,
      {
        question: "Is the monthly fee charged when the house is empty?",
        answer:
          "Yes. Inspections, pool and garden oversight, vendor coordination and reporting continue whether a guest is in the house or not, and an empty house in this climate needs that attention most.",
      },
    ],
    related: [
      { label: "Property management in Costa Rica", href: "/property-management-costa-rica" },
      { label: "About WildRoots", href: "/about" },
      { label: "Contact WildRoots", href: "/contact" },
    ],
  },

  {
    path: "/contact",
    title: "Contact WildRoots",
    description:
      "Reach WildRoots on WhatsApp, phone or email. Boutique property management and vacation rentals in Uvita, Dominical and Ojochal, Costa Rica.",
    h1: "Contact WildRoots",
    lede: "WhatsApp is the fastest way to reach us. We answer in English and Spanish, usually within minutes.",
    audience: "owner",
    sections: [
      {
        kind: "prose",
        heading: "How to reach us",
        paragraphs: [
          "WhatsApp and phone: +506 8734-7178. Email: info@wildrootscr.com. We are based in Uvita, on Costa Rica's South Pacific coast, and work with homes from Dominical to Ojochal.",
          "If you own a home, tell us where it is, how you use it yourself and whether it is already listed on Airbnb or VRBO. That is enough for a first conversation.",
          "If you are a guest, send your dates, the number of people and the area you prefer, and we will tell you what is available. If you are already staying with us, the WhatsApp line in your guest guide is answered around the clock.",
        ],
      },
      {
        kind: "prose",
        heading: "What happens after you write",
        paragraphs: [
          "Owners: we reply with a few questions, then arrange a walk-through of the property. After the visit you get a plain assessment of what the home needs and a proposal with three components: a one-time setup fee, a flat monthly management fee and a booking commission. Work outside normal operations is quoted separately.",
          "Guests: we confirm availability, send the details of the home and answer any question before you book. Vendors, cleaners and local businesses who would like to work with WildRoots are welcome to write as well; we keep a small network of trusted partners on this coast.",
        ],
      },
      {
        kind: "list",
        heading: "Who we work with",
        intro: "Owners, guests and local partners, from Dominical to Ojochal.",
        items: [
          {
            title: "Property owners",
            body: "Vacation homes in Uvita, Dominical and Ojochal that need local oversight, guest support and a manager who reports clearly every month.",
          },
          {
            title: "Real estate agents",
            body: "Agents with clients buying a vacation home on this coast who will need management after closing. Send them our way and we will take it from there.",
          },
          {
            title: "Local vendors",
            body: "Cleaners, pool and garden crews, electricians and other trades who take pride in their work and want steady jobs with a team that respects their trade.",
          },
          {
            title: "Guests",
            body: "Travelers looking for a private home near Marino Ballena National Park. See our Bahía Ballena rentals or message us with your dates.",
          },
        ],
      },
    ],
    faqs: [],
    related: [
      { label: "Vacation rentals in Bahía Ballena", href: "/vacation-rentals-bahia-ballena" },
      { label: "Property management in Costa Rica", href: "/property-management-costa-rica" },
      { label: "How we charge", href: "/how-we-charge" },
    ],
  },
];

export function getMarketingPage(path: string): MarketingPage | undefined {
  return MARKETING_PAGES.find((page) => page.path === path);
}
