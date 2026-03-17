import { ArcSceneClient } from "@/components/home/ArcSceneClient";
import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";

const marqueeEvents = [
  { img: "EricssonEvent1.jpeg",         title: "Ericsson Office Visit" },
  { img: "HackathonFindMyFactory.jpeg", title: "Hackathon: Find My Factory" },
  { img: "AccentureVisit.jpeg",         title: "Accenture Office Visit" },
  { img: "EricssonEvent3.jpeg",         title: "Ericsson Office Visit" },
  { img: "Elvenite.jpeg",               title: "Elvenite Office Visit" },
  { img: "HackathonSnakePit.jpeg",      title: "Hackathon: Snake Pit" },
  { img: "EricssonEvent2.jpeg",         title: "Ericsson Office Visit" },
  { img: "Hack.jpeg",                   title: "WASP Collaboration Event" },
];

const allEvents = [...marqueeEvents, ...marqueeEvents];

export default function HomePage() {
  return (
    <>
      <ArcSceneClient />
      <Nav />

      <div className="content">
        <section className="hero-section">
          <h1 className="hero-title">AI Society<sup>(LiU)</sup></h1>
        </section>
        <div className="spacer" />

        <section className="info-section">
          <h2 className="section-heading">Who We Are</h2>
          <p className="section-text">We are a student association at Linköping University devoted to the exploration, research and continuous learning of artificial intelligence. We cultivate connections with both industry and academia through networking events, educational lectures, workshops and research projects. We serve as a platform for members and partners to network, build professional relationships, and share knowledge.</p>
        </section>

        <section className="events-section">
          <h2 className="section-heading">Events</h2>
          <div className="marquee">
            <div className="marquee-track">
              {allEvents.map((e, i) => (
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

      <Footer />
    </>
  );
}
