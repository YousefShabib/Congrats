import { useParams } from 'react-router-dom'
import { LiveWall } from '@/components/live/LiveWall'
import { LuxuryLoader } from '@/components/ui/LuxuryLoader'
import { useGraduationPage } from '@/hooks/useGraduationPage'
import { NotFoundPage } from '@/pages/NotFoundPage'

export function LiveWallPage() {
  const { graduateId } = useParams<{ graduateId: string }>()
  const { student, congratulations, loading, notFound } = useGraduationPage(graduateId)

  if (loading) return <LuxuryLoader />
  if (notFound) return <NotFoundPage />

  return <LiveWall student={student} congratulations={congratulations} />
}
