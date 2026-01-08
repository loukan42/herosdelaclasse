import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuthContext } from '@/contexts/AuthContext';

export interface CollectionTheme {
  id: string;
  title: string;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface CollectionCard {
  id: string;
  theme_id: string;
  title: string;
  image_url: string;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface UnlockedCard {
  id: string;
  user_id: string;
  card_id: string;
  unlocked_at: string;
}

export function useCollection() {
  const { user } = useAuthContext();
  const [themes, setThemes] = useState<CollectionTheme[]>([]);
  const [cards, setCards] = useState<CollectionCard[]>([]);
  const [unlockedCards, setUnlockedCards] = useState<UnlockedCard[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch all themes
  const fetchThemes = useCallback(async () => {
    const { data, error } = await supabase
      .from('collection_themes')
      .select('*')
      .order('sort_order', { ascending: true });

    if (error) {
      console.error('Error fetching themes:', error);
      return;
    }

    setThemes(data || []);
  }, []);

  // Fetch all cards
  const fetchCards = useCallback(async () => {
    const { data, error } = await supabase
      .from('collection_cards')
      .select('*')
      .order('sort_order', { ascending: true });

    if (error) {
      console.error('Error fetching cards:', error);
      return;
    }

    setCards(data || []);
  }, []);

  // Fetch user's unlocked cards
  const fetchUnlockedCards = useCallback(async () => {
    if (!user) {
      setUnlockedCards([]);
      return;
    }

    const { data, error } = await supabase
      .from('unlocked_cards')
      .select('*')
      .eq('user_id', user.id);

    if (error) {
      console.error('Error fetching unlocked cards:', error);
      return;
    }

    setUnlockedCards(data || []);
  }, [user]);

  // Initial fetch
  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      await Promise.all([fetchThemes(), fetchCards(), fetchUnlockedCards()]);
      setLoading(false);
    };
    fetchAll();
  }, [fetchThemes, fetchCards, fetchUnlockedCards]);

  // Check if a card is unlocked
  const isCardUnlocked = useCallback((cardId: string) => {
    return unlockedCards.some(uc => uc.card_id === cardId);
  }, [unlockedCards]);

  // Get all cards for a theme
  const getCardsForTheme = useCallback((themeId: string) => {
    return cards.filter(c => c.theme_id === themeId);
  }, [cards]);

  // Get unlocked count for a theme
  const getUnlockedCountForTheme = useCallback((themeId: string) => {
    const themeCards = cards.filter(c => c.theme_id === themeId);
    return themeCards.filter(c => isCardUnlocked(c.id)).length;
  }, [cards, isCardUnlocked]);

  // Unlock a random card
  const unlockRandomCard = useCallback(async () => {
    if (!user) return null;

    // Get all locked cards
    const lockedCards = cards.filter(c => !isCardUnlocked(c.id));
    
    if (lockedCards.length === 0) {
      return null; // All cards unlocked
    }

    // Pick a random card
    const randomIndex = Math.floor(Math.random() * lockedCards.length);
    const cardToUnlock = lockedCards[randomIndex];

    // Insert unlocked card
    const { error } = await supabase
      .from('unlocked_cards')
      .insert({
        user_id: user.id,
        card_id: cardToUnlock.id
      });

    if (error) {
      console.error('Error unlocking card:', error);
      return null;
    }

    // Update local state
    setUnlockedCards(prev => [...prev, {
      id: crypto.randomUUID(),
      user_id: user.id,
      card_id: cardToUnlock.id,
      unlocked_at: new Date().toISOString()
    }]);

    return cardToUnlock;
  }, [user, cards, isCardUnlocked]);

  // Unlock multiple random cards (for booster)
  const unlockMultipleCards = useCallback(async (count: number): Promise<CollectionCard[]> => {
    if (!user) return [];

    // Get all locked cards
    const lockedCards = cards.filter(c => !isCardUnlocked(c.id));
    
    if (lockedCards.length === 0) {
      return []; // All cards unlocked
    }

    // Pick random cards (up to count or remaining locked cards)
    const cardsToUnlock: CollectionCard[] = [];
    const availableCards = [...lockedCards];
    
    const numToUnlock = Math.min(count, availableCards.length);
    
    for (let i = 0; i < numToUnlock; i++) {
      const randomIndex = Math.floor(Math.random() * availableCards.length);
      cardsToUnlock.push(availableCards[randomIndex]);
      availableCards.splice(randomIndex, 1);
    }

    // Insert all unlocked cards
    const inserts = cardsToUnlock.map(card => ({
      user_id: user.id,
      card_id: card.id
    }));

    const { error } = await supabase
      .from('unlocked_cards')
      .insert(inserts);

    if (error) {
      console.error('Error unlocking cards:', error);
      return [];
    }

    // Update local state
    const newUnlocked = cardsToUnlock.map(card => ({
      id: crypto.randomUUID(),
      user_id: user.id,
      card_id: card.id,
      unlocked_at: new Date().toISOString()
    }));
    
    setUnlockedCards(prev => [...prev, ...newUnlocked]);

    return cardsToUnlock;
  }, [user, cards, isCardUnlocked]);

