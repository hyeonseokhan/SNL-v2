'use client'

/**
 * @file 시뮬레이터 — 전투 특성 수정 섹션
 *
 * 치명/특화/신속/제압/인내/숙련 6대 스탯을 number input으로 수정합니다.
 * 효율 계산에 직접 사용되는 치명/신속/특화가 핵심입니다.
 */

import { useCharacterStore } from '@/stores/character-store'
import { SectionLabel } from '../section-label'
import type { CharStats } from '@/types/character'

/** 스탯 필드 정의 */
const STAT_FIELDS: { key: keyof CharStats; label: string }[] = [
  { key: 'critical', label: '치명' },
  { key: 'special', label: '특화' },
  { key: 'haste', label: '신속' },
  { key: 'suppress', label: '제압' },
  { key: 'patience', label: '인내' },
  { key: 'expert', label: '숙련' },
]

/**
 * 전투 특성 수정 섹션
 */
export function SimCombatStats() {
  const original = useCharacterStore((s) => s.original)
  const simulated = useCharacterStore((s) => s.simulated)
  const updateSimulated = useCharacterStore((s) => s.updateSimulated)

  if (!original) return null

  const stats = (simulated ?? original).stats

  function updateStat(key: keyof CharStats, value: number) {
    updateSimulated({ stats: { ...stats, [key]: value } })
  }

  return (
    <div className="rounded-lg bg-card px-5 py-4 shadow-[1px_1px_10px_0_rgba(72,75,108,0.08)]">
      <SectionLabel>전투 특성</SectionLabel>
      <div className="grid grid-cols-3 gap-3 pl-3">
        {STAT_FIELDS.map(({ key, label }) => {
          const value = stats[key]
          const isMain = value > 100
          return (
            <div key={key} className="flex items-center gap-2">
              <span className={`w-8 text-[11px] ${isMain ? 'font-medium text-tx-body' : 'text-tx-caption'}`}>
                {label}
              </span>
              <input
                type="number"
                min={0}
                max={3000}
                value={value}
                onChange={(e) => updateStat(key, Number(e.target.value))}
                className={`h-7 w-20 rounded border border-black/10 bg-transparent px-2 text-right text-[12px] tabular-nums dark:border-white/10 ${isMain ? 'font-bold text-tx-body' : 'text-tx-caption'}`}
              />
            </div>
          )
        })}
      </div>
    </div>
  )
}
