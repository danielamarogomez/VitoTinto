import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { format, parseISO } from 'date-fns'
import { es } from 'date-fns/locale'
import {
    ChevronLeft,
    Calendar,
    Mail,
    Phone,
    MapPin,
    CheckCircle2,
    Clock,
    XCircle,
    Euro
} from 'lucide-react'
import Link from 'next/link'

export default async function UserDetailPage({ params }: { params: { id: string } }) {
    const supabase = await createClient()
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

    // 2. Obtener historial de reservas
    const { data: bookings } = await supabase
        .from('bookings')
        .select('*')
        .eq('user_id', id)
        .order('start_date', { ascending: false })

    // Fallback para email si no está en el perfil o está vacío
    const displayEmail = (profile.email && profile.email.length > 5)
        ? profile.email
        : (bookings?.[0]?.customer_email || 'Email no sincronizado')

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

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Profile Card */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-card border border-border rounded-3xl p-8 shadow-sm">
                        <div className="flex flex-col items-center text-center space-y-4">
                            <div className="h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center text-primary font-black text-3xl border-4 border-background shadow-xl">
                                {profile.full_name?.charAt(0) || profile.email?.charAt(0)}
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

                {/* Bookings List */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold flex items-center gap-2">
                            <Calendar className="h-5 w-5 text-primary" />
                            Historial de Reservas
                        </h2>
                    </div>

                    <div className="bg-card border border-border rounded-3xl overflow-hidden shadow-xl">
                        {!bookings || bookings.length === 0 ? (
                            <div className="py-20 text-center text-muted-foreground italic">
                                Este cliente aún no ha realizado ninguna reserva.
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-muted/50 border-b border-border">
                                            <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Periodo</th>
                                            <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Noches</th>
                                            <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground text-center">Estado</th>
                                            <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground text-right">Monto</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {bookings.map((booking) => {
                                            const start = parseISO(booking.start_date)
                                            const end = parseISO(booking.end_date)
                                            const nights = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))

                                            return (
                                                <tr key={booking.id} className="border-b border-border last:border-0 hover:bg-accent/30 transition-colors">
                                                    <td className="px-6 py-5">
                                                        <div className="flex items-center gap-2 text-sm font-medium">
                                                            <Calendar className="h-4 w-4 text-primary/60" />
                                                            <span>{format(start, "d 'de' MMM", { locale: es })}</span>
                                                            <span className="text-muted-foreground">→</span>
                                                            <span>{format(end, "d 'de' MMM", { locale: es })}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-5 text-sm font-medium text-muted-foreground">
                                                        {nights} noches
                                                    </td>
                                                    <td className="px-6 py-5 text-center">
                                                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${booking.status === 'confirmed'
                                                            ? 'bg-green-100 text-green-700'
                                                            : booking.status === 'cancelled'
                                                                ? 'bg-red-100 text-red-700'
                                                                : 'bg-yellow-100 text-yellow-700'
                                                            }`}>
                                                            {booking.status === 'confirmed' && <CheckCircle2 className="h-3 w-3" />}
                                                            {booking.status === 'pending' && <Clock className="h-3 w-3" />}
                                                            {booking.status === 'cancelled' && <XCircle className="h-3 w-3" />}
                                                            {booking.status === 'confirmed' ? 'Confirmado' :
                                                                booking.status === 'cancelled' ? 'Cancelado' : 'Pendiente'}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-5 text-right font-black text-primary">
                                                        {booking.total_price}€
                                                    </td>
                                                </tr>
                                            )
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
