-- Enable storage for species-images
-- Note: It is assumed the bucket 'species-images' was created manually in the UI as a Public bucket.

-- Allow public read access to the species-images bucket
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'species-images' );

-- Allow authenticated users to upload files to species-images
CREATE POLICY "Authenticated users can upload images"
ON storage.objects FOR INSERT
WITH CHECK ( bucket_id = 'species-images' AND auth.role() = 'authenticated' );

-- Allow authenticated users to update their own uploads (optional, but good for admin)
CREATE POLICY "Authenticated users can update images"
ON storage.objects FOR UPDATE
WITH CHECK ( bucket_id = 'species-images' AND auth.role() = 'authenticated' );

-- Allow authenticated users to delete images
CREATE POLICY "Authenticated users can delete images"
ON storage.objects FOR DELETE
USING ( bucket_id = 'species-images' AND auth.role() = 'authenticated' );

-- Also, ensure authenticated users can insert into the `species` table.
-- Earlier we only allowed read access to everyone for `species`.
CREATE POLICY "Authenticated users can insert species"
ON public.species FOR INSERT
WITH CHECK ( auth.role() = 'authenticated' );
