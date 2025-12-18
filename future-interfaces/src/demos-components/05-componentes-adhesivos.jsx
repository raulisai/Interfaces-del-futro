"use client";

/**
 * COMPONENTES ADHESIVOS
 * ━━━━━━━━━━━━━━━━━━━━━━
 * 
 * Filosofía: "Las interfaces emergen cuando son necesarias"
 * - Se adhieren a los bordes de la pantalla
 * - Aparecen basados en contexto, no en clicks
 * - El espacio negativo es sagrado
 * - Inspirados en la Dynamic Island de Apple
 * 
 * Inspiración:
 * - Dynamic Island (Apple)
 * - Notch creativity
 * - Edge gestures
 * - Ambient computing
 */

import { useState, useEffect, useCallback, useRef } from 'react';

// ═══════════════════════════════════════════════════════════════
// COMPONENTE: Borde Activo
// Un borde de la pantalla que reacciona al contexto
// ═══════════════════════════════════════════════════════════════

const BordeActivo = ({
  lado = 'right', // top | right | bottom | left
  estado = 'dormido', // dormido | atento | activo | urgente
  contenido = null,
  ancho = 4, // pixels del borde activo
  onActivar,
  onDesactivar
}) => {
  const [hover, setHover] = useState(false);
  const [expandido, setExpandido] = useState(false);
  
  // Configuración visual por estado
  const colores = {
    dormido: 'rgba(0, 0, 0, 0.05)',
    atento: 'rgba(59, 130, 246, 0.3)',
    activo: 'rgba(16, 185, 129, 0.5)',
    urgente: 'rgba(239, 68, 68, 0.7)'
  };
  
  // Posición del borde
  const posiciones = {
    top: { top: 0, left: 0, right: 0, height: `${ancho}px` },
    right: { top: 0, right: 0, bottom: 0, width: `${ancho}px` },
    bottom: { bottom: 0, left: 0, right: 0, height: `${ancho}px` },
    left: { top: 0, left: 0, bottom: 0, width: `${ancho}px` }
  };
  
  // Detectar hover en el borde
  const handleMouseEnter = useCallback(() => {
    if (estado !== 'dormido') {
      setHover(true);
      onActivar?.();
    }
  }, [estado, onActivar]);
  
  const handleMouseLeave = useCallback(() => {
    setHover(false);
    setExpandido(false);
    onDesactivar?.();
  }, [onDesactivar]);
  
  const handleClick = useCallback(() => {
    if (contenido) {
      setExpandido(prev => !prev);
    }
  }, [contenido]);

  return (
    <>
      {/* El borde sensible */}
      <div
        className={`borde-activo borde--${lado} borde--${estado}`}
        style={{
          ...posiciones[lado],
          '--color-estado': colores[estado]
        }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
      >
        <div className="borde-indicador" />
      </div>
      
      {/* Panel expandido */}
      {expandido && contenido && (
        <div className={`borde-panel borde-panel--${lado}`}>
          {contenido}
        </div>
      )}

      <style jsx>{`
        .borde-activo {
          position: fixed;
          z-index: 9998;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        
        .borde-indicador {
          position: absolute;
          inset: 0;
          background: var(--color-estado);
          transition: all 0.3s ease;
        }
        
        /* Expansión en hover */
        .borde--right:hover .borde-indicador,
        .borde--left:hover .borde-indicador {
          transform: scaleX(3);
        }
        
        .borde--top:hover .borde-indicador,
        .borde--bottom:hover .borde-indicador {
          transform: scaleY(3);
        }
        
        .borde--right .borde-indicador { transform-origin: right; }
        .borde--left .borde-indicador { transform-origin: left; }
        .borde--top .borde-indicador { transform-origin: top; }
        .borde--bottom .borde-indicador { transform-origin: bottom; }
        
        /* Animación de urgencia */
        .borde--urgente .borde-indicador {
          animation: pulso-urgente 1s ease-in-out infinite;
        }
        
        @keyframes pulso-urgente {
          0%, 100% { opacity: 0.7; }
          50% { opacity: 1; }
        }
        
        /* Panel expandido */
        .borde-panel {
          position: fixed;
          z-index: 9999;
          background: rgba(255, 255, 255, 0.98);
          border: 1px solid rgba(0, 0, 0, 0.1);
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
          animation: aparecer-panel 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        
        .borde-panel--right {
          top: 50%;
          right: 1rem;
          transform: translateY(-50%);
          min-width: 250px;
        }
        
        .borde-panel--left {
          top: 50%;
          left: 1rem;
          transform: translateY(-50%);
          min-width: 250px;
        }
        
        .borde-panel--top {
          top: 1rem;
          left: 50%;
          transform: translateX(-50%);
        }
        
        .borde-panel--bottom {
          bottom: 1rem;
          left: 50%;
          transform: translateX(-50%);
        }
        
        @keyframes aparecer-panel {
          from {
            opacity: 0;
            scale: 0.95;
          }
          to {
            opacity: 1;
            scale: 1;
          }
        }
      `}</style>
    </>
  );
};

// ═══════════════════════════════════════════════════════════════
// COMPONENTE: Isla Dinámica
// Un elemento que emerge del centro-top de la pantalla
// ═══════════════════════════════════════════════════════════════

const IslaDinamica = ({
  activo = false,
  tipo = 'info', // info | proceso | alerta | llamada
  contenido = {},
  onClick
}) => {
  const [expandido, setExpandido] = useState(false);
  
  // Tamaños por estado
  const tamaños = {
    dormido: { width: '120px', height: '32px', borderRadius: '16px' },
    compacto: { width: '200px', height: '40px', borderRadius: '20px' },
    expandido: { width: '320px', height: 'auto', borderRadius: '24px' }
  };
  
  const estado = !activo ? 'dormido' : (expandido ? 'expandido' : 'compacto');
  
  return (
    <div 
      className={`isla-dinamica isla--${estado} isla--${tipo}`}
      style={tamaños[estado]}
      onClick={() => {
        if (activo) setExpandido(!expandido);
        onClick?.();
      }}
    >
      {/* Estado dormido: solo un punto */}
      {estado === 'dormido' && (
        <div className="isla-dormida">
          <span className="punto" />
        </div>
      )}
      
      {/* Estado compacto: información mínima */}
      {estado === 'compacto' && (
        <div className="isla-compacta">
          <span className="isla-icono">{contenido.icono || '●'}</span>
          <span className="isla-titulo">{contenido.titulo || 'Activo'}</span>
        </div>
      )}
      
      {/* Estado expandido: información completa */}
      {estado === 'expandido' && (
        <div className="isla-expandida">
          <div className="isla-header">
            <span className="isla-icono">{contenido.icono || '●'}</span>
            <span className="isla-titulo">{contenido.titulo || 'Información'}</span>
          </div>
          {contenido.descripcion && (
            <p className="isla-descripcion">{contenido.descripcion}</p>
          )}
          {contenido.acciones && (
            <div className="isla-acciones">
              {contenido.acciones.map((accion, i) => (
                <button 
                  key={i}
                  className="isla-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    accion.onClick?.();
                  }}
                >
                  {accion.texto}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=SF+Pro+Display:wght@400;500;600&display=swap');
        
        .isla-dinamica {
          --font-sistema: -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif;
          
          position: fixed;
          top: 1rem;
          left: 50%;
          transform: translateX(-50%);
          background: #0a0a0a;
          color: white;
          z-index: 10000;
          cursor: pointer;
          overflow: hidden;
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
          font-family: var(--font-sistema);
        }
        
        /* ═══════════════════════════════════════════
           ESTADOS
           ═══════════════════════════════════════════ */
        
        .isla-dormida {
          display: flex;
          align-items: center;
          justify-content: center;
          height: 100%;
        }
        
        .punto {
          width: 6px;
          height: 6px;
          background: rgba(255, 255, 255, 0.3);
          border-radius: 50%;
          animation: respirar-punto 3s ease-in-out infinite;
        }
        
        @keyframes respirar-punto {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(1.2); }
        }
        
        .isla-compacta {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          height: 100%;
          padding: 0 1rem;
        }
        
        .isla-icono {
          font-size: 0.875rem;
        }
        
        .isla-titulo {
          font-size: 0.8rem;
          font-weight: 500;
          letter-spacing: -0.01em;
        }
        
        .isla-expandida {
          padding: 1rem;
        }
        
        .isla-header {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 0.5rem;
        }
        
        .isla-expandida .isla-titulo {
          font-size: 0.9rem;
          font-weight: 600;
        }
        
        .isla-descripcion {
          font-size: 0.75rem;
          opacity: 0.7;
          margin: 0 0 0.75rem 0;
          line-height: 1.4;
        }
        
        .isla-acciones {
          display: flex;
          gap: 0.5rem;
        }
        
        .isla-btn {
          font-family: var(--font-sistema);
          font-size: 0.7rem;
          font-weight: 500;
          padding: 0.4rem 0.75rem;
          border-radius: 8px;
          border: none;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        
        .isla-btn:first-child {
          background: white;
          color: #0a0a0a;
        }
        
        .isla-btn:not(:first-child) {
          background: rgba(255, 255, 255, 0.1);
          color: white;
        }
        
        /* ═══════════════════════════════════════════
           TIPOS
           ═══════════════════════════════════════════ */
        
        .isla--alerta {
          background: linear-gradient(135deg, #dc2626, #b91c1c);
        }
        
        .isla--proceso .punto,
        .isla--proceso .isla-icono {
          animation: rotar 2s linear infinite;
        }
        
        @keyframes rotar {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        .isla--llamada {
          background: linear-gradient(135deg, #16a34a, #15803d);
        }
      `}</style>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// COMPONENTE: Esquina Contextual
// Una esquina que muestra información relevante
// ═══════════════════════════════════════════════════════════════

const EsquinaContextual = ({
  esquina = 'bottom-right', // top-left | top-right | bottom-left | bottom-right
  visible = true,
  contenido,
  estilo = 'minimal' // minimal | card | floating
}) => {
  const [expandido, setExpandido] = useState(false);
  
  if (!visible) return null;
  
  const posiciones = {
    'top-left': { top: '1rem', left: '1rem' },
    'top-right': { top: '1rem', right: '1rem' },
    'bottom-left': { bottom: '1rem', left: '1rem' },
    'bottom-right': { bottom: '1rem', right: '1rem' }
  };

  return (
    <div 
      className={`esquina-contextual esquina--${esquina} esquina--${estilo} ${expandido ? 'expandido' : ''}`}
      style={posiciones[esquina]}
      onClick={() => setExpandido(!expandido)}
    >
      {/* Línea decorativa que conecta con el borde */}
      <div className="esquina-linea" />
      
      {/* Contenido */}
      <div className="esquina-contenido">
        {typeof contenido === 'string' ? (
          <p className="esquina-texto">{contenido}</p>
        ) : (
          contenido
        )}
      </div>

      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Mono&display=swap');
        
        .esquina-contextual {
          --font-mono: 'Space Mono', monospace;
          
          position: fixed;
          z-index: 9990;
          display: flex;
          align-items: flex-end;
          gap: 0.5rem;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        
        /* Orientación según esquina */
        .esquina--top-left { flex-direction: row; align-items: flex-start; }
        .esquina--top-right { flex-direction: row-reverse; align-items: flex-start; }
        .esquina--bottom-left { flex-direction: row; }
        .esquina--bottom-right { flex-direction: row-reverse; }
        
        /* Línea decorativa */
        .esquina-linea {
          width: 30px;
          height: 2px;
          background: #0a0a0a;
          opacity: 0.2;
          transition: all 0.3s ease;
        }
        
        .esquina-contextual:hover .esquina-linea {
          width: 50px;
          opacity: 0.4;
        }
        
        /* Contenido */
        .esquina-contenido {
          font-family: var(--font-mono);
          font-size: 0.65rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          max-width: 150px;
          opacity: 0.5;
          transition: all 0.3s ease;
        }
        
        .esquina-contextual:hover .esquina-contenido {
          opacity: 0.8;
        }
        
        .esquina-texto {
          margin: 0;
          line-height: 1.4;
        }
        
        /* Estilos */
        .esquina--card .esquina-contenido {
          background: white;
          padding: 0.5rem 0.75rem;
          border: 1px solid rgba(0, 0, 0, 0.1);
          max-width: 200px;
        }
        
        .esquina--floating .esquina-contenido {
          background: #0a0a0a;
          color: white;
          padding: 0.5rem 0.75rem;
          border-radius: 4px;
        }
        
        /* Expandido */
        .expandido .esquina-contenido {
          max-width: 300px;
          opacity: 1;
        }
        
        .expandido .esquina-linea {
          width: 80px;
          opacity: 0.6;
        }
      `}</style>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// DEMO: Sistema completo de componentes adhesivos
// ═══════════════════════════════════════════════════════════════

export const ComponentesAdhesivosDemo = () => {
  const [islaActiva, setIslaActiva] = useState(false);
  const [estadoBorde, setEstadoBorde] = useState('dormido');
  const [hora, setHora] = useState(new Date());
  const [esquinaTexto, setEsquinaTexto] = useState('Estado: online');
  const [horaTexto, setHoraTexto] = useState('');
  const estadoRef = useRef({
    lastMove: performance.now(),
    lastX: 0,
    lastY: 0,
    lastT: performance.now(),
    lastActivity: performance.now(),
    edgeIntent: 0,
    islandCooldownUntil: 0,
  });
  const islandTimeoutRef = useRef(null);
  
  useEffect(() => {
    const interval = setInterval(() => setHora(new Date()), 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    setHoraTexto(
      hora.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
    );
  }, [hora]);

  useEffect(() => {
    const clamp01 = (n) => Math.max(0, Math.min(1, n));

    const setIslaTemporizada = (ms = 5000) => {
      setIslaActiva(true);
      if (islandTimeoutRef.current) clearTimeout(islandTimeoutRef.current);
      islandTimeoutRef.current = setTimeout(() => setIslaActiva(false), ms);
    };

    const onMove = (e) => {
      const now = performance.now();
      const w = window.innerWidth;
      const h = window.innerHeight;
      const x = e.clientX;
      const y = e.clientY;

      const dt = Math.max(16, now - estadoRef.current.lastT);
      const dx = x - estadoRef.current.lastX;
      const dy = y - estadoRef.current.lastY;
      const v = Math.sqrt(dx * dx + dy * dy) / dt;

      estadoRef.current.lastX = x;
      estadoRef.current.lastY = y;
      estadoRef.current.lastT = now;
      estadoRef.current.lastMove = now;
      estadoRef.current.lastActivity = now;

      const edge = Math.min(x, y, w - x, h - y);
      const near = edge < 24;
      const veryNear = edge < 10;

      if (near) estadoRef.current.edgeIntent = clamp01(estadoRef.current.edgeIntent + 0.12);
      else estadoRef.current.edgeIntent = clamp01(estadoRef.current.edgeIntent - 0.05);

      const intent = estadoRef.current.edgeIntent;
      const urgente = intent > 0.8 || (veryNear && v > 0.9);
      const activo = intent > 0.55 || v > 0.7;
      const atento = intent > 0.25 || v > 0.35;

      setEstadoBorde(urgente ? 'urgente' : activo ? 'activo' : atento ? 'atento' : 'dormido');

      const nowCooldown = estadoRef.current.islandCooldownUntil;
      if (now < nowCooldown) return;

      if (urgente) {
        estadoRef.current.islandCooldownUntil = now + 15000;
        setIslaTemporizada(7000);
        setEsquinaTexto('Borde: umbral crítico');
      } else if (veryNear && v > 0.8) {
        estadoRef.current.islandCooldownUntil = now + 12000;
        setIslaTemporizada(5000);
        setEsquinaTexto('Borde: intención detectada');
      }
    };

    const tick = setInterval(() => {
      const now = performance.now();
      const idleMs = now - estadoRef.current.lastActivity;
      if (idleMs > 9000) {
        estadoRef.current.edgeIntent = clamp01(estadoRef.current.edgeIntent - 0.1);
        setEstadoBorde('dormido');
        setEsquinaTexto('Estado: silencio');
      }
    }, 1200);

    window.addEventListener('mousemove', onMove);
    return () => {
      clearInterval(tick);
      window.removeEventListener('mousemove', onMove);
      if (islandTimeoutRef.current) clearTimeout(islandTimeoutRef.current);
      islandTimeoutRef.current = null;
    };
  }, []);

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: '#fafaf9',
      padding: '3rem'
    }}>
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        <h1 style={{ 
          fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
          fontSize: '2rem',
          fontWeight: 500,
          marginBottom: '0.5rem'
        }}>
          Componentes Adhesivos
        </h1>
        <p style={{ 
          fontFamily: 'Space Mono, monospace',
          fontSize: '0.7rem',
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
          opacity: 0.5,
          marginBottom: '3rem'
        }}>
          Interfaces que emergen de los bordes
        </p>
        
        <div style={{ 
          padding: '2rem',
          background: 'white',
          border: '1px solid rgba(0,0,0,0.1)',
          marginBottom: '2rem'
        }}>
          <p style={{ 
            fontFamily: 'Georgia, serif',
            fontSize: '1.125rem',
            lineHeight: 1.6,
            margin: 0
          }}>
            Observa los bordes de la pantalla. Los componentes emergen 
            cuando tienen algo que comunicar. El borde derecho cambia 
            de estado. La isla superior aparece con notificaciones.
            Las esquinas muestran información contextual.
          </p>
        </div>
        
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button
            onClick={() => setIslaActiva(!islaActiva)}
            style={{
              fontFamily: 'Space Mono, monospace',
              fontSize: '0.7rem',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              padding: '0.5rem 1rem',
              background: 'transparent',
              border: '1px solid currentColor',
              cursor: 'pointer'
            }}
          >
            {islaActiva ? 'Desactivar isla' : 'Activar isla'}
          </button>
          
          <button
            onClick={() => {
              const estados = ['dormido', 'atento', 'activo', 'urgente'];
              const actual = estados.indexOf(estadoBorde);
              setEstadoBorde(estados[(actual + 1) % estados.length]);
            }}
            style={{
              fontFamily: 'Space Mono, monospace',
              fontSize: '0.7rem',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              padding: '0.5rem 1rem',
              background: 'transparent',
              border: '1px solid currentColor',
              cursor: 'pointer'
            }}
          >
            Cambiar borde: {estadoBorde}
          </button>
        </div>
      </div>
      
      {/* Isla dinámica */}
      <IslaDinamica
        activo={islaActiva}
        tipo="info"
        contenido={{
          icono: '◆',
          titulo: 'Nuevo mensaje',
          descripcion: 'Tienes una notificación importante que requiere tu atención.',
          acciones: [
            { texto: 'Ver', onClick: () => console.log('Ver') },
            { texto: 'Ignorar', onClick: () => setIslaActiva(false) }
          ]
        }}
      />
      
      {/* Bordes activos */}
      <BordeActivo
        lado="right"
        estado={estadoBorde}
        contenido={
          <div style={{ padding: '1rem' }}>
            <p style={{ 
              fontFamily: 'Space Mono, monospace',
              fontSize: '0.7rem',
              margin: 0
            }}>
              Panel lateral expandido
            </p>
          </div>
        }
      />
      
      {/* Esquinas contextuales */}
      <EsquinaContextual
        esquina="bottom-left"
        contenido={esquinaTexto}
        estilo="minimal"
      />
      
      <EsquinaContextual
        esquina="top-right"
        contenido={horaTexto}
        estilo="floating"
      />
    </div>
  );
};

export default BordeActivo;
export { IslaDinamica, EsquinaContextual };
