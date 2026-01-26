"use client"

import { useState, useRef } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useLanguage } from "@/context/LanguageContext"

export default function GallerySection() {
    const { t } = useLanguage()
    const scrollRef = useRef<HTMLDivElement>(null)
    const [activeIndex, setActiveIndex] = useState(0)

    const GALLERY_IMAGES = [
        { src: "/images/vito/v6.jpg", key: "Cena bajo las estrellas" },
        { src: "/images/vito/v1.jpg", key: "Vito Tinto en el Faro" },
        { src: "/images/vito/v7.jpg", key: "Fachada con encanto" },
        { src: "/images/vito/v2.jpg", key: "Interior cálido" },
        { src: "/images/vito/v8.jpg", key: "Café en la carretera" },
        { src: "/images/vito/v3.jpg", key: "Vistas infinitas" },
        { src: "/images/vito/v9.jpg", key: "Noches de lectura" },
        { src: "/images/vito/v4.jpg", key: "Cama confortable" },
        { src: "/images/vito/v10.jpg", key: "Desayuno Mediterráneo" },
        { src: "/images/vito/v5.jpg", key: "Cocina equipada" }
    ]

    const scrollToIndex = (index: number) => {
        if (!scrollRef.current) return
        const width = scrollRef.current.offsetWidth
        scrollRef.current.scrollTo({
            left: index * width,
            behavior: "smooth"
        })
        setActiveIndex(index)
    }

    const next = () => {
        const nextIndex = (activeIndex + 1) % GALLERY_IMAGES.length
        scrollToIndex(nextIndex)
    }

    const prev = () => {
        const prevIndex = (activeIndex - 1 + GALLERY_IMAGES.length) % GALLERY_IMAGES.length
        scrollToIndex(prevIndex)
    }

    const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
        const width = e.currentTarget.offsetWidth
        const index = Math.round(e.currentTarget.scrollLeft / width)
        if (index !== activeIndex) {
            setActiveIndex(index)
        }
    }

    return (
        <section id="la-furgo" className="py-20 bg-background overflow-hidden">
            <div className="container mx-auto px-4 md:px-6 max-w-screen-xl">
                <div className="text-center mb-10">
                    <h2
                        className="text-4xl lg:text-5xl font-bold text-primary mb-4"
                        style={{ fontFamily: 'var(--font-patrick), cursive' }}
                    >
                        {t.gallery.title}
                    </h2>
                    <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                        {t.gallery.subtitle}
                    </p>
                </div>

                <div className="relative max-w-4xl mx-auto group">
                    {/* Botones de Navegación */}
                    <button
                        onClick={prev}
                        className="absolute -left-4 lg:-left-12 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-white/90 text-primary shadow-lg hover:bg-white transition-all opacity-0 group-hover:opacity-100 hidden md:block border border-primary/5"
                    >
                        <ChevronLeft className="h-6 w-6" />
                    </button>
                    <button
                        onClick={next}
                        className="absolute -right-4 lg:-right-12 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-white/90 text-primary shadow-lg hover:bg-white transition-all opacity-0 group-hover:opacity-100 hidden md:block border border-primary/5"
                    >
                        <ChevronRight className="h-6 w-6" />
                    </button>

                    {/* Carrusel */}
                    <div
                        ref={scrollRef}
                        onScroll={handleScroll}
                        className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide gap-6 pb-4 px-4"
                        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                    >
                        {GALLERY_IMAGES.map((img, idx) => {
                            const altText = t.gallery.images[img.key] || img.key
                            return (
                                <div
                                    key={idx}
                                    className="flex-none w-full md:w-[700px] aspect-[4/3] md:aspect-[3/2] snap-center relative rounded-[2rem] overflow-hidden shadow-xl border border-primary/5 bg-muted"
                                >
                                    <Image
                                        src={img.src}
                                        alt={altText}
                                        fill
                                        className="object-cover"
                                        priority={idx === 0}
                                    />
                                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent p-6">
                                        <p className="text-white text-lg font-hand" style={{ fontFamily: 'var(--font-patrick)' }}>
                                            {altText}
                                        </p>
                                    </div>
                                </div>
                            )
                        })}
                    </div>

                    {/* Indicadores (Dots) */}
                    <div className="flex justify-center gap-2.5 mt-4">
                        {GALLERY_IMAGES.map((_, idx) => (
                            <button
                                key={idx}
                                onClick={() => scrollToIndex(idx)}
                                className={`h-1.5 transition-all duration-300 rounded-full ${activeIndex === idx ? "w-8 bg-primary" : "w-1.5 bg-primary/10 hover:bg-primary/30"
                                    }`}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}
