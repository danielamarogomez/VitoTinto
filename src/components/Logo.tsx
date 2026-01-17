import React from 'react'

export default function Logo({ className = "h-12 w-auto" }: { className?: string }) {
    return (
        <img
            src="/logo.png"
            alt="Vito Tinto Logo"
            className={`${className} object-contain mix-blend-multiply contrast-125`}
        />
    )
}
