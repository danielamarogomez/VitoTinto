import React from 'react'
import Image from 'next/image'

export default function Logo({ className = "h-12 w-auto" }: { className?: string }) {
    return (
        <div className={`relative ${className}`}>
            <Image
                src="/logo.png"
                alt="Vito Tinto Logo"
                fill
                className="object-contain"
                priority
            />
        </div>
    )
}
