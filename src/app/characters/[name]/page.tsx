import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { CharacterProfile } from '@/components/character/character-profile'
import { CharacterRanking } from '@/components/character/character-ranking'
import { CharacterTabs } from '@/components/character/character-tabs'
import { fetchCharacter, ApiError } from '@/lib/lostark-api'
import { parseApiResponse } from '@/lib/api-parser'
import { extractPalette } from '@/lib/extract-palette'
import { fetchRanking } from '@/lib/korlark-api'

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
    const [palette, ranking] = await Promise.all([
      extractPalette(data.profile.characterImage ?? ''),
      fetchRanking(decodedName),
    ])

    return (
      <div className="pb-12">
        {/* 검증 단계: 프로필 카드 단독 표시 */}
        <div className="mx-auto w-[272px] space-y-2">
          <CharacterProfile data={data} palette={palette} />
          {ranking && (
            <CharacterRanking ranking={ranking} serverName={data.profile.serverName} />
          )}
        </div>
        <div className="mt-8">
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
