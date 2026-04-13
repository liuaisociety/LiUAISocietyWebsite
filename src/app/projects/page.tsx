import type { Metadata } from "next";
import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import { client } from "@/lib/sanity";
import { projectsQuery } from "@/lib/queries";
import { ProjectsFilter } from "@/components/projects/ProjectsFilter";
import { SuggestProjectButton } from "@/components/projects/SuggestProjectButton";
import type { Project } from "@/types/project";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "AI & ML Projects | LiU AI Society",
  description:
    "Explore open-source AI and machine learning projects built by LiU AI Society members — collaborative, student-driven, and publicly available on GitHub.",
  openGraph: {
    title: "AI & ML Projects | LiU AI Society",
    description:
      "Explore open-source AI and machine learning projects built by LiU AI Society members — collaborative, student-driven, and publicly available on GitHub.",
    url: "https://liuais.se/projects",
  },
};

export default async function ProjectsPage() {
  let projects: Project[] = [];
  try {
    projects = await client.fetch(projectsQuery);
  } catch {
    // Sanity not configured or unreachable
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "AI & ML Projects — LiU AI Society",
    description: "Open-source AI and machine learning projects built by LiU AI Society members at Linköping University.",
    url: "https://liuais.se/projects",
    ...(projects.length > 0 && {
      mainEntity: {
        "@type": "ItemList",
        itemListElement: projects.map((p, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: p.title,
          description: p.description,
          url: p.githubUrl,
        })),
      },
    }),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Nav />
      <div className="about-content">
        <section className="about-intro">
          <h1 className="page-heading">Projects</h1>
          <p className="about-description">
            A showcase of work built by our members, from research experiments to full-scale applications.
          </p>
        </section>

        <section className="about-section" style={{ paddingBottom: "80px" }}>
          <ProjectsFilter projects={projects} />
        </section>

        <section className="about-section" style={{ textAlign: "center", paddingBottom: "80px" }}>
          <SuggestProjectButton />
        </section>
      </div>
      <Footer />
    </>
  );
}
