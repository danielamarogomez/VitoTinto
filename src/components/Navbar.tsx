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
                    <span className="font-bold sm:inline-block text-primary text-2xl tracking-tight">
                        Vito Tinto
                    </span>
                </Link>
                <div className="flex items-center">
                    {user ? (
                        <div className="flex gap-6 items-center">
                            <Link href="/admin" className="text-sm font-bold text-primary hover:text-primary/80 transition-colors bg-primary/10 px-4 py-2 rounded-lg">
                                Panel Admin
                            </Link>
                            <form action="/auth/signout" method="post">
                                <button className="text-sm font-medium text-muted-foreground hover:text-red-600 transition-colors cursor-pointer">
                                    Cerrar Sesión
                                </button>
                            </form>
                        </div>
                    ) : null}
                </div>
            </div>
        </nav>
    )
}
