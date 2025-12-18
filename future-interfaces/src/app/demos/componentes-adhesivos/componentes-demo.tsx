"use client";

import dynamic from "next/dynamic";

const ComponentesAdhesivosDemo = dynamic(
  () =>
    import("@/demos-components/05-componentes-adhesivos").then(
      (m) => m.ComponentesAdhesivosDemo,
    ),
  { ssr: false },
);

export default function ComponentesDemoPage() {
  return <ComponentesAdhesivosDemo />;
}
