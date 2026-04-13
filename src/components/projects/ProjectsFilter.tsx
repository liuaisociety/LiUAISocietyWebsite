"use client";

import { useState, useMemo } from "react";
import { ProjectCard } from "./ProjectCard";
import type { Project } from "@/types/project";

export function ProjectsFilter({ projects }: { projects: Project[] }) {
  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  const allTags = useMemo(() => {
    const set = new Set<string>();
    projects.forEach((p) => p.techStack?.forEach((t) => set.add(t)));
    return Array.from(set).sort();
  }, [projects]);

  const filtered = useMemo(() => {
    if (activeFilters.length === 0) return projects;
    return projects.filter((p) =>
      activeFilters.some((f) => p.techStack?.includes(f))
    );
  }, [projects, activeFilters]);

  function toggleFilter(tag: string) {
    setActiveFilters((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  }

  if (projects.length === 0) {
    return <p className="about-description">No projects yet — check back soon.</p>;
  }

  return (
    <>
      {allTags.length > 0 && (
        <div className="project-filters">
          <button
            className={`project-filter-pill${activeFilters.length === 0 ? " active" : ""}`}
            onClick={() => setActiveFilters([])}
          >
            All
          </button>
          {allTags.map((tag) => (
            <button
              key={tag}
              className={`project-filter-pill${activeFilters.includes(tag) ? " active" : ""}`}
              onClick={() => toggleFilter(tag)}
            >
              {tag}
            </button>
          ))}
        </div>
      )}

      <div className="home-events-grid">
        {filtered.map((p) => (
          <ProjectCard key={p._id} project={p} />
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="about-description" style={{ marginTop: "2rem" }}>
          No projects match the selected filters.
        </p>
      )}
    </>
  );
}
