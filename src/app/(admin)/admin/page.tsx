import { createClient } from '@/lib/supabase/server'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import {
    Users,
    CalendarCheck,
    Euro,
    TrendingUp,
    Clock,
    CheckCircle2,
    ChevronRight,
    Search
} from 'lucide-react'
import Link from 'next/link'
import OccupancyCalendar from '@/components/admin/OccupancyCalendar'

export default async function AdminDashboard() {
    const supabase = await createClient()

    // 1. Obtener todas las reservas
    const { data: bookings } = await supabase
        .from('bookings')
        .select('*')
        .order('created_at', { ascending: false })

    // 2. Calcular estadísticas
    const confirmedBookings = bookings?.filter(b => b.status === 'confirmed') || []
    const totalRevenue = confirmedBookings.reduce((acc, b) => acc + (b.total_price || 0), 0)
    const pendingBookings = bookings?.filter(b => b.status === 'pending') || []

    // 3. Obtener número de clientes
    const { count: userCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div>
                <h1 className="text-3xl font-black text-foreground tracking-tight">Dashboard</h1>
                <p className="text-muted-foreground">Resumen global de tu negocio Vito Tinto.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Ingresos Totales"
                    value={`${totalRevenue}€`}
                    icon={<Euro className="h-6 w-6" />}
                    trend="+12%"
                    trendUp={true}
                />
                <StatCard
                    title="Reservas Confirmadas"
                    value={confirmedBookings.length.toString()}
                    icon={<CalendarCheck className="h-6 w-6" />}
                    trend="+5"
                    trendUp={true}
                />
                <StatCard
                    title="Pendientes de Pago"
                    value={pendingBookings.length.toString()}
                    icon={<Clock className="h-6 w-6" />}
                    color="text-yellow-600"
                />
                <StatCard
                    title="Clientes Registrados"
                    value={(userCount || 0).toString()}
                    icon={<Users className="h-6 w-6" />}
                />
            </div>

            {/* Occupancy Calendar */}
            <div className="space-y-4">
                <h2 className="text-xl font-bold flex items-center gap-2">
                    <CalendarCheck className="h-5 w-5 text-primary" />
                    Calendario de Ocupación
                </h2>
                <OccupancyCalendar bookings={bookings || []} />
            </div>

            {/* Recent Bookings Table */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                        <Clock className="h-5 w-5 text-primary" />
                        Últimas Reservas
                    </h2>
                    <Link href="/admin/bookings" className="text-sm font-bold text-primary hover:underline">
                        Ver todas
                    </Link>
                </div>

                <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-muted/50 border-b border-border">
                                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-muted-foreground">Cliente</th>
                                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-muted-foreground">Fechas</th>
                                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-muted-foreground">Monto</th>
                                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-muted-foreground">Estado</th>
                                    <th className="px-6 py-4"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {bookings?.slice(0, 5).map((booking) => (
                                    <tr key={booking.id} className="border-b border-border last:border-0 hover:bg-accent/30 transition-colors group">
                                        <td className="px-6 py-5">
                                            <div className="flex flex-col">
                                                <span className="font-bold text-foreground">{booking.customer_name}</span>
                                                <span className="text-xs text-muted-foreground">{booking.customer_email}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="text-sm">
                                                {format(new Date(booking.start_date), 'dd MMM', { locale: es })} - {format(new Date(booking.end_date), 'dd MMM', { locale: es })}
                                            </div>
                                        </td>
                                        <td className="px-6 py-5 font-bold text-sm">
                                            {booking.total_price}€
                                        </td>
                                        <td className="px-6 py-5">
                                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${booking.status === 'confirmed'
                                                ? 'bg-green-100 text-green-700'
                                                : 'bg-yellow-100 text-yellow-700'
                                                }`}>
                                                {booking.status === 'confirmed' ? <CheckCircle2 className="h-3 w-3" /> : <Clock className="h-3 w-3" />}
                                                {booking.status === 'confirmed' ? 'Confirmado' : 'Pendiente'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-5 text-right">
                                            <button className="p-2 hover:bg-primary/10 rounded-lg text-muted-foreground hover:text-primary transition-colors">
                                                <ChevronRight className="h-5 w-5" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {!bookings?.length && (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-20 text-center text-muted-foreground italic">
                                            No hay reservas todavía.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    )
}

function StatCard({ title, value, icon, trend, trendUp, color = "text-primary" }: any) {
    return (
        <div className="bg-card border border-border rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
                <div className={`p-3 bg-muted rounded-xl ${color}`}>
                    {icon}
                </div>
                {trend && (
                    <span className={`text-xs font-bold px-2 py-1 rounded-lg ${trendUp ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {trend}
                    </span>
                )}
            </div>
            <div className="space-y-1">
                <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">{title}</p>
                <p className="text-3xl font-black text-foreground">{value}</p>
            </div>
        </div>
    )
}
