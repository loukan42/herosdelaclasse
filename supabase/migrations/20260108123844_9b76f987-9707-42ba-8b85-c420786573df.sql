-- Fix linter warning: convert view to SECURITY INVOKER
DROP VIEW IF EXISTS public.story_page_overrides_public_view;

CREATE VIEW public.story_page_overrides_public_view
WITH (security_invoker = true)
AS
SELECT
  id,
  story_id,
  page_id,
  text,
  text_masculine,
  text_feminine,
  updated_at
FROM public.story_page_overrides;

-- Grant public read access to the view
GRANT SELECT ON public.story_page_overrides_public_view TO anon, authenticated;

-- Add RLS policy on the base table allowing SELECT through the view (SECURITY INVOKER respects this)
CREATE POLICY "Public can read overrides via view"
ON public.story_page_overrides
FOR SELECT
USING (true);