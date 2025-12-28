-- Drop the existing view
DROP VIEW IF EXISTS public.published_stories_view;

-- Recreate with SECURITY INVOKER (respects caller's RLS policies)
CREATE VIEW public.published_stories_view 
WITH (security_invoker = true)
AS
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