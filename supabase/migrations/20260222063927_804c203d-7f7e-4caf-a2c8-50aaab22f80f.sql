
-- Add consultation_code and consultation_code_used to appointments
ALTER TABLE public.appointments 
ADD COLUMN consultation_code TEXT UNIQUE DEFAULT NULL,
ADD COLUMN consultation_code_used BOOLEAN NOT NULL DEFAULT false;

-- Create index for fast lookup
CREATE INDEX idx_appointments_consultation_code ON public.appointments(consultation_code) WHERE consultation_code IS NOT NULL;
