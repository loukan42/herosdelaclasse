import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { processText } from "@/data/stories";
import { BookPage } from "@/components/BookPage";
import { ChoiceButton } from "@/components/ChoiceButton";
import { ImageChoiceButton } from "@/components/ImageChoiceButton";
import { StoryInventory } from "@/components/StoryInventory";
import { StoryTextEditor } from "@/components/StoryTextEditor";

import { ArrowLeft, Home, RotateCcw, Sparkles, Trophy, Star, Volume2, VolumeX, Download } from "lucide-react";
import { SocialShare } from "@/components/SocialShare";
import dinosaurColoringPage from "@/assets/coloring/dinosaur-footprints-coloring.png";
import { useSpeechSynthesis } from "@/hooks/useSpeechSynthesis";
import { useStoryProgress } from "@/hooks/useStoryProgress";
import { useStoryOverrides } from "@/hooks/useStoryOverrides";
import { useAuthContext } from "@/contexts/AuthContext";
import { useAdmin } from "@/hooks/useAdmin";
import { useCombinedStories } from "@/hooks/useCombinedStories";

type Genre = 'masculin' | 'feminin' | 'neutre';

export default function StoryReader() {
  const { storyId, pageId } = useParams<{ storyId: string; pageId: string }>();
  const navigate = useNavigate();
  const [isAnimating, setIsAnimating] = useState(true);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [visitedPages, setVisitedPages] = useState<string[]>([]);
  const [newlyCollectedItem, setNewlyCollectedItem] = useState<string | null>(null);
  const [overriddenText, setOverriddenText] = useState<string | null>(null);
  const previousVisitedRef = useRef<string[]>([]);

  const { getStory, getPage } = useCombinedStories();
  const story = getStory(storyId || "");
  const page = getPage(storyId || "", pageId || "");

  const prenom = sessionStorage.getItem(`story-${storyId}-prenom`) || "Aventurier";
  const genre = (sessionStorage.getItem(`story-${storyId}-genre`) || "neutre") as Genre;

  const { speak, stop, isSpeaking, isSupported } = useSpeechSynthesis({ lang: "fr-FR", rate: 0.9 });
  const { saveProgress, markCompleted, isAuthenticated } = useStoryProgress(storyId);
  const { profile } = useAuthContext();
  const { isAdmin } = useAdmin();
  const { getOverride } = useStoryOverrides();

  // Load visited pages from sessionStorage or from saved progress
  useEffect(() => {
    const saved = sessionStorage.getItem(`story-${storyId}-visited`);
    if (saved) {
      const parsed = JSON.parse(saved);
      setVisitedPages(parsed);
      previousVisitedRef.current = parsed;
    }
  }, [storyId]);

  // Track visited pages and detect new items
  useEffect(() => {
    if (pageId && !visitedPages.includes(pageId)) {
      const newVisited = [...visitedPages, pageId];
      setVisitedPages(newVisited);
      sessionStorage.setItem(`story-${storyId}-visited`, JSON.stringify(newVisited));
      
      // Check if this page gives a new inventory item
      if (!previousVisitedRef.current.includes(pageId)) {
        setNewlyCollectedItem(pageId);
        // Clear the animation after 2 seconds
        setTimeout(() => setNewlyCollectedItem(null), 2500);
      }
      previousVisitedRef.current = newVisited;
    }
  }, [pageId, storyId, visitedPages]);

  // Save progress to database when page changes (for authenticated users)
  useEffect(() => {
    if (isAuthenticated && pageId && visitedPages.length > 0) {
      saveProgress(pageId, visitedPages, prenom);
    }
  }, [pageId, visitedPages, isAuthenticated, saveProgress, prenom]);

  // Mark story as completed when reaching an ending
  useEffect(() => {
    if (isAuthenticated && page?.isEnding) {
      markCompleted(page.endingType);
    }
  }, [isAuthenticated, page?.isEnding, page?.endingType, markCompleted]);

  // Scroll to top when page changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [pageId]);

  useEffect(() => {
    setIsAnimating(true);
    setImageLoaded(false);
    setOverriddenText(null); // Reset override on page change
    stop(); // Stop any playing audio when page changes
    const timer = setTimeout(() => setIsAnimating(false), 600);
    return () => clearTimeout(timer);
  }, [pageId, stop]);

  // Check for text override
  useEffect(() => {
    if (storyId && pageId) {
      const override = getOverride(storyId, pageId);
      if (override) {
        setOverriddenText(override.text);
      }
    }
  }, [storyId, pageId, getOverride]);

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

  // Use override text if available, otherwise original
  const textToProcess = overriddenText || page.text;
  
  const processedText = processText(
    textToProcess,
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

  // Split text into lines for better readability
  const textLines = processedText.split('\n').filter(line => line.trim());

  const handlePlayAudio = () => {
    if (isSpeaking) {
      stop();
    } else {
      speak(processedText);
    }
  };

  const handleDownloadColoring = () => {
    const link = document.createElement('a');
    link.href = dinosaurColoringPage;
    link.download = 'coloriage-empreintes-dinosaure.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Check if current page should show coloring download (empreintes story, page 5)
  const showColoringDownload = storyId === "le-secret-des-empreintes" && pageId === "page-5";

  return (
    <main className="min-h-screen bg-background py-4 md:py-6 lg:py-8 px-3 md:px-4">
      <div className="container max-w-5xl mx-auto">
        {/* Navigation Header */}
        <nav className="flex items-center justify-between mb-4 md:mb-6">
          <Link 
            to="/stories"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors font-semibold"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="hidden sm:inline">Quitter l'histoire</span>
          </Link>
          
          <span className="font-display text-base md:text-lg text-muted-foreground">
            {story.title}
          </span>
        </nav>

        {/* Book Content */}
        <article className={`${isAnimating ? 'page-turn-enter' : ''}`}>
          <BookPage className="p-4 md:p-6 lg:p-10">
            {/* Ending Badge */}
            {page.isEnding && (
              <div className={`
                mb-4 md:mb-6 py-2 md:py-3 px-4 md:px-6 rounded-2xl text-center font-display font-bold text-base md:text-lg
                ${page.endingType === 'happy' 
                  ? 'bg-ending-happy/20 text-ending-happy' 
                  : 'bg-ending-alt/20 text-ending-alt'}
              `}>
                <div className="flex items-center justify-center gap-2">
                  {page.endingType === 'happy' ? (
                    <>
                      <Trophy className="w-5 h-5 md:w-6 md:h-6" />
                      <span>Fin de l'histoire !</span>
                      <Star className="w-4 h-4 md:w-5 md:h-5 animate-sparkle" />
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5 md:w-6 md:h-6" />
                      <span>Une autre fin...</span>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Illustration with lazy loading */}
            <div className="relative rounded-xl md:rounded-2xl overflow-hidden shadow-lg mb-4 md:mb-6 -mx-2 md:mx-0 bg-muted/30">
              {!imageLoaded && (
                <div className="absolute inset-0 flex items-center justify-center bg-muted/50">
                  <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                </div>
              )}
              <img 
                src={page.image} 
                alt={page.title || "Illustration de l'histoire"}
                className={`w-full h-auto object-contain max-h-[50vh] md:max-h-[55vh] lg:max-h-[60vh] mx-auto transition-opacity duration-300 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
                loading="lazy"
                decoding="async"
                onLoad={() => setImageLoaded(true)}
              />
            </div>

            {/* Inventory - below image */}
            <div className="mb-4 md:mb-6">
              <StoryInventory 
                visitedPages={visitedPages} 
                storyId={storyId || ""} 
                newlyCollectedPageId={newlyCollectedItem}
              />
            </div>

            {/* Page Title */}
            {page.title && (
              <h1 className="font-display text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-4 md:mb-6 text-center">
                {page.title}
              </h1>
            )}

            {/* Audio and Coloring Buttons */}
            <div className="flex flex-wrap justify-center gap-3 mb-4 md:mb-6">
              {isSupported && (
                <button
                  onClick={handlePlayAudio}
                  className={`
                    inline-flex items-center gap-2 px-4 py-2 rounded-full font-semibold text-sm md:text-base
                    transition-all duration-300 shadow-md hover:shadow-lg
                    ${isSpeaking 
                      ? 'bg-primary text-primary-foreground animate-pulse' 
                      : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'}
                  `}
                >
                  {isSpeaking ? (
                    <>
                      <VolumeX className="w-4 h-4 md:w-5 md:h-5" />
                      Arrêter
                    </>
                  ) : (
                    <>
                      <Volume2 className="w-4 h-4 md:w-5 md:h-5" />
                      Écouter l'histoire
                    </>
                  )}
                </button>
              )}
              
              {showColoringDownload && (
                <button
                  onClick={handleDownloadColoring}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full font-semibold text-sm md:text-base
                    transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-0.5
                    bg-amber-500 text-white hover:bg-amber-600"
                >
                  <Download className="w-4 h-4 md:w-5 md:h-5" />
                  Coloriage dinosaures
                </button>
              )}
            </div>

            {/* Admin Edit Button */}
            {isAdmin && storyId && pageId && (
              <StoryTextEditor
                storyId={storyId}
                pageId={pageId}
                originalText={page.text}
                originalTextMasculine={page.textMasculine}
                originalTextFeminine={page.textFeminine}
                currentText={overriddenText || page.text}
                onTextUpdate={(newText) => setOverriddenText(newText)}
              />
            )}

            {/* Story Text - Line by line */}
            <div className="mb-6 md:mb-8 lg:mb-10 space-y-2 md:space-y-3 max-w-prose mx-auto">
              {textLines.map((line, index) => (
                <p 
                  key={index}
                  className="text-lg md:text-xl lg:text-2xl leading-relaxed text-foreground text-left font-body"
                >
                  {line}
                </p>
              ))}
            </div>


            {/* Choices or Ending Actions */}
            {page.isEnding ? (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center">
                  <button
                    onClick={handleRestart}
                    className="inline-flex items-center justify-center gap-2 md:gap-3 bg-primary text-primary-foreground px-6 md:px-8 py-3 md:py-4 rounded-xl md:rounded-2xl font-display font-bold text-base md:text-lg hover:-translate-y-1 transition-all shadow-lg hover:shadow-xl"
                  >
                    <RotateCcw className="w-4 h-4 md:w-5 md:h-5" />
                    Recommencer cette histoire
                  </button>
                  
                  <button
                    onClick={handleBackToStories}
                    className="inline-flex items-center justify-center gap-2 md:gap-3 bg-secondary text-secondary-foreground px-6 md:px-8 py-3 md:py-4 rounded-xl md:rounded-2xl font-display font-bold text-base md:text-lg hover:-translate-y-1 transition-all shadow-lg hover:shadow-xl"
                  >
                    <Home className="w-4 h-4 md:w-5 md:h-5" />
                    Autres histoires
                  </button>
                </div>

                {/* Social Share Section */}
                <div className="pt-4 border-t border-border/50">
                  <SocialShare />
                </div>
              </div>
            ) : (
              <div className="space-y-3 md:space-y-4">
                <h2 className="font-display text-lg md:text-xl text-center text-muted-foreground mb-4 md:mb-6">
                  Que veux-tu faire ?
                </h2>
                {/* Check if choices have images */}
                {page.choices.some(choice => choice.image) ? (
                  <div className="grid grid-cols-2 gap-4 md:gap-6">
                    {page.choices.map((choice, index) => (
                      <ImageChoiceButton
                        key={index}
                        image={choice.image!}
                        label={choice.label}
                        onClick={() => handleChoice(choice.targetPageId)}
                        className="fade-up"
                        style={{ animationDelay: `${(index + 1) * 0.1}s`, animationFillMode: 'both' }}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="grid gap-3 md:gap-4">
                    {page.choices.map((choice, index) => (
                      <ChoiceButton
                        key={index}
                        variant={(index + 1) as 1 | 2 | 3 | 4}
                        onClick={() => handleChoice(choice.targetPageId)}
                        className="fade-up text-base md:text-lg"
                        style={{ animationDelay: `${(index + 1) * 0.1}s`, animationFillMode: 'both' }}
                      >
                        {choice.label}
                      </ChoiceButton>
                    ))}
                  </div>
                )}
              </div>
            )}
          </BookPage>
        </article>
      </div>
    </main>
  );
}
