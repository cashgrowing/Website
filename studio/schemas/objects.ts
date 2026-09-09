import { defineArrayMember, defineField, defineType } from "sanity";

/**
 * Shared building blocks.
 *
 * Nothing here is rich text on purpose. The site renders plain strings, never
 * HTML from the CMS, which is why no Sanity edit can inject markup into a page.
 */

export const faq = defineType({
  name: "faq",
  title: "Question",
  type: "object",
  fields: [
    defineField({ name: "question", type: "string", validation: (r) => r.required() }),
    defineField({ name: "answer", type: "text", rows: 4, validation: (r) => r.required() }),
  ],
  preview: { select: { title: "question" } },
});

export const relatedLink = defineType({
  name: "relatedLink",
  title: "Link",
  type: "object",
  fields: [
    defineField({ name: "label", type: "string", validation: (r) => r.required() }),
    defineField({
      name: "href",
      title: "Address",
      type: "string",
      description: "A path on this site, starting with a slash. For example /how-we-charge",
      validation: (r) =>
        r.required().custom((value) =>
          typeof value === "string" && (value.startsWith("/") || value.startsWith("https://"))
            ? true
            : "Use a path starting with / or a full https:// address",
        ),
    }),
  ],
  preview: { select: { title: "label", subtitle: "href" } },
});

export const listItem = defineType({
  name: "listItem",
  title: "Point",
  type: "object",
  fields: [
    defineField({ name: "title", type: "string", validation: (r) => r.required() }),
    defineField({ name: "body", type: "text", rows: 3, validation: (r) => r.required() }),
  ],
  preview: { select: { title: "title", subtitle: "body" } },
});

export const proseSection = defineType({
  name: "proseSection",
  title: "Text section",
  type: "object",
  fields: [
    defineField({
      name: "heading",
      type: "string",
      description: "Optional. Leave empty for text with no heading above it.",
    }),
    defineField({
      name: "paragraphs",
      type: "array",
      of: [defineArrayMember({ type: "text", rows: 4 })],
      validation: (r) => r.required().min(1),
    }),
  ],
  preview: {
    select: { title: "heading", paragraphs: "paragraphs" },
    prepare: ({ title, paragraphs }) => ({
      title: title || "Text section",
      subtitle: `${paragraphs?.length ?? 0} paragraph(s)`,
    }),
  },
});

export const listSection = defineType({
  name: "listSection",
  title: "List section",
  type: "object",
  fields: [
    defineField({ name: "heading", type: "string", validation: (r) => r.required() }),
    defineField({ name: "intro", type: "text", rows: 2, description: "Optional." }),
    defineField({
      name: "items",
      type: "array",
      of: [defineArrayMember({ type: "listItem" })],
      validation: (r) => r.required().min(1),
    }),
  ],
  preview: {
    select: { title: "heading", items: "items" },
    prepare: ({ title, items }) => ({
      title: title || "List section",
      subtitle: `${items?.length ?? 0} point(s)`,
    }),
  },
});

/* Journal body blocks. The block's type decides how it renders. */

export const heading2 = defineType({
  name: "heading2",
  title: "Heading",
  type: "object",
  fields: [defineField({ name: "text", type: "string", validation: (r) => r.required() })],
  preview: { select: { title: "text" }, prepare: ({ title }) => ({ title, subtitle: "Heading" }) },
});

export const paragraph = defineType({
  name: "paragraph",
  title: "Paragraph",
  type: "object",
  fields: [defineField({ name: "text", type: "text", rows: 4, validation: (r) => r.required() })],
  preview: { select: { title: "text" } },
});

export const note = defineType({
  name: "note",
  title: "Aside",
  type: "object",
  description: "Set apart with a gold rule. Use for disclaimers.",
  fields: [defineField({ name: "text", type: "text", rows: 3, validation: (r) => r.required() })],
  preview: { select: { title: "text" }, prepare: ({ title }) => ({ title, subtitle: "Aside" }) },
});
