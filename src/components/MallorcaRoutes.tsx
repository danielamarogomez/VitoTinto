"use client"

import { useState, useEffect } from "react"
import dynamic from "next/dynamic"
import { MapPin, Mountain, Waves, Compass, X, Clock, ChevronRight, Info, Camera, Map as MapIcon } from "lucide-react"
import "leaflet/dist/leaflet.css"

// Importación dinámica para evitar errores en el servidor (SSR)
const MapContainer = dynamic(() => import("react-leaflet").then((mod) => mod.MapContainer), { ssr: false })
const TileLayer = dynamic(() => import("react-leaflet").then((mod) => mod.TileLayer), { ssr: false })
const Marker = dynamic(() => import("react-leaflet").then((mod) => mod.Marker), { ssr: false })
const Popup = dynamic(() => import("react-leaflet").then((mod) => mod.Popup), { ssr: false })

// Datos de las rutas con coordenadas reales [lat, lng]
// Datos de las rutas con coordenadas reales [lat, lng]
const routes = [
    {
        id: "tramuntana",
        title: "Sierra de Tramuntana",
        description: "De Valldemossa a Formentor. Patrimonio de la Humanidad. La ruta más espectacular.",
        longDescription: "La Sierra de Tramuntana es la joya de Mallorca. Recorre la mítica carretera de Sa Calobra, visita pueblos de cuento como Valldemossa y Deià, y termina dándote un baño en las aguas cristalinas de Cala Deià. Imprescindible para los amantes de la conducción y la montaña.",
        latlng: [39.79, 2.75] as [number, number],
        image: "https://images.unsplash.com/photo-1537042145420-22c608f6159c?q=80&w=2670&auto=format&fit=crop", // Sa Calobra
        type: "Montaña",
        duration: "2-3 días",
        icon: <Mountain className="h-5 w-5" />,
        gallery: [
            "https://images.unsplash.com/photo-1537042145420-22c608f6159c?q=80&w=2670&auto=format&fit=crop", // Sa Calobra
            "https://images.unsplash.com/photo-1518182170546-0766ce6fec56?q=80&w=2670&auto=format&fit=crop", // Valldemossa
            "https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?q=80&w=2565&auto=format&fit=crop"  // Cala Deià vibes
        ]
    },
    {
        id: "southeast",
        title: "Calas & Turquesa",
        description: "El Caribe mallorquín. Caló des Moro, Mondragó y Es Trenc.",
        longDescription: "Si buscas ese azul turquesa imposible, pon rumbo al sureste. Desde el icónico Caló des Moro hasta la arena blanca infinita de Es Trenc. Pueblos como Santanyí te esperan con mercados locales y una gastronomía increíble. Ideal para relax total.",
        latlng: [39.36, 3.12] as [number, number],
        image: "https://images.unsplash.com/photo-1507718919630-f5a020c6a32d?q=80&w=2670&auto=format&fit=crop", // Caló des Moro style
        type: "Playa",
        duration: "1-2 días",
        icon: <Waves className="h-5 w-5" />,
        gallery: [
            "https://images.unsplash.com/photo-1507718919630-f5a020c6a32d?q=80&w=2670&auto=format&fit=crop", // Calas
            "https://images.unsplash.com/photo-1533105079780-92b9be482077?q=80&w=2574&auto=format&fit=crop", // Es Trenc
            "https://images.unsplash.com/photo-1515238152791-8216bfdf89a7?q=80&w=2672&auto=format&fit=crop"  // Agua cristalina
        ]
    },
    {
        id: "volent",
        title: "La Ruta del Sol",
        description: "Andratx y la costa oeste. Los mejores atardeceres de la isla.",
        longDescription: "La costa de Ponent es magia pura al atardecer. Conduce hasta el mirador de Sa Foradada o tómate algo en Banyalbufar viendo caer el sol. Una ruta romántica, tranquila y llena de miradores que te dejarán sin aliento.",
        latlng: [39.65, 2.50] as [number, number], // Ajustado para que quede mejor en el mapa
        image: "https://images.unsplash.com/photo-1510312305653-8ed496efae75?q=80&w=2670&auto=format&fit=crop", // Sa Foradada sunset
        type: "Relax",
        duration: "1 día",
        icon: <Compass className="h-5 w-5" />,
        gallery: [
            "https://images.unsplash.com/photo-1510312305653-8ed496efae75?q=80&w=2670&auto=format&fit=crop", // Sunset
            "https://images.unsplash.com/photo-1534234828569-786d5267bf7b?q=80&w=2670&auto=format&fit=crop", // Costa rocosa
            "https://images.unsplash.com/photo-1471922694854-ff1b63b20054?q=80&w=2672&auto=format&fit=crop"  // Mar abierto
        ]
    }
]

