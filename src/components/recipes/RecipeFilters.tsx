import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'

interface RecipeFiltersProps {
  searchTerm: string
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  categories: string[]
  areas: string[]
  currentCategory: string
  currentArea: string
  onCategoryChange: (category: string) => void
  onAreaChange: (area: string) => void
  onReset: () => void
  searchPlaceholder: string
}

const RecipeFilters: React.FC<RecipeFiltersProps> = ({
  searchTerm,
  onSearchChange,
  categories,
  areas,
  currentCategory,
  currentArea,
  onCategoryChange,
  onAreaChange,
  onReset,
  searchPlaceholder
}) => {
  return (
    <div className="mb-4">
      <Card className="bg-muted">
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
            <div className="md:col-span-6">
              <Label htmlFor="search-input">Search Recipes</Label>
              <Input
                type="text"
                id="search-input"
                placeholder={searchPlaceholder}
                value={searchTerm}
                onChange={onSearchChange}
                className="mt-1"
              />
            </div>
            <div className="md:col-span-3">
              <Label htmlFor="category-filter">Category</Label>
              <Select value={currentCategory || undefined} onValueChange={onCategoryChange}>
                <SelectTrigger id="category-filter" className="mt-1">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="md:col-span-3">
              <Label htmlFor="area-filter">Cuisine</Label>
              <Select value={currentArea || undefined} onValueChange={onAreaChange}>
                <SelectTrigger id="area-filter" className="mt-1">
                  <SelectValue placeholder="All Cuisines" />
                </SelectTrigger>
                <SelectContent>
                  {areas.map(area => (
                    <SelectItem key={area} value={area}>{area}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="mt-3">
            <Button variant="outline" onClick={onReset}>
              Reset Filters
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default RecipeFilters
