import type { Metadata } from "next";
import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import { PartnerSection } from "@/components/home/PartnerSection";

export const metadata: Metadata = {
  title: "For Companies | LiU AI Society",
  description:
    "AI workshops, full product builds and event sponsorship for companies, delivered by LiU AI Society at Linköping University.",
  openGraph: {
    title: "For Companies | LiU AI Society",
    description:
      "AI workshops, full product builds and event sponsorship for companies, delivered by LiU AI Society at Linköping University.",
    url: "https://liuais.se/for-companies",
  },
};

const INTRO_POINTS = [
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2v4" /><path d="m16.2 7.8 2.9-2.9" /><path d="M18 12h4" /><path d="m16.2 16.2 2.9 2.9" /><path d="M12 18v4" /><path d="m4.9 19.1 2.9-2.9" /><path d="M2 12h4" /><path d="m4.9 4.9 2.9 2.9" /><circle cx="12" cy="12" r="3" />
      </svg>
    ),
    title: "Get the most updated insights in AI",
    description: "No one is keener than students on learning what is new and what gives the edge.",
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
      </svg>
    ),
    title: "The builders of tomorrow",
    description: "With a proven track record, our project teams host members that possess strong capabilities in agile AI development.",
  },
];

const WORKSHOP_TASKS = [
  { title: "Prompt Engineering & AI tools", description: "Which model for which job, and how to prompt it." },
  { title: "How to automate emails", description: "Drafts, replies and sorting, without touching a line of code." },
  { title: "How to automate meetings", description: "Notes, action items and follow-ups, captured for you." },
  { title: "Document knowledge automation", description: "Summaries, extraction and search across your files." },
  { title: "Data analysis with AI", description: "From spreadsheet to insight without writing code." },
  { title: "How to implement AI safely", description: "What not to feed a model, and how to check its output." },
  { title: "AI Cost tracking", description: "Know what every workflow costs before it scales." },
];

const PROJECTS_IN_THE_WORKS = [
  { title: "AI-enabling internal processes", description: "Building agentic workflows, boosting an organization's efficiency." },
  { title: "Startup pilot and demo", description: "Development of MVP in progress." },
  { title: "Claude Workshop", description: "Learn hidden insights, unlock productivity, and master AI." },
];

const SPONSORSHIP_BENEFITS = [
  { title: "Fund workshops, hackathons and lectures", description: "Pick the format, we bring the audience." },
  { title: "Branding", description: "Put your name on an event or in our channels and reach talent." },
  { title: "Direct access to attendees", description: "Talk to the students in the room, not a list of names." },
  { title: "Post opportunities", description: "Internships and jobs, shared straight with our members." },
  { title: "Host company visits", description: "Open your doors and meet talent." },
];

export default function ForCompaniesPage() {
  return (
    <>
      <Nav />
      <div className="about-content">
        <section className="about-intro">
          <h1 className="page-heading">Meet top AI talent</h1>
          <p className="about-description">
            Today it is more important than ever to stay updated with the latest in tech. Our project teams host members who are up to date with the latest in AI across industry and research, and who possess strong capabilities in agile AI development.
          </p>
          <ul className="service-points">
            {INTRO_POINTS.map((p) => (
              <li key={p.title} className="service-point">
                <span className="service-point-icon">{p.icon}</span>
                <p className="service-point-text">
                  <span className="service-point-title">{p.title}</span>{" "}
                  <span className="service-point-desc">{p.description}</span>
                </p>
              </li>
            ))}
          </ul>
          <p className="service-tagline">
            If you want real value in your AI journey and gain that student-driven innovative edge, <strong>take the leap and let&apos;s talk.</strong>
          </p>
        </section>

        <section className="service-segment">
          <div className="service-text">
            <h2 className="service-title">Event Sponsorship</h2>
            <p className="service-desc">
              Host an event with us and reach the students who are already building with AI. Fund a workshop, a hackathon or a lecture, put your brand in front of the room, and showcase your product to the people who will actually use it in the industry.
            </p>
          </div>
          <div className="service-panel">
            <p className="service-panel-label">Reach the talent in AI</p>
            <ul className="service-list">
              {SPONSORSHIP_BENEFITS.map((b) => (
                <li key={b.title} className="service-list-item">
                  <p className="service-item-title">{b.title}</p>
                  <p className="service-item-desc">{b.description}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="service-segment">
          <div className="service-text">
            <h2 className="service-title">Full Product</h2>
            <p className="service-desc">
              Have an idea for an AI product but no team to build it? We scope, build and ship it with you, from first prototype to something your users can touch.
            </p>
          </div>
          <div className="service-panel">
            <p className="service-panel-label">Latest projects in the works</p>
            <ul className="service-list">
              {PROJECTS_IN_THE_WORKS.map((p) => (
                <li key={p.title} className="service-list-item">
                  <p className="service-item-title">{p.title}</p>
                  {p.description && <p className="service-item-desc">{p.description}</p>}
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="service-segment">
          <div className="service-text">
            <h2 className="service-title">AI Workshop</h2>
            <p className="service-desc">
              Get insight into how the latest developments in AI are shaping the same tools you use in your daily workflows. We provide both the insights and the tools you need to set up AI so that it works with you. After an assessment of your current AI capabilities, we show what works today, what doesn&apos;t, and leave you with workflows you can use the next morning. All tailored to what you need right now.
            </p>
          </div>
          <div className="service-panel">
            <p className="service-panel-label">Workshop tasks &amp; skills</p>
            <ul className="service-list">
              {WORKSHOP_TASKS.map((t) => (
                <li key={t.title} className="service-list-item">
                  <p className="service-item-title">{t.title}</p>
                  <p className="service-item-desc">{t.description}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <PartnerSection eyebrow="The next generation won't wait" heading="Meet top AI Talent" />
      </div>
      <Footer />
    </>
  );
}
