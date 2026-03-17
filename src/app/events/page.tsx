import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import { client } from "@/lib/sanity";
import { eventsQuery } from "@/lib/queries";
import { EventCard } from "@/components/events/EventCard";
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
          <h2 className="section-heading">Events</h2>
          <p className="about-description">Lectures, workshops, company visits and more.</p>
        </section>

        {upcoming.length > 0 && (
          <section className="about-section">
            <h3 className="career-section-title">Upcoming</h3>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {upcoming.map((event) => (
                <EventCard key={event._id} event={event} />
              ))}
            </div>
          </section>
        )}

        {past.length > 0 && (
          <section className="about-section">
            <h3 className="career-section-title">Past Events</h3>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {past.map((event) => (
                <EventCard key={event._id} event={event} />
              ))}
            </div>
          </section>
        )}

        {events.length === 0 && (
          <section className="about-section">
            <p className="about-description">No events yet — check back soon.</p>
          </section>
        )}
      </div>
      <Footer />
    </>
  );
}
