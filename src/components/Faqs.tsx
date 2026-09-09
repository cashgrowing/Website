import styles from "./Faqs.module.css";
import type { Faq } from "@/content/types";

/**
 * Answers are always visible rather than hidden behind a disclosure. These pages
 * exist to rank for the questions, and open text is the most reliable thing to
 * put in front of both a crawler and someone skimming on a phone.
 */
export function Faqs({ faqs, heading = "Frequently asked questions" }: { faqs: Faq[]; heading?: string }) {
  if (faqs.length === 0) return null;

  return (
    <section className={styles.faqs}>
      <h2>{heading}</h2>
      <dl className={styles.list}>
        {faqs.map((faq) => (
          <div className={styles.item} key={faq.question}>
            <dt className={styles.question}>{faq.question}</dt>
            <dd className={styles.answer}>{faq.answer}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
