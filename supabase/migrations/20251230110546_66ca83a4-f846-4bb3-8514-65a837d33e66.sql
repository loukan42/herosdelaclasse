-- Sync existing last_sign_in_at values from auth.users to profiles.last_login
-- This is a one-time fix for users who logged in before the trigger was created
UPDATE public.profiles p
SET last_login = u.last_sign_in_at
FROM auth.users u
WHERE p.id = u.id
  AND u.last_sign_in_at IS NOT NULL
  AND p.last_login IS NULL;