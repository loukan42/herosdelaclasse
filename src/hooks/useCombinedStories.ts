import { usePublishedStoriesContext } from '@/contexts/PublishedStoriesContext';
import { 
  stories as staticStories, 
  storyPages as staticStoryPages,
  Story, 
  StoryPage 
} from '@/data/stories';

export function useCombinedStories() {
  const { stories: publishedStories, pages: publishedPages, loading } = usePublishedStoriesContext();

  const getAllStories = (): Story[] => {
    // Combine static and published stories
    // Published stories can have multiple entries for the same story (one per subject)
    // We keep all of them for proper subject filtering
    const allStories = [...staticStories, ...publishedStories];
    
    // For deduplication, we use a composite key of id + subjectId
    const uniqueStoriesMap = new Map<string, Story>();
    
    for (const story of allStories) {
      const compositeKey = `${story.id}-${story.subjectId}`;
      if (!uniqueStoriesMap.has(compositeKey)) {
        uniqueStoriesMap.set(compositeKey, story);
      }
    }
    
    return Array.from(uniqueStoriesMap.values());
  };

  const getStory = (storyId: string): Story | undefined => {
    // Check published stories first (prefixed with admin-)
    if (storyId.startsWith('admin-')) {
      // Return the first match (they all have the same core data, just different subjectId)
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

  const getStoriesByLevel = (level: string): Story[] => {
    const allStories = getAllStories();
    return allStories.filter(story => story.level === level);
  };

  const getStoriesBySubjectAndLevel = (subjectId: string, level: string): Story[] => {
    const allStories = getAllStories();
    return allStories.filter(story => story.subjectId === subjectId && story.level === level);
  };

  return {
    getAllStories,
    getStory,
    getStoryPages,
    getPage,
    getStoriesBySubject,
    getStoriesByLevel,
    getStoriesBySubjectAndLevel,
    loading
  };
}
