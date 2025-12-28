-- Step 1: Drop the view that depends on subject_id
DROP VIEW IF EXISTS public.published_stories_view;

-- Step 2: Add new array column
ALTER TABLE public.admin_stories 
ADD COLUMN subject_ids text[] DEFAULT '{}';

-- Step 3: Migrate existing data
UPDATE public.admin_stories 
SET subject_ids = ARRAY[subject_id]
WHERE subject_id IS NOT NULL AND subject_id != '';

-- Step 4: Drop the old text column
ALTER TABLE public.admin_stories 
DROP COLUMN subject_id;

-- Step 5: Rename to subject_id (now as array)
ALTER TABLE public.admin_stories 
RENAME COLUMN subject_ids TO subject_id;

-- Step 6: Set constraints
ALTER TABLE public.admin_stories 
ALTER COLUMN subject_id SET NOT NULL,
ALTER COLUMN subject_id SET DEFAULT '{}';

-- Step 7: Recreate the view with the array column
CREATE VIEW public.published_stories_view AS
SELECT 
  id,
  slug,
  title,
  description,
  cover_image_url,
  level,
  subject_id,
  start_page_id,
  is_published,
  created_at,
  updated_at
FROM public.admin_stories
WHERE is_published = true;