export default function MallorcaMapRoutes() {
    const [selectedId, setSelectedId] = useState<string | null>(null)
    const [showFullDetails, setShowFullDetails] = useState(false)
    const [isMounted, setIsMounted] = useState(false)
    const [L, setL] = useState<any>(null)

    const selectedRoute = routes.find(r => r.id === selectedId)

    useEffect(() => {
        setIsMounted(true)
        import("leaflet").then((leaf) => {
            setL(leaf)
        })
    }, [])

    if (!isMounted || !L) return <div className="h-[600px] w-full bg-muted animate-pulse rounded-[40px]" />

    // Función para crear icono de chincheta (Pin) visible
    const createPinIcon = (isSelected: boolean) => {
        const color = '#722f37'; // Tinto
        const scale = isSelected ? 'scale-125' : 'hover:scale-110';

        return L.divIcon({
            className: "custom-pin-icon",
            html: `
                <div class="relative flex flex-col items-center justify-center transform transition-transform duration-300 ${scale} -mt-8">
                   <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${color}" stroke="white" stroke-width="2" width="48" height="48" class="drop-shadow-xl">
                        <path fill-rule="evenodd" d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 00-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 002.682 2.282 16.975 16.975 0 001.145.742zM12 13.5a3 3 0 100-6 3 3 0 000 6z" clip-rule="evenodd" />
                    </svg>
                    <div class="w-3 h-1 bg-black/30 rounded-full blur-[2px] mt-[-2px]"></div>
                </div>
            `,
            iconSize: [48, 48],
            iconAnchor: [24, 48], // La punta del pin (abajo centro)
            popupAnchor: [0, -48] // El popup sale arriba
        })
    }

    return (
        <section id="rutas" className="w-full py-24 bg-background overflow-hidden">
            <div className="container mx-auto px-4 max-w-screen-xl">
                <div className="flex flex-col items-center text-center mb-16">
                    <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest mb-4">
                        <MapIcon className="h-3 w-3" />
                        <span>Aventuras Mallorquinas</span>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-black text-primary tracking-tight mb-4">
                        Tus Rutas Tinto
                    </h2>
                    <p className="text-muted-foreground text-lg max-w-2xl px-4">
                        Haz clic en las fotos del mapa para descubrir los mejores rincones de la Roqueta.
                    </p>
                </div>

                <div className="relative flex flex-col lg:flex-row gap-8 items-stretch h-[700px]">
                    {/* Mapa Real de Leaflet */}
                    <div className="relative flex-1 rounded-[40px] overflow-hidden border border-border shadow-2xl z-10">
                        <MapContainer
                            center={[39.63, 2.9]}
                            zoom={9}
                            scrollWheelZoom={false}
                            className="w-full h-full"
                        >
                            <TileLayer
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                className="grayscale-map"
                            />

                            {routes.map((route) => (
                                <Marker
                                    key={route.id}
                                    position={route.latlng}
                                    icon={createPinIcon(selectedId === route.id)}
                                    eventHandlers={{
                                        click: () => setSelectedId(route.id),
                                    }}
                                >
                                    <Popup className="custom-popup">
                                        <div className="p-1 min-w-[120px]">
                                            <p className="font-bold text-primary mb-1 text-sm">{route.title}</p>
                                            <button
                                                onClick={() => setShowFullDetails(true)}
                                                className="text-[10px] font-bold text-primary underline"
                                            >
                                                Ver más
                                            </button>
                                        </div>
                                    </Popup>
                                </Marker>
                            ))}
                        </MapContainer>
                    </div>

                    {/* Tarjeta de Información Lateral */}
                    <div className="w-full lg:w-[420px] h-full">
                        {selectedRoute ? (
                            <div className="animate-in slide-in-from-right-10 fade-in duration-500 bg-card border border-border rounded-[32px] overflow-hidden shadow-2xl h-full flex flex-col">
                                <div className="h-64 relative overflow-hidden group">
                                    <img
                                        src={selectedRoute.image}
                                        alt={selectedRoute.title}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                    <button
                                        onClick={() => setSelectedId(null)}
                                        className="absolute top-4 right-4 p-2.5 bg-black/50 backdrop-blur-md rounded-full text-white hover:bg-black/70 transition-colors z-20"
                                    >
                                        <X className="h-4 w-4" />
                                    </button>
                                    <div className="absolute top-4 left-4 bg-primary px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest text-white shadow-lg z-20">
                                        {selectedRoute.type}
                                    </div>
                                    <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/60 to-transparent"></div>
                                </div>
                                <div className="p-8 flex-1 flex flex-col">
                                    <div className="flex items-center gap-3 text-primary mb-4">
                                        <div className="p-2 bg-primary/10 rounded-xl">
                                            {selectedRoute.icon}
                                        </div>
                                        <h3 className="text-2xl font-black tracking-tight">{selectedRoute.title}</h3>
                                    </div>
                                    <p className="text-muted-foreground leading-relaxed mb-8 flex-1">
                                        {selectedRoute.description}
                                    </p>
                                    <div className="mt-auto pt-8 border-t border-border flex flex-col gap-6">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2.5 text-sm font-bold text-primary px-4 py-2 bg-primary/5 rounded-2xl">
                                                <Clock className="h-4 w-4" />
                                                {selectedRoute.duration}
                                            </div>
                                            <div className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground">
                                                <Camera className="h-3.5 w-3.5" />
                                                3 fotos
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => setShowFullDetails(true)}
                                            className="w-full flex items-center justify-center gap-2 bg-primary text-white font-black text-xs uppercase tracking-widest py-4 rounded-xl hover:bg-primary/90 transition-all hover:scale-[1.02] active:scale-95 shadow-lg shadow-primary/20"
                                        >
                                            Ver Detalles de la Ruta
                                            <ChevronRight className="h-4 w-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="h-full border-2 border-dashed border-border rounded-[32px] flex flex-col items-center justify-center p-12 text-center bg-muted/20">
                                <div className="p-6 bg-primary/10 rounded-[2rem] text-primary mb-6 animate-bounce">
                                    <Compass className="h-12 w-12" />
                                </div>
                                <h3 className="text-2xl font-black mb-3 text-primary">Prepara la Ruta</h3>
                                <p className="text-muted-foreground leading-relaxed">
                                    Toca una de las fotos sobre el mapa real para descubrir los detalles de nuestras rutas favoritas por la isla.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Modal de Detalles Interactivos */}
            {showFullDetails && selectedRoute && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 animate-in fade-in duration-300">
                    <div
                        className="absolute inset-0 bg-black/60 backdrop-blur-md"
                        onClick={() => setShowFullDetails(false)}
                    ></div>
                    <div className="relative bg-white dark:bg-zinc-900 w-full max-w-4xl max-h-[90vh] rounded-[40px] overflow-hidden shadow-2xl flex flex-col md:flex-row animate-in zoom-in-95 slide-in-from-bottom-10 duration-500">
                        <div className="w-full md:w-1/2 h-64 md:h-auto overflow-y-auto p-2 grid grid-cols-1 gap-2 bg-muted/10">
                            {selectedRoute.gallery.map((img, i) => (
                                <img
                                    key={i}
                                    src={img}
                                    className="w-full aspect-video object-cover rounded-2xl shadow-sm hover:scale-[1.02] transition-transform cursor-pointer"
                                    alt={`Gallery ${i}`}
                                />
                            ))}
                        </div>
                        <div className="flex-1 p-8 md:p-12 overflow-y-auto flex flex-col">
                            <button
                                onClick={() => setShowFullDetails(false)}
                                className="self-end p-2 hover:bg-muted rounded-full transition-colors mb-4"
                            >
                                <X className="h-6 w-6" />
                            </button>
                            <div className="flex items-center gap-3 text-primary mb-6">
                                <Info className="h-6 w-6" />
                                <span className="text-xs font-black uppercase tracking-widest">Guía de Ruta</span>
                            </div>
                            <h2 className="text-4xl font-black text-primary tracking-tight mb-6">
                                {selectedRoute.title}
                            </h2>
                            <div className="flex items-center gap-4 mb-8">
                                <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-[10px] font-black uppercase">
                                    {selectedRoute.type}
                                </span>
                                <span className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground">
                                    <Clock className="h-4 w-4" />
                                    {selectedRoute.duration}
                                </span>
                            </div>
                            <p className="text-muted-foreground text-lg leading-relaxed mb-8">
                                {selectedRoute.longDescription}
                            </p>
                            <div className="mt-auto">
                                <button className="w-full bg-primary text-white font-black text-xs uppercase tracking-widest py-4 rounded-2xl shadow-xl shadow-primary/20 flex items-center justify-center gap-3">
                                    <MapIcon className="h-4 w-4" />
                                    Abrir en Google Maps
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <style jsx global>{`
                .leaflet-container {
                    background: #f0f0f0 !important;
                }
                .grayscale-map {
                    filter: grayscale(0.2) contrast(1.1) brightness(1.1);
                }
                .custom-popup .leaflet-popup-content-wrapper {
                    background: white;
                    color: #333;
                    border-radius: 20px;
                    padding: 8px;
                    border: 1px solid rgba(0,0,0,0.05);
                    box-shadow: 0 10px 25px -5px rgba(0,0,0,0.1);
                }
                .custom-popup .leaflet-popup-tip {
                    background: white;
                }
                .custom-photo-icon {
                    background: transparent !important;
                    border: none !important;
                }
            `}</style>
        </section>
    )
}
