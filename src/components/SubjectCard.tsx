import { Subject } from "@/data/subjects";
import { useNavigate } from "react-router-dom";
import { Lock } from "lucide-react";

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
        group relative overflow-hidden rounded-3xl p-8 
        transition-all duration-500 fade-up
        ${subject.available 
          ? 'cursor-pointer hover:scale-[1.02] hover:shadow-2xl' 
          : 'cursor-not-allowed opacity-60 grayscale'
        }
      `}
      style={{ animationDelay: `${index * 0.1}s`, animationFillMode: 'both' }}
    >
      {/* Background gradient */}
      <div className={`absolute inset-0 bg-gradient-to-br ${subject.color} transition-opacity duration-300`} />
      
      {/* Overlay for disabled state */}
      {!subject.available && (
        <div className="absolute inset-0 bg-foreground/20 backdrop-blur-[1px]" />
      )}
      
      {/* Content */}
      <div className="relative z-10">
        {/* Icon */}
        <div className={`
          w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm
          flex items-center justify-center mb-6
          transition-transform duration-300
          ${subject.available ? 'group-hover:scale-110 group-hover:rotate-3' : ''}
        `}>
          <Icon className="w-8 h-8 text-white" />
        </div>

        {/* Title */}
        <h3 className="font-display text-2xl md:text-3xl font-bold text-white mb-3">
          {subject.name}
        </h3>

        {/* Description */}
        <p className="text-white/80 text-base leading-relaxed mb-4">
          {subject.description}
        </p>

        {/* Status badge */}
        {subject.available ? (
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
            <span className="text-white font-semibold text-sm">Découvrir</span>
            <svg 
              className="w-4 h-4 text-white transition-transform group-hover:translate-x-1" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </div>
        ) : (
          <div className="inline-flex items-center gap-2 bg-foreground/30 backdrop-blur-sm px-4 py-2 rounded-full">
            <Lock className="w-4 h-4 text-white" />
            <span className="text-white font-semibold text-sm">Bientôt disponible</span>
          </div>
        )}
      </div>

      {/* Decorative circles */}
      <div className={`
        absolute -bottom-10 -right-10 w-40 h-40 rounded-full bg-white/10
        transition-transform duration-500
        ${subject.available ? 'group-hover:scale-150' : ''}
      `} />
      <div className={`
        absolute -top-5 -left-5 w-20 h-20 rounded-full bg-white/5
        transition-transform duration-500
        ${subject.available ? 'group-hover:scale-125' : ''}
      `} />
    </article>
  );
}
