import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getStory, getPage, processText } from "@/data/stories";
import { BookPage } from "@/components/BookPage";
import { ChoiceButton } from "@/components/ChoiceButton";
import { ArrowLeft, Home, RotateCcw, Sparkles, Trophy, Star } from "lucide-react";

type Genre = 'masculin' | 'feminin' | 'neutre';

export default function StoryReader() {
  const { storyId, pageId } = useParams<{ storyId: string; pageId: string }>();
  const navigate = useNavigate();
  const [isAnimating, setIsAnimating] = useState(true);

  const story = getStory(storyId || "");
  const page = getPage(storyId || "", pageId || "");

  const prenom = sessionStorage.getItem(`story-${storyId}-prenom`) || "Aventurier";
  const genre = (sessionStorage.getItem(`story-${storyId}-genre`) || "neutre") as Genre;

  useEffect(() => {
    setIsAnimating(true);
    const timer = setTimeout(() => setIsAnimating(false), 600);
    return () => clearTimeout(timer);
  }, [pageId]);

  if (!story || !page) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <BookPage className="max-w-md text-center">
          <h1 className="font-display text-3xl text-foreground mb-4">Page introuvable</h1>
          <p className="text-muted-foreground mb-6">Cette page n'existe pas.</p>
          <Link 
            to="/stories" 
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-xl font-semibold hover:bg-primary/90 transition-colors"
          >
            <Home className="w-4 h-4" />
            Retour aux histoires
          </Link>
        </BookPage>
      </div>
    );
  }

  const processedText = processText(
    page.text,
    prenom,
    genre,
    page.textMasculine,
    page.textFeminine
  );

  const handleChoice = (targetPageId: string) => {
    navigate(`/stories/${storyId}/page/${targetPageId}`);
  };

  const handleRestart = () => {
    navigate(`/stories/${storyId}/start`);
  };

  const handleBackToStories = () => {
    navigate("/stories");
  };

  return (
    <main className="min-h-screen bg-background py-6 md:py-8 px-4">
      <div className="container max-w-4xl mx-auto">
        {/* Navigation Header */}
        <nav className="flex items-center justify-between mb-6">
          <Link 
            to="/stories"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors font-semibold"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="hidden sm:inline">Quitter l'histoire</span>
          </Link>
          
          <span className="font-display text-lg text-muted-foreground">
            {story.title}
          </span>
        </nav>

        {/* Book Content */}
        <article className={`${isAnimating ? 'page-turn-enter' : ''}`}>
          <BookPage>
            {/* Ending Badge */}
            {page.isEnding && (
              <div className={`
                mb-6 py-3 px-6 rounded-2xl text-center font-display font-bold text-lg
                ${page.endingType === 'happy' 
                  ? 'bg-ending-happy/20 text-ending-happy' 
                  : 'bg-ending-alt/20 text-ending-alt'}
              `}>
                <div className="flex items-center justify-center gap-2">
                  {page.endingType === 'happy' ? (
                    <>
                      <Trophy className="w-6 h-6" />
                      <span>Fin de l'histoire !</span>
                      <Star className="w-5 h-5 animate-sparkle" />
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-6 h-6" />
                      <span>Une autre fin...</span>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Illustration */}
            <div className="relative aspect-[16/9] md:aspect-[2/1] rounded-2xl overflow-hidden shadow-lg mb-8">
              <img 
                src={page.image} 
                alt={page.title || "Illustration de l'histoire"}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/20 to-transparent" />
            </div>

            {/* Page Title */}
            {page.title && (
              <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-6 text-center">
                {page.title}
              </h1>
            )}

            {/* Story Text */}
            <div className="prose prose-lg max-w-none mb-10">
              <p className="text-xl md:text-2xl leading-relaxed text-foreground text-center font-body">
                {processedText}
              </p>
            </div>

            {/* Choices or Ending Actions */}
            {page.isEnding ? (
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={handleRestart}
                  className="inline-flex items-center justify-center gap-3 bg-primary text-primary-foreground px-8 py-4 rounded-2xl font-display font-bold text-lg hover:-translate-y-1 transition-all shadow-lg hover:shadow-xl"
                >
                  <RotateCcw className="w-5 h-5" />
                  Recommencer cette histoire
                </button>
                
                <button
                  onClick={handleBackToStories}
                  className="inline-flex items-center justify-center gap-3 bg-secondary text-secondary-foreground px-8 py-4 rounded-2xl font-display font-bold text-lg hover:-translate-y-1 transition-all shadow-lg hover:shadow-xl"
                >
                  <Home className="w-5 h-5" />
                  Autres histoires
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <h2 className="font-display text-xl text-center text-muted-foreground mb-6">
                  Que veux-tu faire ?
                </h2>
                <div className="grid gap-4">
                  {page.choices.map((choice, index) => (
                    <ChoiceButton
                      key={index}
                      variant={(index + 1) as 1 | 2 | 3 | 4}
                      onClick={() => handleChoice(choice.targetPageId)}
                      className="fade-up"
                      style={{ animationDelay: `${(index + 1) * 0.1}s`, animationFillMode: 'both' }}
                    >
                      {choice.label}
                    </ChoiceButton>
                  ))}
                </div>
              </div>
            )}
          </BookPage>
        </article>
      </div>
    </main>
  );
}
