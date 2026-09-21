"use client";

import { useState, useEffect } from "react";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

type Consent = "accepted" | "declined" | null;

const STORAGE_KEY = "liuais-cookie-consent";

export const OPEN_COOKIE_SETTINGS_EVENT = "liuais:open-cookie-settings";

export function CookieConsent() {
  const [consent, setConsent] = useState<Consent>(null);
  const [mounted, setMounted] = useState(false);
  const [reopened, setReopened] = useState(false);

  useEffect(() => {
    setMounted(true);
    setConsent(localStorage.getItem(STORAGE_KEY) as Consent);
  }, []);

  useEffect(() => {
    const open = () => setReopened(true);
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setReopened(false);
    };
    window.addEventListener(OPEN_COOKIE_SETTINGS_EVENT, open);
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener(OPEN_COOKIE_SETTINGS_EVENT, open);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  function accept() {
    localStorage.setItem(STORAGE_KEY, "accepted");
    setConsent("accepted");
    setReopened(false);
  }

  function decline() {
    localStorage.setItem(STORAGE_KEY, "declined");
    // Analytics scripts already loaded in this tab only go away with a full reload.
    if (consent === "accepted") {
      window.location.reload();
      return;
    }
    setConsent("declined");
    setReopened(false);
  }

  if (!mounted) return null;

  return (
    <>
      {consent === "accepted" && <Analytics />}
      {consent === "accepted" && <SpeedInsights />}
      {(consent === null || reopened) && (
        <div
          role="dialog"
          aria-label="Cookie consent"
          style={{
            position: "fixed",
            bottom: 16,
            left: 16,
            right: 16,
            maxWidth: 560,
            margin: "0 auto",
            zIndex: 11000,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 14,
            padding: "14px 18px",
            borderRadius: 14,
            background: "rgba(7, 15, 29, 0.92)",
            backdropFilter: "blur(14px) saturate(150%)",
            WebkitBackdropFilter: "blur(14px) saturate(150%)",
            border: "1px solid rgba(255,255,255,0.10)",
            borderTopColor: "rgba(64, 196, 255, 0.22)",
            boxShadow:
              "0 0 0 1px rgba(64,196,255,0.05), 0 18px 48px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.06)",
          }}
        >
          <p
            style={{
              margin: 0,
              flex: "1 1 240px",
              fontSize: 12.5,
              lineHeight: 1.55,
              color: "rgba(255,255,255,0.6)",
            }}
          >
            We use Vercel Analytics to understand how the site is used. No data
            is sold or shared.{" "}
            <a
              href="/privacy"
              style={{ color: "#40c4ff", textDecoration: "underline" }}
            >
              Privacy policy
            </a>
            {consent !== null && (
              <span style={{ display: "block", marginTop: 4 }}>
                Current choice: {consent}.
              </span>
            )}
          </p>
          <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
            <button
              onClick={decline}
              style={{
                fontFamily: "ui-monospace, 'SF Mono', monospace",
                fontSize: 11,
                fontWeight: 600,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                padding: "8px 16px",
                borderRadius: 9,
                cursor: "pointer",
                border: "1px solid rgba(255,255,255,0.15)",
                background: "transparent",
                color: "rgba(255,255,255,0.6)",
                transition: "color 0.2s, border-color 0.2s",
              }}
            >
              Decline
            </button>
            <button
              onClick={accept}
              style={{
                fontFamily: "ui-monospace, 'SF Mono', monospace",
                fontSize: 11,
                fontWeight: 600,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                padding: "8px 16px",
                borderRadius: 9,
                cursor: "pointer",
                border: "1px solid rgba(64,196,255,0.35)",
                background: "rgba(64,196,255,0.10)",
                color: "#9bdfff",
                transition: "background 0.2s, border-color 0.2s",
              }}
            >
              Accept
            </button>
          </div>
        </div>
      )}
    </>
  );
}
