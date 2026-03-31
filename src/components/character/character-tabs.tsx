'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { TabPlaceholder } from './tab-placeholder'
import type { CharacterData } from '@/types/character'

interface CharacterTabsProps {
  data: CharacterData
}

const tabs = [
  { value: 'stats', label: '능력치' },
  { value: 'equipment', label: '장비' },
  { value: 'skills', label: '스킬' },
  { value: 'gems', label: '보석' },
  { value: 'cards', label: '카드' },
  { value: 'collectibles', label: '수집품' },
] as const

export function CharacterTabs({ data }: CharacterTabsProps) {
  return (
    <Tabs defaultValue="stats" className="w-full">
      {/* --- 탭 네비게이션 --- */}
      <TabsList className="w-full justify-start overflow-x-auto">
        {tabs.map((tab) => (
          <TabsTrigger key={tab.value} value={tab.value} className="text-sm">
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>

      {/* --- 탭 콘텐츠 --- */}
      <div className="mt-4">
        <TabsContent value="stats">
          <TabPlaceholder
            title="능력치"
            description={`치명 ${data.stats.critical} / 특화 ${data.stats.specialization} / 신속 ${data.stats.swiftness}`}
          />
        </TabsContent>

        <TabsContent value="equipment">
          <TabPlaceholder
            title="장비"
            description={`장착 장비 ${data.equipment.length}개`}
          />
        </TabsContent>

        <TabsContent value="skills">
          <TabPlaceholder
            title="스킬"
            description={`등록된 스킬 ${data.skills.length}개`}
          />
        </TabsContent>

        <TabsContent value="gems">
          <TabPlaceholder
            title="보석"
            description={`장착 보석 ${data.gems.length}개`}
          />
        </TabsContent>

        <TabsContent value="cards">
          <TabPlaceholder
            title="카드"
            description={`카드 세트 ${data.cards.length}개`}
          />
        </TabsContent>

        <TabsContent value="collectibles">
          <TabPlaceholder
            title="수집품"
            description={`수집 항목 ${data.collectibles.length}개`}
          />
        </TabsContent>
      </div>
    </Tabs>
  )
}
