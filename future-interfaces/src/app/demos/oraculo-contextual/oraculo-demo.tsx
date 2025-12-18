"use client";

import dynamic from "next/dynamic";

const OraculoDemo = dynamic(
  () => import("@/demos-components/01-oraculo-contextual").then((m) => m.OraculoDemo),
  { ssr: false },
);

export default function OraculoDemoPage() {
  return <OraculoDemo />;
}
