"use client"

/**
 * useConsciousness - Hook Principal de Orquestación
 *
 * Integra:
 * - Motor crítico (XState)
 * - Store de conciencia (Zustand)
 * - Sensor de contexto
 *
 * Retorna el estado completo del sistema para que los componentes
 * puedan manifestarse apropiadamente.
 */

import { useEffect, useCallback, useRef } from "react"
import { useMachine } from "@xstate/react"
import { criticalEngine } from "@/engine/criticalEngine"
import {
  useConsciousnessStore,
  selectAppropriateWhisper,
} from "@/stores/consciousnessStore"
import { useContextAwareness } from "./useContextAwareness"
import type { ConsciousnessState, EmotionalTone } from "@/types/consciousness"

interface UseConsciousnessOptions {
  enabled?: boolean
  sensitivity?: number
  debug?: boolean
}

export function useConsciousness({
  enabled = true,
  sensitivity = 1,
  debug = false,
}: UseConsciousnessOptions = {}) {
  const [state, send] = useMachine(criticalEngine)

  const {
    world,
    pendingWhisper,
    whisperHistory,
    presenceIntensity,
    setEngineState,
    setEmotionalTone,
    updateWorld,
    queueWhisper,
    clearWhisper,
    setPresenceIntensity,
  } = useConsciousnessStore()

  // Sensor de contexto
  useContextAwareness({ enabled, sensitivityMultiplier: sensitivity })

  // Referencia para el intervalo de tick
  const tickInterval = useRef<NodeJS.Timeout | null>(null)

  // Sincronizar estado del motor con el store
  useEffect(() => {
    const engineState = state.value as ConsciousnessState
    setEngineState(engineState)

    // Obtener tono emocional del contexto del motor
    const tone = state.context.currentTone as EmotionalTone
    setEmotionalTone(tone)

    // Calcular intensidad de presencia
    const intensityMap: Record<ConsciousnessState, number> = {
      dormant: 0,
      observing: 0.2,
      sensing: 0.35,
      pondering: 0.5,
      whispering: 0.75,
      interrupting: 1,
      retreating: 0.15,
    }
    setPresenceIntensity(intensityMap[engineState] || 0)

    if (debug) {
      console.log("[Consciousness]", {
        state: engineState,
        tone,
        friction: world.friction,
        attention: world.attention,
      })
    }
  }, [state, setEngineState, setEmotionalTone, setPresenceIntensity, world, debug])

  // Enviar actualizaciones del mundo al motor
  useEffect(() => {
    send({ type: "WORLD_UPDATE", payload: world })
  }, [world, send])

  // Tick periódico para el motor
  useEffect(() => {
    if (!enabled) return

    tickInterval.current = setInterval(() => {
      send({ type: "TIME_TICK" })

      // Intentar seleccionar un whisper apropiado
      const currentState = state.value as ConsciousnessState
      if (
        currentState === "whispering" &&
        !pendingWhisper
      ) {
        const whisper = selectAppropriateWhisper(world, whisperHistory)
        if (whisper) {
          queueWhisper(whisper)
        }
      }
    }, 2000)

    return () => {
      if (tickInterval.current) {
        clearInterval(tickInterval.current)
      }
    }
  }, [enabled, send, state.value, world, pendingWhisper, whisperHistory, queueWhisper])

  // Aplicar data-time al documento
  useEffect(() => {
    const hour = new Date().getHours()
    let timeOfDay = "day"

    if (hour >= 23 || hour < 4) {
      timeOfDay = "late-night"
    } else if (hour >= 5 && hour < 7) {
      timeOfDay = "dawn"
    } else if (hour >= 20 || hour < 6) {
      timeOfDay = "night"
    }

    document.documentElement.setAttribute("data-time", timeOfDay)

    // Actualizar cada minuto
    const interval = setInterval(() => {
      const newHour = new Date().getHours()
      let newTimeOfDay = "day"

      if (newHour >= 23 || newHour < 4) {
        newTimeOfDay = "late-night"
      } else if (newHour >= 5 && newHour < 7) {
        newTimeOfDay = "dawn"
      } else if (newHour >= 20 || newHour < 6) {
        newTimeOfDay = "night"
      }

      document.documentElement.setAttribute("data-time", newTimeOfDay)
    }, 60000)

    return () => clearInterval(interval)
  }, [])

  // Acciones manuales
  const acknowledge = useCallback(() => {
    send({ type: "USER_ACKNOWLEDGED" })
    clearWhisper()
  }, [send, clearWhisper])

  const forceRetreat = useCallback(() => {
    send({ type: "FORCE_RETREAT" })
    clearWhisper()
  }, [send, clearWhisper])

  const simulateFriction = useCallback(
    (amount: number) => {
      updateWorld({ friction: Math.min(10, world.friction + amount) })
    },
    [updateWorld, world.friction]
  )

  return {
    // Estado
    consciousnessState: state.value as ConsciousnessState,
    emotionalTone: state.context.currentTone as EmotionalTone,
    world,
    presenceIntensity,

    // Whisper actual
    pendingWhisper,

    // Acciones
    acknowledge,
    forceRetreat,
    simulateFriction,

    // Debug
    engineContext: debug ? state.context : null,
  }
}
