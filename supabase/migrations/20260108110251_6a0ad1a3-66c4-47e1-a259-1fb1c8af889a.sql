-- Remove the public SELECT policy from admin_stories
-- Users should use published_stories_view instead, which excludes sensitive fields like created_by
DROP POLICY IF EXISTS "Everyone can read published stories" ON public.admin_stories;

-- Create a new restrictive policy that only allows admins to read
-- (the existing "Admins can manage stories" policy already covers this, but we ensure clarity)
