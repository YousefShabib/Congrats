export interface UniversityDoc {
  name: string
  nameEn: string
  country?: string
  logoUrl?: string
  graduateCount?: number
  isActive?: boolean
}

export interface University {
  id: string
  name: string
  nameEn: string
  logoUrl?: string
}
