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
