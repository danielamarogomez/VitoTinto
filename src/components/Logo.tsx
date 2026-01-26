import React from 'react'

export default function Logo({ className = "h-12 w-auto" }: { className?: string }) {
    return (
        <svg
            viewBox="0 0 100 50"
            className={className}
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            xmlns="http://www.w3.org/2000/svg"
        >
            {/* Silueta clásica Mercedes Vito */}
            <path d="M5 38 L95 38 L95 24 C95 20, 92 18, 88 18 L35 18 C28 18, 20 20, 15 25 L5 32 Z" />

            {/* Ventanas */}
            <path d="M18 26 L32 23 L32 30 L15 30 Z" opacity="0.3" fill="currentColor" />
            <path d="M36 21 L65 21 L65 30 L36 30 Z" opacity="0.3" fill="currentColor" />
            <path d="M69 21 L92 21 L92 30 L69 30 Z" opacity="0.3" fill="currentColor" />

            {/* Ruedas */}
            <circle cx="22" cy="38" r="4.5" fill="white" stroke="currentColor" />
            <circle cx="78" cy="38" r="4.5" fill="white" stroke="currentColor" />
        </svg>
    )
}
