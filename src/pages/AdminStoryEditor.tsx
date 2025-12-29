import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAdmin } from '@/hooks/useAdmin';
import { useAdminStories, useAdminStoryPages, AdminStoryPage, StoryChoice, InventoryItem } from '@/hooks/useAdminStories';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { ImageUpload } from '@/components/ImageUpload';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { 
  ArrowLeft, 
  Plus, 
  Save,
  Trash2, 
  FileText,
  Loader2,
  GripVertical,
  ChevronDown,
  ChevronUp,
  Package,
  Gem,
  TreeDeciduous,
  Flame,
  Key,
  Sprout,
  Droplets,
  Star,
  Heart,
  Zap,
  Shield,
  Crown,
  Compass,
  Map,
  Scroll,
  Feather
} from 'lucide-react';
import { toast } from 'sonner';
import { subjects } from '@/data/subjects';
import { grades } from '@/data/grades';
import { useLanguage } from '@/contexts/LanguageContext';

export default function AdminStoryEditor() {
  const { storyId } = useParams<{ storyId: string }>();
  const navigate = useNavigate();
  const { isAdmin, loading: adminLoading } = useAdmin();
  const { getStoryWithPages, updateStory } = useAdminStories();
  const { pages, createPage, updatePage, deletePage, fetchPages } = useAdminStoryPages(storyId);
  const { t } = useLanguage();

  const [story, setStory] = useState<{
    id: string;
    title: string;
    description: string | null;
    level: string;
    subject_id: string[];
    cover_image_url: string | null;
    start_page_id: string;
    is_published: boolean;
    inventory_items: InventoryItem[];
  } | null>(null);
  const [isInventoryDialogOpen, setIsInventoryDialogOpen] = useState(false);
  const [editingInventoryItem, setEditingInventoryItem] = useState<InventoryItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  const [editingPage, setEditingPage] = useState<AdminStoryPage | null>(null);
  const [isPageDialogOpen, setIsPageDialogOpen] = useState(false);
  const [expandedPages, setExpandedPages] = useState<Set<string>>(new Set());

  // Load story
  useEffect(() => {
    const loadStory = async () => {
      if (!storyId) return;
      const result = await getStoryWithPages(storyId);
      if (result.success && result.data) {
        setStory({
          id: result.data.id,
          title: result.data.title,
          description: result.data.description,
          level: result.data.level,
          subject_id: result.data.subject_id,
          cover_image_url: result.data.cover_image_url,
          start_page_id: result.data.start_page_id,
          is_published: result.data.is_published,
          inventory_items: result.data.inventory_items || []
        });
      }
      setLoading(false);
    };
    loadStory();
  }, [storyId, getStoryWithPages]);

  if (!adminLoading && !isAdmin) {
    navigate('/');
    return null;
  }

  if (adminLoading || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!story) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Histoire introuvable</p>
      </div>
    );
  }

  const handleSaveStory = async () => {
    setIsSaving(true);
    const result = await updateStory(story.id, {
      title: story.title,
      description: story.description,
      level: story.level as 'CP' | 'CE1' | 'CE2' | 'CM1' | 'CM2',
      subject_id: story.subject_id,
      cover_image_url: story.cover_image_url,
      start_page_id: story.start_page_id,
      inventory_items: story.inventory_items
    });
    setIsSaving(false);
    
    if (result.success) {
      toast.success('Histoire enregistrée');
    } else {
      toast.error('Erreur lors de la sauvegarde');
    }
  };

  const iconOptions = [
    { id: 'gem', name: 'Gemme', icon: Gem },
    { id: 'tree', name: 'Arbre', icon: TreeDeciduous },
    { id: 'flame', name: 'Flamme', icon: Flame },
    { id: 'key', name: 'Clé', icon: Key },
    { id: 'sprout', name: 'Pousse', icon: Sprout },
    { id: 'droplets', name: 'Eau', icon: Droplets },
    { id: 'star', name: 'Étoile', icon: Star },
    { id: 'heart', name: 'Cœur', icon: Heart },
    { id: 'zap', name: 'Éclair', icon: Zap },
    { id: 'shield', name: 'Bouclier', icon: Shield },
    { id: 'crown', name: 'Couronne', icon: Crown },
    { id: 'compass', name: 'Boussole', icon: Compass },
    { id: 'map', name: 'Carte', icon: Map },
    { id: 'scroll', name: 'Parchemin', icon: Scroll },
    { id: 'feather', name: 'Plume', icon: Feather },
  ];

  const getIconComponent = (iconId: string) => {
    const iconOption = iconOptions.find(opt => opt.id === iconId);
    return iconOption?.icon || Package;
  };

  const handleAddInventoryItem = () => {
    setEditingInventoryItem({ id: `item-${Date.now()}`, name: '', icon: 'gem' });
  };

  const handleSaveInventoryItem = () => {
    if (!editingInventoryItem || !story) return;
    
    const existingIndex = story.inventory_items.findIndex(item => item.id === editingInventoryItem.id);
    let newItems: InventoryItem[];
    
    if (existingIndex >= 0) {
      newItems = [...story.inventory_items];
      newItems[existingIndex] = editingInventoryItem;
    } else {
      newItems = [...story.inventory_items, editingInventoryItem];
    }
    
    setStory({ ...story, inventory_items: newItems });
    setEditingInventoryItem(null);
  };

  const handleDeleteInventoryItem = (itemId: string) => {
    if (!story) return;
    setStory({ 
      ...story, 
      inventory_items: story.inventory_items.filter(item => item.id !== itemId) 
    });
  };

  const handleAddPage = () => {
    const newPageId = `page-${pages.length + 1}`;
    setEditingPage({
      id: '',
      story_id: storyId!,
      page_id: newPageId,
      title: null,
      text: '',
      text_masculine: null,
      text_feminine: null,
      image_url: null,
      choices: [],
      is_ending: false,
      ending_type: null,
      sort_order: pages.length,
      collected_item_id: null
    });
    setIsPageDialogOpen(true);
  };

  const handleEditPage = (page: AdminStoryPage) => {
    setEditingPage({ ...page });
    setIsPageDialogOpen(true);
  };

  const handleSavePage = async () => {
    if (!editingPage) return;
    
    setIsSaving(true);
    
    if (editingPage.id) {
      // Update existing page
      const result = await updatePage(editingPage.id, editingPage);
      if (result.success) {
        toast.success('Page mise à jour');
        setIsPageDialogOpen(false);
      } else {
        toast.error('Erreur lors de la mise à jour');
      }
    } else {
      // Create new page
      const { id, ...pageData } = editingPage;
      const result = await createPage(pageData);
      if (result.success) {
        toast.success('Page créée');
        setIsPageDialogOpen(false);
      } else {
        toast.error('Erreur lors de la création');
      }
    }
    
    setIsSaving(false);
  };

  const handleDeletePage = async (page: AdminStoryPage) => {
    if (!confirm(`Supprimer la page "${page.page_id}" ?`)) return;
    
    const result = await deletePage(page.id);
    if (result.success) {
      toast.success('Page supprimée');
    } else {
      toast.error('Erreur lors de la suppression');
    }
  };

  const togglePageExpanded = (pageId: string) => {
    const newExpanded = new Set(expandedPages);
    if (newExpanded.has(pageId)) {
      newExpanded.delete(pageId);
    } else {
      newExpanded.add(pageId);
    }
    setExpandedPages(newExpanded);
  };

  const addChoice = () => {
    if (!editingPage) return;
    setEditingPage({
      ...editingPage,
      choices: [...editingPage.choices, { label: '', targetPageId: '' }]
    });
  };

  const updateChoice = (index: number, updates: Partial<StoryChoice>) => {
    if (!editingPage) return;
    const newChoices = [...editingPage.choices];
    newChoices[index] = { ...newChoices[index], ...updates };
    setEditingPage({ ...editingPage, choices: newChoices });
  };

  const removeChoice = (index: number) => {
    if (!editingPage) return;
    const newChoices = editingPage.choices.filter((_, i) => i !== index);
    setEditingPage({ ...editingPage, choices: newChoices });
  };

  return (
    <main className="min-h-screen bg-background py-6 px-4">
      <div className="container max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => navigate('/admin/stories')} className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Retour
            </Button>
            <h1 className="font-display text-2xl text-foreground truncate max-w-md">
              {story.title}
            </h1>
          </div>
          
          <Button onClick={handleSaveStory} disabled={isSaving} className="gap-2">
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Enregistrer
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Story Settings */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-card rounded-xl p-6 border border-border">
              <h2 className="font-semibold text-lg mb-4">Paramètres</h2>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Titre</Label>
                  <Input
                    value={story.title}
                    onChange={(e) => setStory({ ...story, title: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea
                    value={story.description || ''}
                    onChange={(e) => setStory({ ...story, description: e.target.value })}
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Niveau</Label>
                  <Select
                    value={story.level}
                    onValueChange={(value) => {
                      console.log('Level changed to:', value);
                      setStory({ ...story, level: value });
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Choisir un niveau" />
                    </SelectTrigger>
                    <SelectContent className="pointer-events-auto z-[100]">
                      {grades.map((grade) => (
                        <SelectItem key={grade.id} value={grade.id}>
                          {grade.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Matières</Label>
                  <div className="space-y-2 p-3 border rounded-lg bg-muted/30">
                    {subjects.map((subject) => (
                      <label key={subject.id} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={story.subject_id.includes(subject.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setStory({ ...story, subject_id: [...story.subject_id, subject.id] });
                            } else {
                              setStory({ ...story, subject_id: story.subject_id.filter(id => id !== subject.id) });
                            }
                          }}
                          className="rounded border-border"
                        />
                        <span className="text-sm">{t(subject.nameKey)}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Image de couverture</Label>
                  <ImageUpload
                    value={story.cover_image_url}
                    onChange={(url) => setStory({ ...story, cover_image_url: url })}
                    folder="covers"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Page de départ</Label>
                  <Select
                    value={story.start_page_id}
                    onValueChange={(value) => setStory({ ...story, start_page_id: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {pages.map((page) => (
                        <SelectItem key={page.page_id} value={page.page_id}>
                          {page.page_id}
                        </SelectItem>
                      ))}
                      {pages.length === 0 && (
                        <SelectItem value="page-1">page-1</SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Inventory Section */}
            <div className="bg-card rounded-xl p-6 border border-border">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-lg flex items-center gap-2">
                  <Package className="w-5 h-5" />
                  Inventaire
                </h2>
                <Button size="sm" variant="outline" onClick={handleAddInventoryItem} className="gap-1">
                  <Plus className="w-3 h-3" />
                  Ajouter
                </Button>
              </div>
              
              {story.inventory_items.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  Aucun objet défini
                </p>
              ) : (
                <div className="space-y-2">
                  {story.inventory_items.map((item) => {
                    const IconComponent = getIconComponent(item.icon);
                    return (
                      <div key={item.id} className="flex items-center gap-3 p-2 bg-muted/50 rounded-lg">
                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                          <IconComponent className="w-4 h-4 text-primary" />
                        </div>
                        <span className="flex-1 text-sm font-medium">{item.name || 'Sans nom'}</span>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setEditingInventoryItem(item)}
                        >
                          Modifier
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-destructive"
                          onClick={() => handleDeleteInventoryItem(item.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Pages List */}
          <div className="lg:col-span-2">
            <div className="bg-card rounded-xl border border-border overflow-hidden">
              <div className="p-4 border-b border-border flex items-center justify-between">
                <h2 className="font-semibold text-lg">Pages ({pages.length})</h2>
                <Button size="sm" onClick={handleAddPage} className="gap-2">
                  <Plus className="w-4 h-4" />
                  Ajouter une page
                </Button>
              </div>

              {pages.length === 0 ? (
                <div className="p-12 text-center">
                  <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground mb-4">Aucune page</p>
                  <Button onClick={handleAddPage} variant="outline" className="gap-2">
                    <Plus className="w-4 h-4" />
                    Créer la première page
                  </Button>
                </div>
              ) : (
                <div className="divide-y divide-border">
                  {pages.map((page) => (
                    <div key={page.id} className="group">
                      <div
                        className="p-4 flex items-center gap-3 hover:bg-muted/50 cursor-pointer"
                        onClick={() => togglePageExpanded(page.id)}
                      >
                        <GripVertical className="w-4 h-4 text-muted-foreground" />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-sm font-medium">{page.page_id}</span>
                            {page.is_ending && (
                              <span className="px-2 py-0.5 bg-primary/10 text-primary text-xs rounded-full">
                                Fin {page.ending_type}
                              </span>
                            )}
                            {page.collected_item_id && story.inventory_items.find(i => i.id === page.collected_item_id) && (
                              <span className="px-2 py-0.5 bg-golden/10 text-golden text-xs rounded-full flex items-center gap-1">
                                <Package className="w-3 h-3" />
                                {story.inventory_items.find(i => i.id === page.collected_item_id)?.name}
                              </span>
                            )}
                          </div>
                          {page.title && (
                            <p className="text-sm text-muted-foreground truncate">{page.title}</p>
                          )}
                        </div>
                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={(e) => { e.stopPropagation(); handleEditPage(page); }}
                          >
                            Modifier
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-destructive"
                            onClick={(e) => { e.stopPropagation(); handleDeletePage(page); }}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                        {expandedPages.has(page.id) ? (
                          <ChevronUp className="w-4 h-4 text-muted-foreground" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-muted-foreground" />
                        )}
                      </div>
                      
                      {expandedPages.has(page.id) && (
                        <div className="px-4 pb-4 pt-0 ml-7 space-y-2 text-sm">
                          <p className="text-muted-foreground line-clamp-3">{page.text}</p>
                          {page.choices.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-2">
                              {page.choices.map((choice, i) => (
                                <span key={i} className="px-2 py-1 bg-muted rounded text-xs">
                                  {choice.label} → {choice.targetPageId}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Page Edit Dialog */}
        <Dialog open={isPageDialogOpen} onOpenChange={setIsPageDialogOpen}>
          <DialogContent 
            className="max-w-2xl max-h-[90vh] overflow-y-auto"
            onInteractOutside={(e) => e.preventDefault()}
          >
            <DialogHeader>
              <DialogTitle>
                {editingPage?.id ? `Modifier ${editingPage.page_id}` : 'Nouvelle page'}
              </DialogTitle>
            </DialogHeader>
            
            {editingPage && (
              <div className="space-y-4 pt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>ID de la page *</Label>
                    <Input
                      value={editingPage.page_id}
                      onChange={(e) => setEditingPage({ ...editingPage, page_id: e.target.value })}
                      placeholder="page-1"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Titre (optionnel)</Label>
                    <Input
                      value={editingPage.title || ''}
                      onChange={(e) => setEditingPage({ ...editingPage, title: e.target.value || null })}
                      placeholder="Titre de la page"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Image de la page</Label>
                  <ImageUpload
                    value={editingPage.image_url}
                    onChange={(url) => setEditingPage({ ...editingPage, image_url: url })}
                    folder="pages"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Texte *</Label>
                  <Textarea
                    value={editingPage.text}
                    onChange={(e) => setEditingPage({ ...editingPage, text: e.target.value })}
                    placeholder="Le texte de l'histoire..."
                    rows={6}
                  />
                  <p className="text-xs text-muted-foreground">
                    Utilisez {'{prenom}'} pour insérer le prénom de l'enfant
                  </p>
                </div>

                <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={editingPage.is_ending}
                      onCheckedChange={(checked) => setEditingPage({ 
                        ...editingPage, 
                        is_ending: checked,
                        ending_type: checked ? 'happy' : null 
                      })}
                    />
                    <Label>Page de fin</Label>
                  </div>
                  
                  {editingPage.is_ending && (
                    <Select
                      value={editingPage.ending_type || 'happy'}
                      onValueChange={(value) => setEditingPage({ 
                        ...editingPage, 
                        ending_type: value as 'happy' | 'neutral' | 'sad' 
                      })}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="happy">Happy</SelectItem>
                        <SelectItem value="neutral">Neutre</SelectItem>
                        <SelectItem value="sad">Triste</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                </div>

                {/* Collected Item */}
                {story.inventory_items.length > 0 && (
                  <div className="space-y-2 p-4 bg-golden/10 rounded-lg border border-golden/20">
                    <Label className="flex items-center gap-2">
                      <Package className="w-4 h-4 text-golden" />
                      Objet collecté sur cette page
                    </Label>
                    <Select
                      value={editingPage.collected_item_id || 'none'}
                      onValueChange={(value) => setEditingPage({ 
                        ...editingPage, 
                        collected_item_id: value === 'none' ? null : value 
                      })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Aucun objet" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">Aucun objet</SelectItem>
                        {story.inventory_items.map((item) => {
                          const IconComponent = getIconComponent(item.icon);
                          return (
                            <SelectItem key={item.id} value={item.id}>
                              <span className="flex items-center gap-2">
                                <IconComponent className="w-4 h-4" />
                                {item.name}
                              </span>
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {!editingPage.is_ending && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label>Choix</Label>
                      <Button size="sm" variant="outline" onClick={addChoice} className="gap-1">
                        <Plus className="w-3 h-3" />
                        Ajouter un choix
                      </Button>
                    </div>
                    
                    {editingPage.choices.map((choice, index) => (
                      <div key={index} className="flex items-center gap-2 p-3 bg-muted/30 rounded-lg">
                        <div className="flex-1 grid grid-cols-2 gap-2">
                          <Input
                            value={choice.label}
                            onChange={(e) => updateChoice(index, { label: e.target.value })}
                            placeholder="Texte du choix"
                          />
                          <Input
                            value={choice.targetPageId}
                            onChange={(e) => updateChoice(index, { targetPageId: e.target.value })}
                            placeholder="page-2"
                          />
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-destructive shrink-0"
                          onClick={() => removeChoice(index)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex justify-end gap-2 pt-4">
                  <Button variant="outline" onClick={() => setIsPageDialogOpen(false)}>
                    Annuler
                  </Button>
                  <Button onClick={handleSavePage} disabled={isSaving}>
                    {isSaving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                    Enregistrer
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Inventory Item Edit Dialog */}
        <Dialog open={editingInventoryItem !== null} onOpenChange={(open) => !open && setEditingInventoryItem(null)}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingInventoryItem?.id.startsWith('item-') ? 'Nouvel objet' : 'Modifier l\'objet'}
              </DialogTitle>
            </DialogHeader>
            
            {editingInventoryItem && (
              <div className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label>Nom de l'objet</Label>
                  <Input
                    value={editingInventoryItem.name}
                    onChange={(e) => setEditingInventoryItem({ ...editingInventoryItem, name: e.target.value })}
                    placeholder="Pierre brillante"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Icône</Label>
                  <div className="grid grid-cols-5 gap-2">
                    {iconOptions.map((opt) => {
                      const IconComponent = opt.icon;
                      return (
                        <button
                          key={opt.id}
                          type="button"
                          className={`p-3 rounded-lg border-2 transition-all ${
                            editingInventoryItem.icon === opt.id 
                              ? 'border-primary bg-primary/10' 
                              : 'border-border hover:border-primary/50'
                          }`}
                          onClick={() => setEditingInventoryItem({ ...editingInventoryItem, icon: opt.id })}
                          title={opt.name}
                        >
                          <IconComponent className="w-5 h-5 mx-auto" />
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-4">
                  <Button variant="outline" onClick={() => setEditingInventoryItem(null)}>
                    Annuler
                  </Button>
                  <Button onClick={handleSaveInventoryItem} disabled={!editingInventoryItem.name}>
                    Enregistrer
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </main>
  );
}
