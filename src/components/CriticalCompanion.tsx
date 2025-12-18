'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

type Mood = 'idle' | 'alert' | 'curious' | 'sleeping';

interface CriticalCompanionProps {
  initialMood?: Mood;
  onInteract?: () => void;
}

export default function CriticalCompanion({ 
  initialMood = 'idle',
  onInteract 
}: CriticalCompanionProps) {
  const [mood, setMood] = useState<Mood>(initialMood);
  const [isVisible, setIsVisible] = useState(true);
  const [isInteracting, setIsInteracting] = useState(false);

  // Randomly change mood when idle
  useEffect(() => {
    if (mood !== 'sleeping') {
      const moodTimer = setTimeout(() => {
        const moods: Mood[] = ['idle', 'alert', 'curious'];
        const randomMood = moods[Math.floor(Math.random() * moods.length)];
        setMood(randomMood);
      }, 5000 + Math.random() * 10000);

      return () => clearTimeout(moodTimer);
    }
  }, [mood]);

  // Randomly go to sleep
  useEffect(() => {
    const sleepTimer = setTimeout(() => {
      if (Math.random() > 0.7) {
        setMood('sleeping');
        setTimeout(() => {
          setMood('idle');
        }, 3000 + Math.random() * 5000);
      }
    }, 10000 + Math.random() * 20000);

    return () => clearTimeout(sleepTimer);
  }, [mood]);

  const states = {
    idle: { 
      scale: 0.9, 
      opacity: 0.4,
      borderRadius: '50%',
      width: '1.5rem',
      height: '1.5rem',
    },
    curious: { 
      scale: 1.1, 
      opacity: 0.8,
      borderRadius: '1rem',
      width: '2.5rem',
      height: '1.5rem',
    },
    alert: { 
      scale: 1.3, 
      opacity: 1,
      borderRadius: '0.5rem',
      width: '1.5rem',
      height: '2.5rem',
    },
    sleeping: {
      scale: 0.8,
      opacity: 0.2,
      borderRadius: '50%',
      width: '1.2rem',
      height: '1.2rem',
    }
  };

  const handleInteraction = () => {
    if (isInteracting || mood === 'sleeping') return;
    
    setIsInteracting(true);
    setMood('alert');
    onInteract?.();
    
    setTimeout(() => {
      setMood('idle');
      setTimeout(() => setIsInteracting(false), 1000);
    }, 1000);
  };

  return (
    <div className="fixed right-4 top-1/2 -translate-y-1/2 z-50">
      <AnimatePresence>
        {isVisible && (
          <motion.div
            className={`
              cursor-pointer select-none
              ${mood === 'sleeping' ? 'text-gray-400' : 'text-white'}
              flex items-center justify-center
            `}
            onClick={handleInteraction}
            whileHover={mood !== 'sleeping' ? { scale: 1.2 } : {}}
            whileTap={mood !== 'sleeping' ? { scale: 0.9 } : {}}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          >
            <motion.div
              className={`
                bg-white/80 backdrop-blur-md shadow-lg
                flex items-center justify-center
                font-sans font-medium text-xs
              `}
              animate={states[mood]}
              transition={{ 
                type: 'spring', 
                stiffness: 500, 
                damping: 30,
                restDelta: 0.001
              }}
            >
              {mood === 'sleeping' ? '💤' : 
               mood === 'alert' ? '👁️' : 
               mood === 'curious' ? '👀' : '●'}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
