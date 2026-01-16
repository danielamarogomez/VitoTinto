'use client'

import { createAdminBooking } from '@/app/actions/admin'
import { CalendarIcon, ArrowLeft, Lock } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

export default function NewBookingPage() {
    const [loading, setLoading] = useState(false)

    return (
        <div className="max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="mb-8 flex items-center gap-4">
                <Link href="/admin/bookings" className="p-2 hover:bg-muted rounded-lg transition-colors">
                    <ArrowLeft className="h-6 w-6 text-muted-foreground" />
                </Link>
                <div>
                    <h1 className="text-3xl font-black text-foreground tracking-tight">Nuevo Bloqueo</h1>
                    <p className="text-muted-foreground">Bloquea fechas en el calendario para mantenimiento o uso personal.</p>
                </div>
            </div>

            <div className="bg-card border border-border rounded-2xl p-8 shadow-sm">
                <form
                    action={async (formData) => {
                        await createAdminBooking(formData)
                    }}
                    onSubmit={() => setLoading(true)}
                    className="space-y-8"
                >

                    <div className="space-y-4">
                        <div className="flex items-center gap-2 text-primary font-bold uppercase text-xs tracking-widest mb-2">
                            <CalendarIcon className="h-4 w-4" />
                            Selecciona el periodo
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-foreground">Fecha Inicio</label>
                                <input
                                    type="date"
                                    name="startDate"
                                    required
                                    className="w-full bg-muted/30 border border-border rounded-xl px-4 py-3 text-foreground focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-foreground">Fecha Fin</label>
                                <input
                                    type="date"
                                    name="endDate"
                                    required
                                    className="w-full bg-muted/30 border border-border rounded-xl px-4 py-3 text-foreground focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">Motivo del Bloqueo</label>
                        <input
                            type="text"
                            name="reason"
                            placeholder="Ej: Mantenimiento, Viaje Personal, Reserva Telefónica..."
                            defaultValue="Mantenimiento"
                            className="w-full bg-muted/30 border border-border rounded-xl px-4 py-3 text-foreground focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                        />
                        <p className="text-xs text-muted-foreground">Este texto se guardará como el "Cliente" de la reserva.</p>
                    </div>

                    <div className="bg-yellow-50 border border-yellow-100 rounded-xl p-4 flex gap-3 text-yellow-800 text-sm">
                        <Lock className="h-5 w-5 shrink-0" />
                        <p>Al bloquear estas fechas, dejarán de estar disponibles en el calendario público de inmediato.</p>
                    </div>

                    <div className="pt-4 flex gap-4">
                        <Link
                            href="/admin/bookings"
                            className="flex-1 flex justify-center items-center py-3 rounded-xl font-bold bg-background border border-border hover:bg-muted transition-all"
                        >
                            Cancelar
                        </Link>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 flex justify-center items-center py-3 rounded-xl font-bold bg-primary text-primary-foreground hover:bg-primary/90 transition-all shadow-lg hover:scale-105 active:scale-95 disabled:opacity-70 disabled:scale-100"
                        >
                            {loading ? 'Guardando...' : 'Confirmar Bloqueo'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
