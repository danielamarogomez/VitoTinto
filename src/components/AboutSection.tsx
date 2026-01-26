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
                            <p className="font-medium text-primary/80 pt-2 mb-8">
                                {t.about.p3}
                            </p>
                        </div>
                        <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
                            <a
                                href="https://wa.me/34692476002?text=Hola%20Andrea!%20He%20le%C3%ADdo%20tu%20historia%20en%20Vito%20Tinto%20y%20me%20encantar%C3%ADa%20alquilar%20la%20camper"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 bg-[#25D366] text-white px-8 py-4 rounded-full font-bold hover:scale-105 transition-transform shadow-lg"
                            >
                                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                                    <path d="M12.012 2c-5.506 0-9.989 4.478-9.99 9.984a9.964 9.964 0 001.333 4.993L2 22l5.233-1.373a9.921 9.921 0 004.779 1.233h.005c5.505 0 9.987-4.478 9.989-9.984a9.967 9.967 0 00-9.994-9.876zM18.86 16.52c-.308.866-1.503 1.588-2.076 1.691-.573.102-1.144.153-3.235-.715-2.09-.868-3.44-3.011-3.543-3.153-.102-.143-.833-1.107-.833-2.107s.528-1.48.716-1.685c.188-.204.409-.255.545-.255.136 0 .273.001.393.007.127.006.299-.048.468.357.17.404.577 1.404.628 1.506.051.102.085.221.017.357s-.102.221-.204.34c-.102.119-.215.265-.308.357-.101.1-.221.21-.094.425.127.216.565.932 1.213 1.51.834.743 1.539.972 1.76.1.222-.868.425-.1.545.1.12.199 1.472.937 1.725 1.065.253.127.422.19.49.306s.068.745-.24 1.611z" />
                                </svg>
                                Hablar con Andrea
                            </a>
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
