import { useState, useEffect } from "react";

const STORAGE_KEY = "story-read-counts";

function getReadCounts(): Record<string, number> {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
}

function saveReadCounts(counts: Record<string, number>) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(counts));
}

export function useReadCount(storyId: string) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const counts = getReadCounts();
    setCount(counts[storyId] || 0);
  }, [storyId]);

  const incrementCount = () => {
    const counts = getReadCounts();
    const newCount = (counts[storyId] || 0) + 1;
    counts[storyId] = newCount;
    saveReadCounts(counts);
    setCount(newCount);
  };

  return { count, incrementCount };
}

export function getStoredReadCount(storyId: string): number {
  const counts = getReadCounts();
  return counts[storyId] || 0;
}
