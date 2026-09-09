import { defineCliConfig } from "sanity/cli";

/**
 * `npx sanity deploy` publishes the studio to <studioHost>.sanity.studio.
 * It deliberately does not live on wildrootscr.com: keeping the only admin
 * surface off the public domain means there is no login page there to find.
 */
export default defineCliConfig({
  api: {
    projectId: process.env.SANITY_STUDIO_PROJECT_ID,
    dataset: process.env.SANITY_STUDIO_DATASET ?? "production",
  },
  studioHost: "wildroots",
});
