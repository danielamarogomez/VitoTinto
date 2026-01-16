'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function login(formData: FormData) {
    const supabase = await createClient()

    const email = formData.get('email') as string
    const password = formData.get('password') as string

    const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
    })

    if (error) {
        redirect(`/error?message=${encodeURIComponent(error.message)}`)
    }

    // Lógica de redirección inteligente
    const ownerEmail = process.env.OWNER_EMAIL
    revalidatePath('/', 'layout')

    if (email === ownerEmail) {
        redirect('/admin')
    } else {
        redirect('/')
    }
}

export async function signup(formData: FormData) {
    const supabase = await createClient()

    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const firstName = formData.get('firstName') as string
    const lastName = formData.get('lastName') as string
    const phoneNumber = formData.get('phoneNumber') as string

    const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                full_name: `${firstName} ${lastName}`.trim(),
                phone_number: phoneNumber,
            },
        },
    })

    if (error) {
        redirect(`/error?message=${encodeURIComponent(error.message)}`)
    }

    revalidatePath('/', 'layout')
    redirect('/confirm-email')
}
