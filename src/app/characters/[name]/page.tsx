import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Separator } from '@/components/ui/separator'
import { CharacterHeader } from '@/components/character/character-header'
import { CharacterTabs } from '@/components/character/character-tabs'
import { fetchCharacter, ApiError } from '@/lib/lostark-api'
import { parseApiResponse } from '@/lib/api-parser'

interface PageProps {
  params: Promise<{ name: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { name } = await params
  const decodedName = decodeURIComponent(name)
  return {
    title: decodedName,
    description: `${decodedName} 캐릭터 상세 정보`,
  }
}

export default async function CharacterPage({ params }: PageProps) {
  const { name } = await params
  const decodedName = decodeURIComponent(name)

  try {
    const raw = await fetchCharacter(decodedName)
    const data = parseApiResponse(raw)

    return (
      <div className="pb-12">
        <CharacterHeader data={data} />
        <Separator />
        <div className="mt-6">
          <CharacterTabs data={data} />
        </div>
      </div>
    )
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) {
      notFound()
    }
    throw err
  }
}
