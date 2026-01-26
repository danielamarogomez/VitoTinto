"use client"

import BookingWidget from "@/components/BookingWidget"
import HeroTitle from "@/components/HeroTitle"
import GallerySection from "@/components/GallerySection"
import AboutSection from "@/components/AboutSection"
import KnowMallorca from "@/components/KnowMallorca"
import { useLanguage } from "@/context/LanguageContext"

export default function Home() {
  const { t } = useLanguage()
  return (
    <div className="flex flex-col min-h-screen">

      {/* Hero Section */}
      <section id="reservar" className="relative w-full py-20 md:py-32 lg:py-48 bg-[url('/hero-final.png')] bg-cover bg-center overflow-hidden">
        <div className="absolute inset-0 bg-black/40" />
        <div className="container relative mx-auto px-4 md:px-6 max-w-screen-xl">
          <div className="flex flex-col gap-12 lg:flex-row items-start lg:gap-16 lg:-mt-10">
            <HeroTitle />
            <div className="lg:w-auto w-full flex justify-center lg:justify-end">
              <div className="relative z-30 not-prose bg-background rounded-xl shadow-2xl p-4">
                <BookingWidget />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Galería (La Protagonista) - CAMBIO IMPORTANTE: Lo ponemos arriba para enganchar visualmente */}
      <GallerySection />

      {/* Sobre Mí (Andrea) */}
      <AboutSection />

      {/* Features Section (Iconos) - Lo simplificamos o mantenemos como refuerzo */}
      <section className="w-full py-16 bg-background border-t border-border">
        <div className="container mx-auto px-4 md:px-6 text-center max-w-screen-xl">
          <h2
            className="text-3xl font-bold text-primary mb-12"
            style={{ fontFamily: 'var(--font-patrick), cursive' }}
          >
            {t.features.title}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center gap-4 p-6 border border-border/60 rounded-xl bg-[#FFFBF2] hover:shadow-lg transition-all hover:-translate-y-1">
              <div className="p-4 bg-primary/10 rounded-full text-primary text-4xl">🚐</div>
              <h3 className="text-xl font-bold font-hand" style={{ fontFamily: 'var(--font-patrick)' }}>{t.features.f1.title}</h3>
              <p className="text-muted-foreground">
                {t.features.f1.desc}
              </p>
            </div>

            <div className="flex flex-col items-center gap-4 p-6 border border-border/60 rounded-xl bg-[#FFFBF2] hover:shadow-lg transition-all hover:-translate-y-1">
              <div className="p-4 bg-primary/10 rounded-full text-primary text-4xl">🏝️</div>
              <h3 className="text-xl font-bold font-hand" style={{ fontFamily: 'var(--font-patrick)' }}>{t.features.f2.title}</h3>
              <p className="text-muted-foreground">
                {t.features.f2.desc}
              </p>
            </div>

            <div className="flex flex-col items-center gap-4 p-6 border border-border/60 rounded-xl bg-[#FFFBF2] hover:shadow-lg transition-all hover:-translate-y-1">
              <div className="p-4 bg-primary/10 rounded-full text-primary text-4xl">✨</div>
              <h3 className="text-xl font-bold font-hand" style={{ fontFamily: 'var(--font-patrick)' }}>{t.features.f3.title}</h3>
              <p className="text-muted-foreground">
                {t.features.f3.desc}
              </p>
            </div>
          </div>

          <div className="mt-16 flex justify-center">
            <a
              href="#reservar"
              className="bg-primary text-white font-bold py-4 px-10 rounded-full hover:scale-105 transition-transform shadow-xl uppercase tracking-wider text-sm"
            >
              ¡Quiero reservar mi aventura!
            </a>
          </div>
        </div>
      </section>

      {/* Conoce Mallorca */}
      <KnowMallorca />
    </div>
  )
}
