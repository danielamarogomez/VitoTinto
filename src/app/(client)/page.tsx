import BookingWidget from "@/components/BookingWidget"
import HeroTitle from "@/components/HeroTitle"
import MallorcaRoutes from "@/components/MallorcaRoutes"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* ... Hero Section ... */}
      {/* (Mantener código anterior) */}

      {/* Hero Section */}
      <section className="relative w-full py-20 md:py-32 lg:py-48 bg-[url('/dashboard-hero.jpg')] bg-cover bg-center overflow-hidden">
        {/* ... Contenido Hero ... */}
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

      {/* Features Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-background">
        {/* ... Contenido Features ... */}
        <div className="container mx-auto px-4 md:px-6 text-center max-w-screen-xl">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-primary mb-12">
            ¿Por qué elegir Vito Tinto?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center gap-4 p-6 border rounded-xl bg-card hover:shadow-lg transition-shadow">
              <div className="p-4 bg-primary/10 rounded-full text-primary text-4xl">🚐</div>
              <h3 className="text-xl font-bold">Totalmente Equipada</h3>
              <p className="text-muted-foreground">
                Cocina, cama doble y todo el menaje necesario. Solo trae tu maleta.
              </p>
            </div>

            <div className="flex flex-col items-center gap-4 p-6 border rounded-xl bg-card hover:shadow-lg transition-shadow">
              <div className="p-4 bg-primary/10 rounded-full text-primary text-4xl">🍷</div>
              <h3 className="text-xl font-bold">Experiencia Premium</h3>
              <p className="text-muted-foreground">
                Detalles cuidados y un diseño acogedor que te hará sentir como en casa.
              </p>
            </div>

            <div className="flex flex-col items-center gap-4 p-6 border rounded-xl bg-card hover:shadow-lg transition-shadow">
              <div className="p-4 bg-primary/10 rounded-full text-primary text-4xl">🗺️</div>
              <h3 className="text-xl font-bold">Kilometraje Flexible</h3>
              <p className="text-muted-foreground">
                Opciones adaptadas a tu viaje, ya sea una escapada cercana o un gran roadtrip.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Rutas Recomendadas */}
      <MallorcaRoutes />
    </div>
  )
}
