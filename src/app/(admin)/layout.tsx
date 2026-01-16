import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { LayoutDashboard, Calendar, Users, Settings, LogOut, Home } from 'lucide-react'
import Logo from '@/components/Logo'

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    // Protección: Solo el email del dueño puede entrar
    const ownerEmail = process.env.OWNER_EMAIL
    if (!user || user.email !== ownerEmail) {
        redirect('/')
    }

    return (
        <div className="flex min-h-screen bg-muted/30 font-sans">
            {/* Sidebar */}
            <aside className="w-64 bg-card border-r border-border hidden md:flex flex-col sticky top-0 h-screen">
                <div className="p-6 border-b border-border">
                    <Link href="/admin" className="flex items-center space-x-3">
                        <Logo className="h-8 w-auto text-primary" />
                        <span className="font-bold text-primary tracking-tight">Admin Vito</span>
                    </Link>
                </div>

                <nav className="flex-1 p-4 space-y-2">
                    <Link href="/admin" className="flex items-center gap-3 px-4 py-3 rounded-lg bg-primary/10 text-primary font-bold transition-all">
                        <LayoutDashboard className="h-5 w-5" />
                        Dashboard
                    </Link>
                    <Link href="/admin/bookings" className="flex items-center gap-3 px-4 py-3 rounded-lg text-muted-foreground hover:bg-accent hover:text-foreground transition-all">
                        <Calendar className="h-5 w-5" />
                        Reservas
                    </Link>
                    <Link href="/admin/users" className="flex items-center gap-3 px-4 py-3 rounded-lg text-muted-foreground hover:bg-accent hover:text-foreground transition-all">
                        <Users className="h-5 w-5" />
                        Clientes
                    </Link>
                </nav>

                <div className="p-4 border-t border-border space-y-2">
                    <Link href="/" className="flex items-center gap-3 px-4 py-3 rounded-lg text-muted-foreground hover:bg-accent transition-all">
                        <Home className="h-5 w-5" />
                        Ver Web
                    </Link>
                    <form action="/auth/signout" method="post">
                        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-500 hover:bg-red-50 transition-all font-medium">
                            <LogOut className="h-5 w-5" />
                            Salir
                        </button>
                    </form>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col min-w-0">
                <header className="h-16 bg-card border-b border-border flex items-center justify-between px-8 sticky top-0 z-10">
                    <div className="md:hidden">
                        <Logo className="h-8 w-auto text-primary" />
                    </div>
                    <div className="flex items-center gap-4">
                        <span className="text-sm text-muted-foreground hidden sm:block">Panel de Control</span>
                        <div className="h-8 w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">
                            AD
                        </div>
                    </div>
                </header>

                <div className="p-8">
                    {children}
                </div>
            </main>
        </div>
    )
}
