import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuthContext } from '@/contexts/AuthContext';
import { useAdmin } from '@/hooks/useAdmin';

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
  const { isAdmin } = useAdmin();
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
  // Admin users bypass the 24h cooldown restriction
  const canSpin = useCallback(() => {
    if (!userPoints) return false;
    if (userPoints.points < 1) return false;
    
    // Admins can always spin (no 24h restriction)
    if (isAdmin) return true;
    
    if (!userPoints.last_spin_at) return true;
    
    const lastSpin = new Date(userPoints.last_spin_at);
    const now = new Date();
    const hoursDiff = (now.getTime() - lastSpin.getTime()) / (1000 * 60 * 60);
    
    return hoursDiff >= 24;
  }, [userPoints, isAdmin]);

  // Get time until next spin (returns null for admins since they have no cooldown)
  const getTimeUntilNextSpin = useCallback(() => {
    // Admins never see a timer
    if (isAdmin) return null;
    
    if (!userPoints?.last_spin_at) return null;
    
    const lastSpin = new Date(userPoints.last_spin_at);
    const nextSpin = new Date(lastSpin.getTime() + 24 * 60 * 60 * 1000);
    const now = new Date();
    
    if (now >= nextSpin) return null;
    
    const diffMs = nextSpin.getTime() - now.getTime();
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    
    return { hours, minutes };
  }, [userPoints, isAdmin]);

  // Consume points and update last spin time
  // Admins don't get the last_spin_at updated (no cooldown for them)
  const consumeSpinPoints = useCallback(async (amount: number = 1) => {
    if (!user || !userPoints) return false;
    
    // Check if user has enough points
    if (userPoints.points < amount) return false;
    
    // Check canSpin for non-admins
    if (!isAdmin && !canSpin()) return false;

    const newPoints = Math.max(0, userPoints.points - amount);
    
    // For admins: only update points, not last_spin_at
    // For regular users: update both
    const updateData = isAdmin 
      ? { points: newPoints }
      : { points: newPoints, last_spin_at: new Date().toISOString() };

    const { error } = await supabase
      .from('user_points')
      .update(updateData)
      .eq('user_id', user.id);

    if (error) {
      console.error('Error consuming spin points:', error);
      return false;
    }

    setUserPoints(prev => prev ? { 
      ...prev, 
      points: newPoints,
      ...(isAdmin ? {} : { last_spin_at: new Date().toISOString() })
    } : null);
    
    return true;
  }, [user, userPoints, canSpin, isAdmin]);

  // Legacy function for backwards compatibility
  const consumeSpinPoint = useCallback(async () => {
    return consumeSpinPoints(1);
  }, [consumeSpinPoints]);

  return {
    points: userPoints?.points ?? 0,
    loading,
    isAuthenticated,
    addPoints,
    canSpin: canSpin(),
    getTimeUntilNextSpin,
    consumeSpinPoint,
    consumeSpinPoints,
    refresh: fetchPoints
  };
}
