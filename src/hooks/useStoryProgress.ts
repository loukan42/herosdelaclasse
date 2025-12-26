import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useChildProfiles } from '@/contexts/ChildProfileContext';

export interface StoryProgress {
  id: string;
  user_id: string;
  child_profile_id: string | null;
  story_id: string;
  current_page_id: string;
  visited_pages: string[];
  prenom_histoire: string | null;
  updated_at: string;
}

export interface CompletedStory {
  id: string;
  user_id: string;
  child_profile_id: string | null;
  story_id: string;
  ending_type: string | null;
  completed_at: string;
}

export function useStoryProgress(storyId?: string) {
  const { user, isAuthenticated } = useAuth();
  const { activeProfile } = useChildProfiles();
  const [progress, setProgress] = useState<StoryProgress | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch progress for a specific story and active child profile
  const fetchProgress = useCallback(async () => {
    if (!user || !storyId) {
      setLoading(false);
      return;
    }

    let query = supabase
      .from('story_progress')
      .select('*')
      .eq('user_id', user.id)
      .eq('story_id', storyId);

    // Filter by active profile if one is selected
    if (activeProfile) {
      query = query.eq('child_profile_id', activeProfile.id);
    } else {
      query = query.is('child_profile_id', null);
    }

    const { data, error } = await query.maybeSingle();

    if (!error && data) {
      setProgress({
        ...data,
        visited_pages: Array.isArray(data.visited_pages) ? data.visited_pages : []
      } as StoryProgress);
    } else {
      setProgress(null);
    }
    setLoading(false);
  }, [user, storyId, activeProfile]);

  useEffect(() => {
    fetchProgress();
  }, [fetchProgress]);

  // Save or update progress
  const saveProgress = async (pageId: string, visitedPages: string[], prenomHistoire?: string) => {
    if (!user || !storyId) return { error: new Error('Non connecté') };

    // First check if progress exists for this user/story/child combination
    let existingQuery = supabase
      .from('story_progress')
      .select('id')
      .eq('user_id', user.id)
      .eq('story_id', storyId);

    if (activeProfile) {
      existingQuery = existingQuery.eq('child_profile_id', activeProfile.id);
    } else {
      existingQuery = existingQuery.is('child_profile_id', null);
    }

    const { data: existing } = await existingQuery.maybeSingle();

    let data, error;

    if (existing) {
      // Update existing progress
      const result = await supabase
        .from('story_progress')
        .update({
          current_page_id: pageId,
          visited_pages: visitedPages,
          prenom_histoire: prenomHistoire || null
        })
        .eq('id', existing.id)
        .select()
        .single();
      data = result.data;
      error = result.error;
    } else {
      // Insert new progress
      const result = await supabase
        .from('story_progress')
        .insert({
          user_id: user.id,
          child_profile_id: activeProfile?.id || null,
          story_id: storyId,
          current_page_id: pageId,
          visited_pages: visitedPages,
          prenom_histoire: prenomHistoire || null
        })
        .select()
        .single();
      data = result.data;
      error = result.error;
    }

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
        child_profile_id: activeProfile?.id || null,
        story_id: storyId,
        ending_type: endingType || null
      })
      .select()
      .single();

    // Clear progress after completing
    if (!error) {
      let deleteQuery = supabase
        .from('story_progress')
        .delete()
        .eq('user_id', user.id)
        .eq('story_id', storyId);

      if (activeProfile) {
        deleteQuery = deleteQuery.eq('child_profile_id', activeProfile.id);
      } else {
        deleteQuery = deleteQuery.is('child_profile_id', null);
      }

      await deleteQuery;
      setProgress(null);
    }

    return { data, error };
  };

  // Delete progress (restart story)
  const clearProgress = async () => {
    if (!user || !storyId) return { error: new Error('Non connecté') };

    let deleteQuery = supabase
      .from('story_progress')
      .delete()
      .eq('user_id', user.id)
      .eq('story_id', storyId);

    if (activeProfile) {
      deleteQuery = deleteQuery.eq('child_profile_id', activeProfile.id);
    } else {
      deleteQuery = deleteQuery.is('child_profile_id', null);
    }

    const { error } = await deleteQuery;

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

// Hook to get all progress and completed stories for dashboard (filtered by active child profile)
export function useAllStoryProgress() {
  const { user, isAuthenticated } = useAuth();
  const { activeProfile } = useChildProfiles();
  const [allProgress, setAllProgress] = useState<StoryProgress[]>([]);
  const [completedStories, setCompletedStories] = useState<CompletedStory[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAllData = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    let progressQuery = supabase
      .from('story_progress')
      .select('*')
      .eq('user_id', user.id);

    let completedQuery = supabase
      .from('completed_stories')
      .select('*')
      .eq('user_id', user.id)
      .order('completed_at', { ascending: false });

    // Filter by active profile if one is selected
    if (activeProfile) {
      progressQuery = progressQuery.eq('child_profile_id', activeProfile.id);
      completedQuery = completedQuery.eq('child_profile_id', activeProfile.id);
    } else {
      progressQuery = progressQuery.is('child_profile_id', null);
      completedQuery = completedQuery.is('child_profile_id', null);
    }

    const [progressResult, completedResult] = await Promise.all([
      progressQuery,
      completedQuery
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
  }, [user, activeProfile]);

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
