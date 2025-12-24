import React from 'react'
import type { CharityProject } from '@/types/charity.types'

interface CharityCardProps {
  project: CharityProject
  isSelected: boolean
  onSelect: (id: number, title: string) => void
}

const CharityCard: React.FC<CharityCardProps> = ({ project, isSelected, onSelect }) => {
  const {
    id,
    title,
    summary,
    organization = {},
    image = {},
    imageLink = '',
    country = '',
    goal = 0,
    funding = 0,
    _sourceCountry = '',
  } = project

  const progressPercentage = goal > 0 ? Math.round((funding / goal) * 100) : 0
  const location = country || _sourceCountry || 'Unknown'

  // Try to get a better quality image from the image object
  let projectImage = imageLink
  if (image && image.imagelink && Array.isArray(image.imagelink)) {
    const originalImage = image.imagelink.find(link => link.size === 'original')
    projectImage = originalImage?.url || imageLink
  }

  // Truncate summary to 150 characters
  const truncatedSummary = summary && summary.length > 150
    ? summary.substring(0, 150) + '...'
    : summary || 'Support this important cause'

  const cardStyle: React.CSSProperties = {
    cursor: 'pointer',
    transition: 'all 0.2s',
    border: isSelected ? '3px solid #198754' : '',
    backgroundColor: isSelected ? '#f8f9fa' : '',
    transform: isSelected ? 'translateY(-4px)' : '',
    boxShadow: isSelected ? '0 0.5rem 1rem rgba(0,0,0,0.15)' : ''
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      onSelect(id, title)
    }
  }

  return (
    <div className="col-md-6 col-lg-4">
      <div
        className={`card charity-project-card h-100 shadow-sm ${isSelected ? 'selected' : ''}`}
        data-project-id={id}
        style={cardStyle}
        role="button"
        tabIndex={0}
        onClick={() => onSelect(id, title)}
        onKeyDown={handleKeyDown}
      >
        {projectImage && (
          <img
            src={projectImage}
            className="card-img-top charity-project-image"
            alt={title}
            style={{ height: '200px', objectFit: 'cover' }}
          />
        )}
        <div className="card-body d-flex flex-column">
          <h6 className="card-title charity-project-title">{title}</h6>
          <p className="text-muted mb-2">
            <small>
              <i className="bi bi-building"></i> {organization.name || 'Organization'}
              <br />
              <i className="bi bi-geo-alt"></i> {location}
            </small>
          </p>
          <p className="card-text charity-project-summary flex-grow-1">{truncatedSummary}</p>

          {goal > 0 && (
            <div className="mb-2">
              <div className="progress" style={{ height: '6px' }}>
                <div
                  className="progress-bar bg-success"
                  role="progressbar"
                  style={{ width: `${progressPercentage}%` }}
                  aria-valuenow={progressPercentage}
                  aria-valuemin={0}
                  aria-valuemax={100}
                ></div>
              </div>
              <div className="d-flex justify-content-between mt-1">
                <small className="text-muted">{progressPercentage}% funded</small>
                <small className="text-muted">${funding.toLocaleString()} / ${goal.toLocaleString()}</small>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default CharityCard
