-- Create table for user points
CREATE TABLE public.user_points (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  points INTEGER NOT NULL DEFAULT 0,
  last_spin_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Create table for collection themes
CREATE TABLE public.collection_themes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for collection cards
CREATE TABLE public.collection_cards (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  theme_id UUID NOT NULL REFERENCES public.collection_themes(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  image_url TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for unlocked cards (per user)
CREATE TABLE public.unlocked_cards (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  card_id UUID NOT NULL REFERENCES public.collection_cards(id) ON DELETE CASCADE,
  unlocked_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, card_id)
);

-- Enable RLS on all tables
ALTER TABLE public.user_points ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.collection_themes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.collection_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.unlocked_cards ENABLE ROW LEVEL SECURITY;

-- RLS policies for user_points
CREATE POLICY "Users can view their own points" ON public.user_points
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own points" ON public.user_points
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own points" ON public.user_points
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all points" ON public.user_points
  FOR SELECT USING (has_role(auth.uid(), 'admin'));

-- RLS policies for collection_themes (everyone can read, admins can manage)
CREATE POLICY "Everyone can view themes" ON public.collection_themes
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage themes" ON public.collection_themes
  FOR ALL USING (has_role(auth.uid(), 'admin'));

-- RLS policies for collection_cards (everyone can read, admins can manage)
CREATE POLICY "Everyone can view cards" ON public.collection_cards
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage cards" ON public.collection_cards
  FOR ALL USING (has_role(auth.uid(), 'admin'));

-- RLS policies for unlocked_cards
CREATE POLICY "Users can view their own unlocked cards" ON public.unlocked_cards
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own unlocked cards" ON public.unlocked_cards
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all unlocked cards" ON public.unlocked_cards
  FOR SELECT USING (has_role(auth.uid(), 'admin'));

-- Create storage bucket for card images
INSERT INTO storage.buckets (id, name, public)
VALUES ('collection-cards', 'collection-cards', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for collection-cards bucket
CREATE POLICY "Anyone can view collection card images"
ON storage.objects FOR SELECT
USING (bucket_id = 'collection-cards');

CREATE POLICY "Admins can upload collection card images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'collection-cards' AND has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update collection card images"
ON storage.objects FOR UPDATE
USING (bucket_id = 'collection-cards' AND has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete collection card images"
ON storage.objects FOR DELETE
USING (bucket_id = 'collection-cards' AND has_role(auth.uid(), 'admin'));

-- Trigger for updated_at
CREATE TRIGGER update_user_points_updated_at
  BEFORE UPDATE ON public.user_points
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_collection_themes_updated_at
  BEFORE UPDATE ON public.collection_themes
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_collection_cards_updated_at
  BEFORE UPDATE ON public.collection_cards
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();