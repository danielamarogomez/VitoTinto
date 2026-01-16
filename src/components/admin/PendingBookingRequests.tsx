"use client"

import { useState, useEffect } from "react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { Check, X, Mail, Phone, MessageSquare, Clock, Euro } from "lucide-react"
import { toast } from "sonner"
import { approveBookingRequest, rejectBookingRequest } from "@/app/actions/admin-booking"

interface PendingRequest {
    id: string
    created_at: string
    start_date: string
    end_date: string
    total_price: number
    customer_name: string
    customer_email: string
    customer_phone: string
    customer_message: string | null
    status: string
}

export default function PendingBookingRequests() {
    const [requests, setRequests] = useState<PendingRequest[]>([])
    const [loading, setLoading] = useState(true)
    const [processingId, setProcessingId] = useState<string | null>(null)

    useEffect(() => {
        loadPendingRequests()
    }, [])

    const loadPendingRequests = async () => {
        setLoading(true)
        try {
            const response = await fetch('/api/admin/pending-requests')
            const data = await response.json()
            setRequests(data.requests || [])
        } catch (error) {
            console.error('Error loading pending requests:', error)
            toast.error('Error al cargar solicitudes')
        } finally {
            setLoading(false)
        }
    }

    const handleApprove = async (requestId: string) => {
        setProcessingId(requestId)
        try {
            await approveBookingRequest(requestId)
            toast.success('¡Solicitud aprobada!', {
                description: 'Se ha enviado el link de pago al cliente por email'
            })
            loadPendingRequests() // Recargar lista
        } catch (error: any) {
            toast.error('Error', { description: error.message })
        } finally {
            setProcessingId(null)
        }
    }

    const handleReject = async (requestId: string) => {
        if (!confirm('¿Estás segura de que quieres rechazar esta solicitud?')) return

        setProcessingId(requestId)
        try {
            await rejectBookingRequest(requestId)
            toast.success('Solicitud rechazada')
            loadPendingRequests()
        } catch (error: any) {
            toast.error('Error', { description: error.message })
        } finally {
            setProcessingId(null)
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center p-12">
                <div className="h-8 w-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
            </div>
        )
    }

    if (requests.length === 0) {
        return (
            <div className="text-center p-12 bg-muted/20 rounded-lg border-2 border-dashed border-border">
                <Clock className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-bold mb-2">No hay solicitudes pendientes</h3>
                <p className="text-sm text-muted-foreground">
                    Las nuevas solicitudes de reserva aparecerán aquí
                </p>
            </div>
        )
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-2xl font-black text-primary">Solicitudes Pendientes</h2>
                    <p className="text-sm text-muted-foreground">
                        {requests.length} solicitud{requests.length !== 1 ? 'es' : ''} esperando tu aprobación
                    </p>
                </div>
                <button
                    onClick={loadPendingRequests}
                    className="text-sm text-primary hover:underline"
                >
                    Actualizar
                </button>
            </div>

            {requests.map((request) => (
                <div
                    key={request.id}
                    className="bg-card border border-border rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
                >
                    <div className="flex flex-col lg:flex-row gap-6">
                        {/* Información del cliente */}
                        <div className="flex-1 space-y-4">
                            <div>
                                <h3 className="text-xl font-bold text-primary mb-1">
                                    {request.customer_name}
                                </h3>
                                <p className="text-xs text-muted-foreground">
                                    Solicitud recibida: {format(new Date(request.created_at), "dd MMM yyyy 'a las' HH:mm", { locale: es })}
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <div className="flex items-center gap-2 text-sm">
                                    <Mail className="h-4 w-4 text-muted-foreground" />
                                    <a href={`mailto:${request.customer_email}`} className="text-primary hover:underline">
                                        {request.customer_email}
                                    </a>
                                </div>
                                <div className="flex items-center gap-2 text-sm">
                                    <Phone className="h-4 w-4 text-muted-foreground" />
                                    <a href={`tel:${request.customer_phone}`} className="text-primary hover:underline">
                                        {request.customer_phone}
                                    </a>
                                </div>
                            </div>

                            {request.customer_message && (
                                <div className="bg-muted/50 p-3 rounded-lg border-l-4 border-primary">
                                    <div className="flex items-start gap-2">
                                        <MessageSquare className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                                        <div>
                                            <p className="text-xs font-medium text-muted-foreground mb-1">Mensaje:</p>
                                            <p className="text-sm italic">"{request.customer_message}"</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Detalles de la reserva */}
                        <div className="lg:w-80 bg-muted/30 rounded-lg p-4 space-y-3">
                            <h4 className="font-bold text-sm text-muted-foreground uppercase tracking-wide">
                                Detalles de la Reserva
                            </h4>

                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Check-in:</span>
                                    <span className="font-medium">
                                        {format(new Date(request.start_date.replace(/-/g, '/')), 'dd MMM yyyy', { locale: es })}
                                    </span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Check-out:</span>
                                    <span className="font-medium">
                                        {format(new Date(request.end_date.replace(/-/g, '/')), 'dd MMM yyyy', { locale: es })}
                                    </span>
                                </div>
                                <div className="pt-2 border-t border-border flex justify-between items-center">
                                    <span className="text-sm font-medium">Total:</span>
                                    <span className="text-2xl font-black text-primary flex items-center gap-1">
                                        {request.total_price}
                                        <Euro className="h-5 w-5" />
                                    </span>
                                </div>
                                <p className="text-[10px] text-muted-foreground text-right">IVA incluido</p>
                            </div>

                            {/* Botones de acción */}
                            <div className="pt-4 space-y-2">
                                <button
                                    onClick={() => handleApprove(request.id)}
                                    disabled={processingId === request.id}
                                    className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                                >
                                    {processingId === request.id ? (
                                        <>
                                            <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            Procesando...
                                        </>
                                    ) : (
                                        <>
                                            <Check className="h-5 w-5" />
                                            Aprobar y Enviar Link de Pago
                                        </>
                                    )}
                                </button>
                                <button
                                    onClick={() => handleReject(request.id)}
                                    disabled={processingId === request.id}
                                    className="w-full border border-red-300 text-red-600 hover:bg-red-50 font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                                >
                                    <X className="h-4 w-4" />
                                    Rechazar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}
