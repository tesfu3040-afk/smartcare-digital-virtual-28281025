
-- Make payment-screenshots bucket public so admin can view images
UPDATE storage.buckets SET public = true WHERE id = 'payment-screenshots';

-- Add a public SELECT policy for payment-screenshots
CREATE POLICY "Anyone can view payment screenshots"
ON storage.objects FOR SELECT
USING (bucket_id = 'payment-screenshots');
