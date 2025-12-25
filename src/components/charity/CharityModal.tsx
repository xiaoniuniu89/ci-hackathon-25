import React, { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import CharityCard from './CharityCard'
import { getDonationUrl, getFoodCharityProjects } from '@/services/globalgiving'
import { formatCurrencyFromLocation } from '@/services/currency'
import { Loader2, Heart, Gift, Info } from 'lucide-react'
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
      <Dialog open={show} onOpenChange={handleClose}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5 fill-current" /> Choose a Charity
            </DialogTitle>
          </DialogHeader>
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              Unable to load charity projects at this time.
              Please visit{' '}
              <a
                href="https://www.globalgiving.org/search/?size=25&nextPage=1&sortField=sortorder&selectedCountries=&loadAllResults=true&theme=food"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary underline"
              >
                GlobalGiving
              </a>
              {' '}to find food security projects to support.
            </AlertDescription>
          </Alert>
        </DialogContent>
      </Dialog>
    )
  }

  const recipeName = recipe?.strMeal || 'this meal'
  const formattedAmount = userLocation ? formatCurrencyFromLocation(mealValue, userLocation) : `${mealValue}`
  const mealDescription = recipe
    ? `You're viewing ${recipeName}, which costs approximately ${formattedAmount} to make.`
    : ''

  const hasMore = nextStart < totalFound

  return (
    <Dialog open={show} onOpenChange={handleClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5 fill-current" /> Donate the Cost of Your Meal
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            {mealDescription && (
              <>
                {mealDescription}
                {' '}
              </>
            )}
            Select a food/hunger charity to donate <strong>{formattedAmount}</strong> to. These projects are fighting hunger and food insecurity around the world.
            Your contribution makes a real difference!
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" id="charityProjectsContainer">
          {projects.map(project => (
            <CharityCard
              key={project.id}
              project={project}
              isSelected={selectedProjectId === project.id}
              onSelect={handleSelectProject}
            />
          ))}
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2 items-center">
          <small className="text-muted-foreground flex-1">
            Powered by <a href="https://www.globalgiving.org" target="_blank" rel="noopener noreferrer" className="underline">GlobalGiving</a>
          </small>
          <div className="flex gap-2">
            {hasMore && (
              <Button
                variant="outline"
                onClick={handleLoadMore}
                disabled={isLoadingMore}
              >
                {isLoadingMore ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Loading...
                  </>
                ) : (
                  'Load More'
                )}
              </Button>
            )}
            <Button
              variant="default"
              onClick={handleDonate}
              disabled={!selectedProjectId}
              className="bg-secondary hover:bg-secondary/90"
            >
              <Gift className="mr-2 h-4 w-4 fill-current" /> Donate
            </Button>
            <Button variant="outline" onClick={handleClose}>
              Close
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default CharityModal
