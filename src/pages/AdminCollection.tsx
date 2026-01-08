import { useState, useRef } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { ArrowLeft, Plus, Trash2, Upload, Folder, Image as ImageIcon, Check, X } from 'lucide-react';
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
    updateCardTitle,
    deleteCard
  } = useCollection();
  const { toast } = useToast();

  // Theme dialog state
  const [isThemeDialogOpen, setIsThemeDialogOpen] = useState(false);
  const [themeTitle, setThemeTitle] = useState('');
  const [editingThemeId, setEditingThemeId] = useState<string | null>(null);
  const [isSavingTheme, setIsSavingTheme] = useState(false);

  // Multi-card upload state
  const [selectedThemeForUpload, setSelectedThemeForUpload] = useState<string | null>(null);
  const [uploadingCards, setUploadingCards] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Inline title editing state
  const [editingCardId, setEditingCardId] = useState<string | null>(null);
  const [editingCardTitle, setEditingCardTitle] = useState('');

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

  // Multi-card upload handlers
  const handleOpenFileDialog = (themeId: string) => {
    setSelectedThemeForUpload(themeId);
    fileInputRef.current?.click();
  };

  const handleFilesSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0 || !selectedThemeForUpload) return;

    setUploadingCards(true);
    let successCount = 0;

    for (const file of Array.from(files)) {
      // Use filename without extension as default title
      const defaultTitle = file.name.replace(/\.[^/.]+$/, '');
      const card = await createCard(selectedThemeForUpload, defaultTitle, file);
      if (card) successCount++;
    }

    toast({ 
      title: 'Cartes ajoutées', 
      description: `${successCount} carte(s) ajoutée(s) avec succès.` 
    });

    setUploadingCards(false);
    setSelectedThemeForUpload(null);
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Inline title editing handlers
  const handleStartEditTitle = (cardId: string, currentTitle: string) => {
    setEditingCardId(cardId);
    setEditingCardTitle(currentTitle);
  };

  const handleSaveCardTitle = async () => {
    if (!editingCardId || !editingCardTitle.trim()) {
      setEditingCardId(null);
      return;
    }

    const success = await updateCardTitle(editingCardId, editingCardTitle.trim());
    if (success) {
      toast({ title: 'Titre modifié', description: 'Le titre de la carte a été mis à jour.' });
    }
    setEditingCardId(null);
  };

  const handleCancelEditTitle = () => {
    setEditingCardId(null);
    setEditingCardTitle('');
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
      {/* Hidden file input for multi-upload */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={handleFilesSelected}
      />

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
                        onClick={() => handleOpenFileDialog(theme.id)}
                        disabled={uploadingCards}
                        className="gap-1"
                      >
                        <Upload className="w-4 h-4" />
                        {uploadingCards && selectedThemeForUpload === theme.id 
                          ? 'Import...' 
                          : 'Ajouter cartes'}
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
                          className="relative group"
                        >
                          <div className="aspect-square rounded-xl overflow-hidden shadow-md">
                            <img
                              src={card.image_url}
                              alt={card.title}
                              className="w-full h-full object-cover"
                            />
                            <button
                              onClick={() => setDeleteConfirm({ type: 'card', id: card.id })}
                              className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                          
                          {/* Inline title editing */}
                          <div className="mt-2">
                            {editingCardId === card.id ? (
                              <div className="flex items-center gap-1">
                                <Input
                                  value={editingCardTitle}
                                  onChange={(e) => setEditingCardTitle(e.target.value)}
                                  className="h-8 text-sm"
                                  autoFocus
                                  onKeyDown={(e) => {
                                    if (e.key === 'Enter') handleSaveCardTitle();
                                    if (e.key === 'Escape') handleCancelEditTitle();
                                  }}
                                />
                                <button
                                  onClick={handleSaveCardTitle}
                                  className="p-1 text-green-600 hover:bg-green-100 rounded"
                                >
                                  <Check className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={handleCancelEditTitle}
                                  className="p-1 text-red-600 hover:bg-red-100 rounded"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </div>
                            ) : (
                              <Input
                                value={card.title}
                                readOnly
                                onClick={() => handleStartEditTitle(card.id, card.title)}
                                className="h-8 text-sm cursor-pointer hover:border-primary"
                              />
                            )}
                          </div>
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
