-- Create storage bucket for meal videos
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'meal-videos',
    'meal-videos',
    true,
    52428800, -- 50MB limit
    ARRAY['video/mp4', 'video/quicktime', 'video/x-msvideo', 'video/webm']
);

-- Storage policies for meal videos bucket
CREATE POLICY "Anyone can view meal videos" ON storage.objects
    FOR SELECT USING (bucket_id = 'meal-videos');

CREATE POLICY "Restaurants can upload meal videos" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id = 'meal-videos' AND
        auth.role() = 'authenticated' AND
        EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND user_type = 'restaurant')
    );

CREATE POLICY "Restaurants can update their meal videos" ON storage.objects
    FOR UPDATE USING (
        bucket_id = 'meal-videos' AND
        auth.uid()::text = (storage.foldername(name))[1] AND
        EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND user_type = 'restaurant')
    );

CREATE POLICY "Restaurants can delete their meal videos" ON storage.objects
    FOR DELETE USING (
        bucket_id = 'meal-videos' AND
        auth.uid()::text = (storage.foldername(name))[1] AND
        EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND user_type = 'restaurant')
    );