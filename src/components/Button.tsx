import Link from "next/link";
import type { AnchorHTMLAttributes } from "react";

import styles from "./Button.module.css";

export type ButtonVariant = "gold" | "outline" | "onDark" | "black";

type Props = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & {
  href: string;
  variant?: ButtonVariant;
};

/**
 * The only button on the site. Anything that looks like a button uses this, so
 * the four locked variants stay the only four.
 *
 * An absolute href (WhatsApp, the booking engine) renders a plain anchor that
 * opens in a new tab; everything else routes through next/link.
 */
export function Button({ variant = "gold", className, href, ...rest }: Props) {
  const classes = [styles.btn, styles[variant], className].filter(Boolean).join(" ");

  if (/^(https?:|mailto:|tel:)/.test(href)) {
    const external = /^https?:/.test(href);
    return (
      <a
        className={classes}
        href={href}
        {...(external ? { rel: "noopener noreferrer", target: "_blank" } : {})}
        {...rest}
      />
    );
  }

  return <Link className={classes} href={href} {...rest} />;
}
