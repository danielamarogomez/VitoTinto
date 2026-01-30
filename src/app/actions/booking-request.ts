"use server"

import { createClient, createAdminClient } from "@/lib/supabase/server"
import { sendBookingRequestToOwner } from "@/lib/mail"

interface BookingRequestData {
    startDate: string
    endDate: string
    totalPrice: number
    customerName: string
    customerEmail: string
    customerPhone: string
    guests: string
    customerMessage?: string
    extras?: { id: string; name: string; price: number }[]
    preferredLanguage?: 'es' | 'en'
}

export async function createBookingRequest(data: BookingRequestData) {
    const authSupabase = await createClient()
    const adminSupabase = await createAdminClient()

    console.log('📝 createBookingRequest received:', JSON.stringify(data, null, 2))

    // Verificar si el usuario está autenticado para vincular la reserva
    const { data: { user } } = await authSupabase.auth.getUser()

    try {
        // Crear la solicitud de reserva con estado "pending_approval"
        // Usamos adminSupabase para saltar RLS (ya que los guest no pueden insertar)
        const { data: booking, error } = await adminSupabase
            .from('bookings')
            .insert({
                start_date: data.startDate,
                end_date: data.endDate,
                total_price: data.totalPrice,
                customer_name: data.customerName,
                customer_email: data.customerEmail,
                customer_phone: data.customerPhone,
                customer_message: `Personas: ${data.guests}${data.customerMessage ? '\n\nMensaje: ' + data.customerMessage : ''}`,
                status: 'pending_approval', // Esperando aprobación de Andrea
                user_id: user?.id || null, // Vinculamos si está logueado, sino null
                selected_extras: data.extras || [], // Guardamos los extras en la DB
                preferred_language: data.preferredLanguage // Removing fallback to verify what is actually sent
            })
            .select()
            .single()

        console.log('💾 Booking saved in DB:', booking)

        if (error) {
            console.error('Error creating booking request:', error)
            throw new Error(`Error Supabase: ${error.message} (Code: ${error.code})`)
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
                totalPrice: data.totalPrice,
                guests: data.guests,
                extras: data.extras
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
