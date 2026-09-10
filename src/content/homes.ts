import type { Faq } from "./types";

/**
 * Editorial content for /homes.
 *
 * The page was a heading and a grid of cards - the main guest landing page on
 * the site, and the thinnest thing on it. Every claim here already appears in
 * approved copy elsewhere: booking direct, no platform fee, weekly checks,
 * 24/7 guest support in English and Spanish.
 */
export const HOMES_INTRO: string[] = [
  "Every house on this page is looked after by the same local team. Not a portfolio we list and forget: a small number of homes between Dominical and Ojochal that get walked weekly whether a guest is in them or not.",
  "They are private houses rather than hotel rooms. Your own kitchen, your own pool in most cases, and a terrace to sit on when the afternoon rain comes through. The town, the national park entrances and the boats are all a short drive away.",
  "You can book any of them through Airbnb or VRBO if you prefer. Booking here goes to the same team and the same house without the platform's cut in the middle.",
];

export type HomesPoint = { title: string; body: string };

export const BOOKING_DIRECT: HomesPoint[] = [
  {
    title: "No platform fee",
    body: "The service fee a booking site adds at checkout is typically a meaningful share of the total. Booking direct removes it. Same house, same dates, same team.",
  },
  {
    title: "You are talking to the people who run the house",
    body: "Not a support queue in another country. The number that answers your booking question is the number that answers at nine at night when the wifi is being difficult.",
  },
  {
    title: "Longer stays are easier to arrange",
    body: "Monthly and multi-week stays are simpler to price sensibly in a conversation than through a platform's calendar. If you are coming for a month, ask.",
  },
  {
    title: "We will tell you if a house is wrong for you",
    body: "The road, the stairs, the noise, the month. A platform has no incentive to talk you out of a booking. We would rather lose it than collect the review that follows.",
  },
];

export const EVERY_STAY: HomesPoint[] = [
  {
    title: "A house that is actually ready",
    body: "Cleaned between every stay, with the pool and the air conditioning checked before you arrive rather than after you complain.",
  },
  {
    title: "A number that answers",
    body: "WhatsApp, around the clock, in English and Spanish. Usually within minutes, including the parts of the night when things break.",
  },
  {
    title: "A guest guide that is worth reading",
    body: "Directions you can follow in the dark, how the water system works, which road is passable in a sedan, and what to do if the power goes.",
  },
  {
    title: "Recommendations from people who live here",
    body: "The restaurants worth the drive, the tour operators we trust, and the ones we would not put a guest on a boat with.",
  },
  {
    title: "Someone nearby if something goes wrong",
    body: "A local team and vendors who already work with us, rather than whoever answers the phone first on a Sunday.",
  },
];

export const HOMES_FAQS: Faq[] = [
  {
    question: "Are these the same homes that are on Airbnb?",
    answer:
      "Yes. The same houses, run by the same team. Booking here removes the platform's service fee and puts you in direct contact with the people who look after the property.",
  },
  {
    question: "How do I check availability?",
    answer:
      "Each home links through to our booking engine for live dates and checkout. If you would rather ask a person, message us on WhatsApp with your dates and party size and we will tell you what is open.",
  },
  {
    question: "Can I book a longer stay?",
    answer:
      "Yes, and the quiet months are where longer stays make most sense for everyone. Monthly rates are easier to agree in a conversation than through a platform calendar, so ask.",
  },
  {
    question: "Do I need a 4x4?",
    answer:
      "For some houses yes, for others no, and the green season widens the difference. It depends on the specific property, and we will tell you plainly before you book a vehicle.",
  },
  {
    question: "What if something goes wrong during my stay?",
    answer:
      "Message the WhatsApp line in your guest guide. It is answered around the clock, and the vendors we call are people we already work with rather than whoever is available.",
  },
];
