/**
 * Error handling utility for consistent error handling in React
 */

interface ErrorOptions {
  type?: string
  message?: string
  details?: string
}

/**
 * Get error page URL with parameters
 * @param options - Error configuration
 * @returns URL string for navigation
 */
export function getErrorPageUrl({ type, message, details }: ErrorOptions): string {
  const params = new URLSearchParams()

  if (type) {
    params.append('type', type)
  }

  if (message) {
    params.append('message', encodeURIComponent(message))
  }

  if (details) {
    params.append('details', encodeURIComponent(details))
  }

  return `/error?${params.toString()}`
}

/**
 * Handle recipe not found error
 * @param recipeId - The recipe ID that was not found
 * @returns URL string for navigation
 */
export function getRecipeNotFoundUrl(recipeId: string): string {
  return getErrorPageUrl({
    type: 'recipe-not-found',
    details: `Recipe ID: ${recipeId}`
  })
}

/**
 * Handle API error
 * @param error - The error object
 * @param context - Additional context about where the error occurred
 * @returns URL string for navigation
 */
export function getAPIErrorUrl(error: Error, context: string = ''): string {
  console.error('API Error:', error)

  return getErrorPageUrl({
    type: 'api-error',
    details: context ? `${context}: ${error.message}` : error.message
  })
}

/**
 * Handle network error
 * @param error - The error object
 * @returns URL string for navigation
 */
export function getNetworkErrorUrl(error: Error): string {
  console.error('Network Error:', error)

  return getErrorPageUrl({
    type: 'network-error',
    details: error.message
  })
}

/**
 * Handle donation-related errors
 * @param error - The error object
 * @returns URL string for navigation
 */
export function getDonationErrorUrl(error: Error): string {
  console.error('Donation Error:', error)

  return getErrorPageUrl({
    type: 'donation-error',
    details: error.message
  })
}

/**
 * Format error message for display
 * @param type - Error type
 * @returns Human-readable error message
 */
export function getErrorMessage(type: string | null): string {
  switch (type) {
    case 'recipe-not-found':
      return 'The recipe you are looking for could not be found.'
    case 'api-error':
      return 'There was an error fetching data from the server.'
    case 'network-error':
      return 'There was a network error. Please check your connection.'
    case 'donation-error':
      return 'There was an error processing your donation request.'
    default:
      return 'An unexpected error occurred.'
  }
}
