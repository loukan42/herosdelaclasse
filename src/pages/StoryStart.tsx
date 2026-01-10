import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { BookPage } from "@/components/BookPage";
import { ArrowLeft, Sparkles, User } from "lucide-react";
import { useReadCount } from "@/hooks/useReadCount";
import { useAuthContext } from "@/contexts/AuthContext";
import { useCombinedStories } from "@/hooks/useCombinedStories";
import { LanguageSelector } from "@/components/LanguageSelector";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTranslatedString } from "@/hooks/useTranslatedString";
import { useChildProfiles } from "@/contexts/ChildProfileContext";

type Genre = 'masculin' | 'feminin';

export default function StoryStart() {
  const { storyId } = useParams<{ storyId: string }>();
  const navigate = useNavigate();
  const { getStory } = useCombinedStories();
  const story = getStory(storyId || "");
  const { isAuthenticated, loading } = useAuthContext();
  const { activeProfile } = useChildProfiles();
  const { t } = useLanguage();

  const [prenom, setPrenom] = useState("");
  const [genre, setGenre] = useState<Genre | null>(null);

  // Pre-fill prenom and genre from CHILD profile when authenticated
  useEffect(() => {
    if (isAuthenticated && activeProfile) {
      if (activeProfile.prenom) {
        setPrenom(activeProfile.prenom);
      }
      if (activeProfile.genre) {
        setGenre(activeProfile.genre);
      }
    }
  }, [isAuthenticated, activeProfile]);

  if (!story) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <BookPage className="max-w-md text-center">
          <h1 className="font-display text-3xl text-foreground mb-4">{t('stories.notFound')}</h1>
          <p className="text-muted-foreground mb-6">{t('stories.notFoundDesc')}</p>
          <Link 
            to="/stories" 
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-xl font-semibold hover:bg-primary/90 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            {t('nav.backToStories')}
          </Link>
        </BookPage>
      </div>
    );
  }

  const { incrementCount } = useReadCount(storyId || "");
  const { text: titleText } = useTranslatedString(story.title);
  const { text: descriptionText } = useTranslatedString(story.description);

  const handleStart = () => {
    // Use the profile genre for authenticated users if local state is not set
    const effectiveGenre = genre || (isAuthenticated && activeProfile?.genre) || null;
    const effectivePrenom = prenom.trim() || (isAuthenticated && activeProfile?.prenom) || "";
    
    if (!effectivePrenom || !effectiveGenre) {
      return;
    }
    // Store preferences in sessionStorage
    sessionStorage.setItem(`story-${storyId}-prenom`, effectivePrenom);
    sessionStorage.setItem(`story-${storyId}-genre`, effectiveGenre);
    // Increment read count
    incrementCount();
    navigate(`/stories/${storyId}/page/${story.startPageId}`);
  };

  // If authenticated with child profile prenom AND genre, skip to simplified view
  const canAutoStart = isAuthenticated && activeProfile?.prenom && activeProfile?.genre && !loading;

  return (
    <main className="min-h-screen bg-background py-8 px-4">
      {/* Language Selector */}
      <div className="absolute top-4 right-4 z-20">
        <LanguageSelector />
      </div>

      <div className="container max-w-4xl mx-auto">
        {/* Back Link */}
        <Link 
          to="/stories"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8 font-semibold"
        >
          <ArrowLeft className="w-5 h-5" />
          {t('nav.backToStories')}
        </Link>

        <BookPage className="fade-up">
          {/* Cover Section */}
          <div className="flex flex-col lg:flex-row gap-8 items-center mb-10">
            <div className="w-full lg:w-1/2 aspect-[4/3] rounded-2xl overflow-hidden shadow-book">
              <img 
                src={story.coverImage} 
                alt={titleText}
                className="w-full h-full object-cover"
              />
            </div>
            
            <div className="flex-1 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 bg-golden/20 text-golden-foreground px-3 py-1 rounded-full mb-4">
                <Sparkles className="w-3 h-3 text-golden" />
                <span className="text-sm font-semibold">{story.level}</span>
              </div>
              
              <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
                {titleText}
              </h1>
              
              <p className="text-lg text-muted-foreground leading-relaxed">
                {descriptionText}
              </p>
            </div>
          </div>

          {/* Form Section */}
          <div className="border-t border-border pt-8">
            {canAutoStart ? (
              // Authenticated user with known prenom AND genre - simplified view
              <div className="max-w-md mx-auto text-center space-y-6">
                <div className="flex items-center justify-center gap-3 text-foreground">
                  <User className="w-6 h-6 text-primary" />
                  <span className="font-display text-2xl">
                    {t('start.ready')} <span className="text-primary font-bold">{activeProfile?.prenom}</span> ?
                  </span>
                </div>

                <button
                  onClick={handleStart}
                  className="w-full py-5 px-8 rounded-2xl font-display font-bold text-xl bg-primary text-primary-foreground hover:-translate-y-1 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-3"
                >
                  <Sparkles className="w-6 h-6" />
                  {t('start.begin')}
                </button>
              </div>
            ) : (
              // Guest user OR authenticated without genre - show full form
              <>
                <h2 className="font-display text-2xl text-foreground text-center mb-8">
                  {t('start.customize')}
                </h2>

                <div className="max-w-md mx-auto space-y-8">
                  {/* Prenom Input - only show if not from profile */}
                  {!(isAuthenticated && activeProfile?.prenom) && (
                    <div>
                      <label className="flex items-center gap-2 text-foreground font-semibold mb-3">
                        <User className="w-5 h-5 text-primary" />
                        {t('start.yourName')}
                      </label>
                      <input
                        type="text"
                        value={prenom}
                        onChange={(e) => setPrenom(e.target.value)}
                        placeholder={t('start.namePlaceholder')}
                        className="w-full px-6 py-4 rounded-xl bg-background border-2 border-border focus:border-primary focus:outline-none font-body text-xl transition-colors"
                        maxLength={20}
                      />
                    </div>
                  )}

                  {/* If authenticated with prenom but no genre, show greeting */}
                  {isAuthenticated && activeProfile?.prenom && !activeProfile?.genre && (
                    <div className="flex items-center justify-center gap-3 text-foreground">
                      <User className="w-6 h-6 text-primary" />
                      <span className="font-display text-2xl">
                        Bonjour <span className="text-primary font-bold">{activeProfile.prenom}</span> !
                      </span>
                    </div>
                  )}

                  {/* Genre Selection */}
                  <div>
                    <label className="block text-foreground font-semibold mb-3 text-center">
                      Tu es une fille ou un garçon ?
                    </label>
                    <p className="text-sm text-muted-foreground text-center mb-4">
                      L'histoire sera écrite au féminin ou au masculin
                    </p>
                    <div className="flex justify-center gap-4">
                      <button
                        type="button"
                        onClick={() => setGenre('feminin')}
                        className={`
                          flex-1 max-w-[160px] py-5 px-6 rounded-2xl font-bold text-xl transition-all
                          ${genre === 'feminin' 
                            ? 'bg-pink-500 text-white ring-4 ring-pink-300 scale-105 shadow-lg' 
                            : 'bg-pink-100 text-pink-700 hover:bg-pink-200 hover:scale-102'}
                        `}
                      >
                        👧 Fille
                      </button>
                      <button
                        type="button"
                        onClick={() => setGenre('masculin')}
                        className={`
                          flex-1 max-w-[160px] py-5 px-6 rounded-2xl font-bold text-xl transition-all
                          ${genre === 'masculin' 
                            ? 'bg-blue-500 text-white ring-4 ring-blue-300 scale-105 shadow-lg' 
                            : 'bg-blue-100 text-blue-700 hover:bg-blue-200 hover:scale-102'}
                        `}
                      >
                        👦 Garçon
                      </button>
                    </div>
                  </div>

                  {/* Start Button */}
                  <button
                    onClick={handleStart}
                    disabled={!prenom.trim() || !genre}
                    className={`
                      w-full py-5 px-8 rounded-2xl font-display font-bold text-xl
                      transition-all duration-300 shadow-lg hover:shadow-xl
                      flex items-center justify-center gap-3
                      ${prenom.trim() && genre
                        ? 'bg-primary text-primary-foreground hover:-translate-y-1'
                        : 'bg-muted text-muted-foreground cursor-not-allowed'}
                    `}
                  >
                    <Sparkles className="w-6 h-6" />
                    {t('start.begin')}
                  </button>
                </div>
              </>
            )}
          </div>
        </BookPage>
      </div>
    </main>
  );
}
