import { createAdminClient } from '@/lib/supabase/server'
import { parseISO } from 'date-fns'
import UsersListClient from '@/components/admin/UsersListClient'

export default async function AdminUsersPage() {
    const supabase = await createAdminClient()

    // 1. Obtener usuarios de Auth (Fuente de verdad para emails)
    const { data: { users: authUsers }, error: authError } = await supabase.auth.admin.listUsers({
        perPage: 1000
    })

    // 2. Obtener perfiles (Datos extra: nombres, teléfonos, avatares)
    const { data: profiles } = await supabase
        .from('profiles')
        .select('*')

    // 3. Obtener TODAS las reservas para cruzar datos
    const { data: allBookings } = await supabase
        .from('bookings')
        .select('*')
        .order('start_date', { ascending: false })

    // 4. Combinar datos: Auth User + Profile + Bookings
    const processedProfiles = authUsers
        ?.filter(user => user.email !== process.env.OWNER_EMAIL)
        ?.map(user => {
            const profile = profiles?.find(p => p.id === user.id)

            // Buscar reservas por ID de usuario O por email
            const userBookings = allBookings?.filter(b =>
                b.user_id === user.id ||
                (b.customer_email && b.customer_email.toLowerCase() === user.email?.toLowerCase())
            ) || []

            // Determinar fecha de visualización (creación de cuenta o primera reserva)
            const firstActivityDate = user.created_at
                ? new Date(user.created_at)
                : (userBookings.length > 0
                    ? parseISO(userBookings[userBookings.length - 1].created_at)
                    : new Date())

            return {
                id: user.id,
                full_name: (profile?.full_name || user.user_metadata?.full_name || 'Usuario') as string,
                email: (user.email || null) as string | null,
                phone_number: (profile?.phone_number || user.user_metadata?.phone_number || null) as string | null,
                created_at: user.created_at,
                displayEmail: (user.email || 'Email no disponible') as string,
                displayDate: firstActivityDate,
                bookings_count: userBookings.length
            }
        }) || []

    return (
        <div className="animate-in fade-in duration-500">
            <UsersListClient profiles={processedProfiles} ownerEmail={process.env.OWNER_EMAIL} />
        </div>
    )
}
