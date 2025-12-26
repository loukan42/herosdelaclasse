import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAdmin } from '@/hooks/useAdmin';
import { useAuthContext } from '@/contexts/AuthContext';
import { 
  Users, 
  BookOpen, 
  Activity, 
  Calendar,
  ArrowLeft,
  RefreshCw,
  Crown
} from 'lucide-react';
import { Button } from '@/components/ui/button';
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

export default function Admin() {
  const navigate = useNavigate();
  const { loading: authLoading, isAuthenticated } = useAuthContext();
  const { isAdmin, loading, users, stats, refresh } = useAdmin();

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
              <p className="text-muted-foreground">Gérez les utilisateurs et consultez les statistiques</p>
            </div>
          </div>
          <Button onClick={refresh} variant="outline" className="gap-2">
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

        {/* Users Table */}
        <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
          <div className="p-6 border-b border-border">
            <h2 className="font-display text-xl text-foreground">Tous les utilisateurs</h2>
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Utilisateur</TableHead>
                  <TableHead>Date d'inscription</TableHead>
                  <TableHead>Dernière connexion</TableHead>
                  <TableHead className="text-center">Histoires terminées</TableHead>
                  <TableHead className="text-center">En cours</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
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
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </main>
  );
}
