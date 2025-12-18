"use client"

/**
 * CriticalCompanion - La Mascota Crítica
 *
 * Una presencia lateral que:
 * - No tiene texto
 * - No pide acción
 * - Solo existe
 *
 * Inspiración: el gato que te observa desde la esquina,
 * la luna que aparece entre las nubes.
 */

import { motion, useAnimationControls } from "framer-motion"
import { useEffect, useCallback } from "react"
import type { ConsciousnessState, EmotionalTone } from "@/types/consciousness"

interface CriticalCompanionProps {
  state: ConsciousnessState
  tone: EmotionalTone
  intensity?: number
}

const stateVariants = {
  dormant: {
    scale: 0.3,
    opacity: 0,
    filter: "blur(8px)",
  },
  observing: {
    scale: 0.6,
    opacity: 0.15,
    filter: "blur(2px)",
  },
  sensing: {
    scale: 0.8,
    opacity: 0.25,
    filter: "blur(1px)",
  },
  pondering: {
    scale: 1,
    opacity: 0.4,
    filter: "blur(0px)",
  },
  whispering: {
    scale: 1.2,
    opacity: 0.7,
    filter: "blur(0px)",
  },
  interrupting: {
    scale: 1.5,
    opacity: 0.95,
    filter: "blur(0px)",
  },
  retreating: {
    scale: 0.5,
    opacity: 0.1,
    filter: "blur(4px)",
  },
}

const toneColors: Record<EmotionalTone, string> = {
  neutral: "var(--presence-neutral)",
  curious: "var(--presence-curious)",
  concerned: "var(--presence-concerned)",
  encouraging: "var(--presence-encouraging)",
  questioning: "var(--presence-questioning)",
  peaceful: "var(--presence-peaceful)",
}

export function CriticalCompanion({
  state,
  tone,
  intensity = 1,
}: CriticalCompanionProps) {
  const controls = useAnimationControls()

  // Respiración orgánica continua
  const breathe = useCallback(async () => {
    if (state === "dormant") return

    await controls.start({
      scale: [null, 1.02, 0.98, 1],
      transition: {
        duration: 4 + Math.random() * 2,
        ease: "easeInOut",
        repeat: Infinity,
        repeatType: "loop",
      },
    })
  }, [controls, state])

  useEffect(() => {
    breathe()
  }, [breathe])

  // Posición que varía sutilmente
  const baseY = typeof window !== "undefined" ? window.innerHeight * 0.4 : 300

  return (
    <motion.div
      className="fixed z-50 pointer-events-none"
      style={{
        right: 12,
        top: baseY,
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Aura externa - respira más lento */}
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{
          width: 48,
          height: 48,
          marginLeft: -16,
          marginTop: -16,
          background: `radial-gradient(circle, ${toneColors[tone]} 0%, transparent 70%)`,
        }}
        animate={{
          scale: [1, 1.4, 1.2, 1],
          opacity: [0.2, 0.1, 0.15, 0.2].map((v) => v * intensity),
        }}
        transition={{
          duration: 6,
          ease: "easeInOut",
          repeat: Infinity,
        }}
      />

      {/* Núcleo principal */}
      <motion.div
        variants={stateVariants}
        animate={state}
        transition={{
          type: "spring",
          damping: 25,
          stiffness: 120,
          mass: 0.8,
        }}
        style={{
          width: 16,
          height: 16,
          backgroundColor: toneColors[tone],
          boxShadow: `0 0 20px ${toneColors[tone]}`,
        }}
        className="rounded-full mix-blend-screen backdrop-blur-sm"
      />

      {/* Partícula satelital - solo en estados activos */}
      {(state === "whispering" || state === "interrupting") && (
        <motion.div
          className="absolute rounded-full"
          style={{
            width: 4,
            height: 4,
            backgroundColor: toneColors[tone],
            opacity: 0.6,
          }}
          animate={{
            x: [0, 20, 0, -20, 0],
            y: [-20, 0, 20, 0, -20],
          }}
          transition={{
            duration: 8,
            ease: "linear",
            repeat: Infinity,
          }}
        />
      )}

      {/* Pulso de interrupción */}
      {state === "interrupting" && (
        <motion.div
          className="absolute inset-0 rounded-full border"
          style={{
            width: 16,
            height: 16,
            borderColor: toneColors[tone],
          }}
          animate={{
            scale: [1, 3],
            opacity: [0.8, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeOut",
          }}
        />
      )}
    </motion.div>
  )
}
