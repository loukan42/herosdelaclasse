import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface ChildProfile {
  id: string;
  parent_user_id: string;
  prenom: string;
  avatar: string;
  genre?: 'masculin' | 'feminin' | null;
  created_at: string;
  updated_at: string;
}

interface ChildProfileContextType {
  profiles: ChildProfile[];
  activeProfile: ChildProfile | null;
  loading: boolean;
  setActiveProfile: (profile: ChildProfile | null) => void;
  fetchProfiles: () => Promise<void>;
  createProfile: (prenom: string, avatar: string, genre?: 'masculin' | 'feminin' | null) => Promise<{ success: boolean; data?: ChildProfile; error?: Error }>;
  updateProfile: (id: string, updates: { prenom?: string; avatar?: string; genre?: 'masculin' | 'feminin' | null }) => Promise<{ success: boolean; error?: Error }>;
  deleteProfile: (id: string) => Promise<{ success: boolean; error?: Error }>;
}

const ChildProfileContext = createContext<ChildProfileContextType | undefined>(undefined);

export function ChildProfileProvider({ children }: { children: ReactNode }) {
  const [profiles, setProfiles] = useState<ChildProfile[]>([]);
  const [activeProfile, setActiveProfileState] = useState<ChildProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfiles = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setProfiles([]);
      setActiveProfileState(null);
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from('children_profiles')
      .select('*')
      .eq('parent_user_id', user.id)
      .order('created_at');

    if (!error && data) {
      setProfiles(data as ChildProfile[]);
      
      // Restore active profile from localStorage
      const savedProfileId = localStorage.getItem('activeChildProfileId');
      if (savedProfileId) {
        const savedProfile = data.find(p => p.id === savedProfileId);
        if (savedProfile) {
          setActiveProfileState(savedProfile as ChildProfile);
        } else if (data.length > 0) {
          setActiveProfileState(data[0] as ChildProfile);
        }
      } else if (data.length > 0) {
        setActiveProfileState(data[0] as ChildProfile);
      }
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchProfiles();
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      fetchProfiles();
    });

    return () => subscription.unsubscribe();
  }, [fetchProfiles]);

  const setActiveProfile = (profile: ChildProfile | null) => {
    setActiveProfileState(profile);
    if (profile) {
      localStorage.setItem('activeChildProfileId', profile.id);
    } else {
      localStorage.removeItem('activeChildProfileId');
    }
  };

  const createProfile = async (prenom: string, avatar: string, genre?: 'masculin' | 'feminin' | null) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, error: new Error('Non authentifié') };

    const { data, error } = await supabase
      .from('children_profiles')
      .insert([{ parent_user_id: user.id, prenom, avatar, genre }])
      .select()
      .single();

    if (error) return { success: false, error };
    
    await fetchProfiles();
    
    // Set as active if it's the first profile
    if (profiles.length === 0 && data) {
      setActiveProfile(data as ChildProfile);
    }
    
    return { success: true, data: data as ChildProfile };
  };

  const updateProfile = async (id: string, updates: { prenom?: string; avatar?: string; genre?: 'masculin' | 'feminin' | null }) => {
    const { error } = await supabase
      .from('children_profiles')
      .update(updates)
      .eq('id', id);

    if (error) return { success: false, error };
    
    await fetchProfiles();
    return { success: true };
  };

  const deleteProfile = async (id: string) => {
    const { error } = await supabase
      .from('children_profiles')
      .delete()
      .eq('id', id);

    if (error) return { success: false, error };
    
    // If deleting active profile, switch to another
    if (activeProfile?.id === id) {
      const remaining = profiles.filter(p => p.id !== id);
      setActiveProfile(remaining.length > 0 ? remaining[0] : null);
    }
    
    await fetchProfiles();
    return { success: true };
  };

  return (
    <ChildProfileContext.Provider value={{
      profiles,
      activeProfile,
      loading,
      setActiveProfile,
      fetchProfiles,
      createProfile,
      updateProfile,
      deleteProfile
    }}>
      {children}
    </ChildProfileContext.Provider>
  );
}

export function useChildProfiles() {
  const context = useContext(ChildProfileContext);
  if (!context) {
    throw new Error('useChildProfiles must be used within a ChildProfileProvider');
  }
  return context;
}
