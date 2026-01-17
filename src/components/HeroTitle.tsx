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
            <h1
                className="font-bold tracking-wide sm:text-6xl md:text-7xl lg:text-8xl drop-shadow-lg leading-[0.9]"
                style={{ fontFamily: 'var(--font-patrick), cursive' }}
            >
                Libertad sobre ruedas <br className="hidden lg:block" />
                <span className="text-secondary block mt-2">
                    Estilo Vito Tinto
                </span>
            </h1>
            <p className="mx-auto lg:mx-0 max-w-[700px] text-lg sm:text-xl text-gray-200 drop-shadow">
                Escápate de la rutina con nuestra camper premium. Equipada con todo lo necesario para tu aventura, con el toque de elegancia que mereces.
            </p>
        </div>
    )
}
