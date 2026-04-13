import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Calendar, MapPin } from "lucide-react";
import { urlFor } from "@/lib/sanity";
import type { Event } from "@/types/event";

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("sv-SE", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function HomeEventCard({ event, past }: { event: Event; past?: boolean }) {
  const href = event.slug?.current ? `/events/${event.slug.current}` : null;
  const Wrapper = href
    ? ({ children }: { children: React.ReactNode }) => <Link href={href} className="home-event-card group">{children}</Link>
    : ({ children }: { children: React.ReactNode }) => <div className="home-event-card group">{children}</div>;

  return (
    <Wrapper>
      {/* Image */}
      <div className="home-event-card-img">
        {event.image ? (
          <Image
            src={urlFor(event.image).width(800).height(450).quality(85).url()}
            alt={event.title}
            width={800}
            height={450}
            style={{ width: "100%", height: "auto", display: "block" }}
            className=""
          />
        ) : (
          <div className="home-event-card-placeholder" />
        )}
        {past && <span className="home-event-badge">Past</span>}
      </div>

      {/* Content below image */}
      <div className="home-event-card-content">
        {event.tags && event.tags.length > 0 && (
          <div className="home-event-card-tags">
            {event.tags.map((tag) => (
              <span key={tag} className="home-event-tag">{tag.replace("-", " ")}</span>
            ))}
          </div>
        )}

        <h3 className="home-event-card-title">{event.title}</h3>

        <div className="home-event-card-meta">
          <span><Calendar size={13} /> {formatDate(event.date)}</span>
          {event.location && <span><MapPin size={13} /> {event.location}</span>}
        </div>

        {href ? (
          <span className="home-event-card-cta">View event →</span>
        ) : event.lumaUrl ? (
          <Link
            href={event.lumaUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="home-event-card-cta"
          >
            {past ? "View recap" : "Sign up"} →
          </Link>
        ) : null}
      </div>
    </Wrapper>
  );
}
