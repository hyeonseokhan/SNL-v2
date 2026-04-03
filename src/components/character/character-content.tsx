'use client'

/**
 * @file 우측 패널 — 메뉴 탭 + 탭별 콘텐츠 래퍼
 *
 * CharacterMenu의 활성 탭 상태를 관리하고
 * 각 탭에 맞는 콘텐츠 컴포넌트를 조건부 렌더링합니다.
 *
 * 데이터 소스: Zustand 스토어의 activeData를 우선 사용하고,
 * 스토어 초기화 전(SSR 직후)에는 SSR props를 폴백으로 사용합니다.
 * 시뮬레이터에서 updateSimulated()를 호출하면 자동으로 반영됩니다.
 */

import { useState } from 'react'
import { CharacterMenu } from './character-menu'
import { CharacterEquipment } from './character-equipment'
import { GemsSection } from './gems-section'
import { StatsEngravingSection } from './stats-engraving-section'
import { ArkPassiveSection } from './ark-passive-section'
import { ArkGridSection } from './ark-grid-section'
import { CardSection } from './card-section'
import { SimulatorTab } from './simulator/simulator-tab'
import { useCharacterStore } from '@/stores/character-store'
import type { CharData } from '@/types/character'

// ===================================================================
// 탭 타입
// ===================================================================

export type TabId = 'stats' | 'skills' | 'characters' | 'simulator'

// ===================================================================
// 메인
// ===================================================================

interface CharacterContentProps {
  /** SSR 폴백 데이터 (스토어 초기화 전 사용) */
  data: CharData
}

function TabPlaceholder({ label }: { label: string }) {
  return (
    <div className="flex h-40 items-center justify-center rounded-lg bg-card text-sm text-tx-caption">
      {label} — 준비 중
    </div>
  )
}

export function CharacterContent({ data: ssrData }: CharacterContentProps) {
  const [activeTab, setActiveTab] = useState<TabId>('stats')

  // 스토어의 activeData 우선, SSR props 폴백
  const storeData = useCharacterStore((s) => s.simulated ?? s.original)
  const data = storeData ?? ssrData

  return (
    <div className="space-y-2">
      <CharacterMenu activeTab={activeTab} onTabChange={setActiveTab} />

      {activeTab === 'stats' && (
        <>
          <CharacterEquipment armory={data.armory} />
          <GemsSection gems={data.gem} />
          <StatsEngravingSection stats={data.stats} engraving={data.engraving} />
          <ArkPassiveSection arkPassive={data.arkPassive} />
          <ArkGridSection arkGrid={data.arkGrid} />
          <CardSection card={data.card} />
        </>
      )}
      {activeTab === 'simulator'  && <SimulatorTab />}
      {activeTab === 'skills'     && <TabPlaceholder label="스킬" />}
      {activeTab === 'characters' && <TabPlaceholder label="보유 캐릭터" />}
    </div>
  )
}
