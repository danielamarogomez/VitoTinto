"use server"

import { createClient } from "@/lib/supabase/server"
import { sendBookingRequestToOwner } from "@/lib/mail"

interface BookingRequestData {
    startDate: string
    endDate: string
    totalPrice: number
    customerName: string
    customerEmail: string
    customerPhone: string
    customerMessage?: string
}

export async function createBookingRequest(data: BookingRequestData) {
    const supabase = await createClient()

    // Verificar si el usuario está autenticado (opcional, pero recomendado)
    const { data: { user } } = await supabase.auth.getUser()

    try {
        // Crear la solicitud de reserva con estado "pending_approval"
        const { data: booking, error } = await supabase
            .from('bookings')
            .insert({
                start_date: data.startDate,
                end_date: data.endDate,
                total_price: data.totalPrice,
                customer_name: data.customerName,
                customer_email: data.customerEmail,
                customer_phone: data.customerPhone,
                customer_message: data.customerMessage || '',
                status: 'pending_approval', // Esperando aprobación de Andrea
                user_id: null // Forzamos null para evitar errores de FK/Perfil. Tratamos como invitado.
            })
            .select()
            .single()

        if (error) {
            console.error('Error creating booking request:', error)
            throw new Error('No se pudo crear la solicitud de reserva')
        }

        // Enviar email a Andrea notificándole de la nueva solicitud
        try {
            await sendBookingRequestToOwner({
                bookingId: booking.id,
                customerName: data.customerName,
                customerEmail: data.customerEmail,
                customerPhone: data.customerPhone,
                customerMessage: data.customerMessage || 'Sin mensaje',
                startDate: data.startDate,
                endDate: data.endDate,
                totalPrice: data.totalPrice
            })
        } catch (emailError) {
            console.error('Error sending email to owner:', emailError)
            // No lanzamos error aquí porque la reserva sí se creó
        }

        return { success: true, bookingId: booking.id }
    } catch (error) {
        console.error('Error in createBookingRequest:', error)
        throw error
    }
}
