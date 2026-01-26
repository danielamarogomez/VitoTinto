"use client"

import { useState } from "react"
import { useLanguage } from "@/context/LanguageContext"
import { ChevronLeft, ChevronRight } from "lucide-react"

export default function KnowMallorca() {
    const { t } = useLanguage()
    const [currentIndex, setCurrentIndex] = useState(0)

    const images = [
        { src: "/images/conoce/m1.jpg", alt: "Interior Vito Tinto" },
        { src: "/images/conoce/m8.jpg", alt: "Andrea en Mallorca" },
        { src: "/images/conoce/m2.jpg", alt: "Vistas al mar" },
        { src: "/images/conoce/m7.jpg", alt: "Atardeceres mágicos" },
        { src: "/images/conoce/m3.jpg", alt: "Rincones acogedores" },
        { src: "/images/conoce/m9.jpg", alt: "Puesta de sol" },
        { src: "/images/conoce/m4.jpg", alt: "Pueblos de Mallorca" },
        { src: "/images/conoce/m6.jpg", alt: "Disfrutando las olas" },
        { src: "/images/conoce/m5.jpg", alt: "Cocinando en la isla" },
    ]

    // Dividimos en grupos de 3 para el carrusel
    const totalSlides = Math.ceil(images.length / 3)

    const next = () => {
        setCurrentIndex((prev) => (prev + 1 >= totalSlides ? 0 : prev + 1))
    }

    const prev = () => {
        setCurrentIndex((prev) => (prev - 1 < 0 ? totalSlides - 1 : prev - 1))
    }

    return (
        <section id="conoce-mallorca" className="py-20 bg-[#FFFBF2]">
            <div className="container mx-auto px-4 max-w-6xl">
                <div className="text-center mb-16">
                    <h2
                        className="text-4xl md:text-5xl font-bold text-primary mb-4"
                        style={{ fontFamily: 'var(--font-patrick), cursive' }}
                    >
                        {t.knowMallorca.title}
                    </h2>
                    <p className="text-muted-foreground text-lg max-w-xl mx-auto">
                        {t.knowMallorca.subtitle}
                    </p>
                </div>

                <div className="relative group px-12 overflow-visible">
                    {/* Botones de Navegación */}
                    <button
                        onClick={prev}
                        className="absolute left-0 top-1/2 -translate-y-1/2 z-20 p-4 rounded-full bg-white text-primary shadow-xl hover:bg-primary hover:text-white transition-all duration-300 transform hover:scale-110 active:scale-95 border border-primary/10"
                    >
                        <ChevronLeft className="h-6 w-6" />
                    </button>
                    <button
                        onClick={next}
                        className="absolute right-0 top-1/2 -translate-y-1/2 z-20 p-4 rounded-full bg-white text-primary shadow-xl hover:bg-primary hover:text-white transition-all duration-300 transform hover:scale-110 active:scale-95 border border-primary/10"
                    >
                        <ChevronRight className="h-6 w-6" />
                    </button>

                    {/* Ventana del Carrusel */}
                    <div className="overflow-hidden">
                        <div
                            className="flex transition-transform duration-700 ease-in-out"
                            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
                        >
                            {[0, 1, 2].map((slideIdx) => (
                                <div key={slideIdx} className="min-w-full grid grid-cols-1 md:grid-cols-3 gap-6">
                                    {images.slice(slideIdx * 3, (slideIdx + 1) * 3).map((img, i) => (
                                        <div key={i} className="relative aspect-[4/5] overflow-hidden rounded-3xl shadow-lg border-4 border-white bg-white group/img hover:shadow-2xl transition-all">
                                            <img
                                                src={img.src}
                                                alt={img.alt}
                                                className="w-full h-full object-cover transition-transform duration-700 group-hover/img:scale-110"
                                            />
                                            {/* Sutil overlay decorativo */}
                                            <div className="absolute inset-0 bg-black/5 group-hover/img:bg-transparent transition-colors duration-500" />
                                        </div>
                                    ))}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Dots de navegación */}
                    <div className="flex justify-center gap-3 mt-12">
                        {[0, 1, 2].map((idx) => (
                            <button
                                key={idx}
                                onClick={() => setCurrentIndex(idx)}
                                className={`h-2 transition-all duration-500 rounded-full ${currentIndex === idx ? "w-10 bg-primary" : "w-2 bg-primary/20 hover:bg-primary/40"}`}
                            />
                        ))}
                    </div>
                </div>

                {/* Call to Action Final */}
                <div className="mt-20 flex flex-col items-center gap-6">
                    <p className="text-xl font-medium text-primary text-center">
                        ¿Todo listo para vivir Mallorca sobre ruedas?
                    </p>
                    <div className="flex flex-wrap justify-center gap-4">
                        <a
                            href="#reservar"
                            className="bg-primary text-white font-bold py-4 px-10 rounded-full hover:scale-105 transition-transform shadow-xl uppercase tracking-wider text-sm"
                        >
                            Ver disponibilidad
                        </a>
                        <a
                            href="https://wa.me/34692476002"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-[#25D366] text-white font-bold py-4 px-10 rounded-full hover:scale-105 transition-transform shadow-xl uppercase tracking-wider text-sm flex items-center gap-2"
                        >
                            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                                <path d="M12.012 2c-5.506 0-9.989 4.478-9.99 9.984a9.964 9.964 0 001.333 4.993L2 22l5.233-1.373a9.921 9.921 0 004.779 1.233h.005c5.505 0 9.987-4.478 9.989-9.984a9.967 9.967 0 00-9.994-9.876zM18.86 16.52c-.308.866-1.503 1.588-2.076 1.691-.573.102-1.144.153-3.235-.715-2.09-.868-3.44-3.011-3.543-3.153-.102-.143-.833-1.107-.833-2.107s.528-1.48.716-1.685c.188-.204.409-.255.545-.255.136 0 .273.001.393.007.127.006.299-.048.468.357.17.404.577 1.404.628 1.506.051.102.085.221.017.357s-.102.221-.204.34c-.102.119-.215.265-.308.357-.101.1-.221.21-.094.425.127.216.565.932 1.213 1.51.834.743 1.539.972 1.76.1.222-.868.425-.1.545.1.12.199 1.472.937 1.725 1.065.253.127.422.19.49.306s.068.745-.24 1.611z" />
                            </svg>
                            Preguntar por WhatsApp
                        </a>
                    </div>
                </div>
            </div>
        </section>
    )
}
