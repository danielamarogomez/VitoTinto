'use server'

import { createClient, createAdminClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2025-01-27.acacia' as any,
})

import { sendCancellationRefundEmail } from '@/lib/mail'

export async function createAdminBooking(formData: FormData) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/')
    }

    const startDate = formData.get('startDate') as string
    const endDate = formData.get('endDate') as string
    const reason = formData.get('reason') as string || 'Bloqueo Administrativo'

    // Validar fechas
    if (!startDate || !endDate) {
        // En una app real devolveríamos error al form
        return { success: false, message: 'Faltan fechas' }
    }

    // Insertar el bloqueo
    const { error } = await supabase.from('bookings').insert({
        start_date: startDate,
        end_date: endDate,
        status: 'blocked', // Estado especial para bloqueos
        total_price: 0,
        customer_name: reason, // Usamos el nombre para guardar el motivo
        customer_email: user.email, // Email del admin
        user_id: user.id
    })

    if (error) {
        console.error('Error creando bloqueo:', error)
        return { success: false, message: error.message }
    }

    revalidatePath('/admin/bookings')
    revalidatePath('/admin')
    revalidatePath('/') // Para actualizar el calendario público también

    redirect('/admin/bookings')
}

export async function deleteBooking(id: string) {
    const supabaseNormal = await createClient()

    // 1. Verificar identidad del Admin
    const ownerEmail = process.env.OWNER_EMAIL
    const { data: { user } } = await supabaseNormal.auth.getUser()

    if (!user || user.email !== ownerEmail) {
        console.error('Intento de borrado no autorizado por:', user?.email)
        return { success: false, message: 'No autorizado' }
    }

    const supabaseAdmin = await createAdminClient()

    // 2. Obtener datos de la reserva para el reembolso
    const { data: booking } = await supabaseAdmin
        .from('bookings')
        .select('payment_intent_id, total_price, customer_name, customer_email, start_date, end_date')
        .eq('id', id)
        .single()

    // 3. Procesar Reembolso si hay un pago registrado
    if (booking?.payment_intent_id) {
        try {
            console.log(`Iniciando reembolso para ${booking.customer_name} de ${booking.total_price}€`)
            await stripe.refunds.create({
                payment_intent: booking.payment_intent_id,
            })
            console.log('Reembolso procesado correctamente en Stripe')

            // Enviar email informativo al cliente
            await sendCancellationRefundEmail({
                email: booking.customer_email,
                customerName: booking.customer_name,
                startDate: booking.start_date,
                endDate: booking.end_date,
                refundAmount: booking.total_price.toString()
            })
            console.log('Email de cancelación enviado correctamente')
        } catch (error: any) {
            console.error('Error al procesar reembolso/email:', error)
        }
    }

    // 4. Ejecutar borrado con cliente Admin
    const { error } = await supabaseAdmin
        .from('bookings')
        .delete()
        .eq('id', id)

    if (error) {
        console.error('Error borrando reserva en DB:', error)
        return { success: false, message: `Error DB: ${error.message}` }
    }

    revalidatePath('/admin/bookings')
    revalidatePath('/admin')
    revalidatePath('/')

    return { success: true }
}
