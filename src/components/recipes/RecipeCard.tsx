import React from 'react'
import { Link } from 'react-router-dom'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { BookOpen } from 'lucide-react'
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
    <div className="w-full md:w-1/2 lg:w-1/3 px-4 mb-4">
      <Card className="h-full flex flex-col" data-recipe-id={meal.idMeal}>
        <div className="relative border-b bg-muted">
          <img src={meal.strMealThumb} className="w-full h-auto" alt={meal.strMeal} />
          <span className="absolute top-2 right-2 bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-medium">
            {badgeText}
          </span>
        </div>
        <CardHeader>
          <CardTitle className="text-xl">{meal.strMeal}</CardTitle>
        </CardHeader>
        <CardContent className="flex-grow">
          <p className="text-muted-foreground">{description}</p>
          {showAreaField && (
            <div className="mt-3">
              <small className="text-muted-foreground">
                <strong>Area:</strong> {area}
              </small>
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button asChild className="w-full bg-secondary hover:bg-secondary/90">
            <Link to={`/recipes/${meal.idMeal}`}>
              <BookOpen className="mr-2 h-4 w-4" />
              View Recipe
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

export default RecipeCard
