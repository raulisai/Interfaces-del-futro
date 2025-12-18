/**
 * INTERFAZ CRÍTICA
 * ━━━━━━━━━━━━━━━━━
 * 
 * Filosofía: "Más que reactivo, crítico"
 * - La interfaz cuestiona antes de ejecutar
 * - Desafía suposiciones del usuario
 * - El silencio y la pausa son features
 * - Progressive disclosure of consequences
 * 
 * Inspiración:
 * - Jenny Holzer (Truisms)
 * - Barbara Kruger (texto confrontacional)
 * - Anti-design movimiento
 * - NN Group friction design
 */

import { useState, useEffect, useCallback, useRef } from 'react';

// ═══════════════════════════════════════════════════════════════
// COMPONENTE: Botón Crítico
// No ejecuta inmediatamente, primero pregunta
// ═══════════════════════════════════════════════════════════════

const BotonCritico = ({
  accion,
  texto,
  consecuencia,
  tiempoReflexion = 3, // segundos para reflexionar
  irreversible = false,
  onConfirm,
  onCancel
}) => {
  const [fase, setFase] = useState('inicial'); // inicial | cuestionando | confirmando | ejecutando
  const [contador, setContador] = useState(tiempoReflexion);
  const intervalRef = useRef(null);
  
  const preguntas = [
    `¿Realmente necesitas ${texto.toLowerCase()}?`,
    `¿Has considerado las alternativas?`,
    `¿Esto resuelve el problema o lo evita?`,
    `¿Qué pasaría si no lo haces?`
  ];
  
  const [preguntaActual, setPreguntaActual] = useState(
    preguntas[Math.floor(Math.random() * preguntas.length)]
  );

  // Iniciar cuestionamiento
  const iniciarCuestionamiento = useCallback(() => {
    setFase('cuestionando');
    setContador(tiempoReflexion);
    
    intervalRef.current = setInterval(() => {
      setContador(prev => {
        if (prev <= 1) {
          clearInterval(intervalRef.current);
          setFase('confirmando');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, [tiempoReflexion]);

  // Cancelar
  const cancelar = useCallback(() => {
    clearInterval(intervalRef.current);
    setFase('inicial');
    onCancel?.();
  }, [onCancel]);

  // Confirmar
  const confirmar = useCallback(() => {
    setFase('ejecutando');
    setTimeout(() => {
      onConfirm?.();
      setFase('inicial');
    }, 500);
  }, [onConfirm]);

  // Cleanup
  useEffect(() => {
    return () => clearInterval(intervalRef.current);
  }, []);

  return (
    <div className={`boton-critico boton-critico--${fase}`}>
      {fase === 'inicial' && (
        <button 
          className="boton-accion"
          onClick={iniciarCuestionamiento}
        >
          {texto}
        </button>
      )}
      
      {fase === 'cuestionando' && (
        <div className="cuestionamiento">
          <p className="pregunta">{preguntaActual}</p>
          
          <div className="barra-tiempo">
            <div 
              className="barra-progreso"
              style={{ 
                width: `${(contador / tiempoReflexion) * 100}%` 
              }}
            />
          </div>
          
          <div className="cuestionamiento-acciones">
            <button className="btn-cancelar" onClick={cancelar}>
              No, cancelar
            </button>
            <span className="contador">{contador}s</span>
          </div>
        </div>
      )}
      
      {fase === 'confirmando' && (
        <div className="confirmacion">
          {irreversible && (
            <p className="advertencia">
              ⚠ Esta acción no se puede deshacer
            </p>
          )}
          
          {consecuencia && (
            <p className="consecuencia">{consecuencia}</p>
          )}
          
          <div className="confirmacion-acciones">
            <button className="btn-cancelar" onClick={cancelar}>
              Mejor no
            </button>
            <button className="btn-confirmar" onClick={confirmar}>
              Sí, {texto.toLowerCase()}
            </button>
          </div>
        </div>
      )}
      
      {fase === 'ejecutando' && (
        <div className="ejecutando">
          <span className="ejecutando-texto">Ejecutando...</span>
        </div>
      )}

      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=EB+Garamond:ital@0;1&display=swap');
        
        .boton-critico {
          --color-texto: #0a0a0a;
          --color-acento: #dc2626;
          --color-fondo: #fafaf9;
          --font-mono: 'Space Mono', monospace;
          --font-serif: 'EB Garamond', serif;
          
          font-family: var(--font-mono);
          position: relative;
        }
        
        /* ═══════════════════════════════════════════
           BOTÓN INICIAL
           ═══════════════════════════════════════════ */
        
        .boton-accion {
          font-family: var(--font-mono);
          font-size: 0.8rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          padding: 1rem 2rem;
          background: transparent;
          border: 2px solid var(--color-texto);
          color: var(--color-texto);
          cursor: pointer;
          transition: all 0.2s ease;
          position: relative;
          overflow: hidden;
        }
        
        .boton-accion::before {
          content: '';
          position: absolute;
          inset: 0;
          background: var(--color-texto);
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 0.3s ease;
          z-index: -1;
        }
        
        .boton-accion:hover {
          color: var(--color-fondo);
        }
        
        .boton-accion:hover::before {
          transform: scaleX(1);
        }
        
        /* ═══════════════════════════════════════════
           CUESTIONAMIENTO
           ═══════════════════════════════════════════ */
        
        .cuestionamiento {
          padding: 1.5rem;
          background: var(--color-fondo);
          border: 2px solid var(--color-texto);
          animation: aparecer 0.3s ease;
        }
        
        @keyframes aparecer {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .pregunta {
          font-family: var(--font-serif);
          font-size: 1.25rem;
          font-style: italic;
          margin: 0 0 1rem 0;
          line-height: 1.4;
        }
        
        .barra-tiempo {
          height: 3px;
          background: rgba(0, 0, 0, 0.1);
          margin-bottom: 1rem;
        }
        
        .barra-progreso {
          height: 100%;
          background: var(--color-acento);
          transition: width 1s linear;
        }
        
        .cuestionamiento-acciones {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        
        .btn-cancelar {
          font-family: var(--font-mono);
          font-size: 0.7rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          padding: 0.5rem 1rem;
          background: transparent;
          border: 1px solid currentColor;
          cursor: pointer;
          opacity: 0.6;
          transition: opacity 0.2s ease;
        }
        
        .btn-cancelar:hover {
          opacity: 1;
        }
        
        .contador {
          font-size: 0.75rem;
          opacity: 0.4;
        }
        
        /* ═══════════════════════════════════════════
           CONFIRMACIÓN
           ═══════════════════════════════════════════ */
        
        .confirmacion {
          padding: 1.5rem;
          background: var(--color-fondo);
          border: 2px solid var(--color-acento);
          animation: aparecer 0.3s ease;
        }
        
        .advertencia {
          font-size: 0.7rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: var(--color-acento);
          margin: 0 0 0.75rem 0;
        }
        
        .consecuencia {
          font-family: var(--font-serif);
          font-size: 1rem;
          margin: 0 0 1rem 0;
          opacity: 0.7;
        }
        
        .confirmacion-acciones {
          display: flex;
          gap: 0.75rem;
        }
        
        .btn-confirmar {
          font-family: var(--font-mono);
          font-size: 0.7rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          padding: 0.5rem 1rem;
          background: var(--color-acento);
          color: white;
          border: none;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        
        .btn-confirmar:hover {
          background: #b91c1c;
        }
        
        /* ═══════════════════════════════════════════
           EJECUTANDO
           ═══════════════════════════════════════════ */
        
        .ejecutando {
          padding: 1rem 2rem;
          border: 2px solid var(--color-texto);
          opacity: 0.5;
        }
        
        .ejecutando-texto {
          font-size: 0.7rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
        }
      `}</style>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// COMPONENTE: Input con Reflexión
// Te hace pensar antes de escribir
// ═══════════════════════════════════════════════════════════════

const InputReflexivo = ({
  placeholder,
  reflexion, // Pregunta que aparece mientras escribes
  validacion, // Función que valida la intención
  onSubmit
}) => {
  const [valor, setValor] = useState('');
  const [mostrarReflexion, setMostrarReflexion] = useState(false);
  const [analisis, setAnalisis] = useState(null);
  const inputRef = useRef(null);
  
  // Analizar mientras escribe
  useEffect(() => {
    if (valor.length > 10) {
      setMostrarReflexion(true);
      
      // Simular análisis de intención
      const timer = setTimeout(() => {
        const resultado = validacion?.(valor) || {
          tono: detectarTono(valor),
          urgencia: detectarUrgencia(valor),
          claridad: detectarClaridad(valor)
        };
        setAnalisis(resultado);
      }, 500);
      
      return () => clearTimeout(timer);
    } else {
      setMostrarReflexion(false);
      setAnalisis(null);
    }
  }, [valor, validacion]);
  
  // Detectores simples de intención
  const detectarTono = (texto) => {
    const palabrasNegativas = ['no', 'nunca', 'problema', 'error', 'mal'];
    const palabrasPositivas = ['gracias', 'excelente', 'bien', 'perfecto'];
    const lowerTexto = texto.toLowerCase();
    
    if (palabrasNegativas.some(p => lowerTexto.includes(p))) return 'tenso';
    if (palabrasPositivas.some(p => lowerTexto.includes(p))) return 'positivo';
    return 'neutral';
  };
  
  const detectarUrgencia = (texto) => {
    const palabrasUrgentes = ['urgente', 'ahora', 'inmediato', 'rápido', 'ya'];
    return palabrasUrgentes.some(p => texto.toLowerCase().includes(p)) ? 'alta' : 'normal';
  };
  
  const detectarClaridad = (texto) => {
    // Más signos de interrogación = menos claridad
    const interrogaciones = (texto.match(/\?/g) || []).length;
    if (interrogaciones > 2) return 'confuso';
    if (texto.length < 20) return 'breve';
    return 'claro';
  };

  return (
    <div className="input-reflexivo">
      <div className="input-contenedor">
        <textarea
          ref={inputRef}
          value={valor}
          onChange={(e) => setValor(e.target.value)}
          placeholder={placeholder}
          className="input-texto"
          rows={3}
        />
        
        {/* Indicador de escritura activa */}
        <div className={`indicador-activo ${valor.length > 0 ? 'visible' : ''}`}>
          <span className="cursor-parpadeo">│</span>
        </div>
      </div>
      
      {/* Panel de reflexión */}
      {mostrarReflexion && (
        <div className="panel-reflexion">
          <p className="reflexion-pregunta">{reflexion}</p>
          
          {analisis && (
            <div className="analisis">
              <div className="analisis-item">
                <span className="analisis-label">Tono</span>
                <span className={`analisis-valor tono-${analisis.tono}`}>
                  {analisis.tono}
                </span>
              </div>
              <div className="analisis-item">
                <span className="analisis-label">Urgencia</span>
                <span className={`analisis-valor urgencia-${analisis.urgencia}`}>
                  {analisis.urgencia}
                </span>
              </div>
              <div className="analisis-item">
                <span className="analisis-label">Claridad</span>
                <span className={`analisis-valor claridad-${analisis.claridad}`}>
                  {analisis.claridad}
                </span>
              </div>
            </div>
          )}
        </div>
      )}
      
      {/* Botón de envío */}
      {valor.length > 0 && (
        <button 
          className="btn-enviar"
          onClick={() => onSubmit?.(valor, analisis)}
        >
          Enviar con intención
        </button>
      )}

      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Mono&family=EB+Garamond:ital@0;1&display=swap');
        
        .input-reflexivo {
          --color-texto: #0a0a0a;
          --color-acento: #3b82f6;
          --font-mono: 'Space Mono', monospace;
          --font-serif: 'EB Garamond', serif;
          
          font-family: var(--font-mono);
        }
        
        .input-contenedor {
          position: relative;
        }
        
        .input-texto {
          width: 100%;
          font-family: var(--font-serif);
          font-size: 1.125rem;
          line-height: 1.6;
          padding: 1.25rem;
          border: 2px solid rgba(0, 0, 0, 0.1);
          background: transparent;
          resize: vertical;
          transition: border-color 0.3s ease;
        }
        
        .input-texto:focus {
          outline: none;
          border-color: var(--color-texto);
        }
        
        .input-texto::placeholder {
          color: rgba(0, 0, 0, 0.3);
          font-style: italic;
        }
        
        .indicador-activo {
          position: absolute;
          bottom: 1rem;
          right: 1rem;
          opacity: 0;
          transition: opacity 0.3s ease;
        }
        
        .indicador-activo.visible {
          opacity: 1;
        }
        
        .cursor-parpadeo {
          animation: parpadeo 1s step-end infinite;
          color: var(--color-acento);
        }
        
        @keyframes parpadeo {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        
        /* ═══════════════════════════════════════════
           PANEL DE REFLEXIÓN
           ═══════════════════════════════════════════ */
        
        .panel-reflexion {
          margin-top: 1rem;
          padding: 1rem;
          background: rgba(0, 0, 0, 0.02);
          border-left: 3px solid var(--color-acento);
          animation: deslizar 0.3s ease;
        }
        
        @keyframes deslizar {
          from {
            opacity: 0;
            transform: translateX(-10px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        .reflexion-pregunta {
          font-family: var(--font-serif);
          font-size: 1rem;
          font-style: italic;
          margin: 0 0 0.75rem 0;
          opacity: 0.7;
        }
        
        .analisis {
          display: flex;
          gap: 1.5rem;
          flex-wrap: wrap;
        }
        
        .analisis-item {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }
        
        .analisis-label {
          font-size: 0.6rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          opacity: 0.5;
        }
        
        .analisis-valor {
          font-size: 0.75rem;
          padding: 0.25rem 0.5rem;
          border-radius: 2px;
        }
        
        .tono-positivo { background: #dcfce7; color: #166534; }
        .tono-tenso { background: #fef2f2; color: #991b1b; }
        .tono-neutral { background: #f3f4f6; color: #374151; }
        
        .urgencia-alta { background: #fef3c7; color: #92400e; }
        .urgencia-normal { background: #f3f4f6; color: #374151; }
        
        .claridad-claro { background: #dbeafe; color: #1e40af; }
        .claridad-confuso { background: #fef2f2; color: #991b1b; }
        .claridad-breve { background: #f3f4f6; color: #374151; }
        
        /* ═══════════════════════════════════════════
           BOTÓN ENVIAR
           ═══════════════════════════════════════════ */
        
        .btn-enviar {
          margin-top: 1rem;
          font-family: var(--font-mono);
          font-size: 0.7rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          padding: 0.75rem 1.5rem;
          background: var(--color-texto);
          color: white;
          border: none;
          cursor: pointer;
          transition: all 0.2s ease;
          animation: aparecer 0.3s ease;
        }
        
        .btn-enviar:hover {
          background: #333;
        }
      `}</style>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// COMPONENTE: Notificación Crítica
// No interrumpe, pero te hace pensar
// ═══════════════════════════════════════════════════════════════

const NotificacionCritica = ({
  mensaje,
  tipo = 'info', // info | pregunta | advertencia | insight
  posicion = 'bottom',
  persistente = false,
  onDismiss,
  onAction
}) => {
  const [visible, setVisible] = useState(true);
  const [leida, setLeida] = useState(false);
  
  const iconos = {
    info: '○',
    pregunta: '?',
    advertencia: '!',
    insight: '◆'
  };
  
  useEffect(() => {
    if (!persistente && visible) {
      const timer = setTimeout(() => {
        setVisible(false);
        onDismiss?.();
      }, 8000);
      return () => clearTimeout(timer);
    }
  }, [persistente, visible, onDismiss]);

  if (!visible) return null;

  return (
    <div 
      className={`notificacion-critica notificacion--${tipo} notificacion--${posicion} ${leida ? 'leida' : ''}`}
      onMouseEnter={() => setLeida(true)}
    >
      <span className="icono">{iconos[tipo]}</span>
      <p className="mensaje">{mensaje}</p>
      
      {onAction && (
        <button className="btn-accion" onClick={onAction}>
          Actuar
        </button>
      )}
      
      <button 
        className="btn-cerrar"
        onClick={() => {
          setVisible(false);
          onDismiss?.();
        }}
      >
        ×
      </button>

      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Mono&display=swap');
        
        .notificacion-critica {
          --font-mono: 'Space Mono', monospace;
          
          position: fixed;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem 1rem;
          background: rgba(255, 255, 255, 0.98);
          border: 1px solid rgba(0, 0, 0, 0.1);
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
          font-family: var(--font-mono);
          z-index: 9999;
          animation: entrar 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        
        .notificacion--bottom {
          bottom: 2rem;
        }
        
        .notificacion--top {
          top: 2rem;
        }
        
        @keyframes entrar {
          from {
            opacity: 0;
            transform: translateX(-50%) translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
          }
        }
        
        .icono {
          width: 24px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.9rem;
          font-weight: bold;
          border: 1px solid currentColor;
          border-radius: 50%;
          flex-shrink: 0;
        }
        
        .notificacion--pregunta .icono { color: #3b82f6; }
        .notificacion--advertencia .icono { color: #f59e0b; }
        .notificacion--insight .icono { color: #8b5cf6; }
        
        .mensaje {
          margin: 0;
          font-size: 0.75rem;
          max-width: 300px;
        }
        
        .btn-accion {
          font-family: var(--font-mono);
          font-size: 0.65rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          padding: 0.35rem 0.75rem;
          background: #0a0a0a;
          color: white;
          border: none;
          cursor: pointer;
          flex-shrink: 0;
        }
        
        .btn-cerrar {
          background: transparent;
          border: none;
          font-size: 1.25rem;
          opacity: 0.3;
          cursor: pointer;
          padding: 0 0.25rem;
          transition: opacity 0.2s ease;
        }
        
        .btn-cerrar:hover {
          opacity: 1;
        }
        
        .leida {
          opacity: 0.7;
        }
      `}</style>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// DEMO
// ═══════════════════════════════════════════════════════════════

export const InterfazCriticaDemo = () => {
  const [mostrarNotificacion, setMostrarNotificacion] = useState(true);
  
  return (
    <div style={{ 
      minHeight: '100vh', 
      background: '#fafaf9',
      padding: '3rem',
      fontFamily: 'system-ui'
    }}>
      <h1 style={{ 
        fontFamily: 'EB Garamond, serif',
        fontSize: '2.5rem',
        fontWeight: 400,
        marginBottom: '0.5rem'
      }}>
        Interfaz Crítica
      </h1>
      <p style={{ 
        fontFamily: 'Space Mono, monospace',
        fontSize: '0.75rem',
        textTransform: 'uppercase',
        letterSpacing: '0.1em',
        opacity: 0.5,
        marginBottom: '3rem'
      }}>
        Más que reactivo, crítico
      </p>
      
      <div style={{ maxWidth: '500px' }}>
        <section style={{ marginBottom: '3rem' }}>
          <h2 style={{ 
            fontFamily: 'Space Mono, monospace',
            fontSize: '0.7rem',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            marginBottom: '1rem',
            opacity: 0.5
          }}>
            Botón que cuestiona
          </h2>
          
          <BotonCritico
            texto="Eliminar cuenta"
            consecuencia="Perderás todos tus datos y proyectos permanentemente."
            tiempoReflexion={5}
            irreversible={true}
            onConfirm={() => console.log('Cuenta eliminada')}
            onCancel={() => console.log('Cancelado')}
          />
        </section>
        
        <section style={{ marginBottom: '3rem' }}>
          <h2 style={{ 
            fontFamily: 'Space Mono, monospace',
            fontSize: '0.7rem',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            marginBottom: '1rem',
            opacity: 0.5
          }}>
            Input con reflexión
          </h2>
          
          <InputReflexivo
            placeholder="Escribe tu mensaje..."
            reflexion="¿Tu mensaje refleja realmente lo que quieres comunicar?"
            onSubmit={(valor, analisis) => console.log('Enviado:', valor, analisis)}
          />
        </section>
      </div>
      
      {mostrarNotificacion && (
        <NotificacionCritica
          tipo="insight"
          mensaje="Has estado usando la app por 2 horas. ¿Es momento de un descanso?"
          persistente={false}
          onDismiss={() => setMostrarNotificacion(false)}
          onAction={() => console.log('Tomando descanso')}
        />
      )}
    </div>
  );
};

export default BotonCritico;
export { InputReflexivo, NotificacionCritica };
