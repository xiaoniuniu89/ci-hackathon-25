import React from 'react'
import RecipeCard from './RecipeCard'
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
      <div className="row">
        <div className="col-12">
          <p>Loading recipes...</p>
        </div>
      </div>
    )
  }

  if (recipes.length === 0) {
    return (
      <div className="row">
        <div className="col-12">
          <div className="alert alert-info">No recipes found. Try a different search!</div>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="row" id="recipe-list">
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
        <div className="row mt-4" id="load-more-container">
          <div className="col-12 text-center">
            <button className="btn btn-success" id="load-more-btn" onClick={onLoadMore}>
              Load More Recipes
            </button>
          </div>
        </div>
      )}
    </>
  )
}

export default RecipeGrid
