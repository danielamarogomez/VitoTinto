-- Add preferred_language column to bookings table
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS preferred_language TEXT DEFAULT 'es';
