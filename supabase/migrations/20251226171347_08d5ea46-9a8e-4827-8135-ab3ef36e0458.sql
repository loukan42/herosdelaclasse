-- Table pour stocker les histoires créées via l'admin
CREATE TABLE public.admin_stories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  description TEXT,
  cover_image_url TEXT,
  level TEXT NOT NULL CHECK (level IN ('CP', 'CE1', 'CE2', 'CM1', 'CM2')),
  subject_id TEXT NOT NULL,
  start_page_id TEXT NOT NULL DEFAULT 'page-1',
  is_published BOOLEAN NOT NULL DEFAULT false,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Table pour stocker les pages des histoires
CREATE TABLE public.admin_story_pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  story_id UUID NOT NULL REFERENCES public.admin_stories(id) ON DELETE CASCADE,
  page_id TEXT NOT NULL,
  title TEXT,
  text TEXT NOT NULL,
  text_masculine TEXT,
  text_feminine TEXT,
  image_url TEXT,
  choices JSONB NOT NULL DEFAULT '[]',
  is_ending BOOLEAN NOT NULL DEFAULT false,
  ending_type TEXT CHECK (ending_type IN ('happy', 'neutral', 'sad') OR ending_type IS NULL),
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(story_id, page_id)
);

-- Enable RLS
ALTER TABLE public.admin_stories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_story_pages ENABLE ROW LEVEL SECURITY;

-- Policies for admin_stories
CREATE POLICY "Admins can manage stories"
ON public.admin_stories
FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Everyone can read published stories"
ON public.admin_stories
FOR SELECT
USING (is_published = true);

-- Policies for admin_story_pages
CREATE POLICY "Admins can manage story pages"
ON public.admin_story_pages
FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Everyone can read pages of published stories"
ON public.admin_story_pages
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.admin_stories 
    WHERE admin_stories.id = admin_story_pages.story_id 
    AND admin_stories.is_published = true
  )
);

-- Triggers for updated_at
CREATE TRIGGER update_admin_stories_updated_at
BEFORE UPDATE ON public.admin_stories
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_admin_story_pages_updated_at
BEFORE UPDATE ON public.admin_story_pages
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Index for faster lookups
CREATE INDEX idx_admin_stories_level ON public.admin_stories(level);
CREATE INDEX idx_admin_stories_subject ON public.admin_stories(subject_id);
CREATE INDEX idx_admin_story_pages_story ON public.admin_story_pages(story_id);