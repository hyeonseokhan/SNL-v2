import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { CharacterProfile } from '@/components/character/character-profile'
import { CharacterRanking } from '@/components/character/character-ranking'
import { CharacterContent } from '@/components/character/character-content'
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
      <div className="mx-auto max-w-[1100px] px-4 pb-12 pt-6">
        <div className="flex gap-2">
          {/* 좌측 패널: 프로필 + 랭킹 */}
          <aside className="w-[272px] shrink-0 space-y-2">
            <CharacterProfile data={data} palette={palette} />
            {ranking && (
              <CharacterRanking ranking={ranking} serverName={data.profile.serverName} />
            )}
          </aside>

          {/* 우측 패널: 메뉴 + 콘텐츠 */}
          <div className="min-w-0 flex-1">
            <CharacterContent data={data} />
          </div>
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
