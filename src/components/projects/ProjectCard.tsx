import Image from "next/image";
import { urlFor } from "@/lib/sanity";
import type { Project } from "@/types/project";

export function ProjectCard({ project }: { project: Project }) {
  return (
    <a
      href={project.githubUrl}
      target="_blank"
      rel="noopener noreferrer nofollow"
      className="project-card"
    >
      <div className="project-card-img">
        {project.coverImage ? (
          <Image
            src={urlFor(project.coverImage).width(800).height(450).quality(85).url()}
            alt={project.title}
            width={800}
            height={450}
            style={{ width: "100%", height: "auto", display: "block" }}
          />
        ) : (
          <div className="project-card-placeholder" />
        )}
      </div>

      <div className="project-card-content">
        {project.techStack && project.techStack.length > 0 && (
          <div className="home-event-card-tags">
            {project.techStack.map((tag) => (
              <span key={tag} className="home-event-tag">{tag}</span>
            ))}
          </div>
        )}

        <h3 className="project-card-title">{project.title}</h3>
        <p className="project-card-desc">{project.description}</p>

        {project.contributors && project.contributors.length > 0 && (
          <div className="project-contributors">
            {project.contributors.map((c) =>
              c.github ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={c.github}
                  src={`https://github.com/${c.github}.png?size=64`}
                  alt={c.name}
                  title={c.name}
                  className="contributor-avatar"
                />
              ) : (
                <span key={c.name} className="contributor-name">{c.name}</span>
              )
            )}
          </div>
        )}
      </div>
    </a>
  );
}
