"use client"

import { useState, useEffect } from "react"
import { addDays, format, eachDayOfInterval } from "date-fns"
import { es, enUS } from "date-fns/locale"
import { Calendar } from "@/components/ui/calendar"
import { DateRange } from "react-day-picker"
import { toast } from "sonner"
import { getBusyDates } from "@/app/actions/booking"
import { createBookingRequest } from "@/app/actions/booking-request"
import { useLanguage } from "@/context/LanguageContext"

export default function BookingWidget() {
    const { t, language } = useLanguage()
    const [date, setDate] = useState<DateRange | undefined>()
    const [busyDates, setBusyDates] = useState<Date[]>([])
    const [loading, setLoading] = useState(false)
    const [showForm, setShowForm] = useState(false)
    const [selectedExtras, setSelectedExtras] = useState<string[]>([])

    // Definir los extras dinámicamente según el idioma
    const EXTRA_SERVICES = [
        { id: 'baby_seat', name: t.booking.extras.babySeat, price: 10, perDay: true },
        { id: 'snorkel_pack', name: t.booking.extras.snorkelPack, price: 5, perDay: true },
        { id: 'paddle_surf_pro', name: t.booking.extras.paddleSurfPro, price: 50, perDay: true },
        { id: 'personalized_guide', name: t.booking.extras.personalizedGuide, price: 50, perDay: false },
    ]

    // Locale dinámico
    const currentLocale = language === 'es' ? es : enUS

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
        if (!date?.from || !date?.to) return 0
        const days = eachDayOfInterval({ start: date.from, end: addDays(date.to, -1) }).length

        return selectedExtras.reduce((acc, extraId) => {
            const extra = EXTRA_SERVICES.find(e => e.id === extraId)
            if (!extra) return acc
            const price = extra.perDay ? extra.price * days : extra.price
            return acc + price
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
            toast.error(t.booking.invalidSelection, { description: t.booking.invalidSelectionDesc })
            return
        }
        setShowForm(true)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!date?.from || !date?.to) return
        if (!formData.name || !formData.email || !formData.phone) {
            toast.error(t.booking.requiredFields, { description: t.booking.requiredFieldsDesc })
            return
        }

        setLoading(true)
        try {
            const totalPrice = calculateTotal(date.from, date.to)
            const days = eachDayOfInterval({ start: date.from, end: addDays(date.to, -1) }).length
            const extrasData = selectedExtras.map(id => {
                const extra = EXTRA_SERVICES.find(e => e.id === id)
                if (!extra) return null
                return {
                    id: extra.id,
                    name: extra.name,
                    price: extra.perDay ? extra.price * days : extra.price
                }
            }).filter(Boolean) as { id: string; name: string; price: number }[]

            await createBookingRequest({
                startDate: format(date.from, 'yyyy-MM-dd'),
                endDate: format(date.to, 'yyyy-MM-dd'),
                totalPrice,
                customerName: formData.name,
                customerEmail: formData.email,
                customerPhone: formData.phone,
                customerMessage: formData.message,
                extras: extrasData,
                preferredLanguage: language // Enviamos el idioma seleccionado
            })

            toast.success(t.booking.requestSent, {
                description: t.booking.requestSentDesc
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

    const handleSelectDate = (range: DateRange | undefined) => {
        if (range?.from && range?.to) {
            // Verificar si hay días ocupados en el rango seleccionado
            const interval = eachDayOfInterval({ start: range.from, end: range.to })
            const hasBusyDates = interval.some(date => isDateDisabled(date))

            if (hasBusyDates) {
                toast.error(t.booking.invalidSelection, {
                    description: t.booking.invalidSelectionDesc
                })
                // Mantenemos solo la fecha de inicio
                setDate({ from: range.from, to: undefined })
                return
            }
        }
        setDate(range)
    }

    return (
        <div className="w-full max-w-md mx-auto">
            <div className="bg-card border border-border rounded-2xl shadow-xl p-6">
                <h2 className="text-2xl font-black text-primary mb-2">{t.booking.title}</h2>
                <p className="text-sm text-muted-foreground mb-6">
                    {t.booking.subtitle}
                </p>

                {!showForm ? (
                    <>
                        <Calendar
                            mode="range"
                            selected={date}
                            onSelect={handleSelectDate}
                            numberOfMonths={1}
                            locale={currentLocale}
                            disabled={isDateDisabled}
                        />

                        <div className="mt-6 w-full space-y-4">
                            <div className="flex justify-between text-sm p-3 bg-muted rounded-lg">
                                <div>
                                    <span className="block text-muted-foreground text-xs">{t.booking.checkIn}</span>
                                    <span className="font-medium">{date?.from ? format(date.from, 'dd MMM yyyy', { locale: currentLocale }) : '-'}</span>
                                </div>
                                <div className="text-right">
                                    <span className="block text-muted-foreground text-xs">{t.booking.checkOut}</span>
                                    <span className="font-medium">{date?.to ? format(date.to, 'dd MMM yyyy', { locale: currentLocale }) : '-'}</span>
                                </div>
                            </div>

                            <div className="pt-2">
                                <button
                                    className="w-full bg-primary text-primary-foreground py-3 rounded-lg font-bold shadow hover:bg-primary/90 transition-all transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                                    disabled={!date?.from || !date?.to}
                                    onClick={handleContinue}
                                >
                                    {t.booking.continue}
                                </button>
                                <p className="text-xs text-center text-muted-foreground mt-2">
                                    {t.booking.basePrice}: <span className="text-primary font-bold text-sm">
                                        {date?.from && date?.to ? `${calculateBasePrice(date.from, date.to)}€` : '0€'}
                                    </span>
                                </p>
                            </div>
                        </div>
                    </>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="bg-muted/30 p-4 rounded-lg mb-4 border border-border/50">
                            <div className="flex justify-between items-center mb-4 pb-4 border-b border-border/50">
                                <div>
                                    <p className="text-sm font-medium">{t.booking.selectedDates}</p>
                                    <p className="text-xs text-muted-foreground capitalize">
                                        {date?.from && format(date.from, 'dd MMM', { locale: currentLocale })} - {date?.to && format(date.to, 'dd MMM yyyy', { locale: currentLocale })}
                                    </p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setShowForm(false)}
                                    className="text-xs text-primary hover:underline font-medium"
                                >
                                    {t.booking.change}
                                </button>
                            </div>

                            {/* Extras Selection */}
                            <div className="space-y-3 mb-4">
                                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                                    <span>{t.booking.personalize}</span>
                                </p>
                                <div className="grid grid-cols-1 gap-2">
                                    {EXTRA_SERVICES.map((extra) => (
                                        <div
                                            key={extra.id}
                                            onClick={() => toggleExtra(extra.id)}
                                            className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all bg-background ${selectedExtras.includes(extra.id)
                                                ? 'border-primary ring-1 ring-primary shadow-sm'
                                                : 'border-border hover:border-primary/50'
                                                }`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${selectedExtras.includes(extra.id) ? 'bg-primary border-primary' : 'border-muted-foreground'
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

                            <div className="flex justify-between items-center pt-3 border-t border-border">
                                <span className="font-medium text-sm">{t.booking.totalEstimated}</span>
                                <p className="text-xl font-black text-primary">
                                    {date?.from && date?.to && `${calculateTotal(date.from, date.to)}€`}
                                </p>
                            </div>
                            <p className="text-[10px] text-right text-muted-foreground mt-1">{t.booking.vatIncluded}</p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">{t.booking.fullName}</label>
                            <input
                                type="text"
                                required
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                placeholder={t.booking.fullNamePlaceholder}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">{t.booking.email}</label>
                            <input
                                type="email"
                                required
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                placeholder={t.booking.emailPlaceholder}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">{t.booking.phone}</label>
                            <input
                                type="tel"
                                required
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                placeholder={t.booking.phonePlaceholder}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">{t.booking.message}</label>
                            <textarea
                                value={formData.message}
                                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                                rows={3}
                                placeholder={t.booking.messagePlaceholder}
                            />
                        </div>

                        <div className="flex gap-2 pt-2">
                            <button
                                type="button"
                                onClick={() => setShowForm(false)}
                                className="flex-1 border border-border py-3 rounded-lg font-medium hover:bg-muted transition-colors"
                            >
                                {t.booking.back}
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex-1 bg-primary text-primary-foreground py-3 rounded-lg font-bold shadow hover:bg-primary/90 transition-all transform active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {loading ? (
                                    <>
                                        <div className="h-4 w-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                                        {t.booking.sending}
                                    </>
                                ) : t.booking.sendRequest}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    )
}
