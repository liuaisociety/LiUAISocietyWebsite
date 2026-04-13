import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Calendar, MapPin, ExternalLink } from "lucide-react";
import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import { client, urlFor } from "@/lib/sanity";
import { eventBySlugQuery, allEventSlugsQuery } from "@/lib/queries";
import type { Event } from "@/types/event";

export const revalidate = 60;

export async function generateStaticParams() {
  try {
    const slugs: { slug: string }[] = await client.fetch(allEventSlugsQuery);
    return slugs.map((s) => ({ slug: s.slug }));
  } catch {
    return [];
  }
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("sv-SE", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default async function EventPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  let event: Event | null = null;
  try {
    event = await client.fetch(eventBySlugQuery, { slug });
  } catch {
    // Sanity not configured or unreachable
  }

  if (!event) notFound();

  const tags = event.tags ?? [];
  const isHackathon = tags.includes("hackathon");
  const isWorkshop = tags.includes("workshop");
  const isLecture = tags.includes("lecture");
  const isCompanyVisit = tags.includes("company-visit");
  const isPast = new Date(event.date) < new Date();
  const isCareer = tags.includes("career");

  return (
    <>
      <Nav />
      <div className="about-content">

        {/* Hero */}
        <section className="event-page-hero">
          <div className="event-page-hero-text">
            {tags.length > 0 && (
              <div className="home-event-card-tags" style={{ marginBottom: "0.75rem" }}>
                {tags.map((tag) => (
                  <span key={tag} className="home-event-tag">{tag.replace("-", " ")}</span>
                ))}
              </div>
            )}
            <h1 className="event-page-title">{event.title}</h1>
            <div className="event-page-meta">
              <span><Calendar size={15} /> {formatDate(event.date)}</span>
              {event.location && <span><MapPin size={15} /> {event.location}</span>}
            </div>
            {event.lumaUrl && (
              <Link href={event.lumaUrl} target="_blank" rel="noopener noreferrer" className="home-event-card-cta" style={{ marginTop: "1.25rem", display: "inline-flex", alignItems: "center", gap: "0.4rem" }}>
                {isPast ? "View recap" : "Sign up"} <ExternalLink size={13} />
              </Link>
            )}
          </div>
          {event.image && (
            <div className="event-page-cover">
              <Image
                src={urlFor(event.image).width(800).quality(85).url()}
                alt={event.title}
                width={800}
                height={800}
                priority
                style={{ width: "100%", height: "auto", display: "block" }}
              />
            </div>
          )}
        </section>

        {/* ── Two-column layout ── */}
        <div className="event-page-layout">

          {/* Left: main content */}
          <div className="event-page-main">

            {/* Description */}
            {event.description && (
              <div className="event-col-section">
                <p className="about-description">{event.description}</p>
              </div>
            )}

            {/* Challenge */}
            {isHackathon && event.challengeDescription && (
              <div className="event-col-section">
                <h2 className="section-heading">The Challenge</h2>
                <p className="about-description">{event.challengeDescription}</p>
              </div>
            )}

            {/* Resources */}
            {(isWorkshop || isLecture) && event.resources && event.resources.length > 0 && (
              <div className="event-col-section">
                <h2 className="section-heading">Resources</h2>
                <ul className="event-resources-list">
                  {event.resources.map((r, i) => (
                    <li key={i}>
                      <Link href={r.url} target="_blank" rel="noopener noreferrer" className="event-resource-link">
                        <ExternalLink size={13} /> {r.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Company visit */}
            {isCompanyVisit && (event.companyLogo || event.companyDescription) && (
              <div className="event-col-section">
                <h2 className="section-heading">About the Company</h2>
                <div className="event-company">
                  {event.companyLogo && (
                    <Image
                      src={urlFor(event.companyLogo).width(200).height(80).quality(85).url()}
                      alt="Company logo"
                      width={200}
                      height={80}
                      className="event-company-logo"
                    />
                  )}
                  {event.companyDescription && <p className="about-description">{event.companyDescription}</p>}
                  {event.openPositionsUrl && (
                    <Link href={event.openPositionsUrl} target="_blank" rel="noopener noreferrer" className="home-event-card-cta" style={{ marginTop: "1rem", display: "inline-flex", alignItems: "center", gap: "0.4rem" }}>
                      View open positions <ExternalLink size={13} />
                    </Link>
                  )}
                </div>
              </div>
            )}

            {/* Career highlights */}
            {isCareer && event.eventHighlights && (
              <div className="event-col-section">
                <h2 className="section-heading">Highlights</h2>
                <p className="about-description">{event.eventHighlights}</p>
              </div>
            )}

          </div>

          {/* Right: sidebar */}
          <div className="event-page-sidebar">

            {/* Prizes */}
            {isHackathon && Array.isArray(event.prizes) && event.prizes.length > 0 && (
              <div className="event-sidebar-section">
                <div className="event-prizes-card">
                  <h2 className="event-prizes-title">Prize Pool</h2>
                  <ul className="event-prizes-list">
                    {event.prizes.map((p) => (
                      <li key={p._key} className="event-prize-entry">
                        <span className="event-prize-sponsor">{p.place}</span>
                        <span className="event-prize-desc">{p.prize}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* Speaker */}
            {isLecture && event.speaker?.name && (
              <div className="event-sidebar-section">
                <h2 className="section-heading">Speaker</h2>
                <div className="event-speaker">
                  {event.speaker.headshot && (
                    <Image
                      src={urlFor(event.speaker.headshot).width(160).height(160).quality(85).url()}
                      alt={event.speaker.name}
                      width={160}
                      height={160}
                      className="event-speaker-headshot"
                    />
                  )}
                  <div>
                    <p className="event-speaker-name">{event.speaker.name}</p>
                    {event.speaker.bio && <p className="event-speaker-bio">{event.speaker.bio}</p>}
                  </div>
                </div>
              </div>
            )}

            {/* Prerequisites */}
            {isWorkshop && event.prerequisites && (
              <div className="event-sidebar-section">
                <h2 className="section-heading">Prerequisites</h2>
                <p className="about-description">{event.prerequisites}</p>
              </div>
            )}

            {/* Participants */}
            {isHackathon && event.participants && event.participants.length > 0 && (
              <div className="event-sidebar-section">
                <h2 className="section-heading">Participants</h2>
                <div className="event-participants">
                  {event.participants.map((p, i) => (
                    <span key={i} className="event-participant-tag">{p}</span>
                  ))}
                </div>
              </div>
            )}

          </div>
        </div>

        {/* ── Full-width sections ── */}

        {/* Leaderboard */}
        {isHackathon && event.leaderboard && event.leaderboard.length > 0 && (
          <section className="about-section">
            <h2 className="section-heading">Leaderboard</h2>
            <div className="event-leaderboard">
              {event.leaderboard
                .sort((a, b) => a.rank - b.rank)
                .map((entry) => (
                  <div key={entry._key} className={`event-leaderboard-entry rank-${entry.rank}`} data-rank={`#${entry.rank}`}>
                    <span className="event-leaderboard-rank">#{entry.rank}</span>
                    <div className="event-leaderboard-info">
                      <p className="event-leaderboard-team">{entry.team}</p>
                      {entry.projectName && <p className="event-leaderboard-project">{entry.projectName}</p>}
                      {entry.description && <p className="event-leaderboard-desc">{entry.description}</p>}
                    </div>
                    <div className="event-leaderboard-right">
                      {entry.score && <span className="event-leaderboard-score">{entry.score}</span>}
                      {entry.projectUrl && (
                        <Link href={entry.projectUrl} target="_blank" rel="noopener noreferrer" className="event-resource-link">
                          <ExternalLink size={13} /> View project
                        </Link>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          </section>
        )}

        {/* Testimonials */}
        {isCompanyVisit && event.testimonials && event.testimonials.length > 0 && (
          <section className="about-section">
            <h2 className="section-heading">What Attendees Said</h2>
            <div className="event-testimonials">
              {event.testimonials.map((t) => (
                <blockquote key={t._key} className="event-testimonial">
                  <p>"{t.quote}"</p>
                  {t.author && <cite>— {t.author}</cite>}
                </blockquote>
              ))}
            </div>
          </section>
        )}

        {/* Companies grid */}
        {isCareer && event.companiesPresent && event.companiesPresent.length > 0 && (
          <section className="about-section">
            <h2 className="section-heading">Companies Present</h2>
            <div className="event-companies-grid">
              {event.companiesPresent.map((c) => (
                <div key={c._key} className="event-company-card">
                  {c.logo && (
                    <Image
                      src={urlFor(c.logo).width(160).height(80).quality(85).url()}
                      alt={c.name}
                      width={160}
                      height={80}
                      style={{ objectFit: "contain" }}
                    />
                  )}
                  <p className="event-company-name">{c.name}</p>
                  {c.url && (
                    <Link href={c.url} target="_blank" rel="noopener noreferrer" className="event-resource-link">
                      <ExternalLink size={13} /> Open positions
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Gallery */}
        {event.gallery && event.gallery.length > 0 && (
          <section className="about-section">
            <h2 className="section-heading">Photos</h2>
            <div className="event-gallery">
              {event.gallery.map((img) => (
                <div key={img._key} className="event-gallery-item">
                  <Image
                    src={urlFor(img).width(600).height(400).quality(85).url()}
                    alt=""
                    width={600}
                    height={400}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Back link */}
        <section className="about-section" style={{ paddingBottom: "80px" }}>
          <Link href="/events" className="event-back-link">← All events</Link>
        </section>

      </div>
      <Footer />
    </>
  );
}
