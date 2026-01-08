import { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { ArrowLeft, Plus, Trash2, Upload, Folder, Image as ImageIcon } from 'lucide-react';
import { useAdmin } from '@/hooks/useAdmin';
import { useCollection } from '@/hooks/useCollection';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription 
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
import { useToast } from '@/hooks/use-toast';

export default function AdminCollection() {
  const { isAdmin, loading: adminLoading } = useAdmin();
  const { 
    themes, 
    cards, 
    loading, 
    getCardsForTheme,
    createTheme,
    updateTheme,
    deleteTheme,
    createCard,
    deleteCard
  } = useCollection();
  const { toast } = useToast();

  // Theme dialog state
  const [isThemeDialogOpen, setIsThemeDialogOpen] = useState(false);
  const [themeTitle, setThemeTitle] = useState('');
  const [editingThemeId, setEditingThemeId] = useState<string | null>(null);
  const [isSavingTheme, setIsSavingTheme] = useState(false);

  // Card dialog state
  const [isCardDialogOpen, setIsCardDialogOpen] = useState(false);
  const [selectedThemeId, setSelectedThemeId] = useState<string | null>(null);
  const [cardTitle, setCardTitle] = useState('');
  const [cardImage, setCardImage] = useState<File | null>(null);
  const [cardPreview, setCardPreview] = useState<string | null>(null);
  const [isSavingCard, setIsSavingCard] = useState(false);

  // Delete confirmation state
  const [deleteConfirm, setDeleteConfirm] = useState<{ type: 'theme' | 'card'; id: string } | null>(null);

  // Redirect if not admin
  if (!adminLoading && !isAdmin) {
    return <Navigate to="/" replace />;
  }

  if (loading || adminLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Theme handlers
  const handleOpenThemeDialog = (themeId?: string) => {
    if (themeId) {
      const theme = themes.find(t => t.id === themeId);
      setThemeTitle(theme?.title || '');
      setEditingThemeId(themeId);
    } else {
      setThemeTitle('');
      setEditingThemeId(null);
    }
    setIsThemeDialogOpen(true);
  };

  const handleSaveTheme = async () => {
    if (!themeTitle.trim()) return;
    setIsSavingTheme(true);

    if (editingThemeId) {
      const success = await updateTheme(editingThemeId, themeTitle.trim());
      if (success) {
        toast({ title: 'Thème modifié', description: 'Le thème a été mis à jour.' });
      }
    } else {
      const theme = await createTheme(themeTitle.trim());
      if (theme) {
        toast({ title: 'Thème créé', description: 'Le nouveau thème a été créé.' });
      }
    }

    setIsSavingTheme(false);
    setIsThemeDialogOpen(false);
  };

  const handleDeleteTheme = async () => {
    if (!deleteConfirm || deleteConfirm.type !== 'theme') return;
    
    const success = await deleteTheme(deleteConfirm.id);
    if (success) {
      toast({ title: 'Thème supprimé', description: 'Le thème et toutes ses cartes ont été supprimés.' });
    }
    setDeleteConfirm(null);
  };

  // Card handlers
  const handleOpenCardDialog = (themeId: string) => {
    setSelectedThemeId(themeId);
    setCardTitle('');
    setCardImage(null);
    setCardPreview(null);
    setIsCardDialogOpen(true);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCardImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setCardPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveCard = async () => {
    if (!cardTitle.trim() || !cardImage || !selectedThemeId) return;
    setIsSavingCard(true);

    const card = await createCard(selectedThemeId, cardTitle.trim(), cardImage);
    if (card) {
      toast({ title: 'Carte créée', description: 'La nouvelle carte a été ajoutée.' });
    }

    setIsSavingCard(false);
    setIsCardDialogOpen(false);
  };

  const handleDeleteCard = async () => {
    if (!deleteConfirm || deleteConfirm.type !== 'card') return;
    
    const success = await deleteCard(deleteConfirm.id);
    if (success) {
      toast({ title: 'Carte supprimée', description: 'La carte a été supprimée.' });
    }
    setDeleteConfirm(null);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border/50">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <Link
              to="/admin"
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Retour admin</span>
            </Link>

            <h1 className="font-display text-xl font-bold">Gestion de la collection</h1>

            <Button onClick={() => handleOpenThemeDialog()} className="gap-2">
              <Plus className="w-4 h-4" />
              Nouveau thème
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {themes.length === 0 ? (
          <div className="text-center py-12 bg-muted/30 rounded-2xl">
            <Folder className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground mb-4">
              Aucun thème créé pour le moment.
            </p>
            <Button onClick={() => handleOpenThemeDialog()} className="gap-2">
              <Plus className="w-4 h-4" />
              Créer un thème
            </Button>
          </div>
        ) : (
          <div className="space-y-8">
            {themes.map((theme) => {
              const themeCards = getCardsForTheme(theme.id);

              return (
                <div key={theme.id} className="bg-card rounded-2xl p-6 shadow-sm border border-border/50">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <h2 className="font-display text-xl font-bold">{theme.title}</h2>
                      <span className="text-sm text-muted-foreground">
                        ({themeCards.length} cartes)
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleOpenThemeDialog(theme.id)}
                      >
                        Modifier
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleOpenCardDialog(theme.id)}
                        className="gap-1"
                      >
                        <Upload className="w-4 h-4" />
                        Ajouter carte
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => setDeleteConfirm({ type: 'theme', id: theme.id })}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {themeCards.length === 0 ? (
                    <div className="text-center py-8 bg-muted/20 rounded-xl">
                      <ImageIcon className="w-10 h-10 text-muted-foreground mx-auto mb-2" />
                      <p className="text-muted-foreground">
                        Aucune carte dans ce thème
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                      {themeCards.map((card) => (
                        <div 
                          key={card.id}
                          className="relative group aspect-square rounded-xl overflow-hidden shadow-md"
                        >
                          <img
                            src={card.image_url}
                            alt={card.title}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2">
                            <p className="text-white text-sm font-medium text-center truncate">
                              {card.title}
                            </p>
                          </div>
                          <button
                            onClick={() => setDeleteConfirm({ type: 'card', id: card.id })}
                            className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Theme Dialog */}
      <Dialog open={isThemeDialogOpen} onOpenChange={setIsThemeDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingThemeId ? 'Modifier le thème' : 'Nouveau thème'}
            </DialogTitle>
            <DialogDescription>
              Entrez le titre du thème de cartes.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <Input
              placeholder="Titre du thème"
              value={themeTitle}
              onChange={(e) => setThemeTitle(e.target.value)}
            />
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setIsThemeDialogOpen(false)}>
              Annuler
            </Button>
            <Button 
              onClick={handleSaveTheme} 
              disabled={!themeTitle.trim() || isSavingTheme}
            >
              {isSavingTheme ? 'Enregistrement...' : 'Enregistrer'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Card Dialog */}
      <Dialog open={isCardDialogOpen} onOpenChange={setIsCardDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ajouter une carte</DialogTitle>
            <DialogDescription>
              Importez une image et donnez un titre à la carte.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <Input
              placeholder="Titre de la carte"
              value={cardTitle}
              onChange={(e) => setCardTitle(e.target.value)}
            />
            
            <div className="space-y-2">
              <label className="block text-sm font-medium">Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="block w-full text-sm text-muted-foreground
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-full file:border-0
                  file:text-sm file:font-semibold
                  file:bg-primary file:text-primary-foreground
                  hover:file:bg-primary/90 cursor-pointer"
              />
            </div>

            {cardPreview && (
              <div className="relative w-32 h-32 mx-auto rounded-xl overflow-hidden shadow-md">
                <img
                  src={cardPreview}
                  alt="Aperçu"
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setIsCardDialogOpen(false)}>
              Annuler
            </Button>
            <Button 
              onClick={handleSaveCard} 
              disabled={!cardTitle.trim() || !cardImage || isSavingCard}
            >
              {isSavingCard ? 'Enregistrement...' : 'Ajouter'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
            <AlertDialogDescription>
              {deleteConfirm?.type === 'theme' 
                ? 'Cette action supprimera le thème et toutes ses cartes. Cette action est irréversible.'
                : 'Cette action supprimera la carte. Cette action est irréversible.'
              }
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={deleteConfirm?.type === 'theme' ? handleDeleteTheme : handleDeleteCard}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
