"use client"

import Link from 'next/link'
import Logo from '@/components/Logo'
import { useLanguage } from '@/context/LanguageContext'

export default function Navbar() {
    const { t, language, setLanguage } = useLanguage()

    return (
        <nav className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
            <div className="container flex h-20 items-center mx-auto px-4 max-w-screen-xl justify-between">
                <Link href="/" className="mr-6 flex items-center space-x-3">
                    <Logo className="h-14 w-14" />
                    <span
                        className="font-bold text-3xl text-primary mt-1"
                        style={{ fontFamily: 'var(--font-patrick), cursive' }}
                    >
                        Vito Tinto
                    </span>
                </Link>
                <div className="hidden md:flex items-center space-x-8">
                    <Link href="/#la-furgo" className="text-sm font-bold text-primary hover:text-primary/70 transition-colors">
                        {t.navbar.theVan}
                    </Link>
                    <Link href="/#sobre-mi" className="text-sm font-bold text-primary hover:text-primary/70 transition-colors">
                        {t.navbar.aboutMe}
                    </Link>
                    <Link href="/#rutas" className="text-sm font-bold text-primary hover:text-primary/70 transition-colors">
                        {t.navbar.routes}
                    </Link>

                    {/* Language Switcher */}
                    <div className="flex items-center gap-2 text-sm font-bold border-l border-primary/20 pl-6">
                        <button
                            onClick={() => setLanguage('es')}
                            className={`transition-colors hover:text-primary ${language === 'es' ? 'text-primary' : 'text-primary/40'}`}
                        >
                            ES
                        </button>
                        <span className="text-primary/20">|</span>
                        <button
                            onClick={() => setLanguage('en')}
                            className={`transition-colors hover:text-primary ${language === 'en' ? 'text-primary' : 'text-primary/40'}`}
                        >
                            EN
                        </button>
                    </div>

                    <Link
                        href="/#reservar"
                        className="bg-primary text-primary-foreground px-5 py-2 rounded-full text-xs font-bold hover:bg-primary/90 transition-all shadow-md transform hover:scale-105"
                    >
                        {t.navbar.bookNow}
                    </Link>
                </div>

                {/* Botón Reservar visible en móvil también */}
                <div className="md:hidden flex items-center gap-4">
                    {/* Language Switcher Mobile */}
                    <div className="flex items-center gap-2 text-xs font-bold">
                        <button
                            onClick={() => setLanguage('es')}
                            className={`${language === 'es' ? 'text-primary' : 'text-primary/40'}`}
                        >
                            ES
                        </button>
                        <span className="text-primary/20">|</span>
                        <button
                            onClick={() => setLanguage('en')}
                            className={`${language === 'en' ? 'text-primary' : 'text-primary/40'}`}
                        >
                            EN
                        </button>
                    </div>

                    <Link
                        href="/#reservar"
                        className="bg-primary text-primary-foreground px-4 py-2 rounded-full text-xs font-bold hover:bg-primary/90 transition-all shadow-md"
                    >
                        {t.navbar.bookNow}
                    </Link>
                </div>
            </div>
        </nav>
    )
}
