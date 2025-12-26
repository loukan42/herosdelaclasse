import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthContext } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { User, LogOut, BookOpen, Crown } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const AVATAR_EMOJIS: Record<string, string> = {
  lion: '🦁',
  panda: '🐼',
  lapin: '🐰',
  renard: '🦊',
  hibou: '🦉',
  papillon: '🦋',
  dauphin: '🐬',
  etoile: '⭐',
  default: '👤',
};

export function UserMenu() {
  const { profile, isAuthenticated, signOut, loading, user } = useAuthContext();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isAdmin, setIsAdmin] = useState(false);

  // Check admin status
  useEffect(() => {
    const checkAdmin = async () => {
      if (!user) {
        setIsAdmin(false);
        return;
      }

      const { data } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .eq('role', 'admin')
        .maybeSingle();

      setIsAdmin(!!data);
    };

    checkAdmin();
  }, [user]);

  const handleSignOut = async () => {
    const { error } = await signOut();
    if (error) {
      toast({
        title: "Erreur",
        description: "Impossible de se déconnecter",
        variant: "destructive"
      });
    } else {
      toast({
        title: "À bientôt !",
        description: "Tu as été déconnecté.",
      });
      navigate('/');
    }
  };

  if (loading) {
    return (
      <div className="w-10 h-10 rounded-full bg-muted animate-pulse" />
    );
  }

  if (!isAuthenticated) {
    return (
      <Button asChild variant="outline" size="sm" className="gap-2">
        <Link to="/auth">
          <User className="w-4 h-4" />
          <span className="hidden sm:inline">Connexion</span>
        </Link>
      </Button>
    );
  }

  const avatarEmoji = AVATAR_EMOJIS[profile?.avatar || 'default'] || AVATAR_EMOJIS.default;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-2 px-3 py-2 rounded-full bg-primary/10 hover:bg-primary/20 transition-colors">
          <span className="text-2xl">{avatarEmoji}</span>
          <span className="font-medium text-foreground hidden sm:inline">
            {profile?.prenom || 'Aventurier'}
          </span>
          {isAdmin && <Crown className="w-4 h-4 text-golden" />}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <div className="px-3 py-2">
          <p className="font-semibold">{profile?.prenom || 'Aventurier'}</p>
          <p className="text-xs text-muted-foreground">Mon compte</p>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link to="/my-stories" className="flex items-center gap-2 cursor-pointer">
            <BookOpen className="w-4 h-4" />
            Mes histoires
          </Link>
        </DropdownMenuItem>
        {isAdmin && (
          <DropdownMenuItem asChild>
            <Link to="/admin" className="flex items-center gap-2 cursor-pointer text-golden">
              <Crown className="w-4 h-4" />
              Administration
            </Link>
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          onClick={handleSignOut}
          className="flex items-center gap-2 text-destructive focus:text-destructive cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          Se déconnecter
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
