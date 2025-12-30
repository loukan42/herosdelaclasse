import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuthContext } from '@/contexts/AuthContext';

export interface AdminUser {
  id: string;
  prenom: string;
  avatar: string;
  email: string;
  created_at: string;
  last_login: string | null;
  stories_completed: number;
  stories_in_progress: number;
}

export interface AdminStats {
  total_users: number;
  total_completed_stories: number;
  active_today: number;
  active_this_week: number;
}

export function useAdmin() {
  const { user } = useAuthContext();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [stats, setStats] = useState<AdminStats | null>(null);

  // Check if current user is admin
  const checkAdmin = useCallback(async () => {
    if (!user) {
      setIsAdmin(false);
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .eq('role', 'admin')
      .maybeSingle();

    setIsAdmin(!error && !!data);
    setLoading(false);
  }, [user]);

  useEffect(() => {
    checkAdmin();
  }, [checkAdmin]);

  // Fetch all users with their stats (admin only)
  const fetchUsers = useCallback(async () => {
    if (!isAdmin) return;

    // Fetch profiles
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (profilesError) {
      console.error('Error fetching profiles:', profilesError);
      return;
    }

    // Fetch completed stories counts
    const { data: completedCounts } = await supabase
      .from('completed_stories')
      .select('user_id');

    // Fetch in progress counts
    const { data: progressCounts } = await supabase
      .from('story_progress')
      .select('user_id');

    // Fetch user emails via secure RPC function
    const { data: userEmails } = await supabase.rpc('get_user_emails');
    const emailMap = new Map<string, string>();
    if (userEmails) {
      userEmails.forEach((u: { user_id: string; email: string }) => {
        emailMap.set(u.user_id, u.email);
      });
    }

    const usersWithStats: AdminUser[] = profiles.map(profile => {
      const completed = completedCounts?.filter(c => c.user_id === profile.id).length || 0;
      const inProgress = progressCounts?.filter(p => p.user_id === profile.id).length || 0;

      return {
        id: profile.id,
        prenom: profile.prenom,
        avatar: profile.avatar,
        email: emailMap.get(profile.id) || '',
        created_at: profile.created_at,
        last_login: profile.last_login,
        stories_completed: completed,
        stories_in_progress: inProgress
      };
    });

    setUsers(usersWithStats);
  }, [isAdmin]);

  // Fetch admin stats
  const fetchStats = useCallback(async () => {
    if (!isAdmin) return;

    const { data, error } = await supabase.rpc('get_admin_stats');

    if (!error && data) {
      setStats(data as unknown as AdminStats);
    }
  }, [isAdmin]);

  useEffect(() => {
    if (isAdmin) {
      fetchUsers();
      fetchStats();
    }
  }, [isAdmin, fetchUsers, fetchStats]);

  // Refresh data
  const refresh = useCallback(() => {
    fetchUsers();
    fetchStats();
  }, [fetchUsers, fetchStats]);

  return {
    isAdmin,
    loading,
    users,
    stats,
    refresh
  };
}
