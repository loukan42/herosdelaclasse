import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdmin } from '@/hooks/useAdmin';
import { useAdminStories, AdminStory } from '@/hooks/useAdminStories';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
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
  DialogTrigger,
} from '@/components/ui/dialog';
import { 
  ArrowLeft, 
  Plus, 
  Edit, 
  Trash2, 
  BookOpen,
  Eye,
  EyeOff,
  Loader2
} from 'lucide-react';
import { toast } from 'sonner';
import { subjects } from '@/data/subjects';
import { grades } from '@/data/grades';

const generateSlug = (title: string) => {
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
};

export default function AdminStories() {
  const navigate = useNavigate();
  const { isAdmin, loading: adminLoading } = useAdmin();
  const { stories, loading: storiesLoading, createStory, updateStory, deleteStory } = useAdminStories();
  
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newStory, setNewStory] = useState<{
    title: string;
    description: string;
    level: 'CP' | 'CE1' | 'CE2' | 'CM1' | 'CM2';
    subject_id: string;
    cover_image_url: string;
  }>({
    title: '',
    description: '',
    level: 'CP',
    subject_id: 'lecture',
    cover_image_url: ''
  });

  // Redirect if not admin
  if (!adminLoading && !isAdmin) {
    navigate('/');
    return null;
  }

  if (adminLoading || storiesLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const handleCreateStory = async () => {
    if (!newStory.title.trim()) {
      toast.error('Le titre est requis');
      return;
    }

    setIsSubmitting(true);
    const slug = generateSlug(newStory.title);
    
    const result = await createStory({
      slug,
      title: newStory.title,
      description: newStory.description || null,
      cover_image_url: newStory.cover_image_url || null,
      level: newStory.level,
      subject_id: newStory.subject_id,
      start_page_id: 'page-1',
      is_published: false
    });

    setIsSubmitting(false);

    if (result.success) {
      toast.success('Histoire créée avec succès');
      setIsCreateOpen(false);
      setNewStory({
        title: '',
        description: '',
        level: 'CP',
        subject_id: 'lecture',
        cover_image_url: ''
      });
      // Navigate to edit the new story
      navigate(`/admin/stories/${result.data?.id}`);
    } else {
      toast.error('Erreur lors de la création');
    }
  };

  const handleTogglePublish = async (story: AdminStory) => {
    const result = await updateStory(story.id, { is_published: !story.is_published });
    if (result.success) {
      toast.success(story.is_published ? 'Histoire dépubliée' : 'Histoire publiée');
    } else {
      toast.error('Erreur lors de la mise à jour');
    }
  };

  const handleDelete = async (story: AdminStory) => {
    if (!confirm(`Supprimer "${story.title}" ? Cette action est irréversible.`)) return;
    
    const result = await deleteStory(story.id);
    if (result.success) {
      toast.success('Histoire supprimée');
    } else {
      toast.error('Erreur lors de la suppression');
    }
  };

  const getSubjectName = (subjectId: string) => {
    return subjects.find(s => s.id === subjectId)?.name || subjectId;
  };

  return (
    <main className="min-h-screen bg-background py-6 px-4">
      <div className="container max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => navigate('/admin')} className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Retour
            </Button>
            <h1 className="font-display text-3xl text-foreground">Gestion des histoires</h1>
          </div>
          
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                Nouvelle histoire
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>Créer une nouvelle histoire</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Titre *</Label>
                  <Input
                    id="title"
                    value={newStory.title}
                    onChange={(e) => setNewStory({ ...newStory, title: e.target.value })}
                    placeholder="Le titre de l'histoire"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={newStory.description}
                    onChange={(e) => setNewStory({ ...newStory, description: e.target.value })}
                    placeholder="Une brève description de l'histoire"
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Niveau *</Label>
                    <Select
                      value={newStory.level}
                      onValueChange={(value) => setNewStory({ ...newStory, level: value as 'CP' | 'CE1' | 'CE2' | 'CM1' | 'CM2' })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {grades.map((grade) => (
                          <SelectItem key={grade.id} value={grade.id}>
                            {grade.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Matière *</Label>
                    <Select
                      value={newStory.subject_id}
                      onValueChange={(value) => setNewStory({ ...newStory, subject_id: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {subjects.map((subject) => (
                          <SelectItem key={subject.id} value={subject.id}>
                            {subject.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cover">URL de la couverture</Label>
                  <Input
                    id="cover"
                    value={newStory.cover_image_url}
                    onChange={(e) => setNewStory({ ...newStory, cover_image_url: e.target.value })}
                    placeholder="https://..."
                  />
                </div>

                <div className="flex justify-end gap-2 pt-4">
                  <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
                    Annuler
                  </Button>
                  <Button onClick={handleCreateStory} disabled={isSubmitting}>
                    {isSubmitting ? (
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    ) : null}
                    Créer l'histoire
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stories List */}
        {stories.length === 0 ? (
          <div className="bg-card rounded-xl p-12 border border-border text-center">
            <BookOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-foreground mb-2">Aucune histoire</h2>
            <p className="text-muted-foreground mb-6">
              Commencez par créer votre première histoire interactive.
            </p>
            <Button onClick={() => setIsCreateOpen(true)} className="gap-2">
              <Plus className="w-4 h-4" />
              Créer une histoire
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {stories.map((story) => (
              <div
                key={story.id}
                className="bg-card rounded-xl p-4 border border-border shadow-sm flex items-center gap-4"
              >
                {/* Cover Image */}
                <div className="w-20 h-20 rounded-lg bg-muted flex items-center justify-center shrink-0 overflow-hidden">
                  {story.cover_image_url ? (
                    <img 
                      src={story.cover_image_url} 
                      alt={story.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <BookOpen className="w-8 h-8 text-muted-foreground" />
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-foreground truncate">
                      {story.title}
                    </h3>
                    {story.is_published ? (
                      <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full">
                        Publié
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 text-xs rounded-full">
                        Brouillon
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {story.level} • {getSubjectName(story.subject_id)}
                  </p>
                  {story.description && (
                    <p className="text-sm text-muted-foreground truncate mt-1">
                      {story.description}
                    </p>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 shrink-0">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleTogglePublish(story)}
                    className="gap-1"
                  >
                    {story.is_published ? (
                      <>
                        <EyeOff className="w-4 h-4" />
                        Dépublier
                      </>
                    ) : (
                      <>
                        <Eye className="w-4 h-4" />
                        Publier
                      </>
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate(`/admin/stories/${story.id}`)}
                    className="gap-1"
                  >
                    <Edit className="w-4 h-4" />
                    Modifier
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(story)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
