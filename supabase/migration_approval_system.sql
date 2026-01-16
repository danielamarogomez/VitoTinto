-- MIGRACIÓN: Añadir campos para sistema de aprobación de reservas
-- Ejecutar esto en Supabase SQL Editor

-- 1. Añadir campo para mensaje del cliente
ALTER TABLE public.bookings 
ADD COLUMN IF NOT EXISTS customer_message text;

-- 2. Añadir campo para link de pago único
ALTER TABLE public.bookings 
ADD COLUMN IF NOT EXISTS payment_link text;

-- 3. Añadir campo para fecha de aprobación
ALTER TABLE public.bookings 
ADD COLUMN IF NOT EXISTS approved_at timestamp with time zone;

-- 4. Añadir campo para quién aprobó (admin)
ALTER TABLE public.bookings 
ADD COLUMN IF NOT EXISTS approved_by uuid references auth.users(id);

-- 5. Actualizar comentario del campo status para incluir nuevo estado
COMMENT ON COLUMN public.bookings.status IS 'Estados posibles: pending_approval, pending, confirmed, cancelled, paid, blocked';

-- NOTA: Los estados ahora son:
-- - pending_approval: Cliente solicitó, esperando aprobación de Andrea
-- - pending: Andrea aprobó, esperando pago del cliente  
-- - paid: Cliente pagó
-- - confirmed: Reserva confirmada y activa
-- - cancelled: Reserva cancelada
-- - blocked: Fechas bloqueadas por el admin (no son reservas reales)
