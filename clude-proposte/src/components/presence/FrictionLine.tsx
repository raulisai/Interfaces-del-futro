"use client"

/**
 * FrictionLine - Línea que Siente Fricción
 *
 * Inspiración:
 * - Diseño editorial (líneas de guía)
 * - Arte cinético (movimiento continuo)
 * - Señalización urbana (indicadores sutiles)
 *
 * La línea crece con la fricción del usuario.
 * No interrumpe, solo refleja el estado interno.
 */

import { motion, useSpring, useTransform } from "framer-motion"
import { useEffect, useState } from "react"

interface FrictionLineProps {
  level: number // 0-10
  position?: "left" | "right" | "top" | "bottom"
  color?: string
}

export function FrictionLine({
  level,
  position = "left",
  color = "var(--friction-line)",
}: FrictionLineProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Spring para transiciones suaves
  const springLevel = useSpring(level, {
    damping: 30,
    stiffness: 90,
    mass: 1,
  })

  // Transformaciones basadas en el nivel
  const height = useTransform(springLevel, [0, 10], ["0vh", "100vh"])
  const width = useTransform(springLevel, [0, 10], ["0vw", "100vw"])
  const opacity = useTransform(springLevel, [0, 3, 7, 10], [0, 0.3, 0.6, 0.9])
  const thickness = useTransform(springLevel, [0, 5, 10], [1, 2, 4])

  // Glow intensity basado en nivel
  const glowIntensity = useTransform(springLevel, [0, 10], [0, 20])

  const isVertical = position === "left" || position === "right"

  const positionStyles = {
    left: { left: 0, top: 0 },
    right: { right: 0, top: 0 },
    top: { left: 0, top: 0 },
    bottom: { left: 0, bottom: 0 },
  }

  if (!mounted) return null

  return (
    <motion.div
      className="fixed pointer-events-none z-40"
      style={{
        ...positionStyles[position],
        originX: position === "right" ? 1 : 0,
        originY: position === "bottom" ? 1 : 0,
      }}
    >
      {/* Línea principal */}
      <motion.div
        style={{
          width: isVertical ? thickness : width,
          height: isVertical ? height : thickness,
          backgroundColor: color,
          opacity,
          boxShadow: useTransform(
            glowIntensity,
            (v) => `0 0 ${v}px ${color}`
          ),
        }}
        className="origin-top"
      />

      {/* Partículas de fricción - aparecen con alta fricción */}
      {level > 6 && (
        <FrictionParticles
          count={Math.floor(level - 5)}
          position={position}
          color={color}
        />
      )}

      {/* Pulso en fricción crítica */}
      {level > 8 && (
        <motion.div
          className="absolute"
          style={{
            ...positionStyles[position],
            width: isVertical ? 8 : "100%",
            height: isVertical ? "100%" : 8,
            background: `linear-gradient(${
              isVertical ? "to bottom" : "to right"
            }, transparent, ${color}, transparent)`,
          }}
          animate={{
            opacity: [0, 0.5, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      )}
    </motion.div>
  )
}

// Partículas que emergen de la línea
function FrictionParticles({
  count,
  position,
  color,
}: {
  count: number
  position: "left" | "right" | "top" | "bottom"
  color: string
}) {
  const particles = Array.from({ length: count }, (_, i) => ({
    id: i,
    delay: i * 0.3,
    y: Math.random() * 100,
    size: 2 + Math.random() * 3,
  }))

  const isVertical = position === "left" || position === "right"
  const direction = position === "left" || position === "top" ? 1 : -1

  return (
    <>
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full"
          style={{
            width: p.size,
            height: p.size,
            backgroundColor: color,
            ...(isVertical
              ? { top: `${p.y}%`, [position]: 0 }
              : { left: `${p.y}%`, [position]: 0 }),
          }}
          animate={{
            [isVertical ? "x" : "y"]: [0, direction * 30, direction * 50],
            opacity: [0, 0.8, 0],
            scale: [0.5, 1, 0.3],
          }}
          transition={{
            duration: 2,
            delay: p.delay,
            repeat: Infinity,
            ease: "easeOut",
          }}
        />
      ))}
    </>
  )
}

// Variante: Línea de enfoque (opuesta a fricción)
export function FocusLine({
  level,
  position = "right",
}: {
  level: number
  position?: "left" | "right"
}) {
  return (
    <FrictionLine
      level={level}
      position={position}
      color="var(--focus-line)"
    />
  )
}
