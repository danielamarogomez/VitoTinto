"use client"

import { useState } from "react"
import { format, isSameMonth, parseISO, addMonths, subMonths } from "date-fns"
import { es } from "date-fns/locale"
import {
    Calendar,
    CheckCircle2,
    Clock,
    XCircle,
    MoreVertical,
    ChevronLeft,
    ChevronRight,
    Download,
    Filter
} from "lucide-react"
import { DeleteBookingButton } from "@/components/admin/DeleteBookingButton"
import { BookingActions } from "@/components/admin/BookingActions"

import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"

export function BookingsManager({ bookings }: { bookings: any[] }) {
    const [allBookings, setAllBookings] = useState(bookings)
    const [currentMonth, setCurrentMonth] = useState<Date>(new Date())
    const [viewMode, setViewMode] = useState<'month' | 'all'>('month')
    const [searchTerm, setSearchTerm] = useState("")

    const handleDeleteSuccess = (deletedId: string) => {
        setAllBookings(prev => prev.filter(b => b.id !== deletedId))
    }

    // Filtrar reservas
    const filteredBookings = allBookings.filter(booking => {
        const date = parseISO(booking.start_date)
        const matchesMonth = viewMode === 'all' || isSameMonth(date, currentMonth)

        const searchLower = searchTerm.toLowerCase()
        const matchesSearch =
            booking.customer_name?.toLowerCase().includes(searchLower) ||
            booking.customer_email?.toLowerCase().includes(searchLower) ||
            booking.id.toLowerCase().includes(searchLower)

        return matchesMonth && matchesSearch
    })

    // Calcular totales del periodo visible
    const totalRevenue = filteredBookings
        .filter(b => b.status === 'confirmed' || b.status === 'paid')
        .reduce((acc, curr) => acc + (curr.total_price || 0), 0)

    const handleExportPDF = () => {
        const doc = new jsPDF()

        // --- Título y Estilo ---
        doc.setFontSize(24)
        doc.setFont("helvetica", "bold")
        doc.text("VITO TINTO", 14, 20)

        doc.setFontSize(10)
        doc.setTextColor(100)
        doc.setFont("helvetica", "normal")
        const subtitulo = viewMode === 'month'
            ? `Reporte de Reservas - ${format(currentMonth, 'MMMM yyyy', { locale: es })}`
            : "Reporte Histórico de Reservas"
        doc.text(subtitulo, 14, 28)
        doc.text(`Generado el: ${format(new Date(), 'dd/MM/yyyy HH:mm')}`, 14, 33)

        // --- Línea decorativa ---
        doc.setDrawColor(0)
        doc.setLineWidth(0.5)
        doc.line(14, 38, 196, 38)

        // --- Resumen ---
        doc.setFontSize(12)
        doc.setTextColor(0)
        doc.text(`Total Reservas: ${filteredBookings.length}`, 14, 48)
        doc.setFont("helvetica", "bold")
        doc.text(`Ingresos Totales: ${totalRevenue}€`, 140, 48)

        // --- Tabla ---
        const rows = filteredBookings.map(b => [
            format(parseISO(b.start_date), 'dd/MM/yy'),
            format(parseISO(b.end_date), 'dd/MM/yy'),
            b.customer_name,
            b.customer_email,
            b.status === 'confirmed' ? 'CONFIRMADO' :
                b.status === 'blocked' ? 'BLOQUEO' : 'PENDIENTE',
            `${b.total_price}€`
        ])

        autoTable(doc, {
            startY: 55,
            head: [['INICIO', 'FIN', 'CLIENTE', 'EMAIL', 'ESTADO', 'PRECIO']],
            body: rows,
            headStyles: {
                fillColor: [0, 0, 0],
                textColor: [255, 255, 255],
                fontStyle: 'bold',
                halign: 'center'
            },
            styles: { fontSize: 9, cellPadding: 4 },
            columnStyles: {
                5: { halign: 'right', fontStyle: 'bold' }
            },
            alternateRowStyles: { fillColor: [250, 250, 250] }
        })

        const fileName = viewMode === 'month'
            ? `VitoTinto_${format(currentMonth, 'yyyy_MM')}.pdf`
            : `VitoTinto_Historico.pdf`
        doc.save(fileName)
    }

    return (
        <div className="space-y-6">
            {/* Toolbar */}
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-card border border-border p-4 rounded-xl">

                {/* Selector de Mes */}
                <div className="flex items-center bg-muted/50 rounded-lg p-1">
                    <button
                        onClick={() => setViewMode('all')}
                        className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${viewMode === 'all' ? 'bg-white shadow text-primary' : 'text-muted-foreground hover:text-foreground'}`}
                    >
                        Todas
                    </button>
                    <button
                        onClick={() => setViewMode('month')}
                        className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${viewMode === 'month' ? 'bg-white shadow text-primary' : 'text-muted-foreground hover:text-foreground'}`}
                    >
                        Por Mes
                    </button>
                </div>

                {viewMode === 'month' && (
                    <div className="flex items-center gap-4">
                        <button onClick={() => setCurrentMonth(subMonths(currentMonth, 1))} className="p-1 hover:bg-accent rounded-full transition-colors">
                            <ChevronLeft className="h-5 w-5" />
                        </button>
                        <span className="text-lg font-bold min-w-[140px] text-center capitalize">
                            {format(currentMonth, 'MMMM yyyy', { locale: es })}
                        </span>
                        <button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} className="p-1 hover:bg-accent rounded-full transition-colors">
                            <ChevronRight className="h-5 w-5" />
                        </button>
                    </div>
                )}

                <div className="flex gap-3 w-full md:w-auto">
                    <div className="relative flex-1 md:w-64">
                        <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder="Buscar..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                        />
                    </div>
                    <button
                        onClick={handleExportPDF}
                        className="flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary font-bold text-sm rounded-lg hover:bg-primary/20 transition-colors"
                    >
                        <Download className="h-4 w-4" />
                        Exportar PDF
                    </button>
                </div>
            </div>

            {/* Resumen del Periodo */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-card p-4 rounded-xl border border-border">
                    <span className="text-xs text-muted-foreground font-bold uppercase tracking-wider">Reservas en vista</span>
                    <p className="text-2xl font-black mt-1">{filteredBookings.length}</p>
                </div>
                <div className="bg-card p-4 rounded-xl border border-border">
                    <span className="text-xs text-muted-foreground font-bold uppercase tracking-wider">Ingresos (Confirmados)</span>
                    <p className="text-2xl font-black mt-1 text-primary">{totalRevenue}€</p>
                </div>
            </div>

            {/* Tabla */}
            <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-muted/50 border-b border-border">
                                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">ID</th>
                                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Cliente / Motivo</th>
                                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Periodo</th>
                                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Noches</th>
                                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Estado</th>
                                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground text-right">Monto</th>
                                <th className="px-6 py-4"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredBookings.map((booking) => {
                                const start = new Date(booking.start_date)
                                const end = new Date(booking.end_date)
                                const nights = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))

                                return (
                                    <tr key={booking.id} className="border-b border-border last:border-0 hover:bg-accent/30 transition-colors group">
                                        <td className="px-6 py-5">
                                            <span className="font-mono text-[10px] text-muted-foreground font-bold">
                                                #{booking.id.slice(0, 8)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex flex-col">
                                                <span className="font-bold text-foreground">{booking.customer_name}</span>
                                                <span className="text-xs text-muted-foreground">{booking.customer_email}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-2 text-sm font-medium">
                                                <Calendar className="h-4 w-4 text-primary/60" />
                                                <span>{format(start, "d 'de' MMM", { locale: es })}</span>
                                                <span className="text-muted-foreground">→</span>
                                                <span>{format(end, "d 'de' MMM", { locale: es })}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <span className="text-xs font-bold text-muted-foreground bg-muted px-2 py-1 rounded-md">
                                                {nights} noches
                                            </span>
                                        </td>
                                        <td className="px-6 py-5">
                                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${booking.status === 'confirmed'
                                                ? 'bg-green-100 text-green-700'
                                                : booking.status === 'cancelled'
                                                    ? 'bg-red-100 text-red-700'
                                                    : booking.status === 'blocked'
                                                        ? 'bg-gray-100 text-gray-700'
                                                        : 'bg-yellow-100 text-yellow-700'
                                                }`}>
                                                {booking.status === 'confirmed' && <CheckCircle2 className="h-3 w-3" />}
                                                {booking.status === 'pending' && <Clock className="h-3 w-3" />}
                                                {booking.status === 'cancelled' && <XCircle className="h-3 w-3" />}

                                                {booking.status === 'confirmed' ? 'Confirmado' :
                                                    booking.status === 'cancelled' ? 'Cancelado' :
                                                        booking.status === 'blocked' ? 'Bloqueo' : 'Pendiente'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-5 text-right font-black text-primary">
                                            {booking.total_price}€
                                        </td>
                                        <td className="px-6 py-5 text-right">
                                            <div className="flex justify-end gap-2">
                                                <DeleteBookingButton
                                                    bookingId={booking.id}
                                                    onSuccess={() => handleDeleteSuccess(booking.id)}
                                                />
                                                <BookingActions booking={booking} />
                                            </div>
                                        </td>
                                    </tr>
                                )
                            })}
                            {filteredBookings.length === 0 && (
                                <tr>
                                    <td colSpan={7} className="text-center py-12 text-muted-foreground">
                                        No hay reservas para este periodo.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
