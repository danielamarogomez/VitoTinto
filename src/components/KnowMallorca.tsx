"use client"

import { useLanguage } from "@/context/LanguageContext"

export default function KnowMallorca() {
    const { t } = useLanguage()

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

                {/* Layout Estilo Mural/Pinterest Ligero */}
                <div className="columns-1 sm:columns-2 lg:columns-3 gap-8 space-y-8">
                    {images.map((img, i) => (
                        <div
                            key={i}
                            className="break-inside-avoid relative group"
                        >
                            <div className="relative bg-white p-3 pb-10 shadow-md hover:shadow-2xl transition-all duration-500 rounded-sm transform hover:-rotate-1 group-hover:scale-[1.03] border border-black/5">
                                <div className="relative overflow-hidden bg-muted">
                                    <img
                                        src={img.src}
                                        alt={img.alt}
                                        className="w-full h-auto object-cover grayscale-[0.2] group-hover:grayscale-0 transition-all duration-700"
                                        loading="lazy"
                                    />
                                </div>
                                <div className="absolute bottom-3 left-0 right-0 text-center">
                                    <p className="text-[10px] font-medium tracking-widest uppercase text-muted-foreground/60 opacity-0 group-hover:opacity-100 transition-opacity">
                                        Vito Tinto Moments
                                    </p>
                                </div>
                            </div>
                            {/* Sombra proyectada suave */}
                            <div className="absolute -inset-1 bg-black/5 blur-xl -z-10 group-hover:bg-black/10 transition-colors"></div>
                        </div>
                    ))}
                </div>
            </div>

            <style jsx>{`
                .break-inside-avoid {
                    break-inside: avoid;
                }
            `}</style>
        </section>
    )
}
