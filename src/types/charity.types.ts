export interface CharityOrganization {
  name?: string
}

export interface CharityImage {
  imagelink?: Array<{
    url: string
    size: string
  }>
}

export interface CharityProject {
  id: number
  title: string
  summary: string
  organization?: CharityOrganization
  image?: CharityImage
  imageLink?: string
  country?: string
  goal?: number
  funding?: number
  active?: boolean
  status?: string
  _source?: string
  _sourceCountry?: string
}

export interface CharityApiResponse {
  projects: CharityProject[]
  totalFound: number
  currentStart: number
}
