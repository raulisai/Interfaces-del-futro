"use client";

import dynamic from "next/dynamic";

const PeriodicoDemo = dynamic(
  () =>
    import("@/demos-components/02-periodico-vivo").then((m) => m.PeriodicoDemo),
  { ssr: false },
);

export default function PeriodicoDemoPage() {
  return <PeriodicoDemo />;
}
