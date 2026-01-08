import { Link } from 'react-router-dom';
import { Star, Gift } from 'lucide-react';
import { useUserPoints } from '@/hooks/useUserPoints';
import { useLanguage } from '@/contexts/LanguageContext';

export function PointsDisplay() {
  const { points, isAuthenticated, loading } = useUserPoints();
  const { t } = useLanguage();

  if (!isAuthenticated || loading) {
    return null;
  }

  return (
    <Link 
      to="/collection"
      className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-amber-500/20 to-orange-500/20 hover:from-amber-500/30 hover:to-orange-500/30 transition-all border border-amber-500/30"
    >
      <div className="flex items-center gap-1">
        <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
        <span className="font-bold text-amber-600 dark:text-amber-400">{points}</span>
      </div>
      <div className="w-px h-4 bg-amber-500/30" />
      <Gift className="w-4 h-4 text-orange-500" />
      <span className="text-sm font-medium text-foreground hidden sm:inline">
        Collection
      </span>
    </Link>
  );
}
