-- Add genre column to children_profiles table
ALTER TABLE public.children_profiles 
ADD COLUMN genre TEXT CHECK (genre IN ('masculin', 'feminin'));

-- Add comment for documentation
COMMENT ON COLUMN public.children_profiles.genre IS 'Gender of the child: masculin or feminin, used for story text adaptation';