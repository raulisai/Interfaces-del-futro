"use client";

import dynamic from "next/dynamic";

const MascotaDemo = dynamic(
  () =>
    import("@/demos-components/03-mascota-abstracta").then((m) => m.MascotaDemo),
  { ssr: false },
);

export default function MascotaDemoPage() {
  return <MascotaDemo />;
}
