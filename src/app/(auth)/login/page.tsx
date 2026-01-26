"use client"

import { useState } from 'react'
import { login, signup } from '../actions'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import Logo from '@/components/Logo'

export default function LoginPage() {
    const [isLogin, setIsLogin] = useState(true)

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
            <Link
                href="/"
                className="mb-8 flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors group"
            >
                <ChevronLeft className="mr-1 h-4 w-4 transition-transform group-hover:-translate-x-1" />
                Volver al inicio
            </Link>

            <div className="w-full max-w-md space-y-8 rounded-lg border border-border bg-card p-8 shadow-lg">
                <div className="text-center">
                    <Link href="/" className="inline-block mb-4 hover:opacity-80 transition-opacity">
                        <Logo className="h-16 w-auto mx-auto" />
                    </Link>
                    <h2 className="text-3xl font-bold text-primary">Vito Tinto</h2>
                    <p className="mt-2 text-muted-foreground">
                        Inicia sesión para gestionar tus reservas
                    </p>
                </div>

                <form className="mt-8 space-y-6">
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-foreground">
                                Correo Electrónico
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-foreground shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary sm:text-sm"
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-foreground">
                                Contraseña
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                required
                                className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-foreground shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary sm:text-sm"
                            />
                        </div>
                    </div>

                    <div>
                        <button
                            formAction={login}
                            className="flex w-full justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm hover:bg-primary/90 transition-all hover:scale-[1.02] active:scale-[0.98]"
                        >
                            Iniciar sesión
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
