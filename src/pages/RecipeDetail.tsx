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
    <div className="container py-5" id="recipe-detail">
      <div className="row mb-4">
        <div className="col">
          <Link to="/recipes" className="btn btn-outline-success mb-3">
            <i className="bi bi-arrow-left"></i> Back to Recipes
          </Link>
        </div>
      </div>

      <div className="row">
        <div className="col-lg-8">
          <div className="mb-4">
            <img
              src={recipe.strMealThumb}
              className="img-fluid rounded"
              alt={recipe.strMeal}
              style={{ width: '100%', maxHeight: '400px', objectFit: 'cover' }}
            />
          </div>

          <h1 className="mb-3">{recipe.strMeal}</h1>
          <p className="lead mb-4">{recipe.strCategory} - {recipe.strArea} cuisine</p>

          <div className="row mb-4">
            <div className="col-sm-4">
              <strong>Prep Time:</strong><br />
              <span className="text-muted">30 mins</span>
            </div>
            <div className="col-sm-4">
              <strong>Servings:</strong><br />
              <span className="text-muted">4</span>
            </div>
            <div className="col-sm-4">
              <strong>Difficulty:</strong><br />
              <span className="text-muted">Medium</span>
            </div>
          </div>

          <h3 className="mb-3">Ingredients</h3>
          <ul className="list-group mb-4">
            {ingredients.map((ingredient, index) => (
              <li key={index} className="list-group-item">{ingredient}</li>
            ))}
          </ul>

          <h3 className="mb-3">Instructions</h3>
          <ol className="list-group list-group-numbered mb-4">
            {instructions.map((instruction, index) => (
              <li key={index} className="list-group-item">{instruction}</li>
            ))}
          </ol>
        </div>

        <div className="col-lg-4">
          <div className="border rounded p-4 bg-light position-sticky" style={{ top: '20px' }}>
            <h4 className="mb-3">Help Feed Someone</h4>
            <p className="mb-3">Your donation can provide this meal to a family in need.</p>
            <button
              type="button"
              className="donate-button btn btn-success w-100"
              onClick={() => setShowCharityModal(true)}
            >
              <i className="bi bi-heart-fill"></i>
              {' '}Donate This Meal
            </button>
            <p className="small text-muted mt-3 mb-0">
              Every donation helps us prepare and deliver meals to those who need them most.
            </p>
          </div>
        </div>
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
