import type { Metadata } from "next";
import { Patrick_Hand, Montserrat } from "next/font/google";
import { Toaster } from 'sonner'
import "react-day-picker/style.css";
import "./globals.css";
import { LanguageProvider } from "@/context/LanguageContext";
import { GoogleAnalytics } from '@next/third-parties/google'

const patrickHand = Patrick_Hand({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-patrick",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
});

export const metadata: Metadata = {
  title: "Vito Tinto - Camper Experience",
  description: "Alquila tu furgoneta camperizada premium.",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${patrickHand.variable} ${montserrat.variable} font-sans antialiased bg-[#FFFbf2]`}>
        <LanguageProvider>
          {children}
          <Toaster position="top-center" />
        </LanguageProvider>
        <GoogleAnalytics gaId="G-ZTZ7N2DNSC" />
      </body>
    </html>
  );
}
