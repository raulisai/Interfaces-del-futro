"use client"

/**
 * Página Demo - Sistema de Conciencia UI
 *
 * Esta página demuestra el sistema de interfaces vivas.
 * Observa. Explora. La UI te acompañará.
 */

import { ConsciousnessProvider, useConsciousnessContext } from "@/components/presence"
import { BreathingShape } from "@/components/presence"
import { PresenceGrid, WanderingPresence } from "@/components/presence"
import { motion } from "framer-motion"

export default function Home() {
  return (
    <ConsciousnessProvider
      enabled={true}
      sensitivity={1}
      debug={true}
      showCompanion={true}
      showFrictionLine={true}
      showFocusLine={true}
      showWhispers={true}
      showTimeMarker={true}
      showOverlay={true}
    >
      <MainContent />
    </ConsciousnessProvider>
  )
}

function MainContent() {
  const { consciousnessState, emotionalTone, simulateFriction, world } =
    useConsciousnessContext()

  return (
    <main className="min-h-screen relative">
      {/* Hero section */}
      <section className="min-h-screen flex flex-col justify-center items-center px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="text-center max-w-2xl"
        >
          <h1
            className="font-serif text-4xl md:text-5xl lg:text-6xl font-light tracking-tight mb-6 text-breathing"
            style={{ color: "var(--foreground)" }}
          >
            Conciencia UI
          </h1>

          <p
            className="text-lg md:text-xl font-light leading-relaxed mb-12"
            style={{ color: "var(--whisper-soft)", opacity: 0.7 }}
          >
            La interfaz no escucha eventos.
            <br />
            Escucha estados del mundo.
          </p>

          {/* Breathing shape central */}
          <div className="flex justify-center mb-16">
            <BreathingShape
              state={consciousnessState}
              tone={emotionalTone}
              variant="blob"
              size="lg"
            />
          </div>

          {/* Estado actual */}
          <motion.div
            className="inline-block px-4 py-2 rounded-full glass"
            animate={{
              scale: consciousnessState === "interrupting" ? [1, 1.02, 1] : 1,
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <span className="font-mono text-sm tracking-wider" style={{ opacity: 0.6 }}>
              {consciousnessState}
            </span>
          </motion.div>
        </motion.div>
      </section>

      {/* Sección de exploración */}
      <section className="min-h-screen flex flex-col justify-center items-center px-8 py-24">
        <div className="max-w-4xl w-full">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 0.8 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
            className="font-serif text-2xl md:text-3xl font-light mb-16 text-center"
          >
            Principios
          </motion.h2>

          <div className="grid md:grid-cols-3 gap-12">
            {principles.map((principle, i) => (
              <PrincipleCard key={i} {...principle} delay={i * 0.2} />
            ))}
          </div>
        </div>
      </section>

      {/* Sección interactiva */}
      <section className="min-h-screen flex flex-col justify-center items-center px-8 py-24">
        <div className="max-w-2xl w-full text-center">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 0.8 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
            className="font-serif text-2xl md:text-3xl font-light mb-8"
          >
            Experimenta
          </motion.h2>

          <p className="text-sm mb-12" style={{ opacity: 0.5 }}>
            Interactúa para ver cómo la UI responde a tu estado
          </p>

          {/* Controles de simulación */}
          <div className="flex flex-wrap justify-center gap-4 mb-16">
            <SimulationButton
              label="Añadir fricción"
              onClick={() => simulateFriction(2)}
            />
            <SimulationButton
              label="Mucha fricción"
              onClick={() => simulateFriction(5)}
              variant="danger"
            />
          </div>

          {/* Visualización de estado */}
          <div className="grid grid-cols-3 gap-8">
            <StateIndicator label="Fricción" value={world.friction} max={10} />
            <StateIndicator label="Atención" value={world.attention} max={10} />
            <StateIndicator label="Fatiga" value={world.fatigue} max={10} />
          </div>

          {/* Presence grid */}
          <div className="mt-16 flex justify-center">
            <PresenceGrid
              state={consciousnessState}
              tone={emotionalTone}
              rows={5}
              cols={5}
            />
          </div>
        </div>
      </section>

      {/* Wandering presence */}
      <WanderingPresence
        state={consciousnessState}
        bounds={{ x: [5, 95], y: [10, 90] }}
        wanderInterval={8000}
      >
        <BreathingShape
          state={consciousnessState}
          tone={emotionalTone}
          variant="circle"
          size="sm"
        />
      </WanderingPresence>

      {/* Sección de formas */}
      <section className="min-h-screen flex flex-col justify-center items-center px-8 py-24">
        <div className="max-w-4xl w-full">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 0.8 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
            className="font-serif text-2xl md:text-3xl font-light mb-16 text-center"
          >
            Formas de Presencia
          </motion.h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 justify-items-center">
            <ShapeDemo
              label="Círculo"
              variant="circle"
              state={consciousnessState}
              tone={emotionalTone}
            />
            <ShapeDemo
              label="Blob"
              variant="blob"
              state={consciousnessState}
              tone={emotionalTone}
            />
            <ShapeDemo
              label="Línea"
              variant="line"
              state={consciousnessState}
              tone={emotionalTone}
            />
            <ShapeDemo
              label="Campo"
              variant="dot-field"
              state={consciousnessState}
              tone={emotionalTone}
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 text-center">
        <p className="font-mono text-xs" style={{ opacity: 0.3 }}>
          La mejor interfaz es la que no necesita aparecer.
        </p>
      </footer>
    </main>
  )
}

// Componentes auxiliares

const principles = [
  {
    title: "Observa",
    description: "La UI no reacciona a eventos. Observa estados del mundo.",
  },
  {
    title: "Juzga",
    description: "Evalúa si vale la pena manifestarse. Puede decidir no hacerlo.",
  },
  {
    title: "Susurra",
    description: "Cuando aparece, lo hace sutilmente. Nunca grita.",
  },
]

function PrincipleCard({
  title,
  description,
  delay,
}: {
  title: string
  description: string
  delay: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay }}
      viewport={{ once: true }}
      className="text-center"
    >
      <h3 className="font-serif text-xl mb-4" style={{ opacity: 0.9 }}>
        {title}
      </h3>
      <p className="text-sm leading-relaxed" style={{ opacity: 0.5 }}>
        {description}
      </p>
    </motion.div>
  )
}

