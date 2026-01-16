const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');

// Cargar variables de entorno manualmente
dotenv.config({ path: path.resolve(__dirname, '.env.local') });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function diagnostic() {
    console.log('🔍 Iniciando diagnóstico de Vito Tinto...');
    console.log('-----------------------------------------');

    // 1. Verificar variables críticas
    console.log('Kevs detectadas:');
    console.log(`- Supabase URL: ${process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅' : '❌'}`);
    console.log(`- Resend API Key: ${process.env.RESEND_API_KEY ? '✅' : '❌'}`);
    console.log(`- Stripe Webhook Secret: ${process.env.STRIPE_WEBHOOK_SECRET ? '✅' : '❌'}`);

    // 2. Buscar últimas reservas
    const { data: bookings, error } = await supabase
        .from('bookings')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(3);

    if (error) {
        console.error('❌ Error al leer la base de datos:', error.message);
    } else {
        console.log('\n📅 Últimas 3 reservas en DB:');
        bookings.forEach((b, i) => {
            console.log(`${i + 1}. ID: ${b.id}`);
            console.log(`   Email: ${b.customer_email}`);
            console.log(`   Estado: ${b.status}`);
            console.log(`   Creada: ${b.created_at}`);
            console.log(`   Stripe ID: ${b.payment_intent_id ? '✅ ' + b.payment_intent_id : '❌ No tiene'}`);
            console.log('---');
        });
    }
}

diagnostic();
