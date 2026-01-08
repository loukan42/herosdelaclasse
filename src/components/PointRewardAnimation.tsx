import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Star, Gift } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface PointRewardAnimationProps {
  show: boolean;
  onComplete?: () => void;
}

export function PointRewardAnimation({ show, onComplete }: PointRewardAnimationProps) {
  const { t } = useLanguage();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (show) {
      setIsVisible(true);
      // Auto-hide after animation
      const timer = setTimeout(() => {
        setIsVisible(false);
        onComplete?.();
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [show, onComplete]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          onClick={() => {
            setIsVisible(false);
            onComplete?.();
          }}
        >
          <motion.div
            initial={{ scale: 0, rotate: -10 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 10 }}
            transition={{ 
              type: "spring", 
              stiffness: 200, 
              damping: 15,
              delay: 0.1
            }}
            className="relative flex flex-col items-center p-6 sm:p-8"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Floating sparkles background */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              {[...Array(12)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute"
                  initial={{ 
                    opacity: 0,
                    scale: 0,
                    x: Math.random() * 200 - 100,
                    y: Math.random() * 200 - 100
                  }}
                  animate={{ 
                    opacity: [0, 1, 0],
                    scale: [0, 1.5, 0],
                    x: Math.random() * 300 - 150,
                    y: Math.random() * 300 - 150
                  }}
                  transition={{
                    duration: 2,
                    delay: 0.2 + i * 0.1,
                    repeat: 1,
                    repeatDelay: 0.5
                  }}
                  style={{
                    left: '50%',
                    top: '50%',
                  }}
                >
                  <Star 
                    className="w-4 h-4 sm:w-6 sm:h-6 text-amber-400 fill-amber-400" 
                    style={{ filter: 'drop-shadow(0 0 8px rgba(251, 191, 36, 0.8))' }}
                  />
                </motion.div>
              ))}
            </div>

            {/* Main content card */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.4 }}
              className="relative bg-gradient-to-br from-amber-100 via-amber-50 to-yellow-100 rounded-3xl p-6 sm:p-8 shadow-[0_20px_60px_rgba(251,191,36,0.4)] border-2 border-amber-300/50"
            >
              {/* Glowing border effect */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-amber-400/20 to-yellow-400/20 blur-xl -z-10" />
              
              {/* Icon with pulse effect */}
              <motion.div
                animate={{ 
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{ 
                  duration: 1.5,
                  repeat: Infinity,
                  repeatDelay: 0.5
                }}
                className="mx-auto mb-4 w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-amber-400 to-yellow-500 flex items-center justify-center shadow-lg"
              >
                <Gift className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
              </motion.div>

              {/* +1 Point badge */}
              <motion.div
                initial={{ scale: 0, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                transition={{ delay: 0.5, type: "spring", stiffness: 300 }}
                className="mx-auto mb-3 bg-gradient-to-r from-amber-500 to-yellow-500 text-white font-bold text-xl sm:text-2xl px-6 py-2 rounded-full shadow-lg flex items-center gap-2"
              >
                <Sparkles className="w-5 h-5 sm:w-6 sm:h-6" />
                <span>+1 {t('reward.point')}</span>
                <Sparkles className="w-5 h-5 sm:w-6 sm:h-6" />
              </motion.div>

              {/* Title */}
              <motion.h2
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="text-xl sm:text-2xl font-display font-bold text-amber-800 text-center mb-2"
              >
                {t('reward.congratulations')}
              </motion.h2>

              {/* Description */}
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="text-sm sm:text-base text-amber-700 text-center max-w-xs"
              >
                {t('reward.earnedPoint')}
              </motion.p>

              {/* Dismiss hint */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.7 }}
                transition={{ delay: 1.5 }}
                className="text-xs text-amber-600 text-center mt-4"
              >
                {t('reward.tapToContinue')}
              </motion.p>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
