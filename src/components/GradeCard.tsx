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
        fade-up
        ${hasStories 
          ? 'cursor-pointer hover:scale-[1.02] hover:shadow-2xl active:scale-[0.98]' 
          : 'cursor-not-allowed opacity-60'
        }
      `}
      style={{ 
        animationDelay: `${index * 100}ms`,
        aspectRatio: '3/4'
      }}
    >
      {/* Background Image */}
      <div className="absolute inset-0">
        <img 
          src={grade.image} 
          alt={grade.fullName}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        {/* Overlay gradient */}
        <div className={`absolute inset-0 bg-gradient-to-t ${grade.color} opacity-30 mix-blend-overlay`} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
      </div>

      {/* Decorative elements for available cards */}
      {hasStories && (
        <>
          <div className="absolute top-4 right-4 text-white/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <Sparkles className="w-6 h-6 animate-pulse" />
          </div>
        </>
      )}

      {/* Content */}
      <div className="absolute inset-x-0 bottom-0 p-4 md:p-6 text-white flex flex-col">
        {/* Grade badge - fixed height container for alignment */}
        <div className="h-10 md:h-12 flex items-center mb-2 md:mb-3">
          <div className={`
            inline-flex items-center gap-2 px-3 md:px-4 py-1.5 md:py-2 rounded-full
            bg-gradient-to-r ${grade.color} shadow-lg
            transform transition-transform duration-300 group-hover:scale-105
          `}>
            <span className="font-display text-lg md:text-xl font-bold">{grade.name}</span>
          </div>
        </div>
        
        {/* Title */}
        <h2 className="font-display text-lg md:text-xl font-semibold mb-1 drop-shadow-lg">
          {grade.fullName}
        </h2>
        
        {/* Description */}
        <p className="text-white/80 text-sm md:text-base">
          {grade.description}
        </p>

        {/* Action indicator */}
        <div className="mt-4">
          {hasStories ? (
            <div className={`
              inline-flex items-center gap-2 px-4 py-2 rounded-full
              bg-white/20 backdrop-blur-sm border border-white/30
              text-white font-medium text-sm
              transform transition-all duration-300 
              group-hover:bg-white group-hover:text-gray-900 group-hover:scale-105
            `}>
              <span>C'est parti !</span>
              <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
            </div>
          ) : (
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gray-500/50 backdrop-blur-sm text-white/70 text-sm">
              <Lock className="w-4 h-4" />
              <span>Bientôt disponible</span>
            </div>
          )}
        </div>
      </div>

      {/* Disabled overlay */}
      {!hasStories && (
        <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-[1px]" />
      )}
    </article>
  );
}
