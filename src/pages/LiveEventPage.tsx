import { useParams } from 'react-router-dom'
import { LiveEventMode } from '@/components/live/LiveEventMode'
import { LuxuryLoader } from '@/components/ui/LuxuryLoader'
import { useGraduationPage } from '@/hooks/useGraduationPage'
import { NotFoundPage } from '@/pages/NotFoundPage'

export function LiveEventPage() {
  const { graduateId } = useParams<{ graduateId: string }>()
  const { student, congratulations, loading, notFound } = useGraduationPage(graduateId)

  if (loading) return <LuxuryLoader />
  if (notFound) return <NotFoundPage />

  return <LiveEventMode student={student} congratulations={congratulations} />
}
