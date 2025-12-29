import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthContext } from '@/contexts/AuthContext';
import { useChildProfiles } from '@/contexts/ChildProfileContext';
import { useAllStoryProgress } from '@/hooks/useStoryProgress';
import { useCombinedStories } from '@/hooks/useCombinedStories';
import { Button } from '@/components/ui/button';
import { ProfileSwitcher } from '@/components/ProfileSwitcher';
import { Footer } from '@/components/Footer';
import { LanguageSelector } from '@/components/LanguageSelector';
import { useLanguage } from '@/contexts/LanguageContext';
import { 
  ArrowLeft, 
  BookOpen, 
  PlayCircle, 
  CheckCircle, 
  Clock,
  Trophy,
  Sparkles,
  UserPlus
} from 'lucide-react';
import { formatDistanceToNow, Locale } from 'date-fns';
import { fr, enUS, de, ru, es, zhCN, ptBR } from 'date-fns/locale';

const locales: Record<string, Locale> = {
  fr,
  en: enUS,
  de,
  ru,
  es,
  zh: zhCN,
  'pt-br': ptBR,
};

export default function MyStories() {
  const navigate = useNavigate();
  const { isAuthenticated, loading: authLoading } = useAuthContext();
  const { activeProfile, profiles, loading: profilesLoading } = useChildProfiles();
  const { getAllStories, getStory } = useCombinedStories();
  const { t, language } = useLanguage();
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

  if (authLoading || progressLoading || profilesLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  // If no child profile is selected, prompt to create one
  if (profiles.length === 0) {
    return (
      <main className="min-h-screen bg-background flex flex-col">
        <div className="container max-w-4xl mx-auto px-4 pt-4 flex justify-between items-center">
          <Button variant="ghost" onClick={() => navigate('/')} className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            {t('nav.back')}
          </Button>
          <div className="flex items-center gap-2">
            <LanguageSelector />
            <ProfileSwitcher />
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center px-4">
          <div className="bg-card rounded-2xl p-8 border border-border shadow-sm text-center max-w-md">
            <UserPlus className="w-16 h-16 text-primary mx-auto mb-4" />
            <h1 className="font-display text-2xl text-foreground mb-2">
              {t('myStories.createProfile')}
            </h1>
            <p className="text-muted-foreground mb-6">
              {t('myStories.createProfileDesc')}
            </p>
            <ProfileSwitcher />
          </div>
        </div>

        <Footer />
      </main>
    );
  }

  const allStoriesList = getAllStories();

  // We consider some stories as "aliases" of the same adventure (e.g. "-lecture" variants,
  // or published stories prefixed with "admin-"). On this page, we dedupe these aliases
  // so "À découvrir" doesn't show the same story twice.
  const normalizeStoryKey = (storyId: string) => {
    let id = storyId.startsWith('admin-') ? storyId.slice('admin-'.length) : storyId;
    if (id.endsWith('-lecture')) id = id.slice(0, -'-lecture'.length);
    return id;
  };

  // Get unique completed story ids
  const uniqueCompletedStoryIds = [...new Set(completedStories.map(c => c.story_id))];

  // Get stories in progress ids
  const storiesInProgressIds = allProgress.map(p => p.story_id);

  // If any alias of an adventure is in progress or completed, we consider the adventure started.
  const startedKeys = new Set(
    [...storiesInProgressIds, ...uniqueCompletedStoryIds].map(normalizeStoryKey)
  );

  const storyScore = (storyId: string) => {
    let score = 0;
    if (storyId.startsWith('admin-')) score += 100; // prefer published stories
    if (storyId.endsWith('-lecture')) score += 10;  // prefer the variant that actually has pages in static data
    return score;
  };

  // Get unread stories (not in progress and not completed), deduped by base story key
  const unreadStoriesMap = new Map<string, (typeof allStoriesList)[number]>();
  for (const story of allStoriesList) {
    const key = normalizeStoryKey(story.id);
    if (startedKeys.has(key)) continue;

    const existing = unreadStoriesMap.get(key);
    if (!existing || storyScore(story.id) > storyScore(existing.id)) {
      unreadStoriesMap.set(key, story);
    }
  }
  const unreadStories = Array.from(unreadStoriesMap.values());

  // Stats
  const totalStoriesRead = uniqueCompletedStoryIds.length;
  const totalEndings = completedStories.length;
  const storiesInProgress = allProgress.length;

  const formatDate = (dateString: string) => {
    return formatDistanceToNow(new Date(dateString), { 
      addSuffix: true, 
      locale: locales[language] || locales.fr 
    });
  };

  return (
    <main className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="container max-w-4xl mx-auto px-4 pt-4 flex justify-between items-center">
        <Button variant="ghost" onClick={() => navigate('/')} className="gap-2">
          <ArrowLeft className="w-4 h-4" />
          {t('nav.back')}
        </Button>
        <div className="flex items-center gap-2">
          <LanguageSelector />
          <ProfileSwitcher />
        </div>
      </div>

      <div className="container max-w-4xl mx-auto px-4 py-8 flex-1">
        {/* Title */}
        <div className="text-center mb-8">
          <h1 className="font-display text-4xl text-foreground mb-2">
            {t('myStories.title')}
          </h1>
          <p className="text-muted-foreground">
            {t('myStories.greeting').replace('{name}', activeProfile?.prenom || '')}
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
          <div className="bg-card rounded-2xl p-6 border border-border shadow-sm text-center">
            <div className="w-12 h-12 rounded-xl bg-ending-happy/10 flex items-center justify-center mx-auto mb-3">
              <Trophy className="w-6 h-6 text-ending-happy" />
            </div>
            <p className="text-3xl font-bold text-foreground">{totalStoriesRead}</p>
            <p className="text-sm text-muted-foreground">{t('myStories.completed')}</p>
          </div>

          <div className="bg-card rounded-2xl p-6 border border-border shadow-sm text-center">
            <div className="w-12 h-12 rounded-xl bg-golden/10 flex items-center justify-center mx-auto mb-3">
              <Sparkles className="w-6 h-6 text-golden" />
            </div>
            <p className="text-3xl font-bold text-foreground">{totalEndings}</p>
            <p className="text-sm text-muted-foreground">{t('myStories.endings')}</p>
          </div>

          <div className="bg-card rounded-2xl p-6 border border-border shadow-sm text-center">
            <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center mx-auto mb-3">
              <PlayCircle className="w-6 h-6 text-secondary-foreground" />
            </div>
            <p className="text-3xl font-bold text-foreground">{storiesInProgress}</p>
            <p className="text-sm text-muted-foreground">{t('myStories.inProgress')}</p>
          </div>
        </div>

        {/* Stories in Progress */}
        {allProgress.length > 0 && (
          <section className="mb-10">
            <h2 className="font-display text-2xl text-foreground mb-4 flex items-center gap-2">
              <PlayCircle className="w-6 h-6 text-primary" />
              {t('myStories.continueReading')}
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
                      {t('stories.continue')}
                    </Button>
                  </Link>
                );
              })}
            </div>
          </section>
        )}

        {/* Unread Stories */}
        {unreadStories.length > 0 && (
          <section className="mb-10">
            <h2 className="font-display text-2xl text-foreground mb-4 flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-primary" />
              {t('myStories.toDiscover')}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {unreadStories.map((story) => (
                <Link
                  key={story.id}
                  to={`/stories/${story.id}/start`}
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
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {story.description}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Completed Stories */}
        <section>
          <h2 className="font-display text-2xl text-foreground mb-4 flex items-center gap-2">
            <CheckCircle className="w-6 h-6 text-ending-happy" />
            {t('myStories.completedStories')}
          </h2>
          
          {uniqueCompletedStoryIds.length === 0 ? (
            <div className="bg-card rounded-xl p-8 border border-border text-center">
              <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-4">
                {t('myStories.noCompleted')}
              </p>
              <Button asChild>
                <Link to="/">{t('myStories.discover')}</Link>
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
                        {t('common.completed')} - {formatDate(lastCompletion.completed_at)}
                      </p>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <div className="text-center">
                        <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-ending-happy/10 text-ending-happy font-bold">
                          {completionCount}
                        </span>
                        <p className="text-xs text-muted-foreground mt-1">
                          {completionCount > 1 ? t('common.ends') : t('common.end')}
                        </p>
                      </div>
                      <Button asChild variant="outline" size="sm">
                        <Link to={`/stories/${story.id}/start`}>
                          {t('myStories.replay')}
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
