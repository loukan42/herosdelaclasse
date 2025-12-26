import React, { createContext, useContext, ReactNode } from 'react';
import { usePublishedStories } from '@/hooks/usePublishedStories';
import { Story, StoryPage } from '@/data/stories';

interface PublishedStoriesContextType {
  stories: Story[];
  pages: Record<string, StoryPage[]>;
  loading: boolean;
  refresh: () => void;
}

const PublishedStoriesContext = createContext<PublishedStoriesContextType | undefined>(undefined);

export function PublishedStoriesProvider({ children }: { children: ReactNode }) {
  const { stories, pages, loading, refresh } = usePublishedStories();

  return (
    <PublishedStoriesContext.Provider value={{ stories, pages, loading, refresh }}>
      {children}
    </PublishedStoriesContext.Provider>
  );
}

export function usePublishedStoriesContext() {
  const context = useContext(PublishedStoriesContext);
  if (context === undefined) {
    throw new Error('usePublishedStoriesContext must be used within a PublishedStoriesProvider');
  }
  return context;
}
