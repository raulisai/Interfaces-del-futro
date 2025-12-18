"use client";

/**
 * PERIÓDICO VIVO
 * ━━━━━━━━━━━━━━━━
 * 
 * Filosofía: "El contenido se adapta al momento, no al template"
 * - El texto respira con el ritmo de lectura del usuario
 * - Los titulares se transforman según la relevancia temporal
 * - La jerarquía visual es emocional, no solo informativa
 * 
 * Inspiración:
 * - Alexey Brodovitch (Harper's Bazaar layouts)
 * - David Carson (Ray Gun magazine - anti-design)
 * - Neville Brody (The Face)
 * - Emigre magazine
 */

import { useState, useEffect, useRef, useCallback } from 'react';

// ═══════════════════════════════════════════════════════════════
// COMPONENTE: Titular Vivo
// El titular que pulsa con la urgencia de la noticia
// ═══════════════════════════════════════════════════════════════

const TitularVivo = ({ 
  texto, 
  urgencia = 0.5, 
  antiguedad = 0, // horas desde publicación
  ritmo = 1,
  onClick 
}) => {
  const [hover, setHover] = useState(false);
  const palabras = texto.split(' ');
  
  // La intensidad decae con el tiempo (como una noticia real)
  const intensidadTemporal = Math.max(0, urgencia - (antiguedad * 0.1));
  
  return (
    <article 
      className="titular-vivo"
      style={{ '--urgencia': intensidadTemporal, '--ritmo': ritmo }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onClick={onClick}
    >
      <h2 className="titular-vivo__texto">
        {palabras.map((palabra, i) => (
          <span 
            key={i}
            className="palabra"
            style={{
              '--delay': `${i * 0.05}s`,
              '--index': i,
              // Palabras importantes tienen más peso visual
              '--peso': palabra.length > 6 ? 700 : 400
            }}
          >
            {palabra}
            {i < palabras.length - 1 && ' '}
          </span>
        ))}
      </h2>
      
      {/* Indicador de frescura */}
      <div className="titular-vivo__pulso">
        <span className="pulso-dot" />
        <span className="pulso-label">
          {antiguedad === 0 ? 'ahora' : `hace ${antiguedad}h`}
        </span>
      </div>

      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Space+Mono&display=swap');
        
        *{
          --color-primario: #0a0a0a;
          --color-acento: #ff3c00;
          
        }
        
        .titular-vivo {
          --color-urgente: #ff2d00;
          --color-normal: #1a1a1a;
          --font-serif: 'Instrument Serif', 'Times New Roman', serif;
          --font-mono: 'Space Mono', monospace;
          
          position: relative;
          padding: 1.5rem 0;
          cursor: pointer;
          border-bottom: 1px solid rgba(0, 0, 0, 0.08);
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }
        
        .titular-vivo:hover {
          padding-left: 1rem;
          border-color: rgba(0, 0, 0, 0.2);
        }
        
        .titular-vivo__texto {
          font-family: var(--font-serif);
          font-size: clamp(1.5rem, 5vw, 2.5rem);
          font-weight: 400;
          line-height: 1.15;
          letter-spacing: -0.03em;
          margin: 0;
          
          /* Color basado en urgencia */
          color: color-mix(
            in oklch,
            var(--color-normal),
            var(--color-urgente) calc(var(--urgencia) * 100%)
          );
        }
        
        .palabra {
          display: inline-block;
          font-weight: var(--peso);
          transition: transform 0.3s ease;
          animation: respirar-palabra calc(3s / var(--ritmo)) ease-in-out infinite;
          animation-delay: var(--delay);
        }
        
        @keyframes respirar-palabra {
          0%, 100% { 
            opacity: 1;
          }
          50% { 
            opacity: calc(0.7 + var(--urgencia) * 0.3);
          }
        }
        
        .titular-vivo:hover .palabra {
          animation-play-state: paused;
        }
        
        /* ═══════════════════════════════════════════
           INDICADOR DE FRESCURA
           ═══════════════════════════════════════════ */
        
        .titular-vivo__pulso {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-top: 0.75rem;
          opacity: 0.5;
          transition: opacity 0.3s ease;
        }
        
        .titular-vivo:hover .titular-vivo__pulso {
          opacity: 1;
        }
        
        .pulso-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: var(--color-urgente);
          opacity: var(--urgencia);
          animation: pulso calc(1.5s / var(--ritmo)) ease-in-out infinite;
        }
        
        @keyframes pulso {
          0%, 100% { 
            transform: scale(1);
            opacity: calc(var(--urgencia) * 0.5);
          }
          50% { 
            transform: scale(1.5);
            opacity: var(--urgencia);
          }
        }
        
        .pulso-label {
          font-family: var(--font-mono);
          font-size: 0.65rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: currentColor;
        }
      `}</style>
    </article>
  );
};

// ═══════════════════════════════════════════════════════════════
// COMPONENTE: Párrafo Crítico
// Texto que se atreve a preguntarte si realmente quieres leerlo
// ═══════════════════════════════════════════════════════════════

const ParrafoCritico = ({ 
  texto, 
  relevanciaPersonal = 0.5,
  tiempoLectura = 2 // minutos
}) => {
  const [expandido, setExpandido] = useState(false);
  const [leido, setLeido] = useState(false);
  const ref = useRef(null);
  
  // Si la relevancia es baja, el texto se pregunta si vale la pena
  const debePreguntar = relevanciaPersonal < 0.3;
  
  return (
    <div 
      ref={ref}
      className={`parrafo-critico ${expandido ? 'expandido' : ''} ${leido ? 'leido' : ''}`}
      style={{ '--relevancia': relevanciaPersonal }}
    >
      {debePreguntar && !expandido && (
        <div className="parrafo-critico__pregunta">
          <p className="pregunta-texto">
            Este contenido podría no ser relevante para ti.
            <br />
            <span className="tiempo">~{tiempoLectura} min de lectura</span>
          </p>
          <button 
            className="btn-revelar"
            onClick={() => setExpandido(true)}
          >
            Leer de todos modos
          </button>
        </div>
      )}
      
      {(!debePreguntar || expandido) && (
        <p 
          className="parrafo-critico__texto"
          onMouseUp={() => setLeido(true)}
        >
          {texto}
        </p>
      )}

      <style jsx>{`
        .parrafo-critico {
          --font-body: 'Instrument Serif', Georgia, serif;
          position: relative;
          margin: 2rem 0;
        }
        
        .parrafo-critico__pregunta {
          padding: 2rem;
          background: repeating-linear-gradient(
            -45deg,
            transparent,
            transparent 10px,
            rgba(0, 0, 0, 0.02) 10px,
            rgba(0, 0, 0, 0.02) 20px
          );
          border: 1px dashed rgba(0, 0, 0, 0.2);
          text-align: center;
        }
        
        .pregunta-texto {
          font-family: var(--font-body);
          font-style: italic;
          font-size: 1rem;
          color: rgba(0, 0, 0, 0.5);
          margin: 0 0 1rem 0;
        }
        
        .tiempo {
          font-family: 'Space Mono', monospace;
          font-size: 0.7rem;
          font-style: normal;
          text-transform: uppercase;
          letter-spacing: 0.1em;
        }
        
        .btn-revelar {
          font-family: 'Space Mono', monospace;
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          padding: 0.75rem 1.5rem;
          border: 1px solid currentColor;
          background: transparent;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        
        .btn-revelar:hover {
          background: #1a1a1a;
          color: white;
        }
        
        .parrafo-critico__texto {
          font-family: var(--font-body);
          font-size: 1.125rem;
          line-height: 1.7;
          color: rgba(0, 0, 0, calc(0.4 + var(--relevancia) * 0.6));
          margin: 0;
          transition: color 0.5s ease;
          animation: revelar-texto 0.6s ease forwards;
        }
        
        @keyframes revelar-texto {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .leido .parrafo-critico__texto {
          color: rgba(0, 0, 0, 0.4);
        }
        
        .leido::after {
          content: '✓ leído';
          position: absolute;
          right: 0;
          bottom: -1.5rem;
          font-family: 'Space Mono', monospace;
          font-size: 0.6rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          opacity: 0.3;
        }
      `}</style>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// COMPONENTE: Periódico Completo
// ═══════════════════════════════════════════════════════════════

const PeriodicoVivo = ({ noticias = [], perfil = {} }) => {
  const [horaActual, setHoraActual] = useState(new Date());
  const [mostrarTodo, setMostrarTodo] = useState(false);
  const [lecturaRitmo, setLecturaRitmo] = useState(1);
  const [flashEdicion, setFlashEdicion] = useState(false);
  const [seleccion, setSeleccion] = useState(null);
  const ultimaLecturaRef = useRef({ y: 0, t: 0 });
  const cierreRef = useRef(null);
  const flashTimeoutRef = useRef(null);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setHoraActual(new Date());
    }, 60000); // Actualizar cada minuto
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const activar = () => setMostrarTodo(true);
    const activarPorTiempo = setTimeout(activar, 6000);

    const onScroll = () => {
      activar();

      const now = performance.now();
      const y = window.scrollY;
      const dy = Math.abs(y - ultimaLecturaRef.current.y);
      const dt = now - ultimaLecturaRef.current.t;

      if (dt > 0) {
        const v = dy / dt; // px/ms
        const ritmo = Math.min(1.8, Math.max(0.65, 1 + v * 2));
        setLecturaRitmo(ritmo);
      }

      ultimaLecturaRef.current = { y, t: now };
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      clearTimeout(activarPorTiempo);
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setFlashEdicion(true);
      if (flashTimeoutRef.current) clearTimeout(flashTimeoutRef.current);
      flashTimeoutRef.current = setTimeout(() => setFlashEdicion(false), 5000);
    }, 90000);

    return () => {
      clearInterval(interval);
      if (flashTimeoutRef.current) clearTimeout(flashTimeoutRef.current);
      flashTimeoutRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!seleccion) return;

    const cerrar = () => setSeleccion(null);
    if (cierreRef.current) clearTimeout(cierreRef.current);
    cierreRef.current = setTimeout(cerrar, 35000);

    const reset = () => {
      if (cierreRef.current) clearTimeout(cierreRef.current);
      cierreRef.current = setTimeout(cerrar, 35000);
    };

    window.addEventListener('mousemove', reset);
    window.addEventListener('keydown', reset);
    return () => {
      window.removeEventListener('mousemove', reset);
      window.removeEventListener('keydown', reset);
      if (cierreRef.current) clearTimeout(cierreRef.current);
      cierreRef.current = null;
    };
  }, [seleccion]);

  // Calcular "mood" del momento (mañana = informativo, noche = reflexivo)
  const hora = horaActual.getHours();
  const momento = hora < 12 ? 'mañana' : hora < 18 ? 'tarde' : 'noche';

  const noticiasVisibles = mostrarTodo ? noticias : noticias.slice(0, 2);
  
  return (
    <div className={`periodico periodico--${momento}`} style={{ '--ritmo': lecturaRitmo }}>
      {/* Cabecera que respira con el tiempo */}
      <header className="periodico__cabecera">
        <div className="marca-temporal">
          <time className="fecha">
            {horaActual.toLocaleDateString('es-ES', { 
              weekday: 'long', 
              day: 'numeric', 
              month: 'long' 
            })}
          </time>
          <span className="hora">
            {horaActual.toLocaleTimeString('es-ES', { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </span>
        </div>
        
        <h1 className="periodico__titulo">
          <span className="titulo-linea">El Diario</span>
          <span className="titulo-subtitulo">que te escucha</span>
        </h1>
        
        <div className="estado-lectura" aria-label="En vivo" title="En vivo">
          <span className="estado-dot" />
          <span className="estado-simbolo">●</span>
        </div>
      </header>

      {/* Contenido que fluye */}
      <main className="periodico__contenido">
        {noticiasVisibles.map((noticia, i) => (
          <TitularVivo
            key={noticia.id || i}
            texto={noticia.titulo}
            urgencia={noticia.urgencia}
            antiguedad={noticia.antiguedad}
            ritmo={lecturaRitmo}
            onClick={() => setSeleccion(noticia)}
          />
        ))}

        {!mostrarTodo && noticias.length > 2 && (
          <div className="convocatoria" aria-hidden>
            <span className="convocatoria__linea" />
            <span className="convocatoria__pista">Desliza. El diario aparece cuando hay intención.</span>
          </div>
        )}
        
        {noticias.length === 0 && (
          <div className="sin-noticias">
            <p>El silencio también es información.</p>
            <p className="sub">No hay nada urgente que requiera tu atención.</p>
          </div>
        )}
      </main>

      {flashEdicion && (
        <div className="flash-edicion" role="status" aria-live="polite">
          <span className="flash-edicion__marca">EDICIÓN</span>
          <span className="flash-edicion__pulso" />
        </div>
      )}

      {seleccion && (
        <div className="overlay" onClick={() => setSeleccion(null)}>
          <div className="overlay__panel" onClick={(e) => e.stopPropagation()}>
            <div className="overlay__cabecera">
              <div className="overlay__meta">
                <span className="overlay__dot" />
                <span className="overlay__tiempo">
                  {seleccion.antiguedad === 0 ? 'ahora' : `hace ${seleccion.antiguedad}h`}
                </span>
              </div>
              <button
                className="overlay__cerrar"
                type="button"
                aria-label="Cerrar"
                onClick={() => setSeleccion(null)}
              >
                ×
              </button>
            </div>

            <h2 className="overlay__titulo">{seleccion.titulo}</h2>

            <ParrafoCritico
              texto="Este demo no trae el artículo completo. La interfaz decide no llenar la pantalla: solo abre un umbral cuando haces intención."
              relevanciaPersonal={Math.min(1, (seleccion.urgencia || 0.5) + 0.15)}
              tiempoLectura={Math.max(1, Math.round(3 - (seleccion.urgencia || 0.5)))}
            />
          </div>
        </div>
      )}

      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Space+Mono&display=swap');
        
        .periodico {
          --bg-manana: #fdfcfa;
          --bg-tarde: #f5f2ed;
          --bg-noche: #1a1915;
          --text-manana: #1a1a1a;
          --text-tarde: #2a2520;
          --text-noche: #e8e4dc;
          --ritmo: 1;
          
          min-height: 100vh;
          padding: clamp(1rem, 5vw, 4rem);
          transition: background 1s ease, color 1s ease;
        }
        
        .periodico--manana {
          background: var(--bg-manana);
          color: var(--text-manana);
        }
        
        .periodico--tarde {
          background: var(--bg-tarde);
          color: var(--text-tarde);
        }
        
        .periodico--noche {
          background: var(--bg-noche);
          color: var(--text-noche);
        }
        
        /* ═══════════════════════════════════════════
           CABECERA
           ═══════════════════════════════════════════ */
        
        .periodico__cabecera {
          display: grid;
          grid-template-columns: 1fr auto 1fr;
          align-items: center;
          padding-bottom: 2rem;
          border-bottom: 2px solid currentColor;
          margin-bottom: 2rem;
        }
        
        .marca-temporal {
          font-family: 'Space Mono', monospace;
          font-size: 0.65rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          opacity: 0.5;
        }
        
        .fecha {
          display: block;
        }
        
        .hora {
          display: block;
          margin-top: 0.25rem;
          font-size: 1.5rem;
          letter-spacing: 0.05em;
          opacity: 1;
        }
        
        .periodico__titulo {
          text-align: center;
          margin: 0;
        }
        
        .titulo-linea {
          display: block;
          font-family: 'Instrument Serif', serif;
          font-size: clamp(2rem, 8vw, 4rem);
          font-weight: 400;
          letter-spacing: -0.03em;
          line-height: 1;
        }
        
        .titulo-subtitulo {
          display: block;
          font-family: 'Space Mono', monospace;
          font-size: 0.6rem;
          text-transform: uppercase;
          letter-spacing: 0.3em;
          margin-top: 0.5rem;
          opacity: 0.4;
        }
        
        .estado-lectura {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 0.5rem;
          font-family: 'Space Mono', monospace;
          font-size: 0.6rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          opacity: 0.5;
        }
        
        .estado-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #00c853;
          animation: pulso-estado calc(2s / var(--ritmo)) ease-in-out infinite;
        }

        .estado-simbolo {
          font-size: 0.9rem;
          line-height: 1;
          opacity: 0.25;
          transform: translateY(-1px);
        }
        
        @keyframes pulso-estado {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
        }
        
        /* ═══════════════════════════════════════════
           CONTENIDO
           ═══════════════════════════════════════════ */
        
        .periodico__contenido {
          max-width: 800px;
          margin: 0 auto;
        }

        .convocatoria {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          margin: 2rem 0 0;
          opacity: 0.6;
        }

        .convocatoria__linea {
          height: 1px;
          width: 100%;
          background: currentColor;
          opacity: 0.2;
        }

        .convocatoria__pista {
          font-family: 'Space Mono', monospace;
          font-size: 0.65rem;
          text-transform: uppercase;
          letter-spacing: 0.12em;
        }

        .flash-edicion {
          position: fixed;
          left: 1.25rem;
          bottom: 1.25rem;
          display: inline-flex;
          align-items: center;
          gap: 0.6rem;
          padding: 0.7rem 0.9rem;
          border: 1px solid rgba(255, 255, 255, 0.12);
          background: rgba(0, 0, 0, 0.35);
          backdrop-filter: blur(10px);
          color: rgba(255, 255, 255, 0.85);
        }

        .flash-edicion__marca {
          font-family: 'Space Mono', monospace;
          font-size: 0.6rem;
          text-transform: uppercase;
          letter-spacing: 0.2em;
          opacity: 0.9;
        }

        .flash-edicion__pulso {
          width: 8px;
          height: 8px;
          border-radius: 999px;
          background: #ff2d00;
          animation: pulso-flash calc(1.2s / var(--ritmo)) ease-in-out infinite;
        }

        @keyframes pulso-flash {
          0%, 100% { transform: scale(1); opacity: 0.4; }
          50% { transform: scale(1.6); opacity: 1; }
        }

        .overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.55);
          display: grid;
          place-items: center;
          padding: 2rem;
          z-index: 50;
        }

        .overlay__panel {
          width: min(820px, 100%);
          border: 1px solid rgba(255, 255, 255, 0.16);
          background: rgba(10, 10, 10, 0.72);
          backdrop-filter: blur(14px);
          padding: 1.5rem 1.5rem 1rem;
          color: rgba(255, 255, 255, 0.92);
          animation: entrar-overlay 0.35s ease forwards;
        }

        @keyframes entrar-overlay {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .overlay__cabecera {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
          margin-bottom: 1rem;
        }

        .overlay__meta {
          display: inline-flex;
          align-items: center;
          gap: 0.6rem;
          font-family: 'Space Mono', monospace;
          font-size: 0.65rem;
          text-transform: uppercase;
          letter-spacing: 0.12em;
          opacity: 0.75;
        }

        .overlay__dot {
          width: 8px;
          height: 8px;
          border-radius: 999px;
          background: color-mix(in oklch, #ff2d00, #ffffff 10%);
          opacity: 0.9;
        }

        .overlay__cerrar {
          border: 1px solid rgba(255, 255, 255, 0.22);
          background: transparent;
          color: inherit;
          width: 2.25rem;
          height: 2.25rem;
          cursor: pointer;
          font-size: 1.25rem;
          line-height: 1;
          display: grid;
          place-items: center;
          transition: background 0.2s ease, border-color 0.2s ease;
        }

        .overlay__cerrar:hover {
          background: rgba(255, 255, 255, 0.08);
          border-color: rgba(255, 255, 255, 0.35);
        }

        .overlay__titulo {
          font-family: 'Instrument Serif', serif;
          font-size: clamp(1.75rem, 4vw, 2.25rem);
          font-weight: 400;
          letter-spacing: -0.03em;
          line-height: 1.1;
          margin: 0;
        }
        
        .sin-noticias {
          text-align: center;
          padding: 4rem 2rem;
        }
        
        .sin-noticias p {
          font-family: 'Instrument Serif', serif;
          font-size: 1.5rem;
          font-style: italic;
          margin: 0;
          opacity: 0.4;
        }
        
        .sin-noticias .sub {
          font-family: 'Space Mono', monospace;
          font-size: 0.7rem;
          font-style: normal;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          margin-top: 1rem;
        }
      `}</style>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// DEMO
// ═══════════════════════════════════════════════════════════════

export const PeriodicoDemo = () => {
  const noticiasDemo = [
    {
      id: 1,
      titulo: 'La inteligencia artificial redefine qué significa crear software',
      urgencia: 0.9,
      antiguedad: 0
    },
    {
      id: 2,
      titulo: 'El código es output, no input: la nueva era del desarrollo',
      urgencia: 0.7,
      antiguedad: 2
    },
    {
      id: 3,
      titulo: 'Interfaces que se generan solas: de la estática a lo generativo',
      urgencia: 0.5,
      antiguedad: 5
    },
    {
      id: 4,
      titulo: 'El silencio como feature: cuando el software decide no mostrarte nada',
      urgencia: 0.3,
      antiguedad: 12
    }
  ];

  return <PeriodicoVivo noticias={noticiasDemo} />;
};

export default PeriodicoVivo;
