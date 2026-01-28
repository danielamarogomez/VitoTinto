"use client"

import { useEffect, useState } from "react"
import { useLanguage } from "@/context/LanguageContext"

export default function HeroTitle() {
    const { t } = useLanguage()
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
                className="font-bold tracking-tight text-4xl sm:text-6xl md:text-7xl lg:text-8xl drop-shadow-lg leading-[1.1]"
                style={{ fontFamily: 'var(--font-patrick), cursive' }}
            >
                <div className="block whitespace-nowrap">{t.hero.title}</div>
                <div className="text-secondary block mt-2">
                    {t.hero.subtitle}
                </div>
            </h1>
            <p className="mx-auto lg:mx-0 max-w-[700px] text-lg sm:text-xl text-gray-200 drop-shadow">
                {t.hero.description}
            </p>
        </div>
    )
}
