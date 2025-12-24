import { subjects } from "@/data/subjects";
import { SubjectCard } from "@/components/SubjectCard";
import { GraduationCap, Sparkles } from "lucide-react";

export default function SubjectsDashboard() {
  return (
    <main className="min-h-screen bg-background flex flex-col">
      {/* Hero Section */}
      <header className="relative overflow-hidden py-12 md:py-20 px-4">
        {/* Decorative elements */}
        <div className="absolute top-10 left-10 w-20 h-20 text-golden opacity-30 animate-float">
          <Sparkles className="w-full h-full" />
        </div>
        <div className="absolute bottom-10 right-10 w-16 h-16 text-secondary opacity-40 animate-float" style={{ animationDelay: '1s' }}>
          <GraduationCap className="w-full h-full" />
        </div>
        
        <div className="container max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-golden/20 text-golden-foreground px-4 py-2 rounded-full mb-6 fade-up">
            <GraduationCap className="w-4 h-4 text-golden" />
            <span className="font-semibold text-sm">Programme scolaire</span>
          </div>
          
          <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6 fade-up stagger-1">
            Apprends en t'amusant !
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed fade-up stagger-2">
            Choisis une matière et découvre des histoires interactives pour apprendre en s'amusant.
          </p>
        </div>
      </header>

      {/* Subjects Grid */}
      <section className="container max-w-6xl mx-auto px-4 pb-20 flex-1">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {subjects.map((subject, index) => (
            <SubjectCard key={subject.id} subject={subject} index={index} />
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-6 text-center border-t border-border bg-muted/30">
        <p className="text-muted-foreground text-sm">
          © Lou Husson 2025
        </p>
      </footer>
    </main>
  );
}
