-- Drop existing restrictive policies
DROP POLICY IF EXISTS "Admins can manage stories" ON public.admin_stories;
DROP POLICY IF EXISTS "Everyone can read published stories" ON public.admin_stories;
DROP POLICY IF EXISTS "Admins can manage story pages" ON public.admin_story_pages;
DROP POLICY IF EXISTS "Everyone can read pages of published stories" ON public.admin_story_pages;

-- Recreate as PERMISSIVE policies (default behavior)
CREATE POLICY "Admins can manage stories"
ON public.admin_stories
FOR ALL
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Everyone can read published stories"
ON public.admin_stories
FOR SELECT
TO public
USING (is_published = true);

CREATE POLICY "Admins can manage story pages"
ON public.admin_story_pages
FOR ALL
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Everyone can read pages of published stories"
ON public.admin_story_pages
FOR SELECT
TO public
USING (EXISTS (
  SELECT 1 FROM admin_stories
  WHERE admin_stories.id = admin_story_pages.story_id
  AND admin_stories.is_published = true
));