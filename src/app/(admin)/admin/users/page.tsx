import { createClient, createAdminClient } from '@/lib/supabase/server'
import { format, parseISO } from 'date-fns'
import { es } from 'date-fns/locale'
import {
    User,
    Mail,
    Phone,
    Calendar,
    ChevronRight,
    Search,
    Shield
} from 'lucide-react'
import Link from 'next/link'

export default async function AdminUsersPage() {
    // Usamos el cliente admin para asegurar que vemos todo
    const supabase = await createAdminClient()

    // 1. Obtener perfiles
    const { data: profiles } = await supabase
        .from('profiles')
        .select('*')
        .order('id', { ascending: false })

    // 2. Obtener todas las reservas para rescatar emails y fechas de registro de usuarios antiguos
    const { data: allBookings } = await supabase
        .from('bookings')
        .select('user_id, customer_email, created_at, start_date')
        .not('user_id', 'is', null)

    // 3. Procesar perfiles con datos rescatados, EXCLUYENDO al administrador
    const processedProfiles = profiles
        ?.filter(profile => profile.email !== process.env.OWNER_EMAIL)
        ?.map(profile => {
            const userBookings = allBookings?.filter(b => b.user_id === profile.id) || []

            // Rescatar email si no está en el perfil
            const rescuedEmail = profile.email || userBookings[0]?.customer_email || 'Email no disponible'

            // Rescatar fecha de registro (o primera actividad)
            const rescuedDate = profile.created_at
                ? new Date(profile.created_at)
                : (userBookings.length > 0
                    ? parseISO(userBookings[userBookings.length - 1].created_at || userBookings[userBookings.length - 1].start_date)
                    : new Date())

            return {
                ...profile,
                displayEmail: rescuedEmail,
                displayDate: rescuedDate
            }
        })

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <header>
                <h1 className="text-3xl font-black text-foreground tracking-tight">Clientes</h1>
                <p className="text-muted-foreground">Listado de usuarios registrados en la plataforma.</p>
            </header>

            <div className="bg-card border border-border rounded-xl p-4 relative">
                <Search className="absolute left-7 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <input
                    type="text"
                    placeholder="Buscar cliente por nombre o email..."
                    className="w-full bg-muted/30 border border-border rounded-xl pl-12 pr-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {processedProfiles?.map((profile) => (
                    <div key={profile.id} className="bg-card border border-border rounded-2xl p-6 shadow-sm hover:shadow-md transition-all group overflow-hidden relative">
                        {profile.email === process.env.OWNER_EMAIL && (
                            <div className="absolute top-0 right-0 bg-primary/10 text-primary p-2 rounded-bl-xl">
                                <Shield className="h-4 w-4" />
                            </div>
                        )}

                        <div className="flex items-center gap-4 mb-6">
                            <div className="h-14 w-14 rounded-full bg-primary/5 flex items-center justify-center text-primary font-black text-xl border border-primary/10">
                                {profile.full_name?.charAt(0) || profile.displayEmail?.charAt(0) || '?'}
                            </div>
                            <div>
                                <h3 className="font-bold text-foreground truncate max-w-[150px]">{profile.full_name || 'Sin nombre'}</h3>
                                <p className="text-xs text-muted-foreground flex items-center gap-1">
                                    <Mail className="h-3 w-3" />
                                    {profile.displayEmail}
                                </p>
                                {profile.phone_number && (
                                    <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                                        <Phone className="h-3 w-3" />
                                        {profile.phone_number}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="space-y-3 pt-4 border-t border-border/50">
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-muted-foreground flex items-center gap-1.5">
                                    <Calendar className="h-4 w-4" />
                                    Registro:
                                </span>
                                <span className="font-medium">
                                    {format(profile.displayDate, 'd MMM yyyy', { locale: es })}
                                </span>
                            </div>
                        </div>

                        <Link
                            href={`/admin/users/${profile.id}`}
                            className="w-full mt-6 bg-muted hover:bg-primary/10 hover:text-primary py-2.5 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 group-hover:bg-primary group-hover:text-primary-foreground"
                        >
                            Ver historial de viajes
                            <ChevronRight className="h-4 w-4" />
                        </Link>
                    </div>
                ))}

                {(!processedProfiles || processedProfiles.length === 0) && (
                    <div className="col-span-full py-20 text-center bg-muted/20 border-2 border-dashed border-border rounded-3xl">
                        <User className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                        <h3 className="text-xl font-bold italic text-muted-foreground">Aún no hay clientes registrados.</h3>
                    </div>
                )}
            </div>
        </div>
    )
}
