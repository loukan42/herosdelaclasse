-- Add public read access for published stories on admin_stories table
-- This is needed because published_stories_view uses SECURITY INVOKER
-- and needs to query admin_stories with the user's permissions
CREATE POLICY "Everyone can read published stories"
ON public.admin_stories
FOR SELECT
USING (is_published = true);