function SimulationButton({
  label,
  onClick,
  variant = "default",
}: {
  label: string
  onClick: () => void
  variant?: "default" | "danger"
}) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="px-6 py-3 rounded-full font-mono text-sm tracking-wide transition-colors"
      style={{
        background:
          variant === "danger"
            ? "oklch(30% 0.1 25 / 0.3)"
            : "oklch(50% 0.02 260 / 0.1)",
        color: variant === "danger" ? "var(--alert-soft)" : "var(--foreground)",
        border: "1px solid",
        borderColor:
          variant === "danger"
            ? "oklch(50% 0.1 25 / 0.3)"
            : "oklch(50% 0.02 260 / 0.2)",
      }}
    >
      {label}
    </motion.button>
  )
}

function StateIndicator({
  label,
  value,
  max,
}: {
  label: string
  value: number
  max: number
}) {
  const percentage = (value / max) * 100

  return (
    <div className="text-center">
      <div className="font-mono text-xs mb-2" style={{ opacity: 0.5 }}>
        {label}
      </div>
      <div
        className="h-24 w-2 mx-auto rounded-full overflow-hidden"
        style={{ background: "oklch(50% 0.02 260 / 0.1)" }}
      >
        <motion.div
          className="w-full rounded-full"
          style={{
            background:
              value > 7 ? "var(--friction-line)" : "var(--presence-neutral)",
          }}
          animate={{ height: `${percentage}%` }}
          transition={{ type: "spring", damping: 20 }}
        />
      </div>
      <div className="font-mono text-xs mt-2" style={{ opacity: 0.7 }}>
        {value.toFixed(1)}
      </div>
    </div>
  )
}

function ShapeDemo({
  label,
  variant,
  state,
  tone,
}: {
  label: string
  variant: "circle" | "blob" | "line" | "dot-field"
  state: Parameters<typeof BreathingShape>[0]["state"]
  tone: Parameters<typeof BreathingShape>[0]["tone"]
}) {
  return (
    <div className="text-center">
      <div className="h-24 flex items-center justify-center mb-4">
        <BreathingShape state={state} tone={tone} variant={variant} size="md" />
      </div>
      <span className="font-mono text-xs" style={{ opacity: 0.4 }}>
        {label}
      </span>
    </div>
  )
}
