'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { TabStats } from './tab-stats'
import type { CharData } from '@/types/character'

interface CharacterTabsProps {
  data: CharData
}

const tabs = [
  { value: 'stats',      label: '능력치' },
  { value: 'avatar',     label: '아바타' },
  { value: 'skills',     label: '스킬' },
  { value: 'characters', label: '보유 캐릭터' },
] as const

function TabPlaceholder({ label }: { label: string }) {
  return (
    <div className="flex h-40 items-center justify-center text-sm text-tx-caption">
      {label} — 준비 중
    </div>
  )
}

export function CharacterTabs({ data }: CharacterTabsProps) {
  return (
    <Tabs defaultValue="stats" className="w-full">
      <TabsList
        variant="line"
        className="w-full justify-start overflow-x-auto border-b border-border/40"
      >
        {tabs.map((tab) => (
          <TabsTrigger
            key={tab.value}
            value={tab.value}
            className="px-4 py-2.5 text-sm"
          >
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>

      <div className="mt-5">
        <TabsContent value="stats">
          <TabStats data={data} />
        </TabsContent>
        <TabsContent value="avatar">
          <TabPlaceholder label="아바타" />
        </TabsContent>
        <TabsContent value="skills">
          <TabPlaceholder label="스킬" />
        </TabsContent>
        <TabsContent value="characters">
          <TabPlaceholder label="보유 캐릭터" />
        </TabsContent>
      </div>
    </Tabs>
  )
}
