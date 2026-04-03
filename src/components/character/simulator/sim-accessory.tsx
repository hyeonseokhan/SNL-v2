'use client'

/**
 * @file 시뮬레이터 — 악세서리 연마 수정 섹션
 *
 * 5종 악세서리(목걸이, 귀걸이x2, 반지x2) × 3개 연마 옵션을 수정합니다.
 * 연마 옵션은 상수 테이블(efficiency-tables.ts) 기반 dropdown입니다.
 */

import { useCharacterStore } from '@/stores/character-store'
import { SectionLabel } from '../section-label'
import { POLISH_OPTIONS, POLISH_TIER_LABELS } from '@/config/efficiency-tables'

/** 악세서리 슬롯 정의 */
const ACC_SLOTS = [
  { key: 'necklace' as const, label: '목걸이' },
  { key: 'earing1' as const, label: '귀걸이1' },
  { key: 'earing2' as const, label: '귀걸이2' },
  { key: 'ring1' as const, label: '반지1' },
  { key: 'ring2' as const, label: '반지2' },
]

/**
 * 연마 옵션 값을 표시 문자열로 변환
 *
 * @param opt - 연마 옵션 정의
 * @param tierIdx - 등급 인덱스 (0=유물하, 1=유물중, 2=유물상, 3=고대상)
 */
function formatPolishValue(opt: typeof POLISH_OPTIONS[number], tierIdx: number): string {
  const val = opt.tiers[tierIdx]
  if (opt.unit === '%') return `${opt.label} +${(val * 100).toFixed(2)}%`
  return `${opt.label} +${val}`
}

/**
 * dropdown option value를 인코딩 (옵션 인덱스 + 등급 인덱스)
 */
function encodeOptionValue(optIdx: number, tierIdx: number): string {
  return `${optIdx}:${tierIdx}`
}

/**
 * dropdown value에서 표시 문자열을 생성
 */
function decodeToLabel(value: string): string {
  if (!value) return ''
  const [optIdx, tierIdx] = value.split(':').map(Number)
  const opt = POLISH_OPTIONS[optIdx]
  if (!opt) return ''
  return formatPolishValue(opt, tierIdx)
}

/**
 * 악세서리 연마 수정 섹션
 */
export function SimAccessory() {
  const original = useCharacterStore((s) => s.original)
  const simulated = useCharacterStore((s) => s.simulated)
  const updateSimulated = useCharacterStore((s) => s.updateSimulated)

  if (!original) return null

  const armory = (simulated ?? original).armory

  /** 특정 악세서리의 연마 옵션 변경 */
  function updateOption(accKey: keyof typeof armory.accessory, optionIdx: number, value: string) {
    const acc = armory.accessory[accKey]
    if (!('option' in acc)) return

    const label = decodeToLabel(value)
    const newOptions = [...acc.option]
    newOptions[optionIdx] = label

    updateSimulated({
      armory: {
        ...armory,
        accessory: {
          ...armory.accessory,
          [accKey]: { ...acc, option: newOptions },
        },
      },
    })
  }

  return (
    <div className="rounded-lg bg-card px-5 py-4 shadow-[1px_1px_10px_0_rgba(72,75,108,0.08)]">
      <SectionLabel>악세서리 연마</SectionLabel>
      <div className="space-y-4 pl-3">
        {ACC_SLOTS.map(({ key, label }) => {
          const acc = armory.accessory[key]
          const options = 'option' in acc ? acc.option : []

          return (
            <div key={key}>
              <p className="mb-1.5 text-[12px] font-medium text-tx-body">{label}</p>
              <div className="space-y-1.5 pl-2">
                {[0, 1, 2].map((optIdx) => (
                  <div key={optIdx} className="flex items-center gap-2">
                    <span className="w-4 text-[11px] tabular-nums text-tx-caption">{optIdx + 1}</span>
                    <select
                      defaultValue=""
                      onChange={(e) => updateOption(key, optIdx, e.target.value)}
                      className="h-7 min-w-0 flex-1 rounded border border-black/10 bg-transparent px-1.5 text-[11px] text-tx-body dark:border-white/10"
                    >
                      <option value="">
                        {options[optIdx] || '선택'}
                      </option>
                      {POLISH_OPTIONS.map((opt, oi) =>
                        POLISH_TIER_LABELS.map((tierLabel, ti) => (
                          <option key={`${oi}-${ti}`} value={encodeOptionValue(oi, ti)}>
                            [{tierLabel}] {formatPolishValue(opt, ti)}
                          </option>
                        ))
                      )}
                    </select>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
