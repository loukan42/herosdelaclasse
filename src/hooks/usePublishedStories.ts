import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Story, StoryPage, Choice } from '@/data/stories';

interface InventoryItem {
  id: string;
  name: string;
  icon: string;
}

interface AdminStoryRow {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  cover_image_url: string | null;
  level: string;
  subject_id: string[]; // Now an array
  start_page_id: string;
  is_published: boolean;
  inventory_items: unknown;
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
  collected_item_id: string | null;
}

export interface StoryInventoryConfig {
  items: InventoryItem[];
  pageItems: Record<string, string>; // pageId -> itemId
}

export function usePublishedStories() {
  const [stories, setStories] = useState<Story[]>([]);
  const [pages, setPages] = useState<Record<string, StoryPage[]>>({});
  const [inventoryConfigs, setInventoryConfigs] = useState<Record<string, StoryInventoryConfig>>({});
  const [loading, setLoading] = useState(true);

  const fetchPublishedStories = useCallback(async () => {
    setLoading(true);
    
    // Fetch published stories using the secure view that excludes sensitive admin data (created_by)
    const { data: storiesData, error: storiesError } = await supabase
      .from('published_stories_view')
      .select('*');

    // Also fetch inventory_items from admin_stories table directly
    const { data: inventoryData } = await supabase
      .from('admin_stories')
      .select('slug, inventory_items')
      .eq('is_published', true);

    console.log('[usePublishedStories] Fetched stories:', storiesData?.length, storiesData);

    if (storiesError || !storiesData) {
      console.error('Error fetching published stories:', storiesError);
      setLoading(false);
      return;
    }

    // Transform to Story format - create one entry per subject for each story
    const transformedStories: Story[] = [];
    storiesData.forEach(s => {
      // Handle subject_id as array (new format) or string (old format)
      const rawSubjectId = s.subject_id as unknown;
      const subjectIds: string[] = Array.isArray(rawSubjectId) 
        ? rawSubjectId 
        : (typeof rawSubjectId === 'string' ? [rawSubjectId] : []);
      
      if (subjectIds.length === 0) {
        console.warn('[usePublishedStories] Story has no subjects:', s.slug);
        return;
      }
      
      subjectIds.forEach(subjectId => {
        transformedStories.push({
          id: `admin-${s.slug}`,
          title: s.title || '',
          coverImage: s.cover_image_url || '',
          level: s.level || 'CP',
          description: s.description || '',
          startPageId: s.start_page_id || 'page-1',
          subjectId: subjectId
        });
      });
    });

    console.log('[usePublishedStories] Transformed stories:', transformedStories.length, transformedStories);
    setStories(transformedStories);

    // Fetch all pages for these stories and build inventory configs
    const inventoryConfigsMap: Record<string, StoryInventoryConfig> = {};
    
    // Initialize inventory configs from story data
    if (inventoryData) {
      inventoryData.forEach(s => {
        const rawItems = s.inventory_items;
        const items: InventoryItem[] = Array.isArray(rawItems) 
          ? rawItems.map((item: unknown) => {
              const obj = item as { id?: string; name?: string; icon?: string };
              return {
                id: obj.id || '',
                name: obj.name || '',
                icon: obj.icon || 'gem'
              };
            })
          : [];
        if (items.length > 0) {
          inventoryConfigsMap[`admin-${s.slug}`] = {
            items,
            pageItems: {}
          };
        }
      });
    }

    if (storiesData.length > 0) {
      const storyIds = storiesData.map(s => s.id);
      const { data: pagesData, error: pagesError } = await supabase
        .from('admin_story_pages')
        .select('id, story_id, page_id, title, text, text_masculine, text_feminine, image_url, choices, is_ending, ending_type, sort_order, collected_item_id')
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

          // Add page item mapping for inventory
          if (p.collected_item_id && inventoryConfigsMap[storyKey]) {
            inventoryConfigsMap[storyKey].pageItems[p.page_id] = p.collected_item_id;
          }
        });
        
        setPages(pagesMap);
        setInventoryConfigs(inventoryConfigsMap);
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
    inventoryConfigs,
    loading,
    refresh: fetchPublishedStories
  };
}
