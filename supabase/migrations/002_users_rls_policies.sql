-- Allow users to insert their own profile during signup
CREATE POLICY "Allow individual insert"
ON public.users
FOR INSERT
WITH CHECK (auth.uid() = id);

-- Allow users to view their own profile
CREATE POLICY "Allow individual select"
ON public.users
FOR SELECT
USING (auth.uid() = id);
