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
    <div className="group relative flex flex-col overflow-hidden rounded-lg border border-neutral-200 bg-white transition-shadow hover:shadow-md">
      {/* Cover image */}
      <div className="relative aspect-[16/9] w-full bg-neutral-100">
        {event.image ? (
          <Image
            src={urlFor(event.image).width(1200).height(675).quality(90).url()}
            alt={event.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-neutral-200 to-neutral-300" />
        )}
        {past && (
          <span className="absolute left-3 top-3 rounded-full bg-black/70 px-2 py-0.5 text-xs text-white">
            Past
          </span>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col gap-3 p-4">
        <h3 className="line-clamp-2 text-base font-semibold leading-snug text-neutral-900">
          {event.title}
        </h3>

        <div className="flex flex-col gap-1.5 text-sm text-neutral-500">
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
                className="rounded-full bg-neutral-100 px-2 py-0.5 text-xs text-neutral-600 capitalize"
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
              className="inline-flex items-center gap-1 text-sm font-medium text-black underline-offset-2 hover:underline"
            >
              {past ? "View event" : "Sign up"} →
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
