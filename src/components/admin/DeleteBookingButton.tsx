'use client'

import { deleteBooking } from "@/app/actions/admin"
import { Trash2 } from "lucide-react"
import { toast } from "sonner"
import { useState } from "react"
import { useRouter } from "next/navigation"

export function DeleteBookingButton({ bookingId, onSuccess }: { bookingId: string, onSuccess?: () => void }) {
    const [isDeleting, setIsDeleting] = useState(false)
    const router = useRouter()

    const handleDelete = async () => {
        // 1. Confirmación visual simple
        const confirmed = window.confirm("¿Seguro que quieres eliminar esta reserva? Esta acción liberará las fechas inmediatamente.")
        if (!confirmed) return

        setIsDeleting(true)

        try {
            // 2. Llamada al servidor
            const result = await deleteBooking(bookingId)

            if (result.success) {
                toast.success("Reserva eliminada", {
                    description: "Las fechas han quedado libres."
                })
                onSuccess?.()
                router.refresh() // Asegurar que la UI se actualiza
            } else {
                toast.error("Error", {
                    description: result.message || "No se pudo borrar la reserva"
                })
            }
        } catch (error) {
            toast.error("Error inesperado al borrar")
        } finally {
            setIsDeleting(false)
        }
    }

    return (
        <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="p-2 hover:bg-red-50 hover:text-red-500 rounded-lg text-muted-foreground transition-all opacity-0 group-hover:opacity-100 disabled:opacity-50"
            title="Borrar Reserva"
        >
            {isDeleting ? (
                <div className="h-4 w-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
            ) : (
                <Trash2 className="h-4 w-4" />
            )}
        </button>
    )
}
