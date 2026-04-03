'use client'

/**
 * @file 시뮬레이터 — 어빌리티 스톤 수정 섹션
 *
 * 스톤 각인 2개(이름 + 레벨) + 감소 각인 1개를 수정합니다.
 */

import { useCharacterStore } from '@/stores/character-store'
import { SectionLabel } from '../section-label'
import { COMBAT_ENGRAVING_NAMES, CLASS_ENGRAVING_NAMES } from '@/config/engraving-icons'
import type { StoneEngraving } from '@/types/character'

/** 스톤 각인 레벨 옵션 */
const STONE_LEVELS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10] as const

/** 감소 각인 목록 */
const NEGATIVE_ENGRAVINGS = ['공격력 감소', '방어력 감소', '공격속도 감소', '이동속도 감소']

/** 긍정 각인 목록 (감소 제외) */
const POSITIVE_ENGRAVINGS = [
  ...COMBAT_ENGRAVING_NAMES.filter(n => !n.includes('감소')),
  ...CLASS_ENGRAVING_NAMES,
]

/**
 * 어빌리티 스톤 수정 섹션
 */
export function SimStone() {
  const original = useCharacterStore((s) => s.original)
  const simulated = useCharacterStore((s) => s.simulated)
  const updateSimulated = useCharacterStore((s) => s.updateSimulated)

  if (!original) return null

  const armory = (simulated ?? original).armory
  const stone = armory.accessory.stone
  const engravings = stone.engravings

  // 3슬롯 보장 (긍정2 + 감소1)
  const slots: StoneEngraving[] = Array.from({ length: 3 }, (_, i) =>
    engravings[i] ?? { name: '', level: 0, isNegative: i === 2 }
  )

  /** 스톤 각인 슬롯 변경 */
  function updateStoneSlot(index: number, patch: Partial<StoneEngraving>) {
    const updated = slots.map((slot, i) =>
      i === index ? { ...slot, ...patch } : slot
    )
    updateSimulated({
      armory: {
        ...armory,
        accessory: {
          ...armory.accessory,
          stone: { ...stone, engravings: updated },
        },
      },
    })
  }

  return (
    <div className="rounded-lg bg-card px-5 py-4 shadow-[1px_1px_10px_0_rgba(72,75,108,0.08)]">
      <SectionLabel>어빌리티 스톤</SectionLabel>
      <div className="space-y-2 pl-3">
        {slots.map((slot, i) => {
          const isNeg = slot.isNegative || i === 2
          const nameList = isNeg ? NEGATIVE_ENGRAVINGS : POSITIVE_ENGRAVINGS
          return (
            <div key={i} className="flex items-center gap-2">
              <span className={`w-12 text-[11px] font-medium ${isNeg ? 'text-red-400' : 'text-tx-label'}`}>
                {isNeg ? '감소' : `각인 ${i + 1}`}
              </span>

              {/* 각인 종류 */}
              <select
                value={slot.name}
                onChange={(e) => updateStoneSlot(i, { name: e.target.value })}
                className="h-7 min-w-0 flex-1 rounded border border-black/10 bg-transparent px-1.5 text-[11px] text-tx-body dark:border-white/10"
              >
                <option value="">없음</option>
                {nameList.map((name) => (
                  <option key={name} value={name}>{name}</option>
                ))}
              </select>

              {/* 레벨 */}
              <select
                value={slot.level}
                onChange={(e) => updateStoneSlot(i, { level: Number(e.target.value) })}
                className="h-7 rounded border border-black/10 bg-transparent px-1.5 text-[11px] text-tx-body dark:border-white/10"
              >
                {STONE_LEVELS.map((lv) => (
                  <option key={lv} value={lv}>Lv.{lv}</option>
                ))}
              </select>
            </div>
          )
        })}
      </div>
    </div>
  )
}
