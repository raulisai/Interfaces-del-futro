"use client"

/**
 * TemporalPresence - Presencia Temporal
 *
 * Nada es permanente.
 * Los elementos aparecen, existen, y se van.
 * Como la respiración. Como las olas.
 *
 * Este componente orquesta la aparición y desaparición
 * de elementos basándose en el tiempo y el contexto.
 */

import { motion, AnimatePresence } from "framer-motion"
import { useState, useEffect, useCallback, ReactNode } from "react"
import type { ConsciousnessState, EmotionalTone } from "@/types/consciousness"

interface TemporalPresenceProps {
  children: ReactNode
  state: ConsciousnessState
  minDuration?: number
  maxDuration?: number
  fadeIn?: number
  fadeOut?: number
  onAppear?: () => void
  onDisappear?: () => void
}

// Estados que permiten manifestación
const manifestingStates: ConsciousnessState[] = [
  "sensing",
  "pondering",
  "whispering",
  "interrupting",
]

export function TemporalPresence({
  children,
  state,
  minDuration = 3000,
  maxDuration = 8000,
  fadeIn = 1.5,
  fadeOut = 2,
  onAppear,
  onDisappear,
}: TemporalPresenceProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (manifestingStates.includes(state)) {
      setIsVisible(true)
      onAppear?.()

      const duration =
        minDuration + Math.random() * (maxDuration - minDuration)
      const timer = setTimeout(() => {
        setIsVisible(false)
        onDisappear?.()
      }, duration)

      return () => clearTimeout(timer)
    } else {
      setIsVisible(false)
    }
  }, [state, minDuration, maxDuration, onAppear, onDisappear])

  return (
    <AnimatePresence mode="wait">
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, filter: "blur(10px)" }}
          animate={{
            opacity: 1,
            filter: "blur(0px)",
          }}
          exit={{
            opacity: 0,
            filter: "blur(10px)",
          }}
          transition={{
            opacity: { duration: fadeIn, ease: "easeOut" },
            filter: { duration: fadeIn * 0.8, ease: "easeOut" },
          }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// Presencia que pulsa - existe pero con intensidad variable
export function PulsingPresence({
  children,
  state,
  baseOpacity = 0.3,
  peakOpacity = 0.9,
  pulseRate = 4,
}: {
  children: ReactNode
  state: ConsciousnessState
  baseOpacity?: number
  peakOpacity?: number
  pulseRate?: number
}) {
  const shouldPulse = manifestingStates.includes(state)

  return (
    <motion.div
      animate={
        shouldPulse
          ? {
              opacity: [baseOpacity, peakOpacity, baseOpacity],
            }
          : {
              opacity: 0,
            }
      }
      transition={{
        duration: pulseRate,
        repeat: shouldPulse ? Infinity : 0,
        ease: "easeInOut",
      }}
    >
      {children}
    </motion.div>
  )
}

// Presencia que aparece en posiciones aleatorias
export function WanderingPresence({
  children,
  state,
  bounds = { x: [10, 90], y: [10, 90] },
  wanderInterval = 5000,
}: {
  children: ReactNode
  state: ConsciousnessState
  bounds?: { x: [number, number]; y: [number, number] }
  wanderInterval?: number
}) {
  const [position, setPosition] = useState({ x: 50, y: 50 })
  const [isVisible, setIsVisible] = useState(false)

  const wander = useCallback(() => {
    setPosition({
      x: bounds.x[0] + Math.random() * (bounds.x[1] - bounds.x[0]),
      y: bounds.y[0] + Math.random() * (bounds.y[1] - bounds.y[0]),
    })
  }, [bounds])

  useEffect(() => {
    if (manifestingStates.includes(state)) {
      setIsVisible(true)
      wander()

      const interval = setInterval(wander, wanderInterval)
      return () => clearInterval(interval)
    } else {
      setIsVisible(false)
    }
  }, [state, wanderInterval, wander])

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed pointer-events-none"
          style={{
            left: `${position.x}%`,
            top: `${position.y}%`,
            transform: "translate(-50%, -50%)",
          }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{
            opacity: 1,
            scale: 1,
            x: 0,
            y: 0,
          }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{
            duration: 2,
            ease: "easeInOut",
          }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// Marcador de tiempo - muestra la hora de forma artística
export function TimeMarker({ tone }: { tone: EmotionalTone }) {
  const [time, setTime] = useState<{ hours: number; minutes: number } | null>(
    null
  )

  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      setTime({
        hours: now.getHours(),
        minutes: now.getMinutes(),
      })
    }

    updateTime()
    const interval = setInterval(updateTime, 60000)
    return () => clearInterval(interval)
  }, [])

  if (!time) return null

  const isLateNight = time.hours >= 23 || time.hours < 4

  return (
    <motion.div
      className="fixed top-4 right-4 font-mono text-xs tracking-widest pointer-events-none z-40"
      style={{
        color: `var(--presence-${tone})`,
        opacity: 0.4,
      }}
      animate={{
        opacity: isLateNight ? [0.4, 0.6, 0.4] : 0.4,
      }}
      transition={{
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      {String(time.hours).padStart(2, "0")}
      <motion.span
        animate={{ opacity: [1, 0.3, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        :
      </motion.span>
      {String(time.minutes).padStart(2, "0")}
    </motion.div>
  )
}

// Grid de presencia - para visualizaciones más complejas
export function PresenceGrid({
  state,
  tone,
  rows = 3,
  cols = 3,
}: {
  state: ConsciousnessState
  tone: EmotionalTone
  rows?: number
  cols?: number
}) {
  const cells = rows * cols
  const activeCount = Math.floor(
    (manifestingStates.indexOf(state) + 1) * (cells / 4)
  )

  const [activeCells, setActiveCells] = useState<number[]>([])

  useEffect(() => {
    if (manifestingStates.includes(state)) {
      const indices = Array.from({ length: cells }, (_, i) => i)
        .sort(() => Math.random() - 0.5)
        .slice(0, activeCount)
      setActiveCells(indices)
    } else {
      setActiveCells([])
    }
  }, [state, cells, activeCount])

  return (
    <div
      className="grid gap-2 pointer-events-none"
      style={{
        gridTemplateColumns: `repeat(${cols}, 1fr)`,
        gridTemplateRows: `repeat(${rows}, 1fr)`,
      }}
    >
      {Array.from({ length: cells }, (_, i) => (
        <motion.div
          key={i}
          className="w-3 h-3 rounded-full"
          style={{
            backgroundColor: `var(--presence-${tone})`,
          }}
          animate={{
            opacity: activeCells.includes(i) ? [0.2, 0.8, 0.2] : 0.05,
            scale: activeCells.includes(i) ? [0.8, 1, 0.8] : 0.6,
          }}
          transition={{
            duration: 2 + Math.random() * 2,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.1,
          }}
        />
      ))}
    </div>
  )
}
