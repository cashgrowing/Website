import styles from "./OwnerPoints.module.css";

/**
 * What an owner gets, every month - and three plain facts about how the team
 * works. Lives on the owner pages only; the homepage speaks to guests.
 *
 * Four items because there are four things; the numbers are a count, not a
 * sequence. Every line is something the team actually does - nothing here
 * is aspiration, and nothing is a figure that was not supplied.
 */
const POINTS = [
  {
    title: "Weekly walk-through",
    body: "Pools, gardens, roofs, filters, gas. Problems get found before a guest does.",
  },
  {
    title: "Guest hosting, 24/7",
    body: "Every message answered in English and Spanish, including the ones at 2am.",
  },
  {
    title: "Maintenance and vendors",
    body: "Quoted before it starts, done by people we already work with, itemized on your statement.",
  },
  {
    title: "One monthly statement",
    body: "Income, costs and what was done, on one page.",
  },
];

const FACTS = [
  { fact: "Answered within minutes", detail: "24/7 guest communication in English and Spanish" },
  { fact: "Walked every week", detail: "Booked or not, someone from the team is in your house" },
  { fact: "Three fees, no surprises", detail: "Setup, flat monthly, and a share of what we earn you" },
];

export function OwnerPoints() {
  return (
    <section className={styles.points} aria-labelledby="owner-points-heading">
      <h2 id="owner-points-heading">What looking after your home means.</h2>
      <p className={styles.intro}>Four things happen every month, whether the house is booked or not.</p>
      <ol className={styles.list}>
        {POINTS.map((point, index) => (
          <li key={point.title}>
            <span className={styles.index}>{String(index + 1).padStart(2, "0")}</span>
            <div>
              <h3>{point.title}</h3>
              <p>{point.body}</p>
            </div>
          </li>
        ))}
      </ol>
      <dl className={styles.facts}>
        {FACTS.map((item) => (
          <div key={item.fact}>
            <dt>{item.fact}</dt>
            <dd>{item.detail}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
