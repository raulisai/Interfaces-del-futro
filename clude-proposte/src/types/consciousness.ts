/**
 * Tipos para el sistema de conciencia de UI
 * La UI no reacciona a eventos, observa estados del mundo
 */

export type ConsciousnessState =
  | "dormant"      // Profundamente inactivo, casi invisible
  | "observing"    // Observando silenciosamente
  | "sensing"      // Detectando cambios en el contexto
  | "pondering"    // Procesando, evaluando si actuar
  | "whispering"   // Comunicando sutilmente
  | "interrupting" // Interrupción necesaria
  | "retreating"   // Retirándose conscientemente

export type EmotionalTone =
  | "neutral"
  | "curious"
  | "concerned"
  | "encouraging"
  | "questioning"
  | "peaceful"

export interface WorldContext {
  // Tiempo
  hour: number
  isNight: boolean
  isLateNight: boolean
  isDawn: boolean

  // Ritmo del usuario
  idleTime: number           // ms sin actividad
  scrollVelocity: number     // velocidad de scroll
  mouseRestlessness: number  // movimientos erráticos
  focusDuration: number      // tiempo en la misma zona

  // Estado emocional inferido
  friction: number           // 0-10: fricción detectada
  attention: number          // 0-10: nivel de atención
  fatigue: number            // 0-10: fatiga estimada

  // Intención
  hasBeenHereRecently: boolean
  isExploring: boolean
  seemsLost: boolean
  seemsRushed: boolean
}

export interface PresenceConfig {
  minOpacity: number
  maxOpacity: number
  transitionDuration: number
  breathingRate: number
  sensitivity: number
}

export interface WhisperMessage {
  id: string
  text: string
  tone: EmotionalTone
  priority: number
  conditions: Partial<WorldContext>
  shownAt?: number
  expiresAfter?: number
}
