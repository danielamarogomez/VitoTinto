import { createAdminClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { format, parseISO } from 'date-fns'
import { es } from 'date-fns/locale'
import {
    ChevronLeft,
    Calendar,
    Mail,
    Phone,
    CheckCircle2,
    Clock,
    XCircle,
} from 'lucide-react'
import Link from 'next/link'

export default async function UserDetailPage({ params }: { params: { id: string } }) {
    const supabase = await createAdminClient()
    const { id } = await params

    // 1. Obtener perfil del cliente
    const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', id)
        .single()

    if (!profile) {
        notFound()
    }

    // 2. Obtener datos reales de autenticación (Admin) para asegurar el email
    const { data: { user: authUser } } = await supabase.auth.admin.getUserById(id)
    const realEmail = authUser?.email || profile.email

    // 3. Obtener historial de reservas (Por ID o por Email)
    let query = supabase
        .from('bookings')
        .select('*')
        .order('start_date', { ascending: false })

    if (realEmail) {
        // Si tenemos email, buscamos por ID o Email
        query = query.or(`user_id.eq.${id},customer_email.eq.${realEmail}`)
    } else {
        // Si no hay email, solo por ID
        query = query.eq('user_id', id)
    }

    const { data: bookings } = await query

    // Fallback para email
    const displayEmail = realEmail || (bookings?.[0]?.customer_email || 'Email no sincronizado')

    // Fallback para fecha de registro
    const memberSince = profile.created_at
        ? new Date(profile.created_at)
        : (bookings?.length ? parseISO(bookings[bookings.length - 1].created_at || bookings[bookings.length - 1].start_date) : new Date())

    const totalSpent = bookings
        ?.filter(b => b.status === 'confirmed' || b.status === 'paid')
        .reduce((acc, curr) => acc + (curr.total_price || 0), 0) || 0

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header / Back Button */}
            <div className="flex items-center gap-4">
                <Link
                    href="/admin/users"
                    className="p-2 hover:bg-muted rounded-xl transition-all text-muted-foreground hover:text-foreground"
                >
                    <ChevronLeft className="h-6 w-6" />
                </Link>
                <div>
                    <h1 className="text-3xl font-black text-foreground tracking-tight">Historial de Cliente</h1>
                    <p className="text-muted-foreground">Detalles y actividad de {profile.full_name || 'Usuario'}</p>
                </div>
            </div>

            <div className="flex justify-center">
                {/* Profile Card */}
                <div className="w-full max-w-2xl space-y-6">
                    <div className="bg-card border border-border rounded-3xl p-8 shadow-sm">
                        <div className="flex flex-col items-center text-center space-y-4">
                            <div className="h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center text-primary font-black text-3xl border-4 border-background shadow-xl">
                                {profile.full_name?.charAt(0) || displayEmail?.charAt(0) || '?'}
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-foreground">{profile.full_name || 'Sin nombre'}</h2>
                                <p className="text-sm text-muted-foreground">{displayEmail}</p>
                            </div>
                        </div>

                        <div className="mt-8 space-y-4">
                            <div className="flex items-center gap-3 text-sm text-muted-foreground">
                                <div className="p-2 bg-muted rounded-lg">
                                    <Mail className="h-4 w-4" />
                                </div>
                                <span>{displayEmail}</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm text-muted-foreground">
                                <div className="p-2 bg-muted rounded-lg">
                                    <Phone className="h-4 w-4" />
                                </div>
                                <span>{profile.phone_number || 'No proporcionado'}</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm text-muted-foreground">
                                <div className="p-2 bg-muted rounded-lg">
                                    <Calendar className="h-4 w-4" />
                                </div>
                                <span>Miembro desde {format(memberSince, 'MMMM yyyy', { locale: es })}</span>
                            </div>
                        </div>

                        <div className="mt-8 pt-8 border-t border-border flex justify-between items-center">
                            <div className="text-center flex-1 border-r border-border">
                                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Viajes</p>
                                <p className="text-2xl font-black text-foreground">{bookings?.length || 0}</p>
                            </div>
                            <div className="text-center flex-1">
                                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Invertido</p>
                                <p className="text-2xl font-black text-primary">{totalSpent}€</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
