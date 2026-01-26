export type Language = 'es' | 'en'

export type Translations = {
    navbar: {
        theVan: string
        aboutMe: string
        routes: string
        bookNow: string
    }
    hero: {
        title: string
        subtitle: string
        description: string
    }
    features: {
        title: string
        f1: { title: string, desc: string }
        f2: { title: string, desc: string }
        f3: { title: string, desc: string }
    }
    booking: {
        title: string
        subtitle: string
        checkIn: string
        checkOut: string
        continue: string
        basePrice: string
        selectedDates: string
        change: string
        personalize: string
        totalEstimated: string
        vatIncluded: string
        fullName: string
        fullNamePlaceholder: string
        email: string
        emailPlaceholder: string
        phone: string
        phonePlaceholder: string
        message: string
        messagePlaceholder: string
        back: string
        sendRequest: string
        sending: string
        invalidSelection: string
        invalidSelectionDesc: string
        requestSent: string
        requestSentDesc: string
        requiredFields: string
        requiredFieldsDesc: string
        extras: {
            babySeat: string
            paddleSurf: string
            surfKit: string,
            bedding: string
            shower: string
        }
    }
    gallery: {
        title: string
        subtitle: string
        images: { [key: string]: string }
    },
    about: {
        title: string
        p1: string
        p2: string
        p3: string
    },
    routes: {
        title: string
        subtitle: string
        tag: string
        items: {
            tramuntana: { title: string, desc: string, longDesc: string }
            coves: { title: string, desc: string, longDesc: string }
            sunset: { title: string, desc: string, longDesc: string }
        }
        ui: {
            viewDetails: string
            planRoute: string
            tapMap: string
            guide: string
            openMaps: string
            photos: string
            duration: {
                tramuntana: string
                coves: string
                sunset: string
            }
        }
    },
    footer: {
        desc: string
        legal: string
        terms: string
        cancellation: string
        insurance: string
        contact: string
        rights: string
        ownerAccess: string
    },
    email: { // New section for emails
        confirmationSubject: string
        confirmationTitle: string
        confirmationIntro: string
        detailsTitle: string
        checkIn: string
        checkOut: string
        totalPrice: string
        locationTitle: string
        locationDesc: string
        tipsTitle: string
        tipsDesc: string
        questions: string
        questionsDesc: string
        cheers: string
    }
}

