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
];

export function getJournalPosts(): JournalPost[] {
  return [...JOURNAL_POSTS].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
}

export function getJournalPost(slug: string): JournalPost | undefined {
  return JOURNAL_POSTS.find((post) => post.slug === slug);
}
