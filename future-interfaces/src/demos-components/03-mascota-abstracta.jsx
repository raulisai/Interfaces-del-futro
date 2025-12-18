"use client";

/**
 * MASCOTA ABSTRACTA
 * ━━━━━━━━━━━━━━━━━━
 * 
 * Filosofía: "La forma sigue a la emoción"
 * - No es un personaje, es una presencia
 * - Comunica estado sin palabras ni cara
 * - Las líneas y formas son el lenguaje
 * 
 * Inspiración:
 * - Wassily Kandinsky (Composiciones)
 * - El Lissitzky (Beat the Whites with the Red Wedge)
 * - Suprematismo de Malevich
 * - Alexander Calder (móviles)
 * - Piet Mondrian (equilibrio dinámico)
 */

import { useState, useEffect, useMemo, useRef } from 'react';

// ═══════════════════════════════════════════════════════════════
// PRIMITIVAS: Formas básicas que expresan estados
// ═══════════════════════════════════════════════════════════════

// Línea que respira
const LineaVital = ({ 
  x1, y1, x2, y2, 
  pulso = 1, 
  color = 'currentColor',
  grosor = 2 
}) => (
  <line
    x1={x1} y1={y1} x2={x2} y2={y2}
    stroke={color}
    strokeWidth={grosor}
    strokeLinecap="round"
    style={{
      transformOrigin: `${(x1 + x2) / 2}px ${(y1 + y2) / 2}px`,
      animation: `respirar-linea ${2 / pulso}s ease-in-out infinite`
    }}
  />
);

// Círculo pulsante
const CirculoVital = ({ 
  cx, cy, r, 
  energia = 0.5,
  color = 'currentColor' 
}) => (
  <circle
    cx={cx} cy={cy} r={r}
    fill="none"
    stroke={color}
    strokeWidth={2}
    style={{
      transformOrigin: `${cx}px ${cy}px`,
      animation: `pulsar-circulo ${3 - energia * 2}s ease-in-out infinite`
    }}
  />
);

// ═══════════════════════════════════════════════════════════════
// COMPONENTE: Mascota Abstracta
// ═══════════════════════════════════════════════════════════════

