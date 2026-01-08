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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {/* Single Card Option */}
          <motion.button
            onClick={() => canSpin && canAffordSingle && setActiveWheel('single')}
            disabled={!canSpin || !canAffordSingle}
            className={`
              relative overflow-hidden rounded-2xl text-left transition-all duration-300
              ${canSpin && canAffordSingle 
                ? 'cursor-pointer hover:shadow-xl hover:-translate-y-1' 
                : 'cursor-not-allowed opacity-60'
              }
            `}
            whileHover={canSpin && canAffordSingle ? { scale: 1.02 } : {}}
            whileTap={canSpin && canAffordSingle ? { scale: 0.98 } : {}}
          >
            <div className="relative">
              <img 
                src={cardSingleImage} 
                alt="Carte Simple" 
                className="w-full h-auto rounded-2xl"
              />
              {/* Overlay with info */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent rounded-2xl flex flex-col justify-end p-4">
                <h3 className="font-display text-xl font-bold text-white mb-1">Carte Simple</h3>
                <p className="text-white/70 text-sm mb-3">
                  Débloquer 1 carte aléatoire
                </p>
                {/* Price badge */}
                <div className={`
                  inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-bold w-fit
                  ${canAffordSingle ? 'bg-amber-500 text-white' : 'bg-muted/80 text-muted-foreground'}
                `}>
                  <Star className={`w-4 h-4 ${canAffordSingle ? 'fill-white' : ''}`} />
                  <span>{SINGLE_COST} point</span>
                </div>
              </div>
            </div>
          </motion.button>

          {/* Booster Option */}
          <motion.button
            onClick={() => canSpin && canAffordBooster && hasEnoughCardsForBooster && setActiveWheel('booster')}
            disabled={!canSpin || !canAffordBooster || !hasEnoughCardsForBooster}
            className={`
              relative overflow-hidden rounded-2xl text-left transition-all duration-300
              ${canSpin && canAffordBooster && hasEnoughCardsForBooster
                ? 'cursor-pointer hover:shadow-xl hover:-translate-y-1' 
                : 'cursor-not-allowed opacity-60'
              }
            `}
            whileHover={canSpin && canAffordBooster && hasEnoughCardsForBooster ? { scale: 1.02 } : {}}
            whileTap={canSpin && canAffordBooster && hasEnoughCardsForBooster ? { scale: 0.98 } : {}}
          >
            <div className="relative">
              <img 
                src={cardBoosterImage} 
                alt="Pack Booster" 
                className="w-full h-auto rounded-2xl"
              />
              {/* Premium badge */}
              <div className="absolute top-3 right-3">
                <span className="px-2 py-0.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-bold rounded-full shadow-lg">
                  BOOSTER
                </span>
              </div>
              {/* Overlay with info */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent rounded-2xl flex flex-col justify-end p-4">
                <h3 className="font-display text-xl font-bold text-white mb-1">Pack Booster</h3>
                <p className="text-white/70 text-sm mb-3">
                  Débloquer 5 cartes d'un coup !
                </p>
                {/* Price badge */}
                <div className={`
                  inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-bold w-fit
                  ${canAffordBooster ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white' : 'bg-muted/80 text-muted-foreground'}
                `}>
                  <Star className={`w-4 h-4 ${canAffordBooster ? 'fill-white' : ''}`} />
                  <span>{BOOSTER_COST} points</span>
                </div>
              </div>

              {!hasEnoughCardsForBooster && lockedCardsCount > 0 && (
                <div className="absolute inset-0 bg-black/50 rounded-2xl flex items-center justify-center">
                  <p className="text-white text-sm px-4 text-center">
                    Plus assez de cartes ({lockedCardsCount} restante{lockedCardsCount > 1 ? 's' : ''})
                  </p>
                </div>
              )}
            </div>
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
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
            onClick={() => setShowBoosterModal(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: 'spring', damping: 15 }}
              className="bg-gradient-to-br from-amber-400 to-orange-500 p-1 rounded-3xl shadow-2xl max-w-lg w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="bg-background rounded-3xl p-6">
                <h3 className="font-display text-2xl font-bold text-center mb-6">
                  🎉 Pack Booster ouvert !
                </h3>
                
                <div className="grid grid-cols-5 gap-2 sm:gap-3 mb-6">
                  {boosterResults.map((card, index) => (
                    <motion.div
                      key={card.id}
                      initial={{ rotateY: 180, opacity: 0 }}
                      animate={{ rotateY: 0, opacity: 1 }}
                      transition={{ delay: index * 0.15, duration: 0.5 }}
                      className="relative aspect-square rounded-xl overflow-hidden shadow-lg"
                    >
                      <img
                        src={card.image_url}
                        alt={card.title}
                        className="w-full h-full object-cover"
                      />
                      <motion.div
                        className="absolute inset-0 rounded-xl"
                        animate={{
                          boxShadow: [
                            '0 0 10px rgba(251, 191, 36, 0.5)',
                            '0 0 20px rgba(251, 191, 36, 0.8)',
                            '0 0 10px rgba(251, 191, 36, 0.5)',
                          ]
                        }}
                        transition={{ duration: 1, repeat: Infinity }}
                      />
                    </motion.div>
                  ))}
                </div>

                <div className="text-center space-y-2">
                  {boosterResults.map(card => (
                    <p key={card.id} className="text-sm text-muted-foreground">{card.title}</p>
                  ))}
                </div>

                <p className="text-center text-muted-foreground mt-4 text-sm">
                  Cliquez pour fermer
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}