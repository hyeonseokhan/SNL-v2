'use client'

/**
 * @file 시뮬레이터 — 도핑/버프 토글 섹션
 *
 * 만찬, 전투축복 등 외부 버프를 토글합니다.
 * 이 값들은 CharData에 포함되지 않는 시뮬레이터 전용 입력이므로
 * 별도의 로컬 상태로 관리합니다. (추후 스토어 확장 가능)
 */

import { useState } from 'react'
import { SectionLabel } from '../section-label'

/** 버프 정의 */
const BUFF_DEFS = [
  { id: 'feast', label: '만찬', desc: '공이속 +5%' },
  { id: 'blessing3', label: '전투 축복 III', desc: '공이속 +9%' },
] as const

/**
 * 버프 토글 상태 (시뮬레이터 전용)
 *
 * 추후 스토어에 통합하여 효율 계산 엔진에서 참조할 수 있습니다.
 */
export function SimBuffs() {
  const [active, setActive] = useState<Record<string, boolean>>({})

  function toggle(id: string) {
    setActive((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  return (
    <div className="rounded-lg bg-card px-5 py-4 shadow-[1px_1px_10px_0_rgba(72,75,108,0.08)]">
      <SectionLabel>도핑 / 버프</SectionLabel>
      <div className="flex flex-wrap gap-2 pl-3">
        {BUFF_DEFS.map(({ id, label, desc }) => {
          const isActive = active[id] ?? false
          return (
            <button
              key={id}
              onClick={() => toggle(id)}
              className={`rounded-md border px-3 py-1.5 text-[11px] font-medium transition-colors ${
                isActive
                  ? 'border-primary/50 bg-primary/15 text-primary'
                  : 'border-black/10 text-tx-caption hover:border-black/20 dark:border-white/10 dark:hover:border-white/20'
              }`}
            >
              {label}
              <span className="ml-1 text-[10px] opacity-60">{desc}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
