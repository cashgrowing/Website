import type { JournalPost } from "./types";

/**
 * Migrated from the Wix blog.
 *
 * The Wix post carried a personal byline in the visible text and in its
 * BlogPosting schema. The brief forbids naming anyone, so the post is authored
 * by the organisation. Wording is otherwise unchanged.
 *
 * Note both old Wix URLs served this same article, which is why the redirect
 * map in next.config.ts points /post/what-a-property-manager-does-costa-rica
 * and /post/property-management-long-term-rental-solutions at this one post.
 */
export const JOURNAL_POSTS: JournalPost[] = [
  {
    slug: "what-a-property-manager-does-costa-rica",
    title: "What a property manager does in Costa Rica",
    description:
      "What a property manager actually handles for a Costa Rica vacation home: ICT registration, IVA, guests, maintenance, and how the fees work.",
    publishedAt: "2026-09-06",
    readingMinutes: 6,
    excerpt:
      "Most people who buy a home on the South Pacific coast do not plan to become hoteliers. Here is the honest version of what a manager does, and what it costs.",
    body: [
      {
        kind: "p",
        text: "Most people who buy a home on the South Pacific coast do not plan to become hoteliers. They buy because they fell in love with the place.",
      },
      {
        kind: "p",
        text: "Then, somewhere between the closing and the first rainy season, they realize the house needs someone in it. Or at least someone watching it, twelve months a year.",
      },
      {
        kind: "p",
        text: "That is usually when the question comes up: what does a property manager actually do, and is it worth what they charge?",
      },
      { kind: "p", text: "Here is the honest version, written from Uvita." },

      { kind: "h2", text: "The part nobody warns you about: compliance" },
      {
        kind: "p",
        text: "If you rent your home to guests for stays under 30 days, you are not a homeowner with a side arrangement. Under Costa Rican law you are operating a lodging business, and the paperwork follows accordingly.",
      },
      {
        kind: "p",
        text: "ICT registration. Law 9742 requires anyone offering non-traditional lodging, which is what an Airbnb or VRBO listing is, to register with the Instituto Costarricense de Turismo. Registration runs through an online form, and the ICT issues a resolution and a user code. Operating without it is, in the words of the regulation, illegal operation of a lodging service.",
      },
      {
        kind: "p",
        text: "IVA. Short-term stays carry the 13% value-added tax. The guest pays it, but you are the one who has to collect it and remit it, and you need to be registered with Hacienda as a taxpayer to do that.",
      },
      {
        kind: "p",
        text: "Income tax. Rental income is declared to Hacienda. There is a simplified regime that works out to an effective 12.75% of gross rental income, and starting in 2026 the booking platforms are expected to withhold that amount directly from host payouts rather than leaving it to owners to declare it monthly.",
      },
      {
        kind: "p",
        text: "Electronic invoicing. Costa Rica requires facturas electrónicas. Every reservation needs a compliant invoice, and the records have to match what the platform actually paid you.",
      },
      {
        kind: "p",
        text: "Municipal patente. This one varies by canton. Osa has its own rules, and they are not the same as Aguirre or Pérez Zeledón.",
      },
      {
        kind: "p",
        text: "None of that is exotic. It is just relentless, it is mostly in Spanish, and it does not pause because you flew home in April. A good part of what a manager sells is simply that this runs without you.",
      },
      {
        kind: "note",
        text: "None of this is tax or legal advice. Rules change and every ownership structure is different, so confirm your own situation with a Costa Rican contador or attorney.",
      },

      { kind: "h2", text: "The part guests see" },
      {
        kind: "p",
        text: "Bookings are the visible half of the job, and the work is less glamorous than it sounds.",
      },
      {
        kind: "p",
        text: "The listing. Photographs that show the house honestly, a description that sets the right expectation, and a calendar that stays accurate on every channel. Most underperforming listings on this coast are not underpriced. They are badly photographed and vaguely written, so they attract the wrong guest and then collect the review that follows.",
      },
      {
        kind: "p",
        text: "Pricing. The South Pacific has a real season and a real green season, and inside those there are weeks that behave nothing like the weeks around them. Whale watching season, Semana Santa and the December holidays are not the same market as late September. One price all year leaves money on the table in high season and leaves the house empty in low.",
      },
      {
        kind: "p",
        text: "Guest communication. Inquiries answered in minutes, not hours. The guest is messaging four houses at once, and the first useful reply usually wins. Then arrival instructions, the gate code, where to buy groceries, which road is passable in a sedan and which is not, and the message at 9pm about the wifi.",
      },
      {
        kind: "p",
        text: "Turnovers. Cleaning between stays, laundry, restocking, and an actual inspection, not a glance. Somebody has to notice the cracked tile before the next guest does.",
      },

      { kind: "h2", text: "The part nobody sees" },
      { kind: "p", text: "This is where houses on this coast are won or lost." },
      {
        kind: "p",
        text: "The climate here is hard on buildings. Salt air, humidity, heavy rain for half the year, and an insect population with opinions about your woodwork. A house left alone for three months does not stay the way you left it.",
      },
      {
        kind: "p",
        text: "Ongoing care means pool chemistry and equipment, garden and grounds, and pressure washing before mold becomes a stain. It also means fumigation on a schedule instead of after a complaint, checking the roof before the rains rather than during them, and running the AC and the water system so seals do not dry out and pipes do not sit stagnant.",
      },
      {
        kind: "p",
        text: "It also means having vendors who answer. Anyone can call a plumber. Having a plumber who actually comes on a Sunday in October, because he has worked with you for years and expects to keep working with you, is the part that takes time to build and cannot be bought quickly.",
      },

      { kind: "h2", text: "What it costs" },
      {
        kind: "p",
        text: "Management pricing in Costa Rica is not standardized, which makes comparing quotes harder than it should be. Most structures are some combination of three things.",
      },
      {
        kind: "p",
        text: "A one-time setup fee before the house goes live. This covers the work that only happens once: building and optimizing the listing, professional photography, interior and exterior signage, and a guest book for the house.",
      },
      {
        kind: "p",
        text: "A flat monthly management fee for ongoing care, meaning the oversight, the vendor coordination, the maintenance schedule and the reporting.",
      },
      {
        kind: "p",
        text: "A commission on booking revenue, calculated as a percentage of what the house actually earns.",
      },
      {
        kind: "p",
        text: "Then there is the category that causes most of the friction between owners and managers: work outside the scope of management. Purchases on your behalf, capital repairs, bringing in a new vendor, hands-on labor by the team. At WildRoots that work is billed separately, and quoted or itemized before it starts wherever that is practical. Not as a line item on a statement three weeks later.",
      },
      {
        kind: "p",
        text: "Be careful with anyone quoting a single low percentage and nothing else. The work described above still has to happen, and if it is not in the fee it is either being billed somewhere you have not seen yet or it is not being done.",
      },

      { kind: "h2", text: "How to tell a real manager from a listing manager" },
      { kind: "p", text: "Five questions separate them quickly." },
      {
        kind: "p",
        text: "Who physically visits the house when there is no guest in it, and how often?",
      },
      {
        kind: "p",
        text: "Are you registered with the ICT, and are you handling IVA and electronic invoicing, or is that mine to sort out?",
      },
      {
        kind: "p",
        text: "What happens at 2am when the water pump fails with guests in the house?",
      },
      { kind: "p", text: "Which vendors are yours, and how long have you worked with them?" },
      {
        kind: "p",
        text: "Can I see a monthly statement from a house you already manage, with the numbers redacted?",
      },
      {
        kind: "p",
        text: "The answers tell you whether you are hiring someone who manages a property, or someone who manages a listing.",
      },

      { kind: "h2", text: "If you own a home on this coast" },
      {
        kind: "p",
        text: "WildRoots manages a small number of vacation homes in Uvita, Bahía Ballena, Dominical and Ojochal. We are selective about what we take on, because the level of care described above does not scale by adding houses faster than people.",
      },
      {
        kind: "p",
        text: "If you want to talk through what your home would need, tell us about it and we will give you a straight answer, including if the answer is that you do not need us.",
      },
    ],
    faqs: [
      {
        question: "Do I have to register with the ICT if I only rent a few weeks a year?",
        answer:
          "The registration requirement in Law 9742 is tied to offering non-traditional lodging, not to a minimum number of nights. Confirm your specific case with a Costa Rican attorney or contador.",
      },
      {
        question: "Who pays the 13% IVA, me or the guest?",
        answer:
          "The guest pays it as part of the price. The obligation to collect it and remit it to Hacienda sits with you as the operator.",
      },
      {
        question: "Does a property manager handle my taxes?",
        answer:
          "Managers can handle the operational side, meaning collecting IVA on stays, issuing electronic invoices and keeping records that line up with platform payouts. Filing your returns is work for your contador, and you should have one.",
      },
      {
        question: "What is the minimum for a house to be worth managing professionally?",
        answer:
          "It depends less on size than on how the house is set up and how often you are in the country. A two-bedroom that is guest ready and properly photographed can outperform a larger house that is neither.",
      },
      {
        question: "Do you manage long-term rentals?",
        answer:
          "WildRoots is built around short-term vacation rentals. That is a different business from long-term tenant placement, with different regulations, different tax treatment and a different day to day.",
      },
      {
        question: "Can I still use the house myself?",
        answer:
          "Yes. Owner stays get blocked on the calendar like any other booking. The house is yours.",
      },
    ],
    // The brief requires every post to link to at least two service pages.
    related: [
      { label: "Property management in Costa Rica", href: "/property-management-costa-rica" },
      { label: "How we charge", href: "/how-we-charge" },
      { label: "Airbnb management in Costa Rica", href: "/airbnb-management-costa-rica" },
    ],
  },
  {
    slug: "green-season-south-pacific-costa-rica",
    title: "Green season on the South Pacific coast",
    description:
      "What May to November actually looks like in Uvita and Dominical, what it does to a house, and why the quiet months are not the cheap months to skip.",
    publishedAt: "2026-09-09",
    readingMinutes: 5,
    excerpt:
      "The rain here has a shape. Knowing it is the difference between a house that holds its condition and one that quietly loses it.",
    body: [
      {
        kind: "p",
        text: "People call it the rainy season, which makes it sound like six months of grey. It is not that. On this coast the green season runs roughly May to November, and most of it looks like a bright morning, a hot early afternoon, and then rain that arrives with some conviction and moves on.",
      },
      {
        kind: "p",
        text: "For a guest that is often a better trip than February. For a house it is the half of the year that decides what condition it is in by Christmas.",
      },
      { kind: "h2", text: "What the rain does to a building" },
      {
        kind: "p",
        text: "Humidity is the real agent, not the rainfall. Air that sits at high humidity for months finds every surface that was not sealed properly and every corner where air does not move. Mold does not announce itself. It arrives as a faint grey bloom on a north-facing wall, behind a wardrobe, along the grout in a bathroom nobody used.",
      },
      {
        kind: "p",
        text: "Salt air does the rest. Anything metal within sight of the ocean is on a clock: hinges, screws, railings, the outdoor kitchen, the pool equipment, the bolts holding a gate on. A house three hundred metres from the water ages differently from one two kilometres inland, and it needs a different schedule.",
      },
      {
        kind: "p",
        text: "Then there is the water itself. Heavy rain finds the roof detail that was fine last year, the gutter that has filled with leaf litter, the drainage that was adequate until the hillside above shifted slightly. None of these are dramatic on the day they start.",
      },
      { kind: "h2", text: "Why an empty house is the harder case" },
      {
        kind: "p",
        text: "A booked house gets looked at constantly. Guests report the thing that is not working, cleaners see the room between stays, and the pool is being used and therefore being maintained.",
      },
      {
        kind: "p",
        text: "An empty house in September gets none of that. Air conditioning that never runs lets seals dry out. Water sitting in pipes goes stagnant. A pool without circulation turns over in days rather than weeks. The insects that live here treat an unoccupied building as an opportunity, and they are not subtle about it.",
      },
      {
        kind: "p",
        text: "This is why every house we look after is walked weekly whether it is booked or not. Not as a service line, but because the alternative is discovering three months of quiet deterioration in one visit.",
      },
      { kind: "h2", text: "What the green season is actually good for" },
      {
        kind: "p",
        text: "Rates are lower and availability is real. The hills are genuinely spectacular in a way they are not in March, when everything has been dry for months. The rivers run. The waterfalls are worth the drive rather than merely photogenic.",
      },
      {
        kind: "p",
        text: "And the whales are here. The southern humpback migration comes through from around August to October, which is the largest of the two runs that reach Bahía Ballena, and it falls squarely inside the green season. September and October bring the Festival de Ballenas y Delfines in Uvita.",
      },
      {
        kind: "p",
        text: "So the quiet months are not uniformly quiet. Priced as one flat low season, a house gives away the weeks that people will pay for and still sits empty in the weeks they will not.",
      },
      { kind: "h2", text: "What an owner should expect to happen" },
      {
        kind: "p",
        text: "Roofs and gutters checked before the rain rather than during it. Fumigation on a schedule instead of after a complaint. Pressure washing before mold sets into a stain that needs more than washing. Air conditioning and the water system run deliberately so the house does not seize up from disuse.",
      },
      {
        kind: "p",
        text: "None of that is glamorous and none of it shows up in a photograph. It is most of the difference between a house that is still worth what you paid for it and one that is quietly not.",
      },
    ],
    faqs: [
      {
        question: "Is the green season a bad time to visit Uvita?",
        answer:
          "No. The rain usually arrives in the afternoon rather than lasting all day, the hills are at their greenest, rates are lower, and the biggest whale migration of the year falls inside it.",
      },
      {
        question: "Does my house still need attention if nobody is staying in it?",
        answer:
          "More, not less. An occupied house is being watched constantly. An empty one in a humid climate loses condition quietly, which is why every house we manage is walked weekly whether it is booked or not.",
      },
      {
        question: "Should the price be the same all through the green season?",
        answer:
          "It should not. The whale months and the holiday weeks behave nothing like late September, and one flat low-season rate gives away the weeks people would have paid for.",
      },
    ],
    related: [
      { label: "Property management in Costa Rica", href: "/property-management-costa-rica" },
      { label: "Vacation rental management in Uvita", href: "/vacation-rental-management-uvita" },
      { label: "Whale season", href: "/whale-season" },
    ],
  },
  {
    slug: "what-a-weekly-house-check-covers",
    title: "What a weekly house check covers",
    description:
      "The difference between a manager who visits a house and one who inspects it, and the specific things worth looking at every week on this coast.",
    publishedAt: "2026-09-09",
    readingMinutes: 4,
    excerpt:
      "Anyone can say they check the house. Here is what is actually being looked at, and why each thing is on the list.",
    body: [
      {
        kind: "p",
        text: "Weekly inspection is the phrase every management company uses. It covers everything from a genuine walk-through to somebody driving past and glancing at the gate.",
      },
      {
        kind: "p",
        text: "The distinction matters, because on this coast the problems that cost real money all start small and all announce themselves early to anyone actually looking.",
      },
      { kind: "h2", text: "Water, in both directions" },
      {
        kind: "p",
        text: "The pool first: chemistry, water level, and whether the equipment is running as it should rather than merely running. A pool that has drifted takes days to correct and looks wrong in photographs the whole time.",
      },
      {
        kind: "p",
        text: "Then the water system. Pressure, the pump, the tank, and any filter that needs changing on a schedule rather than when someone notices the taste. Where a house is on its own supply this matters more, not less.",
      },
      {
        kind: "p",
        text: "And drainage. Gutters, downpipes, and where the water actually goes when it leaves the roof. In the green season this is the difference between rain being a non-event and rain finding its way inside.",
      },
      { kind: "h2", text: "The building itself" },
      {
        kind: "p",
        text: "Roof and ceilings, looked at properly, with particular attention to any stain that was not there last week. Wood, for the insects that eat it. Metal, for the corrosion that salt air guarantees. Seals and grout, for the early grey bloom that becomes a mold problem if it is left a month.",
      },
      {
        kind: "p",
        text: "Air conditioning gets run rather than assumed. So does anything else with a motor or a seal that suffers from sitting still.",
      },
      { kind: "h2", text: "The parts guests judge" },
      {
        kind: "p",
        text: "The connection, tested rather than trusted. Gas, because a house that runs out mid-stay generates exactly one kind of review. Lights, locks, gate mechanisms and the outdoor furniture that lives in weather all year.",
      },
      {
        kind: "p",
        text: "Grounds too. Growth here is fast enough that a garden left three weeks does not read as lush, it reads as neglected, and it is the first thing a guest sees.",
      },
      { kind: "h2", text: "What happens with what is found" },
      {
        kind: "p",
        text: "Small things get fixed. Larger things get quoted before anything starts, and itemised, rather than appearing on a statement three weeks later with no warning.",
      },
      {
        kind: "p",
        text: "The point of doing this weekly rather than monthly is not thoroughness for its own sake. It is that almost every expensive repair on this coast was a cheap one a few weeks earlier.",
      },
    ],
    faqs: [
      {
        question: "Does the house get checked when it is empty?",
        answer:
          "Yes. Every house is walked weekly whether it is booked or not. An empty house in this climate is the case that needs it most.",
      },
      {
        question: "Who pays for what gets found?",
        answer:
          "Ongoing care sits inside the monthly management fee. Work outside that is billed separately and quoted or itemised before it starts wherever that is practical.",
      },
      {
        question: "Will I hear about small problems or only big ones?",
        answer:
          "You get a clear statement every month, and anything that needs a decision comes to you before the work happens rather than after.",
      },
    ],
    related: [
      { label: "Property management in Costa Rica", href: "/property-management-costa-rica" },
      { label: "How we charge", href: "/how-we-charge" },
      { label: "Property manager in Dominical", href: "/property-manager-dominical" },
    ],
  },
  {
    slug: "pricing-a-vacation-rental-in-uvita",
    title: "Pricing a vacation rental in Uvita",
    description:
      "Why one rate all year costs a house money at both ends, and how the Uvita calendar actually breaks down across the seasons.",
    publishedAt: "2026-09-09",
    readingMinutes: 5,
    excerpt:
      "The most common pricing mistake on this coast is not charging too much or too little. It is charging the same thing in January and October.",
    body: [
      {
        kind: "p",
        text: "A house listed at one rate all year does two things wrong at once. It leaves money on the table in the weeks when people would have paid more, and it sits empty in the weeks when the price was the only thing standing between it and a booking.",
      },
      {
        kind: "p",
        text: "Both are invisible from the owner's side. An empty week in October does not send you a notification, and a week that sold instantly in February looks like success rather than a rate that was too low.",
      },
      { kind: "h2", text: "The Uvita calendar is not two seasons" },
      {
        kind: "p",
        text: "The shorthand is dry season from December to April and green season from May to November. That is true as weather and misleading as a pricing model, because inside each half there are weeks that behave nothing like the weeks around them.",
      },
      {
        kind: "p",
        text: "The December holidays and Semana Santa are their own market, and they are booked far in advance by people who are not comparing on price. Late September is a different business entirely.",
      },
      {
        kind: "p",
        text: "And sitting inside the supposedly quiet half is the southern whale migration from around August to October, plus the Festival de Ballenas y Delfines. Those weeks have real demand from people planning a trip around a specific thing they cannot get in March.",
      },
      { kind: "h2", text: "What actually moves the rate" },
      {
        kind: "p",
        text: "Proximity to the park entrances, honestly assessed. A short drive is a selling point. A steep road that needs the right vehicle is a fact that belongs in the listing, because a guest who arrives surprised leaves a review about it.",
      },
      {
        kind: "p",
        text: "A reliable connection, which is not optional any more for the longer stays that fill slow weeks. Air conditioning in the bedrooms. A pool that is genuinely well kept rather than merely present.",
      },
      {
        kind: "p",
        text: "And photography, which is not a pricing input in theory and is one in practice. Most underperforming houses here are not overpriced. They are badly photographed, so they never get compared to the houses they should be competing with.",
      },
      { kind: "h2", text: "Length of stay is a lever most owners ignore" },
      {
        kind: "p",
        text: "The slow weeks rarely fill with three-night bookings. They fill with someone staying a month, and a house priced only by the night is invisible to that person.",
      },
      {
        kind: "p",
        text: "Getting that right often does more for a year's revenue than any adjustment to the nightly rate in high season.",
      },
      { kind: "h2", text: "Why this is a job rather than a setting" },
      {
        kind: "p",
        text: "Prices on the platforms move constantly, the calendar has to stay accurate across every channel at once, and demand for a specific week becomes visible weeks before that week arrives, but only if somebody is watching.",
      },
      {
        kind: "p",
        text: "From another country, with a day job, that is not a realistic thing to keep up. It is a large part of what a manager is actually for.",
      },
    ],
    faqs: [
      {
        question: "When is high season in Uvita?",
        answer:
          "The dry season from December through April is the busiest stretch, and whale watching brings a second wave when the southern humpbacks arrive around September and October.",
      },
      {
        question: "Should I discount the whole green season?",
        answer:
          "No. The whale months sit inside it and carry real demand. Discounting May to November as one block gives away the weeks people would have paid for.",
      },
      {
        question: "Are monthly stays worth taking?",
        answer:
          "In the slow weeks, usually yes. Those weeks rarely fill with short bookings, and a house priced only by the night never reaches the people looking for a month.",
      },
    ],
    related: [
      { label: "Vacation rental management in Uvita", href: "/vacation-rental-management-uvita" },
      { label: "Airbnb management in Costa Rica", href: "/airbnb-management-costa-rica" },
      { label: "How we charge", href: "/how-we-charge" },
    ],
  },
];

export function getJournalPosts(): JournalPost[] {
  return [...JOURNAL_POSTS].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
}

export function getJournalPost(slug: string): JournalPost | undefined {
  return JOURNAL_POSTS.find((post) => post.slug === slug);
}
