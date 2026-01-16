-- Añadir columna para guardar los servicios extra seleccionados
-- Se guardará como un JSON, ej: [{"id": "surf", "name": "Kit de Surf", "price": 20}]

ALTER TABLE public.bookings 
ADD COLUMN IF NOT EXISTS selected_extras jsonb DEFAULT '[]'::jsonb;

-- Comentario para documentación
COMMENT ON COLUMN public.bookings.selected_extras IS 'Lista de servicios extra seleccionados por el cliente (JSON)';
