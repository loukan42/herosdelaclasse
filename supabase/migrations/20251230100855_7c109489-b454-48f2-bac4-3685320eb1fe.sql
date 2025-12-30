-- Create trigger to update last_login when user signs in
-- This triggers on auth.users updates (which happens on login)
CREATE OR REPLACE TRIGGER on_auth_user_login
  AFTER UPDATE ON auth.users
  FOR EACH ROW
  WHEN (OLD.last_sign_in_at IS DISTINCT FROM NEW.last_sign_in_at)
  EXECUTE FUNCTION public.update_last_login();