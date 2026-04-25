-- Add profile fields to public.users so we can build a profile for each
-- parent/student and a richer (but still lightweight) one for tutors.
ALTER TABLE public.users
  ADD COLUMN IF NOT EXISTS full_name TEXT,
  ADD COLUMN IF NOT EXISTS phone TEXT,
  ADD COLUMN IF NOT EXISTS city TEXT,
  ADD COLUMN IF NOT EXISTS grade_level TEXT,
  ADD COLUMN IF NOT EXISTS subjects TEXT[],
  ADD COLUMN IF NOT EXISTS hourly_rate NUMERIC(10, 2),
  ADD COLUMN IF NOT EXISTS years_experience INTEGER,
  ADD COLUMN IF NOT EXISTS bio TEXT;
