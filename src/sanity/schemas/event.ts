import { defineField, defineType } from "sanity";

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
      name: "description",
      title: "Description",
      type: "text",
      rows: 4,
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
  ],
  preview: {
    select: { title: "title", date: "date", media: "image" },
    prepare({ title, date, media }) {
      return {
        title,
        subtitle: date ? new Date(date).toLocaleDateString("sv-SE") : "No date",
        media,
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
