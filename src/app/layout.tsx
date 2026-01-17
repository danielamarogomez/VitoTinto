import type { Metadata } from "next";
import { Patrick_Hand, Montserrat } from "next/font/google";
import { Toaster } from 'sonner'
import "react-day-picker/style.css";
import "./globals.css";

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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${patrickHand.variable} ${montserrat.variable} font-sans antialiased bg-[#FFFbf2]`}>
        {children}
        <Toaster position="top-center" />
      </body>
    </html>
  );
}
