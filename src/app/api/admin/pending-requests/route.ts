import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
    const supabase = await createClient()

    // Verificar que el usuario es admin
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    try {
        const { data: requests, error } = await supabase
            .from('bookings')
            .select('*')
            .eq('status', 'pending_approval')
            .order('created_at', { ascending: false })

        if (error) {
            console.error('Error fetching pending requests:', error)
            return NextResponse.json({ error: 'Error al cargar solicitudes' }, { status: 500 })
        }

        return NextResponse.json({ requests })
    } catch (error) {
        console.error('Error in pending-requests API:', error)
        return NextResponse.json({ error: 'Error interno' }, { status: 500 })
    }
}
