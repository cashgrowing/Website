import type { Faq } from "./types";

/**
 * Editorial content for each /stay/[area] page.
 *
 * Everything here is either verifiable geography (a national park, a waterfall,
 * a wetland) or a fact already approved in the existing site copy. No tour
 * operator, restaurant or guide is named: the company's own wording is "ask us
 * and we will point you to the operators we trust", and naming a third party on
 * a page that ranks is a recommendation the business then has to stand behind.
 */
export type NearbyPlace = {
  name: string;
  /** One sentence. What it is and why someone would go. */
  body: string;
  /** Protected land, regulated activity or conservation site. */
  protected?: boolean;
};

export type Practicality = { name: string; body: string };

export type AreaContent = {
  slug: string;
  name: string;
  /** Under 155 characters. */
  description: string;
  lede: string;
  intro: string[];
  nearbyHeading: string;
  nearby: NearbyPlace[];
  /** Airports, ordered nearest first. Drive times are deliberately approximate. */
  gettingHere: Practicality[];
  faqs: Faq[];
};

/**
 * Advice that applies the length of this coast, so it is written once and shown
 * on every area page rather than repeated three times in the content.
 *
 * It is the honest sort: the things a local would actually tell a guest on
 * arrival, including the ones that are slightly awkward to say.
 */
export const GOOD_TO_KNOW: Practicality[] = [
  {
    name: "Do not leave anything in the car",
    body: "Not in the boot, not under a seat, not for five minutes at a trailhead or a beach car park. Break-ins here are opportunistic and a visibly empty car is rarely touched.",
  },
  {
    name: "Swim where the lifeguards are",
    body: "The rip currents on this coast are real and they catch strong swimmers. On beaches with towers, swim between them; on beaches without, ask before you go in.",
  },
  {
    name: "Check the tide before you walk out",
    body: "The Whale's Tail sandbar and the sea caves at Ventanas are only reachable at low tide, and the water comes back faster than people expect. Check the table, and check it again before walking back.",
  },
  {
    name: "Carry some cash",
    body: "Cards work in most restaurants and supermarkets. The feria, smaller sodas, parking attendants and some park entrances are easier with colones.",
  },
  {
    name: "Ask about the road before you book a car",
    body: "Whether a house needs a 4x4 depends on the specific house and the month. We will tell you honestly rather than let you discover it on arrival in the dark.",
  },
];

