import Link from "next/link";

const demos = [
  {
    href: "/demos/oraculo-contextual",
    title: "El Oráculo Contextual",
    file: "01-oraculo-contextual",
  },
  {
    href: "/demos/periodico-vivo",
    title: "Periódico Vivo",
    file: "02-periodico-vivo",
  },
  {
    href: "/demos/mascota-abstracta",
    title: "Mascota Abstracta",
    file: "03-mascota-abstracta",
  },
  {
    href: "/demos/interfaz-critica",
    title: "Interfaz Crítica",
    file: "04-interfaz-critica",
  },
  {
    href: "/demos/componentes-adhesivos",
    title: "Componentes Adhesivos",
    file: "05-componentes-adhesivos",
  },
];

export default function DemosIndexPage() {
  return (
    <div className="min-h-screen bg-zinc-50 px-6 py-16 text-zinc-950 dark:bg-black dark:text-zinc-50">
      <main className="mx-auto w-full max-w-3xl">
        <h1 className="text-3xl font-semibold tracking-tight">Interfaces del Futuro</h1>
        <p className="mt-3 text-base leading-7 text-zinc-600 dark:text-zinc-400">
          Elige un componente para abrir su demo en una ruta dedicada.
        </p>

        <nav className="mt-10">
          <ul className="flex flex-col gap-3">
            {demos.map((demo) => (
              <li key={demo.href}>
                <Link
                  href={demo.href}
                  className="group flex items-center justify-between rounded-xl border border-black/10 bg-white px-5 py-4 transition-colors hover:bg-zinc-50 dark:border-white/15 dark:bg-zinc-950 dark:hover:bg-zinc-900"
                >
                  <span className="font-medium">{demo.title}</span>
                  <span className="text-sm text-zinc-500 dark:text-zinc-400">
                    {demo.file}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="mt-10 text-sm text-zinc-600 dark:text-zinc-400">
          Tip: usa el botón de volver del navegador para regresar al menú.
        </div>
      </main>
    </div>
  );
}
