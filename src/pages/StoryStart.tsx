import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getStory } from "@/data/stories";
import { BookPage } from "@/components/BookPage";
import { ArrowLeft, Sparkles, User, Heart } from "lucide-react";

type Genre = 'masculin' | 'feminin' | 'neutre';

export default function StoryStart() {
  const { storyId } = useParams<{ storyId: string }>();
  const navigate = useNavigate();
  const story = getStory(storyId || "");

  const [prenom, setPrenom] = useState("");
  const [genre, setGenre] = useState<Genre>("neutre");

  if (!story) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <BookPage className="max-w-md text-center">
          <h1 className="font-display text-3xl text-foreground mb-4">Histoire introuvable</h1>
          <p className="text-muted-foreground mb-6">Cette histoire n'existe pas encore.</p>
          <Link 
            to="/stories" 
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-xl font-semibold hover:bg-primary/90 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour aux histoires
          </Link>
        </BookPage>
      </div>
    );
  }

  const handleStart = () => {
    if (!prenom.trim()) {
      return;
    }
    // Store preferences in sessionStorage
    sessionStorage.setItem(`story-${storyId}-prenom`, prenom);
    sessionStorage.setItem(`story-${storyId}-genre`, genre);
    navigate(`/stories/${storyId}/page/${story.startPageId}`);
  };

  return (
    <main className="min-h-screen bg-background py-8 px-4">
      <div className="container max-w-4xl mx-auto">
        {/* Back Link */}
        <Link 
          to="/stories"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8 font-semibold"
        >
          <ArrowLeft className="w-5 h-5" />
          Retour aux histoires
        </Link>

        <BookPage className="fade-up">
          {/* Cover Section */}
          <div className="flex flex-col lg:flex-row gap-8 items-center mb-10">
            <div className="w-full lg:w-1/2 aspect-[4/3] rounded-2xl overflow-hidden shadow-book">
              <img 
                src={story.coverImage} 
                alt={story.title}
                className="w-full h-full object-cover"
              />
            </div>
            
            <div className="flex-1 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 bg-golden/20 text-golden-foreground px-3 py-1 rounded-full mb-4">
                <Sparkles className="w-3 h-3 text-golden" />
                <span className="text-sm font-semibold">{story.ageMin}-{story.ageMax} ans</span>
              </div>
              
              <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
                {story.title}
              </h1>
              
              <p className="text-lg text-muted-foreground leading-relaxed">
                {story.description}
              </p>
            </div>
          </div>

          {/* Form Section */}
          <div className="border-t border-border pt-8">
            <h2 className="font-display text-2xl text-foreground text-center mb-8">
              Personnalise ton aventure !
            </h2>

            <div className="max-w-md mx-auto space-y-6">
              {/* Prenom Input */}
              <div>
                <label className="flex items-center gap-2 text-foreground font-semibold mb-3">
                  <User className="w-5 h-5 text-primary" />
                  Comment t'appelles-tu ?
                </label>
                <input
                  type="text"
                  value={prenom}
                  onChange={(e) => setPrenom(e.target.value)}
                  placeholder="Ton prénom..."
                  className="w-full px-6 py-4 rounded-xl bg-background border-2 border-border focus:border-primary focus:outline-none font-body text-xl transition-colors"
                  maxLength={20}
                />
              </div>

              {/* Genre Selection */}
              <div>
                <label className="flex items-center gap-2 text-foreground font-semibold mb-3">
                  <Heart className="w-5 h-5 text-primary" />
                  Veux-tu que l'histoire s'adapte ?
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { value: 'masculin' as Genre, label: 'Masculin', emoji: '👦' },
                    { value: 'feminin' as Genre, label: 'Féminin', emoji: '👧' },
                    { value: 'neutre' as Genre, label: 'Pas de préférence', emoji: '✨' },
                  ].map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setGenre(option.value)}
                      className={`
                        p-4 rounded-xl border-2 transition-all duration-300 font-semibold
                        ${genre === option.value 
                          ? 'border-primary bg-primary/10 text-foreground shadow-lg' 
                          : 'border-border bg-background text-muted-foreground hover:border-primary/50'}
                      `}
                    >
                      <span className="text-2xl block mb-1">{option.emoji}</span>
                      <span className="text-sm">{option.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Start Button */}
              <button
                onClick={handleStart}
                disabled={!prenom.trim()}
                className={`
                  w-full py-5 px-8 rounded-2xl font-display font-bold text-xl
                  transition-all duration-300 shadow-lg hover:shadow-xl
                  flex items-center justify-center gap-3
                  ${prenom.trim()
                    ? 'bg-primary text-primary-foreground hover:-translate-y-1'
                    : 'bg-muted text-muted-foreground cursor-not-allowed'}
                `}
              >
                <Sparkles className="w-6 h-6" />
                Commencer l'aventure !
              </button>
            </div>
          </div>
        </BookPage>
      </div>
    </main>
  );
}
