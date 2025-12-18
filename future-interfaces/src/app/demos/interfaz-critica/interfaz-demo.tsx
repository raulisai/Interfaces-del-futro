"use client";

import dynamic from "next/dynamic";

const InterfazCriticaDemo = dynamic(
  () =>
    import("@/demos-components/04-interfaz-critica").then(
      (m) => m.InterfazCriticaDemo,
    ),
  { ssr: false },
);

export default function InterfazDemoPage() {
  return <InterfazCriticaDemo />;
}
