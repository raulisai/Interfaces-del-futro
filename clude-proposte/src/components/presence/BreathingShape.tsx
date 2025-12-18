"use client"

/**
 * BreathingShape - Forma Orgánica que Respira
 *
 * Inspiración:
 * - Organismos vivos (respiración, latido)
 * - Arte generativo (morfogénesis)
 * - Minimalismo japonés (ma - espacio negativo)
 *
 * No es un botón. No es un indicador.
 * Es una presencia que comparte espacio contigo.
 */

import { motion, useAnimationControls } from "framer-motion"
import { useEffect, useCallback, useMemo } from "react"
import type { ConsciousnessState, EmotionalTone } from "@/types/consciousness"

interface BreathingShapeProps {
  state: ConsciousnessState
  tone: EmotionalTone
  variant?: "circle" | "blob" | "line" | "dot-field"
  size?: "sm" | "md" | "lg"
  position?: { x: number; y: number }
}

const sizeMap = {
  sm: 40,
  md: 80,
  lg: 160,
}

const breathingRates: Record<ConsciousnessState, number> = {
  dormant: 8,
  observing: 5,
  sensing: 4,
  pondering: 3,
  whispering: 2.5,
  interrupting: 1.5,
  retreating: 6,
}

const toneGradients: Record<EmotionalTone, string[]> = {
  neutral: ["oklch(70% 0.02 240)", "oklch(50% 0.02 240)"],
  curious: ["oklch(75% 0.12 80)", "oklch(60% 0.15 60)"],
  concerned: ["oklch(70% 0.15 25)", "oklch(55% 0.18 15)"],
  encouraging: ["oklch(75% 0.12 145)", "oklch(60% 0.15 155)"],
  questioning: ["oklch(70% 0.12 290)", "oklch(55% 0.15 280)"],
  peaceful: ["oklch(80% 0.08 220)", "oklch(65% 0.1 230)"],
}

export function BreathingShape({
  state,
  tone,
  variant = "blob",
  size = "md",
  position,
}: BreathingShapeProps) {
  const controls = useAnimationControls()
  const baseSize = sizeMap[size]
  const breathRate = breathingRates[state]

  const [color1, color2] = toneGradients[tone]

  // Animación de respiración
  const breathe = useCallback(async () => {
    if (state === "dormant") return

    await controls.start({
      scale: [1, 1.08, 0.96, 1],
      rotate: [0, 2, -2, 0],
      transition: {
        duration: breathRate,
        ease: "easeInOut",
        repeat: Infinity,
      },
    })
  }, [controls, breathRate, state])

  useEffect(() => {
    breathe()
  }, [breathe])

  // Opacidad basada en estado
  const stateOpacity: Record<ConsciousnessState, number> = {
    dormant: 0,
    observing: 0.15,
    sensing: 0.25,
    pondering: 0.4,
    whispering: 0.6,
    interrupting: 0.8,
    retreating: 0.1,
  }

  const baseStyle = {
    width: baseSize,
    height: baseSize,
    opacity: stateOpacity[state],
    background: `radial-gradient(ellipse at 30% 30%, ${color1}, ${color2})`,
  }

  if (variant === "circle") {
    return (
      <motion.div
        animate={controls}
        className="rounded-full blur-sm"
        style={{
          ...baseStyle,
          ...(position && {
            position: "fixed",
            left: position.x,
            top: position.y,
          }),
        }}
      />
    )
  }

  if (variant === "blob") {
    return (
      <BlobShape
        controls={controls}
        baseStyle={baseStyle}
        state={state}
        position={position}
      />
    )
  }

  if (variant === "line") {
    return (
      <LineShape
        controls={controls}
        state={state}
        tone={tone}
        size={baseSize}
        position={position}
      />
    )
  }

  if (variant === "dot-field") {
    return (
      <DotField
        state={state}
        tone={tone}
        size={baseSize}
        position={position}
      />
    )
  }

  return null
}

