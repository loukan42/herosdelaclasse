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
import { LanguageSelector } from "@/components/LanguageSelector";
import { useLanguage } from "@/contexts/LanguageContext";

type Genre = 'masculin' | 'feminin' | 'neutre';

export default function StoryReader() {
  const { storyId, pageId } = useParams<{ storyId: string; pageId: string }>();
  const navigate = useNavigate();
  const [isAnimating, setIsAnimating] = useState(true);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [visitedPages, setVisitedPages] = useState<string[]>([]);
  const [newlyCollectedItem, setNewlyCollectedItem] = useState<string | null>(null);
  const [overriddenText, setOverriddenText] = useState<string | null>(null);
  const [translatedText, setTranslatedText] = useState<string | null>(null);
  const [isTranslating, setIsTranslating] = useState(false);
  const [translatedStoryTitle, setTranslatedStoryTitle] = useState<string | null>(null);
  const [translatedPageTitle, setTranslatedPageTitle] = useState<string | null>(null);
  const [translatedChoices, setTranslatedChoices] = useState<string[] | null>(null);
  const previousVisitedRef = useRef<string[]>([]);
  const hasMarkedCompleteRef = useRef<string | null>(null);

  const { getStory, getPage } = useCombinedStories();
  const story = getStory(storyId || "");
  const page = getPage(storyId || "", pageId || "");
  const { t, translateText, language } = useLanguage();

  const storedPrenom = sessionStorage.getItem(`story-${storyId}-prenom`);
  const prenom = storedPrenom || "Aventurier";
  const genre = (sessionStorage.getItem(`story-${storyId}-genre`) || "neutre") as Genre;

  // Redirect to start page if no prenom is set (user accessed page directly)
  useEffect(() => {
    if (!storedPrenom && storyId && story) {
      navigate(`/stories/${storyId}/start`, { replace: true });
    }
  }, [storedPrenom, storyId, story, navigate]);

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

  // Mark story as completed when reaching an ending (only once per page)
  useEffect(() => {
    const currentPageId = pageId || '';
    // Only mark as completed if we haven't already for this specific ending page
    if (isAuthenticated && page?.isEnding && hasMarkedCompleteRef.current !== currentPageId) {
      hasMarkedCompleteRef.current = currentPageId;
      markCompleted(page.endingType);
    }
  }, [isAuthenticated, page?.isEnding, page?.endingType, markCompleted, pageId]);

  // Scroll to top when page changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [pageId]);

  useEffect(() => {
    setIsAnimating(true);
    setImageLoaded(false);
    setOverriddenText(null); // Reset override on page change
    setTranslatedText(null); // Reset translation on page change
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

  // Translate page main text when language changes or page changes
  useEffect(() => {
    let isCancelled = false;
    
    const doTranslation = async () => {
      if (language === 'fr' || !page) {
        setTranslatedText(null);
        setIsTranslating(false);
        return;
      }

      const textToTranslate = overriddenText || page.text;
      const processedFrench = processText(
        textToTranslate,
        prenom,
        genre,
        page.textMasculine,
        page.textFeminine
      );

      setIsTranslating(true);
      try {
        const translated = await translateText(processedFrench);
        if (!isCancelled) {
          setTranslatedText(translated);
        }
      } catch (err) {
        console.error('Translation failed:', err);
        if (!isCancelled) {
          // On error, show original French text instead of staying in loading state
          setTranslatedText(null);
        }
      } finally {
        if (!isCancelled) {
          setIsTranslating(false);
        }
      }
    };

    // Add a maximum timeout to prevent infinite loading
    const timeoutId = setTimeout(() => {
      if (!isCancelled) {
        setIsTranslating(false);
      }
    }, 15000); // 15s max

    doTranslation();

    return () => {
      isCancelled = true;
      clearTimeout(timeoutId);
    };
  }, [language, page, overriddenText, prenom, genre, translateText]);

  // Translate story title, page title, and choices (non-blocking)
  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      if (language === 'fr' || !story || !page) {
        setTranslatedStoryTitle(null);
        setTranslatedPageTitle(null);
        setTranslatedChoices(null);
        return;
      }

      try {
        const processedChoices = page.choices.map((c) => processText(c.label, prenom, genre));

        const [storyTitle, pageTitle, ...choices] = await Promise.all([
          translateText(story.title),
          page.title ? translateText(page.title) : Promise.resolve(''),
          ...processedChoices.map((l) => translateText(l)),
        ]);

        if (cancelled) return;

        setTranslatedStoryTitle(storyTitle);
        setTranslatedPageTitle(page.title ? pageTitle : null);
        setTranslatedChoices(choices);
      } catch (e) {
        console.error('Meta translation failed:', e);
        if (!cancelled) {
          setTranslatedStoryTitle(null);
          setTranslatedPageTitle(null);
          setTranslatedChoices(null);
        }
      }
    };

    run();

    return () => {
      cancelled = true;
    };
  }, [language, story?.title, pageId, page?.title, prenom, genre, translateText]);

  if (!story || !page) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <BookPage className="max-w-md text-center">
          <h1 className="font-display text-3xl text-foreground mb-4">{t('stories.pageNotFound')}</h1>
          <p className="text-muted-foreground mb-6">{t('stories.pageNotFoundDesc')}</p>
          <Link 
            to="/stories" 
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-xl font-semibold hover:bg-primary/90 transition-colors"
          >
            <Home className="w-4 h-4" />
            {t('nav.backToStories')}
          </Link>
        </BookPage>
      </div>
    );
  }

  // Use override text if available, otherwise original
  const textToProcess = overriddenText || page.text;
  
  // Use translated text if available, otherwise process the French text
  const displayText = translatedText || processText(
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
  const textLines = displayText.split('\n').filter(line => line.trim());

  const handlePlayAudio = () => {
    if (isSpeaking) {
      stop();
    } else {
      speak(displayText);
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
            <span className="hidden sm:inline">{t('nav.leaveStory')}</span>
          </Link>
          
          <div className="flex items-center gap-2">
            <LanguageSelector />
            <span className="font-display text-base md:text-lg text-muted-foreground">
              {translatedStoryTitle || story.title}
            </span>
          </div>
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
                      <span>{t('reader.endingHappy')}</span>
                      <Star className="w-4 h-4 md:w-5 md:h-5 animate-sparkle" />
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5 md:w-6 md:h-6" />
                      <span>{t('reader.endingAlt')}</span>
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
                {translatedPageTitle || page.title}
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
                      {t('reader.stop')}
                    </>
                  ) : (
                    <>
                      <Volume2 className="w-4 h-4 md:w-5 md:h-5" />
                      {t('reader.listen')}
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
                  {t('reader.coloringDownload')}
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
              {isTranslating && (
                <div className="flex items-center justify-center py-2 mb-2">
                  <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin mr-2" />
                  <span className="text-sm text-muted-foreground">{t('common.loading')}</span>
                </div>
              )}
              {textLines.map((line, index) => (
                <p 
                  key={index}
                  className={`text-lg md:text-xl lg:text-2xl leading-relaxed text-foreground text-left font-body ${isTranslating ? 'opacity-60' : ''}`}
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
                    {t('stories.restart')}
                  </button>
                  
                  <button
                    onClick={handleBackToStories}
                    className="inline-flex items-center justify-center gap-2 md:gap-3 bg-secondary text-secondary-foreground px-6 md:px-8 py-3 md:py-4 rounded-xl md:rounded-2xl font-display font-bold text-base md:text-lg hover:-translate-y-1 transition-all shadow-lg hover:shadow-xl"
                  >
                    <Home className="w-4 h-4 md:w-5 md:h-5" />
                    {t('stories.otherStories')}
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
                  {t('reader.whatToDo')}
                </h2>
                {/* Check if choices have images */}
                {page.choices.some(choice => choice.image) ? (
                  <div className="grid grid-cols-2 gap-4 md:gap-6">
                    {page.choices.map((choice, index) => {
                      const processedLabel = processText(choice.label, prenom, genre);
                      return (
                        <ImageChoiceButton
                          key={index}
                          image={choice.image!}
                          label={translatedChoices?.[index] || processedLabel}
                          onClick={() => handleChoice(choice.targetPageId)}
                          className="fade-up"
                          style={{ animationDelay: `${(index + 1) * 0.1}s`, animationFillMode: 'both' }}
                        />
                      );
                    })}
                  </div>
                ) : (
                  <div className="grid gap-3 md:gap-4">
                    {page.choices.map((choice, index) => {
                      const processedLabel = processText(choice.label, prenom, genre);
                      return (
                        <ChoiceButton
                          key={index}
                          variant={(index + 1) as 1 | 2 | 3 | 4}
                          onClick={() => handleChoice(choice.targetPageId)}
                          className="fade-up text-base md:text-lg"
                          style={{ animationDelay: `${(index + 1) * 0.1}s`, animationFillMode: 'both' }}
                        >
                          {translatedChoices?.[index] || processedLabel}
                        </ChoiceButton>
                      );
                    })}
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
