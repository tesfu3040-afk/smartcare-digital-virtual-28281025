
-- Create payments table for tracking patient payment screenshots and doctor confirmations
CREATE TABLE public.payments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  appointment_id UUID REFERENCES public.appointments(id) ON DELETE CASCADE NOT NULL,
  patient_id UUID NOT NULL,
  doctor_id UUID NOT NULL,
  amount NUMERIC NOT NULL DEFAULT 0,
  screenshot_url TEXT,
  status TEXT NOT NULL DEFAULT 'pending_upload',
  doctor_confirmed BOOLEAN NOT NULL DEFAULT false,
  admin_verified BOOLEAN NOT NULL DEFAULT false,
  admin_notes TEXT DEFAULT '',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- RLS policies
CREATE POLICY "Patients can view own payments" ON public.payments
FOR SELECT USING (auth.uid() = patient_id);

CREATE POLICY "Patients can insert own payments" ON public.payments
FOR INSERT WITH CHECK (auth.uid() = patient_id);

CREATE POLICY "Patients can update own payments" ON public.payments
FOR UPDATE USING (auth.uid() = patient_id);

CREATE POLICY "Doctors can view own payments" ON public.payments
FOR SELECT USING (auth.uid() = doctor_id);

CREATE POLICY "Doctors can update own payments" ON public.payments
FOR UPDATE USING (auth.uid() = doctor_id);

CREATE POLICY "Admins can view all payments" ON public.payments
FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update all payments" ON public.payments
FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert payments" ON public.payments
FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Trigger for updated_at
CREATE TRIGGER update_payments_updated_at
BEFORE UPDATE ON public.payments
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create storage bucket for payment screenshots
INSERT INTO storage.buckets (id, name, public) VALUES ('payment-screenshots', 'payment-screenshots', false);

-- Storage policies for payment screenshots
CREATE POLICY "Patients can upload payment screenshots"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'payment-screenshots' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can view own payment screenshots"
ON storage.objects FOR SELECT
USING (bucket_id = 'payment-screenshots' AND (
  auth.uid()::text = (storage.foldername(name))[1]
  OR public.has_role(auth.uid(), 'admin')
  OR public.has_role(auth.uid(), 'doctor')
));
