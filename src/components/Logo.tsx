import React from 'react'

export default function Logo({ className = "h-12 w-auto" }: { className?: string }) {
    return (
        <svg
            viewBox="0 0 120 60"
            className={className}
            fill="none"
            stroke="currentColor"
            strokeWidth="1.3"
            strokeLinecap="round"
            strokeLinejoin="round"
            xmlns="http://www.w3.org/2000/svg"
        >
            {/* Silueta mínima estilo trazo artístico */}
            <path d="M15 42 L105 42 M15 42 C12 42, 10 40, 10 37 L10 28 C10 25, 12 23, 15 22 L30 22 C35 22, 40 18, 50 18 L90 18 C100 18, 105 20, 110 25 L115 30 L115 37 C115 40, 113 42, 110 42" />
            <circle cx="28" cy="42" r="4.5" fill="white" stroke="currentColor" />
            <circle cx="92" cy="42" r="4.5" fill="white" stroke="currentColor" />
            <path d="M35 23 L65 23 L65 30 L32 30 C32 26, 33 23, 35 23 Z" opacity="0.2" />
            <path d="M70 23 L105 23 L105 30 L70 30 Z" opacity="0.2" />
        </svg>
    )
}
