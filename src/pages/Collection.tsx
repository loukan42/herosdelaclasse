import { Link, Navigate } from 'react-router-dom';
import { ArrowLeft, Star, Lock, CheckCircle } from 'lucide-react';
import { useAuthContext } from '@/contexts/AuthContext';
import { useUserPoints } from '@/hooks/useUserPoints';
import { useCollection } from '@/hooks/useCollection';
import { WheelOptions } from '@/components/WheelOptions';
import { PointsDisplay } from '@/components/PointsDisplay';
import { ProfileSwitcher } from '@/components/ProfileSwitcher';
import { UserMenu } from '@/components/UserMenu';
import { useLanguage } from '@/contexts/LanguageContext';
import { CollectionCard } from '@/components/CollectionCard';

const SINGLE_COST = 1;
const BOOSTER_COST = 10;
const BOOSTER_CARDS = 5;

export default function Collection() {
  const { isAuthenticated, loading: authLoading } = useAuthContext();
  const { points, canSpin, getTimeUntilNextSpin, consumeSpinPoints } = useUserPoints();
  const { 
    themes, 
    cards, 
    loading, 
    isCardUnlocked, 
    getCardsForTheme, 
    getUnlockedCountForTheme,
    unlockRandomCard,
    unlockMultipleCards,
    totalCardsCount,
    unlockedCardsCount,
    lockedCardsCount
  } = useCollection();
  const { t } = useLanguage();

  const timeUntilSpin = getTimeUntilNextSpin();

  // Redirect non-authenticated users
  if (!authLoading && !isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  const handleSingleSpin = async () => {
    const success = await consumeSpinPoints(SINGLE_COST);
    if (!success) return null;
    return await unlockRandomCard();
  };

  const handleBoosterSpin = async () => {
    const success = await consumeSpinPoints(BOOSTER_COST);
    if (!success) return [];
    return await unlockMultipleCards(BOOSTER_CARDS);
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
        <div className="container mx-auto px-3 sm:px-4 py-2 sm:py-3">
          <div className="flex items-center justify-between gap-2">
            <Link
              to="/"
              className="flex items-center gap-1.5 sm:gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="hidden sm:inline text-sm">Retour</span>
            </Link>

            <h1 className="font-display text-base sm:text-xl font-bold truncate">Ma Collection</h1>

            <div className="flex items-center gap-1.5 sm:gap-3">
              <PointsDisplay />
              <ProfileSwitcher />
              <UserMenu />
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-3 sm:px-4 py-4 sm:py-8">
        {/* Points & Spin Section */}
        <section className="mb-8 sm:mb-12">
          <div className="bg-gradient-to-br from-primary/10 via-secondary/20 to-primary/5 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8">
            {/* Header with stats */}
            <div className="flex flex-wrap gap-3 sm:gap-4 justify-center mb-6">
              <div className="bg-background/80 rounded-lg sm:rounded-xl px-4 sm:px-5 py-3 shadow-sm">
                <div className="flex items-center gap-2 text-amber-600">
                  <Star className="w-5 h-5 sm:w-6 sm:h-6 fill-current" />
                  <span className="font-bold text-2xl sm:text-3xl">{points}</span>
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground mt-1">Points disponibles</p>
              </div>
              
              <div className="bg-background/80 rounded-lg sm:rounded-xl px-4 sm:px-5 py-3 shadow-sm">
                <div className="flex items-center gap-2 text-green-600">
                  <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6" />
                  <span className="font-bold text-2xl sm:text-3xl">{unlockedCardsCount}/{totalCardsCount}</span>
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground mt-1">Cartes collectées</p>
              </div>
            </div>

            <div className="text-center mb-6">
              <h2 className="font-display text-xl sm:text-2xl md:text-3xl font-bold">
                Obtenez de nouvelles cartes à collectionner
              </h2>
            </div>

            {/* Wheel Options Component */}
            <WheelOptions
              points={points}
              canSpin={canSpin}
              timeUntilSpin={timeUntilSpin}
              onSingleSpin={handleSingleSpin}
              onBoosterSpin={handleBoosterSpin}
              lockedCardsCount={lockedCardsCount}
            />

            {points === 0 && (
              <p className="text-muted-foreground mt-6 text-center text-sm sm:text-base">
                Lisez des histoires pour gagner des points et débloquer des cartes !
              </p>
            )}
          </div>
        </section>

        {/* Collection Grid */}
        <section>
          <h2 className="font-display text-lg sm:text-2xl font-bold mb-4 sm:mb-6">Mes cartes</h2>

          {themes.length === 0 ? (
            <div className="text-center py-8 sm:py-12 bg-muted/30 rounded-xl sm:rounded-2xl">
              <Lock className="w-10 h-10 sm:w-12 sm:h-12 text-muted-foreground mx-auto mb-3 sm:mb-4" />
              <p className="text-muted-foreground text-sm sm:text-base">
                Aucune carte n'est disponible pour le moment.
              </p>
            </div>
          ) : (
            <div className="space-y-6 sm:space-y-8">
              {themes.map((theme) => {
                const themeCards = getCardsForTheme(theme.id);
                const unlockedCount = getUnlockedCountForTheme(theme.id);

                return (
                  <div key={theme.id} className="bg-card rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-sm border border-border/50">
                    <div className="flex items-center justify-between mb-3 sm:mb-4 gap-2">
                      <h3 className="font-display text-base sm:text-xl font-bold truncate">{theme.title}</h3>
                      <span className="text-xs sm:text-sm text-muted-foreground whitespace-nowrap">
                        {unlockedCount}/{themeCards.length}
                      </span>
                    </div>

                    {themeCards.length === 0 ? (
                      <p className="text-muted-foreground text-center py-4 text-sm">
                        Aucune carte dans ce thème
                      </p>
                    ) : (
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-6">
                        {themeCards.map((card) => {
                          const unlocked = isCardUnlocked(card.id);

                          return (
                            <CollectionCard
                              key={card.id}
                              imageUrl={card.image_url}
                              title={card.title}
                              unlocked={unlocked}
                            />
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