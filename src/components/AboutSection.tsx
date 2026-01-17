"use client"

import Image from "next/image"

export default function AboutSection() {
    return (
        <section className="py-20 bg-[#f4e4bc]/30"> {/* Un tono arena un pelín más oscuro para contrastar */}
            <div className="container mx-auto px-4 md:px-6 max-w-screen-xl">
                <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">

                    {/* Texto */}
                    <div className="flex-1 order-2 lg:order-1 text-center lg:text-left">
                        <h2
                            className="text-4xl lg:text-5xl font-bold text-primary mb-6"
                            style={{ fontFamily: 'var(--font-patrick), cursive' }}
                        >
                            Hola, soy Andrea
                        </h2>
                        <div className="space-y-4 text-lg text-muted-foreground leading-relaxed">
                            <p>
                                Soy una apasionada de la naturaleza y de la libertad que te da viajar sin rumbo fijo.
                                Vito Tinto nació de mi deseo de compartir esa sensación única de despertar frente al mar
                                y vivir Mallorca de una forma diferente.
                            </p>
                            <p>
                                He cuidado cada detalle de esta camper para que no sea solo un vehículo, sino tu pequeño hogar
                                sobre ruedas. Desde los acabados en madera hasta los rincones más acogedores, todo está pensado
                                para que vivas una experiencia inolvidable.
                            </p>
                            <p className="font-medium text-primary/80 pt-2">
                                ¡Espero que la disfrutes tanto como yo!
                            </p>
                        </div>
                    </div>

                    {/* Foto */}
                    <div className="flex-1 order-1 lg:order-2 w-full max-w-md lg:max-w-full">
                        <div className="relative aspect-[3/4] lg:aspect-square rounded-2xl overflow-hidden shadow-2xl rotate-2 hover:rotate-0 transition-transform duration-500 ease-out">
                            <Image
                                src="https://images.unsplash.com/photo-1542359649-31e03cd4d909?q=80&w=1000&auto=format&fit=crop" // Foto lifestyle (viajera)
                                alt="Andrea - Vito Tinto Owner"
                                fill
                                className="object-cover"
                            />
                            {/* Marco estilo Polaroid/Foto antigua */}
                            <div className="absolute inset-0 border-[12px] border-white/90 pointer-events-none"></div>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    )
}
