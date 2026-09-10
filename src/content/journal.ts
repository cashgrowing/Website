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
  {
    slug: "what-to-check-before-buying-on-this-coast",
    title: "What to check before buying here",
    description:
      "The practical things that decide whether a vacation home on Costa Rica's South Pacific coast rents well: road, water, power, connection and orientation.",
    publishedAt: "2026-09-09",
    readingMinutes: 6,
    excerpt:
      "Two houses with the same view and the same bedroom count can perform completely differently. Usually it comes down to things you can check before you buy.",
    body: [
      {
        kind: "p",
        text: "Most people choose a house here on the view. That is a reasonable way to choose somewhere to live and an unreliable way to choose something that will be rented.",
      },
      {
        kind: "p",
        text: "Two houses on the same ridge, with the same bedrooms and the same ocean in front of them, can earn very different amounts. The difference is almost never the view. It is a handful of practical things, and all of them can be checked before you sign.",
      },
      { kind: "h2", text: "The road" },
      {
        kind: "p",
        text: "This is the single biggest one, and the easiest to underestimate on a dry January afternoon in a borrowed 4x4.",
      },
      {
        kind: "p",
        text: "Ask what the last kilometre is like in October. Ask who maintains it, because on this coast the answer is often the neighbours rather than the municipality, and that is a real ongoing arrangement rather than a formality.",
      },
      {
        kind: "p",
        text: "A steep or rough access road does not make a house unrentable. It narrows the guest. Families in a small sedan will not book it, or worse, will book it and arrive unhappy. That has to be said plainly in the listing, which means fewer bookings at a higher standard rather than more bookings and bad reviews.",
      },
      { kind: "h2", text: "Water and power" },
      {
        kind: "p",
        text: "Find out where the water actually comes from: a municipal supply, an ASADA, a well, or a spring shared with neighbours. Each has different reliability and different obligations, and guests notice within a day.",
      },
      {
        kind: "p",
        text: "Ask about pressure at the top of the house, not just at the tap by the door. Ask whether there is storage, and how long it lasts.",
      },
      {
        kind: "p",
        text: "For power, ask how often it goes and for how long. A house without a backup in an area that loses power regularly is a house that will occasionally have to cancel a booking, which costs more than the generator would have.",
      },
      { kind: "h2", text: "The connection" },
      {
        kind: "p",
        text: "Fibre reaches a lot of this coast now and stops abruptly in places. Test it on the property rather than trusting a coverage map, and test it in the room someone would actually work in.",
      },
      {
        kind: "p",
        text: "This matters more every year. Longer stays are what fill the quiet weeks, and the people who take them are working. A house that cannot support that is competing only for short holiday bookings, which is the most crowded part of the market.",
      },
      { kind: "h2", text: "Which way it faces" },
      {
        kind: "p",
        text: "Orientation decides how hot the house gets and how much the air conditioning runs. West-facing glass with no shade is spectacular at sunset and expensive at three in the afternoon.",
      },
      {
        kind: "p",
        text: "It also decides how much weather the building takes. The side facing the prevailing wind and rain ages faster, and that is where maintenance concentrates for as long as you own it.",
      },
      { kind: "h2", text: "What it would take to rent it" },
      {
        kind: "p",
        text: "A house that someone has lived in is rarely guest ready. Beds, linens for turnover rather than for a household, a kitchen equipped for people who did not bring anything, lockable owner storage, and signage.",
      },
      {
        kind: "p",
        text: "None of it is expensive individually. Together it is a real number, and it is better known before you buy than discovered afterwards.",
      },
      {
        kind: "p",
        text: "If you are looking at something specific and want a straight answer about how it would actually perform, send it to us. Sometimes the answer is that it will do well, and sometimes it is that the road will cost you more bookings than the view will win.",
      },
      {
        kind: "note",
        text: "This is practical guidance, not legal or tax advice. Ownership structures, permits and the rules on short-term rental vary, so confirm your own situation with a Costa Rican attorney or contador.",
      },
    ],
    faqs: [
      {
        question: "Does a rough access road make a house unrentable?",
        answer:
          "No, it narrows the guest. It has to be stated plainly in the listing so the wrong booking is filtered out before arrival rather than after it.",
      },
      {
        question: "How important is internet speed for a vacation rental here?",
        answer:
          "More every year. Longer stays fill the quiet weeks and the people taking them are working, so a house that cannot support that competes only for short holiday bookings.",
      },
      {
        question: "Can you look at a house before I buy it?",
        answer:
          "Yes. Send us what you are considering and we will give you a straight answer about how it would perform, including if the answer is that it would not do well.",
      },
    ],
    related: [
      { label: "Property management in Costa Rica", href: "/property-management-costa-rica" },
      { label: "How we charge", href: "/how-we-charge" },
      { label: "Vacation rental management in Uvita", href: "/vacation-rental-management-uvita" },
    ],
  },
  {
    slug: "setting-up-a-house-for-its-first-guests",
    title: "Setting up a house for guests",
    description:
      "The one-time work that happens before a vacation home goes live, and why skipping it is what leaves a house underbooked a year later.",
    publishedAt: "2026-09-09",
    readingMinutes: 5,
    excerpt:
      "The setup is the part owners most want to skip and the part that most decides how the house performs. Here is what it actually involves.",
    body: [
      {
        kind: "p",
        text: "There is a moment, after the paperwork and before the first booking, when a house is technically ready and practically not.",
      },
      {
        kind: "p",
        text: "The work that closes that gap happens once. It is also the work owners most often want to compress, because it costs money before anything has earned any. Compressing it is the most reliable way to end up with a house that underperforms for years.",
      },
      { kind: "h2", text: "Photography, which is not optional" },
      {
        kind: "p",
        text: "Most underperforming houses on this coast are not overpriced. They are badly photographed, so they are never compared against the houses they should be competing with.",
      },
      {
        kind: "p",
        text: "Good photography here means shooting at the right time of day for the orientation of the house, showing the spaces guests actually use rather than every room in order, and being honest. A photograph that oversells produces a booking and then a review that costs more than the booking was worth.",
      },
      { kind: "h2", text: "The listing itself" },
      {
        kind: "p",
        text: "A title and description written for how people search, accurate amenities, house rules that are enforceable, and the awkward facts stated plainly: the road, the stairs, the noise from the road below, whatever it is.",
      },
      {
        kind: "p",
        text: "Saying the awkward thing costs a few bookings and prevents the reviews that cost far more.",
      },
      { kind: "h2", text: "Equipping it for turnover rather than for living" },
      {
        kind: "p",
        text: "A house set up for a family is not set up for guests. Linens have to exist in multiples so a turnover does not wait on laundry. Kitchens need the things people did not bring. There has to be somewhere lockable for the owner's own belongings.",
      },
      {
        kind: "p",
        text: "Small hardware matters more than it sounds: a lockbox or a code entry that works when the power is out, exterior lighting that makes an arrival after dark feel safe, and signage so the house can be found at all.",
      },
      { kind: "h2", text: "The guest book" },
      {
        kind: "p",
        text: "Directions someone can follow in the dark. How the water system works. Which road is passable in a sedan. The wifi, printed somewhere they will look. What to do if the power goes. The restaurants worth the drive.",
      },
      {
        kind: "p",
        text: "It reads like a small thing. It removes most of the messages a manager would otherwise field at nine at night, and it makes guests feel looked after by people who know the place.",
      },
      { kind: "h2", text: "Why it is a one-time fee" },
      {
        kind: "p",
        text: "All of this happens once, before the house goes live, which is why it is charged as a one-time setup fee rather than folded into a percentage. A commission-only arrangement has to recover that cost somewhere, and it will.",
      },
      {
        kind: "p",
        text: "Roughly speaking, guest ready is a matter of weeks rather than months once the walk-through is done and everyone agrees what the house needs. The part that takes the time is this, not the paperwork.",
      },
    ],
    faqs: [
      {
        question: "How long until my house is ready to rent?",
        answer:
          "Usually weeks rather than months once we have walked through it and agreed what it needs. The setup work is what takes the time, not the administration.",
      },
      {
        question: "Why is setup charged separately instead of in the commission?",
        answer:
          "Because it happens once, before the house earns anything. An arrangement that hides it in a percentage still has to recover the cost, just less visibly.",
      },
      {
        question: "Can I use my own photographer?",
        answer:
          "Yes, provided the result shows the house honestly and covers the spaces guests actually use. The listing lives or dies on it, so it is worth getting right rather than getting cheap.",
      },
    ],
    related: [
      { label: "How we charge", href: "/how-we-charge" },
      { label: "Property management in Costa Rica", href: "/property-management-costa-rica" },
      { label: "Airbnb management in Costa Rica", href: "/airbnb-management-costa-rica" },
    ],
  },
  {
    slug: "why-houses-here-get-bad-reviews",
    title: "Why houses here get bad reviews",
    description:
      "Most bad reviews on this coast are not about the house. They are about expectations nobody set, and almost all of them are preventable.",
    publishedAt: "2026-09-09",
    readingMinutes: 4,
    excerpt:
      "Read enough reviews of homes on this coast and the same handful of complaints appear. Very few of them are about the house itself.",
    body: [
      {
        kind: "p",
        text: "Read enough reviews of vacation homes on the South Pacific coast and the same complaints repeat. Almost none of them are that the house was bad.",
      },
      {
        kind: "p",
        text: "They are that something was different from what the guest expected. That is a listing problem and a communication problem, and both are fixable before anyone arrives.",
      },
      { kind: "h2", text: "The drive" },
      {
        kind: "p",
        text: "Someone books a hillside house, rents the cheapest car at the airport, and arrives in the dark on a road they were not warned about. Whatever the house is like, that review is already written.",
      },
      {
        kind: "p",
        text: "Say it in the listing. Say what vehicle is needed and in which months. Send directions before arrival that describe landmarks rather than trusting the map application, which is confidently wrong in places here.",
      },
      { kind: "h2", text: "Wildlife, which is the reason they came" },
      {
        kind: "p",
        text: "Guests want toucans and monkeys. They are less prepared for the insects that come with a forest, or the gecko in the bathroom, or something on the roof at five in the morning.",
      },
      {
        kind: "p",
        text: "A house that is treated on a schedule and a guest book that explains what lives here turns most of that from a complaint into the story they tell at home.",
      },
      { kind: "h2", text: "Heat and rain" },
      {
        kind: "p",
        text: "Somebody books in October imagining February. Rain in the green season is not a fault in the house, but it becomes one if the listing sold clear skies.",
      },
      {
        kind: "p",
        text: "Similarly, air conditioning in bedrooms only is fine, and it is fine because it was stated. Not stated, it reads as something broken.",
      },
      { kind: "h2", text: "The response time" },
      {
        kind: "p",
        text: "Most problems during a stay are small. What turns a small problem into a bad review is nobody answering.",
      },
      {
        kind: "p",
        text: "A guest who reports a pool problem at eight in the evening and gets a reply in minutes, and someone at the house the next morning, usually mentions it as a positive. The same problem met with silence overnight becomes the whole review.",
      },
      { kind: "h2", text: "What this means for an owner" },
      {
        kind: "p",
        text: "The instinct is to present the house as flawlessly as possible. It is the wrong instinct. Every awkward fact stated in the listing costs a few bookings from people who would have been unhappy, and protects the rating that determines whether anyone finds the house at all.",
      },
      {
        kind: "p",
        text: "A house with an honest listing and a number that answers will outperform a better house with neither.",
      },
    ],
    faqs: [
      {
        question: "Should I mention the bad road in my listing?",
        answer:
          "Yes. It costs a few bookings from guests who would have arrived unhappy, and protects the rating that determines whether anyone finds the house at all.",
      },
      {
        question: "How quickly are guests answered?",
        answer:
          "Around the clock, in English and Spanish, usually within minutes. Most problems during a stay are small; what turns one into a bad review is nobody answering.",
      },
      {
        question: "What do guests complain about most here?",
        answer:
          "Access roads they were not warned about, wildlife they did not expect, and weather that did not match the listing. All three are set by expectations rather than by the house.",
      },
    ],
    related: [
      { label: "Airbnb management in Costa Rica", href: "/airbnb-management-costa-rica" },
      { label: "Property management in Costa Rica", href: "/property-management-costa-rica" },
      { label: "Vacation rentals in Bahía Ballena", href: "/vacation-rentals-bahia-ballena" },
    ],
  },
  {
    slug: "humpback-whale-season-uvita",
    title: "Humpback whale season in Uvita",
    description:
      "Bahía Ballena gets two humpback migrations a year: a smaller northern group from January to March and a larger southern group from August to October.",
    publishedAt: "2026-09-05",
    readingMinutes: 5,
    excerpt:
      "Most whale watching destinations get one season. Bahía Ballena gets two, and between them they give this coast one of the longest humpback seasons anywhere.",
    body: [
      { kind: "p", text: "Most whale watching destinations get one season. Bahía Ballena gets two." },
      {
        kind: "p",
        text: "Every year, humpback whales from opposite ends of the Pacific travel to the warm, sheltered water in front of Uvita to give birth and raise their calves. One group comes down from the north at the start of the year. A much larger group comes up from the south in the second half.",
      },
      {
        kind: "p",
        text: "Between them, they give Costa Rica's South Pacific coast one of the longest humpback seasons anywhere in the world, and they are the reason the bay in front of our homes is called Bahía Ballena in the first place.",
      },
      {
        kind: "p",
        text: "If you own a vacation home here, or you are planning a trip, this is what the calendar looks like and how to make the most of it.",
      },

      { kind: "h2", text: "Why humpbacks come to Bahía Ballena" },
      {
        kind: "p",
        text: "Humpbacks feed in cold, nutrient rich water near the poles, then migrate thousands of kilometers to warm tropical water to mate and calve. Newborn calves have very little blubber, so they need warm, calm water while they build strength for the long trip back.",
      },
      {
        kind: "p",
        text: "The bay protected by the Whale's Tail sandbar, inside Marino Ballena National Park, is exactly that kind of nursery: shallow, warm and relatively sheltered. A mother and calf will typically stay in the area for weeks.",
      },
      {
        kind: "p",
        text: "That is why sightings here are not a lucky one-off. During the season, boats leaving Uvita see whales on most trips, and on calm days at low tide you can sometimes spot spouts from the sandbar itself.",
      },

      { kind: "h2", text: "The northern migration: January to March" },
      {
        kind: "p",
        text: "The first group arrives from the North Pacific, from feeding grounds off Oregon, Washington and British Columbia. They begin showing up in December, and the best months are January and February, with sightings tapering off in March.",
      },
      {
        kind: "p",
        text: "This is the smaller of the two populations, so a tour in February is quieter and more variable than one in September.",
      },
      {
        kind: "p",
        text: "It also lines up with Costa Rica's dry season, which means glassy water, clear skies and the most reliable boat conditions of the year. For guests who want whales plus guaranteed beach weather, this is the window.",
      },

      { kind: "h2", text: "The southern migration: August to October" },
      {
        kind: "p",
        text: "The second group is the big one. These whales travel up from Antarctic and southern Chilean waters, a migration of roughly 5,000 to 8,000 kilometers, and they start arriving in July. Numbers build through August, peak in September and stay strong into October, with some animals still around in early November.",
      },
      {
        kind: "p",
        text: "Mothers with calves are common in this season, and the breaching, tail slapping and spy hopping that people come for happen most often now.",
      },
      {
        kind: "p",
        text: "It coincides with the green season, so expect afternoon rain, lush hills and lower nightly rates than December to April, which makes it one of the better value windows of the year for a family trip.",
      },

      { kind: "h2", text: "The Whale and Dolphin Festival" },
      {
        kind: "p",
        text: "Uvita marks the southern peak with the Festival de Ballenas y Delfines, held each September in Bahía Ballena with support from the Costa Rican Tourism Institute. The 16th edition ran September 4 to 6, 2026, with sustainable whale watching tours, a craft market, workshops and local food.",
      },
      {
        kind: "p",
        text: "If your travel dates are flexible, the first two weeks of September put you in the middle of the peak and the festival at the same time.",
      },

      { kind: "h2", text: "How to see them responsibly" },
      {
        kind: "p",
        text: "Marino Ballena is a national park and whale watching inside it is regulated. Licensed boats keep a distance of around 100 meters, limit time with each group and never separate a mother from her calf.",
      },
      {
        kind: "p",
        text: "Tours leave from Uvita in the morning when the sea is calmest, run about three hours and usually combine whales with dolphins, the Whale's Tail and a stop at Isla Ballena. Book a day or two ahead in September; the good operators fill up.",
      },

      { kind: "h2", text: "What this means if you own a home here" },
      {
        kind: "p",
        text: "For owners, the whale calendar is a booking calendar. The southern season fills what would otherwise be the slowest months on the coast, and it is the single strongest reason guests choose Bahía Ballena over other beach towns in August, September and October.",
      },
      {
        kind: "p",
        text: "Listings that name the season clearly, quote real dates and recommend a tour partner convert better in those months than listings that only talk about the beach.",
      },
      {
        kind: "p",
        text: "WildRoots manages a small number of vacation homes in Bahía Ballena, and we build the whale season into how each home is listed, priced and prepared for guests.",
      },
    ],
    faqs: [
      {
        question: "When is whale season in Uvita?",
        answer:
          "Twice a year. A smaller northern group is best from January to February, and the larger southern group builds through August, peaks in September and stays strong into October.",
      },
      {
        question: "Which migration is better to plan a trip around?",
        answer:
          "September and October for numbers and behaviour, since mothers with calves are common and breaching is most frequent. January and February for calmer seas and dry season weather with fewer whales.",
      },
      {
        question: "When is the Festival de Ballenas y Delfines?",
        answer:
          "Each September in Bahía Ballena. The first two weeks of September put you in the middle of the southern peak and the festival at the same time.",
      },
    ],
    related: [
      { label: "Whale season on the Ballena coast", href: "/whale-season" },
      { label: "Vacation rentals in Bahía Ballena", href: "/vacation-rentals-bahia-ballena" },
      { label: "Vacation rental management in Uvita", href: "/vacation-rental-management-uvita" },
      { label: "Property management in Costa Rica", href: "/property-management-costa-rica" },
    ],
  },
];

export function getJournalPosts(): JournalPost[] {
  return [...JOURNAL_POSTS].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
}

export function getJournalPost(slug: string): JournalPost | undefined {
  return JOURNAL_POSTS.find((post) => post.slug === slug);
}
