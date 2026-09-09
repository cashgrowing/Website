import { strict as assert } from "node:assert";
import { describe, it } from "node:test";

import { JOURNAL_POSTS } from "../src/content/journal.ts";
import { MARKETING_PAGES } from "../src/content/pages.ts";
import { BRAND, CONTACT, FOOTER_COLUMNS, NAV } from "../src/lib/site.ts";

/**
 * The hard rules from section 2 of the build brief.
 *
 * These are not style preferences. Each one has cost the client something
 * before, or would if it slipped through, so they are asserted rather than
 * trusted to a careful reviewer.
 */

/** Every string a visitor could read, from the content layer. */
function allCopy(): Array<{ where: string; text: string }> {
  const out: Array<{ where: string; text: string }> = [];

  for (const page of MARKETING_PAGES) {
    const at = `page ${page.path}`;
    out.push(
      { where: `${at} title`, text: page.title },
      { where: `${at} description`, text: page.description },
      { where: `${at} h1`, text: page.h1 },
      { where: `${at} lede`, text: page.lede },
    );
    for (const section of page.sections) {
      if (section.heading) out.push({ where: `${at} heading`, text: section.heading });
      if (section.kind === "prose") {
        section.paragraphs.forEach((p) => out.push({ where: `${at} paragraph`, text: p }));
      } else {
        if (section.intro) out.push({ where: `${at} intro`, text: section.intro });
        section.items.forEach((i) => {
          out.push({ where: `${at} item`, text: i.title }, { where: `${at} item`, text: i.body });
        });
      }
    }
    page.faqs.forEach((f) => {
      out.push({ where: `${at} faq`, text: f.question }, { where: `${at} faq`, text: f.answer });
    });
    page.related.forEach((r) => out.push({ where: `${at} link`, text: r.label }));
  }

  for (const post of JOURNAL_POSTS) {
    const at = `post ${post.slug}`;
    out.push(
      { where: `${at} title`, text: post.title },
      { where: `${at} description`, text: post.description },
      { where: `${at} excerpt`, text: post.excerpt },
    );
    post.body.forEach((b) => out.push({ where: `${at} body`, text: b.text }));
    post.faqs.forEach((f) => {
      out.push({ where: `${at} faq`, text: f.question }, { where: `${at} faq`, text: f.answer });
    });
    post.related.forEach((r) => out.push({ where: `${at} link`, text: r.label }));
  }

  NAV.forEach((n) => out.push({ where: "nav", text: n.label }));
  FOOTER_COLUMNS.forEach((c) => {
    out.push({ where: "footer", text: c.heading });
    c.links.forEach((l) => out.push({ where: "footer", text: l.label }));
  });

  return out;
}

describe("brief section 2: hard rules", () => {
  it("names no person anywhere", () => {
    // The Wix site carried a founder name on /about and a byline on the post.
    const names = /\b(aaron|ugalde|rick|kris|mara)\b/i;
    for (const { where, text } of allCopy()) {
      assert.ok(!names.test(text), `${where} names a person: "${text.slice(0, 90)}"`);
    }
  });

  it("never claims there are no setup fees", () => {
    // The fee model is setup + monthly + commission. Claiming otherwise is a
    // promise the business cannot keep.
    const denial = /no\s+set[\s-]?up\s+fee|without\s+a\s+set[\s-]?up\s+fee|free\s+set[\s-]?up/i;
    for (const { where, text } of allCopy()) {
      assert.ok(!denial.test(text), `${where} denies the setup fee: "${text.slice(0, 90)}"`);
    }
  });

  it("never references Envision Festival", () => {
    for (const { where, text } of allCopy()) {
      assert.ok(!/envision/i.test(text), `${where} mentions Envision: "${text.slice(0, 90)}"`);
    }
  });

  it("writes the brand as one word", () => {
    for (const { where, text } of allCopy()) {
      assert.ok(
        !/\bwild\s+roots\b/i.test(text),
        `${where} splits the brand name: "${text.slice(0, 90)}"`,
      );
    }
    assert.equal(BRAND.name, "WildRoots");
  });

  it("publishes no testimonial or statistic that was not supplied", () => {
    // Invented proof is the easiest thing to add and the hardest to walk back.
    const fabricated = /\b\d{2,}\s*(homes|owners|guests|reviews|years)\b|\b(4|5)(\.\d)?\s*stars?\b/i;
    for (const { where, text } of allCopy()) {
      assert.ok(!fabricated.test(text), `${where} states an unsupplied figure: "${text.slice(0, 90)}"`);
    }
  });

  it("keeps the contact details the brief specifies", () => {
    assert.equal(CONTACT.whatsappUrl, "https://wa.me/50687347178");
    assert.equal(CONTACT.email, "info@wildrootscr.com");
    assert.equal(CONTACT.geo.latitude, 9.1559);
    assert.equal(CONTACT.geo.longitude, -83.7547);
  });
});
