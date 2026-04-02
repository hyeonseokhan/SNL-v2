'use client'

/**
 * @file 캐릭터 상세 페이지 탭 컨테이너
 *
 * 능력치 → 스킬 → 보유 캐릭터 → 시뮬레이터 → 효율 분석
 * 순서로 탭을 구성합니다.
 */

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { TabStats } from './tab-stats'
import type { CharData } from '@/types/character'

/**
 * @param data - 캐릭터 전체 데이터
 */
interface CharacterTabsProps {
  data: CharData
}

/**
 * 탭 목록 정의
 *
 * @property value - 탭 식별자 (URL 파라미터 등에서 사용)
 * @property label - 탭 표시 텍스트
 */
const tabs = [
  { value: 'stats',      label: '능력치' },
  { value: 'skills',     label: '스킬' },
  { value: 'characters', label: '보유 캐릭터' },
  { value: 'simulator',  label: '시뮬레이터' },
  { value: 'efficiency', label: '효율 분석' },
] as const

/**
 * 미구현 탭 플레이스홀더
 *
 * @param label - 탭 이름
 */
function TabPlaceholder({ label }: { label: string }) {
  return (
    <div className="flex h-40 items-center justify-center text-sm text-tx-caption">
      {label} — 준비 중
    </div>
  )
}

/**
 * 캐릭터 상세 탭 컨테이너
 *
 * 기본값은 "능력치" 탭. 각 탭은 독립된 컴포넌트로 렌더링됩니다.
 *
 * @example
 * <CharacterTabs data={charData} />
 */
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
        <TabsContent value="skills">
          <TabPlaceholder label="스킬" />
        </TabsContent>
        <TabsContent value="characters">
          <TabPlaceholder label="보유 캐릭터" />
        </TabsContent>
        <TabsContent value="simulator">
          <TabPlaceholder label="시뮬레이터" />
        </TabsContent>
        <TabsContent value="efficiency">
          <TabPlaceholder label="효율 분석" />
        </TabsContent>
      </div>
    </Tabs>
  )
}
