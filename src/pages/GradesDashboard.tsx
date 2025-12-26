import { Link } from "react-router-dom";
import { grades } from "@/data/grades";
import { stories } from "@/data/stories";
import { GradeCard } from "@/components/GradeCard";
import { Sparkles, Save, Users, BookOpen, History, UserCircle, Crown } from "lucide-react";
import logo from "@/assets/logo.png";
import { Footer } from "@/components/Footer";
import { ProfileSwitcher } from "@/components/ProfileSwitcher";
import { useAuthContext } from "@/contexts/AuthContext";
import { useAdmin } from "@/hooks/useAdmin";
import { Button } from "@/components/ui/button";

export default function GradesDashboard() {
  const { isAuthenticated, loading } = useAuthContext();
  const { isAdmin } = useAdmin();

  // Get unique levels from stories to know which grades have content
  const availableGrades = new Set(stories.map(s => s.level));

  return (
    <main className="min-h-screen bg-background flex flex-col">
      {/* Header with ProfileSwitcher and Admin button */}
      <div className="container max-w-6xl mx-auto px-4 pt-4 flex justify-end items-center gap-2">
        {isAdmin && (
          <Button asChild variant="outline" size="sm" className="gap-2 text-golden border-golden/30 hover:bg-golden/10">
            <Link to="/admin">
              <Crown className="w-4 h-4" />
              <span className="hidden sm:inline">Administration</span>
            </Link>
          </Button>
        )}
        <ProfileSwitcher />
      </div>

      {/* Hero Section */}
      <header className="relative overflow-hidden py-6 md:py-10 px-4">
        {/* Decorative elements */}
        <div className="absolute top-10 left-10 w-20 h-20 text-golden opacity-30 animate-float">
          <Sparkles className="w-full h-full" />
        </div>
        <div className="absolute bottom-10 right-10 w-16 h-16 text-secondary opacity-40 animate-float" style={{ animationDelay: '1s' }}>
          <Sparkles className="w-full h-full" />
        </div>
        
        <div className="container max-w-6xl mx-auto text-center">
          {/* Logo */}
          <img 
            src={logo} 
            alt="Héros de la Classe" 
            className="w-32 md:w-40 lg:w-48 mx-auto mb-6 fade-up drop-shadow-2xl"
          />
          
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed fade-up stagger-1">
            Choisis ta classe et découvre des histoires interactives pour apprendre en s'amusant !
          </p>

          {/* CTA for non-authenticated users */}
          {!loading && !isAuthenticated && (
            <div className="mt-6 fade-up stagger-2">
              <Button asChild size="lg" className="gap-2 font-display">
                <Link to="/register">
                  <Save className="w-5 h-5" />
                  Enregistrer ma progression
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
              Pourquoi créer un compte ?
            </h2>
            
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="bg-card rounded-2xl p-6 border border-border shadow-sm text-center">
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Users className="w-7 h-7 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Profils personnalisés</h3>
                <p className="text-muted-foreground text-sm">
                  Créez un profil pour chaque enfant avec son avatar et son prénom pour des histoires plus immersives.
                </p>
              </div>

              <div className="bg-card rounded-2xl p-6 border border-border shadow-sm text-center">
                <div className="w-14 h-14 rounded-xl bg-golden/10 flex items-center justify-center mx-auto mb-4">
                  <History className="w-7 h-7 text-golden" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Historique sauvegardé</h3>
                <p className="text-muted-foreground text-sm">
                  Retrouvez facilement les lectures en cours et reprenez exactement là où vous vous êtes arrêtés.
                </p>
              </div>

              <div className="bg-card rounded-2xl p-6 border border-border shadow-sm text-center">
                <div className="w-14 h-14 rounded-xl bg-ending-happy/10 flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="w-7 h-7 text-ending-happy" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Suivi de lecture</h3>
                <p className="text-muted-foreground text-sm">
                  Visualisez les histoires déjà lues et celles qui restent à découvrir pour chaque enfant.
                </p>
              </div>
            </div>

            <div className="bg-card rounded-2xl p-6 md:p-8 border border-border shadow-sm">
              <p className="text-muted-foreground text-center leading-relaxed mb-6">
                Créer un compte, c'est la garantie d'un suivi simple, d'une lecture fluide et d'une expérience personnalisée qui évolue au rythme de vos enfants.
              </p>
              <div className="text-center">
                <Button asChild size="lg" className="gap-2 font-display">
                  <Link to="/register">
                    <UserCircle className="w-5 h-5" />
                    Créer un compte gratuit
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
