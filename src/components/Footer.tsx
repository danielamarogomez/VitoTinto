import Link from 'next/link'
import Logo from '@/components/Logo'

export default function Footer() {
    return (
        <footer className="bg-card border-t border-border mt-auto">
            <div className="container mx-auto px-4 py-12 max-w-screen-xl">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
                    {/* Brand Info */}
                    <div className="md:col-span-2 space-y-6">
                        <Link href="/" className="flex items-center space-x-3">
                            <Logo className="h-10 w-auto" />
                            <span className="font-bold text-primary text-xl tracking-tight">
                                Vito Tinto
                            </span>
                        </Link>
                        <p className="text-muted-foreground max-w-sm">
                            Tu pasaporte a la libertad. Alquilamos furgonetas camper premium para que vivas aventuras inolvidables con el máximo estilo y confort.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div className="space-y-4">
                        <h4 className="font-bold text-foreground uppercase text-xs tracking-widest text-primary/70">Legal</h4>
                        <ul className="space-y-3">
                            <li>
                                <Link href="/terms" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                                    Términos y Condiciones
                                </Link>
                            </li>
                            <li>
                                <Link href="/terms#cancelacion" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                                    Política de Cancelación
                                </Link>
                            </li>
                            <li>
                                <Link href="/terms#seguros" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                                    Seguros y Fianza
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div className="space-y-4">
                        <h4 className="font-bold text-foreground uppercase text-xs tracking-widest text-primary/70">Contacto</h4>
                        <ul className="space-y-3">
                            <li className="text-sm text-muted-foreground">
                                <span className="block font-medium text-foreground">WhatsApp</span>
                                +34 600 000 000
                            </li>
                            <li className="text-sm text-muted-foreground">
                                <span className="block font-medium text-foreground">Email</span>
                                hola@vitotinto.com
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-border mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-xs text-muted-foreground">
                        © {new Date().getFullYear()} Vito Tinto. Todos los derechos reservados.
                    </p>
                    <div className="flex items-center gap-6">
                        <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                            Instagram
                        </a>
                        <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                            Facebook
                        </a>
                        <Link href="/login" className="text-xs text-muted-foreground/50 hover:text-primary transition-colors">
                            Acceso Propietario
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    )
}
