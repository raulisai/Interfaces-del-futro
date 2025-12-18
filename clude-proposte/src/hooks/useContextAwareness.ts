"use client"

/**
 * useContextAwareness - Sensor de Contexto
 *
 * Observa el mundo:
 * - Hora del día
 * - Ritmo del usuario (scroll, mouse, idle)
 * - Patrones de comportamiento
 *
 * NO reacciona. Solo OBSERVA y ACTUALIZA el estado del mundo.
 */

import { useEffect, useRef, useCallback } from "react"
import { useConsciousnessStore } from "@/stores/consciousnessStore"

interface UseContextAwarenessOptions {
  enabled?: boolean
  sensitivityMultiplier?: number
}

export function useContextAwareness({
  enabled = true,
  sensitivityMultiplier = 1,
}: UseContextAwarenessOptions = {}) {
  const updateWorld = useConsciousnessStore((s) => s.updateWorld)
  const recordActivity = useConsciousnessStore((s) => s.recordActivity)
  const incrementFriction = useConsciousnessStore((s) => s.incrementFriction)
  const decrementFriction = useConsciousnessStore((s) => s.decrementFriction)

  // Referencias para cálculos
  const lastScrollY = useRef(0)
  const lastScrollTime = useRef(Date.now())
  const scrollVelocities = useRef<number[]>([])

  const lastMousePos = useRef({ x: 0, y: 0 })
  const mouseMovements = useRef<number[]>([])
  const lastMouseTime = useRef(Date.now())

  const focusStartTime = useRef(Date.now())
  const lastActivityTime = useRef(Date.now())
  const idleCheckInterval = useRef<NodeJS.Timeout | null>(null)

  // Detector de scroll
  const handleScroll = useCallback(() => {
    const now = Date.now()
    const deltaY = Math.abs(window.scrollY - lastScrollY.current)
    const deltaTime = now - lastScrollTime.current

    if (deltaTime > 0) {
      const velocity = (deltaY / deltaTime) * 100
      scrollVelocities.current.push(velocity)

      // Mantener solo las últimas 10 mediciones
      if (scrollVelocities.current.length > 10) {
        scrollVelocities.current.shift()
      }

      const avgVelocity =
        scrollVelocities.current.reduce((a, b) => a + b, 0) /
        scrollVelocities.current.length

      updateWorld({
        scrollVelocity: avgVelocity * sensitivityMultiplier,
        isExploring: avgVelocity > 3,
        seemsRushed: avgVelocity > 8,
      })

      // Alta velocidad de scroll = posible frustración
      if (avgVelocity > 6) {
        incrementFriction()
      }
    }

    lastScrollY.current = window.scrollY
    lastScrollTime.current = now
    recordActivity()
  }, [updateWorld, recordActivity, incrementFriction, sensitivityMultiplier])

  // Detector de movimiento de mouse
  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      const now = Date.now()
      const deltaX = e.clientX - lastMousePos.current.x
      const deltaY = e.clientY - lastMousePos.current.y
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY)
      const deltaTime = now - lastMouseTime.current

      if (deltaTime > 0) {
        const speed = distance / deltaTime

        mouseMovements.current.push(speed)
        if (mouseMovements.current.length > 20) {
          mouseMovements.current.shift()
        }

        // Calcular "inquietud" del mouse
        const avgSpeed =
          mouseMovements.current.reduce((a, b) => a + b, 0) /
          mouseMovements.current.length

        // Varianza de velocidad = inquietud
        const variance =
          mouseMovements.current.reduce(
            (sum, s) => sum + Math.pow(s - avgSpeed, 2),
            0
          ) / mouseMovements.current.length

        const restlessness = Math.min(10, variance * 50 * sensitivityMultiplier)

        updateWorld({
          mouseRestlessness: restlessness,
          seemsLost: restlessness > 7 && avgSpeed < 0.5,
        })

        // Movimientos muy erráticos = fricción
        if (restlessness > 6) {
          incrementFriction()
        }
      }

      lastMousePos.current = { x: e.clientX, y: e.clientY }
      lastMouseTime.current = now
      recordActivity()
    },
    [updateWorld, recordActivity, incrementFriction, sensitivityMultiplier]
  )

  // Detector de clicks rápidos (posible frustración)
  const clickTimes = useRef<number[]>([])

  const handleClick = useCallback(() => {
    const now = Date.now()
    clickTimes.current.push(now)

    // Mantener solo los últimos 5 clicks
    if (clickTimes.current.length > 5) {
      clickTimes.current.shift()
    }

    // Si hay 5 clicks en menos de 2 segundos = frustración
    if (clickTimes.current.length >= 5) {
      const timeDiff =
        clickTimes.current[clickTimes.current.length - 1] -
        clickTimes.current[0]
      if (timeDiff < 2000) {
        incrementFriction()
        incrementFriction()
        updateWorld({ friction: 8 })
      }
    }

    recordActivity()
  }, [updateWorld, recordActivity, incrementFriction])

  // Monitor de tiempo idle
  useEffect(() => {
    if (!enabled) return

    idleCheckInterval.current = setInterval(() => {
      const now = Date.now()
      const idleTime = now - lastActivityTime.current

      updateWorld({ idleTime })

      // Calcular fatiga basada en hora y tiempo de sesión
      const hour = new Date().getHours()
      const sessionDuration = now - focusStartTime.current
      const hourFactor = hour >= 22 || hour < 6 ? 1.5 : 1
      const fatigue = Math.min(
        10,
        ((sessionDuration / 3600000) * 3 + (hour >= 23 ? 3 : 0)) * hourFactor
      )

      updateWorld({
        fatigue,
        focusDuration: now - focusStartTime.current,
      })

      // Decrementar fricción con el tiempo si hay inactividad
      if (idleTime > 5000) {
        decrementFriction()
      }

      // Calcular atención basada en comportamiento
      const { scrollVelocity, mouseRestlessness } =
        useConsciousnessStore.getState().world
      const attention = Math.max(
        0,
        10 - scrollVelocity - mouseRestlessness * 0.5
      )
      updateWorld({ attention })
    }, 1000)

    return () => {
      if (idleCheckInterval.current) {
        clearInterval(idleCheckInterval.current)
      }
    }
  }, [enabled, updateWorld, decrementFriction])

  // Registrar actividad
  useEffect(() => {
    lastActivityTime.current = Date.now()
  }, [])

  // Event listeners
  useEffect(() => {
    if (!enabled) return

    window.addEventListener("scroll", handleScroll, { passive: true })
    window.addEventListener("mousemove", handleMouseMove, { passive: true })
    window.addEventListener("click", handleClick)

    return () => {
      window.removeEventListener("scroll", handleScroll)
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("click", handleClick)
    }
  }, [enabled, handleScroll, handleMouseMove, handleClick])

  // Detector de visibilidad de página
  useEffect(() => {
    if (!enabled) return

    const handleVisibilityChange = () => {
      if (document.hidden) {
        // Usuario se fue
        updateWorld({ attention: 0 })
      } else {
        // Usuario regresó
        focusStartTime.current = Date.now()
        updateWorld({ hasBeenHereRecently: true })
      }
    }

    document.addEventListener("visibilitychange", handleVisibilityChange)
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange)
    }
  }, [enabled, updateWorld])

  return {
    resetFocusTimer: () => {
      focusStartTime.current = Date.now()
    },
  }
}
