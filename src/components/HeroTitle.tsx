"use client"

import { useEffect, useState } from "react"

export default function HeroTitle() {
    const [offset, setOffset] = useState(0)

    useEffect(() => {
        const handleScroll = () => {
            // El factor 0.3 determina la velocidad del efecto (más bajo = más lento)
            setOffset(window.scrollY * 0.4)
        }
        window.addEventListener("scroll", handleScroll)
        return () => window.removeEventListener("scroll", handleScroll)
    }, [])

    return (
        <div
            className="flex flex-col gap-4 text-center lg:text-left text-white lg:flex-1 transition-transform duration-75 ease-out"
            style={{ transform: `translateY(${offset}px)` }}
        >
            <h1 className="text-4xl font-extrabold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl drop-shadow-md">
                Libertad sobre ruedas <br className="hidden lg:block" />
                <span className="text-primary-foreground/90">
                    Estilo Vito Tinto
                </span>
            </h1>
            <p className="mx-auto lg:mx-0 max-w-[700px] text-lg sm:text-xl text-gray-200 drop-shadow">
                Escápate de la rutina con nuestra camper premium. Equipada con todo lo necesario para tu aventura, con el toque de elegancia que mereces.
            </p>
        </div>
    )
}
