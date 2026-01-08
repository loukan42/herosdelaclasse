import { Link, Navigate } from 'react-router-dom';
import { ArrowLeft, Star, Clock, Lock, CheckCircle } from 'lucide-react';
import { useAuthContext } from '@/contexts/AuthContext';
import { useUserPoints } from '@/hooks/useUserPoints';
import { useCollection } from '@/hooks/useCollection';
import { SpinWheel } from '@/components/SpinWheel';
import { PointsDisplay } from '@/components/PointsDisplay';
import { ProfileSwitcher } from '@/components/ProfileSwitcher';
import { UserMenu } from '@/components/UserMenu';
import { useLanguage } from '@/contexts/LanguageContext';

export default function Collection() {
  const { isAuthenticated, loading: authLoading } = useAuthContext();
  const { points, canSpin, getTimeUntilNextSpin, consumeSpinPoint } = useUserPoints();
  const { 
    themes, 
    cards, 
    loading, 
    isCardUnlocked, 
    getCardsForTheme, 
    getUnlockedCountForTheme,
    unlockRandomCard,
    totalCardsCount,
    unlockedCardsCount
  } = useCollection();
  const { t } = useLanguage();

  const timeUntilSpin = getTimeUntilNextSpin();

  // Redirect non-authenticated users
  if (!authLoading && !isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  const handleSpin = async () => {
    const success = await consumeSpinPoint();
    if (!success) return null;
    return await unlockRandomCard();
  };

  if (loading || authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border/50">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <Link
              to="/"
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="hidden sm:inline">Retour</span>
            </Link>

            <h1 className="font-display text-xl font-bold">Ma Collection</h1>

            <div className="flex items-center gap-3">
              <PointsDisplay />
              <ProfileSwitcher />
              <UserMenu />
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Points & Spin Section */}
        <section className="mb-12">
          <div className="bg-gradient-to-br from-primary/10 via-secondary/20 to-primary/5 rounded-3xl p-6 md:p-8">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              {/* Stats */}
              <div className="text-center md:text-left">
                <h2 className="font-display text-3xl font-bold mb-4">
                  Roue de la chance
                </h2>
                
                <div className="flex flex-wrap gap-4 justify-center md:justify-start mb-6">
                  <div className="bg-background/80 rounded-xl px-4 py-3 shadow-sm">
                    <div className="flex items-center gap-2 text-amber-600">
                      <Star className="w-5 h-5 fill-current" />
                      <span className="font-bold text-2xl">{points}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">Points</p>
                  </div>
                  
                  <div className="bg-background/80 rounded-xl px-4 py-3 shadow-sm">
                    <div className="flex items-center gap-2 text-green-600">
                      <CheckCircle className="w-5 h-5" />
                      <span className="font-bold text-2xl">{unlockedCardsCount}/{totalCardsCount}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">Cartes</p>
                  </div>
                </div>

                {!canSpin && timeUntilSpin && (
                  <div className="flex items-center gap-2 text-muted-foreground bg-background/60 rounded-lg px-4 py-2 inline-flex">
                    <Clock className="w-4 h-4" />
                    <span>
                      Prochain tour dans {timeUntilSpin.hours}h {timeUntilSpin.minutes}min
                    </span>
                  </div>
                )}

                {points === 0 && (
                  <p className="text-muted-foreground mt-4">
                    Lisez des histoires pour gagner des points et débloquer des cartes !
                  </p>
                )}
              </div>

              {/* Wheel */}
              <div className="flex justify-center">
                <SpinWheel 
                  onSpin={handleSpin}
                  canSpin={canSpin}
                  disabled={points < 1 || cards.length === 0}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Collection Grid */}
        <section>
          <h2 className="font-display text-2xl font-bold mb-6">Mes cartes</h2>

          {themes.length === 0 ? (
            <div className="text-center py-12 bg-muted/30 rounded-2xl">
              <Lock className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                Aucune carte n'est disponible pour le moment.
              </p>
            </div>
          ) : (
            <div className="space-y-8">
              {themes.map((theme) => {
                const themeCards = getCardsForTheme(theme.id);
                const unlockedCount = getUnlockedCountForTheme(theme.id);

                return (
                  <div key={theme.id} className="bg-card rounded-2xl p-6 shadow-sm border border-border/50">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-display text-xl font-bold">{theme.title}</h3>
                      <span className="text-sm text-muted-foreground">
                        {unlockedCount}/{themeCards.length} débloquées
                      </span>
                    </div>

                    {themeCards.length === 0 ? (
                      <p className="text-muted-foreground text-center py-4">
                        Aucune carte dans ce thème
                      </p>
                    ) : (
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {themeCards.map((card) => {
                          const unlocked = isCardUnlocked(card.id);

                          return (
                            <div 
                              key={card.id}
                              className={`
                                relative aspect-square rounded-xl overflow-hidden
                                ${unlocked 
                                  ? 'shadow-lg ring-2 ring-amber-400/50' 
                                  : ''
                                }
                              `}
                            >
                              {unlocked ? (
                                <>
                                  <img
                                    src={card.image_url}
                                    alt={card.title}
                                    className="w-full h-full object-cover"
                                  />
                                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2">
                                    <p className="text-white text-sm font-medium text-center truncate">
                                      {card.title}
                                    </p>
                                  </div>
                                </>
                              ) : (
                                <div className="w-full h-full bg-gradient-to-br from-muted/80 to-muted flex items-center justify-center border-2 border-dashed border-muted-foreground/20">
                                  <div className="text-center">
                                    <Lock className="w-8 h-8 text-muted-foreground/40 mx-auto mb-1" />
                                    <span className="text-xs text-muted-foreground/40">?</span>
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
