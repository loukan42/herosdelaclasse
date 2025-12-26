-- Create a secure view for published stories that excludes sensitive admin data
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

-- Grant SELECT access to the view for public (anon) role
GRANT SELECT ON public.published_stories_view TO anon;
GRANT SELECT ON public.published_stories_view TO authenticated;

-- Add a comment explaining the purpose
COMMENT ON VIEW public.published_stories_view IS 'Public view of published stories without sensitive admin identity fields';