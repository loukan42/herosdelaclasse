-- Fix: prevent public exposure of admin UUIDs via story_page_overrides.updated_by
-- Approach: remove public SELECT on the base table and expose a safe public view without updated_by.

-- 1) Remove public read access from the base table
DROP POLICY IF EXISTS "Everyone can read story overrides" ON public.story_page_overrides;

-- 2) Create a safe public view that excludes admin-identifying columns (updated_by)
CREATE OR REPLACE VIEW public.story_page_overrides_public_view AS
SELECT
  id,
  story_id,
  page_id,
  text,
  text_masculine,
  text_feminine,
  updated_at
FROM public.story_page_overrides;

-- 3) Allow public read of the safe view
GRANT SELECT ON public.story_page_overrides_public_view TO anon, authenticated;
