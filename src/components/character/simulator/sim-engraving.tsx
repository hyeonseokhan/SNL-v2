'use client'

/**
 * @file 시뮬레이터 — 각인 수정 섹션
 *
 * 5슬롯 × (등급 + 레벨 + 종류) dropdown으로 각인을 변경합니다.
 * 변경 시 스토어의 updateSimulated()를 호출하여 즉시 반영됩니다.
 */

import { useCharacterStore } from '@/stores/character-store'
import { SectionLabel } from '../section-label'
import { COMBAT_ENGRAVING_NAMES, CLASS_ENGRAVING_NAMES } from '@/config/engraving-icons'
import type { EngravingData } from '@/types/character'

/** 등급 옵션 */
const GRADES = ['유물', '전설'] as const

/** 레벨 옵션 */
const LEVELS = [0, 1, 2, 3, 4] as const

/** 전체 각인 이름 목록 (감소 각인 제외) */
const ALL_ENGRAVINGS = [
  ...COMBAT_ENGRAVING_NAMES.filter(n => !n.includes('감소')),
  ...CLASS_ENGRAVING_NAMES,
]

/**
 * 각인 수정 섹션
 *
 * 현재 캐릭터의 각인을 5슬롯 dropdown으로 수정합니다.
 * 각 슬롯: 등급(유물/전설) + 레벨(x0~x4) + 각인 종류(전체 목록)
 */
export function SimEngraving() {
  const original = useCharacterStore((s) => s.original)
  const simulated = useCharacterStore((s) => s.simulated)
  const updateSimulated = useCharacterStore((s) => s.updateSimulated)

  if (!original) return null

  const currentEngravings = (simulated ?? original).engraving
  // 5슬롯 보장 (부족하면 빈 슬롯 추가)
  const slots: EngravingData[] = Array.from({ length: 5 }, (_, i) =>
    currentEngravings[i] ?? { name: '', level: 0, grade: '유물', stoneLevel: 0, description: '', icon: '' }
  )

  /** 특정 슬롯의 필드를 변경하고 스토어에 반영 */
  function updateSlot(index: number, patch: Partial<EngravingData>) {
    const updated = slots.map((slot, i) =>
      i === index ? { ...slot, ...patch } : slot
    ).filter(s => s.name) // 이름 없는 슬롯 제거
    updateSimulated({ engraving: updated })
  }

  return (
    <div className="rounded-lg bg-card px-5 py-4 shadow-[1px_1px_10px_0_rgba(72,75,108,0.08)]">
      <SectionLabel>각인</SectionLabel>
      <div className="space-y-2 pl-3">
        {slots.map((slot, i) => (
          <div key={i} className="flex items-center gap-2">
            {/* 슬롯 번호 */}
            <span className="w-4 text-[11px] tabular-nums text-tx-caption">{i + 1}</span>

            {/* 등급 */}
            <select
              value={slot.grade}
              onChange={(e) => updateSlot(i, { grade: e.target.value })}
              className="h-7 rounded border border-black/10 bg-transparent px-1.5 text-[11px] text-tx-body dark:border-white/10"
            >
              {GRADES.map((g) => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>

            {/* 레벨 */}
            <select
              value={slot.level}
              onChange={(e) => updateSlot(i, { level: Number(e.target.value) })}
              className="h-7 rounded border border-black/10 bg-transparent px-1.5 text-[11px] text-tx-body dark:border-white/10"
            >
              {LEVELS.map((lv) => (
                <option key={lv} value={lv}>x{lv}</option>
              ))}
            </select>

            {/* 각인 종류 */}
            <select
              value={slot.name}
              onChange={(e) => updateSlot(i, { name: e.target.value })}
              className="h-7 min-w-0 flex-1 rounded border border-black/10 bg-transparent px-1.5 text-[11px] text-tx-body dark:border-white/10"
            >
              <option value="">없음</option>
              <optgroup label="일반 각인">
                {COMBAT_ENGRAVING_NAMES.filter(n => !n.includes('감소')).map((name) => (
                  <option key={name} value={name}>{name}</option>
                ))}
              </optgroup>
              <optgroup label="직업 각인">
                {CLASS_ENGRAVING_NAMES.map((name) => (
                  <option key={name} value={name}>{name}</option>
                ))}
              </optgroup>
            </select>
          </div>
        ))}
      </div>
    </div>
  )
}
