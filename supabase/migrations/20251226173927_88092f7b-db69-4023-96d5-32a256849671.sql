-- Drop existing constraint if any
ALTER TABLE public.story_progress DROP CONSTRAINT IF EXISTS story_progress_user_id_story_id_key;

-- Create new unique constraint including child_profile_id
-- Using COALESCE to handle NULL values (NULL is treated as distinct in unique constraints)
CREATE UNIQUE INDEX story_progress_user_story_child_unique 
ON public.story_progress (user_id, story_id, COALESCE(child_profile_id, '00000000-0000-0000-0000-000000000000'::uuid));