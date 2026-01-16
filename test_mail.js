const { Resend } = require('resend');
const fs = require('fs');

// Leer .env.local manualmente para obtener la API KEY
const envFile = fs.readFileSync('.env.local', 'utf8');
const resendApiKey = envFile.match(/RESEND_API_KEY=(.*)/)?.[1]?.trim();
const ownerEmail = envFile.match(/OWNER_EMAIL=(.*)/)?.[1]?.trim();

const resend = new Resend(resendApiKey);

async function testEmail() {
    console.log('🧪 Iniciando prueba de email...');
    console.log(`Usando API Key: ${resendApiKey ? 'Detectada' : 'Faltante'}`);
    console.log(`Email de destino: ${ownerEmail}`);

    try {
        const { data, error } = await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: ownerEmail,
            subject: 'Prueba de Vito Tinto 🚐',
            html: '<h1>¡El motor está en marcha!</h1><p>Si recibes esto, Resend está funcionando correctamente.</p>'
        });

        if (error) {
            console.error('❌ Error de Resend:', error);
        } else {
            console.log('✅ Email enviado con éxito! ID:', data.id);
        }
    } catch (e) {
        console.error('❌ Error fatal:', e);
    }
}

testEmail();
