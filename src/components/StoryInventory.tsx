import { Gem, TreeDeciduous, Flame, Key, Sprout, Droplets, Sparkles } from "lucide-react";

interface InventoryItem {
  id: string;
  name: string;
  icon: React.ReactNode;
  collected: boolean;
}

interface StoryInventoryProps {
  visitedPages: string[];
  storyId: string;
  newlyCollectedPageId?: string | null;
}

const inventoryConfig: Record<string, { pageId: string; name: string; icon: React.ReactNode }[]> = {
  "le-feu-seteint": [
    { pageId: "page-2", name: "Pierre brillante", icon: <Gem className="w-5 h-5 md:w-6 md:h-6" /> },
    { pageId: "page-3", name: "Bois sec", icon: <TreeDeciduous className="w-5 h-5 md:w-6 md:h-6" /> },
    { pageId: "page-4", name: "Torche", icon: <Flame className="w-5 h-5 md:w-6 md:h-6" /> },
  ],
  "le-jardin-secret": [
    { pageId: "page-2", name: "Clé ancienne", icon: <Key className="w-5 h-5 md:w-6 md:h-6" /> },
    { pageId: "page-5", name: "Graine dorée", icon: <Sprout className="w-5 h-5 md:w-6 md:h-6" /> },
    { pageId: "page-6", name: "Arrosoir", icon: <Droplets className="w-5 h-5 md:w-6 md:h-6" /> },
  ]
};

export function StoryInventory({ visitedPages, storyId, newlyCollectedPageId }: StoryInventoryProps) {
  const items = inventoryConfig[storyId] || [];
  
  if (items.length === 0) return null;

  const inventoryItems: InventoryItem[] = items.map(item => ({
    id: item.pageId,
    name: item.name,
    icon: item.icon,
    collected: visitedPages.includes(item.pageId)
  }));

  const collectedCount = inventoryItems.filter(item => item.collected).length;
  const hasNewItem = newlyCollectedPageId && items.some(item => item.pageId === newlyCollectedPageId);

  return (
    <div className={`
      relative bg-card/80 backdrop-blur-sm rounded-xl md:rounded-2xl p-3 md:p-4 shadow-book border-2 
      transition-all duration-500
      ${hasNewItem ? 'border-golden shadow-lg shadow-golden/30 scale-[1.02]' : 'border-border/50'}
    `}>
      {/* New item celebration overlay */}
      {hasNewItem && (
        <div className="absolute inset-0 rounded-xl md:rounded-2xl overflow-hidden pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-r from-golden/20 via-transparent to-golden/20 animate-pulse" />
          <Sparkles className="absolute top-2 right-2 w-5 h-5 text-golden animate-bounce" />
          <Sparkles className="absolute bottom-2 left-2 w-4 h-4 text-golden animate-bounce" style={{ animationDelay: '0.2s' }} />
        </div>
      )}

      <div className="relative flex items-center justify-between mb-2 md:mb-3">
        <h3 className={`
          font-display text-sm md:text-base transition-colors duration-300
          ${hasNewItem ? 'text-golden font-bold' : 'text-muted-foreground'}
        `}>
          {hasNewItem ? '✨ Nouvel objet trouvé !' : 'Inventaire'}
        </h3>
        <span className={`
          text-xs md:text-sm font-semibold transition-colors duration-300
          ${hasNewItem ? 'text-golden' : 'text-muted-foreground'}
        `}>
          {collectedCount}/{items.length}
        </span>
      </div>
      
      <div className="relative flex gap-2 md:gap-3">
        {inventoryItems.map((item) => {
          const isNewlyCollected = item.id === newlyCollectedPageId;
          
          return (
            <div
              key={item.id}
              className={`
                relative flex flex-col items-center justify-center
                w-14 h-14 md:w-16 md:h-16 rounded-xl
                transition-all duration-500
                ${item.collected 
                  ? isNewlyCollected
                    ? 'bg-golden/30 text-golden shadow-lg shadow-golden/40 scale-110 ring-2 ring-golden ring-offset-2 ring-offset-card' 
                    : 'bg-primary/20 text-primary shadow-md scale-100' 
                  : 'bg-muted/50 text-muted-foreground/40 scale-95 opacity-60'}
              `}
              title={item.collected ? item.name : `${item.name} (non trouvé)`}
            >
              {/* Glow effect for new item */}
              {isNewlyCollected && (
                <div className="absolute inset-0 rounded-xl bg-golden/50 animate-ping" />
              )}
              
              <div className={`
                relative transition-transform duration-500 
                ${isNewlyCollected ? 'animate-bounce scale-110' : item.collected ? '' : ''}
              `}>
                {item.icon}
              </div>
              
              {item.collected && (
                <div className={`
                  absolute -top-1 -right-1 w-5 h-5 md:w-6 md:h-6 rounded-full flex items-center justify-center
                  transition-all duration-300
                  ${isNewlyCollected ? 'bg-golden scale-125' : 'bg-ending-happy'}
                `}>
                  <span className="text-white text-xs font-bold">✓</span>
                </div>
              )}
              
              {/* Item name tooltip for newly collected */}
              {isNewlyCollected && (
                <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap bg-golden text-golden-foreground text-xs font-bold px-2 py-1 rounded-full shadow-lg animate-fade-in">
                  {item.name}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
