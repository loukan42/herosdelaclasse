import { useState } from 'react';
import { Lock, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';

interface CollectionCardProps {
  imageUrl: string;
  title: string;
  unlocked: boolean;
}

export function CollectionCard({ imageUrl, title, unlocked }: CollectionCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);

  const handleClick = () => {
    if (unlocked) {
      setIsOpen(true);
      setIsFlipped(false);
      // Trigger flip animation after modal opens
      setTimeout(() => setIsFlipped(true), 100);
    }
  };

  return (
    <>
      <motion.div
        className={`flex flex-col items-center ${unlocked ? 'cursor-pointer' : 'cursor-not-allowed'}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={handleClick}
        whileHover={{ scale: 1.02 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        {/* Card Container with 3D perspective */}
        <motion.div
          className="relative w-full perspective-1000"
          style={{ perspective: "1000px" }}
          animate={{
            rotateY: isHovered ? 5 : 0,
            rotateX: isHovered ? -5 : 0,
          }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
        >
          {/* Card Frame */}
          <div
            className={`
              relative rounded-lg sm:rounded-xl overflow-hidden
              ${unlocked 
                ? 'bg-gradient-to-br from-amber-200 via-amber-100 to-amber-300 p-1 sm:p-1.5 shadow-[0_4px_20px_rgba(217,164,50,0.3),0_2px_6px_rgba(0,0,0,0.1)] sm:shadow-[0_8px_30px_rgba(217,164,50,0.4),0_4px_10px_rgba(0,0,0,0.1)]' 
                : 'bg-gradient-to-br from-slate-400 via-slate-300 to-slate-400 p-1 sm:p-1.5 shadow-[0_2px_10px_rgba(0,0,0,0.1)] sm:shadow-[0_4px_15px_rgba(0,0,0,0.15)]'
              }
            `}
            style={{
              transformStyle: "preserve-3d",
            }}
          >
            {/* Inner Card */}
            <div className="relative rounded-md sm:rounded-lg overflow-hidden bg-card">
              {/* Aspect ratio container - portrait card format */}
              <div className="aspect-[3/4] relative">
                {unlocked ? (
                  <>
                    {/* Unlocked Card Image */}
                    <img
                      src={imageUrl}
                      alt={title}
                      className="w-full h-full object-contain bg-gradient-to-br from-slate-100 to-slate-50"
                      loading="lazy"
                      decoding="async"
                    />
                    
                    {/* Shine effect on hover */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/30 to-transparent pointer-events-none"
                      initial={{ x: "-100%", opacity: 0 }}
                      animate={{ 
                        x: isHovered ? "100%" : "-100%",
                        opacity: isHovered ? 1 : 0
                      }}
                      transition={{ duration: 0.6, ease: "easeInOut" }}
                    />
                    
                    {/* Sparkle corners - hidden on mobile for cleaner look */}
                    <div className="hidden sm:block absolute top-2 right-2 w-2 h-2 bg-amber-400/80 rounded-full animate-pulse" />
                    <div className="hidden sm:block absolute bottom-2 left-2 w-1.5 h-1.5 bg-amber-300/60 rounded-full animate-pulse delay-300" />
                  </>
                ) : (
                  <>
                    {/* Locked Card - Blurred mysterious look */}
                    <div className="w-full h-full relative bg-gradient-to-br from-slate-200 to-slate-300">
                      <img
                        src={imageUrl}
                        alt="Carte verrouillée"
                        className="w-full h-full object-contain blur-2xl scale-125 opacity-30"
                        loading="lazy"
                        decoding="async"
                      />
                      
                      {/* Mystery overlay */}
                      <div className="absolute inset-0 bg-gradient-to-br from-slate-400/40 via-slate-500/50 to-slate-600/40 flex items-center justify-center">
                        <div className="text-center transform-gpu">
                          <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-full bg-slate-600/30 backdrop-blur-sm flex items-center justify-center mx-auto mb-1 sm:mb-2 border border-slate-500/20">
                            <Lock className="w-5 h-5 sm:w-7 sm:h-7 text-slate-500/70" />
                          </div>
                          <span className="text-xl sm:text-2xl font-bold text-slate-500/50">?</span>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
            
            {/* Reflective edge effect for unlocked cards */}
            {unlocked && (
              <div className="absolute inset-0 rounded-lg sm:rounded-xl pointer-events-none border border-white/30" />
            )}
          </div>
          
          {/* 3D Shadow */}
          <div 
            className={`
              absolute -bottom-2 left-2 right-2 h-4 rounded-full blur-xl -z-10
              ${unlocked 
                ? 'bg-amber-500/30' 
                : 'bg-slate-500/20'
              }
            `}
            style={{
              transform: "translateZ(-20px) rotateX(90deg)",
            }}
          />
        </motion.div>

        {/* Title below card */}
        <div className="mt-2 sm:mt-3 text-center w-full px-0.5 sm:px-1">
          {unlocked ? (
            <p className="font-medium text-xs sm:text-sm text-foreground line-clamp-2 leading-tight">
              {title}
            </p>
          ) : (
            <p className="text-xs sm:text-sm text-muted-foreground/60 italic">
              ???
            </p>
          )}
        </div>
      </motion.div>

      {/* Full-size card modal */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-[90vw] sm:max-w-md md:max-w-lg lg:max-w-xl p-0 bg-transparent border-none shadow-none overflow-visible [&>button]:hidden">
          <DialogTitle className="sr-only">{title}</DialogTitle>
          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ type: "spring", stiffness: 200, damping: 20 }}
                className="relative flex flex-col items-center"
                style={{ perspective: "1000px" }}
              >
                {/* Close button */}
                <button
                  onClick={() => setIsOpen(false)}
                  className="absolute -top-2 -right-2 sm:-top-3 sm:-right-3 z-10 w-8 h-8 sm:w-10 sm:h-10 bg-background/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg border border-border hover:bg-background transition-colors"
                >
                  <X className="w-4 h-4 sm:w-5 sm:h-5 text-foreground" />
                </button>

                {/* Flip Container */}
                <motion.div
                  className="relative"
                  style={{ transformStyle: "preserve-3d" }}
                  initial={{ rotateY: 180 }}
                  animate={{ rotateY: isFlipped ? 0 : 180 }}
                  transition={{ 
                    duration: 0.8, 
                    ease: [0.23, 1, 0.32, 1],
                    delay: 0.1
                  }}
                >
                  {/* Card Back (visible when not flipped) */}
                  <div 
                    className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-700 p-2 sm:p-3 md:p-4 rounded-2xl sm:rounded-3xl shadow-[0_20px_60px_rgba(79,70,229,0.5),0_10px_30px_rgba(0,0,0,0.2)] flex items-center justify-center"
                    style={{ 
                      backfaceVisibility: "hidden",
                      transform: "rotateY(180deg)"
                    }}
                  >
                    <div className="w-[70vw] max-w-[280px] sm:max-w-[320px] md:max-w-[380px] lg:max-w-[420px] aspect-[3/4] rounded-xl sm:rounded-2xl bg-gradient-to-br from-indigo-500/50 to-purple-600/50 flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-6xl sm:text-7xl md:text-8xl font-bold text-white/30">?</div>
                        <div className="mt-2 text-white/40 text-sm sm:text-base">Carte mystère</div>
                      </div>
                    </div>
                  </div>

                  {/* Card Front (visible when flipped) */}
                  <div 
                    className="bg-gradient-to-br from-amber-200 via-amber-100 to-amber-300 p-2 sm:p-3 md:p-4 rounded-2xl sm:rounded-3xl shadow-[0_20px_60px_rgba(217,164,50,0.5),0_10px_30px_rgba(0,0,0,0.2)]"
                    style={{ backfaceVisibility: "hidden" }}
                  >
                    <div className="rounded-xl sm:rounded-2xl overflow-hidden bg-card">
                      {/* Card image - large and prominent */}
                      <div className="w-[70vw] max-w-[280px] sm:max-w-[320px] md:max-w-[380px] lg:max-w-[420px] aspect-[3/4] relative">
                        <img
                          src={imageUrl}
                          alt={title}
                          className="w-full h-full object-contain bg-gradient-to-br from-slate-100 to-slate-50"
                        />
                        
                        {/* Animated shine effect - plays after flip */}
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/40 to-transparent pointer-events-none"
                          initial={{ x: "-100%" }}
                          animate={{ x: isFlipped ? "200%" : "-100%" }}
                          transition={{ 
                            duration: 1.2, 
                            ease: "easeInOut",
                            delay: 0.8
                          }}
                        />
                        
                        {/* Sparkles */}
                        <div className="absolute top-3 right-3 sm:top-4 sm:right-4 w-2 h-2 sm:w-3 sm:h-3 bg-amber-400/80 rounded-full animate-pulse" />
                        <div className="absolute top-5 right-6 sm:top-6 sm:right-8 w-1.5 h-1.5 sm:w-2 sm:h-2 bg-amber-300/60 rounded-full animate-pulse delay-150" />
                        <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 w-2 h-2 sm:w-2.5 sm:h-2.5 bg-amber-300/70 rounded-full animate-pulse delay-300" />
                        <div className="absolute bottom-5 left-6 sm:bottom-6 sm:left-8 w-1 h-1 sm:w-1.5 sm:h-1.5 bg-amber-400/50 rounded-full animate-pulse delay-500" />
                      </div>
                    </div>
                    
                    {/* Glow animation */}
                    <motion.div
                      className="absolute inset-0 rounded-2xl sm:rounded-3xl pointer-events-none"
                      animate={{
                        boxShadow: isFlipped ? [
                          '0 0 20px rgba(251, 191, 36, 0.3)',
                          '0 0 40px rgba(251, 191, 36, 0.5)',
                          '0 0 20px rgba(251, 191, 36, 0.3)',
                        ] : '0 0 0 rgba(251, 191, 36, 0)'
                      }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                    
                    {/* Reflective edge */}
                    <div className="absolute inset-0 rounded-2xl sm:rounded-3xl pointer-events-none border border-white/40" />
                  </div>
                </motion.div>

                {/* Title - below the card */}
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: isFlipped ? 1 : 0, y: isFlipped ? 0 : 10 }}
                  transition={{ delay: 0.9, duration: 0.4 }}
                  className="mt-4 sm:mt-6 text-center px-4"
                >
                  <h3 className="font-display text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-white drop-shadow-lg">
                    {title}
                  </h3>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </DialogContent>
      </Dialog>
    </>
  );
}
