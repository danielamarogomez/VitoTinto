import { Resend } from 'resend'
import { translations, Language } from '@/lib/translations'

const getResendClient = () => {
    if (!process.env.RESEND_API_KEY) {
        throw new Error('RESEND_API_KEY is missing')
    }
    return new Resend(process.env.RESEND_API_KEY)
}

export async function sendBookingConfirmationEmail(data: {
    email: string,
    customerName: string,
    startDate: string,
    endDate: string,
    totalPrice: string,
    bookingId: string,
    language?: Language
}) {
    const { email, customerName, startDate, endDate, totalPrice, bookingId, language = 'es' } = data
    const t = translations[language].email

    console.log(`📧 Intentando enviar email de confirmación a: ${email} (Idioma: ${language})`)

    try {
        const result = await getResendClient().emails.send({
            from: 'Vito Tinto <hola@alquilercampermallorca.com>', // Usando el dominio verificado
            to: email,
            subject: `${t.confirmationSubject} ${startDate}`,
            html: `
                <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 12px; overflow: hidden;">
                    <div style="background-color: #722f37; padding: 40px 20px; text-align: center; color: white;">
                        <h1 style="margin: 0; font-size: 28px;">${t.confirmationTitle}</h1>
                        <p style="opacity: 0.9;">${t.cheers}</p>
                    </div>
                    
                    <div style="padding: 30px;">
                        <h2 style="color: #722f37;">Hola ${customerName},</h2>
                        <p>${t.confirmationIntro}</p>
                        
                        <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
                            <h3 style="margin-top: 0; color: #333; font-size: 16px;">${t.detailsTitle}:</h3>
                            <table style="width: 100%; font-size: 14px;">
                                <tr>
                                    <td style="padding: 5px 0; color: #666;">${t.checkIn}:</td>
                                    <td style="padding: 5px 0; font-weight: bold; text-align: right;">${startDate}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 5px 0; color: #666;">${t.checkOut}:</td>
                                    <td style="padding: 5px 0; font-weight: bold; text-align: right;">${endDate}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 5px 0; color: #666;">${t.totalPrice}:</td>
                                    <td style="padding: 5px 0; font-weight: bold; text-align: right; color: #722f37; font-size: 18px;">${totalPrice}€</td>
                                </tr>
                                <tr>
                                    <td style="padding: 5px 0; color: #666;">ID:</td>
                                    <td style="padding: 5px 0; font-weight: bold; text-align: right; color: #999;">#${bookingId.slice(0, 8)}</td>
                                </tr>
                            </table>
                        </div>

                        <div style="text-align: center; margin: 30px 0;">
                            <img src="https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?q=80&w=600&auto=format&fit=crop" 
                                 alt="Vito Tinto Camper" 
                                 style="width: 100%; border-radius: 12px; box-shadow: 0 4px 10px rgba(0,0,0,0.1);" />
                        </div>

                        <h3 style="color: #333;">${t.locationTitle}:</h3>
                        <p style="color: #444;">${t.locationDesc}</p>

                        <h4 style="color: #333; margin-top: 20px;">${t.tipsTitle}:</h4>
                        <p style="color: #444;">${t.tipsDesc}</p>
                        
                         <h4 style="color: #333; margin-top: 20px;">${t.questions}:</h4>
                        <p style="color: #444;">${t.questionsDesc}</p>

                        <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee; text-align: center;">
                            <p style="color: #999; font-size: 12px;">Vito Tinto - ${t.cheers}</p>
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
        await getResendClient().emails.send({
            from: 'Vito Tinto <hola@alquilercampermallorca.com>',
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
    language?: Language
}) {
    const { email, customerName, startDate, endDate, refundAmount, language = 'es' } = data
    const t = translations[language].email

    try {
        await getResendClient().emails.send({
            from: 'Vito Tinto <hola@alquilercampermallorca.com>',
            to: email,
            subject: t.refundSubject,
            html: `
                <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 12px; overflow: hidden;">
                    <div style="background-color: #f44336; padding: 40px 20px; text-align: center; color: white;">
                        <h1 style="margin: 0; font-size: 28px;">${t.refundTitle}</h1>
                    </div>
                    
                    <div style="padding: 30px;">
                        <h2>Hola ${customerName},</h2>
                        <p>${t.refundIntro}</p>
                        
                        <div style="background-color: #fff4f4; padding: 20px; border-radius: 8px; margin: 20px 0; border: 1px solid #ffebee;">
                            <h3 style="margin-top: 0; color: #d32f2f; font-size: 16px;">${t.refundDetailsTitle}</h3>
                            <p>${t.refundProcessed}</p>
                            <table style="width: 100%; font-size: 14px;">
                                <tr>
                                    <td style="padding: 5px 0; color: #666;">${t.periodCancelled}</td>
                                    <td style="padding: 5px 0; font-weight: bold; text-align: right;">${startDate} - ${endDate}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 5px 0; color: #666;">${t.refundAmount}</td>
                                    <td style="padding: 5px 0; font-weight: bold; text-align: right; color: #d32f2f; font-size: 18px;">${refundAmount}€</td>
                                </tr>
                            </table>
                            <p style="font-size: 12px; color: #666; margin-top: 15px;">
                                ${t.refundBankInfo}
                            </p>
                        </div>

                        <p>${t.refundSorry}</p>

                        <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee; text-align: center;">
                            <p style="color: #999; font-size: 12px;">Vito Tinto - ${t.cheers}</p>
                        </div>
                    </div>
                </div>
            `
        })
        console.log(`✅ Email de cancelación enviado a: ${email} (Idioma: ${language})`)
    } catch (error: any) {
        console.error('❌ Error enviando email de cancelación:', error.message || error)
    }
}

export async function sendBookingRequestToOwner(data: {
    bookingId: string
    customerName: string
    customerEmail: string
    customerPhone: string
    customerMessage: string
    guests: string
    startDate: string
    endDate: string
    totalPrice: number
    extras?: { name: string; price: number }[]
}) {
    const ownerEmail = process.env.OWNER_EMAIL || 'danielamarogomez@gmail.com'
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3001'

    const extrasHtml = data.extras && data.extras.length > 0
        ? `
        <div style="margin-top: 15px; border-top: 1px dashed #ddd; padding-top: 10px;">
            <p style="margin: 0 0 5px 0; font-weight: bold; font-size: 13px; color: #666;">Servicios Extra:</p>
            <ul style="margin: 0; padding-left: 20px; font-size: 13px; color: #333;">
                ${data.extras.map(e => `<li>${e.name} (+${e.price}€)</li>`).join('')}
            </ul>
        </div>`
        : ''

    console.log(`📧 Enviando notificación de nueva solicitud a: ${ownerEmail}`)

    try {
        await getResendClient().emails.send({
            from: 'Vito Tinto <hola@alquilercampermallorca.com>',
            to: ownerEmail,
            subject: `🔔 Nueva Solicitud de Reserva - ${data.customerName}`,
            html: `
                <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 12px; overflow: hidden;">
                    <div style="background-color: #722f37; padding: 40px 20px; text-align: center; color: white;">
                        <h1 style="margin: 0; font-size: 28px;">🔔 Nueva Solicitud de Reserva</h1>
                        <p style="opacity: 0.9;">Un cliente está interesado en Vito Tinto</p>
                    </div>
                    
                    <div style="padding: 30px;">
                        <h2 style="color: #722f37;">Detalles del Cliente:</h2>
                        
                        <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
                            <table style="width: 100%; font-size: 14px;">
                                <tr>
                                    <td style="padding: 8px 0; color: #666;">Nombre:</td>
                                    <td style="padding: 8px 0; font-weight: bold; text-align: right;">${data.customerName}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 8px 0; color: #666;">Email:</td>
                                    <td style="padding: 8px 0; font-weight: bold; text-align: right;">
                                        <a href="mailto:${data.customerEmail}" style="color: #722f37;">${data.customerEmail}</a>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding: 8px 0; color: #666;">Teléfono:</td>
                                    <td style="padding: 8px 0; font-weight: bold; text-align: right;">
                                        <a href="tel:${data.customerPhone}" style="color: #722f37;">${data.customerPhone}</a>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding: 8px 0; color: #666;">Personas:</td>
                                    <td style="padding: 8px 0; font-weight: bold; text-align: right;">${data.guests}</td>
                                </tr>
                            </table>
                        </div>

                        <h2 style="color: #722f37; margin-top: 30px;">Detalles de la Reserva:</h2>
                        
                        <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
                            <table style="width: 100%; font-size: 14px;">
                                <tr>
                                    <td style="padding: 8px 0; color: #666;">Check-in:</td>
                                    <td style="padding: 8px 0; font-weight: bold; text-align: right;">${data.startDate}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 8px 0; color: #666;">Check-out:</td>
                                    <td style="padding: 8px 0; font-weight: bold; text-align: right;">${data.endDate}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 8px 0; color: #666;">Precio Total:</td>
                                    <td style="padding: 8px 0; font-weight: bold; text-align: right; color: #722f37; font-size: 18px;">${data.totalPrice}€</td>
                                </tr>
                            </table>
                            ${extrasHtml}
                        </div>
                        </div>

                        ${data.customerMessage ? `
                            <h3 style="color: #722f37; margin-top: 30px;">Mensaje del cliente:</h3>
                            <div style="background-color: #fff3cd; padding: 15px; border-radius: 8px; border-left: 4px solid #ffc107;">
                                <p style="margin: 0; font-style: italic;">"${data.customerMessage}"</p>
                            </div>
                        ` : ''}

                        <div style="margin-top: 40px; text-align: center;">
                            <a href="${appUrl}/admin" 
                               style="display: inline-block; background-color: #722f37; color: white; padding: 15px 40px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px;">
                                Ver en Panel de Admin
                            </a>
                        </div>

                        <div style="margin-top: 30px; padding: 20px; background-color: #e7f3ff; border-radius: 8px; border-left: 4px solid #2196F3;">
                            <p style="margin: 0; font-size: 14px; color: #333;">
                                <strong>💡 Próximos pasos:</strong><br>
                                1. Revisa la disponibilidad en tu calendario<br>
                                2. Contacta al cliente por WhatsApp o email<br>
                                3. Si confirmas, aprueba la reserva desde el panel de admin<br>
                                4. El sistema enviará automáticamente el link de pago al cliente
                            </p>
                        </div>

                        <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee; text-align: center;">
                            <p style="color: #999; font-size: 12px;">ID de Solicitud: ${data.bookingId.slice(0, 8)}</p>
                            <p style="color: #999; font-size: 12px;">Vito Tinto - Panel de Administración</p>
                        </div>
                    </div>
                </div>
            `
        })
        console.log(`✅ Notificación de solicitud enviada a: ${ownerEmail}`)
    } catch (error: any) {
        console.error('❌ Error enviando notificación al propietario:', error.message || error)
        throw error
    }
}

export async function sendPaymentLinkToCustomer(data: {
    customerName: string
    customerEmail: string
    startDate: string
    endDate: string
    totalPrice: number
    paymentLink: string
    bookingId: string
    language?: Language
}) {
    const { customerName, customerEmail, startDate, endDate, totalPrice, paymentLink, bookingId, language = 'es' } = data
    const t = translations[language].email

    console.log(`📧 Enviando link de pago a: ${customerEmail} (Idioma: ${language})`)

    try {
        await getResendClient().emails.send({
            from: 'Vito Tinto <hola@alquilercampermallorca.com>',
            to: customerEmail,
            subject: t.paymentSubject,
            html: `
                <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 12px; overflow: hidden;">
                    <div style="background-color: #722f37; padding: 40px 20px; text-align: center; color: white;">
                        <h1 style="margin: 0; font-size: 28px;">${t.paymentTitle}</h1>
                        <p style="opacity: 0.9;">${t.paymentSubtitle}</p>
                    </div>
                    
                    <div style="padding: 30px;">
                        <h2 style="color: #722f37;">Hola ${customerName},</h2>
                        <p>${t.paymentIntro}</p>
                        
                        <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
                            <h3 style="margin-top: 0; color: #333; font-size: 16px;">${t.paymentDetailsTitle}</h3>
                            <table style="width: 100%; font-size: 14px;">
                                <tr>
                                    <td style="padding: 8px 0; color: #666;">${t.checkIn}:</td>
                                    <td style="padding: 8px 0; font-weight: bold; text-align: right;">${startDate}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 8px 0; color: #666;">${t.checkOut}:</td>
                                    <td style="padding: 8px 0; font-weight: bold; text-align: right;">${endDate}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 8px 0; color: #666;">${t.totalPrice}:</td>
                                    <td style="padding: 8px 0; font-weight: bold; text-align: right; color: #722f37; font-size: 18px;">${totalPrice}€</td>
                                </tr>
                            </table>
                            <p style="margin: 10px 0 0 0; font-size: 11px; color: #999;">${t.vatIncluded}</p>
                        </div>

                        <div style="background-color: #e7f3ff; padding: 20px; border-radius: 8px; border-left: 4px solid #2196F3; margin: 20px 0;">
                            <h3 style="margin-top: 0; color: #333; font-size: 16px;">${t.paymentNextStepTitle}</h3>
                            <p style="margin: 10px 0; font-size: 14px;">
                                ${t.paymentNextStepDesc}
                            </p>
                        </div>

                        <div style="text-align: center; margin: 40px 0;">
                            <a href="${paymentLink}" 
                               style="display: inline-block; background-color: #722f37; color: white; padding: 18px 50px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 18px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                                ${t.payNow} (${totalPrice}€)
                            </a>
                        </div>

                        <div style="background-color: #fff3cd; padding: 15px; border-radius: 8px; border-left: 4px solid #ffc107; margin: 20px 0;">
                            <p style="margin: 0; font-size: 13px; color: #856404;">
                                <strong>${t.paymentWarningTitle}</strong> ${t.paymentWarningDesc}
                            </p>
                        </div>

                        <p style="margin-top: 30px;">${t.paymentPostInfo}</p>

                        <p>${t.paymentDoubts}</p>

                        <p style="margin-top: 30px;">${t.cheers} 🚐💨</p>

                        <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee; text-align: center;">
                            <p style="color: #999; font-size: 12px;">ID: ${bookingId.slice(0, 8)}</p>
                            <p style="color: #999; font-size: 12px;">${t.paymentFooter}</p>
                        </div>
                    </div>
                </div>
            `
        })
        console.log(`✅ Link de pago enviado a: ${data.customerEmail}`)
    } catch (error: any) {
        console.error('❌ Error enviando link de pago:', error.message || error)
        throw error
    }
}
