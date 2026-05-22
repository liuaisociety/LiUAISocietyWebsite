import { defineField, defineType } from "sanity";

export const jobPosting = defineType({
  name: "jobPosting",
  title: "Job Posting",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Job Title",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "company",
      title: "Company / Organization",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "location",
      title: "Location",
      type: "string",
    }),
    defineField({
      name: "deadline",
      title: "Application Deadline",
      type: "date",
      options: { dateFormat: "YYYY-MM-DD" },
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 4,
    }),
    defineField({
      name: "url",
      title: "Apply / Learn More URL",
      type: "url",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "tag",
      title: "Tag",
      type: "string",
      options: {
        list: [
          { title: "Full-time", value: "Full-time" },
          { title: "Part-time", value: "Part-time" },
          { title: "Internship", value: "Internship" },
          { title: "Thesis", value: "Thesis" },
          { title: "PhD", value: "PhD" },
          { title: "Research", value: "Research" },
        ],
      },
    }),
    defineField({
      name: "color",
      title: "Accent Color",
      description: "Card left-border highlight color",
      type: "color",
    }),
  ],
  preview: {
    select: { title: "title", company: "company", deadline: "deadline" },
    prepare({ title, company, deadline }) {
      return {
        title,
        subtitle: [company, deadline ? `Deadline: ${deadline}` : null]
          .filter(Boolean)
          .join(" · "),
      };
    },
  },
  orderings: [
    {
      title: "Deadline, soonest first",
      name: "deadlineAsc",
      by: [{ field: "deadline", direction: "asc" }],
    },
  ],
});
