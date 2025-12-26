import { Link } from "react-router-dom";
import { grades } from "@/data/grades";
import { stories } from "@/data/stories";
import { GradeCard } from "@/components/GradeCard";
import { Sparkles, Save } from "lucide-react";
import logo from "@/assets/logo.png";
import { Footer } from "@/components/Footer";
import { UserMenu } from "@/components/UserMenu";
import { useAuthContext } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";

export default function GradesDashboard() {
  const { isAuthenticated, loading } = useAuthContext();

  // Get unique levels from stories to know which grades have content
  const availableGrades = new Set(stories.map(s => s.level));

  return (
    <main className="min-h-screen bg-background flex flex-col">
      {/* Header with UserMenu */}
      <div className="container max-w-6xl mx-auto px-4 pt-4 flex justify-end">
        <UserMenu />
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
                <Link to="/auth">
                  <Save className="w-5 h-5" />
                  Enregistrer ma progression
                </Link>
              </Button>
            </div>
          )}
        </div>
      </header>

      {/* Grades Grid */}
      <section className="container max-w-6xl mx-auto px-4 pb-20 flex-1">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
          {grades.map((grade, index) => (
            <GradeCard key={grade.id} grade={grade} index={index} />
          ))}
        </div>
      </section>

      <Footer />
    </main>
  );
}
