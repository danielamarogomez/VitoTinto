"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { DayPicker } from "react-day-picker"
import { cn } from "@/lib/utils"

export type CalendarProps = React.ComponentProps<typeof DayPicker>

export function Calendar({
    className,
    classNames,
    showOutsideDays = true,
    ...props
}: CalendarProps) {
    return (
        <DayPicker
            showOutsideDays={showOutsideDays}
            className={cn("p-3 mx-auto w-fit", className)}
            classNames={{
                // Contenedor principal
                months: "flex flex-col gap-4",
                month: "space-y-4",

                // Cabecera: Mes + Año + Flechas
                month_caption: "flex justify-center items-center h-10 pt-1 relative",
                caption_label: "text-sm font-bold tracking-tight",

                // Navegación (Flechas) - Layout simplificado para evitar bloqueos
                nav: "space-x-1 flex items-center absolute left-1 right-1 top-1 justify-between z-10",
                button_previous: cn(
                    "cursor-pointer h-8 w-8 bg-background border border-border flex items-center justify-center rounded-lg hover:bg-accent hover:text-accent-foreground transition-all z-20"
                ),
                button_next: cn(
                    "cursor-pointer h-8 w-8 bg-background border border-border flex items-center justify-center rounded-lg hover:bg-accent hover:text-accent-foreground transition-all z-20"
                ),

                // Cuadrícula (Días)
                month_grid: "w-full border-collapse mx-auto mt-4",
                weekdays: "flex w-full mb-2 justify-center",
                weekday: "text-muted-foreground w-9 font-normal text-[0.7rem] uppercase tracking-widest text-center",
                weeks: "w-full flex flex-col gap-1.5",
                week: "flex w-full justify-center gap-1",
                day: cn(
                    "h-9 w-9 p-0 font-normal aria-selected:opacity-100 flex items-center justify-center rounded-md transition-all hover:bg-accent hover:text-accent-foreground cursor-pointer"
                ),

                // Estados
                day_range_end: "day-range-end",
                day_selected:
                    "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
                day_today: "bg-accent/50 text-accent-foreground font-bold underline underline-offset-4",
                day_outside: "day-outside text-muted-foreground opacity-50",
                day_disabled: "text-red-900/40 bg-red-50/50 line-through decoration-red-900/30 cursor-not-allowed font-medium",
                day_range_middle: "aria-selected:bg-accent aria-selected:text-accent-foreground rounded-none",
                day_hidden: "invisible",

                ...classNames,
            }}
            components={{
                Chevron: ({ ...props }) => {
                    if (props.orientation === 'left') return <ChevronLeft className="h-4 w-4" />
                    return <ChevronRight className="h-4 w-4" />
                }
            }}
            {...props}
        />
    )
}
Calendar.displayName = "Calendar"
