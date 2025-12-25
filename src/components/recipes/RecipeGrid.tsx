import React from 'react'
import RecipeCard from './RecipeCard'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2 } from 'lucide-react'
import type { Meal } from '@/types/recipe.types'

interface RecipeGridProps {
  recipes: Meal[]
  loading: boolean
  currentCategory: string
  currentArea: string
  hasMore: boolean
  onLoadMore: () => void
}

const RecipeGrid: React.FC<RecipeGridProps> = ({
  recipes,
  loading,
  currentCategory,
  currentArea,
  hasMore,
  onLoadMore
}) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading recipes...</span>
      </div>
    )
  }

  if (recipes.length === 0) {
    return (
      <Alert>
        <AlertDescription>No recipes found. Try a different search!</AlertDescription>
      </Alert>
    )
  }

  return (
    <>
      <div className="flex flex-wrap -mx-4" id="recipe-list">
        {recipes.map(meal => (
          <RecipeCard
            key={meal.idMeal}
            meal={meal}
            currentCategory={currentCategory}
            currentArea={currentArea}
          />
        ))}
      </div>
      {hasMore && (
        <div className="mt-4 text-center" id="load-more-container">
          <Button
            id="load-more-btn"
            onClick={onLoadMore}
            className="bg-secondary hover:bg-secondary/90"
          >
            Load More Recipes
          </Button>
        </div>
      )}
    </>
  )
}

export default RecipeGrid
