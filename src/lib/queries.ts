import { groq } from "next-sanity";

export const eventsQuery = groq`
  *[_type == "event"] | order(date desc) {
    _id,
    title,
    description,
    date,
    location,
    image,
    lumaUrl,
    tags,
  }
`;

export const jobPostingsQuery = groq`
  *[_type == "jobPosting" && (deadline == null || deadline >= $today)] | order(deadline asc) {
    _id,
    title,
    company,
    location,
    deadline,
    description,
    url,
    tag,
    "color": color.hex,
  }
`;
