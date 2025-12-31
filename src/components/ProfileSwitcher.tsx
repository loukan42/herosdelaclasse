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
  DialogDescription,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ChevronDown, Plus, Settings, User, LogOut, Loader2, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { useLanguage } from '@/contexts/LanguageContext';

export function ProfileSwitcher() {
  const navigate = useNavigate();
  const { isAuthenticated, signOut } = useAuthContext();
  const { profiles, activeProfile, setActiveProfile, createProfile, deleteProfile, loading } = useChildProfiles();
  const { t } = useLanguage();
  
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [newAvatar, setNewAvatar] = useState(AVATARS[0]?.id || 'garcon_1');
  const [newGenre, setNewGenre] = useState<'masculin' | 'feminin' | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isManageOpen, setIsManageOpen] = useState(false);
  const [profileToDelete, setProfileToDelete] = useState<ChildProfile | null>(null);

  if (!isAuthenticated) {
    return (
      <Button variant="outline" onClick={() => navigate('/auth')} className="gap-2">
        <User className="w-4 h-4" />
        {t('auth.login')}
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
    const result = await createProfile(newName.trim(), newAvatar, newGenre);
    setIsSubmitting(false);

    if (result.success) {
      toast.success(`Profil de ${newName} créé !`);
      setIsCreateOpen(false);
      setNewName('');
      setNewAvatar(AVATARS[0]?.id || 'garcon_1');
      setNewGenre(null);
    } else {
      toast.error('Erreur lors de la création');
    }
  };

  const handleDeleteProfile = async () => {
    if (!profileToDelete) return;
    
    setIsSubmitting(true);
    const result = await deleteProfile(profileToDelete.id);
    setIsSubmitting(false);
    
    if (result.success) {
      toast.success(`Profil de ${profileToDelete.prenom} supprimé`);
      setProfileToDelete(null);
    } else {
      toast.error('Erreur lors de la suppression');
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
              genre={newGenre}
              setGenre={setNewGenre}
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

          <DropdownMenuItem onClick={() => setIsManageOpen(true)} className="gap-2">
            <Settings className="w-4 h-4" />
            Gérer les profils
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
            genre={newGenre}
            setGenre={setNewGenre}
            onSubmit={handleCreateProfile}
            isSubmitting={isSubmitting}
            onCancel={() => setIsCreateOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Manage Profiles Dialog */}
      <Dialog open={isManageOpen} onOpenChange={setIsManageOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Gérer les profils</DialogTitle>
            <DialogDescription>
              Cliquez sur la corbeille pour supprimer un profil
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2 py-4">
            {profiles.map((profile) => {
              const avatar = getAvatarById(profile.avatar);
              return (
                <div 
                  key={profile.id}
                  className="flex items-center gap-3 p-3 rounded-lg bg-muted/50"
                >
                  {avatar ? (
                    <img 
                      src={avatar.image} 
                      alt={profile.prenom}
                      className="w-12 h-12 rounded-full object-contain"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                      <User className="w-6 h-6" />
                    </div>
                  )}
                  <span className="flex-1 font-medium text-lg">{profile.prenom}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    onClick={() => setProfileToDelete(profile)}
                  >
                    <Trash2 className="w-5 h-5" />
                  </Button>
                </div>
              );
            })}
          </div>
          <div className="flex justify-end">
            <Button variant="outline" onClick={() => setIsManageOpen(false)}>
              Fermer
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!profileToDelete} onOpenChange={(open) => !open && setProfileToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer le profil ?</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer le profil de <strong>{profileToDelete?.prenom}</strong> ?
              Cette action supprimera également toutes les progressions et histoires terminées associées.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isSubmitting}>Annuler</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteProfile}
              disabled={isSubmitting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

function CreateProfileForm({
  name,
  setName,
  avatar,
  setAvatar,
  genre,
  setGenre,
  onSubmit,
  isSubmitting,
  onCancel
}: {
  name: string;
  setName: (v: string) => void;
  avatar: string;
  setAvatar: (v: string) => void;
  genre: 'masculin' | 'feminin' | null;
  setGenre: (v: 'masculin' | 'feminin' | null) => void;
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

      {/* Genre Selection */}
      <div className="space-y-4 max-w-md mx-auto">
        <Label className="text-lg font-semibold block text-center">Fille ou garçon ?</Label>
        <p className="text-sm text-muted-foreground text-center -mt-2">
          Les histoires seront adaptées au féminin ou au masculin
        </p>
        <div className="flex justify-center gap-4">
          <button
            type="button"
            onClick={() => setGenre('feminin')}
            className={`
              flex-1 max-w-[140px] py-4 px-6 rounded-2xl font-bold text-lg transition-all
              ${genre === 'feminin' 
                ? 'bg-pink-500 text-white ring-4 ring-pink-300 scale-105' 
                : 'bg-pink-100 text-pink-700 hover:bg-pink-200'}
            `}
          >
            👧 Fille
          </button>
          <button
            type="button"
            onClick={() => setGenre('masculin')}
            className={`
              flex-1 max-w-[140px] py-4 px-6 rounded-2xl font-bold text-lg transition-all
              ${genre === 'masculin' 
                ? 'bg-blue-500 text-white ring-4 ring-blue-300 scale-105' 
                : 'bg-blue-100 text-blue-700 hover:bg-blue-200'}
            `}
          >
            👦 Garçon
          </button>
        </div>
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
