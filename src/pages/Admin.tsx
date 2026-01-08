import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAdmin } from '@/hooks/useAdmin';
import { useAuthContext } from '@/contexts/AuthContext';
import { useAdminStories } from '@/hooks/useAdminStories';
import { stories as staticStories } from '@/data/stories';
import { 
  Users, 
  BookOpen, 
  Activity, 
  Calendar,
  ArrowLeft,
  RefreshCw,
  Crown,
  Plus,
  Eye,
  EyeOff,
  Pencil,
  Trash2,
  Lock,
  Gift
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { subjects } from '@/data/subjects';
import { toast } from 'sonner';
import { useLanguage } from '@/contexts/LanguageContext';
import { Badge } from '@/components/ui/badge';

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

// Combined story type for display
interface DisplayStory {
  id: string;
  title: string;
  description: string | null;
  cover_image_url: string | null;
  level: string;
  subject_id: string[]; // Now an array
  is_published: boolean;
  isStatic: boolean; // true for built-in stories
}

export default function Admin() {
  const navigate = useNavigate();
  const { loading: authLoading, isAuthenticated } = useAuthContext();
  const { isAdmin, loading, users, stats, refresh } = useAdmin();
  const { stories: adminStories, loading: storiesLoading, updateStory, deleteStory, fetchStories } = useAdminStories();
  const [activeTab, setActiveTab] = useState('users');
  const { t } = useLanguage();

  // Combine static and admin stories for display
  const allDisplayStories: DisplayStory[] = [
    // Static stories (built-in) - convert single subjectId to array
    ...staticStories.map(s => ({
      id: s.id,
      title: s.title,
      description: s.description,
      cover_image_url: s.coverImage,
      level: s.level,
      subject_id: [s.subjectId], // Convert to array
      is_published: true,
      isStatic: true
    })),
    // Admin-created stories (already have array)
    ...adminStories.map(s => ({
      id: s.id,
      title: s.title,
      description: s.description,
      cover_image_url: s.cover_image_url,
      level: s.level,
      subject_id: s.subject_id,
      is_published: s.is_published,
      isStatic: false
    }))
  ];

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/auth');
    }
  }, [authLoading, isAuthenticated, navigate]);

  useEffect(() => {
    if (!loading && !isAdmin) {
      navigate('/');
    }
  }, [loading, isAdmin, navigate]);

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Jamais';
    return formatDistanceToNow(new Date(dateString), { addSuffix: true, locale: fr });
  };

  const formatFullDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const getSubjectNames = (subjectIds: string[]) => {
    if (!subjectIds || subjectIds.length === 0) return 'Non défini';
    return subjectIds.map(id => {
      const subject = subjects.find(s => s.id === id);
      return subject ? t(subject.nameKey) : id;
    }).join(', ');
  };

  const handleTogglePublish = async (storyId: string, isPublished: boolean) => {
    const result = await updateStory(storyId, { is_published: !isPublished });
    if (result.success) {
      toast.success(isPublished ? 'Histoire dépubliée' : 'Histoire publiée');
    } else {
      toast.error('Erreur lors de la mise à jour');
    }
  };

  const handleDeleteStory = async (storyId: string, title: string) => {
    if (!confirm(`Supprimer l'histoire "${title}" ?`)) return;
    const result = await deleteStory(storyId);
    if (result.success) {
      toast.success('Histoire supprimée');
    } else {
      toast.error('Erreur lors de la suppression');
    }
  };

  const handleRefresh = () => {
    refresh();
    fetchStories();
  };

  return (
    <main className="min-h-screen bg-background py-6 px-4">
      <div className="container max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link to="/">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div>
              <h1 className="font-display text-3xl text-foreground flex items-center gap-2">
                <Crown className="w-8 h-8 text-golden" />
                Administration
              </h1>
              <p className="text-muted-foreground">Gérez les utilisateurs et les histoires</p>
            </div>
          </div>
          <Button onClick={handleRefresh} variant="outline" className="gap-2">
            <RefreshCw className="w-4 h-4" />
            Actualiser
          </Button>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-card rounded-2xl p-6 border border-border shadow-sm">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Utilisateurs</p>
                  <p className="text-3xl font-bold text-foreground">{stats.total_users}</p>
                </div>
              </div>
            </div>

            <div className="bg-card rounded-2xl p-6 border border-border shadow-sm">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-ending-happy/10 flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-ending-happy" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Histoires terminées</p>
                  <p className="text-3xl font-bold text-foreground">{stats.total_completed_stories}</p>
                </div>
              </div>
            </div>

            <div className="bg-card rounded-2xl p-6 border border-border shadow-sm">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-golden/10 flex items-center justify-center">
                  <Activity className="w-6 h-6 text-golden" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Actifs aujourd'hui</p>
                  <p className="text-3xl font-bold text-foreground">{stats.active_today}</p>
                </div>
              </div>
            </div>

            <div className="bg-card rounded-2xl p-6 border border-border shadow-sm">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-accent-foreground" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Actifs cette semaine</p>
                  <p className="text-3xl font-bold text-foreground">{stats.active_this_week}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <div className="flex items-center justify-between">
            <TabsList className="grid w-full max-w-lg grid-cols-3">
              <TabsTrigger value="users" className="gap-2">
                <Users className="w-4 h-4" />
                Utilisateurs
              </TabsTrigger>
              <TabsTrigger value="stories" className="gap-2">
                <BookOpen className="w-4 h-4" />
                Histoires
              </TabsTrigger>
              <TabsTrigger value="collection" className="gap-2">
                <Gift className="w-4 h-4" />
                Collection
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Collection Tab */}
          <TabsContent value="collection">
            <div className="bg-card rounded-2xl border border-border shadow-sm p-8 text-center">
              <Gift className="w-16 h-16 text-primary mx-auto mb-4" />
              <h2 className="font-display text-2xl font-bold mb-2">Gestion de la collection</h2>
              <p className="text-muted-foreground mb-6">
                Créez des thèmes et importez des cartes à collectionner pour vos utilisateurs.
              </p>
              <Button asChild size="lg" className="gap-2">
                <Link to="/admin/collection">
                  <Plus className="w-5 h-5" />
                  Gérer la collection
                </Link>
              </Button>
            </div>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users">
            <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
              <div className="p-6 border-b border-border">
                <h2 className="font-display text-xl text-foreground">Tous les utilisateurs</h2>
              </div>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Utilisateur</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Date d'inscription</TableHead>
                      <TableHead>Dernière connexion</TableHead>
                      <TableHead className="text-center">Histoires terminées</TableHead>
                      <TableHead className="text-center">En cours</TableHead>
                      <TableHead className="text-center">Tours de roue</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                          Aucun utilisateur inscrit
                        </TableCell>
                      </TableRow>
                    ) : (
                      users.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <span className="text-2xl">
                                {AVATAR_EMOJIS[user.avatar] || AVATAR_EMOJIS.default}
                              </span>
                              <div>
                                <p className="font-semibold">{user.prenom}</p>
                                <p className="text-xs text-muted-foreground font-mono">{user.id.slice(0, 8)}...</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <span className="text-sm text-muted-foreground">
                              {user.email || '-'}
                            </span>
                          </TableCell>
                          <TableCell>
                            <span title={formatFullDate(user.created_at)}>
                              {formatDate(user.created_at)}
                            </span>
                          </TableCell>
                          <TableCell>
                            <span className={user.last_login ? '' : 'text-muted-foreground'}>
                              {formatDate(user.last_login)}
                            </span>
                          </TableCell>
                          <TableCell className="text-center">
                            <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-ending-happy/10 text-ending-happy font-semibold">
                              {user.stories_completed}
                            </span>
                          </TableCell>
                          <TableCell className="text-center">
                            <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-secondary text-secondary-foreground font-semibold">
                              {user.stories_in_progress}
                            </span>
                          </TableCell>
                          <TableCell className="text-center">
                            <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-semibold">
                              {user.wheel_spins}
                            </span>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          </TabsContent>

          {/* Stories Tab */}
          <TabsContent value="stories">
            <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
              <div className="p-6 border-b border-border flex items-center justify-between">
                <h2 className="font-display text-xl text-foreground">Gérer les histoires</h2>
                <Button asChild className="gap-2">
                  <Link to="/admin/stories">
                    <Plus className="w-4 h-4" />
                    Créer une histoire
                  </Link>
                </Button>
              </div>
              <div className="overflow-x-auto">
                {storiesLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                  </div>
                ) : allDisplayStories.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>Aucune histoire créée</p>
                    <Button asChild variant="outline" className="mt-4">
                      <Link to="/admin/stories">Créer votre première histoire</Link>
                    </Button>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Histoire</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Niveau</TableHead>
                        <TableHead>Matière</TableHead>
                        <TableHead>Statut</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {allDisplayStories.map((story) => (
                        <TableRow key={story.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              {story.cover_image_url && (
                                <img 
                                  src={story.cover_image_url} 
                                  alt="" 
                                  className="w-12 h-12 rounded-lg object-cover"
                                />
                              )}
                              <div>
                                <p className="font-semibold">{story.title}</p>
                                <p className="text-xs text-muted-foreground line-clamp-1">{story.description}</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            {story.isStatic ? (
                              <Badge variant="secondary" className="gap-1">
                                <Lock className="w-3 h-3" />
                                Intégrée
                              </Badge>
                            ) : (
                              <Badge variant="outline">Personnalisée</Badge>
                            )}
                          </TableCell>
                          <TableCell>
                            <span className="bg-golden/20 text-golden-foreground px-2 py-1 rounded-full text-sm font-semibold">
                              {story.level}
                            </span>
                          </TableCell>
                          <TableCell>{getSubjectNames(story.subject_id)}</TableCell>
                          <TableCell>
                            {story.is_published ? (
                              <span className="flex items-center gap-1 text-ending-happy">
                                <Eye className="w-4 h-4" />
                                Publié
                              </span>
                            ) : (
                              <span className="flex items-center gap-1 text-muted-foreground">
                                <EyeOff className="w-4 h-4" />
                                Brouillon
                              </span>
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            {story.isStatic ? (
                              <span className="text-xs text-muted-foreground">Non modifiable</span>
                            ) : (
                              <div className="flex items-center justify-end gap-2">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleTogglePublish(story.id, story.is_published)}
                                  title={story.is_published ? 'Dépublier' : 'Publier'}
                                >
                                  {story.is_published ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </Button>
                                <Button variant="ghost" size="icon" asChild>
                                  <Link to={`/admin/stories/${story.id}`} title="Modifier">
                                    <Pencil className="w-4 h-4" />
                                  </Link>
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleDeleteStory(story.id, story.title)}
                                  className="text-destructive hover:text-destructive"
                                  title="Supprimer"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}
