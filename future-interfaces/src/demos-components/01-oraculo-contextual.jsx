"use client";

/**
 * EL ORÁCULO CONTEXTUAL
 * ━━━━━━━━━━━━━━━━━━━━━
 * 
 * Filosofía: "Progressive disclosure of sophistication"
 * - Solo aparece cuando tiene algo relevante que decir
 * - El silencio es parte del diseño
 * - La tipografía respira con la intención del usuario
 * 
 * Inspiración: 
 * - Kinetic Typography de Barbara Kruger
 * - Swiss International Style (Josef Müller-Brockmann)
 * - Wabi-sabi digital (imperfección intencional)
 */

import { useState, useEffect, useRef } from 'react';

const OraculoContextual = ({ contexto = {}, onInsight }) => {
  const [estado, setEstado] = useState('dormido'); // dormido | pensando | hablando | escuchando
  const [mensaje, setMensaje] = useState('');
  const [intensidad, setIntensidad] = useState(0);
  const containerRef = useRef(null);

  const generarMensaje = ({ energia, urgencia = 0, relevancia = 0, emocion = 'neutral' }) => {
    const energiaBucket = Math.max(0, Math.min(4, Math.floor(energia * 5)));
    const e = emocion || 'neutral';

    const mensajes = {
      alerta: [
        'Algo está pidiendo atención. No lo tapes con ruido.',
        'Si todo es urgente, nada lo es. Elige una cosa.',
        'Tu velocidad es señal. ¿De qué estás huyendo?',
        'Interrumpo porque esto sí cambia el resultado.',
        'Detén el gesto. Mira el contexto.',
      ],
      curioso: [
        'Explorar también es decidir. Sigue una pista.',
        'La interfaz no es pantalla: es relación.',
        'Menos control. Más intención.',
        'Lo vivo no se navega, se escucha.',
        'El significado aparece después del movimiento.',
      ],
      sereno: [
        'El silencio es una respuesta válida.',
        'Si no aporta, no aparece.',
        'Respira. La UI también.',
        'No hay nada que hacer. Eso también es diseño.',
        'El vacío es un estado, no un error.',
      ],
      neutral: [
        'Estoy aquí, pero no voy a ocupar espacio.',
        'Una línea basta para recordar presencia.',
        'La intención es más importante que el click.',
        '¿Esto es una necesidad o un hábito?',
        'Todo lo permanente se vuelve ruido.',
      ],
    };

    const pool = mensajes[e] || mensajes.neutral;
    const idx = Math.max(0, Math.min(pool.length - 1, energiaBucket));
    const base = pool[idx];

    if (urgencia > 0.75 && relevancia > 0.75) return `${base} (umbral alto)`;
    if (urgencia < 0.2 && relevancia < 0.2) return `${base} (umbral bajo)`;
    return base;
  };

  // El oráculo detecta la "energía" del contexto
  useEffect(() => {
    const { urgencia = 0, relevancia = 0, emocion = 'neutral' } = contexto;
    const energia = (urgencia + relevancia) / 2;
    
    setIntensidad(energia);
    
    if (energia > 0.7) {
      setEstado('hablando');
    } else if (energia > 0.3) {
      setEstado('pensando');
    } else if (energia > 0) {
      setEstado('escuchando');
    } else {
      setEstado('dormido');
    }
  }, [contexto]);

  useEffect(() => {
    if (estado !== 'hablando') {
      setMensaje('');
      return;
    }

    const { urgencia = 0, relevancia = 0, emocion = 'neutral' } = contexto;
    const energia = (urgencia + relevancia) / 2;
    const insight = generarMensaje({ energia, urgencia, relevancia, emocion });
    setMensaje(insight);
    onInsight?.(insight);
  }, [contexto, estado, onInsight]);

  // Si está dormido, solo muestra un punto que respira
  if (estado === 'dormido') {
    return (
      <div className="oraculo-dormido">
        <span className="punto-vital" />
        <style jsx>{`
          .oraculo-dormido {
            position: fixed;
            bottom: 2rem;
            right: 2rem;
            z-index: 9999;
          }
          
          .punto-vital {
            display: block;
            width: 8px;
            height: 8px;
            background: currentColor;
            border-radius: 50%;
            opacity: 0.3;
            animation: respirar 4s ease-in-out infinite;
          }
          
          @keyframes respirar {
            0%, 100% { 
              transform: scale(1); 
              opacity: 0.2;
            }
            50% { 
              transform: scale(1.5); 
              opacity: 0.4;
            }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div 
      ref={containerRef}
      className={`oraculo oraculo--${estado}`}
      style={{ '--intensidad': intensidad }}
    >
      {/* El contenedor que se adhiere al borde */}
      <div className="oraculo__borde">
        <div className="oraculo__linea" />
      </div>

      {/* El mensaje que emerge */}
      <div className="oraculo__contenido">
        {estado === 'pensando' && (
          <div className="oraculo__pensamiento">
            <span className="caracter">.</span>
            <span className="caracter">.</span>
            <span className="caracter">.</span>
          </div>
        )}
        
        {estado === 'hablando' && mensaje && (
          <p className="oraculo__mensaje">
            {mensaje.split('').map((char, i) => (
              <span 
                key={i} 
                className="caracter"
                style={{ 
                  animationDelay: `${i * 0.03}s`,
                  '--char-index': i 
                }}
              >
                {char === ' ' ? '\u00A0' : char}
              </span>
            ))}
          </p>
        )}

        {estado === 'escuchando' && (
          <div className="oraculo__escucha">
            <div className="onda" />
            <div className="onda" />
            <div className="onda" />
          </div>
        )}
      </div>

      <style jsx>{`
        /* ═══════════════════════════════════════════
           TIPOGRAFÍA: Editorial, autoritativa
           Font: Editorial New (o fallback a Georgia)
           ═══════════════════════════════════════════ */
        
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=JetBrains+Mono:wght@300&display=swap');
        
        .oraculo {
          --color-primario: #0a0a0a;
          --color-acento: #ff3c00;
          --color-texto: #fafafa;
          --font-display: 'Playfair Display', Georgia, serif;
          --font-mono: 'JetBrains Mono', monospace;
          
          position: fixed;
          bottom: 0;
          right: 0;
          max-width: min(90vw, 400px);
          padding: 2rem;
          z-index: 9999;
          
          /* El oráculo emerge desde la esquina */
          transform-origin: bottom right;
          animation: emerger 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        
        @keyframes emerger {
          from {
            opacity: 0;
            transform: translateY(20px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        
        /* ═══════════════════════════════════════════
           LA LÍNEA: Conexión física con el borde
           Inspirada en el arte de Sol LeWitt
           ═══════════════════════════════════════════ */
        
        .oraculo__borde {
          position: absolute;
          top: 0;
          right: 0;
          bottom: 0;
          width: 3px;
        }
        
        .oraculo__linea {
          position: absolute;
          top: 0;
          right: 0;
          width: 3px;
          height: 100%;
          background: linear-gradient(
            to bottom,
            transparent 0%,
            var(--color-acento) 20%,
            var(--color-acento) 80%,
            transparent 100%
          );
          opacity: calc(0.3 + var(--intensidad) * 0.7);
          animation: pulsar-linea 2s ease-in-out infinite;
        }
        
        @keyframes pulsar-linea {
          0%, 100% { opacity: calc(0.3 + var(--intensidad) * 0.4); }
          50% { opacity: calc(0.5 + var(--intensidad) * 0.5); }
        }
        
        /* ═══════════════════════════════════════════
           CONTENIDO: Tipografía que respira
           ═══════════════════════════════════════════ */
        
        .oraculo__contenido {
          padding-right: 1.5rem;
        }
        
        .oraculo__mensaje {
          font-family: var(--font-display);
          font-size: clamp(1.1rem, 4vw, 1.4rem);
          font-weight: 400;
          line-height: 1.4;
          letter-spacing: -0.02em;
          color: var(--color-texto);
          margin: 0;
        }
        
        .caracter {
          display: inline-block;
          opacity: 0;
          transform: translateY(10px);
          animation: aparecer-caracter 0.4s ease forwards;
        }
        
        @keyframes aparecer-caracter {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        /* ═══════════════════════════════════════════
           ESTADOS: Pensando, Escuchando
           ═══════════════════════════════════════════ */
        
        .oraculo__pensamiento {
          display: flex;
          gap: 0.3rem;
          font-family: var(--font-mono);
          font-size: 1.5rem;
          color: var(--color-texto);
          opacity: 0.6;
        }
        
        .oraculo__pensamiento .caracter {
          animation: pensando 1.4s ease-in-out infinite;
        }
        
        .oraculo__pensamiento .caracter:nth-child(2) {
          animation-delay: 0.2s;
        }
        
        .oraculo__pensamiento .caracter:nth-child(3) {
          animation-delay: 0.4s;
        }
        
        @keyframes pensando {
          0%, 100% { 
            opacity: 0.3;
            transform: translateY(0);
          }
          50% { 
            opacity: 1;
            transform: translateY(-5px);
          }
        }
        
        .oraculo__escucha {
          display: flex;
          align-items: center;
          gap: 4px;
          height: 24px;
        }
        
        .onda {
          width: 3px;
          height: 100%;
          background: var(--color-acento);
          border-radius: 2px;
          animation: onda 0.8s ease-in-out infinite;
        }
        
        .onda:nth-child(2) { animation-delay: 0.1s; }
        .onda:nth-child(3) { animation-delay: 0.2s; }
        
        @keyframes onda {
          0%, 100% { transform: scaleY(0.3); }
          50% { transform: scaleY(1); }
        }
        
        /* ═══════════════════════════════════════════
           ESTADOS DEL ORÁCULO
           ═══════════════════════════════════════════ */
        
        .oraculo--hablando {
          /* Sombra dramática cuando habla */
          filter: drop-shadow(0 0 30px rgba(255, 60, 0, 0.1));
        }
        
        .oraculo--pensando {
          opacity: 0.7;
        }
        
        .oraculo--escuchando {
          opacity: 0.5;
        }
      `}</style>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// DEMO: Cómo se usa el Oráculo
// ═══════════════════════════════════════════════════════════════

export const OraculoDemo = () => {
  const [contexto, setContexto] = useState({
    urgencia: 0,
    relevancia: 0,
    emocion: 'neutral'
  });

  const estadoRef = useRef({
    urgencia: 0,
    relevancia: 0,
    ultimaActividad: performance.now(),
    ultimoScrollY: 0,
    ultimoScrollT: performance.now(),
  });

  useEffect(() => {
    const clamp01 = (n) => Math.max(0, Math.min(1, n));

    const bump = ({ urgencia = 0, relevancia = 0 }) => {
      estadoRef.current.ultimaActividad = performance.now();
      estadoRef.current.urgencia = clamp01(estadoRef.current.urgencia + urgencia);
      estadoRef.current.relevancia = clamp01(estadoRef.current.relevancia + relevancia);
    };

    const onKeydown = () => bump({ urgencia: 0.12, relevancia: 0.08 });
    const onPointer = () => bump({ relevancia: 0.04 });
    const onScroll = () => {
      const now = performance.now();
      const y = window.scrollY;
      const dy = Math.abs(y - estadoRef.current.ultimoScrollY);
      const dt = Math.max(16, now - estadoRef.current.ultimoScrollT);
      const v = dy / dt; // px/ms
      const urg = Math.min(0.25, v * 0.6);
      bump({ urgencia: urg, relevancia: 0.06 });
      estadoRef.current.ultimoScrollY = y;
      estadoRef.current.ultimoScrollT = now;
    };

    window.addEventListener('keydown', onKeydown);
    window.addEventListener('mousemove', onPointer);
    window.addEventListener('scroll', onScroll, { passive: true });

    const tick = setInterval(() => {
      const now = performance.now();
      const idleMs = now - estadoRef.current.ultimaActividad;

      const decay = idleMs > 2500 ? 0.06 : 0.02;
      estadoRef.current.urgencia = clamp01(estadoRef.current.urgencia - decay);
      estadoRef.current.relevancia = clamp01(estadoRef.current.relevancia - decay * 0.75);

      const urg = estadoRef.current.urgencia;
      const rel = estadoRef.current.relevancia;

      let emocion = 'neutral';
      if (urg > 0.75) emocion = 'alerta';
      else if (rel > 0.55) emocion = 'curioso';
      else if (idleMs > 7000 && urg < 0.25 && rel < 0.25) emocion = 'sereno';

      setContexto({ urgencia: urg, relevancia: rel, emocion });
    }, 900);

    return () => {
      clearInterval(tick);
      window.removeEventListener('keydown', onKeydown);
      window.removeEventListener('mousemove', onPointer);
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: '#0a0a0a',
      color: '#fafafa',
      fontFamily: 'system-ui'
    }}>
      <div style={{ padding: '2rem', maxWidth: '600px' }}>
        <h1 style={{ 
          fontFamily: 'Playfair Display, serif',
          fontSize: '2.5rem',
          fontWeight: 400,
          marginBottom: '1rem'
        }}>
          El Oráculo Contextual
        </h1>
        <p style={{ opacity: 0.6, lineHeight: 1.6 }}>
          Una interfaz que solo habla cuando el contexto lo justifica.
          No responde a clicks: responde a intención.
        </p>

        <div style={{ marginTop: '2rem', opacity: 0.4, fontSize: '0.875rem' }}>
          Contexto actual: urgencia {(contexto.urgencia * 100).toFixed(0)}% · 
          relevancia {(contexto.relevancia * 100).toFixed(0)}%
        </div>

        <div style={{ marginTop: '1.25rem', opacity: 0.5, fontSize: '0.875rem', lineHeight: 1.6 }}>
          Prueba esto:
          <br />
          - Escribe o mueve el mouse para subir relevancia.
          <br />
          - Haz scroll rápido para subir urgencia.
          <br />
          - Quédate quieto para que vuelva al silencio.
        </div>
      </div>

      <OraculoContextual contexto={contexto} />
    </div>
  );
};

export default OraculoContextual;
