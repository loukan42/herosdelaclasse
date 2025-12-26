import { useParams, useNavigate, Link } from "react-router-dom";
import { getSubject } from "@/data/subjects";
import { getGrade } from "@/data/grades";
import { StoryCard } from "@/components/StoryCard";
import { Sparkles, ArrowLeft, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Footer } from "@/components/Footer";
import { useAllStoryProgress } from "@/hooks/useStoryProgress";
import { UserMenu } from "@/components/UserMenu";
import { useAuthContext } from "@/contexts/AuthContext";
import { useCombinedStories } from "@/hooks/useCombinedStories";

export default function StoriesDashboard() {
  const { subjectId, gradeId } = useParams<{ subjectId: string; gradeId: string }>();
  const navigate = useNavigate();
  const { hasProgress, isCompleted, getCompletionCount, isAuthenticated } = useAllStoryProgress();
  const { loading } = useAuthContext();
  const { getStoriesBySubject } = useCombinedStories();
  
  const subject = getSubject(subjectId || "");
  const grade = getGrade(gradeId || "");
  
  // Get stories filtered by both subject and grade
  const allStories = getStoriesBySubject(subjectId || "");
  const stories = gradeId 
    ? allStories.filter(story => story.level === gradeId)
    : allStories;
  
  if (!subject || !grade) {
    navigate("/");
    return null;
  }

  const Icon = subject.icon;

  return (
    <main className="min-h-screen bg-background flex flex-col">
      {/* Header with UserMenu */}
      <div className="container max-w-6xl mx-auto px-4 pt-4 flex justify-end">
        <UserMenu />
      </div>

      {/* Hero Section */}
      <header className="relative overflow-hidden py-10 md:py-16 px-4">
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
            onClick={() => navigate(`/grade/${gradeId}`)}
            className="mb-6 fade-up"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour aux matières
          </Button>

          <div className="text-center">
            {/* Grade and Subject badges */}
            <div className="flex items-center justify-center gap-2 mb-6 fade-up flex-wrap">
              <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r ${grade.color} text-white shadow-md`}>
                <span className="font-display text-sm font-bold">{grade.name}</span>
              </div>
              <div className="inline-flex items-center gap-2 bg-golden/20 text-golden-foreground px-4 py-2 rounded-full">
                <Icon className="w-4 h-4 text-golden" />
                <span className="font-semibold text-sm">{subject.name}</span>
              </div>
            </div>
            
            <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6 fade-up stagger-1">
              Choisis ton aventure !
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed fade-up stagger-2">
              {subject.description}
            </p>

            {/* CTA for non-authenticated users */}
            {!loading && !isAuthenticated && (
              <div className="mt-6 fade-up stagger-3">
                <Button asChild size="lg" className="gap-2 font-display">
                  <Link to="/register">
                    <Save className="w-5 h-5" />
                    Enregistrer ma progression
                  </Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Stories Grid */}
      <section className="container max-w-6xl mx-auto px-4 pb-20 flex-1">
        {stories.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {stories.map((story, index) => (
              <StoryCard 
                key={story.id} 
                story={story} 
                index={index}
                hasProgress={hasProgress(story.id)}
                isCompleted={isCompleted(story.id)}
                completionCount={getCompletionCount(story.id)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-xl text-muted-foreground">
              Aucune histoire disponible pour cette matière en {grade.name}.
            </p>
            <Button 
              variant="outline" 
              onClick={() => navigate(`/grade/${gradeId}`)}
              className="mt-4"
            >
              Choisir une autre matière
            </Button>
          </div>
        )}
      </section>

      <Footer />
    </main>
  );
}
