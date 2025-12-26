import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface StoryChoice {
  label: string;
  targetPageId: string;
  image?: string;
}

export interface AdminStoryPage {
  id: string;
  story_id: string;
  page_id: string;
  title: string | null;
  text: string;
  text_masculine: string | null;
  text_feminine: string | null;
  image_url: string | null;
  choices: StoryChoice[];
  is_ending: boolean;
  ending_type: 'happy' | 'neutral' | 'sad' | null;
  sort_order: number;
}

export interface AdminStory {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  cover_image_url: string | null;
  level: 'CP' | 'CE1' | 'CE2' | 'CM1' | 'CM2';
  subject_id: string;
  start_page_id: string;
  is_published: boolean;
  created_at: string;
  updated_at: string;
  pages?: AdminStoryPage[];
}

export function useAdminStories() {
  const [stories, setStories] = useState<AdminStory[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchStories = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('admin_stories')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setStories(data as AdminStory[]);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchStories();
  }, [fetchStories]);

  const createStory = async (story: Omit<AdminStory, 'id' | 'created_at' | 'updated_at' | 'pages'>) => {
    const { data: { user } } = await supabase.auth.getUser();
    
    const { data, error } = await supabase
      .from('admin_stories')
      .insert({
        ...story,
        created_by: user?.id
      })
      .select()
      .single();

    if (!error && data) {
      await fetchStories();
      return { success: true, data: data as AdminStory };
    }
    return { success: false, error };
  };

  const updateStory = async (id: string, updates: Partial<AdminStory>) => {
    const { data, error } = await supabase
      .from('admin_stories')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (!error && data) {
      await fetchStories();
      return { success: true, data: data as AdminStory };
    }
    return { success: false, error };
  };

  const deleteStory = async (id: string) => {
    const { error } = await supabase
      .from('admin_stories')
      .delete()
      .eq('id', id);

    if (!error) {
      await fetchStories();
      return { success: true };
    }
    return { success: false, error };
  };

  const getStoryWithPages = async (storyId: string) => {
    const { data: story, error: storyError } = await supabase
      .from('admin_stories')
      .select('*')
      .eq('id', storyId)
      .single();

    if (storyError) return { success: false, error: storyError };

    const { data: pages, error: pagesError } = await supabase
      .from('admin_story_pages')
      .select('*')
      .eq('story_id', storyId)
      .order('sort_order');

    if (pagesError) return { success: false, error: pagesError };

    return { 
      success: true, 
      data: { 
        ...story, 
        pages: pages.map(p => ({
          ...p,
          choices: (Array.isArray(p.choices) ? p.choices : []) as unknown as StoryChoice[]
        }))
      } as AdminStory 
    };
  };

  return {
    stories,
    loading,
    fetchStories,
    createStory,
    updateStory,
    deleteStory,
    getStoryWithPages
  };
}

export function useAdminStoryPages(storyId: string | undefined) {
  const [pages, setPages] = useState<AdminStoryPage[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPages = useCallback(async () => {
    if (!storyId) {
      setPages([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const { data, error } = await supabase
      .from('admin_story_pages')
      .select('*')
      .eq('story_id', storyId)
      .order('sort_order');

    if (!error && data) {
      setPages(data.map(p => ({
        ...p,
        choices: (Array.isArray(p.choices) ? p.choices : []) as unknown as StoryChoice[]
      })) as AdminStoryPage[]);
    }
    setLoading(false);
  }, [storyId]);

  useEffect(() => {
    fetchPages();
  }, [fetchPages]);

  const createPage = async (page: Omit<AdminStoryPage, 'id'>) => {
    const insertData = {
      story_id: page.story_id,
      page_id: page.page_id,
      title: page.title,
      text: page.text,
      text_masculine: page.text_masculine,
      text_feminine: page.text_feminine,
      image_url: page.image_url,
      choices: JSON.parse(JSON.stringify(page.choices)),
      is_ending: page.is_ending,
      ending_type: page.ending_type,
      sort_order: page.sort_order
    };
    
    const { data, error } = await supabase
      .from('admin_story_pages')
      .insert([insertData])
      .select()
      .single();

    if (!error && data) {
      await fetchPages();
      return { success: true, data: { ...data, choices: (Array.isArray(data.choices) ? data.choices : []) as unknown as StoryChoice[] } as AdminStoryPage };
    }
    return { success: false, error };
  };

  const updatePage = async (id: string, updates: Partial<AdminStoryPage>) => {
    const updateData: Record<string, unknown> = {};
    if (updates.page_id !== undefined) updateData.page_id = updates.page_id;
    if (updates.title !== undefined) updateData.title = updates.title;
    if (updates.text !== undefined) updateData.text = updates.text;
    if (updates.text_masculine !== undefined) updateData.text_masculine = updates.text_masculine;
    if (updates.text_feminine !== undefined) updateData.text_feminine = updates.text_feminine;
    if (updates.image_url !== undefined) updateData.image_url = updates.image_url;
    if (updates.is_ending !== undefined) updateData.is_ending = updates.is_ending;
    if (updates.ending_type !== undefined) updateData.ending_type = updates.ending_type;
    if (updates.sort_order !== undefined) updateData.sort_order = updates.sort_order;
    if (updates.choices !== undefined) {
      updateData.choices = updates.choices as unknown as Record<string, unknown>[];
    }
    
    const { data, error } = await supabase
      .from('admin_story_pages')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (!error && data) {
      await fetchPages();
      return { success: true, data: { ...data, choices: (Array.isArray(data.choices) ? data.choices : []) as unknown as StoryChoice[] } as AdminStoryPage };
    }
    return { success: false, error };
  };

  const deletePage = async (id: string) => {
    const { error } = await supabase
      .from('admin_story_pages')
      .delete()
      .eq('id', id);

    if (!error) {
      await fetchPages();
      return { success: true };
    }
    return { success: false, error };
  };

  return {
    pages,
    loading,
    fetchPages,
    createPage,
    updatePage,
    deletePage
  };
}
