"use client"

/**
 * ConsciousnessProvider - Orquestador de Presencia
 *
 * Envuelve la aplicación y proporciona:
 * - El sistema de conciencia
 * - Los componentes de presencia (companion, líneas, whispers)
 * - El overlay atmosférico
 *
 * Es el "alma" visual de la aplicación.
 */

import { createContext, useContext, ReactNode } from "react"
import { AnimatePresence } from "framer-motion"
import { useConsciousness } from "@/hooks/useConsciousness"
import { CriticalCompanion } from "./CriticalCompanion"
import { FrictionLine, FocusLine } from "./FrictionLine"
import { LivingText } from "./LivingText"
import { WhisperOverlay } from "./WhisperOverlay"
import { TimeMarker } from "./TemporalPresence"
import type { ConsciousnessState, EmotionalTone, WorldContext, WhisperMessage } from "@/types/consciousness"

interface ConsciousnessContextValue {
  consciousnessState: ConsciousnessState
  emotionalTone: EmotionalTone
  world: WorldContext
  presenceIntensity: number
  pendingWhisper: WhisperMessage | null
  acknowledge: () => void
  forceRetreat: () => void
  simulateFriction: (amount: number) => void
}

const ConsciousnessContext = createContext<ConsciousnessContextValue | null>(null)

interface ConsciousnessProviderProps {
  children: ReactNode
  enabled?: boolean
  sensitivity?: number
  debug?: boolean
  showCompanion?: boolean
  showFrictionLine?: boolean
  showFocusLine?: boolean
  showWhispers?: boolean
  showTimeMarker?: boolean
  showOverlay?: boolean
}

export function ConsciousnessProvider({
  children,
  enabled = true,
  sensitivity = 1,
  debug = false,
  showCompanion = true,
  showFrictionLine = true,
  showFocusLine = true,
  showWhispers = true,
  showTimeMarker = true,
  showOverlay = true,
}: ConsciousnessProviderProps) {
  const consciousness = useConsciousness({ enabled, sensitivity, debug })

  const {
    consciousnessState,
    emotionalTone,
    world,
    presenceIntensity,
    pendingWhisper,
    acknowledge,
  } = consciousness

  return (
    <ConsciousnessContext.Provider value={consciousness}>
      {/* Overlay atmosférico */}
      {showOverlay ? (
        <WhisperOverlay
          state={consciousnessState}
          tone={emotionalTone}
          intensity={presenceIntensity}
        >
          {children}
        </WhisperOverlay>
      ) : (
        children
      )}

      {/* Elementos de presencia */}
      <div className="consciousness-ui">
        {/* Companion - mascota crítica */}
        {showCompanion && (
          <CriticalCompanion
            state={consciousnessState}
            tone={emotionalTone}
            intensity={presenceIntensity}
          />
        )}

        {/* Línea de fricción */}
        {showFrictionLine && (
          <FrictionLine level={world.friction} position="left" />
        )}

        {/* Línea de enfoque */}
        {showFocusLine && (
          <FocusLine level={world.attention} position="right" />
        )}

        {/* Marcador de tiempo */}
        {showTimeMarker && <TimeMarker tone={emotionalTone} />}

        {/* Whispers - mensajes vivos */}
        <AnimatePresence>
          {showWhispers && pendingWhisper && (
            <LivingText
              message={pendingWhisper.text}
              tone={pendingWhisper.tone}
              onComplete={acknowledge}
              duration={8000}
            />
          )}
        </AnimatePresence>
      </div>

      {/* Debug panel */}
      {debug && <DebugPanel consciousness={consciousness} />}
    </ConsciousnessContext.Provider>
  )
}

export function useConsciousnessContext() {
  const context = useContext(ConsciousnessContext)
  if (!context) {
    throw new Error(
      "useConsciousnessContext must be used within ConsciousnessProvider"
    )
  }
  return context
}

// Panel de debug
function DebugPanel({
  consciousness,
}: {
  consciousness: ConsciousnessContextValue
}) {
  const { consciousnessState, emotionalTone, world, presenceIntensity } =
    consciousness

  return (
    <div className="fixed bottom-4 left-4 p-4 bg-black/80 text-white font-mono text-xs rounded-lg z-[100] max-w-xs">
      <div className="mb-2 text-amber-400">Debug Panel</div>
      <div className="space-y-1 opacity-80">
        <div>
          State: <span className="text-cyan-400">{consciousnessState}</span>
        </div>
        <div>
          Tone: <span className="text-pink-400">{emotionalTone}</span>
        </div>
        <div>
          Intensity:{" "}
          <span className="text-green-400">
            {(presenceIntensity * 100).toFixed(0)}%
          </span>
        </div>
        <hr className="border-white/20 my-2" />
        <div>Friction: {world.friction.toFixed(1)}</div>
        <div>Attention: {world.attention.toFixed(1)}</div>
        <div>Fatigue: {world.fatigue.toFixed(1)}</div>
        <div>Idle: {(world.idleTime / 1000).toFixed(1)}s</div>
        <div>Late night: {world.isLateNight ? "yes" : "no"}</div>
      </div>
    </div>
  )
}
