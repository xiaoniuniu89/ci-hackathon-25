import React from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { getErrorMessage } from '@/utils/error-handler'

const Error: React.FC = () => {
  const [searchParams] = useSearchParams()
  const type = searchParams.get('type')
  const details = searchParams.get('details')

  const message = getErrorMessage(type)

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-8 text-center">
          <h1 className="display-4 text-danger mb-4">Oops! Something went wrong</h1>
          <div className="alert alert-danger" role="alert">
            <h4 className="alert-heading">Error</h4>
            <p>{message}</p>
            {details && <small className="text-muted">Details: {decodeURIComponent(details)}</small>}
          </div>
          <Link to="/" className="btn btn-success me-2">
            Go Home
          </Link>
          <Link to="/recipes" className="btn btn-outline-success">
            Browse Recipes
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Error
