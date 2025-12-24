import React from 'react'
import { Link } from 'react-router-dom'
import type { Meal } from '@/types/recipe.types'

interface RecipeCardProps {
  meal: Meal
  currentCategory?: string
  currentArea?: string
}

const RecipeCard: React.FC<RecipeCardProps> = ({ meal, currentCategory = '', currentArea = '' }) => {
  const category = meal.strCategory || currentCategory
  const area = meal.strArea || currentArea

  const badgeText = category || (currentArea && !currentCategory ? currentArea : 'Recipe')

  let description = 'Delicious recipe'
  if (category) {
    description = `${category} cuisine`
  } else if (currentArea) {
    description = `${currentArea} cuisine`
  }

  const showAreaField = area && !(currentArea && !currentCategory)

  return (
    <div className="col-md-6 col-lg-4 mb-4">
      <div className="card h-100 recipe-card" data-recipe-id={meal.idMeal}>
        <div className="recipe-image-container border-bottom bg-light">
          <img src={meal.strMealThumb} className="card-img-top" alt={meal.strMeal} />
          <div className="recipe-category-badge">{badgeText}</div>
        </div>
        <div className="card-body d-flex flex-column">
          <h5 className="card-title">{meal.strMeal}</h5>
          <p className="card-text flex-grow-1">{description}</p>
          {showAreaField && (
            <div className="mb-3">
              <small className="text-muted">
                <strong>Area:</strong> {area}
              </small>
            </div>
          )}
          <Link to={`/recipes/${meal.idMeal}`} className="btn btn-success recipe-btn">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-book-fill me-2" viewBox="0 0 16 16">
              <path d="M8 1.783C7.015.936 5.587.81 4.287.94c-1.514.153-3.042.672-3.994 1.105A.5.5 0 0 0 0 2.5v11a.5.5 0 0 0 .707.455c.882-.4 2.303-.881 3.68-1.02 1.409-.142 2.59.087 3.223.877a.5.5 0 0 0 .78 0c.633-.79 1.814-1.019 3.222-.877 1.378.139 2.8.62 3.681 1.02A.5.5 0 0 0 16 13.5v-11a.5.5 0 0 0-.293-.455c-.952-.433-2.48-.952-3.994-1.105C10.413.809 8.985.936 8 1.783"/>
            </svg>
            View Recipe
          </Link>
        </div>
      </div>
    </div>
  )
}

export default RecipeCard
