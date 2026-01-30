"use server"

import { createClient } from "@/lib/supabase/server"
import { adminClient } from "@/lib/supabase/admin"
import Stripe from 'stripe'
import { sendPaymentLinkToCustomer } from "@/lib/mail"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2025-01-27.acacia' as any,
})

export async function approveBookingRequest(bookingId: string) {
    const supabase = await createClient()

    // Verificar que el usuario es admin
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        throw new Error('No autorizado')
    }

    try {
        // Obtener los datos de la reserva
        const { data: booking, error: fetchError } = await adminClient
            .from('bookings')
            .select('*')
            .eq('id', bookingId)
            .single()

        if (fetchError || !booking) {
            throw new Error('Reserva no encontrada')
        }

        console.log('🔎 Admin fetched booking:', booking)

        if (booking.status !== 'pending_approval') {
            throw new Error('Esta reserva ya ha sido procesada')
        }

        // Crear un Payment Link en Stripe
        const paymentLink = await stripe.paymentLinks.create({
            line_items: [
                {
                    price_data: {
                        currency: 'eur',
                        product_data: {
                            name: `Reserva Vito Tinto - ${booking.start_date} a ${booking.end_date}`,
                            description: `Alquiler de camper del ${booking.start_date} al ${booking.end_date}`,
                        },
                        unit_amount: Math.round(booking.total_price * 100), // Stripe usa centavos
                    },
                    quantity: 1,
                },
            ],
            metadata: {
                booking_id: bookingId,
                customer_name: booking.customer_name,
                customer_email: booking.customer_email,
                start_date: booking.start_date,
                end_date: booking.end_date,
            },
            after_completion: {
                type: 'redirect',
                redirect: {
                    url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/success`,
                },
            },
        })

        // Actualizar la reserva con el link de pago y cambiar estado a "pending"
        const { error: updateError } = await adminClient
            .from('bookings')
            .update({
                status: 'pending', // Ahora está pendiente de pago
                payment_link: paymentLink.url,
                approved_at: new Date().toISOString(),
                approved_by: user.id,
            })
            .eq('id', bookingId)

        if (updateError) {
            throw new Error('Error al actualizar la reserva')
        }

        // Enviar email al cliente con el link de pago
        try {
            await sendPaymentLinkToCustomer({
                customerName: booking.customer_name,
                customerEmail: booking.customer_email,
                startDate: booking.start_date,
                endDate: booking.end_date,
                totalPrice: booking.total_price,
                paymentLink: paymentLink.url,
                bookingId: bookingId,
                language: (booking as any).preferred_language || 'es'
            })
        } catch (emailError) {
            console.error('Error sending payment link email:', emailError)
            // No lanzamos error porque la aprobación sí se hizo
        }

        return { success: true, paymentLink: paymentLink.url }
    } catch (error: any) {
        console.error('Error approving booking request:', error)
        throw new Error(error.message || 'Error al aprobar la solicitud')
    }
}

export async function rejectBookingRequest(bookingId: string) {
    const supabase = await createClient()

    // Verificar que el usuario es admin
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        throw new Error('No autorizado')
    }

    try {
        // Cambiar estado a "cancelled"
        const { error } = await adminClient
            .from('bookings')
            .update({
                status: 'cancelled'
            })
            .eq('id', bookingId)

        if (error) {
            throw new Error('Error al rechazar la solicitud')
        }

        // TODO: Opcionalmente enviar email al cliente informando del rechazo

        return { success: true }
    } catch (error: any) {
        console.error('Error rejecting booking request:', error)
        throw new Error(error.message || 'Error al rechazar la solicitud')
    }
}
