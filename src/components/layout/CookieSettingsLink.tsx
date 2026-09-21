"use client";

import { OPEN_COOKIE_SETTINGS_EVENT } from "@/components/layout/CookieConsent";

export function CookieSettingsLink() {
  return (
    <button
      type="button"
      className="footer-cookie-link"
      onClick={() => window.dispatchEvent(new Event(OPEN_COOKIE_SETTINGS_EVENT))}
    >
      Cookie settings
    </button>
  );
}
