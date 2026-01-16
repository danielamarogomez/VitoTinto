import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendBookingConfirmationEmail(data: {
    email: string,
    customerName: string,
    startDate: string,
    endDate: string,
    totalPrice: string,
    bookingId: string
}) {
    const { email, customerName, startDate, endDate, totalPrice, bookingId } = data

    console.log(`📧 Intentando enviar email de confirmación a: ${email}`)

    try {
        const result = await resend.emails.send({
            from: 'Vito Tinto <onboarding@resend.dev>', // Restaurado formato original
            to: email,
            subject: `¡Reserva Confirmada! 🚐 - Tu aventura comienza el ${startDate}`,
            html: `
                <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 12px; overflow: hidden;">
                    <div style="background-color: #722f37; padding: 40px 20px; text-align: center; color: white;">
                        <h1 style="margin: 0; font-size: 28px;">¡Tu aventura está lista!</h1>
                        <p style="opacity: 0.9;">Prepárate para vivir la libertad sobre ruedas.</p>
                    </div>
                    
                    <div style="padding: 30px;">
                        <h2 style="color: #722f37;">Hola ${customerName},</h2>
                        <p>Tu pago ha sido procesado correctamente y tu reserva para la furgoneta <strong>Vito Tinto</strong> está oficialmente confirmada.</p>
                        
                        <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
                            <h3 style="margin-top: 0; color: #333; font-size: 16px;">Detalles de la Reserva:</h3>
                            <table style="width: 100%; font-size: 14px;">
                                <tr>
                                    <td style="padding: 5px 0; color: #666;">Fecha de Inicio:</td>
                                    <td style="padding: 5px 0; font-weight: bold; text-align: right;">${startDate}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 5px 0; color: #666;">Fecha de Fin:</td>
                                    <td style="padding: 5px 0; font-weight: bold; text-align: right;">${endDate}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 5px 0; color: #666;">Total Pagado:</td>
                                    <td style="padding: 5px 0; font-weight: bold; text-align: right; color: #722f37; font-size: 18px;">${totalPrice}€</td>
                                </tr>
                                <tr>
                                    <td style="padding: 5px 0; color: #666;">ID de Reserva:</td>
                                    <td style="padding: 5px 0; font-weight: bold; text-align: right; color: #999;">#${bookingId.slice(0, 8)}</td>
                                </tr>
                            </table>
                        </div>

                        <div style="text-align: center; margin: 30px 0;">
                            <img src="https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?q=80&w=600&auto=format&fit=crop" 
                                 alt="Vito Tinto Camper" 
                                 style="width: 100%; border-radius: 12px; box-shadow: 0 4px 10px rgba(0,0,0,0.1);" />
                        </div>

                        <h3 style="color: #333;">Próximos pasos:</h3>
                        <ul style="color: #444; line-height: 1.6;">
                            <li>Nos pondremos en contacto contigo por teléfono/WhatsApp para concretar la hora de entrega.</li>
                            <li>Asegúrate de traer tu carnet de conducir en vigor el día de la recogida.</li>
                            <li>¡Empieza a planear tu ruta!</li>
                        </ul>

                        <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee; text-align: center;">
                            <p style="color: #999; font-size: 12px;">Vito Tinto - Libertad sobre ruedas</p>
                            <p style="color: #999; font-size: 12px;">Esta es una confirmación automática de tu reserva.</p>
                        </div>
                    </div>
                </div>
            `
        })
        console.log(`✅ Email enviado con éxito: ${result.data?.id}`)
    } catch (error: any) {
        console.error('❌ Error fatal en sendBookingConfirmationEmail:', error.message || error)
    }
}

