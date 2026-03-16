
-- Add file_url to prescriptions for document attachments
ALTER TABLE public.prescriptions ADD COLUMN IF NOT EXISTS file_url text;

-- Create prescription-documents storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('prescription-documents', 'prescription-documents', true)
ON CONFLICT (id) DO NOTHING;

-- Allow doctors to upload prescription documents
CREATE POLICY "Doctors can upload prescription docs"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'prescription-documents'
  AND (SELECT public.has_role(auth.uid(), 'doctor'))
);

-- Allow admins to upload prescription documents
CREATE POLICY "Admins can upload prescription docs"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'prescription-documents'
  AND (SELECT public.has_role(auth.uid(), 'admin'))
);

-- Allow authenticated users to read prescription documents
CREATE POLICY "Authenticated can read prescription docs"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'prescription-documents');