// Blob con morphing orgánico
function BlobShape({
  controls,
  baseStyle,
  state,
  position,
}: {
  controls: ReturnType<typeof useAnimationControls>
  baseStyle: React.CSSProperties
  state: ConsciousnessState
  position?: { x: number; y: number }
}) {
  const blobPaths = useMemo(
    () => [
      "M50,10 C80,10 90,40 90,50 C90,80 70,90 50,90 C20,90 10,70 10,50 C10,20 30,10 50,10",
      "M50,15 C75,10 95,35 90,55 C85,80 65,95 45,90 C15,85 5,65 10,45 C15,25 35,15 50,15",
      "M55,10 C85,15 95,45 85,60 C75,85 55,95 40,85 C10,75 5,55 15,35 C25,10 45,5 55,10",
    ],
    []
  )

  return (
    <motion.svg
      viewBox="0 0 100 100"
      animate={controls}
      style={{
        width: baseStyle.width,
        height: baseStyle.height,
        opacity: baseStyle.opacity,
        filter: "blur(1px)",
        ...(position && {
          position: "fixed" as const,
          left: position.x,
          top: position.y,
        }),
      }}
    >
      <defs>
        <linearGradient id="blobGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={baseStyle.background?.toString().split(",")[0].replace("radial-gradient(ellipse at 30% 30%", "").trim()} />
          <stop offset="100%" stopColor="currentColor" />
        </linearGradient>
      </defs>
      <motion.path
        fill="url(#blobGradient)"
        animate={{
          d: blobPaths,
        }}
        transition={{
          duration: state === "dormant" ? 0 : 6,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </motion.svg>
  )
}

// Línea sinuosa
function LineShape({
  controls,
  state,
  tone,
  size,
  position,
}: {
  controls: ReturnType<typeof useAnimationControls>
  state: ConsciousnessState
  tone: EmotionalTone
  size: number
  position?: { x: number; y: number }
}) {
  const [color1] = toneGradients[tone]

  const stateOpacity: Record<ConsciousnessState, number> = {
    dormant: 0,
    observing: 0.2,
    sensing: 0.3,
    pondering: 0.5,
    whispering: 0.7,
    interrupting: 0.9,
    retreating: 0.15,
  }

  return (
    <motion.svg
      viewBox="0 0 200 50"
      animate={controls}
      style={{
        width: size * 2.5,
        height: size * 0.6,
        opacity: stateOpacity[state],
        ...(position && {
          position: "fixed" as const,
          left: position.x,
          top: position.y,
        }),
      }}
    >
      <motion.path
        d="M0,25 Q50,0 100,25 T200,25"
        fill="none"
        stroke={color1}
        strokeWidth="2"
        strokeLinecap="round"
        animate={{
          d: [
            "M0,25 Q50,0 100,25 T200,25",
            "M0,25 Q50,50 100,25 T200,25",
            "M0,25 Q50,0 100,25 T200,25",
          ],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </motion.svg>
  )
}

// Campo de puntos que reaccionan
function DotField({
  state,
  tone,
  size,
  position,
}: {
  state: ConsciousnessState
  tone: EmotionalTone
  size: number
  position?: { x: number; y: number }
}) {
  const [color1] = toneGradients[tone]
  const dotCount = 25
  const gridSize = 5

  const stateOpacity: Record<ConsciousnessState, number> = {
    dormant: 0,
    observing: 0.15,
    sensing: 0.25,
    pondering: 0.4,
    whispering: 0.6,
    interrupting: 0.8,
    retreating: 0.1,
  }

  const dots = useMemo(() => {
    return Array.from({ length: dotCount }, (_, i) => ({
      id: i,
      x: (i % gridSize) * (size / gridSize) + size / gridSize / 2,
      y: Math.floor(i / gridSize) * (size / gridSize) + size / gridSize / 2,
      delay: i * 0.05,
    }))
  }, [dotCount, gridSize, size])

  return (
    <div
      style={{
        width: size,
        height: size,
        position: position ? "fixed" : "relative",
        left: position?.x,
        top: position?.y,
        opacity: stateOpacity[state],
      }}
    >
      {dots.map((dot) => (
        <motion.div
          key={dot.id}
          className="absolute rounded-full"
          style={{
            width: 4,
            height: 4,
            left: dot.x,
            top: dot.y,
            backgroundColor: color1,
          }}
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.3, 0.8, 0.3],
          }}
          transition={{
            duration: 2,
            delay: dot.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  )
}
