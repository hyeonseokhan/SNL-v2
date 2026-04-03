'use client'

/**
 * @file 캐릭터 상세 메뉴 탭바
 *
 * 탭 항목: 능력치 / 시뮬레이터 / 스킬 / 보유 캐릭터
 * 활성 탭 상태는 부모(CharacterContent)에서 관리합니다.
 */

import type { TabId } from './character-content'

// ===================================================================
// 탭 정의
// ===================================================================

const TABS: { id: TabId; label: string }[] = [
  { id: 'stats',      label: '능력치' },
  { id: 'simulator',  label: '시뮬레이터' },
  { id: 'skills',     label: '스킬' },
  { id: 'characters', label: '보유 캐릭터' },
]

// ===================================================================
// 메인
// ===================================================================

interface CharacterMenuProps {
  activeTab: TabId
  onTabChange: (tab: TabId) => void
}

export function CharacterMenu({ activeTab, onTabChange }: CharacterMenuProps) {
  return (
    <div className="rounded-lg bg-card shadow-[1px_1px_10px_0_rgba(72,75,108,0.08)]">
      <nav className="flex overflow-x-auto">
        {TABS.map((tab) => {
          const isActive = activeTab === tab.id
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onTabChange(tab.id)}
              className={[
                'shrink-0 px-4 py-2 text-xs font-medium transition-colors',
                isActive
                  ? 'text-foreground'
                  : 'text-tx-caption hover:text-foreground/80',
              ].join(' ')}
            >
              <span className="relative inline-block px-[4px]">
                {tab.label}
                {isActive && (
                  <span className="absolute inset-x-0 -bottom-[8px] h-[2px] rounded-t-full bg-violet-500" />
                )}
              </span>
            </button>
          )
        })}
      </nav>
    </div>
  )
}
