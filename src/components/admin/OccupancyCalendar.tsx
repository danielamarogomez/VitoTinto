"use client"

import { useState } from 'react'
import {
    format,
    startOfMonth,
    endOfMonth,
    eachDayOfInterval,
    isSameDay,
    addMonths,
    subMonths,
    startOfWeek,
    endOfWeek,
    isToday,
    parseISO,
    isWithinInterval
} from 'date-fns'
import { es } from 'date-fns/locale'
import { ChevronLeft, ChevronRight, User, Lock, Calendar as CalendarIcon } from 'lucide-react'

interface Booking {
    id: string
    start_date: string
    end_date: string
    customer_name: string
    status: string
}

export default function OccupancyCalendar({ bookings }: { bookings: Booking[] }) {
    const [currentDate, setCurrentDate] = useState(new Date())

    const monthStart = startOfMonth(currentDate)
    const monthEnd = endOfMonth(monthStart)
    const startDate = startOfWeek(monthStart, { weekStartsOn: 1 })
    const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 })

    const calendarDays = eachDayOfInterval({
        start: startDate,
        end: endDate,
    })

    const getBookingForDay = (day: Date) => {
        return bookings.find(b => {
            const start = parseISO(b.start_date)
            const end = parseISO(b.end_date)
            // Usamos isWithinInterval para ver si el día cae dentro del rango de reserva
            return isWithinInterval(day, { start, end })
        })
    }

    const nextMonth = () => setCurrentDate(addMonths(currentDate, 1))
    const prevMonth = () => setCurrentDate(subMonths(currentDate, 1))

    return (
        <div className="bg-card border border-border rounded-2xl shadow-xl overflow-hidden">
            <div className="p-6 border-b border-border flex items-center justify-between bg-white">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-xl text-primary">
                        <CalendarIcon className="h-6 w-6" />
                    </div>
                    <h2 className="text-2xl font-black capitalize tracking-tight">
                        {format(currentDate, 'MMMM yyyy', { locale: es })}
                    </h2>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={prevMonth}
                        className="p-2.5 hover:bg-accent rounded-full transition-all border border-border shadow-sm active:scale-90"
                    >
                        <ChevronLeft className="h-5 w-5" />
                    </button>
                    <button
                        onClick={nextMonth}
                        className="p-2.5 hover:bg-accent rounded-full transition-all border border-border shadow-sm active:scale-90"
                    >
                        <ChevronRight className="h-5 w-5" />
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-7 border-b border-border bg-muted/5">
                {['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map(day => (
                    <div key={day} className="py-4 text-center text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">
                        {day}
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-7">
                {calendarDays.map((day, idx) => {
                    const booking = getBookingForDay(day)
                    const isOutsideMonth = !isSameDay(startOfMonth(day), monthStart)

                    // Lógica para el estilo "continuo" (Airbnb)
                    const isStart = booking ? isSameDay(parseISO(booking.start_date), day) : false
                    const isEnd = booking ? isSameDay(parseISO(booking.end_date), day) : false
                    const isMonday = day.getDay() === 1
                    const isSunday = day.getDay() === 0

                    return (
                        <div
                            key={idx}
                            className={`min-h-[110px] border-r border-b border-border relative transition-colors p-1 ${isOutsideMonth ? 'bg-muted/5 opacity-30' : 'bg-card'
                                } ${isToday(day) ? 'bg-primary/[0.02]' : ''}`}
                        >
                            <div className="flex justify-between items-start mb-1 px-1 pt-1">
                                <span className={`text-sm font-black ${isToday(day) ? 'text-primary' : 'text-muted-foreground/60'}`}>
                                    {format(day, 'd')}
                                </span>
                            </div>

                            {booking && (
                                <div className={`h-8 flex items-center shadow-sm relative z-10 transition-all ${booking.status === 'blocked'
                                        ? 'bg-zinc-200 text-zinc-700'
                                        : 'bg-primary text-white'
                                    } ${isStart || isMonday ? 'rounded-l-full ml-1' : '-ml-1'
                                    } ${isEnd || isSunday ? 'rounded-r-full mr-1' : '-mr-1'
                                    }`}>
                                    <div className="px-3 flex items-center gap-1.5 overflow-hidden w-full">
                                        {(isStart || isMonday) && (
                                            <>
                                                {booking.status === 'blocked'
                                                    ? <Lock className="h-3 w-3 shrink-0" />
                                                    : <User className="h-3 w-3 shrink-0" />
                                                }
                                                <span className="text-[10px] font-bold truncate uppercase tracking-wider">
                                                    {booking.status === 'blocked' ? 'Bloqueado' : booking.customer_name}
                                                </span>
                                            </>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    )
                })}
            </div>

            {/* Legend */}
            <div className="p-4 bg-muted/20 border-t border-border flex gap-6 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-primary"></div>
                    <span>Reserva Cliente</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-zinc-300"></div>
                    <span>Mantenimiento / Bloqueado</span>
                </div>
            </div>
        </div>
    )
}
