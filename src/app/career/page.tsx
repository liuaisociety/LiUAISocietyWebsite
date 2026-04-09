import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import { fetchLiUJobs } from "@/lib/liuJobs";

export const revalidate = 3600;

export default async function CareerPage() {
  const liuJobs = await fetchLiUJobs();

  return (
    <>
      <Nav />
      <div className="career-content about-page">
        <section className="career-intro">
          <h2 className="section-heading">Career</h2>
          <p className="career-description">Explore current job opportunities offered by leading organizations and research groups.</p>
          <p className="career-contact">Want to list a job or thesis opportunity? Reach out to <a href="mailto:contact@liuais.com">contact@liuais.com</a></p>
        </section>

        <section className="career-section">
          <h3 className="career-section-title">Open Positions at LiU</h3>
          {liuJobs.length > 0 ? (
            <>
              <div className="career-grid">
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

        <section className="career-section">
          <h3 className="career-section-title">Thesis Opportunities</h3>
          <div className="career-grid">
            <div className="career-card">
              <span className="career-tag thesis">Thesis</span>
              <h4 className="career-card-title">Example: Reinforcement Learning for Autonomous Navigation</h4>
              <p className="career-card-meta">Supervisor: Prof. Example &middot; IDA, LiU</p>
              <p className="career-card-desc">Investigating novel RL approaches for real-time path planning in dynamic environments. Suitable for M.Sc. students in CS or AI.</p>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
}
