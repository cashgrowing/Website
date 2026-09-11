import { defineArrayMember, defineField, defineType } from "sanity";

/**
 * The two document types the site reads.
 *
 * The length rules below are the brief's SEO limits, enforced where the words
 * are actually written rather than discovered later in an audit: titles under
 * 60 characters once " | WildRoots" is appended, descriptions under 155.
 */
const TITLE_SUFFIX = " | WildRoots".length;

export const marketingPage = defineType({
  name: "marketingPage",
  title: "Page",
  type: "document",
  groups: [
    { name: "content", title: "Content", default: true },
    { name: "seo", title: "Search" },
  ],
  fields: [
    defineField({
      name: "path",
      title: "Address",
      type: "string",
      group: "seo",
      description:
        "The page's address on the site, starting with a slash. Changing this breaks incoming links — leave it alone unless you mean it.",
      validation: (r) =>
        r.required().custom((value) =>
          typeof value === "string" && value.startsWith("/")
            ? true
            : "Must start with a slash, for example /how-we-charge",
        ),
    }),
    defineField({
      name: "h1",
      title: "Page heading",
      type: "string",
      group: "content",
      description: "The large heading at the top of the page.",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "lede",
      title: "Opening line",
      type: "text",
      rows: 3,
      group: "content",
      description: "The sentence under the heading.",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "audience",
      title: "Who is this page for?",
      type: "string",
      group: "content",
      description: "Decides the button at the bottom: WhatsApp for owners, availability for guests.",
      options: {
        list: [
          { title: "Homeowners", value: "owner" },
          { title: "Guests", value: "guest" },
        ],
        layout: "radio",
      },
      initialValue: "owner",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "image",
      title: "Photograph",
      type: "pageImage",
      group: "content",
    }),
    defineField({
      name: "sections",
      title: "Sections",
      type: "array",
      group: "content",
      of: [defineArrayMember({ type: "proseSection" }), defineArrayMember({ type: "listSection" })],
    }),
    defineField({
      name: "faqs",
      title: "Frequently asked questions",
      type: "array",
      group: "content",
      description: "These are also sent to Google as structured data, so they can appear in search.",
      of: [defineArrayMember({ type: "faq" })],
    }),
    defineField({
      name: "related",
      title: "Read next",
      type: "array",
      group: "content",
      description: "Links at the foot of the page. Every page should point at two or three others.",
      of: [defineArrayMember({ type: "relatedLink" })],
    }),
    defineField({
      name: "title",
      title: "Search title",
      type: "string",
      group: "seo",
      description: `Shown in Google's results. " | WildRoots" is added automatically.`,
      validation: (r) =>
        r
          .required()
          .max(59 - TITLE_SUFFIX)
          .warning(`Keep it under ${59 - TITLE_SUFFIX} characters or Google will cut it off.`),
    }),
    defineField({
      name: "description",
      title: "Search description",
      type: "text",
      rows: 3,
      group: "seo",
      description: "The grey text under the title in Google's results.",
      validation: (r) => r.required().max(155).warning("Over 155 characters gets truncated."),
    }),
  ],
  preview: { select: { title: "h1", subtitle: "path" } },
});

/**
 * The editable opening paragraph of a grouped-homes page (/homes/groups/…).
 * The list of homes on those pages comes from Hostaway and cannot be edited
 * here; only the words above it can.
 */
export const homeGroup = defineType({
  name: "homeGroup",
  title: "Homes group intro",
  type: "document",
  fields: [
    defineField({
      name: "slug",
      title: "Which group",
      type: "string",
      description: "Must match one of the site's groups exactly.",
      options: {
        list: [
          { title: "Homes with a pool", value: "pool-homes" },
          { title: "Homes with an ocean view", value: "ocean-view" },
          { title: "Homes that sleep 8 or more", value: "sleeps-8-plus" },
          { title: "A short walk to the beach", value: "walk-to-beach" },
          { title: "Homes for two", value: "for-two" },
        ],
      },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "intro",
      title: "Opening paragraph",
      type: "text",
      rows: 4,
      description: "Shown under the heading, above the homes. Leave empty to use the site's default.",
    }),
  ],
  preview: { select: { title: "slug", subtitle: "intro" } },
});

export const journalPost = defineType({
  name: "journalPost",
  title: "Journal post",
  type: "document",
  groups: [
    { name: "content", title: "Content", default: true },
    { name: "seo", title: "Search" },
  ],
  fields: [
    defineField({
      name: "title",
      type: "string",
      group: "content",
      description: `Used as the heading and as the search title, with " | WildRoots" appended.`,
      validation: (r) =>
        r
          .required()
          .max(59 - TITLE_SUFFIX)
          .warning(`Keep it under ${59 - TITLE_SUFFIX} characters or Google will cut it off.`),
    }),
    defineField({
      name: "slug",
      title: "Address",
      type: "slug",
      group: "seo",
      options: { source: "title", maxLength: 80 },
      description: "Becomes /journal/… . Changing it on a published post breaks incoming links.",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "category",
      title: "Who is this for?",
      type: "string",
      group: "content",
      description: "Shown ahead of the date on the journal page, so owners and guests can find their articles.",
      options: {
        list: [
          { title: "For owners", value: "owners" },
          { title: "For guests", value: "guests" },
          { title: "From the coast", value: "coast" },
        ],
        layout: "radio",
      },
      initialValue: "owners",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "publishedAt",
      title: "Published",
      type: "date",
      group: "content",
      options: { dateFormat: "YYYY-MM-DD" },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "readingMinutes",
      title: "Reading time (minutes)",
      type: "number",
      group: "content",
      validation: (r) => r.required().min(1).max(60),
    }),
    defineField({
      name: "excerpt",
      title: "Summary",
      type: "text",
      rows: 3,
      group: "content",
      description: "Shown on the journal index, under the title.",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "body",
      title: "The post",
      type: "array",
      group: "content",
      of: [
        defineArrayMember({ type: "paragraph" }),
        defineArrayMember({ type: "heading2" }),
        defineArrayMember({ type: "note" }),
      ],
      validation: (r) => r.required().min(1),
    }),
    defineField({
      name: "faqs",
      title: "Frequently asked questions",
      type: "array",
      group: "content",
      of: [defineArrayMember({ type: "faq" })],
    }),
    defineField({
      name: "related",
      title: "Read next",
      type: "array",
      group: "content",
      description: "Point at two or more service pages. This is how the journal earns its keep.",
      of: [defineArrayMember({ type: "relatedLink" })],
      validation: (r) => r.min(2).warning("The brief asks for at least two service pages."),
    }),
    defineField({
      name: "description",
      title: "Search description",
      type: "text",
      rows: 3,
      group: "seo",
      validation: (r) => r.required().max(155).warning("Over 155 characters gets truncated."),
    }),
  ],
  preview: { select: { title: "title", subtitle: "publishedAt" } },
});
