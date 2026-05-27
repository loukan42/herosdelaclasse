
-- 1) user_roles: close privilege escalation by adding explicit INSERT/UPDATE/DELETE policies with WITH CHECK
DROP POLICY IF EXISTS "Admins can manage roles" ON public.user_roles;

CREATE POLICY "Admins can insert roles"
ON public.user_roles
FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update roles"
ON public.user_roles
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete roles"
ON public.user_roles
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));

-- 2) story_page_overrides: remove the unrestricted public SELECT policy.
-- Public reads continue to work via the story_page_overrides_public_view (security invoker)
-- which is granted to anon/authenticated and excludes sensitive columns.
DROP POLICY IF EXISTS "Public can read overrides via view" ON public.story_page_overrides;
