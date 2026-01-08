import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Clock, X } from 'lucide-react';
import { SpinWheel } from './SpinWheel';
import { CollectionCard } from '@/hooks/useCollection';
import cardSingleImage from '@/assets/cards/card-single.png';
import cardBoosterImage from '@/assets/cards/card-booster.png';

interface WheelOptionsProps {
  points: number;
  canSpin: boolean;
  timeUntilSpin: { hours: number; minutes: number } | null;
  onSingleSpin: () => Promise<CollectionCard | null>;
  onBoosterSpin: () => Promise<CollectionCard[]>;
  lockedCardsCount: number;
}

type WheelMode = 'single' | 'booster' | null;

export function WheelOptions({
  points,
  canSpin,
  timeUntilSpin,
  onSingleSpin,
  onBoosterSpin,
  lockedCardsCount
}: WheelOptionsProps) {
  const [activeWheel, setActiveWheel] = useState<WheelMode>(null);
  const [boosterResults, setBoosterResults] = useState<CollectionCard[]>([]);
  const [showBoosterModal, setShowBoosterModal] = useState(false);

  const SINGLE_COST = 1;
  const BOOSTER_COST = 10;
  const BOOSTER_CARDS = 5;

  const canAffordSingle = points >= SINGLE_COST;
  const canAffordBooster = points >= BOOSTER_COST;
  const hasEnoughCardsForBooster = lockedCardsCount >= BOOSTER_CARDS;

  const handleBoosterSpin = async () => {
    const cards = await onBoosterSpin();
    if (cards.length > 0) {
      setBoosterResults(cards);
      setShowBoosterModal(true);
    }
    return cards.length > 0 ? cards[0] : null;
  };

  return (
    <div className="w-full">
      {/* Timer display when cooldown is active */}
      {!canSpin && timeUntilSpin && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-center gap-2 text-muted-foreground bg-background/60 rounded-xl px-4 py-3 mb-6 border border-border/50"
        >
          <Clock className="w-5 h-5 text-amber-500" />
          <span className="font-medium">
            Prochain tour dans <span className="text-foreground font-bold">{timeUntilSpin.hours}h {timeUntilSpin.minutes}min</span>
          </span>
        </motion.div>
      )}

      {/* Wheel Options - Show when no wheel is active */}
      {activeWheel === null && (
        <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto">
          {/* Single Card Option */}
          <motion.button
            onClick={() => canSpin && canAffordSingle && setActiveWheel('single')}
            disabled={!canSpin || !canAffordSingle}
            className={`
              relative flex flex-col items-center transition-all duration-300
              ${canSpin && canAffordSingle 
                ? 'cursor-pointer' 
                : 'cursor-not-allowed opacity-60'
              }
            `}
            whileHover={canSpin && canAffordSingle ? { scale: 1.05, y: -4 } : {}}
            whileTap={canSpin && canAffordSingle ? { scale: 0.98 } : {}}
          >
            <img 
              src={cardSingleImage} 
              alt="Carte Simple" 
              className="w-28 sm:w-32 h-auto drop-shadow-xl"
            />
            <div className="mt-3 text-center">
              <h3 className="font-display text-sm font-bold text-foreground mb-1">Carte Simple</h3>
              <div className={`
                inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold
                ${canAffordSingle ? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground'}
              `}>
                <Star className={`w-3 h-3 ${canAffordSingle ? 'fill-amber-400 text-amber-400' : ''}`} />
                <span>{SINGLE_COST} pt</span>
              </div>
            </div>
          </motion.button>

          {/* Booster Option */}
          <motion.button
            onClick={() => canSpin && canAffordBooster && hasEnoughCardsForBooster && setActiveWheel('booster')}
            disabled={!canSpin || !canAffordBooster || !hasEnoughCardsForBooster}
            className={`
              relative flex flex-col items-center transition-all duration-300
              ${canSpin && canAffordBooster && hasEnoughCardsForBooster
                ? 'cursor-pointer' 
                : 'cursor-not-allowed opacity-60'
              }
            `}
            whileHover={canSpin && canAffordBooster && hasEnoughCardsForBooster ? { scale: 1.05, y: -4 } : {}}
            whileTap={canSpin && canAffordBooster && hasEnoughCardsForBooster ? { scale: 0.98 } : {}}
          >
            {/* Premium badge */}
            <div className="absolute -top-1 -right-1 z-10">
              <span className="px-2 py-0.5 bg-gradient-to-r from-amber-500 to-red-500 text-white text-[10px] font-bold rounded-full shadow-lg border border-white/30">
                x5
              </span>
            </div>
            
            <img 
              src={cardBoosterImage} 
              alt="Pack Booster" 
              className="w-28 sm:w-32 h-auto drop-shadow-xl"
            />
            
            <div className="mt-3 text-center">
              <h3 className="font-display text-sm font-bold text-foreground mb-1">Pack Booster</h3>
              <div className={`
                inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold
                ${canAffordBooster ? 'bg-amber-500/20 text-amber-600' : 'bg-muted text-muted-foreground'}
              `}>
                <Star className={`w-3 h-3 ${canAffordBooster ? 'fill-amber-400 text-amber-400' : ''}`} />
                <span>{BOOSTER_COST} pts</span>
              </div>
            </div>

            {!hasEnoughCardsForBooster && lockedCardsCount > 0 && (
              <div className="absolute inset-0 bg-background/80 rounded-xl flex items-center justify-center backdrop-blur-sm">
                <p className="text-muted-foreground text-xs px-2 text-center font-medium">
                  Plus assez de cartes
                </p>
              </div>
            )}
          </motion.button>
        </div>
      )}

      {/* Active Wheel View */}
      <AnimatePresence mode="wait">
        {activeWheel !== null && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="flex flex-col items-center"
          >
            {/* Back button and wheel info */}
            <div className="w-full flex items-center justify-between mb-6">
              <button
                onClick={() => setActiveWheel(null)}
                className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-4 h-4" />
                <span className="text-sm">Annuler</span>
              </button>
              
              <div className={`
                inline-flex items-center gap-2 px-4 py-2 rounded-xl font-bold
                ${activeWheel === 'single' 
                  ? 'bg-primary/10 text-primary' 
                  : 'bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-600'
                }
              `}>
                {activeWheel === 'single' ? (
                  <>
                    <Star className="w-4 h-4 fill-primary" />
                    <span>1 carte • {SINGLE_COST} pt</span>
                  </>
                ) : (
                  <>
                    <Star className="w-4 h-4 fill-amber-500" />
                    <span>5 cartes • {BOOSTER_COST} pts</span>
                  </>
                )}
              </div>
            </div>

            {/* The wheel */}
            <SpinWheel
              onSpin={activeWheel === 'single' ? onSingleSpin : handleBoosterSpin}
              canSpin={true}
              disabled={false}
              isBooster={activeWheel === 'booster'}
              onComplete={() => setActiveWheel(null)}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Booster Results Modal */}
      <AnimatePresence>
        {showBoosterModal && boosterResults.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4"
            onClick={() => setShowBoosterModal(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: 'spring', damping: 15 }}
              className="w-full max-w-4xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Title */}
              <motion.h3 
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="font-display text-2xl sm:text-3xl md:text-4xl font-bold text-center text-white mb-6 sm:mb-8 drop-shadow-lg"
              >
                🎉 Pack Booster ouvert !
              </motion.h3>
              
              {/* Cards Grid - responsive layout */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 sm:gap-4 md:gap-6 mb-6">
                {boosterResults.map((card, index) => (
                  <motion.div
                    key={card.id}
                    initial={{ rotateY: 180, opacity: 0, scale: 0.8 }}
                    animate={{ rotateY: 0, opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.15, duration: 0.5, type: 'spring' }}
                    className="flex flex-col items-center"
                  >
                    {/* Card Frame */}
                    <div className="relative bg-gradient-to-br from-amber-200 via-amber-100 to-amber-300 p-1.5 sm:p-2 rounded-xl sm:rounded-2xl shadow-[0_8px_30px_rgba(217,164,50,0.5),0_4px_10px_rgba(0,0,0,0.2)]">
                      <div className="rounded-lg sm:rounded-xl overflow-hidden bg-card">
                        <div className="aspect-[3/4] relative">
                          <img
                            src={card.image_url}
                            alt={card.title}
                            className="w-full h-full object-contain bg-gradient-to-br from-slate-100 to-slate-50"
                          />
                          {/* Shine effect */}
                          <motion.div
                            className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/40 to-transparent pointer-events-none"
                            initial={{ x: "-100%" }}
                            animate={{ x: "200%" }}
                            transition={{ 
                              duration: 1.5, 
                              ease: "easeInOut",
                              delay: 0.3 + index * 0.15
                            }}
                          />
                        </div>
                      </div>
                      {/* Glow effect */}
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
                    
                    {/* Card Title */}
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
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}