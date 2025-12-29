import { Link } from "react-router-dom";
import { grades } from "@/data/grades";
import { stories } from "@/data/stories";
import { GradeCard } from "@/components/GradeCard";
import { Sparkles, Save, UserCircle, Crown } from "lucide-react";
import logo from "@/assets/logo.png";
import profilsImage from "@/assets/features/profils.png";
import historiqueImage from "@/assets/features/historique.png";
import suiviImage from "@/assets/features/suivi.png";
import { Footer } from "@/components/Footer";
import { ProfileSwitcher } from "@/components/ProfileSwitcher";
import { useAuthContext } from "@/contexts/AuthContext";
import { useAdmin } from "@/hooks/useAdmin";
import { Button } from "@/components/ui/button";
import { LanguageSelector } from "@/components/LanguageSelector";
import { useLanguage } from "@/contexts/LanguageContext";

export default function GradesDashboard() {
  const { isAuthenticated, loading } = useAuthContext();
  const { isAdmin } = useAdmin();
  const { t, language } = useLanguage();

  // Get unique levels from stories to know which grades have content
  const availableGrades = new Set(stories.map(s => s.level));

  return (
    <main className="min-h-screen bg-background flex flex-col">
      {/* Header with Logo and ProfileSwitcher */}
      <div className="container max-w-6xl mx-auto px-4 pt-3 flex justify-between items-center">
        <Link to="/">
          <img 
            src={logo} 
            alt="Héros de la Classe" 
            className="w-16 md:w-20 drop-shadow-lg"
          />
        </Link>
        <div className="flex items-center gap-2">
          <LanguageSelector />
          {isAdmin && (
            <Button asChild variant="outline" size="sm" className="gap-2 text-golden border-golden/30 hover:bg-golden/10">
              <Link to="/admin">
                <Crown className="w-4 h-4" />
                <span className="hidden sm:inline">{t('menu.admin')}</span>
              </Link>
            </Button>
          )}
          <ProfileSwitcher />
        </div>
      </div>

      {/* Hero Section */}
      <header className="relative overflow-hidden py-4 md:py-6 px-4">
        {/* Decorative elements */}
        <div className="absolute top-10 left-10 w-20 h-20 text-golden opacity-30 animate-float">
          <Sparkles className="w-full h-full" />
        </div>
        <div className="absolute bottom-10 right-10 w-16 h-16 text-secondary opacity-40 animate-float" style={{ animationDelay: '1s' }}>
          <Sparkles className="w-full h-full" />
        </div>
        
        <div className="container max-w-6xl mx-auto text-center">
          
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed fade-up stagger-1">
            {t('grades.subtitle')}
          </p>

          {/* CTA for non-authenticated users */}
          {!loading && !isAuthenticated && (
            <div className="mt-6 fade-up stagger-2">
              <Button asChild size="lg" className="gap-2 font-display">
                <Link to="/register">
                  <Save className="w-5 h-5" />
                  {t('stories.saveProgress')}
                </Link>
              </Button>
            </div>
          )}
        </div>
      </header>

      {/* Grades Grid */}
      <section className="container max-w-6xl mx-auto px-4 pb-12 flex-1">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
          {grades.map((grade, index) => (
            <GradeCard key={grade.id} grade={grade} index={index} />
          ))}
        </div>
      </section>

      {/* Account Benefits Section - only show if not authenticated */}
      {!loading && !isAuthenticated && (
        <section className="bg-muted/50 py-12 md:py-16 px-4">
          <div className="container max-w-4xl mx-auto">
            <h2 className="font-display text-2xl md:text-3xl text-foreground text-center mb-8">
              {t('account.whyCreate')}
            </h2>
            
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="text-center">
                {language === 'fr' && (
                  <img 
                    src={profilsImage} 
                    alt="Profils personnalisés" 
                    className="w-full rounded-3xl shadow-lg mb-4"
                  />
                )}
                <p className="text-muted-foreground text-sm">
                  {t('account.profileDesc')}
                </p>
              </div>

              <div className="text-center">
                {language === 'fr' && (
                  <img 
                    src={historiqueImage} 
                    alt="Historique sauvegardé" 
                    className="w-full rounded-3xl shadow-lg mb-4"
                  />
                )}
                <p className="text-muted-foreground text-sm">
                  {t('account.historyDesc')}
                </p>
              </div>

              <div className="text-center">
                {language === 'fr' && (
                  <img 
                    src={suiviImage} 
                    alt="Suivi de lecture" 
                    className="w-full rounded-3xl shadow-lg mb-4"
                  />
                )}
                <p className="text-muted-foreground text-sm">
                  {t('account.trackingDesc')}
                </p>
              </div>
            </div>

            <div className="bg-card rounded-2xl p-6 md:p-8 border border-border shadow-sm">
              <p className="text-muted-foreground text-center leading-relaxed mb-6">
                {t('account.benefitText')}
              </p>
              <div className="text-center">
                <Button asChild size="lg" className="gap-2 font-display">
                  <Link to="/register">
                    <UserCircle className="w-5 h-5" />
                    {t('account.createFree')}
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      )}

      <Footer />
    </main>
  );
}
