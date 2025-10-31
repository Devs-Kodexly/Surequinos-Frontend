"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { useCart } from "@/lib/cart-context"

interface ProductCardProps {
  id: string
  title: string
  description: string
  price: string
  priceNumber: number
  originalPrice?: string
  discount?: string
  stock?: string
  badge?: string
  hasStyleSelector?: boolean
  image?: string
}

export function ProductCard({
  id,
  title,
  description,
  price,
  priceNumber,
  originalPrice,
  discount,
  stock,
  badge,
  hasStyleSelector,
  image,
}: ProductCardProps) {
  const { addItem } = useCart()

  const handleAddToCart = () => {
    addItem({
      id,
      title,
      price: priceNumber,
      quantity: 1,
      image: image || `/productos/${title.toLowerCase().replace(/\s+/g, '-')}.jpg`,
      color: "Negro",
    })
  }

  return (
    <div className="bg-card rounded-lg overflow-hidden border border-border hover:border-[#E5AB4A]/50 transition-colors">
      <div className="relative aspect-square bg-muted">
        {discount && (
          <span className="absolute top-3 left-3 bg-[#AA3E11] text-white px-3 py-1 rounded-full text-sm font-semibold z-10">
            {discount}
          </span>
        )}
        {stock && (
          <span className="absolute top-3 right-3 bg-muted/90 text-foreground px-3 py-1 rounded-full text-xs border border-[#E5AB4A] z-10">
            {stock}
          </span>
        )}
        {badge && (
          <span className="absolute top-3 left-3 bg-[#E5AB4A]/20 text-[#E5AB4A] px-3 py-1 rounded-full text-xs border border-[#E5AB4A] z-10">
            {badge}
          </span>
        )}
        <Image src={image || `/productos/${title.toLowerCase().replace(/\s+/g, '-')}.jpg`} alt={title} fill className="object-cover" />
      </div>
      <div className="p-6">
        <h3 className="text-foreground font-serif text-xl mb-2">{title}</h3>
        <p className="text-body text-muted-foreground text-sm mb-4">{description}</p>
        <div className="flex items-baseline gap-2 mb-4">
          <span className="text-[#E5AB4A] text-price">{price}</span>
          {originalPrice && <span className="text-muted-foreground text-body line-through">{originalPrice}</span>}
        </div>
        {hasStyleSelector && (
          <div className="mb-4">
            <label className="text-muted-foreground text-sm mb-2 block">Estilo</label>
            <select className="w-full bg-card border border-border rounded px-3 py-2 text-foreground">
              <option>Seleccionar estilo</option>
            </select>
          </div>
        )}
        <div className="flex gap-2 flex-col sm:flex-row">
          <Button onClick={handleAddToCart} className="flex-1 bg-[#AA3E11] hover:bg-[#AA3E11]/90 text-white">
            AÑADIR
          </Button>
          <Button
            variant="outline"
            className="flex-1 border-[#E5AB4A] text-[#E5AB4A] hover:bg-[#E5AB4A] hover:text-[#0F0B0A] bg-transparent"
          >
            {hasStyleSelector ? "DETALLES" : "VER DETALLES"}
          </Button>
        </div>
      </div>
    </div>
  )
}
