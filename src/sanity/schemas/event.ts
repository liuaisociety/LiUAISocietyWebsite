import { defineField, defineType } from "sanity";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const hiddenUnless = (tag: string) => ({ hidden: ({ document }: { document: any }) => !document?.tags?.includes(tag) });
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const hiddenUnlessAny = (...tags: string[]) => ({ hidden: ({ document }: { document: any }) => !tags.some(t => document?.tags?.includes(t)) });

export const event = defineType({
  name: "event",
  title: "Event",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "description",
      title: "Short Description",
      description: "Shown on event cards",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "date",
      title: "Date & Time",
      type: "datetime",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "location",
      title: "Location",
      type: "string",
    }),
    defineField({
      name: "image",
      title: "Cover Image",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "lumaUrl",
      title: "Luma Event URL",
      description: "Link to the event on Luma for sign-ups",
      type: "url",
    }),
    defineField({
      name: "tags",
      title: "Tags",
      type: "array",
      of: [{ type: "string" }],
      options: {
        list: [
          { title: "Workshop", value: "workshop" },
          { title: "Lecture", value: "lecture" },
          { title: "Social", value: "social" },
          { title: "Hackathon", value: "hackathon" },
          { title: "Company Visit", value: "company-visit" },
          { title: "Career", value: "career" },
        ],
      },
    }),

    // ── Shared ────────────────────────────────────────────────────────────
    defineField({
      name: "gallery",
      title: "Photo Gallery",
      type: "array",
      of: [{ type: "image", options: { hotspot: true } }],
    }),

    // ── Hackathon ─────────────────────────────────────────────────────────
    defineField({
      name: "challengeDescription",
      title: "Challenge Description",
      type: "text",
      rows: 4,
      ...hiddenUnless("hackathon"),
    }),
    defineField({
      name: "prizes",
      title: "Prizes",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({ name: "place", title: "Place (e.g. 1st, 2nd, Best AI Use)", type: "string" }),
            defineField({ name: "prize", title: "Prize Description", type: "string" }),
          ],
          preview: {
            select: { place: "place", prize: "prize" },
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            prepare(val: any) { return { title: `${val.place} — ${val.prize}` }; },
          },
        },
      ],
      ...hiddenUnless("hackathon"),
    }),
    defineField({
      name: "leaderboard",
      title: "Leaderboard",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({ name: "rank", title: "Rank", type: "number" }),
            defineField({ name: "team", title: "Team Name", type: "string" }),
            defineField({ name: "score", title: "Score / Points", type: "string" }),
            defineField({ name: "projectName", title: "Project Name", type: "string" }),
            defineField({ name: "description", title: "Project Description", type: "text", rows: 3 }),
            defineField({ name: "projectUrl", title: "Demo / Repo URL", type: "url" }),
          ],
          preview: {
            select: { rank: "rank", team: "team" },
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            prepare(val: any) {
              return { title: `#${val.rank} — ${val.team}` };
            },
          },
        },
      ],
      ...hiddenUnless("hackathon"),
    }),
    defineField({
      name: "participants",
      title: "Participants",
      description: "Names or team names",
      type: "array",
      of: [{ type: "string" }],
      ...hiddenUnless("hackathon"),
    }),

    // ── Workshop ──────────────────────────────────────────────────────────
    defineField({
      name: "prerequisites",
      title: "Prerequisites",
      type: "text",
      rows: 3,
      ...hiddenUnless("workshop"),
    }),

    // ── Workshop + Lecture ────────────────────────────────────────────────
    defineField({
      name: "resources",
      title: "Resources / Links",
      description: "Slides, recordings, repos etc.",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({ name: "title", title: "Title", type: "string" }),
            defineField({ name: "url", title: "URL", type: "url" }),
          ],
          preview: { select: { title: "title" } },
        },
      ],
      ...hiddenUnlessAny("workshop", "lecture"),
    }),

    // ── Lecture ───────────────────────────────────────────────────────────
    defineField({
      name: "speaker",
      title: "Speaker",
      type: "object",
      fields: [
        defineField({ name: "name", title: "Name", type: "string" }),
        defineField({ name: "bio", title: "Bio", type: "text", rows: 4 }),
        defineField({ name: "headshot", title: "Headshot", type: "image", options: { hotspot: true } }),
      ],
      ...hiddenUnless("lecture"),
    }),

    // ── Company Visit ─────────────────────────────────────────────────────
    defineField({
      name: "companyLogo",
      title: "Company Logo",
      type: "image",
      options: { hotspot: true },
      ...hiddenUnless("company-visit"),
    }),
    defineField({
      name: "companyDescription",
      title: "About the Company",
      type: "text",
      rows: 4,
      ...hiddenUnless("company-visit"),
    }),
    defineField({
      name: "openPositionsUrl",
      title: "Open Positions URL",
      type: "url",
      ...hiddenUnless("company-visit"),
    }),
    defineField({
      name: "testimonials",
      title: "Attendee Quotes",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({ name: "quote", title: "Quote", type: "text", rows: 3 }),
            defineField({ name: "author", title: "Author", type: "string" }),
          ],
          preview: {
            select: { author: "author" },
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            prepare(val: any) { return { title: val.author }; },
          },
        },
      ],
      ...hiddenUnless("company-visit"),
    }),

    // ── Career ────────────────────────────────────────────────────────────
    defineField({
      name: "companiesPresent",
      title: "Companies Present",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({ name: "name", title: "Company Name", type: "string" }),
            defineField({ name: "logo", title: "Logo", type: "image", options: { hotspot: true } }),
            defineField({ name: "url", title: "Website / Careers URL", type: "url" }),
          ],
          preview: { select: { title: "name" } },
        },
      ],
      ...hiddenUnless("career"),
    }),
    defineField({
      name: "eventHighlights",
      title: "Event Highlights",
      type: "text",
      rows: 4,
      ...hiddenUnless("career"),
    }),
  ],

  preview: {
    select: { title: "title", date: "date", media: "image" },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    prepare(val: any) {
      return {
        title: val.title,
        subtitle: val.date ? new Date(val.date).toLocaleDateString("sv-SE") : "No date",
        media: val.media,
      };
    },
  },
  orderings: [
    {
      title: "Date, newest first",
      name: "dateDesc",
      by: [{ field: "date", direction: "desc" }],
    },
  ],
});
