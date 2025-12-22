import { Story } from "@/data/stories";
import { useNavigate } from "react-router-dom";
import { Sparkles } from "lucide-react";

interface StoryCardProps {
  story: Story;
  index: number;
}

export function StoryCard({ story, index }: StoryCardProps) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/stories/${story.id}/start`);
  };

  return (
    <article
      onClick={handleClick}
      className="story-card group cursor-pointer fade-up"
      style={{ animationDelay: `${index * 0.1}s`, animationFillMode: 'both' }}
    >
      {/* Cover Image */}
      <div className="relative aspect-[4/3] overflow-hidden rounded-t-3xl">
        <img
          src={story.coverImage}
          alt={`Couverture de ${story.title}`}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/40 to-transparent" />
        
        {/* Age Badge */}
        <div className="absolute top-4 right-4 bg-golden text-golden-foreground px-3 py-1 rounded-full text-sm font-display font-semibold flex items-center gap-1 shadow-lg">
          <Sparkles className="w-3 h-3" />
          {story.ageMin}-{story.ageMax} ans
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="font-display text-2xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
          {story.title}
        </h3>
        <p className="text-muted-foreground text-base leading-relaxed line-clamp-2">
          {story.description}
        </p>
        
        {/* CTA */}
        <div className="mt-4 flex items-center gap-2 text-primary font-semibold">
          <span>Lire l'histoire</span>
          <svg 
            className="w-5 h-5 transition-transform group-hover:translate-x-2" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </div>
      </div>
    </article>
  );
}
