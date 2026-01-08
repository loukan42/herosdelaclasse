import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Clock, Sparkles, Package, X } from 'lucide-react';
import { SpinWheel } from './SpinWheel';
import { CollectionCard } from '@/hooks/useCollection';

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
              relative overflow-hidden rounded-2xl p-6 text-left transition-all duration-300
              ${canSpin && canAffordSingle 
                ? 'bg-gradient-to-br from-primary/10 to-primary/5 hover:from-primary/20 hover:to-primary/10 cursor-pointer hover:shadow-lg hover:-translate-y-1 border-2 border-primary/30 hover:border-primary/50' 
                : 'bg-muted/50 cursor-not-allowed opacity-60 border-2 border-transparent'
              }
            `}
            whileHover={canSpin && canAffordSingle ? { scale: 1.02 } : {}}
            whileTap={canSpin && canAffordSingle ? { scale: 0.98 } : {}}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="font-display text-xl font-bold">Carte Simple</h3>
                </div>
                <p className="text-muted-foreground text-sm mb-4">
                  Tourne la roue pour débloquer une carte aléatoire
                </p>
              </div>
            </div>
            
            {/* Price badge */}
            <div className={`
              inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-bold
              ${canAffordSingle ? 'bg-amber-500/20 text-amber-600' : 'bg-muted text-muted-foreground'}
            `}>
              <Star className={`w-4 h-4 ${canAffordSingle ? 'fill-amber-500 text-amber-500' : ''}`} />
              <span>{SINGLE_COST} point</span>
            </div>

            {/* Reward info */}
            <div className="mt-4 pt-4 border-t border-border/30">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span className="w-6 h-6 rounded bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">1</span>
                <span>carte à débloquer</span>
              </div>
            </div>
          </motion.button>

          {/* Booster Option */}
          <motion.button
            onClick={() => canSpin && canAffordBooster && hasEnoughCardsForBooster && setActiveWheel('booster')}
            disabled={!canSpin || !canAffordBooster || !hasEnoughCardsForBooster}
            className={`
              relative overflow-hidden rounded-2xl p-6 text-left transition-all duration-300
              ${canSpin && canAffordBooster && hasEnoughCardsForBooster
                ? 'bg-gradient-to-br from-amber-500/20 to-orange-500/10 hover:from-amber-500/30 hover:to-orange-500/20 cursor-pointer hover:shadow-lg hover:-translate-y-1 border-2 border-amber-500/40 hover:border-amber-500/60' 
                : 'bg-muted/50 cursor-not-allowed opacity-60 border-2 border-transparent'
              }
            `}
            whileHover={canSpin && canAffordBooster && hasEnoughCardsForBooster ? { scale: 1.02 } : {}}
            whileTap={canSpin && canAffordBooster && hasEnoughCardsForBooster ? { scale: 0.98 } : {}}
          >
            {/* Premium badge */}
            <div className="absolute top-3 right-3">
              <span className="px-2 py-0.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-bold rounded-full">
                BOOSTER
              </span>
            </div>

            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-500/30 to-orange-500/30 flex items-center justify-center">
                    <Package className="w-5 h-5 text-amber-600" />
                  </div>
                  <h3 className="font-display text-xl font-bold">Pack Booster</h3>
                </div>
                <p className="text-muted-foreground text-sm mb-4">
                  Débloquez 5 cartes d'un seul coup !
                </p>
              </div>
            </div>
            
            {/* Price badge */}
            <div className={`
              inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-bold
              ${canAffordBooster ? 'bg-amber-500/30 text-amber-700' : 'bg-muted text-muted-foreground'}
            `}>
              <Star className={`w-4 h-4 ${canAffordBooster ? 'fill-amber-500 text-amber-500' : ''}`} />
              <span>{BOOSTER_COST} points</span>
            </div>

            {/* Reward info */}
            <div className="mt-4 pt-4 border-t border-amber-500/20">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span className="w-6 h-6 rounded bg-gradient-to-br from-amber-500/20 to-orange-500/20 flex items-center justify-center text-xs font-bold text-amber-600">5</span>
                <span>cartes à débloquer</span>
              </div>
            </div>

            {!hasEnoughCardsForBooster && lockedCardsCount > 0 && (
              <p className="mt-3 text-xs text-amber-600">
                Plus assez de cartes à débloquer ({lockedCardsCount} restante{lockedCardsCount > 1 ? 's' : ''})
              </p>
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
                    <Sparkles className="w-4 h-4" />
                    <span>1 carte • {SINGLE_COST} pt</span>
                  </>
                ) : (
                  <>
                    <Package className="w-4 h-4" />
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