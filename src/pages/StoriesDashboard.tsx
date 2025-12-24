import { useParams, useNavigate } from "react-router-dom";
import { getStoriesBySubject } from "@/data/stories";
import { getSubject } from "@/data/subjects";
import { StoryCard } from "@/components/StoryCard";
import { Sparkles, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function StoriesDashboard() {
  const { subjectId } = useParams<{ subjectId: string }>();
  const navigate = useNavigate();
  
  const subject = getSubject(subjectId || "");
  const stories = getStoriesBySubject(subjectId || "");
  
  if (!subject) {
    navigate("/");
    return null;
  }

  const Icon = subject.icon;

  return (
    <main className="min-h-screen bg-background flex flex-col">
      {/* Hero Section */}
      <header className="relative overflow-hidden py-12 md:py-20 px-4">
        {/* Decorative elements */}
        <div className="absolute top-10 left-10 w-20 h-20 text-golden opacity-30 animate-float">
          <Sparkles className="w-full h-full" />
        </div>
        <div className="absolute bottom-10 right-10 w-16 h-16 text-secondary opacity-40 animate-float" style={{ animationDelay: '1s' }}>
          <Icon className="w-full h-full" />
        </div>
        
        <div className="container max-w-6xl mx-auto">
          {/* Back button */}
          <Button 
            variant="ghost" 
            onClick={() => navigate("/")}
            className="mb-6 fade-up"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour aux matières
          </Button>

          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-golden/20 text-golden-foreground px-4 py-2 rounded-full mb-6 fade-up">
              <Icon className="w-4 h-4 text-golden" />
              <span className="font-semibold text-sm">{subject.name}</span>
            </div>
            
            <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6 fade-up stagger-1">
              Choisis ton aventure !
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed fade-up stagger-2">
              {subject.description}
            </p>
          </div>
        </div>
      </header>

      {/* Stories Grid */}
      <section className="container max-w-6xl mx-auto px-4 pb-20 flex-1">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {stories.map((story, index) => (
            <StoryCard key={story.id} story={story} index={index} />
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
