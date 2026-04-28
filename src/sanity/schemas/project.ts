import { defineField, defineType } from "sanity";

export const project = defineType({
  name: "project",
  title: "Project",
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
      description: "Shown on the project card",
      type: "text",
      rows: 3,
      validation: (r) => r.required(),
    }),
    defineField({
      name: "coverImage",
      title: "Cover Image",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "githubUrl",
      title: "GitHub URL",
      type: "url",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "techStack",
      title: "Tech Stack",
      description: "Languages and frameworks — used for filtering",
      type: "array",
      of: [{ type: "string" }],
      options: { layout: "tags" },
    }),
    defineField({
      name: "contributors",
      title: "Contributors",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({
              name: "name",
              title: "Display Name",
              type: "string",
              validation: (r) => r.required(),
            }),
            defineField({
              name: "github",
              title: "GitHub Username",
              description: "e.g. torvalds — used to show their avatar",
              type: "string",
            }),
          ],
          preview: {
            select: { name: "name", github: "github" },
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            prepare(val: any) {
              return { title: val.name, subtitle: val.github ? `@${val.github}` : "" };
            },
          },
        },
      ],
    }),
    defineField({
      name: "status",
      title: "Status",
      type: "string",
      options: {
        list: [
          { title: "Active", value: "active" },
          { title: "Completed", value: "completed" },
          { title: "Archived", value: "archived" },
        ],
        layout: "radio",
      },
      initialValue: "active",
    }),
  ],

  preview: {
    select: { title: "title", status: "status", media: "coverImage" },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    prepare(val: any) {
      return {
        title: val.title,
        subtitle: val.status ?? "active",
        media: val.media,
      };
    },
  },

  orderings: [
    {
      title: "Status",
      name: "statusAsc",
      by: [{ field: "status", direction: "asc" }],
    },
  ],
});
