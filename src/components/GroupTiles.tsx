import Image from "next/image";
import Link from "next/link";

import styles from "./GroupTiles.module.css";
import type { HomeGroup } from "@/lib/groups";
import type { Home } from "@/lib/hostaway/types";

/**
 * One tile per group: the photograph of one home in the set, the group's name
 * and how many homes it holds. The count is real, taken from the same list
 * the page itself will render.
 */
export function GroupTiles({ groups }: { groups: Array<{ group: HomeGroup; homes: Home[] }> }) {
  return (
    <div className={styles.tiles}>
      {groups.map(({ group, homes }) => {
        const cover = homes.find((home) => home.photos[0])?.photos[0];
        return (
          <Link key={group.slug} className={styles.tile} href={`/homes/groups/${group.slug}`}>
            <div className={`${styles.frame} ${cover ? "" : styles.empty}`}>
              {cover ? (
                <Image
                  src={cover.url}
                  alt={cover.alt}
                  fill
                  sizes="(max-width: 700px) 100vw, (max-width: 1100px) 50vw, 33vw"
                />
              ) : null}
            </div>
            <h3 className={styles.name}>{group.name}</h3>
            <p className={styles.count}>
              {homes.length} {homes.length === 1 ? "home" : "homes"}
            </p>
          </Link>
        );
      })}
    </div>
  );
}
