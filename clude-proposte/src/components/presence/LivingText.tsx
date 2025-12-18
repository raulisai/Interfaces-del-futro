"use client"

/**
 * LivingText - Texto Vivo (Periódico Consciente)
 *
 * Texto que:
 * - Aparece cuando tiene algo que decir
 * - Desaparece sin pedir permiso
 * - Nunca grita
 *
 * Ejemplos de mensajes:
 * "No todo necesita terminarse hoy."
 * "Esto ya lo pensaste antes."
 * "¿Es tuyo este objetivo?"
 */

import { motion, AnimatePresence, Variants } from "framer-motion"
import { useState, useEffect } from "react"
import type { EmotionalTone } from "@/types/consciousness"

interface LivingTextProps {
  message: string | null
  tone?: EmotionalTone
  onComplete?: () => void
  duration?: number
}

const containerVariants: Variants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.03,
      delayChildren: 0.2,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      duration: 1.5,
      ease: "easeOut",
    },
  },
}

const wordVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
    filter: "blur(8px)",
  },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1],
    },
  },
}

const toneStyles: Record<EmotionalTone, string> = {
  neutral: "text-neutral-400",
  curious: "text-amber-300/80",
  concerned: "text-rose-300/80",
  encouraging: "text-emerald-300/80",
  questioning: "text-violet-300/80",
  peaceful: "text-sky-300/80",
}

export function LivingText({
  message,
  tone = "neutral",
  onComplete,
  duration = 8000,
}: LivingTextProps) {
  const [isVisible, setIsVisible] = useState(false)
  const words = message?.split(" ") || []

  useEffect(() => {
    if (message) {
      setIsVisible(true)
      const timer = setTimeout(() => {
        setIsVisible(false)
        onComplete?.()
      }, duration)
      return () => clearTimeout(timer)
    }
  }, [message, duration, onComplete])

  return (
    <AnimatePresence mode="wait">
      {isVisible && message && (
        <motion.div
          className="fixed bottom-8 left-8 z-50 max-w-xs pointer-events-none"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <p
            className={`
              font-serif text-lg
              tracking-tight leading-relaxed
              ${toneStyles[tone]}
            `}
            style={{
              fontFeatureSettings: '"liga" 1, "kern" 1, "calt" 1',
              textShadow: "0 2px 20px rgba(0,0,0,0.3)",
            }}
          >
            {words.map((word, i) => (
              <motion.span
                key={`${word}-${i}`}
                variants={wordVariants}
                className="inline-block mr-[0.3em]"
              >
                {word}
              </motion.span>
            ))}
          </p>

          {/* Línea de tiempo visual */}
          <motion.div
            className="mt-4 h-px bg-current origin-left"
            style={{ opacity: 0.3 }}
            initial={{ scaleX: 1 }}
            animate={{ scaleX: 0 }}
            transition={{
              duration: duration / 1000,
              ease: "linear",
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// Variante: Texto que aparece letra por letra
export function TypewriterText({
  message,
  tone = "neutral",
  speed = 50,
  onComplete,
}: {
  message: string
  tone?: EmotionalTone
  speed?: number
  onComplete?: () => void
}) {
  const [displayedText, setDisplayedText] = useState("")
  const [isComplete, setIsComplete] = useState(false)

  useEffect(() => {
    if (!message) return

    let index = 0
    setDisplayedText("")
    setIsComplete(false)

    const interval = setInterval(() => {
      if (index < message.length) {
        setDisplayedText(message.slice(0, index + 1))
        index++
      } else {
        setIsComplete(true)
        clearInterval(interval)
        setTimeout(() => onComplete?.(), 3000)
      }
    }, speed)

    return () => clearInterval(interval)
  }, [message, speed, onComplete])

  return (
    <motion.p
      className={`
        font-mono text-sm
        tracking-wide
        ${toneStyles[tone]}
      `}
      initial={{ opacity: 0 }}
      animate={{ opacity: 0.8 }}
      exit={{ opacity: 0 }}
    >
      {displayedText}
      {!isComplete && (
        <motion.span
          animate={{ opacity: [1, 0] }}
          transition={{ duration: 0.5, repeat: Infinity }}
        >
          |
        </motion.span>
      )}
    </motion.p>
  )
}

// Variante: Texto que se desvanece progresivamente
export function FadingText({
  message,
  tone = "neutral",
}: {
  message: string
  tone?: EmotionalTone
}) {
  return (
    <motion.p
      className={`
        font-serif text-xl
        ${toneStyles[tone]}
      `}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{
        opacity: [0, 0.8, 0.8, 0],
        scale: [0.95, 1, 1, 1.02],
      }}
      transition={{
        duration: 6,
        times: [0, 0.1, 0.8, 1],
        ease: "easeInOut",
      }}
    >
      {message}
    </motion.p>
  )
}
