import Image from "next/image";

import styles from "./PhotoSlot.module.css";

type Props = {
  /** Path under /public/photos once the owner supplies it. Omit while pending. */
  src?: string;
  /** Alt text. Required - every image on this site has it. */
  alt?: string;
  /** What photograph belongs here. Shown to reviewers while the slot is empty. */
  brief: string;
  className?: string;
  /** Absolutely fill the nearest positioned ancestor (the hero backdrop). */
  fill?: boolean;
  priority?: boolean;
  sizes?: string;
};

/**
 * Marks where a real photograph goes.
 *
 * The brief allows real photography only, so an unsupplied photo renders as a
 * labelled empty panel rather than stock or generated imagery. Drop the file
 * into /public/photos and pass `src` + `alt` to fill it.
 */
export function PhotoSlot({ src, alt, brief, className, fill, priority, sizes = "100vw" }: Props) {
  const classes = [styles.slot, src ? undefined : styles.pending, fill ? styles.fill : undefined, className]
    .filter(Boolean)
    .join(" ");

  if (src && alt) {
    return (
      <div className={classes}>
        <Image src={src} alt={alt} fill sizes={sizes} priority={priority} />
      </div>
    );
  }

  return (
    <div className={classes} role="img" aria-label={`Photograph to be supplied: ${brief}`}>
      <p className={styles.note}>
        <b>Photo to come</b>
        <span>{brief}</span>
      </p>
    </div>
  );
}
