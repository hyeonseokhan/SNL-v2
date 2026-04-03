'use client'

/**
 * @file 시뮬레이터 — 팔찌 수정 섹션
 *
 * 팔찌 스탯 4종 (종류 + 수치) + 특수 효과 4종을 수정합니다.
 * API 데이터는 초기값으로, 시뮬레이터에서 자유롭게 변경 가능합니다.
 */

import { useCharacterStore } from '@/stores/character-store'
import { SectionLabel } from '../section-label'
import {
  BRACELET_STAT_TYPES,
  BRACELET_EFFECTS,
  BRACELET_TIER_LABELS,
} from '@/config/efficiency-tables'

/**
 * 팔찌 수정 섹션
 *
 * 스탯 4종: 종류(dropdown) + 수치(number input)
 * 효과 4종: 효과(dropdown) — 등급별 수치 포함
 */
export function SimBracelet() {
  const original = useCharacterStore((s) => s.original)
  const simulated = useCharacterStore((s) => s.simulated)
  const updateSimulated = useCharacterStore((s) => s.updateSimulated)

  if (!original) return null

  const armory = (simulated ?? original).armory
  const bangle = armory.accessory.bangle

  /** 팔찌 옵션 텍스트 업데이트 */
  function updateBangleOption(index: number, value: string) {
    const newOptions = [...bangle.option]
    newOptions[index] = value
    updateSimulated({
      armory: {
        ...armory,
        accessory: {
          ...armory.accessory,
          bangle: { ...bangle, option: newOptions },
        },
      },
    })
  }

  // 현재 옵션 (최대 8개: 스탯 4 + 효과 4)
  const options = bangle.option

  return (
    <div className="rounded-lg bg-card px-5 py-4 shadow-[1px_1px_10px_0_rgba(72,75,108,0.08)]">
      <SectionLabel>팔찌</SectionLabel>
      <div className="space-y-3 pl-3">
        {/* 스탯 4종 */}
        <div>
          <p className="mb-1.5 text-[11px] font-medium text-tx-label">스탯</p>
          <div className="space-y-1.5 pl-2">
            {[0, 1, 2, 3].map((idx) => (
              <div key={idx} className="flex items-center gap-2">
                <span className="w-3 text-[11px] tabular-nums text-tx-caption">{idx + 1}</span>
                <select
                  defaultValue=""
                  onChange={(e) => updateBangleOption(idx, e.target.value)}
                  className="h-7 w-20 rounded border border-black/10 bg-transparent px-1.5 text-[11px] text-tx-body dark:border-white/10"
                >
                  <option value="">{options[idx] ? options[idx].split(' ')[0] : '없음'}</option>
                  {BRACELET_STAT_TYPES.map((stat) => (
                    <option key={stat} value={stat}>{stat}</option>
                  ))}
                </select>
                <input
                  type="number"
                  min={0}
                  max={500}
                  placeholder="수치"
                  defaultValue={options[idx]?.match(/[+-]?\d+/)?.[0] ?? ''}
                  className="h-7 w-16 rounded border border-black/10 bg-transparent px-1.5 text-right text-[11px] tabular-nums text-tx-body dark:border-white/10"
                />
              </div>
            ))}
          </div>
        </div>

        {/* 특수 효과 4종 */}
        <div>
          <p className="mb-1.5 text-[11px] font-medium text-tx-label">특수 효과</p>
          <div className="space-y-1.5 pl-2">
            {[0, 1, 2, 3].map((idx) => {
              const optIdx = idx + 4
              return (
                <div key={idx} className="flex items-center gap-2">
                  <span className="w-3 text-[11px] tabular-nums text-tx-caption">{idx + 1}</span>
                  <select
                    defaultValue=""
                    onChange={(e) => updateBangleOption(optIdx, e.target.value)}
                    className="h-7 min-w-0 flex-1 rounded border border-black/10 bg-transparent px-1.5 text-[11px] text-tx-body dark:border-white/10"
                  >
                    <option value="">{options[optIdx] || '없음'}</option>
                    {BRACELET_EFFECTS.map((eff, ei) =>
                      BRACELET_TIER_LABELS.map((tierLabel, ti) => (
                        <option key={`${ei}-${ti}`} value={`${eff.label} ${eff.tiers[ti]}`}>
                          [{tierLabel}] {eff.label} {eff.tiers[ti]}
                        </option>
                      ))
                    )}
                  </select>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
