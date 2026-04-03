import Image from "next/image";
import Link from "next/link";
import { Calendar, MapPin } from "lucide-react";
import { urlFor } from "@/lib/sanity";
import type { Event } from "@/types/event";

function isPast(date: string) {
  return new Date(date) < new Date();
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("sv-SE", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function EventCard({ event }: { event: Event }) {
  const past = isPast(event.date);

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-white/10 [border-top-color:rgba(64,196,255,0.22)] bg-white/[0.04] backdrop-blur-lg backdrop-saturate-[160%] shadow-[0_0_0_1px_rgba(64,196,255,0.06),0_24px_64px_rgba(0,0,0,0.5),0_4px_24px_rgba(0,136,204,0.12),inset_0_1px_0_rgba(255,255,255,0.07)] transition-all duration-300 hover:-translate-y-1 hover:[border-top-color:rgba(64,196,255,0.45)] hover:shadow-[0_0_0_1px_rgba(64,196,255,0.1),0_12px_40px_rgba(0,140,255,0.25),inset_0_1px_0_rgba(255,255,255,0.07)]">
      {/* Cover image */}
      <div className="relative aspect-[16/9] w-full bg-[#071525]">
        {event.image ? (
          <Image
            src={urlFor(event.image).width(1200).height(675).quality(90).url()}
            alt={event.title}
            fill
            className="object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-[#0d2040] to-[#071525]" />
        )}
        {past && (
          <span className="absolute left-3 top-3 rounded-full bg-black/60 backdrop-blur-sm border border-white/10 px-2.5 py-0.5 text-xs text-white/70 uppercase tracking-wider">
            Past
          </span>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col gap-3 p-4">
        <h3 className="line-clamp-2 text-base font-semibold leading-snug text-white">
          {event.title}
        </h3>

        <div className="flex flex-col gap-1.5 text-sm text-white/40">
          <span className="flex items-center gap-1.5">
            <Calendar size={14} />
            {formatDate(event.date)}
          </span>
          {event.location && (
            <span className="flex items-center gap-1.5">
              <MapPin size={14} />
              {event.location}
            </span>
          )}
        </div>

        {event.tags && event.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {event.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-blue-500/15 border border-blue-500/25 px-2.5 py-0.5 text-xs text-blue-300 capitalize"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {event.lumaUrl && (
          <div className="mt-auto pt-2">
            <Link
              href={event.lumaUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-[#40c4ff] transition-colors hover:text-[#80d8ff]"
            >
              {past ? "View event" : "Sign up"} →
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
