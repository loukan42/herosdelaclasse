import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CollectionCard } from '@/hooks/useCollection';
import cardSingleImage from '@/assets/cards/card-single.png';
import cardBoosterImage from '@/assets/cards/card-booster.png';

interface CardOpenAnimationProps {
  isOpen: boolean;
  isBooster: boolean;
  onOpen: () => Promise<CollectionCard | null | CollectionCard[]>;
  onComplete: () => void;
}

export function CardOpenAnimation({ isOpen, isBooster, onOpen, onComplete }: CardOpenAnimationProps) {
  const [phase, setPhase] = useState<'idle' | 'zoom' | 'shake' | 'open' | 'reveal'>('idle');
  const [result, setResult] = useState<CollectionCard | null>(null);
  const [boosterResults, setBoosterResults] = useState<CollectionCard[]>([]);
  const isAnimatingRef = useRef(false);
  const onOpenRef = useRef(onOpen);
  
  // Keep onOpen ref updated without triggering useEffect
  useEffect(() => {
    onOpenRef.current = onOpen;
  }, [onOpen]);

  useEffect(() => {
    if (!isOpen) {
      // Reset state when modal closes
      setPhase('idle');
      setResult(null);
      setBoosterResults([]);
      isAnimatingRef.current = false;
      return;
    }

    // Prevent double execution
    if (isAnimatingRef.current) return;
    isAnimatingRef.current = true;

    const runAnimation = async () => {
      try {
        // Phase 1: Zoom in
        setPhase('zoom');
        await new Promise(r => setTimeout(r, 600));

        // Phase 2: Shake/vibrate
        setPhase('shake');
        await new Promise(r => setTimeout(r, 800));

        // Phase 3: Open (call the actual function)
        setPhase('open');
        const cards = await onOpenRef.current();
        
        if (isBooster && Array.isArray(cards)) {
          setBoosterResults(cards);
        } else if (cards && !Array.isArray(cards)) {
          setResult(cards);
        }

        await new Promise(r => setTimeout(r, 400));

        // Phase 4: Reveal
        setPhase('reveal');
      } catch (error) {
        console.error('Animation error:', error);
        isAnimatingRef.current = false;
      }
    };

    runAnimation();
  }, [isOpen, isBooster]); // Removed onOpen from dependencies

  const cardImage = isBooster ? cardBoosterImage : cardSingleImage;

  return (
    <AnimatePresence>
      {isOpen && phase !== 'idle' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md"
          onClick={() => phase === 'reveal' && onComplete()}
        >
          {/* Card/Booster zoom and shake animation */}
          {phase !== 'reveal' && (
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={
                phase === 'zoom' ? { scale: 1.2, opacity: 1, rotate: 0 } :
                phase === 'shake' ? { 
                  scale: 1.3, 
                  opacity: 1,
                  rotate: [0, -3, 3, -3, 3, -2, 2, 0],
                  x: [0, -5, 5, -5, 5, -3, 3, 0]
                } :
                { scale: 1.5, opacity: 1, rotate: 0 }
              }
              transition={
                phase === 'zoom' ? { duration: 0.6, ease: 'easeOut' } :
                phase === 'shake' ? { duration: 0.8, ease: 'easeInOut', times: [0, 0.1, 0.2, 0.3, 0.4, 0.6, 0.8, 1] } :
                { duration: 0.3, ease: 'easeOut' }
              }
              className="relative"
            >
              <img 
                src={cardImage} 
                alt={isBooster ? "Pack Booster" : "Carte Simple"} 
                className="w-48 sm:w-64 md:w-72 h-auto drop-shadow-2xl"
              />
              
              {/* Glow effect during shake */}
              {phase === 'shake' && (
                <motion.div
                  className="absolute inset-0 rounded-2xl pointer-events-none"
                  animate={{
                    boxShadow: [
                      '0 0 30px rgba(251, 191, 36, 0.5)',
                      '0 0 60px rgba(251, 191, 36, 0.8)',
                      '0 0 30px rgba(251, 191, 36, 0.5)',
                    ]
                  }}
                  transition={{ duration: 0.3, repeat: Infinity }}
                />
              )}

              {/* Burst effect when opening */}
              {phase === 'open' && (
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 3, opacity: [0, 0.8, 0] }}
                  transition={{ duration: 0.5 }}
                  className="absolute inset-0 bg-gradient-radial from-amber-400/60 to-transparent rounded-full"
                />
              )}
            </motion.div>
          )}

          {/* Reveal - Single card */}
          {phase === 'reveal' && result && !isBooster && (
            <motion.div
              initial={{ scale: 0, rotateY: 180 }}
              animate={{ scale: 1, rotateY: 0 }}
              transition={{ duration: 0.6, type: 'spring', damping: 15 }}
              className="text-center"
              onClick={(e) => e.stopPropagation()}
            >
              <motion.h3
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="font-display text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-6 drop-shadow-lg"
              >
                🎉 Nouvelle carte !
              </motion.h3>
              
              <div className="relative inline-block">
                <div className="bg-gradient-to-br from-amber-200 via-amber-100 to-amber-300 p-2 sm:p-3 rounded-2xl shadow-[0_8px_30px_rgba(217,164,50,0.5)]">
                  <div className="rounded-xl overflow-hidden bg-card">
                    <div className="aspect-[3/4] w-48 sm:w-64 md:w-72 relative">
                      <img
                        src={result.image_url}
                        alt={result.title}
                        className="w-full h-full object-contain bg-gradient-to-br from-slate-100 to-slate-50"
                      />
                      {/* Shine effect */}
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/40 to-transparent pointer-events-none"
                        initial={{ x: "-100%" }}
                        animate={{ x: "200%" }}
                        transition={{ duration: 1.5, ease: "easeInOut", delay: 0.5 }}
                      />
                    </div>
                  </div>
                </div>
                
                {/* Glow */}
                <motion.div
                  className="absolute inset-0 rounded-2xl pointer-events-none"
                  animate={{
                    boxShadow: [
                      '0 0 20px rgba(251, 191, 36, 0.4)',
                      '0 0 40px rgba(251, 191, 36, 0.7)',
                      '0 0 20px rgba(251, 191, 36, 0.4)',
                    ]
                  }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
              </div>
              
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mt-4 text-lg sm:text-xl font-bold text-white drop-shadow-md"
              >
                {result.title}
              </motion.p>
              
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="mt-4 text-white/60 text-sm"
              >
                Cliquez pour fermer
              </motion.p>
            </motion.div>
          )}

          {/* Reveal - Booster pack */}
          {phase === 'reveal' && boosterResults.length > 0 && isBooster && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="w-full max-w-4xl px-4"
              onClick={(e) => e.stopPropagation()}
            >
              <motion.h3
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="font-display text-2xl sm:text-3xl md:text-4xl font-bold text-center text-white mb-6 sm:mb-8 drop-shadow-lg"
              >
                🎉 Pack Booster ouvert !
              </motion.h3>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 sm:gap-4 md:gap-6 mb-6">
                {boosterResults.map((card, index) => (
                  <motion.div
                    key={card.id}
                    initial={{ rotateY: 180, opacity: 0, scale: 0.5, y: 50 }}
                    animate={{ rotateY: 0, opacity: 1, scale: 1, y: 0 }}
                    transition={{ delay: index * 0.15, duration: 0.5, type: 'spring' }}
                    className="flex flex-col items-center"
                  >
                    <div className="relative bg-gradient-to-br from-amber-200 via-amber-100 to-amber-300 p-1.5 sm:p-2 rounded-xl sm:rounded-2xl shadow-[0_8px_30px_rgba(217,164,50,0.5)]">
                      <div className="rounded-lg sm:rounded-xl overflow-hidden bg-card">
                        <div className="aspect-[3/4] relative">
                          <img
                            src={card.image_url}
                            alt={card.title}
                            className="w-full h-full object-contain bg-gradient-to-br from-slate-100 to-slate-50"
                          />
                          <motion.div
                            className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/40 to-transparent pointer-events-none"
                            initial={{ x: "-100%" }}
                            animate={{ x: "200%" }}
                            transition={{ duration: 1.5, ease: "easeInOut", delay: 0.3 + index * 0.15 }}
                          />
                        </div>
                      </div>
                      <motion.div
                        className="absolute inset-0 rounded-xl sm:rounded-2xl pointer-events-none"
                        animate={{
                          boxShadow: [
                            '0 0 15px rgba(251, 191, 36, 0.4)',
                            '0 0 25px rgba(251, 191, 36, 0.7)',
                            '0 0 15px rgba(251, 191, 36, 0.4)',
                          ]
                        }}
                        transition={{ duration: 1.5, repeat: Infinity, delay: index * 0.2 }}
                      />
                    </div>
                    
                    <p className="mt-2 sm:mt-3 text-xs sm:text-sm md:text-base font-medium text-white text-center line-clamp-2 drop-shadow-md">
                      {card.title}
                    </p>
                  </motion.div>
                ))}
              </div>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="text-center text-white/60 text-sm"
              >
                Cliquez n'importe où pour fermer
              </motion.p>
            </motion.div>
          )}

          {/* Fallback message if no cards were obtained */}
          {phase === 'reveal' && !result && boosterResults.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="font-display text-2xl font-bold text-white mb-4">
                Aucune nouvelle carte
              </h3>
              <p className="text-white/60">
                Toutes les cartes ont déjà été collectionnées !
              </p>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mt-4 text-white/60 text-sm"
              >
                Cliquez pour fermer
              </motion.p>
            </motion.div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
