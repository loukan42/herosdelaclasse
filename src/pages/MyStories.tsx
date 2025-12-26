import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthContext } from '@/contexts/AuthContext';
import { useAllStoryProgress } from '@/hooks/useStoryProgress';
import { stories } from '@/data/stories';
import { Button } from '@/components/ui/button';
import { UserMenu } from '@/components/UserMenu';
import { Footer } from '@/components/Footer';
import { 
  ArrowLeft, 
  BookOpen, 
  PlayCircle, 
  CheckCircle, 
  Clock,
  Trophy,
  Sparkles
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

export default function MyStories() {
  const navigate = useNavigate();
  const { isAuthenticated, loading: authLoading, profile } = useAuthContext();
  const { 
    allProgress, 
    completedStories, 
    loading: progressLoading,
    getCompletionCount
  } = useAllStoryProgress();

  // Redirect if not authenticated
  React.useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/auth');
    }
  }, [authLoading, isAuthenticated, navigate]);

  if (authLoading || progressLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  // Get story details by id
  const getStory = (storyId: string) => stories.find(s => s.id === storyId);

  // Get unique completed story ids
  const uniqueCompletedStoryIds = [...new Set(completedStories.map(c => c.story_id))];

  // Stats
  const totalStoriesRead = uniqueCompletedStoryIds.length;
  const totalEndings = completedStories.length;
  const storiesInProgress = allProgress.length;

  const formatDate = (dateString: string) => {
    return formatDistanceToNow(new Date(dateString), { addSuffix: true, locale: fr });
  };

  return (
    <main className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="container max-w-4xl mx-auto px-4 pt-4 flex justify-between items-center">
        <Button variant="ghost" onClick={() => navigate('/')} className="gap-2">
          <ArrowLeft className="w-4 h-4" />
          Retour
        </Button>
        <UserMenu />
      </div>

      <div className="container max-w-4xl mx-auto px-4 py-8 flex-1">
        {/* Title */}
        <div className="text-center mb-8">
          <h1 className="font-display text-4xl text-foreground mb-2">
            Mes histoires
          </h1>
          <p className="text-muted-foreground">
            Bonjour {profile?.prenom} ! Voici ton parcours de lecture.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
          <div className="bg-card rounded-2xl p-6 border border-border shadow-sm text-center">
            <div className="w-12 h-12 rounded-xl bg-ending-happy/10 flex items-center justify-center mx-auto mb-3">
              <Trophy className="w-6 h-6 text-ending-happy" />
            </div>
            <p className="text-3xl font-bold text-foreground">{totalStoriesRead}</p>
            <p className="text-sm text-muted-foreground">Histoires terminées</p>
          </div>

          <div className="bg-card rounded-2xl p-6 border border-border shadow-sm text-center">
            <div className="w-12 h-12 rounded-xl bg-golden/10 flex items-center justify-center mx-auto mb-3">
              <Sparkles className="w-6 h-6 text-golden" />
            </div>
            <p className="text-3xl font-bold text-foreground">{totalEndings}</p>
            <p className="text-sm text-muted-foreground">Fins découvertes</p>
          </div>

          <div className="bg-card rounded-2xl p-6 border border-border shadow-sm text-center">
            <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center mx-auto mb-3">
              <PlayCircle className="w-6 h-6 text-secondary-foreground" />
            </div>
            <p className="text-3xl font-bold text-foreground">{storiesInProgress}</p>
            <p className="text-sm text-muted-foreground">En cours</p>
          </div>
        </div>

        {/* Stories in Progress */}
        {allProgress.length > 0 && (
          <section className="mb-10">
            <h2 className="font-display text-2xl text-foreground mb-4 flex items-center gap-2">
              <PlayCircle className="w-6 h-6 text-primary" />
              Continuer la lecture
            </h2>
            <div className="space-y-3">
              {allProgress.map((progress) => {
                const story = getStory(progress.story_id);
                if (!story) return null;

                return (
                  <Link
                    key={progress.id}
                    to={`/stories/${story.id}/page/${progress.current_page_id}`}
                    className="flex items-center gap-4 bg-card rounded-xl p-4 border border-border shadow-sm hover:shadow-md hover:border-primary/30 transition-all group"
                  >
                    <img 
                      src={story.coverImage} 
                      alt={story.title}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors truncate">
                        {story.title}
                      </h3>
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatDate(progress.updated_at)}
                      </p>
                    </div>
                    <Button size="sm" className="gap-2 shrink-0">
                      <PlayCircle className="w-4 h-4" />
                      Reprendre
                    </Button>
                  </Link>
                );
              })}
            </div>
          </section>
        )}

        {/* Completed Stories */}
        <section>
          <h2 className="font-display text-2xl text-foreground mb-4 flex items-center gap-2">
            <CheckCircle className="w-6 h-6 text-ending-happy" />
            Histoires terminées
          </h2>
          
          {uniqueCompletedStoryIds.length === 0 ? (
            <div className="bg-card rounded-xl p-8 border border-border text-center">
              <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-4">
                Tu n'as pas encore terminé d'histoire.
              </p>
              <Button asChild>
                <Link to="/">Découvrir les histoires</Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {uniqueCompletedStoryIds.map((storyId) => {
                const story = getStory(storyId);
                if (!story) return null;

                const storyCompletions = completedStories.filter(c => c.story_id === storyId);
                const lastCompletion = storyCompletions[0];
                const completionCount = storyCompletions.length;

                return (
                  <div
                    key={storyId}
                    className="flex items-center gap-4 bg-card rounded-xl p-4 border border-border shadow-sm"
                  >
                    <img 
                      src={story.coverImage} 
                      alt={story.title}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-foreground truncate">
                        {story.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Terminée {formatDate(lastCompletion.completed_at)}
                      </p>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <div className="text-center">
                        <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-ending-happy/10 text-ending-happy font-bold">
                          {completionCount}
                        </span>
                        <p className="text-xs text-muted-foreground mt-1">
                          {completionCount > 1 ? 'fins' : 'fin'}
                        </p>
                      </div>
                      <Button asChild variant="outline" size="sm">
                        <Link to={`/stories/${story.id}/start`}>
                          Rejouer
                        </Link>
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>

      <Footer />
    </main>
  );
}