export const translations: Record<Language, Translations> = {
    es: {
        navbar: {
            theVan: "Camper",
            aboutMe: "Sobre mí",
            routes: "Experiencia",
            bookNow: "RESERVAR"
        },
        hero: {
            title: "Libertad sobre ruedas",
            subtitle: "Con Vito Tinto",
            description: "Disfruta de una escapada en Mallorca con nuestra camper. Completamente equipada con lo necesario para tu aventura. Una experiencia para los que realmente quieren disfrutar."
        },
        features: {
            title: "¿Por qué nuestra camper Vito Tinto?",
            f1: {
                title: "Totalmente Equipada",
                desc: "Cama doble, camping gas, sábanas, toallas, ducha solar."
            },
            f2: {
                title: "Experiencia Isleña",
                desc: "te ayudamos y acompañamos a planificar el mejor viaje posible con una camper en Mallorca"
            },
            f3: {
                title: "Extras",
                desc: "Servicios complementarios que adaptamos según tus necesidades."
            }
        },
        booking: {
            title: "Reserva tu Aventura",
            subtitle: "Selecciona tus fechas y te confirmaremos la disponibilidad",
            checkIn: "CHECK-IN",
            checkOut: "CHECK-OUT",
            continue: "Continuar y Personalizar",
            basePrice: "Precio base",
            selectedDates: "Fechas seleccionadas:",
            change: "Cambiar",
            personalize: "✨ Personaliza tu viaje",
            totalEstimated: "Total Estimado",
            vatIncluded: "IVA incluido",
            fullName: "Nombre completo *",
            fullNamePlaceholder: "Tu nombre y apellidos",
            email: "Email *",
            emailPlaceholder: "tu@email.com",
            phone: "Teléfono *",
            phonePlaceholder: "+34 600 000 000",
            message: "Mensaje (opcional)",
            messagePlaceholder: "¿Alguna pregunta o petición especial?",
            back: "Volver",
            sendRequest: "Enviar Solicitud",
            sending: "Enviando...",
            invalidSelection: "Selección no válida",
            invalidSelectionDesc: "No puedes seleccionar un rango que incluya fechas ya reservadas.",
            requestSent: "¡Solicitud Enviada!",
            requestSentDesc: "Hemos recibido tu petición. Te confirmaremos la disponibilidad en breve.",
            requiredFields: "Campos Requeridos",
            requiredFieldsDesc: "Por favor, completa todos los campos obligatorios.",
            extras: {
                babySeat: "Silla de Bebé",
                paddleSurf: "Paddle Surf",
                surfKit: "Kit de Surf",
                bedding: "Ropa de Cama",
                shower: "Ducha Exterior"
            }
        },
        gallery: {
            title: "Nuestra Vito Tinto",
            subtitle: "Desliza para ver cada rincón de tu próximo hogar sobre ruedas.",
            images: {
                "Cena bajo las estrellas": "Cena bajo las estrellas",
                "Vito Tinto en el Faro": "Vito Tinto en el Faro",
                "Fachada con encanto": "Fachada con encanto",
                "Interior cálido": "Interior cálido",
                "Café en la carretera": "Café en la carretera",
                "Vistas infinitas": "Vistas infinitas",
                "Noches de lectura": "Noches de lectura",
                "Cama confortable": "Cama confortable",
                "Desayuno Mediterráneo": "Desayuno Mediterráneo",
                "Cocina equipada": "Cocina equipada"
            }
        },
        about: {
            title: "Hola, soy Andrea",
            p1: "Soy una apasionada de la naturaleza y de la libertad que te da viajar sin planes ni prisas. Vito Tinto nació de mi deseo de compartir esa sensación tan especial de despertar frente al mar y descubrir Mallorca desde otro lugar, más auténtico.",
            p2: "Esta camper no está pensada para un alquiler impersonal. La he cuidado con mimo, detalle a detalle, para que no sea solo un vehículo, sino tu pequeño hogar sobre ruedas. La madera, los rincones acogedores y cada espacio tienen una historia y una intención: que te sientas a gusto y vivas la isla de una forma diferente.",
            p3: "Me hace mucha ilusión compartirla con personas que valoran la naturaleza, la libertad y las experiencias reales. Ojalá la disfrutes tanto como yo… y que Vito Tinto forme parte de tu aventura en Mallorca."
        },
        routes: {
            title: "Tus Rutas Tinto",
            subtitle: "Descubre Mallorca a tu ritmo",
            tag: "Aventuras Mallorquinas",
            items: {
                tramuntana: {
                    title: "Serra de Tramuntana",
                    desc: "De Valldemossa a Formentor. Patrimonio de la Humanidad.",
                    longDesc: "La ruta por excelencia. Empieza tomando un café y una coca de patata en Valldemossa, piérdete por las calles de Deià y baja hasta sa Calobra para desafiar sus curvas. La Serra es el alma salvaje de Mallorca."
                },
                coves: {
                    title: "Calas & Turquesa",
                    desc: "El Caribe mallorquín. Caló des Moro y Es Trenc.",
                    longDesc: "Baja al sur para encontrar el agua más cristalina. Desde el famoso arco de Es Pontàs hasta la arena blanca de Es Trenc. Es la zona perfecta para aparcar la furgo cerca del mar y desconectar."
                },
                sunset: {
                    title: "Puestas de Sol",
                    desc: "Andratx y la costa oeste. Magia al atardecer.",
                    longDesc: "La costa de Ponent tiene una luz especial. Conduce hasta el Mirador de Sa Foradada para ver caer el sol sobre el mar o visita el puerto de Andratx. Carreteras tranquilas y vistas infinitas."
                }
            },
            ui: {
                viewDetails: "Ver Detalles de la Ruta",
                planRoute: "Prepara la Ruta",
                tapMap: "Toca una de las fotos sobre el mapa real para descubrir los detalles de nuestras rutas favoritas por la isla.",
                guide: "Guía de Ruta",
                openMaps: "Abrir en Google Maps",
                photos: "fotos",
                duration: {
                    tramuntana: "2-3 días",
                    coves: "1-2 días",
                    sunset: "1 día"
                }
            }
        },
        footer: {
            desc: "Tu pasaporte a la libertad. Alquilamos una furgoneta camper para que vivas aventuras inolvidables con el máximo estilo y confort.",
            legal: "LEGAL",
            terms: "Términos y Condiciones",
            cancellation: "Política de Cancelación",
            insurance: "Seguros y Fianza",
            contact: "CONTACTO",
            rights: "Vito Tinto. Todos los derechos reservados.",
            ownerAccess: "Acceso Propietario"
        },
        email: {
            confirmationSubject: "¡Reserva Confirmada! 🚐 - Tu aventura comienza el",
            confirmationTitle: "¡Todo listo para tu aventura!",
            confirmationIntro: "Hemos recibido el pago correctamente y tu reserva está confirmada. ¡Qué ganas de que vivas la experiencia Vito Tinto!",
            detailsTitle: "Detalles de la Reserva",
            checkIn: "Fecha de inicio",
            checkOut: "Fecha de fin",
            totalPrice: "Precio Total",
            locationTitle: "📍 Punto de Recogida",
            locationDesc: "Te enviaré la ubicación exacta por WhatsApp unos días antes. Normalmente nos vemos cerca del aeropuerto o en Palma centro.",
            tipsTitle: "🎒 Qué llevar",
            tipsDesc: "Toalla de playa, bañador, protector solar y muchas ganas de disfrutar. ¡La furgo tiene sábanas, toallas de ducha y cocina equipada!",
            questions: "¿Dudas?",
            questionsDesc: "Escríbeme por WhatsApp si necesitas recomendaciones de rutas o tienes alguna pregunta.",
            cheers: "¡Nos vemos pronto en la carretera!"
        }
    },
    en: {
        navbar: {
            theVan: "Camper",
            aboutMe: "About me",
            routes: "Experience",
            bookNow: "BOOK NOW"
        },
        hero: {
            title: "Freedom on wheels",
            subtitle: "With Vito Tinto",
            description: "Enjoy a getaway in Mallorca with our camper. Fully equipped with everything you need for your adventure. An experience for those who really want to enjoy."
        },
        features: {
            title: "Why our Vito Tinto camper?",
            f1: {
                title: "Fully Equipped",
                desc: "Double bed, camping gas, sheets, towels, solar shower."
            },
            f2: {
                title: "Island Experience",
                desc: "We help and accompany you in planning the best possible trip with a camper in Mallorca"
            },
            f3: {
                title: "Extras",
                desc: "Complementary services that we adapt according to your needs."
            }
        },
        booking: {
            title: "Book your Adventure",
            subtitle: "Select your dates and we'll confirm availability",
            checkIn: "CHECK-IN",
            checkOut: "CHECK-OUT",
            continue: "Continue & Customize",
            basePrice: "Base price",
            selectedDates: "Selected dates:",
            change: "Change",
            personalize: "✨ Personalize your trip",
            totalEstimated: "Estimated Total",
            vatIncluded: "VAT included",
            fullName: "Full Name *",
            fullNamePlaceholder: "Your full name",
            email: "Email *",
            emailPlaceholder: "you@email.com",
            phone: "Phone *",
            phonePlaceholder: "+34 600 000 000",
            message: "Message (optional)",
            messagePlaceholder: "Any questions or special requests?",
            back: "Back",
            sendRequest: "Send Request",
            sending: "Sending...",
            invalidSelection: "Invalid Selection",
            invalidSelectionDesc: "You cannot select a range that includes already booked dates.",
            requestSent: "Request Sent!",
            requestSentDesc: "We have received your request. We will confirm availability shortly.",
            requiredFields: "Required Fields",
            requiredFieldsDesc: "Please fill in all required fields.",
            extras: {
                babySeat: "Baby Seat",
                paddleSurf: "Paddle Surf",
                surfKit: "Surf Kit",
                bedding: "Bedding",
                shower: "Outdoor Shower"
            }
        },
        gallery: {
            title: "Our Vito Tinto",
            subtitle: "Swipe to see every corner of your next home on wheels.",
            images: {
                "Cena bajo las estrellas": "Dinner under the stars",
                "Vito Tinto en el Faro": "Vito Tinto at the Lighthouse",
                "Fachada con encanto": "Charming facade",
                "Interior cálido": "Warm interior",
                "Café en la carretera": "Coffee on the road",
                "Vistas infinitas": "Infinite views",
                "Noches de lectura": "Reading nights",
                "Cama confortable": "Comfortable bed",
                "Desayuno Mediterráneo": "Mediterranean Breakfast",
                "Cocina equipada": "Equipped kitchen"
            }
        },
        about: {
            title: "Hi, I'm Andrea",
            p1: "I am passionate about nature and the freedom of traveling without plans or haste. Vito Tinto was born from my desire to share that special feeling of waking up by the sea and discovering Mallorca from another, more authentic place.",
            p2: "This camper is not meant for impersonal rental. I have cared for it with love, detail by detail, so that it is not just a vehicle, but your little home on wheels. The wood, the cozy corners, and every space have a story and an intention: for you to feel at ease and experience the island in a different way.",
            p3: "I am thrilled to share it with people who value nature, freedom, and real experiences. I hope you enjoy it as much as I do… and that Vito Tinto becomes part of your adventure in Mallorca."
        },
        routes: {
            title: "Your Tinto Routes",
            subtitle: "Discover Mallorca at your own pace",
            tag: "Mallorcan Adventures",
            items: {
                tramuntana: {
                    title: "Serra de Tramuntana",
                    desc: "From Valldemossa to Formentor. World Heritage Site.",
                    longDesc: "The route par excellence. Start by having a coffee and a potato cake in Valldemossa, get lost in the streets of Deià and go down to Sa Calobra to challenge its curves. The Serra is the wild soul of Mallorca."
                },
                coves: {
                    title: "Coves & Turquoise",
                    desc: "The Mallorcan Caribbean. Caló des Moro and Es Trenc.",
                    longDesc: "Go down south to find the most crystal clear water. From the famous arch of Es Pontàs to the white sand of Es Trenc. It is the perfect area to park the van near the sea and disconnect."
                },
                sunset: {
                    title: "Sunsets",
                    desc: "Andratx and the west coast. Magic at sunset.",
                    longDesc: "The Ponent coast has a special light. Drive to the Mirador de Sa Foradada to watch the sun go down over the sea or visit the port of Andratx. Quiet roads and infinite views."
                }
            },
            ui: {
                viewDetails: "View Route Details",
                planRoute: "Plan the Route",
                tapMap: "Tap on one of the photos on the real map to discover the details of our favorite routes around the island.",
                guide: "Route Guide",
                openMaps: "Open in Google Maps",
                photos: "photos",
                duration: {
                    tramuntana: "2-3 days",
                    coves: "1-2 days",
                    sunset: "1 day"
                }
            }
        },
        footer: {
            desc: "Your passport to freedom. We rent a campervan for you to live unforgettable adventures with maximum style and comfort.",
            legal: "LEGAL",
            terms: "Terms & Conditions",
            cancellation: "Cancellation Policy",
            insurance: "Insurance & Deposit",
            contact: "CONTACT",
            rights: "Vito Tinto. All rights reserved.",
            ownerAccess: "Owner Access"
        },
        email: {
            confirmationSubject: "Booking Confirmed! 🚐 - Your adventure starts on",
            confirmationTitle: "Everything is ready for your adventure!",
            confirmationIntro: "We have received the payment correctly and your booking is confirmed. We can't wait for you to experience Vito Tinto!",
            detailsTitle: "Booking Details",
            checkIn: "Start Date",
            checkOut: "End Date",
            totalPrice: "Total Price",
            locationTitle: "📍 Pick-up Point",
            locationDesc: "I will send you the exact location via WhatsApp a few days before. Usually we meet near the airport or in Palma center.",
            tipsTitle: "🎒 What to bring",
            tipsDesc: "Beach towel, swimsuit, sunscreen and lots of desire to enjoy. The van has sheets, shower towels and an equipped kitchen!",
            questions: "Questions?",
            questionsDesc: "Text me on WhatsApp if you need route recommendations or have any questions.",
            cheers: "See you soon on the road!"
        }
    }
}
