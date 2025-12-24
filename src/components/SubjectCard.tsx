import { Subject } from "@/data/subjects";
import { useNavigate } from "react-router-dom";
import { Lock, Sparkles } from "lucide-react";

interface SubjectCardProps {
  subject: Subject;
  index: number;
}

export function SubjectCard({ subject, index }: SubjectCardProps) {
  const navigate = useNavigate();
  const Icon = subject.icon;

  const handleClick = () => {
    if (subject.available) {
      navigate(`/subjects/${subject.id}`);
    }
  };

  return (
    <article
      onClick={handleClick}
      className={`
        group relative overflow-hidden rounded-[2rem] 
        transition-all duration-500 fade-up
        border-4 border-white/50 shadow-xl
        ${subject.available 
          ? 'cursor-pointer hover:scale-[1.03] hover:shadow-2xl hover:-translate-y-2' 
          : 'cursor-not-allowed'
        }
      `}
      style={{ animationDelay: `${index * 0.08}s`, animationFillMode: 'both' }}
    >
      {/* Main gradient background */}
      <div className={`absolute inset-0 bg-gradient-to-br ${subject.color}`} />
      
      {/* Cartoon-style pattern overlay */}
      <div className="absolute inset-0 opacity-30">
        {/* Dots pattern */}
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.3) 2px, transparent 2px)',
          backgroundSize: '20px 20px'
        }} />
      </div>

      {/* Wavy decoration at bottom */}
      <svg 
        className="absolute bottom-0 left-0 right-0 text-white/20" 
        viewBox="0 0 400 60" 
        preserveAspectRatio="none"
        style={{ height: '40px', width: '100%' }}
      >
        <path 
          d="M0,30 Q50,0 100,30 T200,30 T300,30 T400,30 L400,60 L0,60 Z" 
          fill="currentColor"
        />
      </svg>

      {/* Floating decorative elements */}
      <div className={`
        absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 
        transition-transform duration-700
        ${subject.available ? 'group-hover:scale-150 group-hover:opacity-0' : ''}
      `} />
      <div className={`
        absolute top-12 right-12 w-4 h-4 rounded-full bg-white/30
        transition-transform duration-500 delay-100
        ${subject.available ? 'group-hover:translate-y-2 group-hover:translate-x-2' : ''}
      `} />
      <div className={`
        absolute bottom-16 left-6 w-6 h-6 rounded-full bg-white/15
        transition-transform duration-500
        ${subject.available ? 'group-hover:scale-125' : ''}
      `} />

      {/* Star decorations */}
      {subject.available && (
        <>
          <Sparkles className="absolute top-6 left-6 w-5 h-5 text-white/40 group-hover:text-white/70 transition-colors" />
          <Sparkles className="absolute bottom-20 right-8 w-4 h-4 text-white/30 group-hover:rotate-45 transition-transform" />
        </>
      )}

      {/* Disabled overlay */}
      {!subject.available && (
        <div className="absolute inset-0 bg-foreground/40 backdrop-blur-[2px]" />
      )}
      
      {/* Content */}
      <div className="relative z-10 p-7 pb-8 min-h-[220px] flex flex-col">
        {/* Icon with cartoon bubble effect */}
        <div className={`
          w-16 h-16 rounded-2xl 
          bg-white/25 backdrop-blur-sm
          border-2 border-white/40
          flex items-center justify-center mb-5
          shadow-lg
          transition-all duration-300
          ${subject.available ? 'group-hover:scale-110 group-hover:rotate-6 group-hover:bg-white/35' : ''}
        `}>
          <Icon className="w-8 h-8 text-white drop-shadow-md" />
        </div>

        {/* Title with playful shadow */}
        <h3 className="font-display text-2xl md:text-[1.7rem] font-bold text-white mb-2 drop-shadow-md">
          {subject.name}
        </h3>

        {/* Description */}
        <p className="text-white/85 text-sm leading-relaxed mb-auto drop-shadow-sm">
          {subject.description}
        </p>

        {/* Status badge */}
        <div className="mt-4">
          {subject.available ? (
            <div className={`
              inline-flex items-center gap-2 
              bg-white/30 backdrop-blur-sm 
              border-2 border-white/50
              px-5 py-2.5 rounded-full
              shadow-md
              transition-all duration-300
              group-hover:bg-white/40 group-hover:scale-105
            `}>
              <span className="text-white font-bold text-sm drop-shadow-sm">C'est parti !</span>
              <svg 
                className="w-4 h-4 text-white transition-transform group-hover:translate-x-1" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </div>
          ) : (
            <div className="inline-flex items-center gap-2 bg-foreground/50 backdrop-blur-sm px-4 py-2 rounded-full border-2 border-white/30">
              <Lock className="w-4 h-4 text-white" />
              <span className="text-white font-semibold text-sm">Bientôt disponible</span>
            </div>
          )}
        </div>
      </div>

      {/* Cartoon corner fold effect */}
      {subject.available && (
        <div className="absolute top-0 right-0 w-0 h-0 
          border-l-[30px] border-l-transparent
          border-t-[30px] border-t-white/30
          group-hover:border-t-white/50 transition-colors
        " />
      )}
    </article>
  );
}
