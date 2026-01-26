import React from 'react'

export default function Logo({ className = "h-12 w-auto" }: { className?: string }) {
    return (
        <svg
            viewBox="0 0 100 60"
            className={className}
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            xmlns="http://www.w3.org/2000/svg"
        >
            {/* Silueta compacta real Mercedes Vito */}
            <path
                d="M10 48 L90 48 L90 20 L45 20 C35 20, 28 22, 22 28 L10 38 Z"
                fill="none"
            />

            {/* Ventanas con proporciones reales */}
            <path d="M25 30 L42 25 L42 42 L18 42 Z" fill="currentColor" fillOpacity="0.15" stroke="none" />
            <path d="M48 24 L65 24 L65 42 L48 42 Z" fill="currentColor" fillOpacity="0.1" stroke="none" />
            <path d="M69 24 L86 24 L86 42 L69 42 Z" fill="currentColor" fillOpacity="0.1" stroke="none" />

            {/* Ruedas compactas */}
            <circle cx="25" cy="48" r="6" fill="white" stroke="currentColor" />
            <circle cx="75" cy="48" r="6" fill="white" stroke="currentColor" />
        </svg>
    )
}
