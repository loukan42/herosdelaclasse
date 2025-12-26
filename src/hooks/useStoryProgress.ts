import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export interface StoryProgress {
  id: string;
  user_id: string;
  story_id: string;
  current_page_id: string;
  visited_pages: string[];
  prenom_histoire: string | null;
  updated_at: string;
}

export interface CompletedStory {
  id: string;
  user_id: string;
  story_id: string;
  ending_type: string | null;
  completed_at: string;
}

export function useStoryProgress(storyId?: string) {
  const { user, isAuthenticated } = useAuth();
  const [progress, setProgress] = useState<StoryProgress | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch progress for a specific story
  const fetchProgress = useCallback(async () => {
    if (!user || !storyId) {
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from('story_progress')
      .select('*')
      .eq('user_id', user.id)
      .eq('story_id', storyId)
      .maybeSingle();

    if (!error && data) {
      setProgress({
        ...data,
        visited_pages: Array.isArray(data.visited_pages) ? data.visited_pages : []
      } as StoryProgress);
    }
    setLoading(false);
  }, [user, storyId]);

  useEffect(() => {
    fetchProgress();
  }, [fetchProgress]);

  // Save or update progress
  const saveProgress = async (pageId: string, visitedPages: string[], prenomHistoire?: string) => {
    if (!user || !storyId) return { error: new Error('Non connecté') };

    const { data, error } = await supabase
      .from('story_progress')
      .upsert({
        user_id: user.id,
        story_id: storyId,
        current_page_id: pageId,
        visited_pages: visitedPages,
        prenom_histoire: prenomHistoire || null
      }, {
        onConflict: 'user_id,story_id'
      })
      .select()
      .single();

    if (!error && data) {
      setProgress({
        ...data,
        visited_pages: Array.isArray(data.visited_pages) ? data.visited_pages : []
      } as StoryProgress);
    }

    return { data, error };
  };

  // Mark story as completed
  const markCompleted = async (endingType?: string) => {
    if (!user || !storyId) return { error: new Error('Non connecté') };

    const { data, error } = await supabase
      .from('completed_stories')
      .insert({
        user_id: user.id,
        story_id: storyId,
        ending_type: endingType || null
      })
      .select()
      .single();

    // Clear progress after completing
    if (!error) {
      await supabase
        .from('story_progress')
        .delete()
        .eq('user_id', user.id)
        .eq('story_id', storyId);
      
      setProgress(null);
    }

    return { data, error };
  };

  // Delete progress (restart story)
  const clearProgress = async () => {
    if (!user || !storyId) return { error: new Error('Non connecté') };

    const { error } = await supabase
      .from('story_progress')
      .delete()
      .eq('user_id', user.id)
      .eq('story_id', storyId);

    if (!error) {
      setProgress(null);
    }

    return { error };
  };

  return {
    progress,
    loading,
    saveProgress,
    markCompleted,
    clearProgress,
    isAuthenticated
  };
}

// Hook to get all progress and completed stories for dashboard
export function useAllStoryProgress() {
  const { user, isAuthenticated } = useAuth();
  const [allProgress, setAllProgress] = useState<StoryProgress[]>([]);
  const [completedStories, setCompletedStories] = useState<CompletedStory[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAllData = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    const [progressResult, completedResult] = await Promise.all([
      supabase
        .from('story_progress')
        .select('*')
        .eq('user_id', user.id),
      supabase
        .from('completed_stories')
        .select('*')
        .eq('user_id', user.id)
        .order('completed_at', { ascending: false })
    ]);

    if (!progressResult.error && progressResult.data) {
      setAllProgress(progressResult.data.map(p => ({
        ...p,
        visited_pages: Array.isArray(p.visited_pages) ? p.visited_pages : []
      })) as StoryProgress[]);
    }

    if (!completedResult.error && completedResult.data) {
      setCompletedStories(completedResult.data as CompletedStory[]);
    }

    setLoading(false);
  }, [user]);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  // Get unique completed story ids
  const completedStoryIds = [...new Set(completedStories.map(c => c.story_id))];

  // Check if a story has progress
  const hasProgress = (storyId: string) => allProgress.some(p => p.story_id === storyId);

  // Check if a story is completed
  const isCompleted = (storyId: string) => completedStoryIds.includes(storyId);

  // Get progress for a specific story
  const getProgress = (storyId: string) => allProgress.find(p => p.story_id === storyId);

  // Count completions for a story
  const getCompletionCount = (storyId: string) => completedStories.filter(c => c.story_id === storyId).length;

  return {
    allProgress,
    completedStories,
    completedStoryIds,
    loading,
    hasProgress,
    isCompleted,
    getProgress,
    getCompletionCount,
    isAuthenticated,
    refresh: fetchAllData
  };
}
