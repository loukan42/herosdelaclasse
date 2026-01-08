import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuthContext } from '@/contexts/AuthContext';

export interface UserPoints {
  id: string;
  user_id: string;
  points: number;
  last_spin_at: string | null;
  created_at: string;
  updated_at: string;
}

export function useUserPoints() {
  const { user, isAuthenticated } = useAuthContext();
  const [userPoints, setUserPoints] = useState<UserPoints | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch user points
  const fetchPoints = useCallback(async () => {
    if (!user) {
      setUserPoints(null);
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from('user_points')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle();

    if (error) {
      console.error('Error fetching user points:', error);
      setLoading(false);
      return;
    }

    // If no record exists, create one
    if (!data) {
      const { data: newData, error: insertError } = await supabase
        .from('user_points')
        .insert({ user_id: user.id, points: 0 })
        .select()
        .single();

      if (insertError) {
        console.error('Error creating user points:', insertError);
      } else {
        setUserPoints(newData);
      }
    } else {
      setUserPoints(data);
    }

    setLoading(false);
  }, [user]);

  useEffect(() => {
    fetchPoints();
  }, [fetchPoints]);

  // Add points (called when story is completed)
  const addPoints = useCallback(async (amount: number = 1): Promise<boolean> => {
    if (!user) return false;
    
    // If userPoints is not loaded yet, fetch it first
    let currentPoints = userPoints;
    if (!currentPoints) {
      const { data } = await supabase
        .from('user_points')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();
      
      if (!data) {
        // Create record if it doesn't exist
        const { data: newData, error: insertError } = await supabase
          .from('user_points')
          .insert({ user_id: user.id, points: amount })
          .select()
          .single();
        
        if (insertError) {
          console.error('Error creating user points:', insertError);
          return false;
        }
        
        setUserPoints(newData);
        return true;
      }
      currentPoints = data;
    }

    const newTotal = currentPoints.points + amount;
    
    const { error } = await supabase
      .from('user_points')
      .update({ points: newTotal })
      .eq('user_id', user.id);

    if (error) {
      console.error('Error adding points:', error);
      return false;
    }

    setUserPoints(prev => prev ? { ...prev, points: newTotal } : { ...currentPoints!, points: newTotal });
    return true;
  }, [user, userPoints]);

  // Check if user can spin (has points and 24h since last spin)
  const canSpin = useCallback(() => {
    if (!userPoints) return false;
    if (userPoints.points < 1) return false;
    
    if (!userPoints.last_spin_at) return true;
    
    const lastSpin = new Date(userPoints.last_spin_at);
    const now = new Date();
    const hoursDiff = (now.getTime() - lastSpin.getTime()) / (1000 * 60 * 60);
    
    return hoursDiff >= 24;
  }, [userPoints]);

  // Get time until next spin
  const getTimeUntilNextSpin = useCallback(() => {
    if (!userPoints?.last_spin_at) return null;
    
    const lastSpin = new Date(userPoints.last_spin_at);
    const nextSpin = new Date(lastSpin.getTime() + 24 * 60 * 60 * 1000);
    const now = new Date();
    
    if (now >= nextSpin) return null;
    
    const diffMs = nextSpin.getTime() - now.getTime();
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    
    return { hours, minutes };
  }, [userPoints]);

  // Consume a point and update last spin time
  const consumeSpinPoint = useCallback(async () => {
    if (!user || !userPoints || !canSpin()) return false;

    const { error } = await supabase
      .from('user_points')
      .update({ 
        points: userPoints.points - 1,
        last_spin_at: new Date().toISOString()
      })
      .eq('user_id', user.id);

    if (error) {
      console.error('Error consuming spin point:', error);
      return false;
    }

    setUserPoints(prev => prev ? { 
      ...prev, 
      points: prev.points - 1,
      last_spin_at: new Date().toISOString()
    } : null);
    
    return true;
  }, [user, userPoints, canSpin]);

  return {
    points: userPoints?.points ?? 0,
    loading,
    isAuthenticated,
    addPoints,
    canSpin: canSpin(),
    getTimeUntilNextSpin,
    consumeSpinPoint,
    refresh: fetchPoints
  };
}
