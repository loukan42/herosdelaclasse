import { usePublishedStoriesContext } from '@/contexts/PublishedStoriesContext';
import { 
  stories as staticStories, 
  storyPages as staticStoryPages,
  Story, 
  StoryPage 
} from '@/data/stories';

export function useCombinedStories() {
  const { stories: publishedStories, pages: publishedPages } = usePublishedStoriesContext();

  const getAllStories = (): Story[] => {
    // Combine static and published stories, avoiding duplicates by id
    const allStories = [...staticStories, ...publishedStories];
    const uniqueStoriesMap = new Map<string, Story>();
    
    // Published stories (admin-) take priority over static stories with same base id
    for (const story of allStories) {
      const existingStory = uniqueStoriesMap.get(story.id);
      if (!existingStory) {
        uniqueStoriesMap.set(story.id, story);
      }
    }
    
    return Array.from(uniqueStoriesMap.values());
  };

  const getStory = (storyId: string): Story | undefined => {
    // Check published stories first (prefixed with admin-)
    if (storyId.startsWith('admin-')) {
      return publishedStories.find(s => s.id === storyId);
    }
    // Fall back to static stories
    return staticStories.find(s => s.id === storyId);
  };

  const getStoryPages = (storyId: string): StoryPage[] => {
    // Check published stories first
    if (storyId.startsWith('admin-')) {
      return publishedPages[storyId] || [];
    }
    // Fall back to static stories
    return staticStoryPages[storyId] || [];
  };

  const getPage = (storyId: string, pageId: string): StoryPage | undefined => {
    const pages = getStoryPages(storyId);
    return pages.find(p => p.id === pageId);
  };

  const getStoriesBySubject = (subjectId: string): Story[] => {
    const allStories = getAllStories();
    return allStories.filter(story => story.subjectId === subjectId);
  };

  return {
    getAllStories,
    getStory,
    getStoryPages,
    getPage,
    getStoriesBySubject
  };
}
