"use client"

import { useEffect } from "react"

interface AnimationItem {
    id: string
    image: string
    startX: number
    startY: number
}

interface AddToCartAnimationProps {
    item: AnimationItem | null
    onComplete: () => void
}

export function AddToCartAnimation({ item, onComplete }: AddToCartAnimationProps) {
    useEffect(() => {
        if (item) {
            // Limpiar inmediatamente ya que no hay animación visual
            onComplete()
        }
    }, [item, onComplete])

    // No renderizar nada
    return null
}
