"use client"

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

function ErrorContent() {
    const searchParams = useSearchParams()
    const message = searchParams.get('message')

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4 text-center">
            <h1 className="text-6xl font-bold text-primary mb-4">¡Ups!</h1>
            <h2 className="text-2xl font-semibold mb-6">Algo ha salido mal</h2>
            <div className="bg-destructive/10 text-destructive p-4 rounded-lg mb-8 max-w-md border border-destructive/20">
                <p className="text-sm font-medium">
                    {message || "Ha ocurrido un error inesperado al procesar tu solicitud."}
                </p>
            </div>
            <Link
                href="/login"
                className="bg-primary text-primary-foreground px-6 py-3 rounded-full font-bold hover:bg-primary/90 transition-all shadow-lg hover:scale-105 active:scale-95"
            >
                Volver a intentarlo
            </Link>
        </div>
    )
}

export default function ErrorPage() {
    return (
        <Suspense fallback={
            <div className="flex min-h-screen items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        }>
            <ErrorContent />
        </Suspense>
    )
}
