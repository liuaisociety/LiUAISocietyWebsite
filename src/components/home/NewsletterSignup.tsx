"use client";

import { useState } from "react";

export function NewsletterSignup() {
  const [fields, setFields] = useState({
    email: "",
    first_name: "",
    last_name: "",
    liu_id: "",
    program: "",
    exam_year: "",
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [checkStatus, setCheckStatus] = useState<"idle" | "loading" | "member" | "not-member" | "error">("idle");

  function set(key: keyof typeof fields) {
    return (e: React.ChangeEvent<HTMLInputElement>) =>
      setFields(f => ({ ...f, [key]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");

    const res = await fetch("/api/newsletter", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(fields),
    });

    setStatus(res.ok ? "success" : "error");
  }

  async function handleCheckMembership() {
    const email = fields.email.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setCheckStatus("error");
      return;
    }

    setCheckStatus("loading");

    const res = await fetch(`/api/newsletter?email=${encodeURIComponent(email)}`, {
      method: "GET",
    });

    if (!res.ok) {
      setCheckStatus("error");
      return;
    }

    const data: { isMember?: boolean } = await res.json();
    setCheckStatus(data.isMember ? "member" : "not-member");
  }

  return (
    <section className="newsletter-section">
      <div className="newsletter-card">
        <p className="newsletter-label">Join the society</p>
        <h2 className="newsletter-heading">Become a LiU AI Society member</h2>
        <p className="newsletter-sub">Get access to events, workshops, and the LiU AI network.</p>

        <hr className="newsletter-divider" />

        {status === "success" ? (
          <div className="newsletter-success-wrap">
            <p className="newsletter-success">You&apos;re in.</p>
            <p className="newsletter-success-sub">Welcome to LiU AI Society.</p>
          </div>
        ) : (
          <form className="newsletter-form" onSubmit={handleSubmit}>
            <div className="newsletter-grid">
              <input className="newsletter-input" type="text"  required placeholder="First name"                     value={fields.first_name}   onChange={set("first_name")}   disabled={status === "loading"} />
              <input className="newsletter-input" type="text"  required placeholder="Last name"                      value={fields.last_name}    onChange={set("last_name")}    disabled={status === "loading"} />
              <input className="newsletter-input" type="email" required placeholder="Email address"                  value={fields.email}        onChange={set("email")}        disabled={status === "loading"} />
              <input className="newsletter-input" type="text"  required placeholder="LiU ID (e.g. kemme789)"         value={fields.liu_id}       onChange={set("liu_id")}       disabled={status === "loading"} />
              <input className="newsletter-input" type="text"  required placeholder="University program"             value={fields.program}      onChange={set("program")}      disabled={status === "loading"} />
              <input className="newsletter-input" type="text" required placeholder="Exam year (e.g. 2028)" value={fields.exam_year} onChange={set("exam_year")} disabled={status === "loading"} />
            </div>

            <button type="submit" className="newsletter-btn" disabled={status === "loading"}>
              {status === "loading" ? "Signing up…" : "Sign up as a LiU AIS Member"}
            </button>

            <button
              type="button"
              className="newsletter-secondary-btn"
              onClick={handleCheckMembership}
              disabled={status === "loading" || checkStatus === "loading"}
            >
              {checkStatus === "loading" ? "Checking membership…" : "Am I a member?"}
            </button>

            {checkStatus === "member" && (
              <p className="newsletter-check-result">You are already a member.</p>
            )}
            {checkStatus === "not-member" && (
              <p className="newsletter-check-result">We could not find that email. You can sign up above.</p>
            )}
            {checkStatus === "error" && (
              <p className="newsletter-error">Enter a valid email, then try membership check again.</p>
            )}

            {status === "error" && (
              <p className="newsletter-error">Something went wrong — please try again.</p>
            )}
            <p className="newsletter-sub" style={{ marginTop: "1rem", marginBottom: 0 }}>We respect your privacy. Unsubscribe at any time.</p>
          </form>
        )}
      </div>
    </section>
  );
}
