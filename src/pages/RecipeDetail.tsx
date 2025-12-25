import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import CharityModal from '@/components/charity/CharityModal'
import { getUserLocation } from '@/services/location'
import { getFoodCharityProjects, estimateMealValue } from '@/services/globalgiving'
import type { Meal } from '@/types/recipe.types'
import type { UserLocation } from '@/types/location.types'
import type { CharityProject } from '@/types/charity.types'

// Helper function to extract ingredients from recipe object
function extractIngredients(recipe: Meal): string[] {
  const ingredients: string[] = []
  for (let i = 1; i <= 20; i++) {
    const ingredient = recipe[`strIngredient${i}`]
    const measure = recipe[`strMeasure${i}`]

    if (ingredient && ingredient.trim()) {
      const ingredientText = measure && measure.trim()
        ? `${measure.trim()} ${ingredient.trim()}`
        : ingredient.trim()
      ingredients.push(ingredientText)
    }
  }
  return ingredients
}

// Helper function to extract and clean up instructions from recipe
function extractInstructions(instructionsText?: string): string[] {
  if (!instructionsText) return []

  const steps = instructionsText
    .split(/\r\n\r\n|\n\n/)
    .map(step => step.trim())
    .filter(step => step.length > 0)

  return steps.map(step => {
    return step
      .replace(/^(STEP\s+\d+|step\s+\d+|\d+)\s*\r?\n?/i, '')
      .trim()
  }).filter(step => step.length > 0)
}

const RecipeDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const [recipe, setRecipe] = useState<Meal | null>(null)
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null)
  const [charityProjects, setCharityProjects] = useState<CharityProject[]>([])
  const [totalFound, setTotalFound] = useState<number>(0)
  const [currentStart, setCurrentStart] = useState<number>(0)
  const [showCharityModal, setShowCharityModal] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(true)
  const [mealValue, setMealValue] = useState<number>(20)

  useEffect(() => {
    if (!id) {
      navigate('/404')
      return
    }

    fetchRecipeDetail(id)
  }, [id])

  const fetchRecipeDetail = async (recipeId: string) => {
    try {
      setLoading(true)

      const [recipeResponse, location] = await Promise.all([
        fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${recipeId}`),
        getUserLocation()
      ])

      const data = await recipeResponse.json()

      if (!data.meals || data.meals.length === 0 || !data.meals[0]) {
        navigate('/404')
        return
      }

      const recipeData = data.meals[0]

      if (!recipeData.strMeal || !recipeData.strMealThumb) {
        navigate('/404')
        return
      }

      setRecipe(recipeData)
      setUserLocation(location)

      const calculatedMealValue = estimateMealValue(recipeData, location)
      setMealValue(calculatedMealValue)

      // Fetch charity projects in background
      const charityData = await getFoodCharityProjects(location.countryCode, 0)
      setCharityProjects(charityData.projects)
      setTotalFound(charityData.totalFound)
      setCurrentStart(charityData.currentStart)

    } catch (error) {
      console.error('Error fetching recipe:', error)
      navigate('/error')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="container py-5">
        <p>Loading recipe...</p>
      </div>
    )
  }

  if (!recipe) {
    return null
  }

  const ingredients = extractIngredients(recipe)
  const instructions = extractInstructions(recipe.strInstructions)

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl" id="recipe-detail">
      <div className="mb-6">
        <Link to="/recipes" className="inline-flex items-center gap-2 px-4 py-2 border border-green-600 text-green-600 rounded hover:bg-green-50 transition-colors">
          <i className="bi bi-arrow-left"></i> Back to Recipes
        </Link>
      </div>

      {/* Image and Donation Card Side by Side */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-8">
        <div className="md:col-span-8">
          <div className="border rounded-lg bg-gray-100 h-[400px] flex items-center justify-center overflow-hidden">
            <img
              src={recipe.strMealThumb}
              className="rounded max-w-full max-h-full object-contain"
              alt={recipe.strMeal}
            />
          </div>
        </div>

        <div className="md:col-span-4">
          <div className="border rounded-lg p-6 bg-gray-50">
            <h4 className="text-xl font-bold mb-3">Help Feed Someone</h4>
            <p className="mb-4">Your donation can provide this meal to a family in need.</p>
            <button
              type="button"
              className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 rounded transition-colors mb-4"
              onClick={() => setShowCharityModal(true)}
            >
              Donate This Meal
            </button>
            <p className="text-sm text-gray-600">
              Every donation helps us prepare and deliver meals to those who need them most.
            </p>
          </div>
        </div>
      </div>

      {/* All content below in single column */}
      <div>
        <h1 className="text-4xl font-bold mb-4">{recipe.strMeal}</h1>
        {recipe.strInstructions && (
          <p className="text-lg mb-6 text-gray-700">
            {recipe.strInstructions.split('\n')[0] || `A traditional ${recipe.strArea} ${recipe.strCategory.toLowerCase()} dish.`}
          </p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div>
            <strong>Prep Time:</strong> <span className="text-gray-600">30 mins</span>
          </div>
          <div>
            <strong>Servings:</strong> <span className="text-gray-600">4</span>
          </div>
          <div>
            <strong>Difficulty:</strong> <span className="text-gray-600">Medium</span>
          </div>
        </div>

        <h3 className="text-2xl font-bold mb-4">Ingredients</h3>
        <ul className="border rounded-lg mb-8 divide-y">
          {ingredients.map((ingredient, index) => (
            <li key={index} className="px-4 py-3">
              {ingredient}
            </li>
          ))}
        </ul>

        <h3 className="text-2xl font-bold mb-4">Instructions</h3>
        <ol className="border rounded-lg mb-8 divide-y">
          {instructions.map((instruction, index) => (
            <li key={index} className="px-4 py-4 relative pl-12">
              <span className="absolute left-4 font-bold">
                {index + 1}.
              </span>
              {instruction}
            </li>
          ))}
        </ol>
      </div>

      <CharityModal
        show={showCharityModal}
        onHide={() => setShowCharityModal(false)}
        projects={charityProjects}
        totalFound={totalFound}
        currentStart={currentStart}
        userLocation={userLocation}
        recipe={recipe}
        mealValue={mealValue}
      />
    </div>
  )
}

export default RecipeDetail
