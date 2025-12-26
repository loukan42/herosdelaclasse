-- Create profiles table for children accounts
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  prenom TEXT NOT NULL,
  avatar TEXT DEFAULT 'default',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile"
ON public.profiles FOR SELECT
USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
ON public.profiles FOR UPDATE
USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
ON public.profiles FOR INSERT
WITH CHECK (auth.uid() = id);

-- Create story_progress table to save progress in stories
CREATE TABLE public.story_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  story_id TEXT NOT NULL,
  current_page_id TEXT NOT NULL,
  visited_pages JSONB DEFAULT '[]'::jsonb,
  prenom_histoire TEXT,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, story_id)
);

-- Enable RLS on story_progress
ALTER TABLE public.story_progress ENABLE ROW LEVEL SECURITY;

-- Story progress policies
CREATE POLICY "Users can view their own story progress"
ON public.story_progress FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own story progress"
ON public.story_progress FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own story progress"
ON public.story_progress FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own story progress"
ON public.story_progress FOR DELETE
USING (auth.uid() = user_id);

-- Create completed_stories table to track finished stories
CREATE TABLE public.completed_stories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  story_id TEXT NOT NULL,
  ending_type TEXT,
  completed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, story_id, completed_at)
);

-- Enable RLS on completed_stories
ALTER TABLE public.completed_stories ENABLE ROW LEVEL SECURITY;

-- Completed stories policies
CREATE POLICY "Users can view their own completed stories"
ON public.completed_stories FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own completed stories"
ON public.completed_stories FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_story_progress_updated_at
BEFORE UPDATE ON public.story_progress
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, prenom, avatar)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'prenom', 'Aventurier'),
    COALESCE(NEW.raw_user_meta_data ->> 'avatar', 'default')
  );
  RETURN NEW;
END;
$$;

-- Trigger to create profile on signup
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();