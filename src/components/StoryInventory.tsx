import { Gem, TreeDeciduous, Flame, Key, Sprout, Droplets, Sparkles, Star, Heart, Zap, Shield, Crown, Compass, Map, Scroll, Feather, Package, LucideIcon } from "lucide-react";
import { StoryInventoryConfig } from "@/hooks/usePublishedStories";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTranslatedString } from "@/hooks/useTranslatedString";

interface StoryInventoryProps {
  visitedPages: string[];
  storyId: string;
  newlyCollectedPageId?: string | null;
  inventoryConfig?: StoryInventoryConfig;
}

// Legacy static config for old stories
const legacyInventoryConfig: Record<string, { pageId: string; name: string; icon: string }[]> = {
  "le-feu-seteint": [
    { pageId: "page-2", name: "Pierre brillante", icon: "gem" },
    { pageId: "page-3", name: "Bois sec", icon: "tree" },
    { pageId: "page-4", name: "Torche", icon: "flame" },
  ],
  "le-jardin-secret": [
    { pageId: "page-2", name: "Clé ancienne", icon: "key" },
    { pageId: "page-5", name: "Graine dorée", icon: "sprout" },
    { pageId: "page-6", name: "Arrosoir", icon: "droplets" },
  ]
};

const iconMap: Record<string, LucideIcon> = {
  gem: Gem,
  tree: TreeDeciduous,
  flame: Flame,
  key: Key,
  sprout: Sprout,
  droplets: Droplets,
  star: Star,
  heart: Heart,
  zap: Zap,
  shield: Shield,
  crown: Crown,
  compass: Compass,
  map: Map,
  scroll: Scroll,
  feather: Feather,
  package: Package,
};

const getIcon = (iconId: string) => {
  const IconComponent = iconMap[iconId] || Package;
  return <IconComponent className="w-5 h-5 md:w-6 md:h-6" />;
};

export function StoryInventory({ visitedPages, storyId, newlyCollectedPageId, inventoryConfig }: StoryInventoryProps) {
  const { t } = useLanguage();
  // Use dynamic config if available, otherwise fall back to legacy
  let items: { id: string; name: string; icon: string; pageId?: string }[] = [];
  let pageItemMapping: Record<string, string> = {};

  if (inventoryConfig && inventoryConfig.items.length > 0) {
    // Dynamic inventory from database
    items = inventoryConfig.items;
    pageItemMapping = inventoryConfig.pageItems;
  } else {
    // Legacy static config
    const legacyItems = legacyInventoryConfig[storyId] || [];
    items = legacyItems.map(item => ({ ...item, id: item.pageId }));
    legacyItems.forEach(item => {
      pageItemMapping[item.pageId] = item.pageId;
    });
  }

  if (items.length === 0) return null;

  // Determine which items are collected based on visited pages
  const collectedItemIds = new Set<string>();
  visitedPages.forEach(pageId => {
    const itemId = pageItemMapping[pageId];
    if (itemId) collectedItemIds.add(itemId);
  });

  // Find newly collected item
  const newlyCollectedItemId = newlyCollectedPageId ? pageItemMapping[newlyCollectedPageId] : null;

  const inventoryItems = items.map(item => ({
    id: item.id,
    name: item.name,
    icon: item.icon,
    collected: collectedItemIds.has(item.id)
  }));

  const collectedCount = inventoryItems.filter(item => item.collected).length;
  const hasNewItem = newlyCollectedItemId !== null;

  return (
    <div className={`
      relative bg-card/80 backdrop-blur-sm rounded-xl md:rounded-2xl p-3 md:p-4 shadow-book border-2 
      transition-all duration-500
      ${hasNewItem ? 'border-golden shadow-lg shadow-golden/30 scale-[1.02]' : 'border-border/50'}
    `}>
      {hasNewItem && (
        <div className="absolute inset-0 rounded-xl md:rounded-2xl overflow-hidden pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-r from-golden/20 via-transparent to-golden/20 animate-pulse" />
          <Sparkles className="absolute top-2 right-2 w-5 h-5 text-golden animate-bounce" />
          <Sparkles className="absolute bottom-2 left-2 w-4 h-4 text-golden animate-bounce" style={{ animationDelay: '0.2s' }} />
        </div>
      )}

      <div className="relative flex items-center justify-between mb-2 md:mb-3">
        <h3 className={`font-display text-sm md:text-base transition-colors duration-300 ${hasNewItem ? 'text-golden font-bold' : 'text-muted-foreground'}`}>
          {hasNewItem ? t('inventory.newItem') : t('inventory.title')}
        </h3>
        <span className={`text-xs md:text-sm font-semibold transition-colors duration-300 ${hasNewItem ? 'text-golden' : 'text-muted-foreground'}`}>
          {collectedCount}/{items.length}
        </span>
      </div>
      
      <div className="relative flex gap-2 md:gap-3">
        {inventoryItems.map((item) => {
          const isNewlyCollected = item.id === newlyCollectedItemId;
          
          return (
            <TranslatedInventoryItem
              key={item.id}
              item={item}
              isNewlyCollected={isNewlyCollected}
            />
          );
        })}
      </div>
    </div>
  );
}

// Sub-component to handle translation per item
function TranslatedInventoryItem({ 
  item, 
  isNewlyCollected 
}: { 
  item: { id: string; name: string; icon: string; collected: boolean }; 
  isNewlyCollected: boolean;
}) {
  const { text: translatedName } = useTranslatedString(item.name);
  
  return (
    <div
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
      title={item.collected ? translatedName : `${translatedName} (non trouvé)`}
    >
      {isNewlyCollected && (
        <div className="absolute inset-0 rounded-xl bg-golden/50 animate-ping" />
      )}
      
      <div className={`relative transition-transform duration-500 ${isNewlyCollected ? 'animate-bounce scale-110' : ''}`}>
        {getIcon(item.icon)}
      </div>
      
      {item.collected && (
        <div className={`absolute -top-1 -right-1 w-5 h-5 md:w-6 md:h-6 rounded-full flex items-center justify-center transition-all duration-300 ${isNewlyCollected ? 'bg-golden scale-125' : 'bg-ending-happy'}`}>
          <span className="text-white text-xs font-bold">✓</span>
        </div>
      )}
      
      {isNewlyCollected && (
        <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap bg-golden text-golden-foreground text-xs font-bold px-2 py-1 rounded-full shadow-lg animate-fade-in">
          {translatedName}
        </div>
      )}
    </div>
  );
}