import { groq } from "next-sanity";

const eventFields = groq`
  _id,
  title,
  slug,
  description,
  date,
  location,
  image,
  lumaUrl,
  tags,
`;

const eventDetailFields = groq`
  ${eventFields}
  gallery,
  challengeDescription,
  prizes,
  leaderboard,
  participants,
  prerequisites,
  resources,
  speaker,
  companyLogo,
  companyDescription,
  openPositionsUrl,
  testimonials,
  companiesPresent,
  eventHighlights,
`;

export const eventsQuery = groq`
  *[_type == "event"] | order(date desc) {
    ${eventFields}
  }
`;

export const eventBySlugQuery = groq`
  *[_type == "event" && slug.current == $slug][0] {
    ${eventDetailFields}
  }
`;

export const allEventSlugsQuery = groq`
  *[_type == "event" && defined(slug.current)] { "slug": slug.current }
`;

export const projectsQuery = groq`
  *[_type == "project"] | order(_createdAt desc) {
    _id,
    title,
    description,
    coverImage,
    githubUrl,
    techStack,
    contributors,
    status,
  }
`;
