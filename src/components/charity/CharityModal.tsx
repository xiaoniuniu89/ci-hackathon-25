import React, { useState } from 'react'
import { Modal, Button } from 'react-bootstrap'
import CharityCard from './CharityCard'
import { getDonationUrl, getFoodCharityProjects } from '@/services/globalgiving'
import { formatCurrencyFromLocation } from '@/services/currency'
import type { CharityProject } from '@/types/charity.types'
import type { Meal } from '@/types/recipe.types'
import type { UserLocation } from '@/types/location.types'

interface CharityModalProps {
  show: boolean
  onHide: () => void
  projects: CharityProject[]
  totalFound: number
  currentStart: number
  userLocation: UserLocation | null
  recipe: Meal | null
  mealValue: number
}

const CharityModal: React.FC<CharityModalProps> = ({
  show,
  onHide,
  projects: initialProjects,
  totalFound,
  currentStart,
  userLocation,
  recipe,
  mealValue
}) => {
  const [projects, setProjects] = useState<CharityProject[]>(initialProjects)
  const [nextStart, setNextStart] = useState<number>(currentStart + initialProjects.length)
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null)
  const [selectedProjectTitle, setSelectedProjectTitle] = useState<string>('')
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false)

  const handleSelectProject = (id: number, title: string) => {
    setSelectedProjectId(id)
    setSelectedProjectTitle(title)
  }

  const handleDonate = () => {
    if (!selectedProjectId || !userLocation) return

    const donationUrl = getDonationUrl(selectedProjectId, mealValue)
    window.open(donationUrl, '_blank', 'noopener,noreferrer')

    // Reset selection and close modal
    handleClose()
  }

  const handleLoadMore = async () => {
    if (!userLocation) return

    setIsLoadingMore(true)

    try {
      const charityData = await getFoodCharityProjects(userLocation.countryCode, nextStart)

      if (charityData.projects && charityData.projects.length > 0) {
        setProjects(prev => [...prev, ...charityData.projects])
        setNextStart(prev => prev + charityData.projects.length)
      }
    } catch (error) {
      console.error('Error loading more charities:', error)
    } finally {
      setIsLoadingMore(false)
    }
  }

  const handleClose = () => {
    // Reset selection
    setSelectedProjectId(null)
    setSelectedProjectTitle('')
    onHide()
  }

  if (!projects || projects.length === 0) {
    return (
      <Modal show={show} onHide={handleClose} size="lg" centered>
        <Modal.Header closeButton className="charity-modal-header">
          <Modal.Title>
            <i className="bi bi-heart-fill"></i> Choose a Charity
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="alert alert-info">
            <i className="bi bi-info-circle"></i>
            {' '}Unable to load charity projects at this time.
            Please visit{' '}
            <a href="https://www.globalgiving.org/search/?size=25&nextPage=1&sortField=sortorder&selectedCountries=&loadAllResults=true&theme=food" target="_blank" rel="noopener noreferrer">
              GlobalGiving
            </a>
            {' '}to find food security projects to support.
          </div>
        </Modal.Body>
      </Modal>
    )
  }

  const recipeName = recipe?.strMeal || 'this meal'
  const formattedAmount = userLocation ? formatCurrencyFromLocation(mealValue, userLocation) : `${mealValue}`
  const mealDescription = recipe
    ? `You're viewing ${recipeName}, which costs approximately ${formattedAmount} to make.`
    : ''

  const hasMore = nextStart < totalFound

  return (
    <Modal show={show} onHide={handleClose} size="xl" centered scrollable className="charity-modal">
      <Modal.Header closeButton className="charity-modal-header">
        <Modal.Title>
          <i className="bi bi-heart-fill"></i> Donate the Cost of Your Meal
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p className="text-muted mb-4">
          {mealDescription && (
            <>
              {mealDescription}
              {' '}
            </>
          )}
          Select a food/hunger charity to donate <strong>{formattedAmount}</strong> to. These projects are fighting hunger and food insecurity around the world.
          Your contribution makes a real difference!
        </p>
        <div className="row g-3" id="charityProjectsContainer">
          {projects.map(project => (
            <CharityCard
              key={project.id}
              project={project}
              isSelected={selectedProjectId === project.id}
              onSelect={handleSelectProject}
            />
          ))}
        </div>
      </Modal.Body>
      <Modal.Footer>
        <small className="text-muted me-auto">
          Powered by <a href="https://www.globalgiving.org" target="_blank" rel="noopener noreferrer">GlobalGiving</a>
        </small>
        {hasMore && (
          <Button
            variant="outline-success"
            onClick={handleLoadMore}
            disabled={isLoadingMore}
          >
            {isLoadingMore ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Loading...
              </>
            ) : (
              'Load More'
            )}
          </Button>
        )}
        <Button variant="success" onClick={handleDonate} disabled={!selectedProjectId}>
          <i className="bi bi-gift-fill"></i> Donate
        </Button>
        <Button variant="outline-secondary" onClick={handleClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default CharityModal
