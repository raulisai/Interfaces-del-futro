'use client';

import { useState } from 'react';
import CriticalCompanion from '@/components/CriticalCompanion';

export default function Home() {
  const [messages, setMessages] = useState<string[]>([]);
  const [showCompanion, setShowCompanion] = useState(true);

  const handleCompanionInteract = () => {
    const interactions = [
      '¡Hola! Soy tu mascota crítica.',
      '¿Neitas ayuda con algo?',
      'Observo y decido cuándo hablar.',
      'A veces solo miro...',
      '¿Qué estás haciendo?',
      '¡Interesante!',
      '...',
    ];
    
    const randomMessage = interactions[Math.floor(Math.random() * interactions.length)];
    setMessages(prev => [randomMessage, ...prev].slice(0, 5));
  };

  return (
    <main className="min-h-screen p-8 bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 font-sohne">Mascota Crítica</h1>
        <p className="mb-6 text-gray-300">
          Un componente de interfaz que observa y decide cuándo interactuar.
          Prueba a hacer clic en la mascota para ver cómo reacciona.
        </p>
        
        <div className="mb-8 p-6 bg-gray-800/50 rounded-lg border border-gray-700">
          <h2 className="text-xl font-semibold mb-4">Mensajes de la mascota:</h2>
          <div className="space-y-2">
            {messages.length > 0 ? (
              messages.map((msg, i) => (
                <div key={i} className="p-3 bg-gray-700/50 rounded">
                  {msg}
                </div>
              ))
            ) : (
              <p className="text-gray-400 italic">La mascota aún no ha dicho nada...</p>
            )}
          </div>
        </div>

        <div className="flex gap-4">
          <button
            onClick={() => setShowCompanion(!showCompanion)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded transition-colors"
          >
            {showCompanion ? 'Ocultar Mascota' : 'Mostrar Mascota'}
          </button>
        </div>
      </div>

      {showCompanion && <CriticalCompanion onInteract={handleCompanionInteract} />}
    </main>
  );
}
