import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Star, Clock } from 'lucide-react';
import { CollectionCard } from '@/hooks/useCollection';
import { CardOpenAnimation } from './CardOpenAnimation';
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

type OpenMode = 'single' | 'booster' | null;

export function WheelOptions({
  points,
  canSpin,
  timeUntilSpin,
  onSingleSpin,
  onBoosterSpin,
  lockedCardsCount
}: WheelOptionsProps) {
  const [openMode, setOpenMode] = useState<OpenMode>(null);

  const SINGLE_COST = 1;
  const BOOSTER_COST = 10;
  const BOOSTER_CARDS = 5;

  const canAffordSingle = points >= SINGLE_COST;
  const canAffordBooster = points >= BOOSTER_COST;
  const hasEnoughCardsForBooster = lockedCardsCount >= BOOSTER_CARDS;

  const handleSingleOpen = useCallback(async () => {
    return await onSingleSpin();
  }, [onSingleSpin]);

  const handleBoosterOpen = useCallback(async () => {
    return await onBoosterSpin();
  }, [onBoosterSpin]);

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

      {/* Card Options */}
      <div className="grid grid-cols-2 gap-6 sm:gap-8 max-w-md mx-auto">
        {/* Single Card Option */}
        <motion.button
          onClick={() => canSpin && canAffordSingle && setOpenMode('single')}
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
            className="w-36 sm:w-44 md:w-48 h-auto drop-shadow-xl"
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
          onClick={() => canSpin && canAffordBooster && hasEnoughCardsForBooster && setOpenMode('booster')}
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
            className="w-36 sm:w-44 md:w-48 h-auto drop-shadow-xl"
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

      {/* Card Open Animation */}
      <CardOpenAnimation
        isOpen={openMode !== null}
        isBooster={openMode === 'booster'}
        onOpen={openMode === 'booster' ? handleBoosterOpen : handleSingleOpen}
        onComplete={() => setOpenMode(null)}
      />
    </div>
  );
}
