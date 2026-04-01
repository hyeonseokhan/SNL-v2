'use client'

/**
 * @file 우측 패널 — 메뉴 탭 + 탭별 콘텐츠 래퍼
 *
 * CharacterMenu의 활성 탭 상태를 관리하고
 * 각 탭에 맞는 콘텐츠 컴포넌트를 조건부 렌더링합니다.
 */

import { useState } from 'react'
import { CharacterMenu } from './character-menu'
import { CharacterEquipment } from './character-equipment'
import type { CharData } from '@/types/character'

// ===================================================================
// 탭 타입
// ===================================================================

export type TabId = 'stats' | 'avatar' | 'skills' | 'characters'

// ===================================================================
// 메인
// ===================================================================

interface CharacterContentProps {
  data: CharData
}

function TabPlaceholder({ label }: { label: string }) {
  return (
    <div className="flex h-40 items-center justify-center rounded-lg bg-card text-sm text-tx-caption">
      {label} — 준비 중
    </div>
  )
}

export function CharacterContent({ data }: CharacterContentProps) {
  const [activeTab, setActiveTab] = useState<TabId>('stats')

  return (
    <div className="space-y-2">
      <CharacterMenu activeTab={activeTab} onTabChange={setActiveTab} />

      {activeTab === 'stats'      && <CharacterEquipment armory={data.armory} />}
      {activeTab === 'avatar'     && <TabPlaceholder label="아바타" />}
      {activeTab === 'skills'     && <TabPlaceholder label="스킬" />}
      {activeTab === 'characters' && <TabPlaceholder label="보유 캐릭터" />}
    </div>
  )
}