export async function sendOwnerNotification(data: {
    customerName: string,
    customerEmail: string,
    startDate: string,
    endDate: string,
    totalPrice: string
}) {
    const { customerName, customerEmail, startDate, endDate, totalPrice } = data
    const ownerEmail = process.env.OWNER_EMAIL

    if (!ownerEmail) {
        console.warn('⚠️ No se puede enviar notificación al dueño: OWNER_EMAIL no configurado')
        return
    }

    try {
        await resend.emails.send({
            from: 'Vito Tinto <onboarding@resend.dev>',
            to: ownerEmail,
            subject: `🔔 NUEVA RESERVA: ${customerName}`,
            html: `
                <div style="font-family: sans-serif; padding: 20px; border: 1px solid #722f37; border-radius: 8px;">
                    <h2 style="color: #722f37;">¡Buenas noticias! Tienes una nueva reserva</h2>
                    <p>Se ha confirmado un pago y una nueva reserva para la Vito Tinto.</p>
                    <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
                    <table style="width: 100%;">
                        <tr><td><strong>Cliente:</strong></td><td>${customerName} (${customerEmail})</td></tr>
                        <tr><td><strong>Desde:</strong></td><td>${startDate}</td></tr>
                        <tr><td><strong>Hasta:</strong></td><td>${endDate}</td></tr>
                        <tr><td><strong>Total Cobrado:</strong></td><td style="color: #722f37; font-weight: bold;">${totalPrice}€</td></tr>
                    </table>
                    <div style="margin-top: 20px; text-align: center;">
                        <a href="${process.env.NEXT_PUBLIC_APP_URL}/admin" 
                           style="background-color: #722f37; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">
                            Ver en Panel Admin
                        </a>
                    </div>
                </div>
            `
        })
        console.log(`✅ Notificación enviada al dueño (${ownerEmail})`)
    } catch (error: any) {
        console.error('❌ Error notificando al propietario:', error.message || error)
    }
}

export async function sendCancellationRefundEmail(data: {
    email: string,
    customerName: string,
    startDate: string,
    endDate: string,
    refundAmount: string
}) {
    const { email, customerName, startDate, endDate, refundAmount } = data

    try {
        await resend.emails.send({
            from: 'Vito Tinto <onboarding@resend.dev>',
            to: email,
            subject: `Información sobre tu reserva 🚐 - Vito Tinto`,
            html: `
                <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 12px; overflow: hidden;">
                    <div style="background-color: #f44336; padding: 40px 20px; text-align: center; color: white;">
                        <h1 style="margin: 0; font-size: 28px;">Reserva Cancelada y Reembolso</h1>
                    </div>
                    
                    <div style="padding: 30px;">
                        <h2>Hola ${customerName},</h2>
                        <p>Te informamos de que tu reserva para la furgoneta <strong>Vito Tinto</strong> ha sido cancelada.</p>
                        
                        <div style="background-color: #fff4f4; padding: 20px; border-radius: 8px; margin: 20px 0; border: 1px solid #ffebee;">
                            <h3 style="margin-top: 0; color: #d32f2f; font-size: 16px;">Detalles del Reembolso:</h3>
                            <p>Hemos procesado una devolución total de tu pago a través de Stripe.</p>
                            <table style="width: 100%; font-size: 14px;">
                                <tr>
                                    <td style="padding: 5px 0; color: #666;">Periodo cancelado:</td>
                                    <td style="padding: 5px 0; font-weight: bold; text-align: right;">${startDate} - ${endDate}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 5px 0; color: #666;">Importe Reembolsado:</td>
                                    <td style="padding: 5px 0; font-weight: bold; text-align: right; color: #d32f2f; font-size: 18px;">${refundAmount}€</td>
                                </tr>
                            </table>
                            <p style="font-size: 12px; color: #666; margin-top: 15px;">
                                * El dinero suele tardar entre 5 y 10 días laborables en aparecer en tu cuenta bancaria, dependiendo de tu entidad financiera.
                            </p>
                        </div>

                        <p>Sentimos los inconvenientes que esto te pueda causar. Esperamos verte pronto en otra ocasión.</p>

                        <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee; text-align: center;">
                            <p style="color: #999; font-size: 12px;">Vito Tinto - Libertad sobre ruedas</p>
                        </div>
                    </div>
                </div>
            `
        })
        console.log(`✅ Email de cancelación enviado a: ${email}`)
    } catch (error: any) {
        console.error('❌ Error enviando email de cancelación:', error.message || error)
    }
}
