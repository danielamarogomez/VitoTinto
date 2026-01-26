"use client"

import { MessageCircle, X } from "lucide-react"
import { useState } from "react"

export default function WhatsAppButton() {
    const [isOpen, setIsOpen] = useState(false)
    const phoneNumber = "34692476002" // Formato internacional sin + ni espacios
    const defaultMessage = "Hola! Tengo una consulta sobre Vito Tinto 🚐"

    const handleWhatsAppClick = () => {
        const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(defaultMessage)}`
        window.open(url, '_blank')
        setIsOpen(false)
    }

    return (
        <>
            {/* Botón flotante principal */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="fixed bottom-6 right-6 z-50 bg-[#25D366] hover:bg-[#20BA5A] text-white p-4 rounded-full shadow-2xl transition-all duration-300 transform hover:scale-110 active:scale-95 flex items-center gap-2 group"
                aria-label="Contactar por WhatsApp"
            >
                {isOpen ? (
                    <X className="h-6 w-6" />
                ) : (
                    <>
                        <MessageCircle className="h-6 w-6" />
                        <span className="hidden group-hover:inline-block text-sm font-bold pr-1 animate-in slide-in-from-right-2 fade-in duration-200">
                            ¿Dudas?
                        </span>
                    </>
                )}
            </button>

            {/* Popup de mensaje */}
            {isOpen && (
                <div className="fixed bottom-24 right-6 z-50 animate-in slide-in-from-bottom-4 fade-in duration-300">
                    <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-border p-6 max-w-sm">
                        <div className="flex items-start gap-3 mb-4">
                            <div className="p-2 bg-[#25D366]/10 rounded-full">
                                <MessageCircle className="h-5 w-5 text-[#25D366]" />
                            </div>
                            <div className="flex-1">
                                <h3 className="font-bold text-lg mb-1">¿Tienes dudas?</h3>
                                <p className="text-sm text-muted-foreground">
                                    Escríbenos por WhatsApp y te respondemos al instante
                                </p>
                            </div>
                        </div>

                        <button
                            onClick={handleWhatsAppClick}
                            className="w-full bg-[#25D366] hover:bg-[#20BA5A] text-white font-bold py-3 px-4 rounded-xl transition-all duration-200 transform hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2 shadow-lg"
                        >
                            <MessageCircle className="h-5 w-5" />
                            Abrir WhatsApp
                        </button>

                        <button
                            onClick={() => setIsOpen(false)}
                            className="w-full mt-2 text-sm text-muted-foreground hover:text-foreground transition-colors py-2"
                        >
                            Cerrar
                        </button>
                    </div>
                </div>
            )}

            {/* Overlay para cerrar al hacer clic fuera */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm animate-in fade-in duration-200"
                    onClick={() => setIsOpen(false)}
                />
            )}
        </>
    )
}
