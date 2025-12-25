import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Building, MapPin } from 'lucide-react'
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

  let projectImage = imageLink
  if (image && image.imagelink && Array.isArray(image.imagelink)) {
    const originalImage = image.imagelink.find(link => link.size === 'original')
    projectImage = originalImage?.url || imageLink
  }

  const truncatedSummary = summary && summary.length > 150
    ? summary.substring(0, 150) + '...'
    : summary || 'Support this important cause'

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      onSelect(id, title)
    }
  }

  return (
    <Card
      className={`cursor-pointer transition-all duration-200 ${
        isSelected
          ? 'border-secondary border-[3px] bg-muted -translate-y-1 shadow-lg'
          : 'hover:shadow-md'
      }`}
      role="button"
      tabIndex={0}
      onClick={() => onSelect(id, title)}
      onKeyDown={handleKeyDown}
    >
      {projectImage && (
        <img
          src={projectImage}
          className="w-full h-[200px] object-cover rounded-t-lg"
          alt={title}
        />
      )}
      <CardHeader className="pb-3">
        <CardTitle className="text-base">{title}</CardTitle>
        <div className="text-muted-foreground text-sm space-y-1">
          <div className="flex items-center gap-1">
            <Building className="h-3 w-3" />
            <span>{organization.name || 'Organization'}</span>
          </div>
          <div className="flex items-center gap-1">
            <MapPin className="h-3 w-3" />
            <span>{location}</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm flex-grow">{truncatedSummary}</p>

        {goal > 0 && (
          <div>
            <div className="w-full bg-secondary/20 rounded-full h-1.5">
              <div
                className="bg-secondary h-1.5 rounded-full transition-all"
                style={{ width: `${progressPercentage}%` }}
                role="progressbar"
                aria-valuenow={progressPercentage}
                aria-valuemin={0}
                aria-valuemax={100}
              />
            </div>
            <div className="flex justify-between mt-1">
              <small className="text-muted-foreground text-xs">{progressPercentage}% funded</small>
              <small className="text-muted-foreground text-xs">
                ${funding.toLocaleString()} / ${goal.toLocaleString()}
              </small>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default CharityCard
