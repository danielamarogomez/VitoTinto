"use client"

import { useState, useEffect } from "react"
import { addDays, format, eachDayOfInterval } from "date-fns"
import { es } from "date-fns/locale"
import { Calendar } from "@/components/ui/calendar"
import { DateRange } from "react-day-picker"
import { toast } from "sonner"
import { getBusyDates } from "@/app/actions/booking"
import { createBookingRequest } from "@/app/actions/booking-request"

const EXTRA_SERVICES = [
    { id: 'baby_seat', name: 'Sillita de bebé', price: 30 },
    { id: 'paddle_surf', name: 'Paddle Surf', price: 50 },
    { id: 'surf_kit', name: 'Kit de Surf', price: 40 },
]

export default function BookingWidget() {
    const [date, setDate] = useState<DateRange | undefined>()
    const [busyDates, setBusyDates] = useState<Date[]>([])
    const [loading, setLoading] = useState(false)
    const [showForm, setShowForm] = useState(false)
    const [selectedExtras, setSelectedExtras] = useState<string[]>([])

    // Datos del formulario
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        message: ''
    })

    // Cargar fechas ocupadas al montar
    useEffect(() => {
        async function loadBusyDates() {
            try {
                const ranges = await getBusyDates()
                const dates: Date[] = []
                ranges.forEach((range: any) => {
                    const startOriginal = range.start_date.replace(/-/g, '/')
                    const endOriginal = range.end_date.replace(/-/g, '/')
                    const start = new Date(startOriginal)
                    const end = new Date(endOriginal)
                    const interval = eachDayOfInterval({ start, end })
                    dates.push(...interval)
                })
                setBusyDates(dates)
            } catch (error) {
                console.error("Error loading busy dates", error)
            }
        }
        loadBusyDates()
    }, [])

    const calculateBasePrice = (from: Date, to: Date) => {
        const interval = eachDayOfInterval({ start: from, end: addDays(to, -1) })
        let total = 0
        interval.forEach(day => {
            const month = day.getMonth()
            if (month >= 4 && month <= 9) {
                total += 135 // Temporada alta (IVA incluido)
            } else {
                total += 115 // Temporada baja (IVA incluido)
            }
        })
        return total
    }

    const calculateExtrasPrice = () => {
        return selectedExtras.reduce((acc, extraId) => {
            const extra = EXTRA_SERVICES.find(e => e.id === extraId)
            return acc + (extra?.price || 0)
        }, 0)
    }

    const calculateTotal = (from: Date, to: Date) => {
        return calculateBasePrice(from, to) + calculateExtrasPrice()
    }

    const toggleExtra = (extraId: string) => {
        setSelectedExtras(prev =>
            prev.includes(extraId)
                ? prev.filter(id => id !== extraId)
                : [...prev, extraId]
        )
    }

    const isDateDisabled = (day: Date) => {
        return busyDates.some(busyDate =>
            day.getFullYear() === busyDate.getFullYear() &&
            day.getMonth() === busyDate.getMonth() &&
            day.getDate() === busyDate.getDate()
        )
    }

    const handleContinue = () => {
        if (!date?.from || !date?.to) {
            toast.error('Selecciona las fechas', { description: 'Por favor selecciona fecha de entrada y salida' })
            return
        }
        setShowForm(true)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!date?.from || !date?.to) return
        if (!formData.name || !formData.email || !formData.phone) {
            toast.error('Campos requeridos', { description: 'Por favor completa todos los campos obligatorios' })
            return
        }

        setLoading(true)
        try {
            const totalPrice = calculateTotal(date.from, date.to)
            const extrasData = selectedExtras.map(id => EXTRA_SERVICES.find(e => e.id === id)).filter(Boolean) as { id: string; name: string; price: number }[]

            await createBookingRequest({
                startDate: format(date.from, 'yyyy-MM-dd'),
                endDate: format(date.to, 'yyyy-MM-dd'),
                totalPrice,
                customerName: formData.name,
                customerEmail: formData.email,
                customerPhone: formData.phone,
                customerMessage: formData.message,
                extras: extrasData // Enviamos los extras
            })

            toast.success('¡Solicitud enviada!', {
                description: 'Andrea revisará tu solicitud y te contactará pronto para confirmar la disponibilidad.'
            })

            // Resetear formulario
            setDate(undefined)
            setFormData({ name: '', email: '', phone: '', message: '' })
            setSelectedExtras([])
            setShowForm(false)
        } catch (error: any) {
            toast.error('Error', { description: error.message || 'No se pudo enviar la solicitud' })
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="w-full max-w-md mx-auto">
            <div className="bg-card border border-border rounded-2xl shadow-xl p-6">
                <h2 className="text-2xl font-black text-primary mb-2">Reserva tu Aventura</h2>
                <p className="text-sm text-muted-foreground mb-6">
                    Selecciona tus fechas y te confirmaremos la disponibilidad
                </p>

                {!showForm ? (
                    <>
                        <Calendar
                            mode="range"
                            selected={date}
                            onSelect={setDate}
                            numberOfMonths={1}
                            locale={es}
                            disabled={isDateDisabled}
                        />

                        <div className="mt-6 w-full space-y-4">
                            {/* Extras Selection */}
                            <div className="space-y-2">
                                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Servicios Extra</p>
                                <div className="grid grid-cols-1 gap-2">
                                    {EXTRA_SERVICES.map((extra) => (
                                        <div
                                            key={extra.id}
                                            onClick={() => toggleExtra(extra.id)}
                                            className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all ${selectedExtras.includes(extra.id)
                                                ? 'border-primary bg-primary/5 ring-1 ring-primary'
                                                : 'border-border hover:border-primary/50'
                                                }`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className={`w-4 h-4 rounded border flex items-center justify-center ${selectedExtras.includes(extra.id) ? 'bg-primary border-primary' : 'border-muted-foreground'
                                                    }`}>
                                                    {selectedExtras.includes(extra.id) && <div className="w-2 h-2 bg-white rounded-sm" />}
                                                </div>
                                                <span className="text-sm font-medium">{extra.name}</span>
                                            </div>
                                            <span className="text-sm font-bold text-primary">+{extra.price}€</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="flex justify-between text-sm p-3 bg-muted rounded-lg">
                                <div>
                                    <span className="block text-muted-foreground text-xs">CHECK-IN</span>
                                    <span className="font-medium">{date?.from ? format(date.from, 'dd MMM yyyy', { locale: es }) : '-'}</span>
                                </div>
                                <div className="text-right">
                                    <span className="block text-muted-foreground text-xs">CHECK-OUT</span>
                                    <span className="font-medium">{date?.to ? format(date.to, 'dd MMM yyyy', { locale: es }) : '-'}</span>
                                </div>
                            </div>

                            <div className="pt-2">
                                <button
                                    className="w-full bg-primary text-primary-foreground py-3 rounded-lg font-bold shadow hover:bg-primary/90 transition-all transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                                    disabled={!date?.from || !date?.to}
                                    onClick={handleContinue}
                                >
                                    Consultar Disponibilidad
                                </button>
                                <p className="text-xs text-center text-muted-foreground mt-2">
                                    Precio estimado: <span className="text-primary font-bold text-sm">
                                        {date?.from && date?.to ? `${calculateTotal(date.from, date.to)}€` : '0€'}
                                    </span>
                                    {date?.from && date?.to && <span className="block text-[10px] mt-0.5">* IVA incluido | Extras incluidos</span>}
                                </p>
                            </div>
                        </div>
                    </>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="bg-muted/50 p-4 rounded-lg mb-4">
                            <p className="text-sm font-medium mb-1">Fechas seleccionadas:</p>
                            <p className="text-xs text-muted-foreground">
                                {date?.from && format(date.from, 'dd MMM', { locale: es })} - {date?.to && format(date.to, 'dd MMM yyyy', { locale: es })}
                            </p>

                            {selectedExtras.length > 0 && (
                                <div className="mt-2 pt-2 border-t border-border/50">
                                    <p className="text-xs text-muted-foreground mb-1">Extras:</p>
                                    <div className="flex flex-wrap gap-1">
                                        {selectedExtras.map(id => {
                                            const extra = EXTRA_SERVICES.find(e => e.id === id)
                                            return extra ? (
                                                <span key={id} className="text-[10px] bg-background border px-2 py-0.5 rounded-full">
                                                    {extra.name} (+{extra.price}€)
                                                </span>
                                            ) : null
                                        })}
                                    </div>
                                </div>
                            )}

                            <p className="text-sm font-bold text-primary mt-3 pt-2 border-t border-border">
                                Total: {date?.from && date?.to && `${calculateTotal(date.from, date.to)}€`} <span className="text-[10px] font-normal">IVA incl.</span>
                            </p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Nombre completo *</label>
                            <input
                                type="text"
                                required
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                placeholder="Tu nombre"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Email *</label>
                            <input
                                type="email"
                                required
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                placeholder="tu@email.com"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Teléfono *</label>
                            <input
                                type="tel"
                                required
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                placeholder="+34 600 000 000"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Mensaje (opcional)</label>
                            <textarea
                                value={formData.message}
                                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                                rows={3}
                                placeholder="¿Alguna pregunta o petición especial?"
                            />
                        </div>

                        <div className="flex gap-2 pt-2">
                            <button
                                type="button"
                                onClick={() => setShowForm(false)}
                                className="flex-1 border border-border py-3 rounded-lg font-medium hover:bg-muted transition-colors"
                            >
                                Volver
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex-1 bg-primary text-primary-foreground py-3 rounded-lg font-bold shadow hover:bg-primary/90 transition-all transform active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {loading ? (
                                    <>
                                        <div className="h-4 w-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                                        Enviando...
                                    </>
                                ) : 'Enviar Solicitud'}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    )
}
