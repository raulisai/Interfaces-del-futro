/**
 * Store de Conciencia Global
 *
 * Estado observable del sistema de conciencia.
 * Zustand para simplicidad, XState para decisiones.
 */

import { create } from "zustand"
import { subscribeWithSelector } from "zustand/middleware"
import type { WorldContext, ConsciousnessState, EmotionalTone, WhisperMessage } from "@/types/consciousness"

interface ConsciousnessStore {
  // Estado actual del motor
  engineState: ConsciousnessState
  emotionalTone: EmotionalTone

  // Contexto del mundo
  world: WorldContext

  // Mensajes en cola
  pendingWhisper: WhisperMessage | null
  whisperHistory: string[]

  // Métricas de presencia
  presenceIntensity: number
  lastActivity: number

  // Acciones
  setEngineState: (state: ConsciousnessState) => void
  setEmotionalTone: (tone: EmotionalTone) => void
  updateWorld: (partial: Partial<WorldContext>) => void
  queueWhisper: (message: WhisperMessage) => void
  clearWhisper: () => void
  recordActivity: () => void
  incrementFriction: () => void
  decrementFriction: () => void
  setPresenceIntensity: (intensity: number) => void
}

const whisperBank: WhisperMessage[] = [
  {
    id: "late-night-1",
    text: "La noche tiene su propio ritmo.",
    tone: "peaceful",
    priority: 2,
    conditions: { isLateNight: true },
  },
  {
    id: "late-night-2",
    text: "No todo necesita terminarse hoy.",
    tone: "encouraging",
    priority: 3,
    conditions: { isLateNight: true, fatigue: 5 },
  },
  {
    id: "friction-1",
    text: "A veces retroceder es avanzar.",
    tone: "encouraging",
    priority: 4,
    conditions: { friction: 6 },
  },
  {
    id: "lost-1",
    text: "Perderse también es explorar.",
    tone: "curious",
    priority: 2,
    conditions: { seemsLost: true },
  },
  {
    id: "focus-1",
    text: "Tu atención es valiosa.",
    tone: "neutral",
    priority: 1,
    conditions: { attention: 8 },
  },
  {
    id: "dawn-1",
    text: "El amanecer perdona las noches largas.",
    tone: "peaceful",
    priority: 2,
    conditions: { isDawn: true },
  },
  {
    id: "rushed-1",
    text: "La prisa es el enemigo de la claridad.",
    tone: "concerned",
    priority: 3,
    conditions: { seemsRushed: true },
  },
  {
    id: "idle-1",
    text: "El silencio también comunica.",
    tone: "peaceful",
    priority: 1,
    conditions: { idleTime: 20000 },
  },
]

export const useConsciousnessStore = create<ConsciousnessStore>()(
  subscribeWithSelector((set, get) => ({
    engineState: "dormant",
    emotionalTone: "neutral",

    world: {
      hour: new Date().getHours(),
      isNight: false,
      isLateNight: false,
      isDawn: false,
      idleTime: 0,
      scrollVelocity: 0,
      mouseRestlessness: 0,
      focusDuration: 0,
      friction: 0,
      attention: 5,
      fatigue: 0,
      hasBeenHereRecently: false,
      isExploring: false,
      seemsLost: false,
      seemsRushed: false,
    },

    pendingWhisper: null,
    whisperHistory: [],
    presenceIntensity: 0.3,
    lastActivity: Date.now(),

    setEngineState: (state) => set({ engineState: state }),
    setEmotionalTone: (tone) => set({ emotionalTone: tone }),

    updateWorld: (partial) =>
      set((s) => {
        const hour = new Date().getHours()
        return {
          world: {
            ...s.world,
            ...partial,
            hour,
            isNight: hour >= 20 || hour < 6,
            isLateNight: hour >= 23 || hour < 4,
            isDawn: hour >= 5 && hour < 7,
          },
        }
      }),

    queueWhisper: (message) =>
      set((s) => ({
        pendingWhisper: message,
        whisperHistory: [...s.whisperHistory.slice(-20), message.id],
      })),

    clearWhisper: () => set({ pendingWhisper: null }),

    recordActivity: () =>
      set((s) => ({
        lastActivity: Date.now(),
        world: { ...s.world, idleTime: 0 },
      })),

    incrementFriction: () =>
      set((s) => ({
        world: {
          ...s.world,
          friction: Math.min(10, s.world.friction + 0.5),
        },
      })),

    decrementFriction: () =>
      set((s) => ({
        world: {
          ...s.world,
          friction: Math.max(0, s.world.friction - 0.1),
        },
      })),

    setPresenceIntensity: (intensity) =>
      set({ presenceIntensity: Math.max(0, Math.min(1, intensity)) }),
  }))
)

// Selector para obtener el whisper apropiado
export function selectAppropriateWhisper(world: WorldContext, history: string[]): WhisperMessage | null {
  const candidates = whisperBank.filter((w) => {
    if (history.includes(w.id)) return false

    for (const [key, value] of Object.entries(w.conditions)) {
      const worldValue = world[key as keyof WorldContext]
      if (typeof value === "boolean" && worldValue !== value) return false
      if (typeof value === "number" && (worldValue as number) < value) return false
    }
    return true
  })

  if (candidates.length === 0) return null

  candidates.sort((a, b) => b.priority - a.priority)
  return candidates[0]
}
