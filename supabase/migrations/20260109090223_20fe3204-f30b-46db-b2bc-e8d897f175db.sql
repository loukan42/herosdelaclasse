-- Allow users to delete their own unlocked cards (for collection reset)
CREATE POLICY "Users can delete their own unlocked cards"
ON public.unlocked_cards
FOR DELETE
USING (auth.uid() = user_id);