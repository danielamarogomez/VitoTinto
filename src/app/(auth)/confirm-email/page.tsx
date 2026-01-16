import Link from 'next/link'
import { MailCheck } from 'lucide-react'

export default function ConfirmEmailPage() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4 text-center">
            <div className="w-full max-w-md space-y-8 rounded-lg border border-border bg-card p-8 shadow-lg">
                <div className="flex justify-center">
                    <div className="p-4 bg-primary/10 rounded-full text-primary">
                        <MailCheck className="h-12 w-12" />
                    </div>
                </div>

                <h1 className="text-3xl font-bold text-primary">¡Casi listo!</h1>

                <div className="space-y-4">
                    <p className="text-foreground font-medium">
                        Hemos enviado un enlace de confirmación a tu correo electrónico.
                    </p>
                    <p className="text-muted-foreground text-sm">
                        Por favor, revisa tu bandeja de entrada (y la carpeta de spam) y haz clic en el enlace para activar tu cuenta.
                    </p>
                </div>

                <div className="pt-6">
                    <Link
                        href="/login"
                        className="text-sm font-semibold text-primary hover:underline transition-all"
                    >
                        Volver a la pantalla de acceso
                    </Link>
                </div>
            </div>
        </div>
    )
}
