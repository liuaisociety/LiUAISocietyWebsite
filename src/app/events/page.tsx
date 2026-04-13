import type { Metadata } from "next";
import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import { client } from "@/lib/sanity";

export const metadata: Metadata = {
  title: "Events | LiU AI Society",
  description:
    "Browse upcoming and past AI events at Linköping University — hackathons, company visits, guest lectures, and workshops organised by LiU AI Society.",
  openGraph: {
    title: "Events | LiU AI Society",
    description:
      "Browse upcoming and past AI events at Linköping University — hackathons, company visits, guest lectures, and workshops organised by LiU AI Society.",
    url: "https://liuais.se/events",
  },
};
import { eventsQuery } from "@/lib/queries";
import { HomeEventCard } from "@/components/home/HomeEventCard";
import { SuggestEventButton } from "@/components/events/SuggestEventButton";
import type { Event } from "@/types/event";

export const revalidate = 60;

export default async function EventsPage() {
  let events: Event[] = [];
  try {
    events = await client.fetch(eventsQuery);
  } catch {
    // Sanity not configured yet or unreachable — show empty state
  }

  const now = new Date();
  const upcoming = events.filter((e) => new Date(e.date) >= now);
  const past = events.filter((e) => new Date(e.date) < now);

  return (
    <>
      <Nav />
      <div className="about-content">
        <section className="about-intro">
          <h1 className="section-heading">Events</h1>
          <p className="about-description">Explore upcoming and past events including lectures, workshops, company visits and more.</p>
        </section>

        {upcoming.length > 0 && (
          <section className="about-section">
            <h3 className="career-section-title">Upcoming</h3>
            <div className="home-events-grid">
              {upcoming.map((event) => (
                <HomeEventCard key={event._id} event={event} />
              ))}
            </div>
          </section>
        )}

        {past.length > 0 && (
          <section className="about-section">
            <h3 className="career-section-title">Past Events</h3>
            <div className="home-events-grid">
              {past.map((event) => (
                <HomeEventCard key={event._id} event={event} past />
              ))}
            </div>
          </section>
        )}

        {events.length === 0 && (
          <section className="about-section">
            <p className="about-description">No events yet — check back soon.</p>
          </section>
        )}

        <section className="about-section" style={{ textAlign: "center", paddingBottom: "80px" }}>
          <SuggestEventButton />
        </section>
      </div>
      <Footer />
    </>
  );
}
