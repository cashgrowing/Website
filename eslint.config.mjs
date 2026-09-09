import coreWebVitals from "eslint-config-next/core-web-vitals";
import typescript from "eslint-config-next/typescript";

const config = [
  ...coreWebVitals,
  ...typescript,
  {
    rules: {
      /**
       * The brief requires alt text on every image, enforced by a build-time
       * check that fails when it is missing. next/core-web-vitals ships this
       * rule as a warning, which exits 0 and would let a missing alt reach
       * production, so it is promoted to an error and `npm run build` runs
       * eslint first.
       */
      "jsx-a11y/alt-text": "error",
    },
  },
  { ignores: [".next/**", "node_modules/**", "design/**", "next-env.d.ts"] },
];

export default config;
