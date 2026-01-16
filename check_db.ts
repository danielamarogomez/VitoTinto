import { supabaseAdmin } from './src/lib/supabase/admin';

async function checkBookings() {
    const { data: bookings, error } = await supabaseAdmin
        .from('bookings')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(3);

    if (error) {
        console.error('Error fetching bookings:', error);
        return;
    }

    console.log('--- Últimas 3 reservas ---');
    bookings.forEach((b, i) => {
        console.log(`${i + 1}. ID: ${b.id}`);
        console.log(`   Email: ${b.customer_email}`);
        console.log(`   Status: ${b.status}`);
        console.log(`   Fecha: ${b.created_at}`);
        console.log('-------------------------');
    });
}

checkBookings();
