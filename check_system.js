const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

// Leer variables de .env.local
const envFile = fs.readFileSync('.env.local', 'utf8');
const getEnv = (key) => envFile.match(new RegExp(`${key}=(.*)`))?.[1]?.trim();

const supabaseUrl = getEnv('NEXT_PUBLIC_SUPABASE_URL');
const supabaseKey = getEnv('SUPABASE_SERVICE_ROLE_KEY');

const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
    console.log('🚀 Iniciando escaneo de Vito Tinto...');
    console.log(`📡 URL DB: ${supabaseUrl}`);

    const { data: bookings, error } = await supabase
        .from('bookings')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);

    if (error) {
        console.error('❌ Error DB:', error.message);
        return;
    }

    console.log('\n📅 ÚLTIMOS 5 MOVIMIENTOS EN DB:');
    if (bookings.length === 0) {
        console.log('⚠️ LA BASE DE DATOS ESTÁ VACÍA DE RESERVAS.');
    }

    bookings.forEach((b, i) => {
        console.log(`${i + 1}. ID: ${b.id}`);
        console.log(`   Cliente: ${b.customer_name} (${b.customer_email})`);
        console.log(`   Estado: ${b.status}`);
        console.log(`   Fechas: ${b.start_date} -> ${b.end_date}`);
        console.log(`   Stripe ID: ${b.payment_intent_id || 'FALTANTE ❌'}`);
        console.log('-----------------------------------');
    });

    console.log('\n💡 Si ves "FALTANTE ❌" en Stripe ID, el webhook NO se ha procesado.');
    console.log('💡 Si las fechas NO están bloqueadas es porque no se han guardado con estado "confirmed" o "paid".');
}

check();
