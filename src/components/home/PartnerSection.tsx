"use client";

import { useState } from "react";

type Status = "idle" | "loading" | "success" | "error";

const INTERESTS = [
  "Event sponsorship",
  "Hackathon",
  "Recruitment & talent",
  "Research collaboration",
  "Guest lecture",
  "Company visit",
  "Job posting",
  "Other",
];

const BENEFITS = [
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/>
      </svg>
    ),
    title: "Event sponsorship",
    description: "Fund workshops, hackathons, and lectures. Get stage time, branding, and direct access to attendees.",
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    ),
    title: "Recruitment & talent",
    description: "Meet LiU's top AI and ML students. Post opportunities, host company visits, or present at one of our events.",
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v4M9 3v18m0 0h10a2 2 0 0 0 2-2v-4M9 21H5a2 2 0 0 1-2-2v-4m0 0h18"/>
      </svg>
    ),
    title: "Research collaboration",
    description: "Bring real problems to ambitious people. Engage with applied AI student projects and faculty.",
  },
];

export function PartnerSection() {
  const [fields, setFields] = useState({ name: "", company: "", email: "", interest: "", message: "" });
  const [status, setStatus] = useState<Status>("idle");

  function set(key: keyof typeof fields) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setFields(f => ({ ...f, [key]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/partner", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(fields),
      });
      setStatus(res.ok ? "success" : "error");
    } catch {
      setStatus("error");
    }
  }

  return (
    <section className="partner-section">
      <div className="partner-inner">

        {/* Left — pitch */}
        <div className="partner-pitch">
          <p className="partner-eyebrow">For companies &amp; organisations</p>
          <h2 className="partner-heading">Shape the future<br />of AI talent</h2>
          <p className="partner-sub">
            LiU AI Society connects ambitious students with industry and academia.
            Partner with us to build your brand on campus, access exceptional talent,
            and contribute to the AI ecosystem in Linköping.
          </p>

          <ul className="partner-benefits">
            {BENEFITS.map((b) => (
              <li key={b.title} className="partner-benefit">
                <span className="partner-benefit-icon">{b.icon}</span>
                <div>
                  <p className="partner-benefit-title">{b.title}</p>
                  <p className="partner-benefit-desc">{b.description}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Right — contact form */}
        <div className="partner-form-wrap">
          {status === "success" ? (
            <div className="partner-success">
              <p className="newsletter-success">Message sent.</p>
              <p className="newsletter-success-sub">We&apos;ll be in touch shortly.</p>
            </div>
          ) : (
            <>
              <p className="newsletter-label" style={{ marginBottom: "1.2rem" }}>Get in touch</p>
              <form className="partner-form" onSubmit={handleSubmit}>
                <div className="partner-form-grid">
                  <div className="modal-field">
                    <label className="modal-label">Your name <span className="modal-required">*</span></label>
                    <input className="newsletter-input" type="text" required placeholder="Alan Turing" value={fields.name} onChange={set("name")} disabled={status === "loading"} />
                  </div>
                  <div className="modal-field">
                    <label className="modal-label">Company <span className="modal-required">*</span></label>
                    <input className="newsletter-input" type="text" required placeholder="Ericsson" value={fields.company} onChange={set("company")} disabled={status === "loading"} />
                  </div>
                  <div className="modal-field partner-form-full">
                    <label className="modal-label">Email <span className="modal-required">*</span></label>
                    <input className="newsletter-input" type="email" required placeholder="alan@company.com" value={fields.email} onChange={set("email")} disabled={status === "loading"} />
                  </div>
                  <div className="modal-field partner-form-full">
                    <label className="modal-label">Area of interest</label>
                    <select className="newsletter-input modal-select" value={fields.interest} onChange={set("interest")} disabled={status === "loading"}>
                      <option value="">Select…</option>
                      {INTERESTS.map(i => <option key={i} value={i}>{i}</option>)}
                    </select>
                  </div>
                  <div className="modal-field partner-form-full">
                    <label className="modal-label">Message <span className="modal-required">*</span></label>
                    <textarea className="newsletter-input modal-textarea" required placeholder="Tell us a bit about what you have in mind…" value={fields.message} onChange={set("message")} disabled={status === "loading"} rows={4} />
                  </div>
                </div>

                {status === "error" && (
                  <p className="newsletter-error" style={{ marginBottom: "0.75rem" }}>Something went wrong — please try again.</p>
                )}

                <button type="submit" className="newsletter-btn" disabled={status === "loading"}>
                  {status === "loading" ? "Sending…" : "Send message →"}
                </button>
              </form>
            </>
          )}
        </div>

      </div>
    </section>
  );
}
