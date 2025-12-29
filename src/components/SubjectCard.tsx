import { Subject } from "@/data/subjects";
import { useNavigate } from "react-router-dom";
import { Lock, Sparkles } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface SubjectCardProps {
  subject: Subject;
  index: number;
  gradeId?: string;
}

export function SubjectCard({ subject, index, gradeId }: SubjectCardProps) {
  const navigate = useNavigate();
  const Icon = subject.icon;
  const { t } = useLanguage();

  const handleClick = () => {
    if (subject.available) {
      const path = gradeId 
        ? `/grade/${gradeId}/subjects/${subject.id}` 
        : `/subjects/${subject.id}`;
      navigate(path);
    }
  };

  return (
    <article
      onClick={handleClick}
      className={`
        group relative overflow-hidden rounded-3xl 
        transition-all duration-500 fade-up
        border-4 border-border/30 shadow-xl bg-card
        ${subject.available 
          ? 'cursor-pointer hover:scale-[1.02] hover:shadow-2xl hover:-translate-y-2' 
          : 'cursor-not-allowed'
        }
      `}
      style={{ animationDelay: `${index * 0.08}s`, animationFillMode: 'both' }}
    >
      {/* Image Section */}
      <div className="relative aspect-[4/3] overflow-hidden">
        {subject.backgroundImage ? (
          <img 
            src={subject.backgroundImage} 
            alt={subject.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className={`w-full h-full bg-gradient-to-br ${subject.color}`}>
            {/* Dots pattern for non-image backgrounds */}
            <div className="absolute inset-0 opacity-30" style={{
              backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.3) 2px, transparent 2px)',
              backgroundSize: '20px 20px'
            }} />
          </div>
        )}
        
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />

        {/* Icon badge */}
        <div className={`
          absolute top-4 left-4
          w-14 h-14 rounded-2xl 
          bg-white/90 backdrop-blur-sm
          border-2 border-white
          flex items-center justify-center
          shadow-lg
          transition-all duration-300
          ${subject.available ? 'group-hover:scale-110 group-hover:rotate-6' : ''}
        `}>
          <Icon className={`w-7 h-7 ${subject.available ? 'text-primary' : 'text-muted-foreground'}`} />
        </div>

        {/* Star decorations */}
        {subject.available && (
          <>
            <Sparkles className="absolute top-5 right-5 w-5 h-5 text-white/70 group-hover:text-white transition-colors" />
            <Sparkles className="absolute bottom-8 right-8 w-4 h-4 text-white/50 group-hover:rotate-45 transition-transform" />
          </>
        )}

        {/* Disabled overlay */}
        {!subject.available && (
          <div className="absolute inset-0 bg-foreground/40 backdrop-blur-[2px]" />
        )}
      </div>

      {/* Text Content Section */}
      <div className="p-6">
        {/* Title */}
        <h3 className="font-display text-2xl md:text-[1.6rem] font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
          {subject.name}
        </h3>

        {/* Description */}
        <p className="text-muted-foreground text-sm leading-relaxed mb-4 line-clamp-2">
          {t(subject.descriptionKey)}
        </p>

        {/* Status badge */}
        {subject.available ? (
          <div className="inline-flex items-center gap-2 text-primary font-semibold">
            <span>{t('card.letsGo')}</span>
            <svg 
              className="w-5 h-5 transition-transform group-hover:translate-x-2" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </div>
        ) : (
          <div className="inline-flex items-center gap-2 bg-muted px-4 py-2 rounded-full">
            <Lock className="w-4 h-4 text-muted-foreground" />
            <span className="text-muted-foreground font-semibold text-sm">{t('card.comingSoon')}</span>
          </div>
        )}
      </div>
    </article>
  );
}
