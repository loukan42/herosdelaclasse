-- Table pour stocker les textes personnalisés des pages d'histoires
CREATE TABLE public.story_page_overrides (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  story_id TEXT NOT NULL,
  page_id TEXT NOT NULL,
  text TEXT NOT NULL,
  text_masculine TEXT,
  text_feminine TEXT,
  updated_by UUID REFERENCES auth.users(id),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(story_id, page_id)
);

-- Enable RLS
ALTER TABLE public.story_page_overrides ENABLE ROW LEVEL SECURITY;

-- Admins can manage overrides
CREATE POLICY "Admins can manage story overrides"
ON public.story_page_overrides
FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- Everyone can read overrides (for displaying stories)
CREATE POLICY "Everyone can read story overrides"
ON public.story_page_overrides
FOR SELECT
USING (true);

-- Trigger for updated_at
CREATE TRIGGER update_story_page_overrides_updated_at
BEFORE UPDATE ON public.story_page_overrides
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();