-- Add inventory_items to admin_stories to define available items for the story
ALTER TABLE public.admin_stories 
ADD COLUMN inventory_items jsonb DEFAULT '[]'::jsonb;

-- Add collected_item_id to admin_story_pages to indicate which item is collected on this page
ALTER TABLE public.admin_story_pages 
ADD COLUMN collected_item_id text DEFAULT NULL;

-- Add comment for clarity
COMMENT ON COLUMN public.admin_stories.inventory_items IS 'Array of inventory items: [{id: string, name: string, icon: string}]';
COMMENT ON COLUMN public.admin_story_pages.collected_item_id IS 'ID of the inventory item collected on this page, if any';