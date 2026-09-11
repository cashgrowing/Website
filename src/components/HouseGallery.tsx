"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

import styles from "./HouseGallery.module.css";
import type { HomePhoto } from "@/lib/hostaway/types";

/**
 * The photographs of one house: three at the top of the page, and all of
 * them - typically sixty - behind one button, in a sheet that covers the
 * page.
 *
 * The sheet is a native <dialog>, so the browser does the modal work:
 * focus stays inside, Escape closes it, the page behind is inert. Its
 * photos are only put in the document once it opens, so a guest who never
 * opens it never downloads them.
 */
export function HouseGallery({ photos, name }: { photos: HomePhoto[]; name: string }) {
  const [lead, ...rest] = photos;
  const secondary = rest.slice(0, 2);
  const [open, setOpen] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);

  // React owns `open`; the dialog element owns being shown. Keep them in step.
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  if (!lead) return null;

  return (
    <>
      <div className={styles.gallery}>
        <button
          type="button"
          className={`${styles.shot} ${styles.lead}`}
          onClick={() => setOpen(true)}
          aria-label={`See all ${photos.length} photos of ${name}`}
        >
          <Image src={lead.url} alt={lead.alt} fill sizes="(max-width: 1000px) 100vw, 66vw" priority />
          <span className={styles.count} aria-hidden="true">
            All {photos.length} photos
          </span>
        </button>
        {secondary.length > 0 ? (
          <div className={styles.stack}>
            {secondary.map((photo) => (
              <button
                type="button"
                className={styles.shot}
                key={photo.url}
                onClick={() => setOpen(true)}
                aria-label={`See all ${photos.length} photos of ${name}`}
              >
                <Image src={photo.url} alt={photo.alt} fill sizes="(max-width: 1000px) 50vw, 33vw" />
              </button>
            ))}
          </div>
        ) : null}
      </div>

      <dialog
        ref={dialogRef}
        className={styles.sheet}
        aria-label={`Photos of ${name}`}
        onClose={() => setOpen(false)}
        onClick={(event) => {
          // A click on the backdrop lands on the dialog itself, not on its contents.
          if (event.target === event.currentTarget) setOpen(false);
        }}
      >
        {open ? (
          <div className={styles.inner}>
            <div className={styles.bar}>
              <p className={styles.title}>
                {name} <span>· {photos.length} photos</span>
              </p>
              <button type="button" className={styles.close} onClick={() => setOpen(false)}>
                Close
              </button>
            </div>
            <ul className={styles.grid}>
              {photos.map((photo, index) => (
                <li key={photo.url}>
                  <div className={styles.frame}>
                    <Image
                      src={photo.url}
                      alt={photo.alt}
                      fill
                      sizes="(max-width: 700px) 100vw, 50vw"
                      // The first two are in view when the sheet opens; the rest wait.
                      loading={index < 2 ? "eager" : "lazy"}
                    />
                  </div>
                  {photo.caption ? <p className={styles.caption}>{photo.caption}</p> : null}
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </dialog>
    </>
  );
}
