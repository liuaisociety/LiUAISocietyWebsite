export interface Event {
  _id: string;
  title: string;
  description?: string;
  date: string;
  location?: string;
  image?: {
    asset: { _ref: string };
    hotspot?: { x: number; y: number };
  };
  lumaUrl?: string;
  tags?: string[];
}
