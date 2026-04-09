"use client";

import { useState } from "react";
import { SuggestEventModal } from "./SuggestEventModal";

export function SuggestEventButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button className="suggest-event-btn" onClick={() => setOpen(true)}>
        Suggest an event →
      </button>
      {open && <SuggestEventModal onClose={() => setOpen(false)} />}
    </>
  );
}
