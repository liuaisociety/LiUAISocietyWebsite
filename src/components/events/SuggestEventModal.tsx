"use client";

import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";

type Status = "idle" | "loading" | "success" | "error";

interface Props {
  onClose: () => void;
}

const EVENT_TYPES = ["Lecture", "Workshop", "Company visit", "Hackathon", "Social", "Other"];

export function SuggestEventModal({ onClose }: Props) {
  const [fields, setFields] = useState({
    name: "",
    email: "",
    eventTitle: "",
    eventType: "",
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
      const res = await fetch("/api/suggest-event", {
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
          <h2 className="modal-title" id="modal-title">Suggest an event</h2>
          <p className="modal-subtitle">Got an idea? We&apos;d love to hear it.</p>
        </div>

        <hr className="modal-divider" />

        {status === "success" ? (
          <div className="modal-success">
            <p className="newsletter-success">Thanks for the idea.</p>
            <p className="newsletter-success-sub">We&apos;ll review your suggestion and get back to you.</p>
            <button className="suggest-event-btn" style={{ marginTop: "1.5rem" }} onClick={onClose}>Close</button>
          </div>
        ) : (
          <form className="modal-form" onSubmit={handleSubmit}>
            <div className="modal-grid">
              <div className="modal-field">
                <label className="modal-label">Your name <span className="modal-required">*</span></label>
                <input className="newsletter-input" type="text" required placeholder="Ada Lovelace" value={fields.name} onChange={set("name")} disabled={status === "loading"} />
              </div>
              <div className="modal-field">
                <label className="modal-label">Your email <span className="modal-required">*</span></label>
                <input className="newsletter-input" type="email" required placeholder="ada@student.liu.se" value={fields.email} onChange={set("email")} disabled={status === "loading"} />
              </div>
              <div className="modal-field modal-field--full">
                <label className="modal-label">Event title <span className="modal-required">*</span></label>
                <input className="newsletter-input" type="text" required placeholder="e.g. Intro to Reinforcement Learning" value={fields.eventTitle} onChange={set("eventTitle")} disabled={status === "loading"} />
              </div>
              <div className="modal-field modal-field--full">
                <label className="modal-label">Event type</label>
                <select className="newsletter-input modal-select" value={fields.eventType} onChange={set("eventType")} disabled={status === "loading"}>
                  <option value="">Select type…</option>
                  {EVENT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div className="modal-field modal-field--full">
                <label className="modal-label">Description <span className="modal-required">*</span></label>
                <textarea className="newsletter-input modal-textarea" required placeholder="What would happen at this event? Any speaker ideas, format, or target audience?" value={fields.description} onChange={set("description")} disabled={status === "loading"} rows={4} />
              </div>
            </div>

            {status === "error" && (
              <p className="newsletter-error" style={{ marginBottom: "0.75rem" }}>Something went wrong — please try again.</p>
            )}

            <button type="submit" className="newsletter-btn" disabled={status === "loading"}>
              {status === "loading" ? "Sending…" : "Send suggestion →"}
            </button>
          </form>
        )}
      </div>
    </div>
  );

  return createPortal(modal, document.body);
}
