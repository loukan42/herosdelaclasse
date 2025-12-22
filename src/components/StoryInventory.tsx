import { Gem, TreeDeciduous, Flame, Key, Sprout, Droplets } from "lucide-react";

interface InventoryItem {
  id: string;
  name: string;
  icon: React.ReactNode;
  collected: boolean;
}

interface StoryInventoryProps {
  visitedPages: string[];
  storyId: string;
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

export function StoryInventory({ visitedPages, storyId }: StoryInventoryProps) {
  const items = inventoryConfig[storyId] || [];
  
  if (items.length === 0) return null;

  const inventoryItems: InventoryItem[] = items.map(item => ({
    id: item.pageId,
    name: item.name,
    icon: item.icon,
    collected: visitedPages.includes(item.pageId)
  }));

  const collectedCount = inventoryItems.filter(item => item.collected).length;

  return (
    <div className="bg-card/80 backdrop-blur-sm rounded-xl md:rounded-2xl p-3 md:p-4 shadow-book border border-border/50">
      <div className="flex items-center justify-between mb-2 md:mb-3">
        <h3 className="font-display text-sm md:text-base text-muted-foreground">
          Inventaire
        </h3>
        <span className="text-xs md:text-sm text-muted-foreground font-semibold">
          {collectedCount}/{items.length}
        </span>
      </div>
      
      <div className="flex gap-2 md:gap-3">
        {inventoryItems.map((item) => (
          <div
            key={item.id}
            className={`
              relative flex flex-col items-center justify-center
              w-14 h-14 md:w-16 md:h-16 rounded-xl
              transition-all duration-300
              ${item.collected 
                ? 'bg-primary/20 text-primary shadow-md scale-100' 
                : 'bg-muted/50 text-muted-foreground/40 scale-95 opacity-60'}
            `}
            title={item.collected ? item.name : `${item.name} (non trouvé)`}
          >
            <div className={`transition-transform duration-300 ${item.collected ? 'animate-bounce-subtle' : ''}`}>
              {item.icon}
            </div>
            {item.collected && (
              <div className="absolute -top-1 -right-1 w-4 h-4 md:w-5 md:h-5 bg-ending-happy rounded-full flex items-center justify-center">
                <span className="text-white text-xs">✓</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
