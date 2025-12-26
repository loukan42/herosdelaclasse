import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useChildProfiles, ChildProfile } from '@/contexts/ChildProfileContext';
import { useAuthContext } from '@/contexts/AuthContext';
import { AVATARS, getAvatarById } from '@/data/avatars';
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
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ChevronDown, Plus, Settings, User, LogOut, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export function ProfileSwitcher() {
  const navigate = useNavigate();
  const { isAuthenticated, signOut } = useAuthContext();
  const { profiles, activeProfile, setActiveProfile, createProfile, loading } = useChildProfiles();
  
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [newAvatar, setNewAvatar] = useState(AVATARS[0]?.id || 'garcon_1');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isAuthenticated) {
    return (
      <Button variant="outline" onClick={() => navigate('/auth')} className="gap-2">
        <User className="w-4 h-4" />
        Connexion
      </Button>
    );
  }

  if (loading) {
    return (
      <Button variant="outline" disabled>
        <Loader2 className="w-4 h-4 animate-spin" />
      </Button>
    );
  }

  const handleCreateProfile = async () => {
    if (!newName.trim()) {
      toast.error('Le prénom est requis');
      return;
    }

    setIsSubmitting(true);
    const result = await createProfile(newName.trim(), newAvatar);
    setIsSubmitting(false);

    if (result.success) {
      toast.success(`Profil de ${newName} créé !`);
      setIsCreateOpen(false);
      setNewName('');
      setNewAvatar(AVATARS[0]?.id || 'garcon_1');
    } else {
      toast.error('Erreur lors de la création');
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const activeAvatar = activeProfile ? getAvatarById(activeProfile.avatar) : null;

  // No profiles yet - show create profile button
  if (profiles.length === 0) {
    return (
      <>
        <Button onClick={() => setIsCreateOpen(true)} className="gap-2">
          <Plus className="w-4 h-4" />
          Créer un profil enfant
        </Button>

        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogContent className="max-w-4xl w-[95vw] max-h-[95vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl text-center">Créer un profil enfant</DialogTitle>
            </DialogHeader>
            <CreateProfileForm
              name={newName}
              setName={setNewName}
              avatar={newAvatar}
              setAvatar={setNewAvatar}
              onSubmit={handleCreateProfile}
              isSubmitting={isSubmitting}
              onCancel={() => setIsCreateOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </>
    );
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="gap-2 px-3">
            {activeAvatar ? (
              <img 
                src={activeAvatar.image} 
                alt={activeProfile?.prenom}
                className="w-6 h-6 rounded-full object-contain"
              />
            ) : (
              <User className="w-4 h-4" />
            )}
            <span className="max-w-24 truncate">{activeProfile?.prenom || 'Profil'}</span>
            <ChevronDown className="w-4 h-4 opacity-50" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          {/* Profile list */}
          {profiles.map((profile) => {
            const avatar = getAvatarById(profile.avatar);
            const isActive = activeProfile?.id === profile.id;
            return (
              <DropdownMenuItem
                key={profile.id}
                onClick={() => setActiveProfile(profile)}
                className={`gap-3 ${isActive ? 'bg-primary/10' : ''}`}
              >
                {avatar ? (
                  <img 
                    src={avatar.image} 
                    alt={profile.prenom}
                    className="w-8 h-8 rounded-full object-contain"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                    <User className="w-4 h-4" />
                  </div>
                )}
                <span className="flex-1 truncate">{profile.prenom}</span>
                {isActive && <span className="text-xs text-primary">✓</span>}
              </DropdownMenuItem>
            );
          })}

          <DropdownMenuSeparator />

          <DropdownMenuItem onClick={() => setIsCreateOpen(true)} className="gap-2">
            <Plus className="w-4 h-4" />
            Ajouter un profil
          </DropdownMenuItem>

          <DropdownMenuItem onClick={() => navigate('/my-stories')} className="gap-2">
            <Settings className="w-4 h-4" />
            Mes histoires
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem onClick={handleSignOut} className="gap-2 text-destructive">
            <LogOut className="w-4 h-4" />
            Déconnexion
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="max-w-4xl w-[95vw] max-h-[95vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl text-center">Ajouter un profil enfant</DialogTitle>
          </DialogHeader>
          <CreateProfileForm
            name={newName}
            setName={setNewName}
            avatar={newAvatar}
            setAvatar={setNewAvatar}
            onSubmit={handleCreateProfile}
            isSubmitting={isSubmitting}
            onCancel={() => setIsCreateOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}

function CreateProfileForm({
  name,
  setName,
  avatar,
  setAvatar,
  onSubmit,
  isSubmitting,
  onCancel
}: {
  name: string;
  setName: (v: string) => void;
  avatar: string;
  setAvatar: (v: string) => void;
  onSubmit: () => void;
  isSubmitting: boolean;
  onCancel: () => void;
}) {
  return (
    <div className="space-y-6 pt-2">
      <div className="space-y-3 max-w-md mx-auto">
        <Label className="text-lg font-semibold">Prénom de l'enfant</Label>
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Comment s'appelle-t-il/elle ?"
          className="h-14 text-lg"
        />
      </div>

      <div className="space-y-4">
        <Label className="text-lg font-semibold block text-center">Choisis ton personnage !</Label>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4 sm:gap-6 p-2">
          {AVATARS.map((av) => (
            <button
              key={av.id}
              type="button"
              onClick={() => setAvatar(av.id)}
              className={`
                aspect-square rounded-2xl overflow-hidden transition-all p-2 bg-muted/50
                ${avatar === av.id 
                  ? 'ring-4 ring-primary ring-offset-4 scale-105 bg-primary/10' 
                  : 'hover:ring-2 hover:ring-primary/50 hover:scale-102'}
              `}
            >
              <img 
                src={av.image} 
                alt={av.name} 
                className="w-full h-full object-contain drop-shadow-lg" 
              />
            </button>
          ))}
        </div>
      </div>

      <div className="flex justify-center gap-4 pt-4">
        <Button variant="outline" onClick={onCancel} size="lg" className="px-8">
          Annuler
        </Button>
        <Button onClick={onSubmit} disabled={isSubmitting} size="lg" className="px-8">
          {isSubmitting && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
          Créer le profil
        </Button>
      </div>
    </div>
  );
}
