-- TABLA DE PERFILES (Vinculada a auth.users de Supabase)
create table public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone,
  full_name text,
  email text,
  phone_number text,
  avatar_url text
);

-- Habilitar RLS en profiles
alter table public.profiles enable row level security;

-- Política: Cada uno puede ver y editar SOLO su propio perfil
create policy "Public profiles are viewable by everyone" on profiles
  for select using (true); -- O limitar a (auth.uid() = id) si queremos privacidad total

create policy "Users can insert their own profile" on profiles
  for insert with check (auth.uid() = id);

create policy "Users can update own profile" on profiles
  for update using (auth.uid() = id);

-- TRIGGER: Crear perfil automáticamente al registrarse un usuario
create function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, email, phone_number, avatar_url)
  values (
    new.id, 
    new.raw_user_meta_data->>'full_name', 
    new.email, 
    new.raw_user_meta_data->>'phone_number',
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- TABLA DE RESERVAS
create table public.bookings (
  id uuid not null default gen_random_uuid (),
  created_at timestamp with time zone not null default now(),
  start_date date not null,
  end_date date not null,
  status text not null default 'pending', -- pending, confirmed, cancelled, paid
  total_price numeric not null,
  
  -- Vinculación con usuario
  user_id uuid references public.profiles(id) on delete set null,
  
  -- Datos duplicados por si se borra el usuario o para facilitar facturación
  customer_name text not null,
  customer_email text not null,
  customer_phone text,
  
  payment_intent_id text, -- Stripe ID
  
  constraint bookings_pkey primary key (id)
);

-- Habilitar RLS en bookings
alter table public.bookings enable row level security;

-- Políticas de Reservas
-- 1. Cualquiera puede ver las fechas ocupadas (para el calendario)
create policy "Anyone can view bookings" on bookings
  for select using (true);

-- 2. Solo usuarios autenticados pueden crear reservas
create policy "Authenticated users can create bookings" on bookings
  for insert with check (auth.uid() = user_id);

-- 3. Usuarios pueden ver/editar SUS propias reservas
create policy "Users can update own bookings" on bookings
  for update using (auth.uid() = user_id);

