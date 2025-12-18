"use client"

/**
 * WhisperOverlay - Capa de Susurros
 *
 * Una capa que envuelve toda la experiencia.
 * No bloquea, no interrumpe, solo... susurra.
 *
 * Contiene:
 * - Gradientes atmosféricos
 * - Partículas ambientales
 * - Vignette emocional
 */

import { motion, AnimatePresence } from "framer-motion"
import { useEffect, useState, useMemo } from "react"
import type { ConsciousnessState, EmotionalTone } from "@/types/consciousness"

interface WhisperOverlayProps {
  state: ConsciousnessState
  tone: EmotionalTone
  intensity?: number
  children?: React.ReactNode
}

const toneAtmospheres: Record<EmotionalTone, {
  gradient: string
  vignetteColor: string
  particleColor: string
}> = {
  neutral: {
    gradient: "radial-gradient(ellipse at 50% 0%, oklch(20% 0.01 240 / 0.1) 0%, transparent 70%)",
    vignetteColor: "oklch(10% 0.01 240 / 0.3)",
    particleColor: "oklch(80% 0.02 240)",
  },
  curious: {
    gradient: "radial-gradient(ellipse at 30% 20%, oklch(50% 0.1 70 / 0.08) 0%, transparent 60%)",
    vignetteColor: "oklch(30% 0.05 70 / 0.2)",
    particleColor: "oklch(75% 0.12 70)",
  },
  concerned: {
    gradient: "radial-gradient(ellipse at 70% 80%, oklch(45% 0.12 20 / 0.1) 0%, transparent 60%)",
    vignetteColor: "oklch(25% 0.08 20 / 0.25)",
    particleColor: "oklch(65% 0.15 20)",
  },
  encouraging: {
    gradient: "radial-gradient(ellipse at 50% 100%, oklch(55% 0.1 145 / 0.08) 0%, transparent 70%)",
    vignetteColor: "oklch(30% 0.05 145 / 0.15)",
    particleColor: "oklch(70% 0.12 145)",
  },
  questioning: {
    gradient: "radial-gradient(ellipse at 20% 50%, oklch(50% 0.1 280 / 0.08) 0%, transparent 60%)",
    vignetteColor: "oklch(25% 0.06 280 / 0.2)",
    particleColor: "oklch(70% 0.12 280)",
  },
  peaceful: {
    gradient: "radial-gradient(ellipse at 50% 50%, oklch(60% 0.06 220 / 0.06) 0%, transparent 80%)",
    vignetteColor: "oklch(20% 0.03 220 / 0.15)",
    particleColor: "oklch(75% 0.08 220)",
  },
}

const stateIntensities: Record<ConsciousnessState, number> = {
  dormant: 0,
  observing: 0.2,
  sensing: 0.35,
  pondering: 0.5,
  whispering: 0.7,
  interrupting: 0.9,
  retreating: 0.15,
}

export function WhisperOverlay({
  state,
  tone,
  intensity = 1,
  children,
}: WhisperOverlayProps) {
  const atmosphere = toneAtmospheres[tone]
  const baseIntensity = stateIntensities[state] * intensity

  return (
    <div className="relative min-h-screen">
      {/* Capa de gradiente atmosférico */}
      <motion.div
        className="fixed inset-0 pointer-events-none z-30"
        style={{ background: atmosphere.gradient }}
        animate={{ opacity: baseIntensity }}
        transition={{ duration: 2, ease: "easeInOut" }}
      />

      {/* Vignette emocional */}
      <motion.div
        className="fixed inset-0 pointer-events-none z-30"
        style={{
          boxShadow: `inset 0 0 200px 100px ${atmosphere.vignetteColor}`,
        }}
        animate={{ opacity: baseIntensity * 0.7 }}
        transition={{ duration: 3, ease: "easeInOut" }}
      />

      {/* Partículas ambientales */}
      <AnimatePresence>
        {state !== "dormant" && baseIntensity > 0.3 && (
          <AmbientParticles
            color={atmosphere.particleColor}
            count={Math.floor(baseIntensity * 15)}
            state={state}
          />
        )}
      </AnimatePresence>

      {/* Líneas de flujo (solo en estados activos) */}
      <AnimatePresence>
        {(state === "whispering" || state === "interrupting") && (
          <FlowLines tone={tone} intensity={baseIntensity} />
        )}
      </AnimatePresence>

      {/* Contenido */}
      {children}
    </div>
  )
}

// Partículas que flotan suavemente
function AmbientParticles({
  color,
  count,
  state,
}: {
  color: string
  count: number
  state: ConsciousnessState
}) {
  const particles = useMemo(() => {
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 2 + Math.random() * 4,
      duration: 10 + Math.random() * 20,
      delay: Math.random() * 5,
    }))
  }, [count])

  return (
    <motion.div
      className="fixed inset-0 pointer-events-none z-20 overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 2 }}
    >
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            backgroundColor: color,
            filter: "blur(1px)",
          }}
          animate={{
            y: [0, -50, -100],
            x: [0, Math.random() * 30 - 15, Math.random() * 50 - 25],
            opacity: [0, 0.6, 0],
            scale: [0.5, 1, 0.3],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </motion.div>
  )
}

// Líneas de flujo que aparecen en estados de comunicación
function FlowLines({
  tone,
  intensity,
}: {
  tone: EmotionalTone
  intensity: number
}) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const lineCount = 3
  const atmosphere = toneAtmospheres[tone]

  if (!mounted) return null

  return (
    <motion.svg
      className="fixed inset-0 pointer-events-none z-25 w-full h-full"
      initial={{ opacity: 0 }}
      animate={{ opacity: intensity * 0.5 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1.5 }}
    >
      {Array.from({ length: lineCount }, (_, i) => {
        const yOffset = 20 + (i * 30)
        return (
          <motion.path
            key={i}
            d={`M0,${yOffset}% Q25%,${yOffset - 10}% 50%,${yOffset}% T100%,${yOffset}%`}
            fill="none"
            stroke={atmosphere.particleColor}
            strokeWidth="0.5"
            strokeOpacity={0.3}
            animate={{
              d: [
                `M0,${yOffset}% Q25%,${yOffset - 10}% 50%,${yOffset}% T100%,${yOffset}%`,
                `M0,${yOffset}% Q25%,${yOffset + 10}% 50%,${yOffset}% T100%,${yOffset}%`,
                `M0,${yOffset}% Q25%,${yOffset - 10}% 50%,${yOffset}% T100%,${yOffset}%`,
              ],
            }}
            transition={{
              duration: 8 + i * 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        )
      })}
    </motion.svg>
  )
}

// Efecto de aurora para momentos especiales
export function AuroraEffect({
  active,
  tone,
}: {
  active: boolean
  tone: EmotionalTone
}) {
  const atmosphere = toneAtmospheres[tone]

  return (
    <AnimatePresence>
      {active && (
        <motion.div
          className="fixed inset-0 pointer-events-none z-35 overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 3 }}
        >
          <motion.div
            className="absolute w-[200%] h-[200%] -left-1/2 -top-1/2"
            style={{
              background: `conic-gradient(from 0deg at 50% 50%,
                ${atmosphere.particleColor} 0deg,
                transparent 60deg,
                ${atmosphere.vignetteColor} 120deg,
                transparent 180deg,
                ${atmosphere.particleColor} 240deg,
                transparent 300deg,
                ${atmosphere.vignetteColor} 360deg)`,
              filter: "blur(60px)",
            }}
            animate={{
              rotate: [0, 360],
            }}
            transition={{
              duration: 60,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