export const AREA_CONTENT: AreaContent[] = [
  {
    slug: "uvita",
    name: "Uvita",
    description:
      "Staying in Uvita: Marino Ballena National Park, the Whale's Tail sandbar, whale season and the waterfalls, with homes looked after by a local team.",
    lede: "The town at the entrance to Marino Ballena National Park, and the middle of the Costa Ballena.",
    intro: [
      "Uvita sits at the centre of the stretch of coast between Dominical and Ojochal, and it is the practical base for most of what people come here to do. The national park entrances are minutes away, the boats leave from here, and there is enough town to buy groceries and eat well without it feeling like a resort strip.",
      "The bay in front of it is Bahía Ballena, named for the humpbacks that come here twice a year to calve. At low tide the sandbar at the centre of the park emerges in the shape of a whale's tail, which you can walk out onto.",
      "Homes here divide roughly into two kinds: the flat land near the bay, minutes from the park and the town, and the hills above it, where the views are better and the road matters more. We will tell you honestly which one a house is before you book.",
    ],
    nearbyHeading: "What is close by",
    nearby: [
      {
        name: "Marino Ballena National Park",
        body: "The protected marine park in front of town, and the reason whale watching here is regulated rather than a free-for-all. Four entrances, each onto a different stretch of beach.",
        protected: true,
      },
      {
        name: "The Whale's Tail",
        body: "A sandbar inside the park that appears at low tide in the shape of a tail. Check the tide table before you walk out, and check it again before you walk back.",
        protected: true,
      },
      {
        name: "Whale and dolphin trips",
        body: "Boats leave in the morning when the sea is calmest. Inside the park, licensed operators keep their distance and limit time with each group.",
        protected: true,
      },
      {
        name: "Uvita Waterfall",
        body: "A short walk from town, with a natural rock slide into the pool at the bottom. Busiest in the middle of the day.",
      },
      {
        name: "Caño Island Biological Reserve",
        body: "A full-day boat trip offshore, and the best diving and snorkelling on this coast: clear water, reef, rays and turtles. Visitor numbers are capped, so book a few days ahead.",
        protected: true,
      },
      {
        name: "The weekly feria",
        body: "The farmers market, and the easiest way to stock a kitchen with what is actually in season.",
      },
    ],
    gettingHere: [
      {
        name: "La Managua (XQP), Quepos",
        body: "The closest airport, roughly an hour and a half north on the coastal road. Small domestic flights from San José, and the shortest drive of any option.",
      },
      {
        name: "San José (SJO)",
        body: "The main international airport. Around three to four hours by road, most of it straightforward, and the route most people take.",
      },
      {
        name: "Palmar Sur (PMZ)",
        body: "A small domestic airport to the south, closer if you are staying at the Ojochal end of the coast.",
      },
    ],
    faqs: [
      {
        question: "What is the closest airport to Uvita?",
        answer:
          "La Managua (XQP) at Quepos is the nearest, roughly an hour and a half north. Most visitors fly into San José (SJO) instead and drive down in three to four hours, or take a domestic hop to Quepos or Palmar Sur.",
      },
      {
        question: "Is Uvita a good base for the whole Costa Ballena?",
        answer:
          "Yes. It sits in the middle, so Dominical is a short drive north and Ojochal a short drive south, and the national park entrances are minutes away.",
      },
      {
        question: "Do I need a 4x4 to stay in Uvita?",
        answer:
          "It depends entirely on the house. Homes on the flat land near the bay are usually fine in any car; homes in the hills often are not, particularly in the green season. Ask us about the specific house before you book a vehicle.",
      },
      {
        question: "When should I come for whales?",
        answer:
          "The southern migration peaks in September and October and is the bigger of the two. A smaller northern group is best in January and February, which is also the driest, calmest time of year.",
      },
    ],
  },

  {
    slug: "dominical",
    name: "Dominical",
    description:
      "Staying in Dominical: the surf beach, Nauyaca Waterfalls, Hacienda Barú and the Escaleras ridge, with homes looked after by a local team.",
    lede: "The surf town at the north end of the coast, with the ridge above it holding the best views.",
    intro: [
      "Dominical is a beach break that works most of the year, a main street of sodas and surf shops, and the river mouth of the Barú at one end of it. It draws surfers, people on longer stays who work from here, and families using it as a base for the waterfalls inland.",
      "Above the town, the Escaleras ridge climbs steeply and holds many of the best ocean view homes on this coast. Dominicalito sits just south with a calmer bay and easier swimming.",
      "The trade-off here is access. Escaleras roads are steep and rough in the green season, and a small rental car will struggle. We say so plainly in every listing, because a guest who arrives surprised leaves a review about it.",
    ],
    nearbyHeading: "What is close by",
    nearby: [
      {
        name: "Playa Dominical",
        body: "A beach break that runs year round and gets serious at times. Strong rip currents; swim near the lifeguard towers rather than wherever the beach is empty.",
      },
      {
        name: "Nauyaca Waterfalls",
        body: "Two falls on the Barú river, reached on foot, on horseback or by 4x4. The lower pool is large enough to swim in properly.",
      },
      {
        name: "Hacienda Barú National Wildlife Refuge",
        body: "A private refuge at the edge of town with trails through primary and secondary forest, a mangrove and a bird tower. Good for sloths and early morning birds.",
        protected: true,
      },
      {
        name: "The Escaleras ridge",
        body: "The road climbing from the coast, with long views over the water. Steep enough to matter in the wet months.",
      },
      {
        name: "Dominicalito",
        body: "A smaller, calmer bay just south, better for swimming and for a quiet afternoon than the main beach.",
      },
      {
        name: "The Barú river mouth",
        body: "Where the river meets the sea at the north end of the beach. Worth walking at low tide for the birds.",
      },
    ],
    gettingHere: [
      {
        name: "La Managua (XQP), Quepos",
        body: "The closest airport to Dominical, roughly an hour north. Domestic flights from San José.",
      },
      {
        name: "San José (SJO)",
        body: "The international arrival point, around three hours by road and the most common way in.",
      },
    ],
    faqs: [
      {
        question: "What is the closest airport to Dominical?",
        answer:
          "La Managua (XQP) at Quepos, roughly an hour north. Most people fly into San José (SJO) and drive down in around three hours.",
      },
      {
        question: "Is Dominical good for beginners learning to surf?",
        answer:
          "It can be, with an instructor and on the right day, but it is a beach break with real rip currents rather than a gentle learner's wave. Ask before you plan a week around it.",
      },
      {
        question: "What is the road to Escaleras actually like?",
        answer:
          "Steep and rough, and rougher in the green season. Many homes up there genuinely need a 4x4. We will tell you which ones do rather than let you find out on arrival.",
      },
      {
        question: "How far is Dominical from Uvita?",
        answer:
          "A short drive south on the coastal road, which makes it easy to stay in one and visit the other. The national park entrances are all closer to Uvita.",
      },
    ],
  },

  {
    slug: "ojochal",
    name: "Ojochal",
    description:
      "Staying in Ojochal: the food scene, Playa Tortuga, the Térraba-Sierpe wetlands and the quiet southern end of the Costa Ballena.",
    lede: "The quiet southern end of the coast, and the one people come to for the food.",
    intro: [
      "Ojochal is the last of the three towns heading south, and the least busy. It has an unusual reputation for its restaurants: a small village with a genuinely international food scene, which is not what most people expect from this coast.",
      "It draws a guest who has usually been to Costa Rica before and is choosing quiet over convenience. The beaches nearby are emptier, the roads into the hills are steeper, and the forest starts closer to the houses.",
      "It is also the practical jumping-off point for the Térraba-Sierpe wetlands and the top of the Osa Peninsula, both of which are a different kind of trip from a morning on the beach.",
    ],
    nearbyHeading: "What is close by",
    nearby: [
      {
        name: "The restaurants",
        body: "The reason Ojochal is known at all. A small village with a disproportionate number of good kitchens, several of them worth the drive from Uvita.",
      },
      {
        name: "Playa Tortuga",
        body: "A long, quiet beach at the river mouth, with a turtle nesting programme run locally. Nesting season brings hatchling releases some evenings.",
        protected: true,
      },
      {
        name: "Térraba-Sierpe wetlands",
        body: "One of the largest mangrove systems in Central America and a protected wetland. Boat trips go in for the birds, crocodiles and the mangrove itself.",
        protected: true,
      },
      {
        name: "Playa Ventanas",
        body: "Sea caves at the north end of the beach that you can walk into at low tide, and should be well clear of before it turns.",
      },
      {
        name: "The road to the Osa",
        body: "Ojochal is the last easy stop before the peninsula, which is a longer trip and a wilder one.",
      },
    ],
    gettingHere: [
      {
        name: "Palmar Sur (PMZ)",
        body: "The closest airport to Ojochal, a short drive south. Small domestic flights.",
      },
      {
        name: "La Managua (XQP), Quepos",
        body: "Roughly two hours north on the coastal road, and the better option if you are also spending time further up the coast.",
      },
      {
        name: "San José (SJO)",
        body: "The international arrival point, around four hours by road.",
      },
    ],
    faqs: [
      {
        question: "What is the closest airport to Ojochal?",
        answer:
          "Palmar Sur (PMZ) is nearest, a short drive south. La Managua (XQP) at Quepos is roughly two hours north, and San José (SJO) is around four hours by road.",
      },
      {
        question: "Is Ojochal too quiet for a first trip to Costa Rica?",
        answer:
          "It can be, if you want a town with things happening in the evening. It suits people who want space, good food and easy access to the beaches without the traffic.",
      },
      {
        question: "How far is Ojochal from the national park?",
        answer:
          "A short drive north to the Marino Ballena entrances at Uvita, and the coastal road makes it straightforward. Several quieter beaches are closer than that.",
      },
      {
        question: "Do I need a 4x4 in Ojochal?",
        answer:
          "For some houses in the hills, yes, and the green season makes the difference bigger. Homes closer to the main road are usually fine in any car.",
      },
    ],
  },
];

export function getAreaContent(slug: string): AreaContent | undefined {
  return AREA_CONTENT.find((area) => area.slug === slug);
}
