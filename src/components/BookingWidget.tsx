"use client"

import { useState, useEffect } from "react"
import { addDays, format, differenceInDays, eachDayOfInterval, isSameDay } from "date-fns"
import { es } from "date-fns/locale"
import { Calendar } from "@/components/ui/calendar"
import { DateRange } from "react-day-picker"
import { toast } from "sonner"
import { createBooking, getBusyDates } from "@/app/actions/booking"
import { createCheckoutSession } from "@/app/actions/stripe"

export default function BookingWidget() {

    const [date, setDate] = useState<DateRange | undefined>() // Sin selección inicial

    const [busyDates, setBusyDates] = useState<Date[]>([])
    const [loading, setLoading] = useState(false)



    // Cargar fechas ocupadas al montar
    useEffect(() => {
        async function loadBusyDates() {
            try {
                const ranges = await getBusyDates()

                const dates: Date[] = []
                ranges.forEach((range: any) => {
                    // Truco: Reemplazar - por / fuerza al navegador a usar hora local en lugar de UTC
                    // Así 2026-01-20 se convierte en "2026/01/20" -> 00:00 hora local
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

    const calculatePrice = (from: Date, to: Date) => {
        const interval = eachDayOfInterval({ start: from, end: addDays(to, -1) }) // Se cobra por noches
        let total = 0
        interval.forEach(day => {
            const month = day.getMonth() // 0-11
            // Alta: Mayo (4) a Octubre (9) -> 135€ (IVA incluido)
            // Baja: Noviembre (10) a Abril (3) -> 115€ (IVA incluido)
            if (month >= 4 && month <= 9) {
                total += 135
            } else {
                total += 115
            }
        })
        return total
    }

    const handleBooking = async () => {
        if (!date?.from || !date?.to) return

        setLoading(true)
        const formData = new FormData()
        formData.append('startDate', format(date.from, 'yyyy-MM-dd'))
        formData.append('endDate', format(date.to, 'yyyy-MM-dd'))

        const price = calculatePrice(date.from, date.to)
        formData.append('totalPrice', price.toString())

        try {
            // Esta función redirigirá automáticamente a Stripe
            await createCheckoutSession(formData)
        } catch (e) {
            toast.error('Error', { description: 'No se pudo iniciar la pasarela de pago.' })
            setLoading(false)
        }
    }

    // Deshabilitar fechas pasadas y ocupadas
    const isDateDisabled = (day: Date) => {
        const today = new Date()
        today.setHours(0, 0, 0, 0)

        // 1. Deshabilitar días pasados (ayer y anteriores)
        if (day < today) return true

        // 2. Deshabilitar días ocupados
        return busyDates.some(busyDay => isSameDay(busyDay, day))
    }

    return (
        <div className="md:w-[400px] w-full bg-card border-border border rounded-xl shadow-xl overflow-hidden">
            <div className="bg-primary p-4 text-primary-foreground text-center">
                <h3 className="font-bold text-lg">Reserva tu Aventura</h3>
                <p className="text-sm opacity-90">Selecciona tus fechas de viaje</p>
            </div>

            <div className="p-6 flex flex-col items-center">
                <Calendar
                    mode="range"
                    defaultMonth={date?.from}
                    selected={date}
                    onSelect={(range) => {
                        if (range?.from && range?.to) {
                            // Validar que no haya días ocupados en medio del rango
                            const daysInRange = eachDayOfInterval({ start: range.from, end: range.to })
                            const hasBusyDay = daysInRange.some(day =>
                                busyDates.some(busyDay => isSameDay(busyDay, day))
                            )

                            if (hasBusyDay) {
                                toast.error('Fechas no disponibles', {
                                    description: 'El rango seleccionado incluye días que ya están reservados.'
                                })
                                // Solo seleccionamos el día de inicio para forzar al usuario a elegir otro final
                                setDate({ from: range.from, to: undefined })
                                return
                            }
                        }
                        setDate(range)
                    }}
                    numberOfMonths={1}
                    locale={es}
                    disabled={isDateDisabled}
                />

                <div className="mt-6 w-full space-y-4">
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
                            className="w-full bg-primary text-primary-foreground py-3 rounded-lg font-bold shadow hover:bg-primary/90 transition-all transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
                            disabled={!date?.from || !date?.to || loading}
                            onClick={handleBooking}
                        >
                            {loading ? (
                                <>
                                    <div className="h-4 w-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                                    Preparando pago...
                                </>
                            ) : 'Solicitar Reserva'}
                        </button>
                        <p className="text-xs text-center text-muted-foreground mt-2">
                            Precio total: <span className="text-primary font-bold text-sm">
                                {date?.from && date?.to ? `${calculatePrice(date.from, date.to)}€` : '0€'}
                            </span>
                            {date?.from && date?.to && <span className="block text-[10px] mt-0.5">* IVA incluido</span>}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
