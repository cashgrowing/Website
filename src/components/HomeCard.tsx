import Image from "next/image";
import Link from "next/link";

import styles from "./HomeCard.module.css";
import type { Home } from "@/lib/hostaway/types";

/** One line of facts under the name: area, bedrooms, sleeps. Nothing invented. */
function metaLine(home: Home): string {
  const parts: string[] = [];
  if (home.area) parts.push(home.area);
  else if (home.city) parts.push(home.city);
  if (home.bedrooms) parts.push(`${home.bedrooms} bed`);
  if (home.sleeps) parts.push(`sleeps ${home.sleeps}`);
  return parts.join(" · ");
}

export function HomeCard({ home, priority = false }: { home: Home; priority?: boolean }) {
  const cover = home.photos[0];
  const meta = metaLine(home);

  return (
    <Link className={styles.card} href={`/homes/${home.slug}`}>
      <div className={`${styles.frame} ${cover ? "" : styles.empty}`}>
        {cover ? (
          <Image
            src={cover.url}
            alt={cover.alt}
            fill
            sizes="(max-width: 700px) 100vw, (max-width: 1100px) 50vw, 25vw"
            priority={priority}
          />
        ) : null}
      </div>
      <h3 className={styles.name}>{home.name}</h3>
      {meta ? <p className={styles.meta}>{meta}</p> : null}
      {home.basePrice ? (
        <p className={styles.price}>
          from{" "}
          <b>
            {home.currency === "USD" ? "$" : ""}
            {Math.round(home.basePrice)}
            {home.currency === "USD" ? "" : ` ${home.currency}`}
          </b>{" "}
          / night
        </p>
      ) : null}
    </Link>
  );
}
