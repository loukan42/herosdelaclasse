import { useNavigate } from "react-router-dom";
import { Grade } from "@/data/grades";
import { stories } from "@/data/stories";
import { Lock, Sparkles } from "lucide-react";

interface GradeCardProps {
  grade: Grade;
  index: number;
}

export function GradeCard({ grade, index }: GradeCardProps) {
  const navigate = useNavigate();
  
  // Check if this grade has any stories
  const hasStories = stories.some(story => story.level === grade.id);
  
  const handleClick = () => {
    if (hasStories) {
      navigate(`/grade/${grade.id}`);
    }
  };

  return (
    <article
      onClick={handleClick}
      className={`
        group relative overflow-hidden rounded-3xl
        transition-all duration-500 ease-out
        fade-up border-4 border-border/30 shadow-xl bg-card
        ${hasStories 
          ? 'cursor-pointer hover:scale-[1.02] hover:shadow-2xl active:scale-[0.98] hover:-translate-y-2' 
          : 'cursor-not-allowed'
        }
      `}
      style={{ 
        animationDelay: `${index * 100}ms`
      }}
    >
      {/* Image Section */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <img 
          src={grade.image} 
          alt={grade.fullName}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        {/* Overlay gradient */}
        <div className={`absolute inset-0 bg-gradient-to-t ${grade.color} opacity-20 mix-blend-overlay`} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />

        {/* Grade badge on image */}
        <div className={`
          absolute top-4 left-4
          inline-flex items-center gap-2 px-4 py-2 rounded-full
          bg-gradient-to-r ${grade.color} shadow-lg
          transform transition-transform duration-300 group-hover:scale-105
        `}>
          <span className="font-display text-lg md:text-xl font-bold text-white">{grade.name}</span>
        </div>

        {/* Decorative elements for available cards */}
        {hasStories && (
          <Sparkles className="absolute top-5 right-5 w-5 h-5 text-white/70 group-hover:text-white transition-colors" />
        )}

        {/* Disabled overlay */}
        {!hasStories && (
          <div className="absolute inset-0 bg-foreground/40 backdrop-blur-[2px]" />
        )}
      </div>

      {/* Text Content Section */}
      <div className="p-6">
        {/* Title */}
        <h2 className="font-display text-xl md:text-2xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
          {grade.fullName}
        </h2>
        
        {/* Description */}
        <p className="text-muted-foreground text-sm md:text-base mb-4 line-clamp-2">
          {grade.description}
        </p>

        {/* Action indicator */}
        {hasStories ? (
          <div className="inline-flex items-center gap-2 text-primary font-semibold">
            <span>C'est parti !</span>
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
            <span className="text-muted-foreground font-semibold text-sm">Bientôt disponible</span>
          </div>
        )}
      </div>
    </article>
  );
}
