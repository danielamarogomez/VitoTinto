"use client"

import Image from "next/image"

const GALLERY_IMAGES = [
    {
        src: "https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?q=80&w=800&auto=format&fit=crop",
        alt: "Vito Tinto Interior Chill",
        span: "md:col-span-2 md:row-span-2" // Grande principal
    },
    {
        src: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=800&auto=format&fit=crop",
        alt: "Ruta por la costa",
        span: "md:col-span-1 md:row-span-1"
    },
    {
        src: "https://images.unsplash.com/photo-1510312305653-8ed496efae75?q=80&w=800&auto=format&fit=crop",
        alt: "Atardecer en Mallorca",
        span: "md:col-span-1 md:row-span-1"
    },
    {
        src: "https://images.unsplash.com/photo-1629127712419-450f63b45a05?q=80&w=800&auto=format&fit=crop", // Detalle interior o café
        alt: "Despertar en la naturaleza",
        span: "md:col-span-2 md:row-span-1" // Ancha abajo
    }
]

export default function GallerySection() {
    return (
        <section className="py-20 bg-background">
            <div className="container mx-auto px-4 md:px-6 max-w-screen-xl">
                <div className="text-center mb-12">
                    <h2
                        className="text-4xl lg:text-5xl font-bold text-primary mb-4"
                        style={{ fontFamily: 'var(--font-patrick), cursive' }}
                    >
                        La Protagonista
                    </h2>
                    <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                        Más que una furgoneta. Tu ventana primera fila a los mejores amaneceres de la isla.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-4 h-[120vh] md:h-[600px]">
                    {GALLERY_IMAGES.map((img, idx) => (
                        <div
                            key={idx}
                            className={`relative rounded-2xl overflow-hidden shadow-lg group ${img.span}`}
                        >
                            <Image
                                src={img.src}
                                alt={img.alt}
                                fill
                                className="object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                                <span className="text-white font-medium text-lg font-hand" style={{ fontFamily: 'var(--font-patrick)' }}>
                                    {img.alt}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
