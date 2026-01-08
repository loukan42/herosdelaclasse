import { useState } from 'react';
import { Lock } from 'lucide-react';
import { motion } from 'framer-motion';

interface CollectionCardProps {
  imageUrl: string;
  title: string;
  unlocked: boolean;
}

export function CollectionCard({ imageUrl, title, unlocked }: CollectionCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      className="flex flex-col items-center"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
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
            relative rounded-xl overflow-hidden
            ${unlocked 
              ? 'bg-gradient-to-br from-amber-200 via-amber-100 to-amber-300 p-1.5 shadow-[0_8px_30px_rgba(217,164,50,0.4),0_4px_10px_rgba(0,0,0,0.1)]' 
              : 'bg-gradient-to-br from-slate-400 via-slate-300 to-slate-400 p-1.5 shadow-[0_4px_15px_rgba(0,0,0,0.15)]'
            }
          `}
          style={{
            transformStyle: "preserve-3d",
          }}
        >
          {/* Inner Card */}
          <div className="relative rounded-lg overflow-hidden bg-card">
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
                  
                  {/* Sparkle corners */}
                  <div className="absolute top-2 right-2 w-2 h-2 bg-amber-400/80 rounded-full animate-pulse" />
                  <div className="absolute bottom-2 left-2 w-1.5 h-1.5 bg-amber-300/60 rounded-full animate-pulse delay-300" />
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
                        <div className="w-14 h-14 rounded-full bg-slate-600/30 backdrop-blur-sm flex items-center justify-center mx-auto mb-2 border border-slate-500/20">
                          <Lock className="w-7 h-7 text-slate-500/70" />
                        </div>
                        <span className="text-2xl font-bold text-slate-500/50">?</span>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
          
          {/* Reflective edge effect for unlocked cards */}
          {unlocked && (
            <div className="absolute inset-0 rounded-xl pointer-events-none border border-white/30" />
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
      <div className="mt-3 text-center w-full px-1">
        {unlocked ? (
          <p className="font-medium text-sm text-foreground line-clamp-2 leading-tight">
            {title}
          </p>
        ) : (
          <p className="text-sm text-muted-foreground/60 italic">
            ???
          </p>
        )}
      </div>
    </motion.div>
  );
}
