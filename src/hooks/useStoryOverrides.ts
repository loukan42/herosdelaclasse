import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface StoryPageOverride {
  id: string;
  story_id: string;
  page_id: string;
  text: string;
  text_masculine?: string;
  text_feminine?: string;
  updated_at: string;
}

// Cache for overrides to avoid refetching
const overridesCache: Record<string, StoryPageOverride> = {};
let cacheInitialized = false;

export function useStoryOverrides() {
  const [loading, setLoading] = useState(!cacheInitialized);

  // Fetch all overrides and cache them (using secure public view without updated_by)
  const fetchAllOverrides = useCallback(async () => {
    if (cacheInitialized) return;
    
    const { data, error } = await supabase
      .from('story_page_overrides_public_view')
      .select('*');

    if (!error && data) {
      data.forEach((override: any) => {
        overridesCache[`${override.story_id}-${override.page_id}`] = override as StoryPageOverride;
      });
      cacheInitialized = true;
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchAllOverrides();
  }, [fetchAllOverrides]);

  // Get override for a specific page
  const getOverride = useCallback((storyId: string, pageId: string): StoryPageOverride | null => {
    return overridesCache[`${storyId}-${pageId}`] || null;
  }, []);

  // Save override (admin only)
  const saveOverride = useCallback(async (
    storyId: string,
    pageId: string,
    text: string,
    textMasculine?: string,
    textFeminine?: string
  ) => {
    const { data: { user } } = await supabase.auth.getUser();
    
    const { data, error } = await supabase
      .from('story_page_overrides')
      .upsert({
        story_id: storyId,
        page_id: pageId,
        text,
        text_masculine: textMasculine,
        text_feminine: textFeminine,
        updated_by: user?.id
      }, {
        onConflict: 'story_id,page_id'
      })
      .select()
      .single();

    if (!error && data) {
      // Update cache
      overridesCache[`${storyId}-${pageId}`] = data;
      return { success: true, data };
    }

    return { success: false, error };
  }, []);

  // Delete override (revert to original)
  const deleteOverride = useCallback(async (storyId: string, pageId: string) => {
    const { error } = await supabase
      .from('story_page_overrides')
      .delete()
      .eq('story_id', storyId)
      .eq('page_id', pageId);

    if (!error) {
      delete overridesCache[`${storyId}-${pageId}`];
      return { success: true };
    }

    return { success: false, error };
  }, []);

  return {
    loading,
    getOverride,
    saveOverride,
    deleteOverride
  };
}
