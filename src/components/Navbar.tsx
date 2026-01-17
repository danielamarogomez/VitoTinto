import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import Logo from '@/components/Logo'

export default async function Navbar() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    return (
        <nav className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
            <div className="container flex h-20 items-center mx-auto px-4 max-w-screen-xl justify-between">
                <Link href="/" className="mr-6 flex items-center space-x-3">
                    <Logo className="h-14 w-auto" />
                    <span
                        className="font-bold text-3xl text-primary mt-1"
                        style={{ fontFamily: 'var(--font-patrick), cursive' }}
                    >
                        Vito Tinto
                    </span>
                </Link>
                <div className="hidden md:flex items-center space-x-8">
                    <Link href="/#la-furgo" className="text-sm font-bold text-primary hover:text-primary/70 transition-colors">
                        LA FURGO
                    </Link>
                    <Link href="/#sobre-mi" className="text-sm font-bold text-primary hover:text-primary/70 transition-colors">
                        SOBRE MÍ
                    </Link>
                    <Link href="/#rutas" className="text-sm font-bold text-primary hover:text-primary/70 transition-colors">
                        RUTAS
                    </Link>
                    <Link
                        href="/#reservar"
                        className="bg-primary text-primary-foreground px-5 py-2 rounded-full text-xs font-bold hover:bg-primary/90 transition-all shadow-md transform hover:scale-105"
                    >
                        RESERVAR
                    </Link>
                </div>

                {/* Botón Reservar visible en móvil también */}
                <div className="md:hidden">
                    <Link
                        href="/#reservar"
                        className="bg-primary text-primary-foreground px-4 py-2 rounded-full text-xs font-bold hover:bg-primary/90 transition-all shadow-md"
                    >
                        RESERVAR
                    </Link>
                </div>
            </div>
        </nav>
    )
}
