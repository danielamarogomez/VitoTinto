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
                <div className="flex justify-center lg:justify-start mt-4">
                    <span className="bg-white/20 backdrop-blur-md text-white text-sm font-bold px-4 py-1 rounded-full border border-white/30 flex items-center gap-2">
                        <span>👥</span> {t.features.f4.desc}
                    </span>
                </div>
            </h1>
            <p className="mx-auto lg:mx-0 max-w-[700px] text-lg sm:text-xl text-gray-200 drop-shadow">
                {t.hero.description}
            </p>
        </div>
    )
}
