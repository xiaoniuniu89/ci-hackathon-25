import React from 'react'

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
    <div className="row mb-4">
      <div className="col-12">
        <div className="card bg-light">
          <div className="card-body">
            <div className="row g-3">
              <div className="col-md-6">
                <label htmlFor="search-input" className="form-label">Search Recipes</label>
                <input
                  type="text"
                  className="form-control"
                  id="search-input"
                  placeholder={searchPlaceholder}
                  value={searchTerm}
                  onChange={onSearchChange}
                />
              </div>
              <div className="col-md-3">
                <label htmlFor="category-filter" className="form-label">Category</label>
                <select
                  className="form-select"
                  id="category-filter"
                  value={currentCategory}
                  onChange={(e) => onCategoryChange(e.target.value)}
                >
                  <option value="">All Categories</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
              <div className="col-md-3">
                <label htmlFor="area-filter" className="form-label">Cuisine</label>
                <select
                  className="form-select"
                  id="area-filter"
                  value={currentArea}
                  onChange={(e) => onAreaChange(e.target.value)}
                >
                  <option value="">All Cuisines</option>
                  {areas.map(area => (
                    <option key={area} value={area}>{area}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="row mt-3">
              <div className="col-12">
                <button className="btn btn-outline-secondary" onClick={onReset}>
                  Reset Filters
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RecipeFilters
