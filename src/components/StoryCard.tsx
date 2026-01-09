import { Story } from "@/data/stories";
import { useNavigate } from "react-router-dom";
import { Sparkles, BookOpen, CheckCircle, PlayCircle, FileDown, Loader2 } from "lucide-react";
import { getStoredReadCount } from "@/hooks/useReadCount";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTranslatedString } from "@/hooks/useTranslatedString";
import { useStoryPdfExport } from "@/hooks/useStoryPdfExport";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface StoryCardProps {
  story: Story;
  index: number;
  hasProgress?: boolean;
  isCompleted?: boolean;
  completionCount?: number;
}

export function StoryCard({ story, index, hasProgress, isCompleted, completionCount = 0 }: StoryCardProps) {
  const navigate = useNavigate();
  const readCount = getStoredReadCount(story.id);
  const { t } = useLanguage();
  const { text: titleText } = useTranslatedString(story.title);
  const { text: descriptionText } = useTranslatedString(story.description);
  const { exportStoryToPdf, isExporting } = useStoryPdfExport();

  const handleClick = () => {
    navigate(`/stories/${story.id}/start`);
  };

  const handleExportPdf = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click
    
    try {
      // Get stored name and genre if available
      const prenom = sessionStorage.getItem(`story-${story.id}-prenom`) || 'Aventurier';
      const genre = (sessionStorage.getItem(`story-${story.id}-genre`) || 'neutre') as 'masculin' | 'feminin' | 'neutre';
      
      toast.info(t('pdf.generating') || 'Génération du PDF en cours...');
      await exportStoryToPdf(story.id, prenom, genre);
      toast.success(t('pdf.success') || 'PDF téléchargé avec succès !');
    } catch (error) {
      console.error('PDF export error:', error);
      toast.error(t('pdf.error') || 'Erreur lors de la génération du PDF');
    }
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
          alt={titleText}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/40 to-transparent" />
        
        {/* Badges */}
        <div className="absolute top-4 right-4 flex flex-wrap gap-2 justify-end">
          <div className="bg-golden text-golden-foreground px-3 py-1 rounded-full text-sm font-display font-semibold flex items-center gap-1 shadow-lg">
            <Sparkles className="w-3 h-3" />
            {story.level}
          </div>
          {readCount > 0 && (
            <div className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-display font-semibold flex items-center gap-1 shadow-lg">
              <BookOpen className="w-3 h-3" />
              {readCount}
            </div>
          )}
        </div>

        {/* Progress/Completion indicators */}
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          {isCompleted && (
            <div className="bg-ending-happy text-white px-3 py-1 rounded-full text-sm font-display font-semibold flex items-center gap-1 shadow-lg">
              <CheckCircle className="w-3 h-3" />
              {t('card.completed')}{completionCount > 1 ? ` (${completionCount}x)` : ''}
            </div>
          )}
          {hasProgress && !isCompleted && (
            <div className="bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-sm font-display font-semibold flex items-center gap-1 shadow-lg animate-pulse">
              <PlayCircle className="w-3 h-3" />
              {t('card.inProgress')}
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="font-display text-2xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
          {titleText}
        </h3>
        <p className="text-muted-foreground text-base leading-relaxed line-clamp-2">
          {descriptionText}
        </p>
        
        {/* Actions */}
        <div className="mt-4 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-primary font-semibold">
            <span>{hasProgress && !isCompleted ? t('stories.continue') : t('stories.readStory')}</span>
            <svg 
              className="w-5 h-5 transition-transform group-hover:translate-x-2" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </div>
          
          {/* PDF Export Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportPdf}
            disabled={isExporting}
            className="flex items-center gap-1.5 text-muted-foreground hover:text-primary hover:border-primary transition-colors"
            title={t('pdf.export') || 'Exporter en PDF'}
          >
            {isExporting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <FileDown className="w-4 h-4" />
            )}
            <span className="hidden sm:inline">PDF</span>
          </Button>
        </div>
      </div>
    </article>
  );
}
