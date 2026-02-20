
-- 1. App settings table (key-value store for admin-editable settings)
CREATE TABLE public.app_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text UNIQUE NOT NULL,
  value text NOT NULL DEFAULT '',
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.app_settings ENABLE ROW LEVEL SECURITY;

-- Anyone can read settings (public info like bank account, phone, email)
CREATE POLICY "Anyone can read settings"
ON public.app_settings FOR SELECT
TO authenticated
USING (true);

-- Only admins can manage settings
CREATE POLICY "Admins can insert settings"
ON public.app_settings FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update settings"
ON public.app_settings FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Seed default settings
INSERT INTO public.app_settings (key, value) VALUES
  ('bank_account_number', ''),
  ('bank_name', ''),
  ('payment_instructions', 'Please transfer the consultation fee to the bank account below and upload your payment receipt.'),
  ('emergency_phone', '1-800-123-4567'),
  ('contact_phone', '1-800-123-4567'),
  ('contact_email', 'support@smartcare.com');

-- 2. Contact messages table
CREATE TABLE public.contact_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  subject text NOT NULL,
  message text NOT NULL,
  is_read boolean NOT NULL DEFAULT false,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

-- Anyone authenticated or anonymous can insert contact messages
CREATE POLICY "Anyone can send contact messages"
ON public.contact_messages FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Only admins can view/update contact messages
CREATE POLICY "Admins can view contact messages"
ON public.contact_messages FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update contact messages"
ON public.contact_messages FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete contact messages"
ON public.contact_messages FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- 3. Add photo_url to doctors table
ALTER TABLE public.doctors ADD COLUMN IF NOT EXISTS photo_url text;

-- 4. Fix: Allow admins to insert doctors
CREATE POLICY "Admins can insert doctors"
ON public.doctors FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- 5. Allow anon users to read settings (for Contact page without login)
CREATE POLICY "Anon can read settings"
ON public.app_settings FOR SELECT
TO anon
USING (true);
