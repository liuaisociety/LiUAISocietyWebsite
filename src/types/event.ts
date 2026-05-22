import type { PortableTextBlock } from "@portabletext/types";

export interface EventResource {
  title: string;
  url: string;
}

export interface LeaderboardEntry {
  _key: string;
  rank: number;
  team: string;
  score?: string;
  projectName?: string;
  description?: string;
  projectUrl?: string;
}

export interface Testimonial {
  _key: string;
  quote: string;
  author?: string;
}

export interface CompanyPresent {
  _key: string;
  name: string;
  logo?: { asset: { _ref: string } };
  url?: string;
}

export interface Event {
  _id: string;
  title: string;
  slug?: { current: string };
  description?: string;
  date: string;
  location?: string;
  image?: {
    asset: { _ref: string };
    hotspot?: { x: number; y: number };
  };
  lumaUrl?: string;
  tags?: string[];

  // Shared
  gallery?: Array<{ _key: string; asset: { _ref: string } }>;

  // Hackathon
  challengeDescription?: string;
  prizes?: Array<{ _key: string; place: string; prize: string }>;
  leaderboard?: LeaderboardEntry[];
  participants?: string[];

  // Workshop
  prerequisites?: string;

  // Workshop + Lecture
  resources?: EventResource[];

  // Lecture
  speaker?: {
    name?: string;
    bio?: string;
    headshot?: { asset: { _ref: string } };
  };

  // Company visit
  companyLogo?: { asset: { _ref: string } };
  companyDescription?: string;
  openPositionsUrl?: string;
  testimonials?: Testimonial[];

  // Career
  companiesPresent?: CompanyPresent[];
  eventHighlights?: string;
}
