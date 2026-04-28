"use client";

import { useState } from "react";
import { SuggestProjectModal } from "./SuggestProjectModal";

export function SuggestProjectButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button className="suggest-event-btn" onClick={() => setOpen(true)}>
        Want to be featured here? →
      </button>
      {open && <SuggestProjectModal onClose={() => setOpen(false)} />}
    </>
  );
}
