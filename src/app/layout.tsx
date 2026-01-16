import type { Metadata } from "next";
import { Toaster } from 'sonner'
import "react-day-picker/style.css";
import "./globals.css";

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
      <body className="antialiased">
        {children}
        <Toaster position="top-center" />
      </body>
    </html>
  );
}
