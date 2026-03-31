import type { Metadata } from 'next'
import { Separator } from '@/components/ui/separator'
import { CharacterHeader } from '@/components/character/character-header'
import { CharacterTabs } from '@/components/character/character-tabs'
import type { CharacterData } from '@/types/character'

interface PageProps {
  params: Promise<{ name: string }>
}

// === 임시 목데이터 (API 연동 전) ===
function getMockData(name: string): CharacterData {
  return {
    profile: {
      name: decodeURIComponent(name),
      server: '루페온',
      job: '버서커',
      jobClass: '워로드',
      itemLevel: 1680.0,
      combatLevel: 70,
      guildName: '테스트길드',
      title: null,
      imageUrl: null,
    },
    stats: {
      critical: 800,
      specialization: 1600,
      domination: 0,
      swiftness: 500,
      endurance: 0,
      expertise: 0,
    },
    equipment: Array.from({ length: 6 }, (_, i) => ({
      type: ['투구', '어깨', '상의', '하의', '장갑', '무기'][i],
      name: `고대 장비 ${i + 1}`,
      icon: '',
      grade: '고대',
      level: 25,
      quality: 90 + i,
      tooltip: '',
    })),
    gems: Array.from({ length: 11 }, (_, i) => ({
      name: `10레벨 보석 ${i + 1}`,
      icon: '',
      grade: '전설',
      level: 10,
      effect: '피해 증가',
    })),
    cards: [
      {
        name: '카제로스의 군단장',
        cards: [],
        effect: '30각 효과',
      },
    ],
    skills: Array.from({ length: 8 }, (_, i) => ({
      name: `스킬 ${i + 1}`,
      icon: '',
      level: 12,
      tripods: [],
      rune: null,
    })),
    collectibles: [
      { type: '모코코 씨앗', point: 1200, maxPoint: 1400 },
      { type: '섬의 마음', point: 95, maxPoint: 100 },
      { type: '거인의 심장', point: 14, maxPoint: 15 },
    ],
  }
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

  // TODO: 실제 API 연동 시 교체
  const data = getMockData(name)

  return (
    <div className="pb-12">
      <CharacterHeader profile={data.profile} />
      <Separator />
      <div className="mt-6">
        <CharacterTabs data={data} />
      </div>
    </div>
  )
}
