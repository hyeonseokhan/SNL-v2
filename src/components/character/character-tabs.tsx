'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { TabStats } from './tab-stats'
import { TabEquipment } from './tab-equipment'
import { TabGems } from './tab-gems'
import { TabEngraving } from './tab-engraving'
import { TabArkPassive } from './tab-ark-passive'
import { TabCards } from './tab-cards'
import { TabSkills } from './tab-skills'
import type { CharData } from '@/types/character'

interface CharacterTabsProps {
  data: CharData
}

const tabs = [
  { value: 'stats', label: '능력치' },
  { value: 'equipment', label: '장비' },
  { value: 'engraving', label: '각인' },
  { value: 'ark-passive', label: '아크패시브' },
  { value: 'gems', label: '보석' },
  { value: 'cards', label: '카드' },
  { value: 'skills', label: '스킬' },
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
          <TabStats data={data} />
        </TabsContent>
        <TabsContent value="equipment">
          <TabEquipment data={data} />
        </TabsContent>
        <TabsContent value="engraving">
          <TabEngraving data={data} />
        </TabsContent>
        <TabsContent value="ark-passive">
          <TabArkPassive data={data} />
        </TabsContent>
        <TabsContent value="gems">
          <TabGems data={data} />
        </TabsContent>
        <TabsContent value="cards">
          <TabCards data={data} />
        </TabsContent>
        <TabsContent value="skills">
          <TabSkills data={data} />
        </TabsContent>
      </div>
    </Tabs>
  )
}
