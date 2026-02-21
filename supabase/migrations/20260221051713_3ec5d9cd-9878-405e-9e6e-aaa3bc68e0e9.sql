-- Create a public bucket for doctor photos
INSERT INTO storage.buckets (id, name, public) VALUES ('doctor-photos', 'doctor-photos', true)
ON CONFLICT (id) DO NOTHING;

-- Allow anyone to view doctor photos
CREATE POLICY "Public can view doctor photos"
ON storage.objects FOR SELECT
USING (bucket_id = 'doctor-photos');

-- Allow admins to upload doctor photos
CREATE POLICY "Admins can upload doctor photos"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'doctor-photos' AND public.has_role(auth.uid(), 'admin'::app_role));

-- Allow admins to update doctor photos
CREATE POLICY "Admins can update doctor photos"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'doctor-photos' AND public.has_role(auth.uid(), 'admin'::app_role));

-- Allow admins to delete doctor photos
CREATE POLICY "Admins can delete doctor photos"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'doctor-photos' AND public.has_role(auth.uid(), 'admin'::app_role));