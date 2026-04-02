import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { CharacterProfile } from '@/components/character/character-profile'
import { CharacterRanking } from '@/components/character/character-ranking'
import { CharacterContent } from '@/components/character/character-content'
import { CharCacheSync } from '@/components/character/char-cache-sync'
import { MaintenancePage } from '@/components/character/maintenance-page'
import { fetchCharacter, ApiError } from '@/lib/api/lostark'
import { parseApiResponse } from '@/lib/parser/api-parser'
import { extractPalette } from '@/lib/utils/extract-palette'
import { fetchRanking } from '@/lib/api/korlark'
import { getMaintenanceInfo } from '@/lib/utils/maintenance'

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

async function fetchCharacterData(name: string) {
  const raw = await fetchCharacter(name)
  const data = parseApiResponse(raw)
  const [palette, ranking] = await Promise.all([
    extractPalette(data.profile.characterImage ?? ''),
    fetchRanking(name),
  ])
  return { data, palette, ranking }
}

export default async function CharacterPage({ params }: PageProps) {
  const { name } = await params
  const decodedName = decodeURIComponent(name)

  let data, palette, ranking

  try {
    ({ data, palette, ranking } = await fetchCharacterData(decodedName))
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) {
      notFound()
    }

    const { isMaintenance, endsAt } = getMaintenanceInfo()
    if (isMaintenance) {
      return <MaintenancePage characterName={decodedName} endsAt={endsAt} />
    }

    throw err
  }

  return (
    <div className="mx-auto w-[960px] pb-12 pt-6">
      <CharCacheSync name={decodedName} data={data} palette={palette} ranking={ranking} />

      <div className="flex gap-2">
        <aside className="w-[256px] shrink-0 space-y-2">
          <CharacterProfile data={data} palette={palette} />
          {ranking && (
            <CharacterRanking ranking={ranking} serverName={data.profile.serverName} />
          )}
        </aside>

        <div className="min-w-0 flex-1">
          <CharacterContent data={data} />
        </div>
      </div>
    </div>
  )
}
