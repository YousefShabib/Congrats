import { useCallback, useState } from 'react'
import { useDashboard } from '@/hooks/useDashboard'
import { useGraduationPage } from '@/hooks/useGraduationPage'
import { useAIInsights } from '@/hooks/useAIInsights'
import { useThankYouGenerator } from '@/hooks/useThankYouGenerator'
import { useSmartSearch } from '@/hooks/useSmartSearch'
import { LuxuryLoader } from '@/components/ui/LuxuryLoader'
import { AIInsightsSection } from '@/components/ai/AIInsightsSection'
import { MemoryStoryPanel } from '@/components/ai/MemoryStoryPanel'
import { SmartSearchPanel } from '@/components/ai/SmartSearchPanel'
import { ThankYouGenerator } from '@/components/ai/ThankYouGenerator'
import { generateMemoryStory } from '@/services/ai/ai.service'
import { graduateToStudent } from '@/services/firebase'

export function AIPage() {
  const { graduateId, doc, loading: docLoading } = useDashboard()
  const { congratulations, loading: wishesLoading } = useGraduationPage(graduateId)
  const student = doc ? graduateToStudent(graduateId, doc) : { name: 'خريج', nameEn: '', university: '', universityEn: '', major: '', majorEn: '', graduationYear: 2026, profileImage: '' }

  const { insights, loading: aiLoading, error } = useAIInsights({
    graduateId,
    student,
    wishes: congratulations,
  })

  const thankYou = useThankYouGenerator(graduateId, student.name, congratulations)
  const search = useSmartSearch(graduateId, congratulations)
  const [memoryStory, setMemoryStory] = useState('')
  const [memoryLoading, setMemoryLoading] = useState(false)

  const loadMemory = useCallback(async () => {
    setMemoryLoading(true)
    try {
      const story = await generateMemoryStory(
        graduateId,
        student.name,
        congratulations,
        doc?.university,
        doc?.major,
      )
      setMemoryStory(story)
    } finally {
      setMemoryLoading(false)
    }
  }, [graduateId, student.name, congratulations, doc?.university, doc?.major])

  if (docLoading || wishesLoading) return <LuxuryLoader />

  return (
    <div className="space-y-8">
      <div>
        <h1 className="editorial-heading text-3xl text-charcoal">المساعد الذكي</h1>
        <p className="editorial-body text-muted">تحليلات، بحث، شكر، وقصة ذاكرة التخرج</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <ThankYouGenerator
          message={thankYou.message}
          tone={thankYou.tone}
          loading={thankYou.loading}
          onToneChange={thankYou.setTone}
          onGenerate={thankYou.generate}
          onCopy={thankYou.copy}
        />
        <SmartSearchPanel
          query={search.query}
          explanation={search.explanation}
          resultIds={search.resultIds}
          wishes={congratulations}
          loading={search.loading}
          onQueryChange={search.setQuery}
          onSearch={search.search}
        />
      </div>

      <MemoryStoryPanel story={memoryStory} loading={memoryLoading} onGenerate={loadMemory} />

      <div className="-mx-4">
        <AIInsightsSection insights={insights} loading={aiLoading} error={error} />
      </div>
    </div>
  )
}
