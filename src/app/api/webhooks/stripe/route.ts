import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'

// Usamos el cliente directamente para asegurar que las variables están ahí
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2025-01-27.acacia' as any,
})

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(req: Request) {
    const body = await req.text()
    const signature = (await headers()).get('stripe-signature') as string

    console.log('🔔 [WEBHOOK] Petición recibida en /api/webhooks/stripe')

    if (!webhookSecret) {
        console.error('❌ [WEBHOOK] STRIPE_WEBHOOK_SECRET no configurada')
        return NextResponse.json({ error: 'Config error' }, { status: 500 })
    }

    let event: Stripe.Event

    try {
        event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
        console.log(`✅ [WEBHOOK] Verificado: ${event.type}`)
    } catch (err: any) {
        console.error(`❌ [WEBHOOK] Error de firma: ${err.message}`)
        return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 })
    }

    if (event.type === 'checkout.session.completed') {
        const session = event.data.object as Stripe.Checkout.Session
        const metadata = session.metadata

        console.log('📦 [WEBHOOK] Sesión completada. Metadata:', metadata)

        if (!metadata) {
            console.error('❌ [WEBHOOK] No se encontraron metadatos en la sesión')
            return NextResponse.json({ error: 'No metadata' }, { status: 400 })
        }

        const { user_id, start_date, end_date, customer_email } = metadata
        const userEmail = session.customer_email || customer_email || ''
        const totalPrice = (session.amount_total || 0) / 100

        try {
            // 1. Obtener nombre del perfil como respaldo
            let customerName = session.customer_details?.name || 'Cliente'
            let customerPhone = ''

            console.log('🔍 [WEBHOOK] Buscando perfil para ID:', user_id)
            const { data: profile } = await supabaseAdmin
                .from('profiles')
                .select('full_name, phone_number')
                .eq('id', user_id)
                .single()

            if (profile) {
                customerName = profile.full_name || customerName
                customerPhone = profile.phone_number || ''
                console.log('👤 [WEBHOOK] Perfil encontrado:', customerName)
            }

            // 2. Procesar Reserva (Actualizar o Crear)
            const bookingId = metadata.booking_id

            let booking: any
            let bookingError: any

            if (bookingId) {
                console.log('🔄 [WEBHOOK] Actualizando reserva existente:', bookingId)
                const { data, error } = await supabaseAdmin
                    .from('bookings')
                    .update({
                        status: 'confirmed',
                        payment_intent_id: session.payment_intent as string,
                        // Actualizar datos de facturación si vienen vacíos
                        ...(customerPhone && { customer_phone: customerPhone })
                    })
                    .eq('id', bookingId)
                    .select()
                    .single()

                booking = data
                bookingError = error
            } else {
                // FALLBACK: Si no hay ID, creamos nueva (comportamiento antiguo)
                console.log('📝 [WEBHOOK] Creando nueva reserva (no se encontró booking_id)...')

                // Verificamos si realmente existe el perfil para evitar errores de clave foránea
                const { data: profileCheck } = await supabaseAdmin
                    .from('profiles')
                    .select('id')
                    .eq('id', user_id)
                    .single()

                const { data, error } = await supabaseAdmin
                    .from('bookings')
                    .insert({
                        user_id: profileCheck ? user_id : null,
                        start_date: start_date,
                        end_date: end_date,
                        total_price: totalPrice,
                        status: 'confirmed',
                        customer_name: customerName,
                        customer_email: userEmail,
                        customer_phone: customerPhone,
                        payment_intent_id: session.payment_intent as string
                    })
                    .select()
                    .single()

                booking = data
                bookingError = error
            }

            if (bookingError) {
                console.error('❌ [WEBHOOK] Error insertando reserva:', bookingError)
                // No lanzamos error para devolver 200 a Stripe, pero lo registramos
            } else {
                console.log('✅ [WEBHOOK] Reserva guardada con éxito. ID:', booking.id)

                // 3. Importar funciones de email dinámicamente para evitar problemas de carga
                const { sendBookingConfirmationEmail, sendOwnerNotification } = await import('@/lib/mail')

                await Promise.all([
                    sendBookingConfirmationEmail({
                        email: userEmail,
                        customerName,
                        startDate: start_date,
                        endDate: end_date,
                        totalPrice: totalPrice.toString(),
                        bookingId: booking.id
                    }).catch(e => console.error('❌ [WEBHOOK] Error email cliente:', e)),
                    sendOwnerNotification({
                        customerName,
                        customerEmail: userEmail,
                        startDate: start_date,
                        endDate: end_date,
                        totalPrice: totalPrice.toString()
                    }).catch(e => console.error('❌ [WEBHOOK] Error email dueño:', e))
                ])
                console.log('✨ [WEBHOOK] Emails enviados')
            }

        } catch (error: any) {
            console.error('❌ [WEBHOOK] Error crítico:', error.message)
        }
    }

    return NextResponse.json({ received: true })
}
