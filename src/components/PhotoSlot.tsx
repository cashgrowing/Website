import Image from "next/image";

import styles from "./PhotoSlot.module.css";

type Base = {
  /** What photograph belongs here. Shown to reviewers while the slot is empty. */
  brief: string;
  className?: string;
  /** Absolutely fill the nearest positioned ancestor (the hero backdrop). */
  fill?: boolean;
  priority?: boolean;
  sizes?: string;
};

/**
 * A filled slot needs both a source and alt text; an empty one needs neither.
 * Expressing that as a union makes `src` without `alt` a compile error rather
 * than a slot that quietly renders the placeholder instead of the photograph.
 */
type Props = Base & ({ src: string; alt: string } | { src?: never; alt?: never });

/**
 * Marks where a real photograph goes.
 *
 * The brief allows real photography only, so an unsupplied photo renders as a
 * labelled empty panel rather than stock or generated imagery. Drop the file
 * into /public/photos and pass `src` + `alt` to fill it.
 */
export function PhotoSlot({ src, alt, brief, className, fill, priority, sizes = "100vw" }: Props) {
  const classes = [
    styles.slot,
    src ? undefined : styles.pending,
    fill ? styles.fill : undefined,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  if (src) {
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
