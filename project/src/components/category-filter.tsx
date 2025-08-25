"use client"

import { Button } from "@/components/ui/button"

const categories = ["All", "NGO", "Schools", "Hostels", "Old Age Homes", "Community Orgs", "Others"]

interface CategoryFilterProps {
  selectedCategory: string
  onCategoryChange: (category: string) => void
}

export function CategoryFilter({ selectedCategory, onCategoryChange }: CategoryFilterProps) {
  return (
    <div className="flex flex-wrap gap-2 justify-center mb-6">
      {categories.map((category) => (
        <Button
          key={category}
          variant={selectedCategory === category ? "default" : "outline"}
          size="sm"
          onClick={() => onCategoryChange(category)}
          className={
            selectedCategory === category
              ? "bg-golden hover:bg-golden/90 text-navy-charcoal border-golden"
              : "border-navy-medium/30 text-navy-medium hover:bg-golden/10 hover:text-navy-charcoal hover:border-golden"
          }
        >
          {category}
        </Button>
      ))}
    </div>
  )
}
