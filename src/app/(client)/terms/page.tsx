import { ShieldCheck, Calendar, CreditCard, AlertTriangle, Info } from 'lucide-react'

export default function TermsPage() {
    return (
        <div className="container mx-auto px-4 py-16 max-w-4xl">
            <header className="text-center mb-16">
                <h1 className="text-4xl font-extrabold text-primary mb-4 tracking-tight">Términos y Condiciones</h1>
                <p className="text-muted-foreground text-lg">
                    Todo lo que necesitas saber para un viaje seguro y sin sorpresas.
                </p>
            </header>

            <div className="space-y-12">
                {/* 1. Requisitos */}
                <section className="space-y-4">
                    <div className="flex items-center gap-3 text-primary">
                        <ShieldCheck className="h-6 w-6" />
                        <h2 className="text-2xl font-bold">1. Requisitos del Conductor</h2>
                    </div>
                    <div className="bg-card border border-border rounded-2xl p-6 shadow-sm space-y-4">
                        <p className="text-muted-foreground leading-relaxed">
                            Para poder disfrutar de la experiencia Vito Tinto, el conductor debe cumplir los siguientes requisitos:
                        </p>
                        <ul className="list-disc list-inside space-y-2 text-muted-foreground pl-4">
                            <li>Tener al menos <span className="text-foreground font-semibold">25 años</span> de edad.</li>
                            <li>Estar en posesión del carnet de conducir tipo B con una antigüedad mínima de <span className="text-foreground font-semibold">2 años</span>.</li>
                            <li>Presentar el DNI o Pasaporte físico y en vigor el día de la recogida.</li>
                        </ul>
                    </div>
                </section>

                {/* 2. Fianza y Pagos */}
                <section id="seguros" className="space-y-4">
                    <div className="flex items-center gap-3 text-primary">
                        <CreditCard className="h-6 w-6" />
                        <h2 className="text-2xl font-bold">2. Fianza y Depósito</h2>
                    </div>
                    <div className="bg-card border border-border rounded-2xl p-6 shadow-sm space-y-4">
                        <p className="text-muted-foreground leading-relaxed">
                            Se requiere una fianza de <span className="text-foreground font-bold text-lg">800€</span> para cubrir posibles daños no incluidos en el seguro o negligencias.
                        </p>
                        <div className="flex items-start gap-3 bg-muted/50 p-4 rounded-xl border border-border">
                            <Info className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                            <p className="text-sm text-muted-foreground">
                                La fianza se depositará mediante tarjeta el día de la entrega y será devuelta íntegramente tras revisar el vehículo (máximo 48h después de la devolución).
                            </p>
                        </div>
                    </div>
                </section>

                {/* 3. Política de Cancelación */}
                <section id="cancelacion" className="space-y-4">
                    <div className="flex items-center gap-3 text-primary">
                        <Calendar className="h-6 w-6" />
                        <h2 className="text-2xl font-bold">3. Política de Cancelación</h2>
                    </div>
                    <div className="bg-card border border-border rounded-2xl p-6 shadow-sm space-y-4">
                        <ul className="space-y-4">
                            <li className="flex gap-4">
                                <div className="h-2 w-2 rounded-full bg-green-500 mt-2 shrink-0" />
                                <div>
                                    <p className="font-bold">Cancelación con más de 30 días:</p>
                                    <p className="text-sm text-muted-foreground">Reembolso del 100% del importe de la reserva.</p>
                                </div>
                            </li>
                            <li className="flex gap-4">
                                <div className="h-2 w-2 rounded-full bg-yellow-500 mt-2 shrink-0" />
                                <div>
                                    <p className="font-bold">Cancelación entre 15 y 30 días:</p>
                                    <p className="text-sm text-muted-foreground">Reembolso del 50% del importe.</p>
                                </div>
                            </li>
                            <li className="flex gap-4">
                                <div className="h-2 w-2 rounded-full bg-red-500 mt-2 shrink-0" />
                                <div>
                                    <p className="font-bold">Cancelación con menos de 15 días:</p>
                                    <p className="text-sm text-muted-foreground">No se realizará reembolso del importe pagado.</p>
                                </div>
                            </li>
                        </ul>
                    </div>
                </section>

                {/* 4. Normas de Uso */}
                <section className="space-y-4">
                    <div className="flex items-center gap-3 text-primary">
                        <AlertTriangle className="h-6 w-6" />
                        <h2 className="text-2xl font-bold">4. Normas y Prohibiciones</h2>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="bg-red-50/50 border border-red-100 rounded-2xl p-6 space-y-4">
                            <h3 className="font-bold text-red-900 uppercase text-xs tracking-wider">No se permite</h3>
                            <ul className="space-y-2 text-sm text-red-800/80">
                                <li>• Fumar dentro del vehículo.</li>
                                <li>• Viajar con más personas de las permitidas (2).</li>
                                <li>• Circular por caminos no asfaltados o fuera de pista.</li>
                                <li>• Salir de la península sin autorización previa.</li>
                            </ul>
                        </div>
                        <div className="bg-primary/5 border border-primary/10 rounded-2xl p-6 space-y-4">
                            <h3 className="font-bold text-primary uppercase text-xs tracking-wider">Mascotas</h3>
                            <p className="text-sm text-muted-foreground">
                                Las mascotas son bienvenidas bajo petición previa y con un suplemento de limpieza. Consultar condiciones específicas antes de reservar.
                            </p>
                        </div>
                    </div>
                </section>
            </div>

            <footer className="mt-20 pt-10 border-t border-border text-center">
                <p className="text-sm text-muted-foreground italic">
                    Al confirmar tu reserva y realizar el pago en Stripe, declaras que has leído y aceptas estos términos y condiciones.
                </p>
            </footer>
        </div>
    )
}
