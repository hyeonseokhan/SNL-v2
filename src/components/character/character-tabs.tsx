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
      <TabsList variant="line" className="w-full justify-start overflow-x-auto border-b border-border/50">
        {tabs.map((tab) => (
          <TabsTrigger key={tab.value} value={tab.value} className="text-sm px-4 py-2.5">
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>

      <div className="mt-5">
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
