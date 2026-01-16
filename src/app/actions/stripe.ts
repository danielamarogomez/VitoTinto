"use server"

import Stripe from 'stripe'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2025-01-27.acacia' as any,
})

export async function createCheckoutSession(formData: FormData) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user || !user.email) {
        redirect('/login')
    }

    const startDate = formData.get('startDate') as string
    const endDate = formData.get('endDate') as string
    const totalPrice = parseInt(formData.get('totalPrice') as string)

    // Crear la sesión de Stripe
    const session = await stripe.checkout.sessions.create({
        line_items: [
            {
                price_data: {
                    currency: 'eur',
                    product_data: {
                        name: `Reserva Vito Tinto: ${startDate} al ${endDate}`,
                        description: 'Alquiler de furgoneta Camper Premium',
                    },
                    unit_amount: totalPrice * 100, // Stripe usa céntimos
                },
                quantity: 1,
            },
        ],
        mode: 'payment',
        success_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/?status=cancelled`,
        customer_email: user.email,
        metadata: {
            user_id: user.id,
            customer_email: user.email,
            start_date: startDate,
            end_date: endDate,
        },
    })

    if (session.url) {
        redirect(session.url)
    }
}

export async function redirectToReceipt(paymentIntentId: string) {
    if (!paymentIntentId) return;

    const pi = await stripe.paymentIntents.retrieve(paymentIntentId, {
        expand: ['latest_charge'],
    });

    const charge = pi.latest_charge as Stripe.Charge;
    const receiptUrl = charge?.receipt_url;

    if (receiptUrl) {
        redirect(receiptUrl);
    }
}
