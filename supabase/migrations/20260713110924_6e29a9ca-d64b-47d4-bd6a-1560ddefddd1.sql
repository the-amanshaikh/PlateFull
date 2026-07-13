
CREATE POLICY "Donation images public read" ON storage.objects
  FOR SELECT USING (bucket_id = 'donation-images');
CREATE POLICY "Authenticated upload donation images" ON storage.objects
  FOR INSERT TO authenticated WITH CHECK (bucket_id = 'donation-images');
CREATE POLICY "Owner update donation images" ON storage.objects
  FOR UPDATE TO authenticated USING (bucket_id = 'donation-images' AND owner = auth.uid());
CREATE POLICY "Owner delete donation images" ON storage.objects
  FOR DELETE TO authenticated USING (bucket_id = 'donation-images' AND owner = auth.uid());
