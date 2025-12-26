import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Story, StoryPage, Choice } from '@/data/stories';

interface AdminStoryRow {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  cover_image_url: string | null;
  level: string;
  subject_id: string;
  start_page_id: string;
  is_published: boolean;
}

interface AdminPageRow {
  id: string;
  story_id: string;
  page_id: string;
  title: string | null;
  text: string;
  text_masculine: string | null;
  text_feminine: string | null;
  image_url: string | null;
  choices: unknown;
  is_ending: boolean;
  ending_type: string | null;
  sort_order: number;
}

export function usePublishedStories() {
  const [stories, setStories] = useState<Story[]>([]);
  const [pages, setPages] = useState<Record<string, StoryPage[]>>({});
  const [loading, setLoading] = useState(true);

  const fetchPublishedStories = useCallback(async () => {
    setLoading(true);
    
    // Fetch published stories - explicitly select only public columns (excluding created_by for security)
    const { data: storiesData, error: storiesError } = await supabase
      .from('admin_stories')
      .select('id, slug, title, description, cover_image_url, level, subject_id, start_page_id, is_published, created_at, updated_at')
      .eq('is_published', true);

    if (storiesError || !storiesData) {
      console.error('Error fetching published stories:', storiesError);
      setLoading(false);
      return;
    }

    // Transform to Story format
    const transformedStories: Story[] = (storiesData as AdminStoryRow[]).map(s => ({
      id: `admin-${s.slug}`,
      title: s.title,
      coverImage: s.cover_image_url || '',
      level: s.level,
      description: s.description || '',
      startPageId: s.start_page_id,
      subjectId: s.subject_id
    }));

    setStories(transformedStories);

    // Fetch all pages for these stories
    if (storiesData.length > 0) {
      const storyIds = storiesData.map(s => s.id);
      const { data: pagesData, error: pagesError } = await supabase
        .from('admin_story_pages')
        .select('id, story_id, page_id, title, text, text_masculine, text_feminine, image_url, choices, is_ending, ending_type, sort_order')
        .in('story_id', storyIds)
        .order('sort_order');

      if (!pagesError && pagesData) {
        const pagesMap: Record<string, StoryPage[]> = {};
        
        (pagesData as AdminPageRow[]).forEach(p => {
          // Find the story slug for this page
          const story = storiesData.find(s => s.id === p.story_id);
          if (!story) return;
          
          const storyKey = `admin-${story.slug}`;
          
          if (!pagesMap[storyKey]) {
            pagesMap[storyKey] = [];
          }
          
          const choices = Array.isArray(p.choices) ? p.choices as { label: string; targetPageId: string; image?: string }[] : [];
          
          pagesMap[storyKey].push({
            id: p.page_id,
            storyId: storyKey,
            image: p.image_url || '',
            title: p.title || undefined,
            text: p.text,
            textMasculine: p.text_masculine || undefined,
            textFeminine: p.text_feminine || undefined,
            choices: choices.map(c => ({
              label: c.label,
              targetPageId: c.targetPageId,
              image: c.image
            })),
            isEnding: p.is_ending,
            endingType: p.ending_type as 'happy' | 'alternative' | 'neutral' | 'bad' | undefined
          });
        });
        
        setPages(pagesMap);
      }
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    fetchPublishedStories();
  }, [fetchPublishedStories]);

  return {
    stories,
    pages,
    loading,
    refresh: fetchPublishedStories
  };
}
