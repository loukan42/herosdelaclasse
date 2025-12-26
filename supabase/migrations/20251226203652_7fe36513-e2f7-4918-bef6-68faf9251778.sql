-- Create storage bucket for story images
INSERT INTO storage.buckets (id, name, public)
VALUES ('story-images', 'story-images', true)
ON CONFLICT (id) DO NOTHING;

-- Allow anyone to view story images (public bucket)
CREATE POLICY "Story images are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'story-images');

-- Allow authenticated admins to upload story images
CREATE POLICY "Admins can upload story images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'story-images' 
  AND EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() 
    AND role = 'admin'
  )
);

-- Allow authenticated admins to update story images
CREATE POLICY "Admins can update story images"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'story-images' 
  AND EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() 
    AND role = 'admin'
  )
);

-- Allow authenticated admins to delete story images
CREATE POLICY "Admins can delete story images"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'story-images' 
  AND EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() 
    AND role = 'admin'
  )
);