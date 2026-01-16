import { createClient } from '@/lib/supabase/server'
import {
    Plus,
    Download
} from 'lucide-react'
import Link from 'next/link'
import { BookingsManager } from '@/components/admin/BookingsManager'

export default async function AdminBookingsPage() {
    const supabase = await createClient()

    // 1. Obtener todas las reservas con más detalles (para pasar al cliente)
    // El orden es importante para que el historial salga bien
    const { data: bookings } = await supabase
        .from('bookings')
        .select('*')
        .order('start_date', { ascending: false })

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-foreground tracking-tight">Gestión de Reservas</h1>
                    <p className="text-muted-foreground">Control total sobre el calendario de Vito Tinto.</p>
                </div>
                <div className="flex items-center gap-3">
                    <Link
                        href="/admin/bookings/new"
                        className="flex items-center gap-2 bg-primary text-primary-foreground px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-primary/90 transition-all shadow-lg hover:scale-105 active:scale-95"
                    >
                        <Plus className="h-4 w-4" />
                        Añadir Bloqueo
                    </Link>
                </div>
            </div>

            {/* Manager interactivo (Cliente) */}
            <BookingsManager bookings={bookings || []} />

        </div>
    )
}
