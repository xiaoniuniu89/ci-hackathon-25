import React, { useState, useEffect, useMemo, useCallback } from 'react'
import RecipeFilters from '@/components/recipes/RecipeFilters'
import RecipeGrid from '@/components/recipes/RecipeGrid'
import type { Meal, SeasonalSearch, CategoryOption, AreaOption } from '@/types/recipe.types'

// Get seasonal search term based on current date
function getSeasonalSearchTerm(): SeasonalSearch {
  const now = new Date()
  const month = now.getMonth() + 1 // 1-12
  const day = now.getDate()

  if (month === 12) {
    return { term: 'christmas', label: 'Christmas Recipes' }
  }
  if (month === 11) {
    return { term: 'turkey', label: 'Thanksgiving Recipes' }
  }
  if (month === 10) {
    return { term: 'pumpkin', label: 'Halloween & Autumn Recipes' }
  }
  if (month === 2 && day <= 14) {
    return { term: 'chocolate', label: "Valentine's Day Treats" }
  }
  if (month === 3 || month === 4) {
    return { term: 'lamb', label: 'Spring & Easter Recipes' }
  }
  if (month >= 6 && month <= 8) {
    return { term: 'seafood', label: 'Summer Recipes' }
  }
  if (month === 9) {
    return { term: 'chicken', label: 'Quick Weeknight Meals' }
  }
  return { term: '', label: 'Popular Recipes' }
}

const Recipes: React.FC = () => {
  const [allRecipes, setAllRecipes] = useState<Meal[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const [areas, setAreas] = useState<string[]>([])
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [currentCategory, setCurrentCategory] = useState<string>('')
  const [currentArea, setCurrentArea] = useState<string>('')
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [loading, setLoading] = useState<boolean>(false)

  const recipesPerPage = 6
  const seasonal = useMemo(() => getSeasonalSearchTerm(), [])

  // Fetch filter options on mount
  useEffect(() => {
    loadFilters()
  }, [])

  // Fetch seasonal recipes on mount
  useEffect(() => {
    setSearchTerm(seasonal.term)
    fetchRecipes(seasonal.term)
  }, [seasonal.term])

  const loadFilters = async () => {
    try {
      const [categoriesResponse, areasResponse] = await Promise.all([
        fetch('https://www.themealdb.com/api/json/v1/1/list.php?c=list'),
        fetch('https://www.themealdb.com/api/json/v1/1/list.php?a=list')
      ])

      const categoriesData = await categoriesResponse.json()
      const areasData = await areasResponse.json()

      setCategories(categoriesData.meals.map((cat: CategoryOption) => cat.strCategory))
      setAreas(areasData.meals.map((area: AreaOption) => area.strArea))
    } catch (error) {
      console.error('Error loading filters:', error)
    }
  }

  const fetchRecipes = async (term: string = '') => {
    try {
      setLoading(true)
      const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${term}`)
      const data = await response.json()

      if (data.meals) {
        setAllRecipes(data.meals)
        setCurrentPage(1)
        setCurrentCategory('')
        setCurrentArea('')
      } else {
        setAllRecipes([])
      }
    } catch (error) {
      console.error('Error fetching recipes:', error)
      setAllRecipes([])
    } finally {
      setLoading(false)
    }
  }

  const fetchRecipesByCategory = async (category: string) => {
    try {
      setLoading(true)
      const response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`)
      const data = await response.json()

      if (data.meals) {
        setAllRecipes(data.meals)
        setCurrentPage(1)
        setCurrentCategory(category)
        setCurrentArea('')
      } else {
        setAllRecipes([])
      }
    } catch (error) {
      console.error('Error fetching recipes:', error)
      setAllRecipes([])
    } finally {
      setLoading(false)
    }
  }

  const fetchRecipesByArea = async (area: string) => {
    try {
      setLoading(true)
      const response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?a=${area}`)
      const data = await response.json()

      if (data.meals) {
        setAllRecipes(data.meals)
        setCurrentPage(1)
        setCurrentCategory('')
        setCurrentArea(area)
      } else {
        setAllRecipes([])
      }
    } catch (error) {
      console.error('Error fetching recipes:', error)
      setAllRecipes([])
    } finally {
      setLoading(false)
    }
  }

  // Debounced search
  const debouncedSearch = useCallback((term: string) => {
    const timeoutId = setTimeout(() => {
      fetchRecipes(term)
    }, 500)

    return () => clearTimeout(timeoutId)
  }, [])

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearchTerm(value)
    debouncedSearch(value)
  }

  const handleCategoryChange = (category: string) => {
    if (category) {
      setSearchTerm('')
      setCurrentArea('')
      fetchRecipesByCategory(category)
    }
  }

  const handleAreaChange = (area: string) => {
    if (area) {
      setSearchTerm('')
      setCurrentCategory('')
      fetchRecipesByArea(area)
    }
  }

  const handleReset = () => {
    const seasonalReset = getSeasonalSearchTerm()
    setSearchTerm(seasonalReset.term)
    setCurrentCategory('')
    setCurrentArea('')
    fetchRecipes(seasonalReset.term)
  }

  const handleLoadMore = () => {
    setCurrentPage(prev => prev + 1)
  }

  // Compute displayed recipes
  const displayedRecipes = useMemo(() => {
    return allRecipes.slice(0, currentPage * recipesPerPage)
  }, [allRecipes, currentPage])

  const hasMore = displayedRecipes.length < allRecipes.length

  return (
    <div className="container py-5">
      <h1 className="mb-4">Recipes</h1>
      <RecipeFilters
        searchTerm={searchTerm}
        onSearchChange={handleSearchChange}
        categories={categories}
        areas={areas}
        currentCategory={currentCategory}
        currentArea={currentArea}
        onCategoryChange={handleCategoryChange}
        onAreaChange={handleAreaChange}
        onReset={handleReset}
        searchPlaceholder={`Search recipes... (try "${seasonal.term}")`}
      />
      <RecipeGrid
        recipes={displayedRecipes}
        loading={loading}
        currentCategory={currentCategory}
        currentArea={currentArea}
        hasMore={hasMore}
        onLoadMore={handleLoadMore}
      />
    </div>
  )
}

export default Recipes
