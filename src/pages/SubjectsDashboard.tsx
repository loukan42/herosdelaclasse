import { subjects } from "@/data/subjects";
import { SubjectCard } from "@/components/SubjectCard";
import { Sparkles } from "lucide-react";
import logo from "@/assets/logo.png";
import { Footer } from "@/components/Footer";
import { UserMenu } from "@/components/UserMenu";

export default function SubjectsDashboard() {
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

      <Footer />
    </main>
  );
}
