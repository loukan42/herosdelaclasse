import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthContext } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { User, LogOut, BookOpen, Crown, Pencil, Gift } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { getAvatarImage } from '@/data/avatars';
import { AvatarSelector } from '@/components/AvatarSelector';

export function UserMenu() {
  const { profile, isAuthenticated, signOut, loading, user, updateProfile } = useAuthContext();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useLanguage();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isAvatarDialogOpen, setIsAvatarDialogOpen] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState(profile?.avatar || 'fille_1');
  const [isSaving, setIsSaving] = useState(false);

  // Update selected avatar when profile changes
  useEffect(() => {
    if (profile?.avatar) {
      setSelectedAvatar(profile.avatar);
    }
  }, [profile?.avatar]);

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
        title: t('common.error'),
        description: t('common.error'),
        variant: "destructive"
      });
    } else {
      toast({
        title: t('auth.goodbye'),
        description: t('auth.logoutSuccess'),
      });
      navigate('/');
    }
  };

  const handleSaveAvatar = async () => {
    setIsSaving(true);
    const { error } = await updateProfile({ avatar: selectedAvatar });
    setIsSaving(false);
    
    if (error) {
      toast({
        title: t('common.error'),
        description: t('common.error'),
        variant: "destructive"
      });
    } else {
      toast({
        title: t('menu.avatarChanged'),
        description: t('menu.avatarChangedDesc'),
      });
      setIsAvatarDialogOpen(false);
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
          <span className="hidden sm:inline">{t('auth.login')}</span>
        </Link>
      </Button>
    );
  }

  const avatarImage = getAvatarImage(profile?.avatar || 'fille_1');

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="flex items-center gap-2 px-2 py-1 rounded-full bg-primary/10 hover:bg-primary/20 transition-colors">
            <img 
              src={avatarImage} 
              alt="Avatar"
              className="w-10 h-10 rounded-full object-cover border-2 border-golden/50"
            />
            <span className="font-medium text-foreground hidden sm:inline">
              {profile?.prenom || 'Aventurier'}
            </span>
            {isAdmin && <Crown className="w-4 h-4 text-golden" />}
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <div className="px-3 py-2">
            <p className="font-semibold">{profile?.prenom || 'Aventurier'}</p>
            <p className="text-xs text-muted-foreground">{t('menu.myAccount')}</p>
          </div>
          <DropdownMenuSeparator />
          <DropdownMenuItem 
            onClick={() => setIsAvatarDialogOpen(true)}
            className="flex items-center gap-2 cursor-pointer"
          >
            <Pencil className="w-4 h-4" />
            {t('menu.changeAvatar')}
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link to="/my-stories" className="flex items-center gap-2 cursor-pointer">
              <BookOpen className="w-4 h-4" />
              {t('menu.myStories')}
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link to="/collection" className="flex items-center gap-2 cursor-pointer">
              <Gift className="w-4 h-4" />
              {t('menu.collection')}
            </Link>
          </DropdownMenuItem>
          {isAdmin && (
            <DropdownMenuItem asChild>
              <Link to="/admin" className="flex items-center gap-2 cursor-pointer text-golden">
                <Crown className="w-4 h-4" />
                {t('menu.admin')}
              </Link>
            </DropdownMenuItem>
          )}
          <DropdownMenuSeparator />
          <DropdownMenuItem 
            onClick={handleSignOut}
            className="flex items-center gap-2 text-destructive focus:text-destructive cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            {t('auth.logout')}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Avatar Change Dialog */}
      <Dialog open={isAvatarDialogOpen} onOpenChange={setIsAvatarDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center">{t('menu.chooseAvatar')}</DialogTitle>
            <DialogDescription className="text-center">
              {t('menu.chooseAvatarDesc')}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <AvatarSelector 
              selectedAvatar={selectedAvatar}
              onSelect={setSelectedAvatar}
              size="md"
            />
          </div>
          <div className="flex gap-3 justify-end">
            <Button 
              variant="outline" 
              onClick={() => setIsAvatarDialogOpen(false)}
            >
              {t('menu.cancel')}
            </Button>
            <Button 
              onClick={handleSaveAvatar}
              disabled={isSaving || selectedAvatar === profile?.avatar}
              className="bg-gradient-to-r from-golden to-orange-500 text-white"
            >
              {isSaving ? t('menu.saving') : t('menu.save')}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
