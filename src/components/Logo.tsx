import React from 'react'

export default function Logo({ className = "h-12 w-auto" }: { className?: string }) {
    return (
        <svg
            viewBox="0 0 120 60"
            className={className}
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            xmlns="http://www.w3.org/2000/svg"
        >
            {/* Silueta estilizada de la Vito Tinto */}
            <path d="M15 45 C 10 45, 10 42, 12 38 C 15 30, 20 25, 35 22 C 45 20, 85 20, 100 22 C 110 23, 115 28, 115 35 C 115 42, 112 45, 105 45" />

            {/* Ventanas */}
            <path d="M38 24 L65 24 L65 32 L35 32 Z" fill="currentColor" fillOpacity="0.1" />
            <path d="M70 24 L95 24 C 102 24, 105 27, 105 32 L105 32 L70 32 Z" fill="currentColor" fillOpacity="0.1" />

            {/* Ruedas */}
            <circle cx="32" cy="45" r="5" fill="white" stroke="currentColor" strokeWidth="2" />
            <circle cx="88" cy="45" r="5" fill="white" stroke="currentColor" strokeWidth="2" />

            {/* Detalles */}
            <path d="M12 38 L25 38" opacity="0.5" />
        </svg>
    )
}
