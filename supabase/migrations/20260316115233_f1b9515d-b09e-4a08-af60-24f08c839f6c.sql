
-- Allow anonymous users to view approved doctors
CREATE POLICY "Anon can view approved doctors"
ON public.doctors FOR SELECT
TO anon
USING (is_approved = true);

-- Allow anonymous users to view profiles of approved doctors
CREATE POLICY "Anon can view approved doctor profiles"
ON public.profiles FOR SELECT
TO anon
USING (user_id IN (SELECT user_id FROM doctors WHERE is_approved = true));
