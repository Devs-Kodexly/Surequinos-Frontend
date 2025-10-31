"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"

interface MobileFilterProps {
  categories: string[]
  activeCategory: number
  onCategoryChange: (index: number) => void
}

export function MobileFilter({ categories, activeCategory, onCategoryChange }: MobileFilterProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="md:hidden mb-4">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-white border border-black/20 rounded-lg px-4 py-3 text-left flex items-center justify-between"
      >
        <span className="text-black">{categories[activeCategory]}</span>
        <ChevronDown className={`w-5 h-5 text-black transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      
      {isOpen && (
        <div className="mt-2 bg-white border border-black/20 rounded-lg shadow-lg overflow-hidden">
          {categories.map((cat, i) => (
            <button
              key={cat}
              onClick={() => {
                onCategoryChange(i)
                setIsOpen(false)
              }}
              className={`w-full px-4 py-3 text-left transition-colors ${
                i === activeCategory
                  ? "bg-[#AA3E11] text-white"
                  : "text-black hover:bg-gray-50"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}