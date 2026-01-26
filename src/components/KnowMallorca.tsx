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
                            href="https://wa.me/34656615016"
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

            <style jsx>{`
                .break-inside-avoid {
                    break-inside: avoid;
                }
            `}</style>
        </section>
    )
}
