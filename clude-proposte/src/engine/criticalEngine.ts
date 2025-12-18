/**
 * Motor Crítico de Conciencia
 *
 * Este motor NO reacciona a eventos.
 * OBSERVA, EVALÚA y DECIDE si la UI debe manifestarse.
 *
 * Filosofía: La mejor interfaz es la que no necesita aparecer.
 */

import { createMachine, assign } from "xstate"
import type { WorldContext, ConsciousnessState, EmotionalTone } from "@/types/consciousness"

interface CriticalContext {
  world: WorldContext
  lastManifestationTime: number
  manifestationCount: number
  currentTone: EmotionalTone
  silenceStreak: number
  wisdomLevel: number
}

type CriticalEvent =
  | { type: "WORLD_UPDATE"; payload: Partial<WorldContext> }
  | { type: "TIME_TICK" }
  | { type: "MANIFESTATION_COMPLETE" }
  | { type: "USER_ACKNOWLEDGED" }
  | { type: "FORCE_RETREAT" }

const initialContext: CriticalContext = {
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
  lastManifestationTime: 0,
  manifestationCount: 0,
  currentTone: "neutral",
  silenceStreak: 0,
  wisdomLevel: 1,
}

export const criticalEngine = createMachine(
  {
    id: "ui-consciousness",
    initial: "dormant",
    context: initialContext,
    states: {
      // Estado más profundo de inactividad
      dormant: {
        after: {
          5000: "observing",
        },
        on: {
          WORLD_UPDATE: {
            actions: "updateWorld",
          },
        },
      },

      // Observación silenciosa - el estado principal
      observing: {
        on: {
          WORLD_UPDATE: {
            actions: "updateWorld",
          },
          TIME_TICK: [
            {
              target: "interrupting",
              guard: "criticalFrictionDetected",
              actions: "setUrgentTone",
            },
            {
              target: "whispering",
              guard: "lateNightFatigue",
              actions: "setConcernedTone",
            },
            {
              target: "whispering",
              guard: "userSeemsLost",
              actions: "setEncouragingTone",
            },
            {
              target: "pondering",
              guard: "somethingInteresting",
              actions: "setCuriousTone",
            },
            {
              target: "sensing",
              guard: "contextShift",
            },
          ],
        },
      },

      // Detectando cambios sutiles
      sensing: {
        after: {
          2000: [
            {
              target: "whispering",
              guard: "worthMentioning",
            },
            {
              target: "observing",
            },
          ],
        },
        on: {
          WORLD_UPDATE: {
            actions: "updateWorld",
          },
        },
      },

      // Evaluando si vale la pena manifestarse
      pondering: {
        after: {
          3000: [
            {
              target: "whispering",
              guard: "decisionToSpeak",
            },
            {
              target: "observing",
              actions: "incrementSilence",
            },
          ],
        },
        on: {
          WORLD_UPDATE: {
            actions: "updateWorld",
          },
          FORCE_RETREAT: "retreating",
        },
      },

      // Manifestación sutil
      whispering: {
        entry: "recordManifestation",
        after: {
          8000: "retreating",
        },
        on: {
          USER_ACKNOWLEDGED: {
            target: "retreating",
            actions: "incrementWisdom",
          },
          MANIFESTATION_COMPLETE: "retreating",
          FORCE_RETREAT: "retreating",
        },
      },

      // Interrupción necesaria (rara)
      interrupting: {
        entry: "recordManifestation",
        on: {
          USER_ACKNOWLEDGED: {
            target: "observing",
            actions: "incrementWisdom",
          },
          FORCE_RETREAT: "retreating",
        },
        after: {
          15000: "retreating",
        },
      },

      // Retirándose graciosamente
      retreating: {
        after: {
          2000: "observing",
        },
        entry: "resetTone",
      },
    },
  },
  {
    actions: {
      updateWorld: assign({
        world: ({ context, event }) => {
          if (event.type !== "WORLD_UPDATE") return context.world
          const hour = new Date().getHours()
          return {
            ...context.world,
            ...event.payload,
            hour,
            isNight: hour >= 20 || hour < 6,
            isLateNight: hour >= 23 || hour < 4,
            isDawn: hour >= 5 && hour < 7,
          }
        },
      }),

      recordManifestation: assign({
        lastManifestationTime: () => Date.now(),
        manifestationCount: ({ context }) => context.manifestationCount + 1,
        silenceStreak: () => 0,
      }),

      incrementSilence: assign({
        silenceStreak: ({ context }) => context.silenceStreak + 1,
      }),

      incrementWisdom: assign({
        wisdomLevel: ({ context }) => Math.min(10, context.wisdomLevel + 0.1),
      }),

      setUrgentTone: assign({ currentTone: () => "concerned" as EmotionalTone }),
      setConcernedTone: assign({ currentTone: () => "concerned" as EmotionalTone }),
      setEncouragingTone: assign({ currentTone: () => "encouraging" as EmotionalTone }),
      setCuriousTone: assign({ currentTone: () => "curious" as EmotionalTone }),
      resetTone: assign({ currentTone: () => "neutral" as EmotionalTone }),
    },

    guards: {
      // Fricción crítica: el usuario lucha con algo
      criticalFrictionDetected: ({ context }) => {
        return (
          context.world.friction > 8 &&
          context.world.mouseRestlessness > 7 &&
          Date.now() - context.lastManifestationTime > 60000
        )
      },

      // Es tarde y el usuario parece cansado
      lateNightFatigue: ({ context }) => {
        return (
          context.world.isLateNight &&
          context.world.fatigue > 6 &&
          context.world.focusDuration > 30000 &&
          Date.now() - context.lastManifestationTime > 300000
        )
      },

      // El usuario parece perdido
      userSeemsLost: ({ context }) => {
        return (
          context.world.seemsLost &&
          context.world.idleTime > 10000 &&
          !context.world.isExploring &&
          Date.now() - context.lastManifestationTime > 120000
        )
      },

      // Algo interesante está pasando
      somethingInteresting: ({ context }) => {
        return (
          context.world.scrollVelocity < 2 &&
          context.world.focusDuration > 15000 &&
          context.world.attention > 7
        )
      },

      // Cambio de contexto detectado
      contextShift: ({ context }) => {
        return (
          context.world.scrollVelocity > 5 ||
          context.world.mouseRestlessness > 5
        )
      },

      // Vale la pena mencionarlo
      worthMentioning: ({ context }) => {
        return (
          context.silenceStreak < 3 &&
          context.wisdomLevel > 2 &&
          Math.random() > 0.7
        )
      },

      // Decisión de hablar
      decisionToSpeak: ({ context }) => {
        const timeSinceLastManifestation = Date.now() - context.lastManifestationTime
        const shouldSpeak =
          timeSinceLastManifestation > 180000 &&
          context.world.friction > 3 &&
          context.manifestationCount < 10

        return shouldSpeak && Math.random() > 0.5
      },
    },
  }
)

export type CriticalEngineState = ConsciousnessState
export type CriticalEngineContext = CriticalContext
