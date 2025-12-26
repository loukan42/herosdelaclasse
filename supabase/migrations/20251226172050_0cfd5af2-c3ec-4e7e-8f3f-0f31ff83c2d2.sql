-- Table pour les profils enfants (multi-profils par compte parent)
CREATE TABLE public.children_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  prenom TEXT NOT NULL,
  avatar TEXT NOT NULL DEFAULT 'garcon_1',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.children_profiles ENABLE ROW LEVEL SECURITY;

-- Parents can manage their own children profiles
CREATE POLICY "Users can view their own children profiles"
ON public.children_profiles
FOR SELECT
USING (auth.uid() = parent_user_id);

CREATE POLICY "Users can insert their own children profiles"
ON public.children_profiles
FOR INSERT
WITH CHECK (auth.uid() = parent_user_id);

CREATE POLICY "Users can update their own children profiles"
ON public.children_profiles
FOR UPDATE
USING (auth.uid() = parent_user_id);

CREATE POLICY "Users can delete their own children profiles"
ON public.children_profiles
FOR DELETE
USING (auth.uid() = parent_user_id);

-- Admins can view all children profiles
CREATE POLICY "Admins can view all children profiles"
ON public.children_profiles
FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

-- Update trigger
CREATE TRIGGER update_children_profiles_updated_at
BEFORE UPDATE ON public.children_profiles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Index for faster lookups
CREATE INDEX idx_children_profiles_parent ON public.children_profiles(parent_user_id);

-- Modifier story_progress pour lier au profil enfant plutôt qu'au user directement
ALTER TABLE public.story_progress ADD COLUMN child_profile_id UUID REFERENCES public.children_profiles(id) ON DELETE CASCADE;

-- Modifier completed_stories pour lier au profil enfant
ALTER TABLE public.completed_stories ADD COLUMN child_profile_id UUID REFERENCES public.children_profiles(id) ON DELETE CASCADE;