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

  const handleClick = () => {
    if (unlocked) {
      setIsOpen(true);
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
        <DialogContent className="max-w-md sm:max-w-lg p-0 bg-transparent border-none shadow-none overflow-visible [&>button]:hidden">
          <DialogTitle className="sr-only">{title}</DialogTitle>
          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ scale: 0.8, opacity: 0, rotateY: -15 }}
                animate={{ scale: 1, opacity: 1, rotateY: 0 }}
                exit={{ scale: 0.8, opacity: 0, rotateY: 15 }}
                transition={{ type: "spring", stiffness: 200, damping: 20 }}
                className="relative"
              >
                {/* Close button */}
                <button
                  onClick={() => setIsOpen(false)}
                  className="absolute -top-3 -right-3 z-10 w-10 h-10 bg-background/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg border border-border hover:bg-background transition-colors"
                >
                  <X className="w-5 h-5 text-foreground" />
                </button>

                {/* Large Card */}
                <div className="bg-gradient-to-br from-amber-200 via-amber-100 to-amber-300 p-2 sm:p-3 rounded-2xl shadow-[0_20px_60px_rgba(217,164,50,0.5),0_10px_30px_rgba(0,0,0,0.2)]">
                  <div className="rounded-xl overflow-hidden bg-card">
                    <div className="aspect-[3/4] relative">
                      <img
                        src={imageUrl}
                        alt={title}
                        className="w-full h-full object-contain bg-gradient-to-br from-slate-100 to-slate-50"
                      />
                      
                      {/* Animated shine effect */}
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/40 to-transparent pointer-events-none"
                        initial={{ x: "-100%" }}
                        animate={{ x: "200%" }}
                        transition={{ 
                          duration: 1.5, 
                          ease: "easeInOut",
                          delay: 0.3
                        }}
                      />
                      
                      {/* Sparkles */}
                      <div className="absolute top-4 right-4 w-3 h-3 bg-amber-400/80 rounded-full animate-pulse" />
                      <div className="absolute top-6 right-8 w-2 h-2 bg-amber-300/60 rounded-full animate-pulse delay-150" />
                      <div className="absolute bottom-4 left-4 w-2.5 h-2.5 bg-amber-300/70 rounded-full animate-pulse delay-300" />
                      <div className="absolute bottom-6 left-8 w-1.5 h-1.5 bg-amber-400/50 rounded-full animate-pulse delay-500" />
                    </div>
                  </div>
                  
                  {/* Reflective edge */}
                  <div className="absolute inset-0 rounded-2xl pointer-events-none border border-white/40" />
                </div>

                {/* Title */}
                <div className="mt-4 text-center">
                  <h3 className="font-display text-xl sm:text-2xl font-bold text-white drop-shadow-lg">
                    {title}
                  </h3>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </DialogContent>
      </Dialog>
    </>
  );
}
