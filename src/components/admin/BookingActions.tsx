"use client"

import { useState, useRef, useEffect } from "react"
import { MoreVertical, Mail, Copy, ExternalLink, ShieldCheck, Check } from "lucide-react"
import { toast } from "sonner"

interface BookingActionsProps {
    booking: any
}

export function BookingActions({ booking }: BookingActionsProps) {
    const [isOpen, setIsOpen] = useState(false)
    const menuRef = useRef<HTMLDivElement>(null)

    // Cerrar menú al hacer click fuera
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false)
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    const copyToClipboard = (text: string, label: string) => {
        navigator.clipboard.writeText(text)
        toast.success(`${label} copiado`, {
            description: "Ya lo tienes en el portapapeles."
        })
        setIsOpen(false)
    }

    const openMail = () => {
        window.location.href = `mailto:${booking.customer_email}?subject=Reserva Vito Tinto #${booking.id.slice(0, 8)}`
        setIsOpen(false)
    }

    return (
        <div className="relative" ref={menuRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`p-2 rounded-lg transition-all ${isOpen ? 'bg-primary text-white' : 'hover:bg-muted text-muted-foreground'}`}
            >
                <MoreVertical className="h-4 w-4" />
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-zinc-900 border border-border rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.15)] z-[100] py-2 animate-in fade-in zoom-in-95 duration-200">
                    <div className="px-3 py-2 border-b border-border/50 mb-1">
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Acciones</p>
                    </div>

                    <button
                        onClick={openMail}
                        className="w-full flex items-center gap-3 px-4 py-2 text-sm hover:bg-accent transition-colors"
                    >
                        <Mail className="h-4 w-4 text-primary" />
                        <span>Contactar Cliente</span>
                    </button>

                    <button
                        onClick={() => copyToClipboard(booking.id, "ID de Reserva")}
                        className="w-full flex items-center gap-3 px-4 py-2 text-sm hover:bg-accent transition-colors"
                    >
                        <Copy className="h-4 w-4 text-primary" />
                        <span>Copiar ID Reserva</span>
                    </button>

                    {booking.payment_intent_id && (
                        <a
                            href={`https://dashboard.stripe.com/payments/${booking.payment_intent_id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full flex items-center gap-3 px-4 py-2 text-sm hover:bg-accent transition-colors"
                        >
                            <ExternalLink className="h-4 w-4 text-primary" />
                            <span>Ver en Stripe</span>
                        </a>
                    )}

                    <div className="border-t border-border/50 mt-1 pt-1">
                        <div className="px-4 py-2 flex items-center gap-2 opacity-50 grayscale">
                            <ShieldCheck className="h-4 w-4" />
                            <span className="text-[10px] font-bold uppercase">Admin Verified</span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
