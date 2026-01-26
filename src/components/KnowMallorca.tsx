"use client"

import Image from "next/image"
import { useLanguage } from "@/context/LanguageContext"

export default function KnowMallorca() {
    const { t } = useLanguage()

    // Estas serán las fotos que me pases. De momento pongo unas genéricas de Mallorca para la estructura.
    const images = [
        { src: "/images/conoce/m1.jpg", alt: "Interior Vito Tinto", className: "col-span-2 row-span-2" },
        { src: "/images/conoce/m2.jpg", alt: "Vistas al mar", className: "col-span-1 row-span-1" },
        { src: "/images/conoce/m3.jpg", alt: "Rincones acogedores", className: "col-span-1 row-span-2" },
        { src: "/images/conoce/m4.jpg", alt: "Pueblos de Mallorca", className: "col-span-1 row-span-1" },
        { src: "/images/conoce/m6.jpg", alt: "Disfrutando las olas", className: "col-span-1 row-span-1" },
        { src: "/images/conoce/m5.jpg", alt: "Cocinando en la isla", className: "col-span-2 row-span-1" },
        { src: "/images/conoce/m7.jpg", alt: "Atardeceres mágicos", className: "col-span-1 row-span-2" },
        { src: "/images/conoce/m8.jpg", alt: "Andrea y Vito", className: "col-span-1 row-span-1" },
        { src: "/images/conoce/m9.jpg", alt: "Puesta de sol", className: "col-span-2 row-span-1" },
    ]

    return (
        <section id="conoce-mallorca" className="py-24 bg-background">
            <div className="container mx-auto px-4 max-w-screen-xl">
                <div className="text-center mb-16">
                    <h2
                        className="text-4xl md:text-5xl font-bold text-primary mb-4"
                        style={{ fontFamily: 'var(--font-patrick), cursive' }}
                    >
                        {t.knowMallorca.title}
                    </h2>
                    <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                        {t.knowMallorca.subtitle}
                    </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 auto-rows-[200px] md:auto-rows-[250px]">
                    {images.map((img, i) => (
                        <div
                            key={i}
                            className={`relative overflow-hidden rounded-[2rem] shadow-lg hover:shadow-2xl transition-all duration-500 group ${img.className}`}
                        >
                            <Image
                                src={img.src}
                                alt={img.alt}
                                fill
                                className="object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500" />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
