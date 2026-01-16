'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export type BookingState = {
    message?: string
    success?: boolean
}

export async function createBooking(prevState: BookingState | null, formData: FormData): Promise<BookingState> {
    const supabase = await createClient()

    const startDate = formData.get('startDate') as string
    const endDate = formData.get('endDate') as string
    const totalPrice = formData.get('totalPrice') as string

    // Validaciones básicas
    if (!startDate || !endDate) {
        return { success: false, message: 'Faltan fechas de reserva.' }
    }

    // 1. Verificar disponibilidad (doble check en servidor)
    const { data: conflicts } = await supabase
        .from('bookings')
        .select('id')
        .or(`start_date.lte.${endDate},end_date.gte.${startDate}`)

    if (conflicts && conflicts.length > 0) {
        return { success: false, message: 'Estas fechas ya no están disponibles.' }
    }

    // 2. Insertar reserva (pendiente de pago)
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return { success: false, message: 'Debes iniciar sesión para reservar.' }
    }

    const { error } = await supabase.from('bookings').insert({
        start_date: startDate,
        end_date: endDate,
        total_price: Number(totalPrice),
        customer_name: user.user_metadata.full_name || 'Desconocido',
        customer_email: user.email,
        user_id: user.id,
        status: 'pending' // Asumimos pendiente hasta confirnar pago
    })

    if (error) {
        console.error('Booking error:', error)
        return { success: false, message: 'Error al crear la reserva. Inténtalo de nuevo.' }
    }

    revalidatePath('/')
    return { success: true, message: 'Reserva solicitada correctamente. Te contactaremos pronto.' }
}

export async function getBusyDates() {
    const supabase = await createClient()

    // Obtenemos todas las reservas que NO estén canceladas
    const { data } = await supabase
        .from('bookings')
        .select('start_date, end_date')
        .neq('status', 'cancelled')

    // Transformar rangos a lista de fechas para el calendario podría hacerse aquí o en cliente
    // Para simplificar, devolvemos los rangos
    return data || []
}