const MascotaAbstracta = ({
  estado = 'neutral', // neutral | pensando | alerta | sereno | activo | error
  energia = 0.5,      // 0-1: nivel de actividad
  atencion = null,    // { x, y } punto de atención o null
  tamaño = 120,
  onClick
}) => {
  const svgRef = useRef(null);
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });
  
  // Centro del SVG
  const cx = tamaño / 2;
  const cy = tamaño / 2;
  
  // Configuración por estado
  const config = useMemo(() => ({
    neutral: {
      colorPrimario: '#1a1a1a',
      colorSecundario: '#666',
      formas: 'equilibrio',
      velocidad: 1
    },
    pensando: {
      colorPrimario: '#3b82f6',
      colorSecundario: '#93c5fd',
      formas: 'espiral',
      velocidad: 0.7
    },
    alerta: {
      colorPrimario: '#ef4444',
      colorSecundario: '#fca5a5',
      formas: 'expansion',
      velocidad: 2
    },
    sereno: {
      colorPrimario: '#10b981',
      colorSecundario: '#6ee7b7',
      formas: 'ondas',
      velocidad: 0.5
    },
    activo: {
      colorPrimario: '#f59e0b',
      colorSecundario: '#fcd34d',
      formas: 'rotacion',
      velocidad: 1.5
    },
    error: {
      colorPrimario: '#dc2626',
      colorSecundario: '#fecaca',
      formas: 'fragmentacion',
      velocidad: 2.5
    }
  }), []);
  
  const estiloActual = config[estado] || config.neutral;
  
  // Seguir el mouse sutilmente
  useEffect(() => {
    if (!svgRef.current || !atencion) return;
    
    const handleMove = (e) => {
      const rect = svgRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      setMousePos({ x: Math.max(0, Math.min(1, x)), y: Math.max(0, Math.min(1, y)) });
    };
    
    window.addEventListener('mousemove', handleMove);
    return () => window.removeEventListener('mousemove', handleMove);
  }, [atencion]);
  
  // Offset basado en atención
  const offsetX = atencion ? (mousePos.x - 0.5) * 10 : 0;
  const offsetY = atencion ? (mousePos.y - 0.5) * 10 : 0;

  // Renderizar formas según estado
  const renderFormas = () => {
    const { formas, colorPrimario, colorSecundario, velocidad } = estiloActual;
    
    switch (formas) {
      case 'equilibrio':
        // Estado neutral: formas balanceadas, quietas pero vivas
        return (
          <g className="formas-equilibrio">
            {/* Línea vertical central */}
            <line
              x1={cx + offsetX} y1={cy - 25}
              x2={cx + offsetX} y2={cy + 25}
              stroke={colorPrimario}
              strokeWidth={3}
              strokeLinecap="round"
            />
            {/* Dos puntos de equilibrio */}
            <circle cx={cx - 20 + offsetX} cy={cy + offsetY} r={4} fill={colorPrimario} />
            <circle cx={cx + 20 + offsetX} cy={cy + offsetY} r={4} fill={colorPrimario} />
          </g>
        );
        
      case 'espiral':
        // Pensando: espiral que gira lentamente
        return (
          <g className="formas-espiral">
            {[0, 1, 2].map(i => (
              <circle
                key={i}
                cx={cx + offsetX}
                cy={cy + offsetY}
                r={15 + i * 12}
                fill="none"
                stroke={i === 0 ? colorPrimario : colorSecundario}
                strokeWidth={2 - i * 0.5}
                strokeDasharray={`${10 + i * 5} ${5 + i * 3}`}
                style={{
                  transformOrigin: `${cx}px ${cy}px`,
                  animation: `rotar ${4 + i * 2}s linear infinite ${i % 2 === 0 ? '' : 'reverse'}`
                }}
              />
            ))}
            {/* Centro */}
            <circle cx={cx + offsetX} cy={cy + offsetY} r={3} fill={colorPrimario} />
          </g>
        );
        
      case 'expansion':
        // Alerta: círculos que se expanden como ondas de choque
        return (
          <g className="formas-expansion">
            {[0, 1, 2, 3].map(i => (
              <circle
                key={i}
                cx={cx}
                cy={cy}
                r={10}
                fill="none"
                stroke={colorPrimario}
                strokeWidth={2}
                opacity={0}
                style={{
                  animation: `expandir 1.5s ease-out infinite`,
                  animationDelay: `${i * 0.3}s`
                }}
              />
            ))}
            {/* Centro pulsante */}
            <circle
              cx={cx}
              cy={cy}
              r={8}
              fill={colorPrimario}
              style={{
                animation: `pulsar-alerta 0.5s ease-in-out infinite`
              }}
            />
          </g>
        );
        
      case 'ondas':
        // Sereno: ondas suaves horizontales
        return (
          <g className="formas-ondas">
            {[-15, 0, 15].map((offset, i) => (
              <path
                key={i}
                d={`M ${cx - 30} ${cy + offset} 
                    Q ${cx - 15} ${cy + offset - 8}, ${cx} ${cy + offset}
                    Q ${cx + 15} ${cy + offset + 8}, ${cx + 30} ${cy + offset}`}
                fill="none"
                stroke={i === 1 ? colorPrimario : colorSecundario}
                strokeWidth={i === 1 ? 3 : 2}
                strokeLinecap="round"
                style={{
                  animation: `ondular ${3 + i * 0.5}s ease-in-out infinite`,
                  animationDelay: `${i * 0.2}s`
                }}
              />
            ))}
          </g>
        );
        
      case 'rotacion':
        // Activo: formas que rotan con energía
        return (
          <g 
            className="formas-rotacion"
            style={{
              transformOrigin: `${cx}px ${cy}px`,
              animation: `rotar ${2 / energia}s linear infinite`
            }}
          >
            {[0, 90, 180, 270].map((angle, i) => (
              <line
                key={i}
                x1={cx}
                y1={cy}
                x2={cx + 25 * Math.cos(angle * Math.PI / 180)}
                y2={cy + 25 * Math.sin(angle * Math.PI / 180)}
                stroke={i % 2 === 0 ? colorPrimario : colorSecundario}
                strokeWidth={3}
                strokeLinecap="round"
              />
            ))}
            <circle cx={cx} cy={cy} r={5} fill={colorPrimario} />
          </g>
        );
        
      case 'fragmentacion':
        // Error: formas fragmentadas, caóticas
        return (
          <g className="formas-fragmentacion">
            {[
              { x: -15, y: -15, r: 12 },
              { x: 18, y: -10, r: 8 },
              { x: -10, y: 20, r: 10 },
              { x: 15, y: 15, r: 6 }
            ].map((frag, i) => (
              <rect
                key={i}
                x={cx + frag.x - frag.r / 2}
                y={cy + frag.y - frag.r / 2}
                width={frag.r}
                height={frag.r}
                fill="none"
                stroke={colorPrimario}
                strokeWidth={2}
                style={{
                  transformOrigin: `${cx + frag.x}px ${cy + frag.y}px`,
                  animation: `vibrar 0.1s linear infinite`,
                  animationDelay: `${i * 0.05}s`
                }}
              />
            ))}
          </g>
        );
        
      default:
        return null;
    }
  };

  return (
    <div 
      className="mascota-abstracta"
      onClick={onClick}
      style={{ '--energia': energia }}
    >
      <svg
        ref={svgRef}
        width={tamaño}
        height={tamaño}
        viewBox={`0 0 ${tamaño} ${tamaño}`}
        className="mascota-svg"
      >
        {renderFormas()}
      </svg>
      
      {/* Etiqueta de estado (solo si hay interacción) */}
      <span className="mascota-estado">{estado}</span>

      <style jsx>{`
        .mascota-abstracta {
          position: relative;
          display: inline-flex;
          flex-direction: column;
          align-items: center;
          cursor: pointer;
          transition: transform 0.3s ease;
        }
        
        .mascota-abstracta:hover {
          transform: scale(1.05);
        }
        
        .mascota-svg {
          display: block;
        }
        
        .mascota-estado {
          font-family: 'Space Mono', monospace;
          font-size: 0.55rem;
          text-transform: uppercase;
          letter-spacing: 0.15em;
          opacity: 0;
          transform: translateY(-5px);
          transition: all 0.3s ease;
          margin-top: 0.5rem;
          color: ${estiloActual.colorPrimario};
        }
        
        .mascota-abstracta:hover .mascota-estado {
          opacity: 0.6;
          transform: translateY(0);
        }
        
        /* ═══════════════════════════════════════════
           ANIMACIONES
           ═══════════════════════════════════════════ */
        
        @keyframes respirar-linea {
          0%, 100% { transform: scaleY(1); opacity: 1; }
          50% { transform: scaleY(0.95); opacity: 0.8; }
        }
        
        @keyframes pulsar-circulo {
          0%, 100% { transform: scale(1); opacity: 0.8; }
          50% { transform: scale(1.1); opacity: 1; }
        }
        
        @keyframes rotar {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes expandir {
          0% { 
            r: 10;
            opacity: 0.8;
          }
          100% { 
            r: 50;
            opacity: 0;
          }
        }
        
        @keyframes pulsar-alerta {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.2); }
        }
        
        @keyframes ondular {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-3px); }
        }
        
        @keyframes vibrar {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          25% { transform: translate(2px, -1px) rotate(1deg); }
          50% { transform: translate(-1px, 2px) rotate(-1deg); }
          75% { transform: translate(-2px, -1px) rotate(1deg); }
        }
      `}</style>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// COMPONENTE: Mascota que se pega al borde
// ═══════════════════════════════════════════════════════════════

const MascotaAdherida = ({
  posicion = 'bottom-right', // bottom-right | bottom-left | top-right | top-left | center-right | center-left
  estado = 'neutral',
  energia = 0.5,
  mensaje = null,
  autoDismissMs = 0,
  onDismiss
}) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (!autoDismissMs || !mensaje) return;
    const t = setTimeout(() => {
      setVisible(false);
      onDismiss?.();
    }, autoDismissMs);
    return () => clearTimeout(t);
  }, [autoDismissMs, mensaje, onDismiss]);
  
  const posicionStyles = {
    'bottom-right': { bottom: '1rem', right: '1rem' },
    'bottom-left': { bottom: '1rem', left: '1rem' },
    'top-right': { top: '1rem', right: '1rem' },
    'top-left': { top: '1rem', left: '1rem' },
    'center-right': { top: '50%', right: '1rem', transform: 'translateY(-50%)' },
    'center-left': { top: '50%', left: '1rem', transform: 'translateY(-50%)' }
  };

  if (!visible) return null;

  return (
    <div 
      className="mascota-adherida"
      style={posicionStyles[posicion]}
    >
      {mensaje && (
        <div className="mascota-mensaje">
          <p>{mensaje}</p>
          <button 
            className="btn-dismiss"
            onClick={() => {
              setVisible(false);
              onDismiss?.();
            }}
          >
            ×
          </button>
        </div>
      )}
      
      <MascotaAbstracta 
        estado={estado}
        energia={energia}
        tamaño={80}
      />

      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Mono&display=swap');
        
        .mascota-adherida {
          position: fixed;
          z-index: 9999;
          display: flex;
          align-items: flex-end;
          gap: 0.75rem;
          animation: aparecer-mascota 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        
        @keyframes aparecer-mascota {
          from {
            opacity: 0;
            transform: translateY(20px) scale(0.9);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        
        .mascota-mensaje {
          display: flex;
          align-items: flex-start;
          gap: 0.5rem;
          max-width: 250px;
          padding: 0.75rem 1rem;
          background: rgba(255, 255, 255, 0.95);
          border: 1px solid rgba(0, 0, 0, 0.1);
          border-radius: 8px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
          animation: aparecer-mensaje 0.3s ease forwards;
          animation-delay: 0.2s;
          opacity: 0;
        }
        
        @keyframes aparecer-mensaje {
          to { opacity: 1; }
        }
        
        .mascota-mensaje p {
          margin: 0;
          font-family: 'Space Mono', monospace;
          font-size: 0.75rem;
          line-height: 1.5;
          color: #1a1a1a;
        }
        
        .btn-dismiss {
          flex-shrink: 0;
          width: 18px;
          height: 18px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: transparent;
          border: none;
          font-size: 1rem;
          color: #999;
          cursor: pointer;
          border-radius: 50%;
          transition: all 0.2s ease;
        }
        
        .btn-dismiss:hover {
          background: rgba(0, 0, 0, 0.05);
          color: #333;
        }
      `}</style>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// DEMO
// ═══════════════════════════════════════════════════════════════

export const MascotaDemo = () => {
  const [estadoActual, setEstadoActual] = useState('neutral');
  const [energiaActual, setEnergiaActual] = useState(0.35);
  const [mensaje, setMensaje] = useState(null);
  const [mensajeKey, setMensajeKey] = useState(0);
  const ref = useRef({
    ultimaActividad: performance.now(),
    ultimoY: 0,
    ultimoT: performance.now(),
    densidad: 0,
  });

  useEffect(() => {
    const now = performance.now();
    ref.current.ultimaActividad = now;
    ref.current.ultimoT = now;
  }, []);

  useEffect(() => {
    const bump = (amount = 0.06) => {
      ref.current.ultimaActividad = performance.now();
      ref.current.densidad = Math.min(1, ref.current.densidad + amount);
    };

    const onMouseMove = () => bump(0.03);
    const onKeyDown = () => bump(0.08);
    const onScroll = () => {
      const now = performance.now();
      const y = window.scrollY;
      const dy = Math.abs(y - ref.current.ultimoY);
      const dt = Math.max(16, now - ref.current.ultimoT);
      const v = dy / dt;
      bump(Math.min(0.18, v * 0.7));
      ref.current.ultimoY = y;
      ref.current.ultimoT = now;
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('scroll', onScroll, { passive: true });

    const tick = setInterval(() => {
      const now = performance.now();
      const idleMs = now - ref.current.ultimaActividad;

      const decay = idleMs > 2500 ? 0.08 : 0.03;
      ref.current.densidad = Math.max(0, ref.current.densidad - decay);

      const d = ref.current.densidad;
      let estado = 'neutral';

      if (idleMs > 9000 && d < 0.12) estado = 'sereno';
      else if (d > 0.78) estado = 'alerta';
      else if (d > 0.55) estado = 'activo';
      else if (d > 0.28) estado = 'pensando';

      setEstadoActual(estado);
      setEnergiaActual(Math.max(0.15, Math.min(1, 0.2 + d * 0.95)));

      if (estado === 'neutral' || estado === 'sereno') return;
      if (idleMs < 900) return;

      const textos = {
        pensando: 'Te acompaño. No necesitas decidir todavía.',
        activo: 'Estás en movimiento. Que la forma te guíe.',
        alerta: 'Demasiada energía: reduce densidad. Elige una cosa.',
        error: 'Algo se fragmentó. Respira y reintenta.',
      };

      setMensaje((prev) => {
        const next = textos[estado] || null;
        if (!next || prev === next) return prev;
        setMensajeKey((k) => k + 1);
        return next;
      });
    }, 900);

    return () => {
      clearInterval(tick);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  useEffect(() => {
    if (!mensaje) return;
    const t = setTimeout(() => setMensaje(null), 14000);
    return () => clearTimeout(t);
  }, [mensajeKey]);
  
  return (
    <div style={{ 
      minHeight: '100vh', 
      background: '#fafafa',
      padding: '3rem',
      fontFamily: 'system-ui'
    }}>
      <h1 style={{ 
        fontFamily: 'Instrument Serif, serif',
        fontSize: '2rem',
        fontWeight: 400,
        marginBottom: '0.5rem'
      }}>
        Mascota Abstracta
      </h1>
      <p style={{ opacity: 0.5, marginBottom: '3rem' }}>
        Formas que comunican estado sin palabras ni cara.
      </p>

      <div style={{ maxWidth: '800px' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          marginBottom: '2rem',
          opacity: 0.6,
          fontFamily: 'Space Mono, monospace',
          fontSize: '0.7rem',
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
        }}>
          <span>Estado: {estadoActual}</span>
          <span>Energía: {(energiaActual * 100).toFixed(0)}%</span>
        </div>

        <div style={{
          display: 'grid',
          placeItems: 'center',
          border: '1px solid rgba(0,0,0,0.08)',
          padding: '3rem 2rem',
          background: 'white',
        }}>
          <MascotaAbstracta
            estado={estadoActual}
            energia={energiaActual}
            tamaño={180}
            atencion={{ x: 0.5, y: 0.5 }}
          />
        </div>

        <div style={{ marginTop: '1.5rem', opacity: 0.55, lineHeight: 1.6 }}>
          Prueba esto:
          <br />
          - Muévete rápido (mouse/scroll) y mira cómo cambia.
          <br />
          - Quédate quieto y deja que vuelva a “sereno”.
        </div>
      </div>
      
      {/* Mascota adherida */}
      {mensaje && (
        <MascotaAdherida
          key={mensajeKey}
        posicion="bottom-right"
        estado={estadoActual}
          energia={energiaActual}
          mensaje={mensaje}
          autoDismissMs={12000}
          onDismiss={() => setMensaje(null)}
        />
      )}
    </div>
  );
};

export default MascotaAbstracta;
export { MascotaAdherida };
