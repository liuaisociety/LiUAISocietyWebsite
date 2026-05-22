"use client";

import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";

type Status = "idle" | "loading" | "success" | "error";

interface Props {
  onClose: () => void;
}

const TECH_OPTIONS = [
  "Python", "TypeScript", "JavaScript", "Rust", "Go", "C++",
  "PyTorch", "TensorFlow", "Next.js", "React", "FastAPI", "Other",
];

export function SuggestProjectModal({ onClose }: Props) {
  const [fields, setFields] = useState({
    name: "",
    email: "",
    projectTitle: "",
    githubUrl: "",
    techStack: "",
    description: "",
  });
  const [status, setStatus] = useState<Status>("idle");
  const backdropRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  function set(key: keyof typeof fields) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setFields(f => ({ ...f, [key]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/suggest-project", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(fields),
      });
      setStatus(res.ok ? "success" : "error");
    } catch {
      setStatus("error");
    }
  }

  function handleBackdropClick(e: React.MouseEvent) {
    if (e.target === backdropRef.current) onClose();
  }

  const modal = (
    <div className="modal-backdrop" ref={backdropRef} onClick={handleBackdropClick}>
      <div className="modal-card" role="dialog" aria-modal="true" aria-labelledby="modal-title">

        <button className="modal-close" onClick={onClose} aria-label="Close">✕</button>

        <div className="modal-header">
          <p className="modal-eyebrow">LiU AI Society</p>
          <h2 className="modal-title" id="modal-title">Submit your project</h2>
          <p className="modal-subtitle">Built something cool? We&apos;d love to feature it.</p>
        </div>

        <hr className="modal-divider" />

        {status === "success" ? (
          <div className="modal-success">
            <p className="newsletter-success">Submission received.</p>
            <p className="newsletter-success-sub">We&apos;ll review your project and reach out if we feature it.</p>
            <button className="suggest-event-btn" style={{ marginTop: "1.5rem" }} onClick={onClose}>Close</button>
          </div>
        ) : (
          <form className="modal-form" onSubmit={handleSubmit}>
            <div className="modal-grid">
              <div className="modal-field">
                <label className="modal-label">Your name <span className="modal-required">*</span></label>
                <input className="newsletter-input" type="text" required placeholder="Alan Turing" value={fields.name} onChange={set("name")} disabled={status === "loading"} />
              </div>
              <div className="modal-field">
                <label className="modal-label">Your email <span className="modal-required">*</span></label>
                <input className="newsletter-input" type="email" required placeholder="alan@student.liu.se" value={fields.email} onChange={set("email")} disabled={status === "loading"} />
              </div>
              <div className="modal-field modal-field--full">
                <label className="modal-label">Project name <span className="modal-required">*</span></label>
                <input className="newsletter-input" type="text" required placeholder="e.g. LiU RAG Assistant" value={fields.projectTitle} onChange={set("projectTitle")} disabled={status === "loading"} />
              </div>
              <div className="modal-field modal-field--full">
                <label className="modal-label">GitHub URL <span className="modal-required">*</span></label>
                <input className="newsletter-input" type="url" required placeholder="https://github.com/alan-turing/project" value={fields.githubUrl} onChange={set("githubUrl")} disabled={status === "loading"} />
              </div>
              <div className="modal-field modal-field--full">
                <label className="modal-label">Tech stack</label>
                <select className="newsletter-input modal-select" value={fields.techStack} onChange={set("techStack")} disabled={status === "loading"}>
                  <option value="">Select primary technology…</option>
                  {TECH_OPTIONS.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div className="modal-field modal-field--full">
                <label className="modal-label">Description <span className="modal-required">*</span></label>
                <textarea className="newsletter-input modal-textarea" required placeholder="What does your project do? What problem does it solve?" value={fields.description} onChange={set("description")} disabled={status === "loading"} rows={4} />
              </div>
            </div>

            {status === "error" && (
              <p className="newsletter-error" style={{ marginBottom: "0.75rem" }}>Something went wrong — please try again.</p>
            )}

            <button type="submit" className="newsletter-btn" disabled={status === "loading"}>
              {status === "loading" ? "Sending…" : "Submit project →"}
            </button>
          </form>
        )}
      </div>
    </div>
  );

  return createPortal(modal, document.body);
}
