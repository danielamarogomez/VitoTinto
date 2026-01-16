import Link from 'next/link'
import { CheckCircle2, Calendar, MapPin, ArrowRight } from 'lucide-react'

export default function SuccessPage() {
    return (
        <div className="flex min-h-[80vh] flex-col items-center justify-center bg-background p-4 text-center">
            <div className="w-full max-w-2xl space-y-8 rounded-2xl border border-border bg-card p-8 md:p-12 shadow-2xl">
                <div className="flex justify-center">
                    <div className="p-4 bg-green-500/10 rounded-full text-green-500 animate-bounce">
                        <CheckCircle2 className="h-16 w-16" />
                    </div>
                </div>

                <div className="space-y-2">
                    <h1 className="text-4xl font-extrabold text-primary tracking-tight">¡Reserva Confirmada!</h1>
                    <p className="text-muted-foreground text-lg">
                        Tu aventura con Vito Tinto está a punto de comenzar.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-6 py-8 border-y border-border my-8">
                    <div className="flex items-start gap-4 text-left">
                        <div className="p-2 bg-primary/10 rounded-lg text-primary mt-1">
                            <Calendar className="h-5 w-5" />
                        </div>
                        <div>
                            <h3 className="font-bold text-foreground">Confirmación enviada</h3>
                            <p className="text-sm text-muted-foreground">Revisa tu correo electrónico para ver los detalles y el contrato.</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-4 text-left">
                        <div className="p-2 bg-primary/10 rounded-lg text-primary mt-1">
                            <MapPin className="h-5 w-5" />
                        </div>
                        <div>
                            <h3 className="font-bold text-foreground">Próximos pasos</h3>
                            <p className="text-sm text-muted-foreground">Nos pondremos en contacto contigo para coordinar la entrega.</p>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                    <Link
                        href="/dashboard"
                        className="flex items-center justify-center bg-primary text-primary-foreground px-8 py-4 rounded-full font-bold hover:bg-primary/90 transition-all shadow-lg hover:scale-105 active:scale-95"
                    >
                        Ver mis reservas
                        <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                    <Link
                        href="/"
                        className="flex items-center justify-center border border-input bg-background px-8 py-4 rounded-full font-bold hover:bg-accent transition-all"
                    >
                        Volver al inicio
                    </Link>
                </div>

                <p className="text-xs text-muted-foreground mt-8 italic">
                    ¿Tienes alguna duda? Escríbenos directamente por WhatsApp.
                </p>
            </div>
        </div>
    )
}
