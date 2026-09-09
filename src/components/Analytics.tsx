"use client";

import Script from "next/script";
import { useSyncExternalStore } from "react";

import styles from "./Analytics.module.css";

const STORAGE_KEY = "wr-analytics-consent";

type Consent = "granted" | "denied" | null;

/*
 * Consent lives in localStorage, which is external to React, so it is read with
 * useSyncExternalStore rather than an effect. Reading it in an effect would set
 * state during render and cascade an extra render on every page.
 *
 * localStorage does not raise `storage` events in the tab that wrote them, so
 * writes notify subscribers directly.
 */
let listeners: Array<() => void> = [];

function subscribe(onChange: () => void): () => void {
  listeners.push(onChange);
  window.addEventListener("storage", onChange);
  return () => {
    listeners = listeners.filter((listener) => listener !== onChange);
    window.removeEventListener("storage", onChange);
  };
}

function getSnapshot(): Consent {
  try {
    const value = window.localStorage.getItem(STORAGE_KEY);
    return value === "granted" || value === "denied" ? value : null;
  } catch {
    // Private browsing, or storage blocked. Undecided, but never a crash.
    return null;
  }
}

/*
 * The server cannot know the choice, so prerendered HTML always contains the
 * banner and hydration removes it for anyone who has already decided. The
 * banner is fixed to the bottom of the viewport, so that removal shifts no
 * layout and costs nothing in CLS.
 */
function getServerSnapshot(): Consent {
  return null;
}

/**
 * Analytics, loaded only after someone says yes.
 *
 * Two things the brief asks for at once: measurement, and not paying for it in
 * Core Web Vitals. Nothing third-party is requested on first paint - the tags
 * mount only once consent exists, so the initial load stays the 3KB it is now.
 *
 * If no measurement IDs are configured, this renders nothing at all: no banner,
 * no scripts. A consent prompt for tracking that does not exist would be theatre.
 */
export function Analytics({ gaId, pixelId }: { gaId?: string; pixelId?: string }) {
  const configured = Boolean(gaId || pixelId);
  const consent = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  function decide(value: Exclude<Consent, null>) {
    try {
      window.localStorage.setItem(STORAGE_KEY, value);
    } catch {
      // Choice cannot be remembered; honour it for this page view regardless.
    }
    for (const listener of [...listeners]) listener();
  }

  if (!configured) return null;

  return (
    <>
      {consent === "granted" ? (
        <>
          {gaId ? (
            <>
              <Script
                src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
                strategy="afterInteractive"
              />
              <Script id="ga4-init" strategy="afterInteractive">
                {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}
gtag('js',new Date());gtag('config','${gaId}',{anonymize_ip:true});`}
              </Script>
            </>
          ) : null}

          {pixelId ? (
            <Script id="fb-pixel" strategy="afterInteractive">
              {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
document,'script','https://connect.facebook.net/en_US/fbevents.js');
fbq('init','${pixelId}');fbq('track','PageView');`}
            </Script>
          ) : null}
        </>
      ) : null}

      {consent === null ? (
        <aside className={styles.banner} aria-label="Analytics consent">
          <div className={styles.inner}>
            <p className={styles.text}>
              We would like to measure which pages people find useful. Nothing is loaded
              until you agree, and declining does not change how the site works.
            </p>
            <div className={styles.actions}>
              <button className={styles.button} type="button" onClick={() => decide("denied")}>
                No thanks
              </button>
              <button
                className={`${styles.button} ${styles.accept}`}
                type="button"
                onClick={() => decide("granted")}
              >
                Allow
              </button>
            </div>
          </div>
        </aside>
      ) : null}
    </>
  );
}
