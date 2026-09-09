import { Button } from "./Button";
import styles from "./Placeholder.module.css";
import { CONTACT } from "@/lib/site";

/**
 * A page whose copy arrives in Phase 2, when the Wix content is migrated into
 * Sanity. It exists now so the preview link has no dead ends - and it is
 * noindex (see each route's metadata) so an empty page never reaches Google.
 */
export function Placeholder({ title, note }: { title: string; note: string }) {
  return (
    <div className={styles.page}>
      <h1>{title}</h1>
      <hr className={styles.rule} />
      <p>{note}</p>
      <p>
        The words for this page come across from the current site in Phase 2 and then live
        in the CMS, where they can be edited without a developer.
      </p>
      <div className={styles.actions}>
        <Button variant="gold" href={CONTACT.whatsappUrl}>
          Talk to the team on WhatsApp
        </Button>
        <Button variant="outline" href="/homes">
          See the homes
        </Button>
      </div>
    </div>
  );
}
