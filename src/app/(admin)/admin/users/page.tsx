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
    const authUserIds = new Set(authUsers?.map(u => u.id) || [])
    const authEmails = new Set(authUsers?.map(u => u.email?.toLowerCase()).filter(Boolean))

    // Perfiles de usuarios registrados
    const initialProfiles = authUsers
        ?.filter(user => user.email !== process.env.OWNER_EMAIL)
        ?.map(user => {
            const profile = profiles?.find(p => p.id === user.id)
            const userBookings = allBookings?.filter(b =>
                b.user_id === user.id ||
                (b.customer_email && b.customer_email.toLowerCase() === user.email?.toLowerCase())
            ) || []

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

    // Añadir "Huemlientes" (clientes invitados que solo están en bookings)
    const guestCustomersMap = new Map<string, any>()

    allBookings?.forEach(booking => {
        const email = booking.customer_email?.toLowerCase()
        if (email && !authEmails.has(email) && email !== process.env.OWNER_EMAIL?.toLowerCase()) {
            if (!guestCustomersMap.has(email)) {
                guestCustomersMap.set(email, {
                    id: `guest-${email}`,
                    full_name: booking.customer_name || 'Cliente Invitado',
                    email: email,
                    phone_number: booking.customer_phone || null,
                    created_at: booking.created_at,
                    displayEmail: email,
                    displayDate: parseISO(booking.created_at),
                    bookings_count: 0
                })
            }
            guestCustomersMap.get(email).bookings_count += 1
        }
    })

    const guestProfiles = Array.from(guestCustomersMap.values())
    const processedProfiles = [...initialProfiles, ...guestProfiles].sort((a, b) =>
        b.displayDate.getTime() - a.displayDate.getTime()
    )

    return (
        <div className="animate-in fade-in duration-500">
            <UsersListClient profiles={processedProfiles} ownerEmail={process.env.OWNER_EMAIL} />
        </div>
    )
}
