-- Allow authenticated users to view profiles of approved doctors
CREATE POLICY "Anyone can view approved doctor profiles"
ON public.profiles
FOR SELECT
USING (
  user_id IN (SELECT user_id FROM public.doctors WHERE is_approved = true)
);
