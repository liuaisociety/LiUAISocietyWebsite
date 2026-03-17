"use client";

import dynamic from "next/dynamic";

const ArcScene = dynamic(() => import("./ArcScene"), { ssr: false });

export function ArcSceneClient() {
  return <ArcScene />;
}
