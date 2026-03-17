import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";

const positions = [
  { href: "https://liu.se/en/work-at-liu/vacancies?q=IDA-2025-00412", tag: "PhD",       title: "PhD student in Statistics",                                              meta: "IDA - Department of Computer and Information Science", deadline: "2026-03-03" },
  { href: "https://liu.se/en/work-at-liu/vacancies?q=IDA-2025-00414", tag: "PhD",       title: "PhD student in Spatio-Temporal Machine Learning",                        meta: "IDA - Department of Computer and Information Science", deadline: "2026-02-06" },
  { href: "https://liu.se/en/work-at-liu/vacancies?q=IDA-2025-00422", tag: "Research",  title: "Research Engineer for Machine Learning in Materials Science",              meta: "IDA - Department of Computer and Information Science", deadline: "2026-02-16" },
  { href: "https://liu.se/en/work-at-liu/vacancies?q=LiU-2025-06246", tag: "Full Time", title: "Data Science experts to the Swedish AI factory",                          meta: "NAISS",                                                deadline: "2026-02-08" },
  { href: "https://liu.se/en/work-at-liu/vacancies?q=LiU-2025-05357", tag: "PhD",       title: "PhD Student in Automatic Control",                                        meta: "ISY - Department of Electrical Engineering",           deadline: "2026-02-27" },
  { href: "https://liu.se/en/work-at-liu/vacancies?q=IMT-2025-00069", tag: "PhD",       title: "PhD student in biomedical engineering, deep learning for medical images",  meta: "IMT - Biomedical Engineering",                         deadline: "2026-02-19" },
  { href: "https://liu.se/en/work-at-liu/vacancies?q=MAI-2025-00127", tag: "PhD",       title: "PhD student in Bayesian Computational Mathematics",                       meta: "MAI - Department of Mathematics",                      deadline: "2026-03-02" },
  { href: "https://liu.se/en/work-at-liu/vacancies?q=LiU-2025-06038", tag: "PhD",       title: "PhD student in secure distributed learning",                              meta: "ISY - Department of Electrical Engineering",           deadline: "2026-02-16" },
  { href: "https://liu.se/en/work-at-liu/vacancies?q=LiU-2026-00086", tag: "PhD",       title: "PhD in Communication-Efficient Decentralized Machine Learning",            meta: "ISY - Department of Electrical Engineering",           deadline: "2026-02-06" },
];

export default function CareerPage() {
  return (
    <>
      <Nav light />
      <div className="career-content">
        <section className="career-intro">
          <h2 className="section-heading">Career</h2>
          <p className="career-description">Explore current job opportunities offered by leading organizations and research groups.</p>
          <p className="career-contact">Want to list a job or thesis opportunity? Reach out to <a href="mailto:contact@liuais.com">contact@liuais.com</a></p>
        </section>

        <section className="career-section">
          <h3 className="career-section-title">Open Positions</h3>
          <div className="career-grid">
            {positions.map(p => (
              <a key={p.title} href={p.href} target="_blank" rel="noopener" className="career-card">
                <span className="career-tag">{p.tag}</span>
                <h4 className="career-card-title">{p.title}</h4>
                <p className="career-card-meta">{p.meta}</p>
                <p className="career-card-deadline">Deadline: {p.deadline}</p>
              </a>
            ))}
          </div>
          <a href="https://liu.se/en/work-at-liu/vacancies?city=Linkoping&institution=IDA+-+Department+of+Computer+and+Information+Science" target="_blank" rel="noopener" className="career-view-all">
            View all positions at LiU &rarr;
          </a>
        </section>

        <section className="career-section">
          <h3 className="career-section-title">Thesis Opportunities</h3>
          <div className="career-grid">
            <a href="#" className="career-card">
              <span className="career-tag thesis">Thesis</span>
              <h4 className="career-card-title">Example: Reinforcement Learning for Autonomous Navigation</h4>
              <p className="career-card-meta">Supervisor: Prof. Example &middot; IDA, LiU</p>
              <p className="career-card-desc">Investigating novel RL approaches for real-time path planning in dynamic environments. Suitable for M.Sc. students in CS or AI.</p>
            </a>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
}
