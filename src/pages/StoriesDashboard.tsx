import { useState } from "react";
import { stories } from "@/data/stories";
import { StoryCard } from "@/components/StoryCard";
import { BookOpen, Sparkles, Search } from "lucide-react";

export default function StoriesDashboard() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredStories = stories.filter((story) => {
    return story.title.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <main className="min-h-screen bg-background">
      {/* Hero Section */}
      <header className="relative overflow-hidden py-12 md:py-20 px-4">
        {/* Decorative elements */}
        <div className="absolute top-10 left-10 w-20 h-20 text-golden opacity-30 animate-float">
          <Sparkles className="w-full h-full" />
        </div>
        <div className="absolute bottom-10 right-10 w-16 h-16 text-secondary opacity-40 animate-float" style={{ animationDelay: '1s' }}>
          <BookOpen className="w-full h-full" />
        </div>
        
        <div className="container max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-golden/20 text-golden-foreground px-4 py-2 rounded-full mb-6 fade-up">
            <Sparkles className="w-4 h-4 text-golden" />
            <span className="font-semibold text-sm">Histoires Interactives</span>
          </div>
          
          <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6 fade-up stagger-1">
            Choisis ton aventure !
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed fade-up stagger-2">
            Des histoires magiques où <strong className="text-primary">tu</strong> décides de la suite. 
            Explore, choisis et vis des aventures extraordinaires !
          </p>
        </div>
      </header>

      {/* Filters Section */}
      <section className="container max-w-6xl mx-auto px-4 mb-8">
        <div className="book-container p-4 md:p-6">
          {/* Search */}
          <div className="relative w-full max-w-md mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Chercher une histoire..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl bg-background border-2 border-border focus:border-primary focus:outline-none font-body text-lg transition-colors"
            />
          </div>
        </div>
      </section>

      {/* Stories Grid */}
      <section className="container max-w-6xl mx-auto px-4 pb-20">
        {filteredStories.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {filteredStories.map((story, index) => (
              <StoryCard key={story.id} story={story} index={index} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <BookOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="font-display text-2xl text-muted-foreground">
              Aucune histoire trouvée
            </h2>
            <p className="text-muted-foreground mt-2">
              Essaie de modifier ta recherche
            </p>
          </div>
        )}
      </section>
    </main>
  );
}
