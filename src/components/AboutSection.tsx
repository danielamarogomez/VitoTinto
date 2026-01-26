"use client"

import Image from "next/image"
import { useLanguage } from "@/context/LanguageContext"

export default function AboutSection() {
    const { t } = useLanguage()

    return (
        <section id="sobre-mi" className="py-20 bg-[#f4e4bc]/30"> {/* Un tono arena un pelín más oscuro para contrastar */}
            <div className="container mx-auto px-4 md:px-6 max-w-screen-xl">
                <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">

                    {/* Texto */}
                    <div className="flex-1 order-2 lg:order-1 text-center lg:text-left">
                        <h2
                            className="text-4xl lg:text-5xl font-bold text-primary mb-6"
                            style={{ fontFamily: 'var(--font-patrick), cursive' }}
                        >
                            {t.about.title}
                        </h2>
                        <div className="space-y-4 text-lg text-muted-foreground leading-relaxed">
                            <p>
                                {t.about.p1}
                            </p>
                            <p>
                                {t.about.p2}
                            </p>
                            <p className="font-medium text-primary/80 pt-2">
                                {t.about.p3}
                            </p>
                        </div>
                    </div>

                    {/* Foto */}
                    <div className="flex-1 order-1 lg:order-2 w-full flex justify-center lg:justify-end">
                        <div className="relative w-full max-w-[320px] aspect-square rounded-2xl overflow-hidden shadow-2xl rotate-2 hover:rotate-0 transition-transform duration-500 ease-out">
                            <Image
                                src="/images/andrea.jpg"
                                alt="Andrea - Vito Tinto Owner"
                                fill
                                className="object-cover"
                            />
                            {/* Marco estilo Polaroid/Foto antigua */}
                            <div className="absolute inset-0 border-[8px] border-white/90 pointer-events-none"></div>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    )
}
