import Link from "next/link";
import Image from "next/image";
import { ArcSceneClient } from "@/components/home/ArcSceneClient";

const marqueeImages = [
  { img: "EricssonEvent1.jpeg",         title: "Ericsson Office Visit" },
  { img: "HackathonFindMyFactory.jpeg", title: "Hackathon: Find My Factory" },
  { img: "AccentureVisit.jpeg",         title: "Accenture Office Visit" },
  { img: "EricssonEvent3.jpeg",         title: "Ericsson Office Visit" },
  { img: "Elvenite.jpeg",               title: "Elvenite Office Visit" },
  { img: "HackathonSnakePit.jpeg",      title: "Hackathon: Snake Pit" },
  { img: "EricssonEvent2.jpeg",         title: "Ericsson Office Visit" },
  { img: "Hack.jpeg",                   title: "WASP Collaboration Event" },
];
const allMarqueeImages = [...marqueeImages, ...marqueeImages];
import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import { HomeEventCard } from "@/components/home/HomeEventCard";
import { NewsletterSignup } from "@/components/home/NewsletterSignup";
import { PartnerSection } from "@/components/home/PartnerSection";
import { client } from "@/lib/sanity";
import { eventsQuery } from "@/lib/queries";
import type { Event } from "@/types/event";

export const revalidate = 60;

export default async function HomePage() {
  let events: Event[] = [];
  try {
    events = await client.fetch(eventsQuery);
  } catch {
    // Sanity not configured or unreachable
  }

  const now = new Date();
  const upcoming = events
    .filter((e) => new Date(e.date) >= now)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 6);
  const past = events
    .filter((e) => new Date(e.date) < now)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 6);

  return (
    <>
      <ArcSceneClient />
      <Nav />

      <div className="content">
        <section className="hero-section">
          {/* <h1 className="hero-title">AI Society<sup>(LiU)</sup></h1> */}
          <Image
            src="/images/AI%20Society%20LiU.svg"
            className="hero-wordmark"
            alt="LiU AI Society"
            width={656}
            height={188}
            priority
          />
          <p className="hero-subtitle">Linköping University</p>
          <div className="hero-scroll-hint" />
        </section>

        <div className="light-content">
        <section className="home-events-section">
          <div className="home-events-header">
            <h2 className="section-heading">Events</h2>
            <Link href="/events" className="home-events-link">See all →</Link>
          </div>

          {upcoming.length > 0 && (
            <div className="home-events-group">
              <h3 className="home-events-subtitle">Upcoming</h3>
              <div className="home-events-grid">
                {upcoming.map((event) => (
                  <HomeEventCard key={event._id} event={event} />
                ))}
              </div>
            </div>
          )}

          {past.length > 0 && (
            <div className="home-events-group">
              <h3 className="home-events-subtitle">Past Events</h3>
              <div className="home-events-grid">
                {past.map((event) => (
                  <HomeEventCard key={event._id} event={event} past />
                ))}
              </div>
            </div>
          )}

          {events.length === 0 && (
            <p className="section-text">No events yet — check back soon.</p>
          )}
        </section>

        <section className="info-section">
          <h2 className="section-heading">Who We Are</h2>
          <p className="section-text">We are a student association at Linköping University devoted to the exploration, research and continuous learning of artificial intelligence. We cultivate connections with both industry and academia through networking events, educational lectures, workshops and research projects. We serve as a platform for members and partners to network, build professional relationships, and share knowledge.</p>
        </section>

        <section className="marquee-section">
          <div className="marquee">
            <div className="marquee-track">
              {allMarqueeImages.map((e, i) => (
                <div key={i} className="event-card" style={{ backgroundImage: `url('/images/events/${e.img}')` }}>
                  <span className="event-card-title">{e.title}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="marquee marquee--mobile-only">
            <div className="marquee-track marquee-track--reverse">
              {allMarqueeImages.map((e, i) => (
                <div key={i} className="event-card" style={{ backgroundImage: `url('/images/events/${e.img}')` }}>
                  <span className="event-card-title">{e.title}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="info-section">
          <h2 className="section-heading">Our Vision</h2>
          <p className="section-text">We are committed to organizing events that bridge the gap between students and the spheres of industry and academia. Through workshops, seminars, lectures and collaborative projects, we seek to broaden the AI and machine learning knowledge base of our student body, and to provide a clear view of potential career paths in these fields. The society is also meant to be a platform for engaged and ambitious students to garner internships or research opportunities.</p>
        </section>
      </div>
      </div>

      <NewsletterSignup />
      <PartnerSection />
      <Footer />
    </>
  );
}
