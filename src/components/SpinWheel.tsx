import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Package } from 'lucide-react';
import { CollectionCard } from '@/hooks/useCollection';

interface SpinWheelProps {
  onSpin: () => Promise<CollectionCard | null>;
  canSpin: boolean;
  disabled?: boolean;
  isBooster?: boolean;
  onComplete?: () => void;
}

const WHEEL_SEGMENTS = 8;
const COLORS = [
  'hsl(var(--primary))',
  'hsl(var(--secondary))',
  'hsl(340, 82%, 52%)',
  'hsl(262, 83%, 58%)',
  'hsl(199, 89%, 48%)',
  'hsl(142, 71%, 45%)',
  'hsl(38, 92%, 50%)',
  'hsl(24, 100%, 50%)',
];

const BOOSTER_COLORS = [
  'hsl(38, 92%, 50%)',
  'hsl(24, 100%, 50%)',
  'hsl(38, 92%, 60%)',
  'hsl(24, 100%, 60%)',
  'hsl(38, 92%, 50%)',
  'hsl(24, 100%, 50%)',
  'hsl(38, 92%, 60%)',
  'hsl(24, 100%, 60%)',
];

export function SpinWheel({ onSpin, canSpin, disabled, isBooster = false, onComplete }: SpinWheelProps) {
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [result, setResult] = useState<CollectionCard | null>(null);
  const wheelRef = useRef<HTMLDivElement>(null);

  const colors = isBooster ? BOOSTER_COLORS : COLORS;

  const handleSpin = async () => {
    if (isSpinning || !canSpin || disabled) return;

    setIsSpinning(true);
    setResult(null);

    // Random rotation between 3-6 full spins plus random offset
    const spins = 3 + Math.random() * 3;
    const randomOffset = Math.random() * 360;
    const newRotation = rotation + (spins * 360) + randomOffset;
    
    setRotation(newRotation);

    // Wait for animation to complete
    await new Promise(resolve => setTimeout(resolve, 4000));

    // Get the card(s)
    const card = await onSpin();
    
    // Only show single card result for non-booster (booster has its own modal)
    if (!isBooster && card) {
      setResult(card);
    }
    
    setIsSpinning(false);
    
    // Call onComplete after spin is done (for booster, it's handled differently)
    if (isBooster) {
      // Small delay to let the booster modal show
      setTimeout(() => {
        onComplete?.();
      }, 500);
    }
  };

  const segmentAngle = 360 / WHEEL_SEGMENTS;
  const Icon = isBooster ? Package : Sparkles;

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Wheel Container */}
      <div className="relative w-72 h-72 md:w-80 md:h-80">
        {/* Pointer */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 z-10">
          <div className={`w-0 h-0 border-l-[16px] border-l-transparent border-r-[16px] border-r-transparent border-t-[24px] drop-shadow-lg ${isBooster ? 'border-t-amber-500' : 'border-t-primary'}`} />
        </div>

        {/* Wheel */}
        <motion.div
          ref={wheelRef}
          className={`w-full h-full rounded-full shadow-2xl overflow-hidden border-4 ${isBooster ? 'border-amber-500/50' : 'border-primary/50'}`}
          animate={{ rotate: rotation }}
          transition={{ 
            duration: 4, 
            ease: [0.17, 0.67, 0.12, 0.99] // Custom easing for realistic spin
          }}
          style={{ 
            background: `conic-gradient(${colors.map((color, i) => 
              `${color} ${i * segmentAngle}deg ${(i + 1) * segmentAngle}deg`
            ).join(', ')})`
          }}
        >
          {/* Segment lines */}
          {Array.from({ length: WHEEL_SEGMENTS }).map((_, i) => (
            <div
              key={i}
              className="absolute top-1/2 left-1/2 w-1/2 h-0.5 bg-white/30 origin-left"
              style={{ transform: `rotate(${i * segmentAngle}deg)` }}
            />
          ))}
          
          {/* Center circle */}
          <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full shadow-inner flex items-center justify-center ${isBooster ? 'bg-gradient-to-br from-amber-100 to-orange-100' : 'bg-white'}`}>
            <Icon className={`w-8 h-8 ${isBooster ? 'text-amber-600' : 'text-primary'}`} />
          </div>
        </motion.div>

        {/* Glow effect when spinning */}
        {isSpinning && (
          <motion.div
            className="absolute inset-0 rounded-full"
            animate={{ 
              boxShadow: isBooster 
                ? [
                    '0 0 20px rgba(251, 191, 36, 0.3)',
                    '0 0 40px rgba(251, 191, 36, 0.5)',
                    '0 0 20px rgba(251, 191, 36, 0.3)',
                  ]
                : [
                    '0 0 20px rgba(var(--primary-rgb), 0.3)',
                    '0 0 40px rgba(var(--primary-rgb), 0.5)',
                    '0 0 20px rgba(var(--primary-rgb), 0.3)',
                  ]
            }}
            transition={{ duration: 0.5, repeat: Infinity }}
          />
        )}
      </div>

      {/* Spin Button */}
      <button
        onClick={handleSpin}
        disabled={isSpinning || !canSpin || disabled}
        className={`
          px-8 py-4 rounded-2xl font-display font-bold text-lg
          transition-all duration-300 shadow-lg
          ${isSpinning || !canSpin || disabled
            ? 'bg-muted text-muted-foreground cursor-not-allowed'
            : isBooster
              ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:shadow-xl hover:-translate-y-1'
              : 'bg-gradient-to-r from-primary to-primary/80 text-primary-foreground hover:shadow-xl hover:-translate-y-1'
          }
        `}
      >
        {isSpinning ? (
          <span className="flex items-center gap-2">
            <motion.span
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            >
              <Icon className="w-5 h-5" />
            </motion.span>
            Ça tourne...
          </span>
        ) : (
          <span className="flex items-center gap-2">
            <Icon className="w-5 h-5" />
            {isBooster ? 'Ouvrir le booster' : 'Tourner la roue'}
          </span>
        )}
      </button>

      {/* Result Display (Single card only - Booster has its own modal) */}
      {result && !isBooster && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          onClick={() => {
            setResult(null);
            onComplete?.();
          }}
        >
          <motion.div
            initial={{ rotateY: 180, opacity: 0 }}
            animate={{ rotateY: 0, opacity: 1 }}
            transition={{ duration: 0.6, type: 'spring' }}
            className="bg-gradient-to-br from-amber-400 to-orange-500 p-1 rounded-3xl shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-background rounded-3xl p-6 text-center">
              <h3 className="font-display text-2xl font-bold text-foreground mb-4">
                🎉 Nouvelle carte débloquée !
              </h3>
              <div className="relative">
                <img
                  src={result.image_url}
                  alt={result.title}
                  className="w-48 h-48 object-cover rounded-2xl mx-auto shadow-lg"
                />
                <motion.div
                  className="absolute inset-0 rounded-2xl"
                  animate={{
                    boxShadow: [
                      '0 0 20px rgba(251, 191, 36, 0.5)',
                      '0 0 40px rgba(251, 191, 36, 0.8)',
                      '0 0 20px rgba(251, 191, 36, 0.5)',
                    ]
                  }}
                  transition={{ duration: 1, repeat: Infinity }}
                />
              </div>
              <h4 className="font-display text-xl font-bold text-foreground mt-4">
                {result.title}
              </h4>
              <p className="text-muted-foreground mt-2">
                Cliquez pour fermer
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}