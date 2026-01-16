import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { Calendar, CreditCard, Clock, CheckCircle2, ChevronRight, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { redirectToReceipt } from '@/app/actions/stripe'

// Forzar que esta página siempre busque datos frescos
export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    // Obtener las reservas del usuario por ID o por Email (como respaldo de seguridad)
    // Excluimos los bloqueos administrativos (status: 'blocked')
    const { data: bookings } = await supabase
        .from('bookings')
        .select('*')
        .or(`user_id.eq.${user.id},customer_email.eq.${user.email}`)
        .neq('status', 'blocked')
        .order('start_date', { ascending: false })

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl min-h-screen">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10 border-b border-border pb-6">
                <div>
                    <h1 className="text-3xl font-black text-primary tracking-tight">Mis Reservas</h1>
                    <p className="text-muted-foreground">Gestiona tus próximos viajes y revisa tu historial.</p>
                </div>
                <Link
                    href="/"
                    className="flex items-center gap-2 text-primary font-bold hover:opacity-80 transition-opacity self-start md:self-center"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Volver al inicio
                </Link>
            </header>


            {!bookings || bookings.length === 0 ? (
                <div className="text-center py-20 border-2 border-dashed border-border rounded-2xl bg-muted/30">
                    <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                    <h3 className="text-xl font-semibold mb-2">Aún no tienes reservas</h3>
                    <p className="text-muted-foreground mb-8">¡Es el momento perfecto para planear tu primera aventura tinto!</p>
                    <Link
                        href="/"
                        className="bg-primary text-primary-foreground px-8 py-3 rounded-full font-bold hover:bg-primary/90 transition-all inline-flex items-center"
                    >
                        Explorar fechas
                        <ChevronRight className="ml-2 h-4 w-4" />
                    </Link>
                </div>
            ) : (
                <div className="grid gap-6">
                    {bookings.map((booking) => (
                        <div
                            key={booking.id}
                            className="bg-card border border-border rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col md:flex-row"
                        >
                            <div className="bg-primary/5 p-6 flex flex-col justify-center items-center md:w-48 border-b md:border-b-0 md:border-r border-border">
                                <span className="text-3xl font-black text-primary mb-1">
                                    {format(new Date(booking.start_date), 'dd')}
                                </span>
                                <span className="text-sm font-bold text-primary uppercase tracking-tighter">
                                    {format(new Date(booking.start_date), 'MMM yyyy', { locale: es })}
                                </span>
                            </div>

                            <div className="p-6 flex-1 flex flex-col md:flex-row md:items-center justify-between gap-6">
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3">
                                        <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 ${booking.status === 'confirmed'
                                            ? 'bg-green-100 text-green-700'
                                            : 'bg-yellow-100 text-yellow-700'
                                            }`}>
                                            {booking.status === 'confirmed' ? <CheckCircle2 className="h-3 w-3" /> : <Clock className="h-3 w-3" />}
                                            {booking.status === 'confirmed' ? 'Pagado & Confirmado' : 'Pendiente'}
                                        </div>
                                        <div className="text-sm text-muted-foreground font-medium flex items-center gap-1.5 font-mono">
                                            <CreditCard className="h-4 w-4" />
                                            Total: {booking.total_price}€
                                        </div>
                                    </div>

                                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6">
                                        <div className="flex flex-col">
                                            <span className="text-[10px] font-bold text-muted-foreground uppercase opacity-70">Desde</span>
                                            <span className="font-semibold">{format(new Date(booking.start_date), "EEEE, d 'de' MMMM", { locale: es })}</span>
                                        </div>
                                        <ChevronRight className="hidden sm:block h-4 w-4 text-muted-foreground" />
                                        <div className="flex flex-col">
                                            <span className="text-[10px] font-bold text-muted-foreground uppercase opacity-70">Hasta</span>
                                            <span className="font-semibold">{format(new Date(booking.end_date), "EEEE, d 'de' MMMM", { locale: es })}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex md:flex-col gap-2">
                                    {booking.payment_intent_id && (
                                        <form action={async () => {
                                            'use server'
                                            await redirectToReceipt(booking.payment_intent_id)
                                        }}>
                                            <button
                                                type="submit"
                                                className="w-full bg-background border border-input px-4 py-2 rounded-lg text-sm font-bold hover:bg-accent transition-colors flex items-center justify-center gap-2"
                                            >
                                                Ver Recibo
                                                <ChevronRight className="h-4 w-4" />
                                            </button>
                                        </form>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
