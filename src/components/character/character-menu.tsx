'use client'

/**
 * @file 캐릭터 상세 메뉴 탭바
 *
 * 탭 항목: 능력치 / 아바타 / 스킬 / 보유 캐릭터
 * 트리거 로직은 별도 연결 예정
 */

import { useState } from 'react'

// ===================================================================
// 탭 정의
// ===================================================================

const TABS = [
  { id: 'stats',      label: '능력치' },
  { id: 'avatar',     label: '아바타' },
  { id: 'skills',     label: '스킬' },
  { id: 'characters', label: '보유 캐릭터' },
] as const

type TabId = (typeof TABS)[number]['id']

// ===================================================================
// 메인
// ===================================================================

export function CharacterMenu() {
  const [active, setActive] = useState<TabId>('stats')

  return (
    <div className="rounded-lg bg-card shadow-[1px_1px_10px_0_rgba(72,75,108,0.08)]">
      <nav className="flex overflow-x-auto">
        {TABS.map((tab, i) => {
          const isActive = active === tab.id
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActive(tab.id)}
              className={[
                'shrink-0 px-4 py-2 text-xs font-medium transition-colors',
                isActive
                  ? 'text-foreground'
                  : 'text-muted-foreground hover:text-foreground/80',
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
