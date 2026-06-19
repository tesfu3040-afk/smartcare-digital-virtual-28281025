ALTER TABLE public.appointments ADD COLUMN IF NOT EXISTS consultation_code_expires_at TIMESTAMP WITH TIME ZONE;

UPDATE public.appointments SET consultation_code_expires_at = created_at + INTERVAL '2 weeks' WHERE consultation_code IS NOT NULL AND consultation_code_expires_at IS NULL;