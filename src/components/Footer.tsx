"use client"

import Link from 'next/link'
import Logo from '@/components/Logo'
import { MessageCircle, Mail } from "lucide-react"
import { useLanguage } from "@/context/LanguageContext"

export default function Footer() {
    const { t } = useLanguage()

    return (
        <footer className="bg-card border-t border-border mt-auto">
            <div className="container mx-auto px-4 py-12 max-w-screen-xl">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
                    {/* Brand Info */}
                    <div className="md:col-span-2 space-y-6">
                        <Link href="/" className="flex items-center space-x-3">
                            <Logo className="h-10 w-auto" />
                            <span className="font-bold text-primary text-xl tracking-tight">
                                Vito Tinto
                            </span>
                        </Link>
                        <p className="text-muted-foreground max-w-sm">
                            {t.footer.desc}
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div className="space-y-4">
                        <h4 className="font-bold text-foreground uppercase text-xs tracking-widest text-primary/70">{t.footer.legal}</h4>
                        <ul className="space-y-3">
                            <li>
                                <Link href="/terms" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                                    {t.footer.terms}
                                </Link>
                            </li>
                            <li>
                                <Link href="/terms#cancelacion" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                                    {t.footer.cancellation}
                                </Link>
                            </li>
                            <li>
                                <Link href="/terms#seguros" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                                    {t.footer.insurance}
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Columna Contacto */}
                    <div className="md:col-span-1 space-y-4">
                        <h4 className="font-bold text-sm tracking-widest uppercase text-primary/80">{t.footer.contact}</h4>
                        <div className="space-y-3">
                            <a
                                href="https://wa.me/34692476002"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-start gap-3 group"
                            >
                                <div className="mt-1">
                                    <MessageCircle className="h-5 w-5 text-primary group-hover:scale-110 transition-transform" />
                                </div>
                                <div>
                                    <p className="font-semibold text-primary">WhatsApp</p>
                                    <p className="text-muted-foreground group-hover:text-primary transition-colors">+34 692 476 002</p>
                                </div>
                            </a>

                            <a
                                href="mailto:hey@alquilercampermallorca.com"
                                className="flex items-start gap-3 group"
                            >
                                <div className="mt-1">
                                    <Mail className="h-5 w-5 text-primary group-hover:scale-110 transition-transform" />
                                </div>
                                <div>
                                    <p className="font-semibold text-primary">Email</p>
                                    <p className="text-muted-foreground group-hover:text-primary transition-colors">hey@alquilercampermallorca.com</p>
                                </div>
                            </a>
                        </div>
                    </div>
                </div>

                {/* Barra Inferior */}
                <div className="border-t border-primary/10 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
                    <p>© {new Date().getFullYear()} {t.footer.rights}</p>
                    <div className="flex items-center gap-6">
                        <Link href="/login" className="hover:text-primary transition-colors text-xs opacity-50 hover:opacity-100">
                            {t.footer.ownerAccess}
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    )
}
