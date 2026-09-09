/**
 * The shape every page's words take.
 *
 * Deliberately plain data: Phase 2 finishes by moving these objects into Sanity,
 * and the page components read the same shape either way. Nothing here is HTML,
 * so nothing from the CMS can inject markup into a page.
 */

export type Faq = { question: string; answer: string };

export type Section =
  | { kind: "prose"; heading?: string; paragraphs: string[] }
  /**
   * A stacked list of named points, separated by hairlines. Deliberately not a
   * card grid: the brief's design is measured columns and rules, not boxes.
   */
  | {
      kind: "list";
      heading: string;
      intro?: string;
      items: Array<{ title: string; body: string }>;
    };

export type RelatedLink = { label: string; href: string };

export type MarketingPage = {
  /** Route path, without a trailing slash. Also the canonical. */
  path: string;
  /** Under 60 characters once " | WildRoots" is appended. */
  title: string;
  /** Under 155 characters. */
  description: string;
  h1: string;
  lede: string;
  sections: Section[];
  faqs: Faq[];
  /**
   * Internal linking, per the brief: area pages point at their management page,
   * service pages point at each other, and nothing is an orphan.
   */
  related: RelatedLink[];
  /** Which funnel this page serves, which decides the closing call to action. */
  audience: "owner" | "guest";
};

export type JournalBlock =
  | { kind: "h2"; text: string }
  | { kind: "p"; text: string }
  /** Set apart in the design: disclaimers, asides. */
  | { kind: "note"; text: string };

export type JournalPost = {
  slug: string;
  title: string;
  description: string;
  /** ISO date. Drives <time>, Article schema and ordering. */
  publishedAt: string;
  readingMinutes: number;
  excerpt: string;
  body: JournalBlock[];
  faqs: Faq[];
  related: RelatedLink[];
};
