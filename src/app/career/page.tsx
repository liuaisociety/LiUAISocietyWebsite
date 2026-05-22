import type { Metadata } from "next";
import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import { fetchLiUJobs } from "@/lib/liuJobs";
import { client } from "@/lib/sanity";
import { jobPostingsQuery } from "@/lib/queries";

export const metadata: Metadata = {
  title: "Career | LiU AI Society",
  description:
    "Explore AI and machine learning job openings, internships, and thesis opportunities at Linköping University — curated by LiU AI Society for students in CS and AI.",
  openGraph: {
    title: "Career | LiU AI Society",
    description:
      "Explore AI and machine learning job openings, internships, and thesis opportunities at Linköping University — curated by LiU AI Society for students in CS and AI.",
    url: "https://liuais.se/career",
  },
};

export const revalidate = 3600;

interface JobPosting {
  _id: string;
  title: string;
  company: string;
  location?: string;
  deadline?: string;
  description?: string;
  url: string;
  tag?: string;
  color?: string;
}

export default async function CareerPage() {
  const today = new Date().toISOString().split("T")[0];
  const [liuJobs, manualJobs] = await Promise.all([
    fetchLiUJobs(),
    client.fetch<JobPosting[]>(jobPostingsQuery, { today }),
  ]);

  return (
    <>
      <Nav />
      <div className="career-content about-page">
        <section className="career-intro">
          <h1 className="page-heading">Career</h1>
          <p className="career-description">Explore current job opportunities offered by leading organizations and research groups.</p>
          <p className="career-contact">Want to list a job or thesis opportunity? Reach out to <a href="mailto:contact@liuais.com">contact@liuais.com</a></p>
        </section>

        <section className="career-section">
          <h3 className="career-section-title">Open Positions</h3>
          {manualJobs.length > 0 || liuJobs.length > 0 ? (
            <>
              <div className="career-grid">
                {manualJobs.map((job) => (
                  <a
                    key={job._id}
                    href={job.url}
                    target="_blank"
                    rel="noopener"
                    className="career-card"
                    style={job.color ? { borderLeftColor: job.color } : undefined}
                  >
                    {job.tag && <span className="career-tag">{job.tag}</span>}
                    <h4 className="career-card-title">{job.title}</h4>
                    <p className="career-card-meta">
                      {job.company}
                      {job.location ? ` · ${job.location}` : ""}
                    </p>
                    {job.description && <p className="career-card-desc">{job.description}</p>}
                    {job.deadline && <p className="career-card-deadline">Deadline: {job.deadline}</p>}
                  </a>
                ))}
                {liuJobs.map((p) => (
                  <a key={p.href} href={p.href} target="_blank" rel="noopener" className="career-card">
                    <span className="career-tag">{p.tag}</span>
                    <h4 className="career-card-title">{p.title}</h4>
                    <p className="career-card-meta">{p.department}</p>
                    {p.deadline && <p className="career-card-deadline">Deadline: {p.deadline}</p>}
                  </a>
                ))}
              </div>
              <a
                href="https://liu.se/en/work-at-liu/vacancies?city=Linkoping&institution=IDA+-+Department+of+Computer+and+Information+Science"
                target="_blank"
                rel="noopener"
                className="career-view-all"
              >
                View all positions at LiU →
              </a>
            </>
          ) : (
            <p className="career-description">No open positions found right now — check back soon.</p>
          )}
        </section>
      </div>
      <Footer />
    </>
  );
}