  // Admin: Create theme
  const createTheme = useCallback(async (title: string) => {
    const maxOrder = themes.reduce((max, t) => Math.max(max, t.sort_order), 0);
    
    const { data, error } = await supabase
      .from('collection_themes')
      .insert({ title, sort_order: maxOrder + 1 })
      .select()
      .single();

    if (error) {
      console.error('Error creating theme:', error);
      return null;
    }

    setThemes(prev => [...prev, data]);
    return data;
  }, [themes]);

  // Admin: Update theme
  const updateTheme = useCallback(async (id: string, title: string) => {
    const { error } = await supabase
      .from('collection_themes')
      .update({ title })
      .eq('id', id);

    if (error) {
      console.error('Error updating theme:', error);
      return false;
    }

    setThemes(prev => prev.map(t => t.id === id ? { ...t, title } : t));
    return true;
  }, []);

  // Admin: Delete theme
  const deleteTheme = useCallback(async (id: string) => {
    const { error } = await supabase
      .from('collection_themes')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting theme:', error);
      return false;
    }

    setThemes(prev => prev.filter(t => t.id !== id));
    setCards(prev => prev.filter(c => c.theme_id !== id));
    return true;
  }, []);

  // Admin: Create card
  const createCard = useCallback(async (themeId: string, title: string, imageFile: File) => {
    // Upload image
    const fileExt = imageFile.name.split('.').pop();
    const fileName = `${crypto.randomUUID()}.${fileExt}`;
    
    const { error: uploadError } = await supabase.storage
      .from('collection-cards')
      .upload(fileName, imageFile);

    if (uploadError) {
      console.error('Error uploading image:', uploadError);
      return null;
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('collection-cards')
      .getPublicUrl(fileName);

    const themeCards = cards.filter(c => c.theme_id === themeId);
    const maxOrder = themeCards.reduce((max, c) => Math.max(max, c.sort_order), 0);

    // Create card
    const { data, error } = await supabase
      .from('collection_cards')
      .insert({
        theme_id: themeId,
        title,
        image_url: urlData.publicUrl,
        sort_order: maxOrder + 1
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating card:', error);
      return null;
    }

    setCards(prev => [...prev, data]);
    return data;
  }, [cards]);

  // Admin: Update card title
  const updateCardTitle = useCallback(async (id: string, title: string) => {
    const { error } = await supabase
      .from('collection_cards')
      .update({ title })
      .eq('id', id);

    if (error) {
      console.error('Error updating card title:', error);
      return false;
    }

    setCards(prev => prev.map(c => c.id === id ? { ...c, title } : c));
    return true;
  }, []);

  // Admin: Delete card
  const deleteCard = useCallback(async (id: string) => {
    const card = cards.find(c => c.id === id);
    if (!card) return false;

    // Delete from storage
    const fileName = card.image_url.split('/').pop();
    if (fileName) {
      await supabase.storage.from('collection-cards').remove([fileName]);
    }

    // Delete from DB
    const { error } = await supabase
      .from('collection_cards')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting card:', error);
      return false;
    }

    setCards(prev => prev.filter(c => c.id !== id));
    return true;
  }, [cards]);

  // Get locked cards count
  const lockedCardsCount = cards.filter(c => !isCardUnlocked(c.id)).length;
  const totalCardsCount = cards.length;
  const unlockedCardsCount = unlockedCards.length;

  return {
    themes,
    cards,
    unlockedCards,
    loading,
    isCardUnlocked,
    getCardsForTheme,
    getUnlockedCountForTheme,
    unlockRandomCard,
    unlockMultipleCards,
    // Admin functions
    createTheme,
    updateTheme,
    deleteTheme,
    createCard,
    updateCardTitle,
    deleteCard,
    // Stats
    lockedCardsCount,
    totalCardsCount,
    unlockedCardsCount,
    // Refresh
    refresh: async () => {
      await Promise.all([fetchThemes(), fetchCards(), fetchUnlockedCards()]);
    }
  };
}
